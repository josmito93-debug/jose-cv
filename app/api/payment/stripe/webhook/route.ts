import { NextResponse } from 'next/server';
import { stripeService } from '@/lib/integrations/stripe-service';
import { airtableCRM } from '@/lib/integrations/airtable-crm';
import { syncStripeAndAirtable } from '@/lib/integrations/stripe-sync';

// Helper function to send the ticket confirmation email using Resend API
async function sendTicketEmail(email: string, name: string, ticketsDescription: string, clientId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Resend Email Dispatch] RESEND_API_KEY is not defined in environment variables.');
    return;
  }

  const qrDataUrl = `https://www.universaagency.com/bellakeo/scan?id=${clientId}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDataUrl)}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tus Entradas para BELLakeo LAND 🔥</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; color: #ffffff; margin: 0; padding: 40px 0; -webkit-text-size-adjust: none; }
        .container { max-width: 500px; margin: 0 auto; background-color: #0c0c0f; border: 1px solid #1f2937; border-radius: 24px; overflow: hidden; }
        .header { background-color: #000000; padding: 30px; text-align: center; border-bottom: 1px dashed #1f2937; }
        .logo { max-width: 160px; height: auto; display: inline-block; }
        .content { padding: 40px 30px; text-align: center; }
        .title { font-size: 22px; font-weight: 900; letter-spacing: 2px; color: #ffffff; text-transform: uppercase; margin: 0 0 10px 0; }
        .subtitle { font-size: 11px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 30px 0; }
        .qr-container { padding: 15px; background-color: #ffffff; border-radius: 20px; display: inline-block; margin-bottom: 30px; }
        .qr-image { display: block; width: 220px; height: 220px; }
        .details-box { background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin-bottom: 30px; text-align: left; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; }
        .detail-row:last-child { margin-bottom: 0; }
        .label { color: #6b7280; font-weight: 700; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; }
        .value { color: #ffffff; font-weight: 700; text-transform: uppercase; }
        .btn-scan { display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: #ffffff !important; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; border-radius: 12px; margin-bottom: 20px; }
        .footer { background-color: #000000; padding: 25px; text-align: center; font-size: 10px; color: #4b5563; border-top: 1px solid #1f2937; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.universaagency.com/bellakeo_logo.png" alt="BELLakeo LAND" class="logo" />
        </div>
        <div class="content">
          <div class="title">¡Acceso Confirmado!</div>
          <div class="subtitle">Tu pase está asegurado</div>
          
          <div class="qr-container">
            <img src="${qrImageUrl}" alt="Acceso QR" class="qr-image" />
          </div>
          
          <div class="details-box">
            <div class="detail-row">
              <span class="label">Comprador</span>
              <span class="value">${name}</span>
            </div>
            <div class="detail-row">
              <span class="label">Tickets</span>
              <span class="value">${ticketsDescription}</span>
            </div>
            <div class="detail-row">
              <span class="label">Fecha</span>
              <span class="value">Viernes, 7 Agosto</span>
            </div>
            <div class="detail-row">
              <span class="label">Lugar</span>
              <span class="value">Blue Hookah, Memphis</span>
            </div>
            <div class="detail-row">
              <span class="label">Orden ID</span>
              <span class="value" style="font-family: monospace;">${clientId}</span>
            </div>
          </div>
          
          <a href="${qrDataUrl}" class="btn-scan">Verificar Entrada Online</a>
          
          <p style="font-size: 10px; color: #6b7280; margin: 0; line-height: 1.5; text-transform: uppercase; font-weight: 700;">
            Presenta el código QR en la puerta de entrada.<br/>Cada ticket es de uso único y personal.
          </p>
        </div>
        <div class="footer">
          © 2026 BELLakeo LAND. Todos los derechos reservados.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'BELLakeo LAND <tickets@universaagency.com>',
        to: email,
        subject: `Tus Entradas para BELLakeo LAND 🔥 - ${name}`,
        html: htmlContent
      })
    });

    const data = await res.json();
    console.log('[Resend Email Dispatch] Success:', data);
  } catch (err: any) {
    console.error('[Resend Email Dispatch] Failed:', err.message);
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') || '';

  let event;

  try {
    event = stripeService.constructEvent(
      body,
      sig,
      (process.env.STRIPE_WEBHOOK_SECRET || '').trim()
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle Thin Events
  const isV2 = (event as any).object === 'v2.core.event';
  if (isV2) {
    console.log(`[Stripe V2 Webhook] Received Thin Event: ${(event as any).type} (ID: ${(event as any).id})`);
    return NextResponse.json({ received: true, version: 'v2', eventId: (event as any).id });
  }

  const eventType = event.type;
  console.log(`[Stripe Webhook] Received Event: ${eventType}`);

  // Handle all payment success and subscription events
  const isPaymentEvent = [
    'checkout.session.completed',
    'invoice.payment_succeeded',
    'invoice.paid',
    'customer.subscription.created',
    'customer.subscription.updated',
    'payment_intent.succeeded',
    'charge.succeeded'
  ].includes(eventType);

  if (isPaymentEvent) {
    const obj = event.data.object as any;
    
    // Extract metadata and customer details depending on event object type
    const clientId = obj.metadata?.clientId || obj.client_reference_id;
    const subscriptionId = obj.subscription || (obj.object === 'subscription' ? obj.id : null);
    let email = obj.customer_details?.email || obj.customer_email || obj.billing_details?.email;
    let name = obj.customer_details?.name || obj.billing_details?.name || '';
    const amount = obj.amount_total ? obj.amount_total / 100 : obj.amount_paid ? obj.amount_paid / 100 : obj.amount ? obj.amount / 100 : 30;
    const ref = subscriptionId || obj.payment_intent || obj.id || 'stripe_verified';

    // Retrieve customer email if not in event payload
    if (!email && obj.customer) {
      try {
        const customer = await stripeService.retrieveCustomer(obj.customer);
        if (customer && !(customer as any).deleted) {
          email = (customer as any).email;
          if (!name) name = (customer as any).name || '';
        }
      } catch (e: any) {
        console.error(`Failed to retrieve customer details for ${obj.customer}:`, e.message);
      }
    }

    let targetRecord: any = null;

    if (clientId) {
      try {
        targetRecord = await airtableCRM.getClient(clientId);
        if (!targetRecord) {
          targetRecord = await airtableCRM.getClientByBusinessName(clientId);
        }
      } catch (e: any) {
        console.error(`Failed to find client by clientId ${clientId}:`, e.message);
      }
    }

    // Fallback: match by email
    if (!targetRecord && email) {
      try {
        targetRecord = await airtableCRM.getClientByEmail(email);
      } catch (e: any) {
        console.error(`Failed to match client by email ${email}:`, e.message);
      }
    }

    if (targetRecord) {
      console.log(`[Stripe Webhook] Processing successful payment for record: ${targetRecord.id}`);
      
      try {
        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        const updateData: any = {
          'Payment Status': 'PAID',
          'Payment Method': 'STRIPE',
          'Payment Reference': ref,
          'Payment Amount': amount
        };

        if (subscriptionId) {
          updateData['Next Due Date'] = nextDueDate.toISOString().split('T')[0];
        }

        const currentContactName = targetRecord.fields['Contact Name'] || '';
        if ((!currentContactName || currentContactName === 'Sin Nombre' || currentContactName === 'Vercel Import') && name) {
          updateData['Contact Name'] = name;
        }
        if (!targetRecord.fields['Email'] && email) {
          updateData['Email'] = email;
        }

        await airtableCRM.updateFields(targetRecord.id, updateData);
        console.log(`[Stripe Webhook] Updated Airtable record ${targetRecord.id} to PAID`);

        // Check if BELLakeo ticket
        const businessName = targetRecord.fields['Business Name'] || '';
        if (businessName.includes('BELLakeo LAND')) {
          const emailAddress = targetRecord.fields['Email'] || email;
          const contactName = targetRecord.fields['Contact Name'] || name || 'Invitado';
          const ticketsDescription = businessName.replace('BELLakeo LAND - ', '') || 'Entrada General';

          if (emailAddress) {
            await sendTicketEmail(emailAddress, contactName, ticketsDescription, targetRecord.id);
          }
        }
      } catch (crmError: any) {
        console.error('[Stripe Webhook] Error updating CRM:', crmError.message);
      }
    } else if (email || clientId) {
      // Auto-create client record
      console.log('[Stripe Webhook] No existing record found. Auto-creating client record in Airtable...');
      try {
        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        const fallbackBusinessName = clientId 
          ? clientId.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
          : (name || 'Cliente Stripe');

        const newRecordId = await airtableCRM.syncClient({
          info: {
            clientId: clientId || `CLNT-${Date.now()}`,
            businessName: fallbackBusinessName,
            contactName: name || 'Cliente Stripe',
            email: email || '',
            phone: '',
            businessType: 'other',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          payment: {
            status: 'PAID',
            method: 'STRIPE',
            reference: ref,
            amount: amount,
            currency: 'USD',
            nextDueDate: nextDueDate.toISOString().split('T')[0]
          },
          branding: { colors: { primary: '#2ee58f' } },
          deployment: { status: 'deployed' }
        } as any);

        console.log(`[Stripe Webhook] Auto-created Airtable record ${newRecordId} marked as PAID`);
      } catch (createErr: any) {
        console.error('[Stripe Webhook] Error auto-creating CRM record:', createErr.message);
      }
    }

    // Run global sync in background
    syncStripeAndAirtable(true).catch(e => console.error('[Webhook post-sync error]:', e.message));
  }

  return NextResponse.json({ received: true });
}
