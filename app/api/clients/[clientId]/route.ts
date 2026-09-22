import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';
import { syncStripeAndAirtable } from '@/lib/integrations/stripe-sync';
import proposalsData from '@/data/proposals.json';

export const dynamic = 'force-dynamic';

function cleanProjectName(name: string): string {
  if (!name) return 'Cliente Web';
  return name
    .replace(/-main$/, '')
    .replace(/-web$/, '')
    .replace(/-site$/, '')
    .replace(/-app$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    if (clientId === 'sync-stripe') {
      const syncResult = await syncStripeAndAirtable(true);
      return NextResponse.json({ success: true, sync: syncResult });
    }

    const cleanId = clientId.toLowerCase().trim();

    // 1. Direct Quick Lookup in Airtable
    let record: any = null;
    try {
      record = await airtableCRM.getClient(clientId);
      if (!record && cleanId !== clientId) {
        record = await airtableCRM.getClient(cleanId);
      }
      if (!record) {
        record = await airtableCRM.getClientByBusinessName(cleanId);
      }
    } catch (aErr) {
      console.error('Airtable lookup error:', aErr);
    }

    // 2. Fallback: Lookup in Vercel API
    if (!record) {
      try {
        const vercelToken = process.env.VERCEL_TOKEN;
        if (vercelToken) {
          const vResponse = await fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(clientId)}`, {
            headers: { Authorization: `Bearer ${vercelToken}` },
          });

          if (vResponse.ok) {
            const vData = await vResponse.json();
            const projectName = vData.name || clientId;

            try {
              record = await airtableCRM.getClientByBusinessName(projectName);
            } catch (e) {}

            if (!record) {
              const formattedName = cleanProjectName(projectName);
              return NextResponse.json({
                success: true,
                client: {
                  id: vData.name || clientId,
                  name: formattedName,
                  business: formattedName,
                  rawProjectName: vData.name,
                  paymentStatus: 'UNPAID',
                  isVirtual: true,
                  monthlyPrice: 30,
                  billingInterval: 'month',
                  vercelId: vData.id
                }
              });
            }
          }
        }
      } catch (vError) {
        console.error('Vercel auto-lookup failed:', vError);
      }
    }

    // 3. Fallback: Proposals Database Check
    const proposal = (proposalsData as any)[cleanId];
    if (!record && proposal) {
      return NextResponse.json({
        success: true,
        client: {
          id: clientId,
          name: proposal.client || cleanProjectName(clientId),
          business: proposal.client || cleanProjectName(clientId),
          paymentStatus: 'UNPAID',
          monthlyPrice: 30,
          billingInterval: 'month',
          isProposal: true
        }
      });
    }

    // 4. Fallback for Innovatech
    const isInnovatech = ['innovatech', 'innovatech-bio', 'innovatechbio', 'life-style-store-main', 'prj_eX4sHkbTDeexe7V4CtIxHHdOhHSP'].includes(cleanId);
    if (isInnovatech && !record) {
      try {
        record = await airtableCRM.getClientByBusinessName('Innovatech Bio');
      } catch (e) {}
    }

    // 5. Final Graceful Fallback
    if (!record && !isInnovatech) {
      const fallbackName = cleanProjectName(clientId);
      return NextResponse.json({
        success: true,
        client: {
          id: clientId,
          name: fallbackName,
          business: fallbackName,
          paymentStatus: 'UNPAID',
          monthlyPrice: 30,
          billingInterval: 'month',
          isVirtual: true
        }
      });
    }

    const client = {
      id: record?.fields['Client ID'] || clientId,
      name: record?.fields['Contact Name'] || (isInnovatech ? 'Innovatech Bio' : 'Sin Nombre'),
      business: isInnovatech ? 'Innovatech Bio' : (record?.fields['Business Name'] || 'Sin Negocio'),
      paymentStatus: record?.fields['Payment Status'] || 'UNPAID',
      monthlyPrice: isInnovatech ? 8 : (clientId === 'prj_dA0XHibYMkPnamABbAkEwn0HDQKZ' ? 12 : Number(record?.fields['Payment Amount'] || record?.fields['Monthly Price'] || record?.fields['Price'] || 30)),
      billingInterval: clientId === '58films' ? 'year' : 'month'
    };

    return NextResponse.json({ success: true, client });
  } catch (error: any) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
