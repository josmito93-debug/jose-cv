import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { clientId } = await params;
    
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    const record = await airtableCRM.getClient(clientId);
    
    if (!record) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const client = {
      id: record.id,
      name: record.fields['Contact Name'] || 'Sin Nombre',
      business: record.fields['Business Name'] || 'Sin Negocio',
      paymentStatus: record.fields['Payment Status'] || 'UNPAID',
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
