import { NextRequest, NextResponse } from 'next/server';
import { airtableTrading } from '@/lib/integrations/airtable-trading';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhook_secret, accion, precio, razon, capital_actual } = body;

    // Use environment secret or the fallback for testing
    if (webhook_secret !== process.env.DASHBOARD_WEBHOOK_SECRET && webhook_secret !== "JFOS_SECURE_2026") {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const logData = {
      timestamp: new Date().toISOString(),
      accion,
      precio,
      razon,
      capital_actual
    };

    // Almacenamiento en Airtable (Persistencia en Vercel)
    const recordId = await airtableTrading.saveLog(logData as any);

    console.log("🤖 [WEBHOOK RECIBIDO] - Acción:", accion, "Precio:", precio, "Airtable ID:", recordId);

    return NextResponse.json({ success: true, id: recordId });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
