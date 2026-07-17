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

    let targetRecord: any = null;

    if (clientId) {
      try {
        targetRecord = await airtableCRM.getClient(clientId);
      } catch (e: any) {
        console.error(`Failed to find client by metadata clientId ${clientId}:`, e.message);
      }
    }

    // Fallback: match by customer email
    if (!targetRecord && subscriptionId) {
      console.log('No client matched by metadata clientId. Running email lookup fallbacks...');
      let email = session.customer_details?.email;
      
      // If customer details has no email, retrieve customer info
      if (!email && session.customer) {
        try {
          const customer = await stripeService.retrieveCustomer(session.customer);
          if (customer && !(customer as any).deleted) {
            email = (customer as any).email;
          }
        } catch (e: any) {
          console.error(`Failed to retrieve customer details for ${session.customer}:`, e.message);
        }
      }

      if (email) {
        console.log(`Searching Airtable for email match: ${email}`);
        try {
          targetRecord = await airtableCRM.getClientByEmail(email);
          if (targetRecord) {
            console.log(`Matched Airtable record by email: ${targetRecord.id} (${targetRecord.fields['Business Name']})`);
          }
        } catch (e: any) {
          console.error(`Failed to match client by email ${email}:`, e.message);
        }
      }
    }

    if (targetRecord && subscriptionId) {
      console.log(`Processing successful subscription for client record: ${targetRecord.id}`);
      
      try {
        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        const updateData: any = {
          'Payment Status': 'PAID',
          'Payment Method': 'STRIPE',
          'Payment Reference': subscriptionId,
          'Next Due Date': nextDueDate.toISOString().split('T')[0]
        };

        // If the record didn't have contact name or email, fill it in from Stripe
        const currentContactName = targetRecord.fields['Contact Name'] || '';
        if ((!currentContactName || currentContactName === 'Sin Nombre' || currentContactName === 'Vercel Import') && session.customer_details?.name) {
          updateData['Contact Name'] = session.customer_details.name;
        }
        if (!targetRecord.fields['Email'] && session.customer_details?.email) {
          updateData['Email'] = session.customer_details.email;
        }

        await airtableCRM.updateFields(targetRecord.id, updateData);
        console.log(`Updated Airtable for client record: ${targetRecord.id}`);
      } catch (crmError: any) {
        console.error('Error updating CRM from webhook:', crmError.message);
      }
    } else {
      console.log('No matched Airtable record found for this checkout session.');
    }
  }

  return NextResponse.json({ received: true });
}
