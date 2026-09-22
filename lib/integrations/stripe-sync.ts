import Stripe from 'stripe';
import { airtableCRM } from './airtable-crm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

let lastSyncTime = 0;
const SYNC_COOLDOWN_MS = 10000; // 10s memory cache cooldown

export interface StripePaymentMatch {
  email: string;
  name: string;
  clientId?: string;
  amount: number;
  ref: string;
  status: 'PAID';
}

/**
 * Reconciles active Stripe subscriptions & paid checkout sessions with Airtable CRM.
 * Automatically marks clients as 'PAID' in Airtable as soon as a payment is detected in Stripe.
 */
export async function syncStripeAndAirtable(force = false): Promise<{ updatedCount: number; paidCount: number }> {
  const now = Date.now();
  if (!force && (now - lastSyncTime < SYNC_COOLDOWN_MS)) {
    return { updatedCount: 0, paidCount: 0 };
  }
  lastSyncTime = now;

  if (!process.env.STRIPE_SECRET_KEY || !process.env.AIRTABLE_API_KEY) {
    return { updatedCount: 0, paidCount: 0 };
  }

  try {
    const [subs, sessions, airtableRecords] = await Promise.all([
      stripe.subscriptions.list({ status: 'active', limit: 100, expand: ['data.customer'] }),
      stripe.checkout.sessions.list({ limit: 100 }),
      airtableCRM.getAllClients()
    ]);

    const paidMap = new Map<string, StripePaymentMatch>();

    // 1. Process active recurring subscriptions
    for (const s of subs.data) {
      const customer = s.customer as Stripe.Customer | null;
      const email = (customer?.email || '').toLowerCase().trim();
      const name = customer?.name || customer?.description || '';
      const amount = (s.items?.data[0]?.price?.unit_amount || 3000) / 100;
      const subId = s.id;

      if (email) {
        paidMap.set(email, { email, name, amount, ref: subId, status: 'PAID' });
      }
    }

    // 2. Process recent paid checkout sessions
    for (const cs of sessions.data) {
      if (cs.payment_status === 'paid') {
        const email = (cs.customer_details?.email || '').toLowerCase().trim();
        const name = cs.customer_details?.name || '';
        const clientId = (cs.metadata?.clientId || '').toLowerCase().trim();
        const amount = (cs.amount_total || 3000) / 100;
        const ref = (cs.subscription as string) || cs.payment_intent || cs.id;

        if (clientId) {
          paidMap.set(clientId, { email, name, clientId, amount, ref, status: 'PAID' });
        }
        if (email && !paidMap.has(email)) {
          paidMap.set(email, { email, name, amount, ref, status: 'PAID' });
        }
      }
    }

    let updatedCount = 0;

    for (const r of airtableRecords) {
      const cId = (r.fields['Client ID'] || '').toLowerCase().trim();
      const email = (r.fields['Email'] || '').toLowerCase().trim();
      const bus = (r.fields['Business Name'] || '').toLowerCase().trim();
      const currentStatus = (r.fields['Payment Status'] || '').toUpperCase();

      let paymentMatch: StripePaymentMatch | undefined;
      
      if (cId && paidMap.has(cId)) {
        paymentMatch = paidMap.get(cId);
      } else if (email && paidMap.has(email)) {
        paymentMatch = paidMap.get(email);
      } else {
        for (const [key, val] of paidMap.entries()) {
          if (bus && key && (bus.includes(key) || key.includes(bus))) {
            paymentMatch = val;
            break;
          }
        }
      }

      if (paymentMatch && currentStatus !== 'PAID') {
        console.log(`[Auto-Sync] Updating Airtable ${r.id} (${r.fields['Business Name']}) to PAID from Stripe payment ${paymentMatch.ref}`);
        const updateData: any = {
          'Payment Status': 'PAID',
          'Payment Method': 'STRIPE',
          'Payment Amount': paymentMatch.amount,
          'Payment Reference': paymentMatch.ref
        };

        if (paymentMatch.email && !r.fields['Email']) {
          updateData['Email'] = paymentMatch.email;
        }
        if (paymentMatch.name && (!r.fields['Contact Name'] || r.fields['Contact Name'] === 'Sin Nombre' || r.fields['Contact Name'] === 'Vercel Import')) {
          updateData['Contact Name'] = paymentMatch.name;
        }

        await airtableCRM.updateFields(r.id, updateData);
        updatedCount++;
      }
    }

    return { updatedCount, paidCount: paidMap.size };
  } catch (err: any) {
    console.error('[Stripe-Airtable Auto-Sync Error]:', err.message);
    return { updatedCount: 0, paidCount: 0 };
  }
}
