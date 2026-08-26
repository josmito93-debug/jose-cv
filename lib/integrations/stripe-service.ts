import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

import { airtableCRM } from './airtable-crm';

export const stripeService = {
  /**
   * Helper to get client's custom monthly price
   */
  async getClientPrice(clientId: string): Promise<number> {
    if (clientId === 'prj_dA0XHibYMkPnamABbAkEwn0HDQKZ') {
      return 12;
    }
    try {
      const record = await airtableCRM.getClient(clientId);
      if (record) {
        return record.fields['Payment Amount'] || record.fields['Monthly Price'] || record.fields['Price'] || 30;
      }
    } catch (e) {
      console.error('Failed to get client price, defaulting to 30:', e);
    }
    return 30;
  },

  /**
   * Get or create the price for Attom/Universa
   */
  async getOrCreateGrowthPlan(amount: number = 30, interval: 'month' | 'year' = 'month') {
    // Search for existing product
    const products = await stripe.products.list({
      limit: 100,
      active: true,
    });

    const productName = amount === 30 ? 'Growth Maintenance' : `Growth Maintenance $${amount}`;
    let product = products.data.find(p => p.name === productName);

    if (!product) {
      product = await stripe.products.create({
        name: productName,
        description: `Website maintenance and growth tools by Universa Agency ($${amount}/${interval === 'year' ? 'yr' : 'mo'})`,
      });
    }

    // Search for existing price
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });

    let price = prices.data.find(p => p.unit_amount === amount * 100 && p.recurring?.interval === interval);

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: amount * 100, // amount in cents
        currency: 'usd',
        recurring: {
          interval: interval,
        },
      });
    }

    return price.id;
  },

  /**
   * Create a Checkout Session for a subscription
   */
  async createSubscriptionSession(clientId: string, successUrl: string, cancelUrl: string) {
    const amount = await this.getClientPrice(clientId);
    const interval = clientId === '58films' ? 'year' : 'month';
    const priceId = await this.getOrCreateGrowthPlan(amount, interval);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        clientId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session.url;
  },

  /**
   * Create a Checkout Session for a one-time payment
   */
  async createOneTimePaymentSession(clientId: string, amount: number, description: string, successUrl: string, cancelUrl: string) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description,
              description: 'One-time payment for digital services by Universa Agency',
            },
            unit_amount: amount * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        clientId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session.url;
  },

  /**
   * Retrieve a customer
   */
  async retrieveCustomer(customerId: string) {
    return await stripe.customers.retrieve(customerId);
  },

  /**
   * Verify signature for webhooks
   */
  constructEvent(body: string, sig: string, secret: string) {
    return stripe.webhooks.constructEvent(body, sig, secret);
  }
};
