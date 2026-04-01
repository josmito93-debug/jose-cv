import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clientsRaw = await airtableCRM.getAllClients();
    
    // Map Airtable records to the expected ClientData structure
    // This is a simplification, ideally airtableCRM would return the correct type
    const clients = clientsRaw.map(record => ({
      id: record.id,
      name: record.fields['Contact Name'] || 'Sin Nombre',
      business: record.fields['Business Name'] || 'Sin Negocio',
      paymentStatus: record.fields['Payment Status'] || 'UNPAID',
      info: {
        clientId: record.fields['Client ID'],
        businessName: record.fields['Business Name'],
        contactName: record.fields['Contact Name'],
        email: record.fields['Email'],
        phone: record.fields['Phone'],
      }
    }));

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

    // Create a robust ClientData structure for Airtable
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
