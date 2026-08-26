import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    // Attempt 1: Standard Airtable Lookup
    let record = await airtableCRM.getClient(clientId);
    
    // Attempt 2: If clientId looks like a Vercel project ID, fetch from Vercel first
    if (!record && clientId.startsWith('prj_')) {
      console.log('Detected Vercel Project ID, fetching from Vercel:', clientId);
      try {
        const vResponse = await fetch(`https://api.vercel.com/v9/projects/${clientId}`, {
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          },
        });
        
        if (vResponse.ok) {
          const vData = await vResponse.json();
          const projectName = vData.name;
          console.log('Vercel project found:', projectName);
          
          // Try to find client by business name (which usually matches Vercel project name)
          record = await airtableCRM.getClientByBusinessName(projectName);
          
          if (!record) {
             // If still not found, we could potentially create it, but for now let's just return a virtual client
             // OR rely on the manual "Invoice" generation to have created it.
             // For the payment page to work, we need a business name.
             return NextResponse.json({ 
               success: true, 
               client: {
                 id: clientId,
                 name: 'Cliente Vercel',
                 business: projectName,
                 paymentStatus: 'UNPAID',
                 isVirtual: true,
                 monthlyPrice: clientId === 'prj_dA0XHibYMkPnamABbAkEwn0HDQKZ' ? 12 : 30
               } 
             });
          }
        }
      } catch (vError) {
        console.error('Vercel lookup failed:', vError);
      }
    }

    // Fallback for Innovatech
    const isInnovatech = ['innovatech', 'innovatech-bio', 'innovatechbio', 'life-style-store-main', 'prj_eX4sHkbTDeexe7V4CtIxHHdOhHSP'].includes(clientId.toLowerCase());
    if (isInnovatech && !record) {
      record = await airtableCRM.getClientByBusinessName('Innovatech Bio');
    }

    if (!record && !isInnovatech) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const client = {
      id: record?.fields['Client ID'] || clientId,
      name: record?.fields['Contact Name'] || (isInnovatech ? 'Innovatech Bio' : 'Sin Nombre'),
      business: isInnovatech ? 'Innovatech Bio' : (record?.fields['Business Name'] || 'Sin Negocio'),
      paymentStatus: record?.fields['Payment Status'] || 'UNPAID',
      monthlyPrice: isInnovatech ? 8 : (clientId === 'prj_dA0XHibYMkPnamABbAkEwn0HDQKZ' ? 12 : (record?.fields['Payment Amount'] || record?.fields['Monthly Price'] || record?.fields['Price'] || 30)),
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
