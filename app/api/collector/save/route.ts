import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { fileManager } from '@/lib/utils/file-manager';
import { ClientData } from '@/lib/types/client';

export async function POST(request: Request) {
  try {
    const { businessInfo, webStructure } = await request.json();

    if (!businessInfo || !webStructure) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos obligatorios' },
        { status: 400 }
      );
    }

    const clientId = uuidv4();
    const now = new Date().toISOString();

    // Create a complete ClientData object with defaults for other fields
    const clientData: ClientData = {
      info: {
        clientId,
        businessName: webStructure.businessName || 'Nuevo Negocio',
        contactName: businessInfo.find((i: any) => i.field === 'contact_name')?.value || 'Pendiente',
        phone: businessInfo.find((i: any) => i.field === 'phone')?.value || 'Pendiente',
        email: businessInfo.find((i: any) => i.field === 'email')?.value,
        businessType: 'other', // Default, logic could be improved
        createdAt: now,
        updatedAt: now,
      },
      branding: {
        colors: {
          primary: webStructure.colorScheme?.primary || '#7c3aed',
          secondary: webStructure.colorScheme?.secondary,
          accent: webStructure.colorScheme?.accent,
          background: webStructure.colorScheme?.background,
          text: webStructure.colorScheme?.text,
        },
        fonts: {
          primary: 'Inter',
        }
      },
      payment: {
        method: 'stripe', // Default
        status: 'pending',
        amount: 0,
        currency: 'USD',
      },
      collectorInfo: {
        businessInfo,
        webStructure,
      },
      deployment: {
        status: 'not_started',
      }
    };

    // Create directory and save info
    await fileManager.createClientDirectory(clientId);
    await fileManager.saveClientInfo(clientId, clientData);

    return NextResponse.json({
      success: true,
      clientId,
      message: 'Información del collector guardada correctamente'
    });
  } catch (error) {
    console.error('Error saving collector info:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar la información' },
      { status: 500 }
    );
  }
}
