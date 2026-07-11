const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Error: RESEND_API_KEY no encontrada en .env.local");
    process.exit(1);
  }

  console.log("Iniciando envío de correo de confirmación de entrega a info@universaagency.com...");

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Universa Agency <info@universaagency.com>',
        to: ['info@universaagency.com', 'josefigueroa.marketing@gmail.com'],
        subject: '🚀 Confirmación de Entrega de Proyecto: Garage STREET FOOD',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0e131f; color: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
            
            <!-- Branding Header -->
            <div style="text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 25px; margin-bottom: 30px;">
              <span style="font-size: 11px; font-weight: 900; color: #2ddc80; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 5px;">UNIVERSA AGENCY</span>
              <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">CONFIRMACIÓN DE ENTREGA TÉCNICA</h2>
            </div>

            <!-- Intro -->
            <div style="font-size: 15px; line-height: 1.6; color: rgba(255, 255, 255, 0.8); margin-bottom: 25px;">
              <p>Estimado equipo de <strong>Universa Agency</strong> / <strong>Paula Garcia</strong>,</p>
              <p>Confirmamos formalmente que el desarrollo, la integración de datos y la puesta en marcha de la plataforma digital para el restaurante <strong>Garage STREET FOOD</strong> ha finalizado exitosamente.</p>
            </div>

            <!-- RED FLAG DELIVERY CONFIRMATION -->
            <div style="color: #ff4a4a; border: 2px solid #ff4a4a; background-color: rgba(255, 74, 74, 0.1); font-weight: 900; font-size: 15px; margin: 30px 0; text-align: center; padding: 20px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; line-height: 1.4;">
              AQUÍ ESTAMOS CONFIRMANDO QUE EL PRODUCTO FUE ENTREGADO
            </div>

            <!-- Deliverables & Links -->
            <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 20px; margin-bottom: 30px;">
              <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 14px; font-weight: bold; color: #2ddc80; text-transform: uppercase; letter-spacing: 1px;">Accesos Oficiales del Proyecto</h3>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; font-weight: bold;">1. Portal Web App E-Commerce (Producción)</p>
                <a href="https://gas-grub-express-7aalwc9xf-joses-projects-e8edc11c.vercel.app" style="color: #2ddc80; font-weight: bold; text-decoration: none; word-break: break-all; font-size: 14px; border-bottom: 1px solid rgba(45, 220, 128, 0.3); padding-bottom: 2px;" target="_blank">
                  https://gas-grub-express-7aalwc9xf-joses-projects-e8edc11c.vercel.app
                </a>
              </div>

              <div>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; font-weight: bold;">2. Repositorio de Código Fuente (GitHub)</p>
                <a href="https://github.com/josmito93-debug/gas-grub-express" style="color: #2ddc80; font-weight: bold; text-decoration: none; word-break: break-all; font-size: 14px; border-bottom: 1px solid rgba(45, 220, 128, 0.3); padding-bottom: 2px;" target="_blank">
                  https://github.com/josmito93-debug/gas-grub-express
                </a>
              </div>
            </div>

            <!-- Closing -->
            <div style="font-size: 14px; line-height: 1.6; color: rgba(255, 255, 255, 0.6); border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 25px; margin-top: 30px;">
              <p style="margin: 0 0 5px 0;">Atentamente,</p>
              <p style="margin: 0; font-weight: bold; color: #ffffff;">Equipo Técnico de Universa Agency</p>
              <p style="margin: 3px 0 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.4);">Desarrollo y Soluciones Web</p>
            </div>

          </div>
        `
      })
    });

    const resData = await response.json();
    if (response.ok) {
      console.log("¡Correo de entrega enviado con éxito a la agencia!", resData);
    } else {
      console.error("Error de la API de Resend al enviar a la agencia:", resData);
    }
  } catch (err) {
    console.error("Error en la conexión con la API de Resend:", err.message);
  }
}

main();
