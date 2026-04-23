import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export async function GET() {
  try {
    const clients = await airtableCRM.getAllClients();
    
    // Filtrar o procesar si es necesario
    const formattedClients = clients.map(c => ({
      id: c.id,
      businessName: c.fields['Business Name'],
      contactName: c.fields['Contact Name'],
      email: c.fields['Email'],
      phone: c.fields['Phone'],
      status: c.fields['Payment Status'] || 'PENDING',
      date: c.fields['Created At'] || new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, data: formattedClients });
  } catch (error: any) {
    console.error('Error fetching Attom clients:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
