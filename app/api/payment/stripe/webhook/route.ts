import { NextResponse } from 'next/server';
import { stripeService } from '@/lib/integrations/stripe-service';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

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
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  const isV2 = (event as any).object === 'v2.core.event';

  if (isV2) {
    console.log(`[Stripe V2 Webhook] Received Thin Event: ${(event as any).type} (ID: ${(event as any).id})`);
    return NextResponse.json({ received: true, version: 'v2', eventId: (event as any).id });
  }

  // Handle standard V1 events
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
    if (!targetRecord) {
      console.log('No client matched by metadata clientId. Running email lookup fallbacks...');
      let email = session.customer_details?.email;
      
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
        } catch (e: any) {
          console.error(`Failed to match client by email ${email}:`, e.message);
        }
      }
    }

    if (targetRecord) {
      console.log(`Processing successful checkout for client record: ${targetRecord.id}`);
      
      try {
        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        const updateData: any = {
          'Payment Status': 'PAID',
          'Payment Method': 'STRIPE',
          'Payment Reference': subscriptionId || session.payment_intent || 'one-time',
          'Payment Amount': session.amount_total ? session.amount_total / 100 : 25
        };

        if (subscriptionId) {
          updateData['Next Due Date'] = nextDueDate.toISOString().split('T')[0];
        }

        // If the record didn't have contact name or email, fill it in from Stripe details
        const currentContactName = targetRecord.fields['Contact Name'] || '';
        if ((!currentContactName || currentContactName === 'Sin Nombre' || currentContactName === 'Vercel Import') && session.customer_details?.name) {
          updateData['Contact Name'] = session.customer_details.name;
        }
        if (!targetRecord.fields['Email'] && session.customer_details?.email) {
          updateData['Email'] = session.customer_details.email;
        }

        await airtableCRM.updateFields(targetRecord.id, updateData);
        console.log(`Updated Airtable for client record: ${targetRecord.id} to PAID`);

        // Check if this is a BELLakeo LAND ticket purchase
        const businessName = targetRecord.fields['Business Name'] || '';
        if (businessName.includes('BELLakeo LAND')) {
          const emailAddress = targetRecord.fields['Email'] || session.customer_details?.email;
          const contactName = targetRecord.fields['Contact Name'] || session.customer_details?.name || 'Invitado';
          
          // Extract ticket description from businessName (format: "BELLakeo LAND - [ticketsBreakdown]")
          const ticketsDescription = businessName.replace('BELLakeo LAND - ', '') || 'Entrada General';

          if (emailAddress) {
            console.log(`Dispatching ticket QR email to: ${emailAddress}`);
            await sendTicketEmail(emailAddress, contactName, ticketsDescription, targetRecord.id);
          } else {
            console.warn('Cannot send ticket email: customer email is missing.');
          }
        }
      } catch (crmError: any) {
        console.error('Error updating CRM from webhook:', crmError.message);
      }
    } else {
      console.log('No matched Airtable record found for this checkout session.');
    }
  }

  return NextResponse.json({ received: true });
}
