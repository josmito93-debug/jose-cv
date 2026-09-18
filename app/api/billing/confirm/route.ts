import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export async function POST(request: Request) {
  try {
    const { clientId, subscriptionId, method, businessName: providedBusinessName, amount: providedAmount } = await request.json();
    
    if (!clientId || !subscriptionId) {
      return NextResponse.json({ success: false, error: 'Missing payment data' }, { status: 400 });
    }

    // Calculate next due date (1 month from now)
    const nextDueDate = new Date();
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    let status = 'PAID';
    if (method === 'PAGO_MOVIL') status = 'PENDING_VERIFICATION';

    const payAmount = Number(providedAmount || 30);

    // Find the record in Airtable by Client ID
    let record: any = null;
    try {
      record = await airtableCRM.getClient(clientId);
      if (!record) {
        record = await airtableCRM.getClientByBusinessName(clientId);
      }
    } catch (findErr) {
      console.warn('Lookup in Airtable failed, will create new record:', findErr);
    }
    
    if (record) {
      // Update existing record
      await airtableCRM.updateFields(record.id, {
        'Payment Status': status,
        'Payment Method': method,
        'Payment Reference': subscriptionId,
        'Payment Amount': payAmount,
        'Next Due Date': nextDueDate.toISOString().split('T')[0]
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Payment confirmed and updated in CRM.',
        recordId: record.id
      });
    } else {
      // Auto-create client record in Airtable so payment is NEVER lost!
      const formattedName = providedBusinessName || clientId.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      const recordId = await airtableCRM.syncClient({
        info: {
          clientId: clientId,
          businessName: formattedName,
          contactName: 'Cliente ' + formattedName,
          email: '',
          phone: '',
          businessType: 'other',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        payment: {
          status: status,
          method: method,
          reference: subscriptionId,
          amount: payAmount,
          currency: 'USD',
          nextDueDate: nextDueDate.toISOString().split('T')[0]
        },
        branding: { colors: { primary: '#10b981' } },
        deployment: { status: 'deployed' }
      } as any);

      console.log(`Auto-created Airtable client ${recordId} with payment status ${status}`);

      return NextResponse.json({ 
        success: true, 
        message: 'Client auto-created and payment confirmed in CRM.',
        recordId
      });
    }
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
