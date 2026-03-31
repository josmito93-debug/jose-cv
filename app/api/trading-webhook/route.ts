import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'trading_logs.json');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhook_secret, accion, precio, razon, capital_actual } = body;

    if (webhook_secret !== process.env.DASHBOARD_WEBHOOK_SECRET && webhook_secret !== "JFOS_SECURE_2026") {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      accion,
      precio,
      razon,
      capital_actual
    };

    // Almacenamiento temporal en archivo local (Para desarrollo)
    // En producción (Vercel) esto se debe cambiar a Supabase/MongoDB
    let logs = [];
    if (fs.existsSync(LOG_FILE)) {
      const fileData = fs.readFileSync(LOG_FILE, 'utf-8');
      if (fileData) {
        logs = JSON.parse(fileData);
      }
    }
    
    // Guardamos los últimos 50 logs
    logs.unshift(newLog);
    if (logs.length > 50) logs.pop();

    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));

    console.log("🤖 [WEBHOOK RECIBIDO] - Acción:", accion, "Precio:", precio);

    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
