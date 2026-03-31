import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'trading_logs.json');

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let logs = [];
    if (fs.existsSync(LOG_FILE)) {
      const fileData = fs.readFileSync(LOG_FILE, 'utf-8');
      if (fileData) {
        logs = JSON.parse(fileData);
      }
    }
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ success: false, logs: [] }, { status: 500 });
  }
}
