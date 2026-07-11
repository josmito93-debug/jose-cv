import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientSlug, name, email, phone, companyName, signatureData, signedAt } = body;

    if (!clientSlug || !name || !email) {
      return NextResponse.json({ error: 'Faltan campos obligatorios (Nombre, Email o Identificador)' }, { status: 400 });
    }

    const signaturesDir = path.join(process.cwd(), 'data');
    const filePath = path.join(signaturesDir, 'signatures.json');

    const newSignature = {
      id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientSlug,
      name,
      email,
      phone: phone || '',
      companyName: companyName || '',
      signatureData, // Base64 signature image or typed name
      signedAt: signedAt || new Date().toISOString(),
    };

    // 1. Try to write signature locally (works in local dev, will throw EROFS in Vercel - which we catch)
    try {
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
      signatures.push(newSignature);
      fs.writeFileSync(filePath, JSON.stringify(signatures, null, 2), 'utf-8');
    } catch (fsError: any) {
      console.warn("No se pudo escribir localmente en signatures.json (esperado en Vercel):", fsError.message);
    }

    // 2. Send email notification via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Acuerdos Universa <onboarding@resend.dev>',
            to: ['jose@universa.agency', 'info@universa.agency'],
            subject: `✍️ Propuesta Firmada: ${name} (${companyName})`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #0e131f; border-bottom: 2px solid #2ddc80; padding-bottom: 10px;">Nuevo Contrato Firmado</h2>
                <p>Se ha formalizado digitalmente un nuevo acuerdo comercial a través del portal de propuestas de Universa.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr style="background-color: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold; width: 35%;">Cliente / Firmante:</td>
                    <td style="padding: 10px;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; font-weight: bold;">Empresa:</td>
                    <td style="padding: 10px;">${companyName}</td>
                  </tr>
                  <tr style="background-color: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold;">Teléfono:</td>
                    <td style="padding: 10px;">${phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; font-weight: bold;">Email:</td>
                    <td style="padding: 10px;">${email}</td>
                  </tr>
                  <tr style="background-color: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold;">Propuesta (ID/Slug):</td>
                    <td style="padding: 10px;"><code>${clientSlug}</code></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; font-weight: bold;">Fecha / Hora:</td>
                    <td style="padding: 10px;">${new Date(newSignature.signedAt).toLocaleString()}</td>
                  </tr>
                  <tr style="background-color: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold;">ID de Acuerdo:</td>
                    <td style="padding: 10px;"><code>${newSignature.id}</code></td>
                  </tr>
                </table>

                <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 8px; text-align: center;">
                  <span style="font-size: 11px; text-transform: uppercase; color: #666; display: block; margin-bottom: 10px;">Firma Registrada</span>
                  ${signatureData.startsWith('data:image') 
                    ? `<img src="${signatureData}" alt="Firma Digital" style="max-height: 80px; max-width: 100%;" />`
                    : `<span style="font-family: 'Georgia', serif; font-style: italic; font-size: 24px; color: #0e131f;">${signatureData}</span>`
                  }
                </div>
                
                <p style="font-size: 11px; color: #999; margin-top: 30px; text-align: center;">
                  Este es un correo automático generado por el sistema de propuestas de Universa Agency.
                </p>
              </div>
            `
          })
        });

        if (!emailResponse.ok) {
          const errData = await emailResponse.json();
          console.error("Resend API error:", errData);
        }
      } catch (emailError: any) {
        console.error("No se pudo enviar la notificación por correo por Resend:", emailError.message);
      }
    }

    return NextResponse.json({ success: true, signature: newSignature });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
