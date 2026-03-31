import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { clientId, amount, email } = await response.json();
    
    // Simulate invoice generation logic
    console.log(`Generating invoice for ${clientId}: $${amount} sent to ${email}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Invoice generated and sent to client.',
      invoiceUrl: `https://billing.universa-agency.com/inv/${Math.random().toString(36).substring(7)}`,
      status: 'SENT'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
