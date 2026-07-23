import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('id');

  if (!ticketId) {
    return NextResponse.json({ success: false, error: 'ID de ticket requerido' }, { status: 400 });
  }

  try {
    // 1. Retrieve ticket record from Airtable
    const ticketRecord = await airtableCRM.getClient(ticketId);
    
    if (!ticketRecord) {
      return NextResponse.json({ success: false, error: 'Ticket no encontrado' }, { status: 404 });
    }

    const businessName = ticketRecord.fields['Business Name'] || '';
    const contactName = ticketRecord.fields['Contact Name'] || 'Invitado';
    const email = ticketRecord.fields['Email'] || 'N/A';
    const paymentStatus = ticketRecord.fields['Payment Status'];
    const notes = ticketRecord.fields['Notes'] || '';

    // 2. Validate Payment Status
    if (paymentStatus !== 'PAID') {
      return NextResponse.json({ 
        success: false, 
        error: 'ACCESO DENEGADO: Pago pendiente o ticket inválido.',
        details: { name: contactName, status: paymentStatus }
      }, { status: 400 });
    }

    // 3. Check if already checked-in
    if (notes.startsWith('Checked in at:')) {
      const scanTime = notes.replace('Checked in at: ', '');
      return NextResponse.json({
        success: false,
        alreadyScanned: true,
        error: 'ALERTA: Este ticket ya fue escaneado anteriormente.',
        details: {
          name: contactName,
          tickets: businessName.replace('BELLakeo LAND - ', ''),
          scanTime: new Date(scanTime).toLocaleString('es-ES', { timeZone: 'America/Chicago' })
        }
      });
    }

    // 4. Mark check-in in Airtable Notes field
    const checkInString = `Checked in at: ${new Date().toISOString()}`;
    await airtableCRM.updateFields(ticketId, {
      'Notes': checkInString
    });

    return NextResponse.json({
      success: true,
      message: '¡ACCESO AUTORIZADO! Bienvenido a BELLakeo LAND.',
      details: {
        name: contactName,
        email: email,
        tickets: businessName.replace('BELLakeo LAND - ', '')
      }
    });

  } catch (error: any) {
    console.error('Error scanning ticket:', error.message);
    return NextResponse.json({ success: false, error: 'Error interno del servidor al escanear ticket.' }, { status: 500 });
  }
}
