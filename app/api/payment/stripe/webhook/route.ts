import { NextResponse } from 'next/server';
import { stripeService } from '@/lib/integrations/stripe-service';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') || '';

  let event;

  try {
    event = stripeService.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const clientId = session.metadata?.clientId;
    const subscriptionId = session.subscription;

    if (clientId && subscriptionId) {
      console.log(`Processing successful subscription for client: ${clientId}`);
      
      try {
        // Sync with CRM
        const record = await airtableCRM.getClient(clientId);
        if (record) {
          const nextDueDate = new Date();
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);

          await airtableCRM.updateFields(record.id, {
            'Payment Status': 'PAID',
            'Payment Method': 'STRIPE',
            'Payment Reference': subscriptionId,
            'Next Due Date': nextDueDate.toISOString().split('T')[0]
          });
          console.log(`Updated Airtable for client: ${clientId}`);
        }
      } catch (crmError) {
        console.error('Error updating CRM from webhook:', crmError);
        // We still return 200 to Stripe to avoid retries if the CRM is the only thing that failed
        // In production, you might want to retry or alert.
      }
    }
  }

  return NextResponse.json({ received: true });
}
