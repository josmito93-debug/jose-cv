import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { clientId, businessName } = await request.json();
    
    // The payment link for the client to subscribe to Universa Agency
    const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://jose-cv.vercel.app'}/pay/${clientId}`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Recurring subscription link generated.',
      paymentUrl: paymentUrl,
      status: 'PENDING'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
