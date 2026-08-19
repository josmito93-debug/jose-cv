import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      empresa = '',
      origen = '',
      mision = '',
      adn_edad = '',
      adn_personalidad = '',
      adn_palabras = '',
      competidores = '',
      comp_bienmal = '',
      admiras = '',
      porque_tu = '',
      promesa = '',
      recompra = '',
      descubre = '',
      frenos = '',
      postventa = '',
      canales = [],
      canales_top = '',
      canales_nunca = '',
      branding_estado = '',
      branding_colores = '',
      branding_referencias = '',
      es_ecommerce = '',
      num_productos = '',
      plataforma_ecommerce = '',
      logistica_envios = '',
      servicios_urgentes = '',
      meta_1_5 = '',
      exito = '',
      num_clientes = '',
      num_ticket = '',
      num_inversion = '',
      invertir = '',
      contacto_nombre = '',
      contacto_email = '',
      contacto_telefono = '',
      contacto_web = '',
      notas_extra = ''
    } = data;

    const nombreFinal = contacto_nombre || 'Emprendedor / Líder';
    const empresaFinal = empresa || 'Empresa sin nombre';
    const canalesStr = Array.isArray(canales) ? canales.join(', ') : String(canales || '');

    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('es-ES', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // -------------------------------------------------------------
    // 1. SEND EMAIL NOTIFICATION VIA RESEND
    // -------------------------------------------------------------
    let emailSent = false;
    let emailId = null;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nuevo Big Bang™ - Universa Agency</title>
</head>
<body style="margin: 0; padding: 0; background-color: #06090e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eaf0ec;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #06090e; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="680" border="0" cellspacing="0" cellpadding="0" style="max-width: 680px; background: #0c1219; border: 1px solid rgba(46, 229, 143, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- HEADER -->
          <tr>
            <td style="padding: 32px 36px; background: linear-gradient(135deg, rgba(46, 229, 143, 0.15), rgba(167, 137, 255, 0.1)); border-bottom: 1px solid rgba(46, 229, 143, 0.2);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #2ee58f; margin-bottom: 6px;">UNIVERSA GROWTH LAB</span>
                    <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">💥 Nuevo Big Bang™ Recibido</h1>
                    <p style="margin: 6px 0 0 0; font-size: 14px; color: #9ab4a7;">${formattedDate} (ET)</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTACT SUMMARY CARD -->
          <tr>
            <td style="padding: 24px 36px; background: #101924; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #2ee58f;">👤 Información de Contacto</h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 14px; color: #d6e2dc;">
                <tr>
                  <td width="35%" style="color: #7d968b; font-weight: 600;">Nombre:</td>
                  <td style="color: #ffffff; font-weight: 700;">${nombreFinal}</td>
                </tr>
                <tr>
                  <td style="color: #7d968b; font-weight: 600;">Empresa / Marca:</td>
                  <td style="color: #2ee58f; font-weight: 700; font-size: 16px;">${empresaFinal}</td>
                </tr>
                <tr>
                  <td style="color: #7d968b; font-weight: 600;">Email:</td>
                  <td><a href="mailto:${contacto_email}" style="color: #2ee58f; text-decoration: none;">${contacto_email || 'No especificado'}</a></td>
                </tr>
                <tr>
                  <td style="color: #7d968b; font-weight: 600;">Teléfono / WhatsApp:</td>
                  <td><a href="https://wa.me/${contacto_telefono?.replace(/[^0-9]/g, '')}" style="color: #a78bff; text-decoration: none;">${contacto_telefono || 'No especificado'}</a></td>
                </tr>
                <tr>
                  <td style="color: #7d968b; font-weight: 600;">Sitio Web / Redes:</td>
                  <td>${contacto_web ? `<a href="${contacto_web.startsWith('http') ? contacto_web : 'https://' + contacto_web}" target="_blank" style="color: #2ee58f;">${contacto_web}</a>` : 'No especificado'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- RESPUESTAS DETALLADAS -->
          <tr>
            <td style="padding: 32px 36px;">
              
              <!-- FASE 01 -->
              <div style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #2ee58f;">01 · El Núcleo</h4>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #7d968b;"><strong>Origen y Problema que resuelve:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${origen || 'Sin respuesta'}</div>
                <p style="margin: 12px 0 8px 0; font-size: 13px; color: #7d968b;"><strong>Misión y Valores no negociables:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${mision || 'Sin respuesta'}</div>
              </div>

              <!-- FASE 02 -->
              <div style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #2ee58f;">02 · ADN de Marca</h4>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #7d968b;"><strong>Edad y Tono de voz:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${adn_edad || 'Sin respuesta'}</div>
                <p style="margin: 12px 0 8px 0; font-size: 13px; color: #7d968b;"><strong>Personalidad y Pasiones:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${adn_personalidad || 'Sin respuesta'}</div>
                <p style="margin: 12px 0 8px 0; font-size: 13px; color: #7d968b;"><strong>Palabras siempre vs jamás:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${adn_palabras || 'Sin respuesta'}</div>
              </div>

              <!-- FASE 03 -->
              <div style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #2ee58f;">03 · El Universo Competitivo</h4>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #7d968b;"><strong>Competidores directos:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${competidores || 'Sin respuesta'}</div>
                <p style="margin: 12px 0 8px 0; font-size: 13px; color: #7d968b;"><strong>Qué hacen bien y qué hacen mal:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${comp_bienmal || 'Sin respuesta'}</div>
                <p style="margin: 12px 0 8px 0; font-size: 13px; color: #7d968b;"><strong>Marcas que admira:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${admiras || 'Sin respuesta'}</div>
              </div>

              <!-- FASE 04 -->
              <div style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #2ee58f;">04 · La Gravedad (Propuesta de Valor)</h4>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #7d968b;"><strong>¿Por qué deberían comprarte a ti?:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${porque_tu || 'Sin respuesta'}</div>
                <p style="margin: 12px 0 8px 0; font-size: 13px; color: #7d968b;"><strong>Promesa y experiencia de cliente:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${promesa || 'Sin respuesta'}</div>
                <p style="margin: 12px 0 8px 0; font-size: 13px; color: #7d968b;"><strong>Factor de recompra / retención:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #eaf0ec; line-height: 1.5;">${recompra || 'Sin respuesta'}</div>
              </div>

              <!-- FASE 05: BRANDING Y E-COMMERCE -->
              <div style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #a78bff;">05 · Branding, Identidad & E-Commerce</h4>
                <table width="100%" border="0" cellspacing="0" cellpadding="8" style="background: rgba(167, 137, 255, 0.05); border: 1px solid rgba(167, 137, 255, 0.2); border-radius: 8px; font-size: 13px; margin-bottom: 12px;">
                  <tr>
                    <td width="40%" style="color: #a78bff; font-weight: bold;">Estado del Branding:</td>
                    <td style="color: #ffffff;">${branding_estado || 'No especificado'}</td>
                  </tr>
                  <tr>
                    <td style="color: #a78bff; font-weight: bold;">Paleta de colores / Estilo:</td>
                    <td style="color: #ffffff;">${branding_colores || 'No especificado'}</td>
                  </tr>
                  <tr>
                    <td style="color: #a78bff; font-weight: bold;">Enlace a Referencias / Logo:</td>
                    <td style="color: #ffffff;">${branding_referencias ? `<a href="${branding_referencias.startsWith('http') ? branding_referencias : 'https://' + branding_referencias}" target="_blank" style="color: #2ee58f;">${branding_referencias}</a>` : 'Ninguno'}</td>
                  </tr>
                  <tr>
                    <td style="color: #a78bff; font-weight: bold;">¿Es E-Commerce?:</td>
                    <td style="color: #ffffff;">${es_ecommerce || 'No'}</td>
                  </tr>
                  ${es_ecommerce === 'Sí' || num_productos ? `
                  <tr>
                    <td style="color: #a78bff; font-weight: bold;">Cantidad de Productos / SKUs:</td>
                    <td style="color: #2ee58f; font-weight: bold;">${num_productos || 'No especificado'}</td>
                  </tr>
                  <tr>
                    <td style="color: #a78bff; font-weight: bold;">Plataforma E-commerce:</td>
                    <td style="color: #ffffff;">${plataforma_ecommerce || 'No especificado'}</td>
                  </tr>
                  <tr>
                    <td style="color: #a78bff; font-weight: bold;">Logística y Envíos:</td>
                    <td style="color: #ffffff;">${logistica_envios || 'No especificado'}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- FASE 06: CANALES Y RECORRIDO -->
              <div style="margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #2ee58f;">06 · Canales y Recorrido de Cliente</h4>
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #7d968b;"><strong>Canales seleccionados:</strong></p>
                <div style="margin-bottom: 12px;">
                  <span style="display: inline-block; background: rgba(46, 229, 143, 0.15); color: #2ee58f; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: bold;">${canalesStr || 'Ninguno seleccionado'}</span>
                </div>
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #7d968b;"><strong>Canales con mejor rendimiento:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px; font-size: 14px; color: #eaf0ec; margin-bottom: 12px;">${canales_top || 'Sin datos'}</div>
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #7d968b;"><strong>Servicios requeridos con mayor urgencia:</strong></p>
                <div style="background: rgba(46, 229, 143, 0.08); border-left: 3px solid #2ee58f; padding: 10px 14px; border-radius: 0 8px 8px 0; font-size: 14px; color: #ffffff;">${servicios_urgentes || 'Crecimiento Integral'}</div>
              </div>

              <!-- FASE 07: EXPANSION Y METRICAS -->
              <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #2ee58f;">07 · Métricas & Expansión</h4>
                <table width="100%" border="0" cellspacing="0" cellpadding="8" style="background: rgba(255,255,255,0.02); border-radius: 8px; font-size: 13px; margin-bottom: 12px;">
                  <tr>
                    <td width="40%" style="color: #7d968b;">Clientes actuales / mes:</td>
                    <td style="color: #ffffff; font-weight: bold;">${num_clientes || '0'}</td>
                  </tr>
                  <tr>
                    <td style="color: #7d968b;">Ticket promedio:</td>
                    <td style="color: #ffffff; font-weight: bold;">${num_ticket || 'No especificado'}</td>
                  </tr>
                  <tr>
                    <td style="color: #7d968b;">Inversión actual en marketing:</td>
                    <td style="color: #ffffff; font-weight: bold;">${num_inversion || '/bin/zsh'}</td>
                  </tr>
                  <tr>
                    <td style="color: #7d968b;">Presupuesto dispuesto a invertir:</td>
                    <td style="color: #2ee58f; font-weight: bold; font-size: 15px;">${invertir || 'A definir'}</td>
                  </tr>
                </table>
                <p style="margin: 12px 0 6px 0; font-size: 13px; color: #7d968b;"><strong>Meta a 1 y 5 años:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px; font-size: 14px; color: #eaf0ec; margin-bottom: 12px;">${meta_1_5 || 'Sin respuesta'}</div>
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #7d968b;"><strong>Visión de éxito extraordinario:</strong></p>
                <div style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px; font-size: 14px; color: #eaf0ec;">${exito || 'Sin respuesta'}</div>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding: 24px; background: #070b10; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #6b857a;">
              Universa Growth Lab · Big Bang Engine · <a href="https://www.universaagency.com" style="color: #2ee58f; text-decoration: none;">universaagency.com</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Universa Big Bang <tickets@universaagency.com>',
            to: ['info@universaagency.com'],
            subject: `💥 Big Bang™ [${empresaFinal}] — ${nombreFinal}`,
            html: emailHtml
          })
        });

        const resData = await res.json();
        if (res.ok && resData.id) {
          emailSent = true;
          emailId = resData.id;
          console.log('Resend email sent successfully:', resData.id);
        } else {
          console.error('Resend error response:', resData);
        }
      } catch (err: any) {
        console.error('Error sending Resend email:', err.message);
      }
    }

    // -------------------------------------------------------------
    // 2. SAVE INTO AIRTABLE (Big Bang Responses table)
    // -------------------------------------------------------------
    let airtableSaved = false;
    let airtableRecordId = null;
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID || 'appUBoupd69skqaUj';

    if (airtableApiKey && airtableBaseId) {
      try {
        const airtableFields: Record<string, any> = {
          'Nombre': nombreFinal,
          'Email': contacto_email || '',
          'Telefono': contacto_telefono || '',
          'Empresa': empresaFinal,
          'Sitio Web / Redes': contacto_web || '',
          'Fase 1 - Sector': servicios_urgentes || 'General',
          'Fase 1 - Detalle Negocio': `Origen: ${origen}
Misión: ${mision}`,
          'Fase 2 - Madurez': adn_edad || '',
          'Fase 2 - Traccion': `Personalidad: ${adn_personalidad}
Palabras: ${adn_palabras}`,
          'Fase 3 - Desafios': `Competidores: ${competidores}
Análisis: ${comp_bienmal}
Admiras: ${admiras}`,
          'Fase 4 - Servicios Interes': `Ventaja: ${porque_tu}
Promesa: ${promesa}
Recompra: ${recompra}`,
          'Fase 5 - Branding y Colores': `Estado: ${branding_estado}
Colores: ${branding_colores}
Refs: ${branding_referencias}`,
          'Fase 5 - Es Ecommerce': es_ecommerce || 'No',
          'Fase 5 - Cantidad Productos': num_productos || 'N/A',
          'Fase 5 - Plataforma Ecommerce': plataforma_ecommerce || 'N/A',
          'Fase 6 - Presupuesto': invertir || num_inversion || '',
          'Fase 6 - Tiempo Deseado': 'Inmediato',
          'Fase 7 - Expectativas y Notas': `Metas: ${meta_1_5}
Éxito: ${exito}
Notas: ${notas_extra}
Canales: ${canalesStr}`,
          'Fecha Registro': timestamp,
          'Resumen Diagnostico': `Clientes/mes: ${num_clientes} | Ticket: ${num_ticket} | Inversión actual: ${num_inversion} | Canales top: ${canales_top}`,
          'Status': 'Nuevo'
        };

        const atRes = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/Big%20Bang%20Responses`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fields: airtableFields })
        });

        const atData = await atRes.json();
        if (atRes.ok && atData.id) {
          airtableSaved = true;
          airtableRecordId = atData.id;
          console.log('Airtable record saved successfully:', atData.id);
        } else {
          console.error('Airtable insert error:', atData);
        }
      } catch (err: any) {
        console.error('Error saving to Airtable:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Big Bang recibido y procesado con éxito',
      emailSent,
      emailId,
      airtableSaved,
      airtableRecordId
    });

  } catch (error: any) {
    console.error('Fatal error in /api/bigbang:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar el Big Bang' },
      { status: 500 }
    );
  }
}
