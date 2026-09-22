import { NextResponse } from 'next/server';
import { syncStripeAndAirtable } from '@/lib/integrations/stripe-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await syncStripeAndAirtable(true);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Stripe sync route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await syncStripeAndAirtable(true);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Stripe sync route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
