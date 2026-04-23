import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export const stripeService = {
  /**
   * Get or create the $30 monthly price for Attom/Universa
   */
  async getOrCreateGrowthPlan() {
    // Search for existing product
    const products = await stripe.products.list({
      limit: 100,
      active: true,
    });

    let product = products.data.find(p => p.name === 'Growth Maintenance');

    if (!product) {
      product = await stripe.products.create({
        name: 'Growth Maintenance',
        description: 'Monthly website maintenance and growth tools by Universa Agency',
      });
    }

    // Search for existing price
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });

    let price = prices.data.find(p => p.unit_amount === 3000 && p.recurring?.interval === 'month');

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: 3000, // $30.00
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
      });
    }

    return price.id;
  },

  /**
   * Create a Checkout Session for a subscription
   */
  async createSubscriptionSession(clientId: string, successUrl: string, cancelUrl: string) {
    const priceId = await this.getOrCreateGrowthPlan();

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
   * Verify signature for webhooks
   */
  constructEvent(body: string, sig: string, secret: string) {
    return stripe.webhooks.constructEvent(body, sig, secret);
  }
};
