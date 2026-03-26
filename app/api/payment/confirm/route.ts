import { NextResponse } from 'next/server';
import { fileManager } from '@/lib/utils/file-manager';

export async function POST(request: Request) {
  try {
    const { clientId, reference, method } = await request.json();

    if (!clientId || !reference) {
      return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
    }

    // Load current client data
    const clientData = await fileManager.loadClientInfo(clientId);
    
    // Update payment status and add reference
    const updatedData = {
      ...clientData,
      payment: {
        ...clientData.payment,
        status: 'processing' as any,
        reference: reference, // Legacy field
        method: method,
        pagoMovil: method === 'pago_movil' ? {
          reference: reference,
          bank: 'Banesco', // Placeholder
          phone: '+58 412 XXX XXXX', // Placeholder
          id: 'V-XXX.XXX.XXX' // Placeholder
        } : undefined
      },
      updatedAt: new Date().toISOString()
    };

    // Save updated data
    await fileManager.saveClientInfo(clientId, updatedData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
