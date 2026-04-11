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
          clientId: clientId, // This might be prj_...
          businessName: businessName || 'Sin Negocio',
          contactName: contactName || 'Sin Nombre',
          email: email || '',
          phone: phone || ''
        },
        payment: {
          status: 'UNPAID'
        }
      });
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
