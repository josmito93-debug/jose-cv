import { NextResponse } from 'next/server';
import { stripeService } from '@/lib/integrations/stripe-service';

export async function POST(request: Request) {
  try {
    const { clientId, amount, description } = await request.json();

    if (!clientId || !amount) {
      return NextResponse.json({ success: false, error: 'Missing clientId or amount' }, { status: 400 });
    }

    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const checkoutUrl = await stripeService.createOneTimePaymentSession(
      clientId,
      amount,
      description || 'Project Deposit',
      `${baseUrl}/propuestas/${clientId}?status=success`,
      `${baseUrl}/propuestas/${clientId}?status=cancel`
    );

    return NextResponse.json({ success: true, url: checkoutUrl });
  } catch (error: any) {
    console.error('Stripe One-Time Checkout Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
