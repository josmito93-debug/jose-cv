import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';
import { syncStripeAndAirtable } from '@/lib/integrations/stripe-sync';

export async function POST(request: Request) {
  try {
    const { 
      clientId, 
      subscriptionId, 
      method, 
      businessName: providedBusinessName, 
      amount: providedAmount,
      email: providedEmail 
    } = await request.json();
    
    if (!clientId || !subscriptionId) {
      return NextResponse.json({ success: false, error: 'Missing payment data' }, { status: 400 });
    }

    const nextDueDate = new Date();
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    let status = 'PAID';
    if (method === 'PAGO_MOVIL') status = 'PENDING_VERIFICATION';

    const payAmount = Number(providedAmount || 30);

    // Find the record in Airtable
    let record: any = null;
    try {
      record = await airtableCRM.getClient(clientId);
      if (!record && providedBusinessName) {
        record = await airtableCRM.getClientByBusinessName(providedBusinessName);
      }
      if (!record && providedEmail) {
        record = await airtableCRM.getClientByEmail(providedEmail);
      }
      if (!record) {
        record = await airtableCRM.getClientByBusinessName(clientId);
      }
    } catch (findErr) {
      console.warn('Lookup in Airtable failed:', findErr);
    }
    
    if (record) {
      const updateData: any = {
        'Payment Status': status,
        'Payment Method': method,
        'Payment Reference': subscriptionId,
        'Payment Amount': payAmount,
        'Next Due Date': nextDueDate.toISOString().split('T')[0]
      };

      if (providedEmail && !record.fields['Email']) {
        updateData['Email'] = providedEmail;
      }

      await airtableCRM.updateFields(record.id, updateData);

      // Trigger background sync
      syncStripeAndAirtable(true).catch(() => {});

      return NextResponse.json({ 
        success: true, 
        message: 'Payment confirmed and updated in CRM.',
        recordId: record.id
      });
    } else {
      const formattedName = providedBusinessName || clientId.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      const recordId = await airtableCRM.syncClient({
        info: {
          clientId: clientId,
          businessName: formattedName,
          contactName: 'Cliente ' + formattedName,
          email: providedEmail || '',
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
        branding: { colors: { primary: '#2ee58f' } },
        deployment: { status: 'deployed' }
      } as any);

      syncStripeAndAirtable(true).catch(() => {});

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
