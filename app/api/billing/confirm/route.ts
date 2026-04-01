import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export async function POST(request: Request) {
  try {
    const { clientId, subscriptionId } = await request.json();
    
    if (!clientId || !subscriptionId) {
      return NextResponse.json({ success: false, error: 'Missing payment data' }, { status: 400 });
    }

    // Find the record in Airtable by Client ID
    const record = await airtableCRM.getClient(clientId);
    
    if (!record) {
      return NextResponse.json({ success: false, error: 'Client record not found' }, { status: 404 });
    }

    // Update the record with PAID status and reference
    await airtableCRM.updateFields(record.id, {
      'Payment Status': 'PAID',
      'Payment Reference': subscriptionId,
      'Payment Completed': new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment confirmed and recorded in CRM.' 
    });
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
