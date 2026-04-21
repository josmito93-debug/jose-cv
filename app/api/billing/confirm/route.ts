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
    let status = 'PAID';
    if (method === 'PAGO_MOVIL') status = 'PENDING_VERIFICATION';

    await airtableCRM.updateFields(record.id, {
      'Payment Status': status,
      'Payment Method': method,
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
