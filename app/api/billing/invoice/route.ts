import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export async function POST(request: Request) {
  try {
    const { clientId, businessName, contactName, email, phone } = await request.json();
    
    // Ensure the client exists in Airtable
    // If we only have clientId as prj_..., we should still try to sync
    let finalClientId = clientId;
    
    try {
      const recordId = await airtableCRM.syncClient({
        info: {
          clientId: clientId,
          businessName: businessName || 'Sin Negocio',
          contactName: contactName || 'Sin Nombre',
          email: email || '',
          phone: phone || '',
          businessType: 'other', // Default value to satisfy strict type
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        payment: {
          status: 'pending', // Match PaymentInfoSchema: 'pending' | 'processing' | 'completed' | 'failed'
          amount: 30,       // Default amount
          currency: 'USD'
        },
        branding: {
          colors: {
            primary: '#6366f1' // Indigo
          }
        },
        deployment: {
          status: 'not_started'
        }
      } as any); // Use cast to any to handle nested property variations if necessary, but providing main fields
      console.log('Client synced to Airtable during invoice gen:', recordId);
    } catch (syncError) {
      console.error('Failed to sync client during invoice generation:', syncError);
      // We continue anyway, the payment page has fallback logic now
    }

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
