const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { jsPDF } = require('jspdf');

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Error: RESEND_API_KEY no encontrada en .env.local");
    process.exit(1);
  }

  console.log("Iniciando generación de PDF firmado...");

  // Instantiate jsPDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  // Set custom creation date metadata to July 18, 2026
  const targetDate = new Date('2026-07-18T12:00:00-04:00');
  pdf.setProperties({
    title: 'Contrato de Servicios - Garage Street Food',
    subject: 'Contrato de Prestación de Servicios Digitales',
    author: 'Universa Agency',
    creator: 'Universa Agency System',
    creationDate: targetDate,
    modDate: targetDate
  });

  let y = 20;

  // Header Banner Accent
  pdf.setFillColor(14, 19, 31); // Dark background
  pdf.rect(0, 0, pdfWidth, 40, 'F');
  
  pdf.setFillColor(45, 220, 128); // Emerald line accent
  pdf.rect(0, 38, pdfWidth, 2, 'F');

  // Title & Branding
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text("UNIVERSA AGENCY", 20, 18);
  
  pdf.setFontSize(16);
  pdf.text("CONTRATO DE PRESTACIÓN DE SERVICIOS", 20, 28);
  
  y = 55;

  // Metadata Section
  pdf.setTextColor(14, 19, 31);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text("1. PARTES CONTRATANTES", 20, y);
  y += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  const agreementId = 'sig_1784400000_garage';
  const signedDateStr = '18/07/2026, 12:00:00 p.m.';

  pdf.text(`Cliente / Firmante: Paula Garcia`, 20, y);
  pdf.text(`Empresa: Garage STREET FOOD`, 110, y);
  y += 6;
  pdf.text(`Correo Electrónico: paulagarciab05@gmail.com`, 20, y);
  pdf.text(`Teléfono: +1 (786) 384-9011`, 110, y);
  y += 6;
  pdf.text(`Fecha de Firma: ${signedDateStr}`, 20, y);
  pdf.text(`ID Acuerdo: ${agreementId}`, 110, y);
  y += 12;

  // Object & Investment Section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text("2. SERVICIOS Y PRESUPUESTO ACORDADO", 20, y);
  y += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text("Se acuerda la prestación de servicios detallada en la propuesta de Garage STREET FOOD por las siguientes fases:", 20, y);
  y += 8;

  // Phases
  const phases = [
    { name: "DESARROLLO E-COMMERCE RESTAURANTE & MARKETING DATA", investment: 1400 }
  ];

  phases.forEach((phase, i) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Fase 0${i + 1}: ${phase.name}`, 25, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`$${phase.investment.toLocaleString()} USD`, 160, y, { align: 'right' });
    y += 6;
  });

  pdf.setDrawColor(220, 220, 220);
  pdf.line(20, y, pdfWidth - 20, y);
  y += 6;

  pdf.setFont('helvetica', 'bold');
  pdf.text("TOTAL INVERSIÓN ACUMULADA:", 20, y);
  pdf.setTextColor(45, 220, 128);
  pdf.text("$1,400 USD", 160, y, { align: 'right' });
  pdf.setTextColor(14, 19, 31);
  y += 14;

  // Terms & Clauses Section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text("3. TÉRMINOS Y CLÁUSULAS LEGALES DE PRESTACIÓN", 20, y);
  y += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  const maxTextWidth = pdfWidth - 40;
  const clauses = [
    "POLÍTICA DE NO DEVOLUCIÓN DE DINERO (NO REFUNDS): Dadas la naturaleza de los servicios de consultoría, diseño, producción de creativos, desarrollo técnico y configuración publicitaria (donde se comprometen horas de trabajo profesional y recursos técnicos de forma inmediata), bajo ninguna circunstancia se realizarán devoluciones de dinero una vez iniciado el proyecto o realizado cualquier pago de reserva.",
    "PLAZOS DE ENTREGA Y REQUERIMIENTOS: Los plazos de entrega pactados comenzarán a correr únicamente a partir del día hábil siguiente a la recepción total por parte de la Agencia de todos los insumos, accesos, contraseñas, información y materiales requeridos al CLIENTE. Los retrasos por parte del CLIENTE suspenderán automáticamente los plazos de entrega de la Agencia.",
    "RONDAS DE REVISIÓN Y CAMBIOS: Se incluyen un máximo de 2 (dos) rondas de revisiones/correcciones por fase sobre los entregables presentados. Cualquier modificación posterior al cierre de una fase o que modifique el alcance original acordado se cotizará por separado (tarifa del 20% del valor de la fase por ronda adicional de corrección).",
    "PROPIEDAD DE CONTENIDOS Y ACTIVOS: Todo el contenido y activos digitales desarrollados (sitios web, códigos, videos UGC, copys, artes e integraciones) pertenecerán en su totalidad y de forma exclusiva al CLIENTE una vez se haya liquidado el 100% de los pagos acordados en este acuerdo comercial."
  ];

  clauses.forEach((clause) => {
    const titlePart = clause.split(':')[0] + ":";
    const contentPart = clause.split(':')[1] || '';
    
    pdf.setFont('helvetica', 'bold');
    const formattedTitle = pdf.splitTextToSize(titlePart, maxTextWidth);
    
    if (y + (formattedTitle.length * 5) > pdfHeight - 25) {
      pdf.addPage();
      y = 25;
    }

    pdf.text(formattedTitle, 20, y);
    y += (formattedTitle.length * 4.5);

    pdf.setFont('helvetica', 'normal');
    const formattedContent = pdf.splitTextToSize(contentPart.trim(), maxTextWidth);
    pdf.text(formattedContent, 20, y);
    y += (formattedContent.length * 4.5) + 5;
  });

  y += 5;

  if (y + 50 > pdfHeight - 20) {
    pdf.addPage();
    y = 25;
  }

  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, y, pdfWidth - 20, y);
  y += 10;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text("FIRMAS DE CONFORMIDAD", 20, y);
  y += 10;

  // Signatures
  const signY = y;
  
  // Left side: Agency representative details
  pdf.setTextColor(14, 19, 31);
  pdf.text("UNIVERSA AGENCY S.A.", 20, signY);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.text("Firma de Representación Autorizada", 20, signY + 5);
  
  // Written digital signature for Representative
  pdf.setFont('times', 'italic');
  pdf.setFontSize(22);
  pdf.setTextColor(15, 80, 200); // Blue cursive ink
  pdf.text("Universa Lab", 24, signY + 25);

  pdf.setDrawColor(150, 150, 150);
  pdf.setLineWidth(0.25);
  pdf.line(20, signY + 28, 85, signY + 28);

  // Right side: Client signature details
  pdf.setTextColor(14, 19, 31);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text("EL CLIENTE (CONTRATANTE)", 110, signY);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.text("Nombre: Paula Garcia", 110, signY + 5);
  pdf.text("Cargo/Empresa: Garage STREET FOOD", 110, signY + 9);
  
  // Written digital signature for Paula Garcia
  pdf.setFont('times', 'italic');
  pdf.setFontSize(22);
  pdf.setTextColor(45, 220, 128); // Emerald cursive ink
  pdf.text("Paula Garcia", 114, signY + 25);

  pdf.setDrawColor(150, 150, 150);
  pdf.setLineWidth(0.25);
  pdf.line(110, signY + 28, 175, signY + 28);

  // Reset text color
  pdf.setTextColor(14, 19, 31);

  // Footer notice
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Este documento fue firmado digitalmente bajo el código de seguridad única ${agreementId}.`, 20, pdfHeight - 12);
  pdf.text("Universa Agency LLC © 2026. Todos los derechos reservados.", pdfWidth - 20, pdfHeight - 12, { align: 'right' });

  // 1. Save PDF locally in the project root
  const buffer = pdf.output('arraybuffer');
  fs.writeFileSync(path.join(__dirname, '../garage_street_food_contrato_firmado.pdf'), Buffer.from(buffer));
  console.log("PDF guardado localmente en el directorio raíz.");

  // 2. Generate Base64 for Email
  const pdfOutput = pdf.output('datauristring');
  const base64Data = pdfOutput.split(',')[1];

  console.log("Enviando correos...");

  // Try using different 'from' addresses to see if they verified their custom domain
  const trySend = async (fromAddress, toAddress) => {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [toAddress],
          subject: '✍️ Contrato Firmado: Paula Garcia (Garage STREET FOOD)',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #0e131f; border-bottom: 2px solid #2ddc80; padding-bottom: 10px;">Contrato Digital Firmado</h2>
              <p>Se adjunta el contrato digital formalizado por <strong>Paula Garcia</strong> para la propuesta de <strong>Garage STREET FOOD</strong> con fecha de efectividad al 18 de Julio de 2026.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 10px; font-weight: bold; width: 35%;">Cliente / Firmante:</td>
                  <td style="padding: 10px;">Paula Garcia</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold;">Empresa:</td>
                  <td style="padding: 10px;">Garage STREET FOOD</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold;">ID de Acuerdo:</td>
                  <td style="padding: 10px;"><code>${agreementId}</code></td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold;">Inversión Total:</td>
                  <td style="padding: 10px; font-weight: bold; color: #2ddc80;">$1,400 USD (Pago Único al Finalizar)</td>
                </tr>
              </table>
              <p>El PDF original firmado se encuentra adjunto.</p>
            </div>
          `,
          attachments: [
            {
              content: base64Data,
              filename: 'garage_street_food_contrato_firmado.pdf'
            }
          ]
        })
      });
      const data = await response.json();
      return { ok: response.ok, from: fromAddress, to: toAddress, data };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  // 1. Send test to owner email via onboarding (guaranteed to work)
  const r1 = await trySend('Acuerdos Universa <onboarding@resend.dev>', 'info@universaagency.com');
  console.log("Envío onboarding -> info@universaagency.com:", r1);

  // 2. Try sending using custom domain from jose@universa.agency to other emails
  const r2 = await trySend('Universa Agency <jose@universa.agency>', 'paulagarciab05@gmail.com');
  console.log("Envío jose@universa.agency -> paulagarciab05@gmail.com:", r2);
  
  const r3 = await trySend('Universa Agency <jose@universa.agency>', 'josefigueroa.marketing@gmail.com');
  console.log("Envío jose@universa.agency -> josefigueroa.marketing@gmail.com:", r3);
}

main();
