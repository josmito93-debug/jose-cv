import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientSlug, name, email, signatureData, signedAt } = body;

    if (!clientSlug || !name || !email) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const signaturesDir = path.join(process.cwd(), 'data');
    const filePath = path.join(signaturesDir, 'signatures.json');

    // Ensure data directory exists
    if (!fs.existsSync(signaturesDir)) {
      fs.mkdirSync(signaturesDir, { recursive: true });
    }

    let signatures = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        signatures = JSON.parse(fileContent);
      } catch (e) {
        signatures = [];
      }
    }

    const newSignature = {
      id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientSlug,
      name,
      email,
      signatureData, // Base64 signature image or typed name
      signedAt: signedAt || new Date().toISOString(),
    };

    signatures.push(newSignature);
    fs.writeFileSync(filePath, JSON.stringify(signatures, null, 2), 'utf-8');

    return NextResponse.json({ success: true, signature: newSignature });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
