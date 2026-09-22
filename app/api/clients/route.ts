import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';
import { syncStripeAndAirtable } from '@/lib/integrations/stripe-sync';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function cleanProjectNameString(name: string): string {
  if (!name) return '';
  if (!name.includes('-') && !name.includes('_') && /[A-Z]/.test(name)) {
    return name;
  }
  return name
    .replace(/-main$/, '')
    .replace(/-web-premium$/, '')
    .replace(/-web$/, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export async function GET() {
  try {
    // 1. Run live background reconciliation with Stripe to ensure all recent payments are reflected
    try {
      await syncStripeAndAirtable();
    } catch (syncErr) {
      console.error('Non-blocking Stripe sync error in GET /api/clients:', syncErr);
    }

    const clientsRaw = await airtableCRM.getAllClients();
    
    let projectMetadata: Record<string, string> = {};
    try {
      const metadataPath = path.join(process.cwd(), 'lib/data/project-metadata.json');
      if (fs.existsSync(metadataPath)) {
        const fileContent = fs.readFileSync(metadataPath, 'utf-8');
        projectMetadata = JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Failed to load project metadata in clients route:', e);
    }

    // Map Airtable records to the expected ClientData structure
    const clients = clientsRaw.map(record => {
      const rawBusiness = record.fields['Business Name'] || 'Sin Negocio';
      const resolvedBusiness = projectMetadata[rawBusiness] || cleanProjectNameString(rawBusiness);

      return {
        id: record.id,
        name: record.fields['Contact Name'] || 'Sin Nombre',
        business: resolvedBusiness,
        paymentStatus: record.fields['Payment Status'] || 'UNPAID',
        monthlyPrice: Number(record.fields['Payment Amount'] || 30),
        info: {
          clientId: record.fields['Client ID'],
          businessName: resolvedBusiness,
          contactName: record.fields['Contact Name'],
          email: record.fields['Email'],
          phone: record.fields['Phone'],
        }
      };
    });

    return NextResponse.json({ success: true, clients });
  } catch (error) {
    console.error('Error listing clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: any) {
  try {
    const data = await request.json();
    
    const contact = data.contact || '';
    const isEmail = contact.includes('@');
    const isPhone = !isEmail && /[\d+\-()]{7,}/.test(contact);

    const clientData: any = {
      info: {
        clientId: `CLNT-${Date.now()}`,
        businessName: data.businessName || 'Nuevo Negocio',
        contactName: data.contactName || data.name || 'Sin Nombre',
        email: data.email || (isEmail ? contact : ''),
        phone: data.phone || (isPhone ? contact : ''),
      },
      payment: {
        status: 'UNPAID',
        method: '',
        reference: '',
        nextDueDate: null
      }
    };

    const recordId = await airtableCRM.syncClient(clientData);
    
    return NextResponse.json({ 
      success: true, 
      recordId,
      message: 'Client registered successfully' 
    });
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
