import { NextResponse } from 'next/server';
import { stripeService } from '@/lib/integrations/stripe-service';

export async function POST(request: Request) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Missing clientId' }, { status: 400 });
    }

    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const checkoutUrl = await stripeService.createSubscriptionSession(
      clientId,
      `${baseUrl}/pay/${clientId}?status=success`,
      `${baseUrl}/pay/${clientId}?status=cancel`
    );

    return NextResponse.json({ success: true, url: checkoutUrl });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
