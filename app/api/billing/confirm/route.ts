import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export async function POST(request: Request) {
  try {
    const { clientId, subscriptionId, method } = await request.json();
    
    if (!clientId || !subscriptionId) {
      return NextResponse.json({ success: false, error: 'Missing payment data' }, { status: 400 });
    }

    // Find the record in Airtable by Client ID
    const record = await airtableCRM.getClient(clientId);
    
    if (!record) {
      return NextResponse.json({ success: false, error: 'Client record not found' }, { status: 404 });
    }

    // Calculate next due date (1 month from now)
    const nextDueDate = new Date();
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    // Update the record
    await airtableCRM.updateFields(record.id, {
      'Payment Status': method === 'PAGO_MOVIL' ? 'PENDING_VERIFICATION' : 'PAID',
      'Payment Method': method === 'PAGO_MOVIL' ? 'PAGO_MOVIL' : 'PAYPAL',
      'Payment Reference': subscriptionId,
      'Next Due Date': nextDueDate.toISOString().split('T')[0]
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
