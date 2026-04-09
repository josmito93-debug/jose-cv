
import { NextRequest, NextResponse } from 'next/server';

// Tipos
export interface BusinessInfo {
  id: string;
  field: string;
  label: string;
  value: string;
  icon: string;
  confirmed: boolean;
  timestamp: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Campos que queremos extraer
const BUSINESS_FIELDS: Record<string, { label: string; icon: string }> = {
  businessName: { label: 'Nombre del Negocio', icon: '🏢' },
  city: { label: 'Ciudad/Zona', icon: '📍' },
  email: { label: 'Email de Contacto', icon: '📧' },
  phone: { label: 'Teléfono', icon: '📞' },
  socialMedia: { label: 'Redes Sociales', icon: '📱' },
  services: { label: 'Servicios/Productos', icon: '🛍️' },
  brandColors: { label: 'Colores de Marca', icon: '🎨' },
  logo: { label: 'Logo', icon: '🖼️' },
  schedule: { label: 'Horarios de Atención', icon: '🕐' },
  exactLocation: { label: 'Ubicación Exacta', icon: '🗺️' },
  companyHistory: { label: 'Historia de la Empresa', icon: '📖' },
  team: { label: 'Equipo', icon: '👥' },
};

// Flujo de preguntas simulado
const CONVERSATION_FLOW = [
  {
    keywords: [],
    defaultResponse: '¡Hola! 👋 Soy el asistente de ATTOM. Voy a ayudarte a crear tu página web profesional.\n\n¿Cuál es el **nombre de tu negocio**?',
    extractField: null,
    nextQuestion: '¿En qué **ciudad o zona** operas principalmente?'
  },
  {
    keywords: ['ciudad', 'zona', 'ubicación', 'donde'],
    extractField: 'businessName',
    nextQuestion: '¡Excelente! 📍 ¿En qué **ciudad o zona** operas principalmente?'
  },
  {
    keywords: ['email', 'correo', 'contacto'],
    extractField: 'city',
    nextQuestion: '¡Perfecto! 📧 ¿Cuál es tu **email de contacto**?'
  },
  {
    keywords: ['teléfono', 'telefono', 'whatsapp', 'número', 'numero', 'celular'],
    extractField: 'email',
    nextQuestion: '¡Genial! 📞 ¿Cuál es tu **teléfono o WhatsApp** de contacto?'
  },
  {
    keywords: ['instagram', 'facebook', 'redes', 'social', 'tiktok'],
    extractField: 'phone',
    nextQuestion: '¡Muy bien! 📱 ¿Tienes **redes sociales**? (Instagram, Facebook, etc.)'
  },
  {
    keywords: ['servicio', 'producto', 'vende', 'ofrece', 'hace'],
    extractField: 'socialMedia',
    nextQuestion: '¡Excelente! 🛍️ ¿Qué **servicios o productos** ofreces?'
  },
  {
    keywords: ['color', 'marca', 'diseño', 'estilo'],
    extractField: 'services',
    nextQuestion: '¡Interesante! 🎨 ¿Tienes **colores de marca** preferidos? (ej: azul y blanco)'
  },
  {
    keywords: ['logo', 'imagen', 'logotipo'],
    extractField: 'brandColors',
    nextQuestion: '¡Perfecto! 🖼️ ¿Ya tienes un **logo** o necesitas que te ayudemos a crear uno?'
  },
  {
    keywords: ['horario', 'hora', 'atención', 'atencion', 'abierto'],
    extractField: 'logo',
    nextQuestion: '¡Genial! 🕐 ¿Cuáles son tus **horarios de atención**?'
  },
  {
    keywords: ['dirección', 'direccion', 'calle', 'local', 'tienda'],
    extractField: 'schedule',
    nextQuestion: '¡Muy bien! 🗺️ ¿Cuál es tu **dirección o ubicación exacta**?'
  },
  {
    keywords: ['historia', 'sobre', 'nosotros', 'empresa', 'negocio', 'empezó', 'inicio'],
    extractField: 'exactLocation',
    nextQuestion: '¡Excelente! 📖 Cuéntame un poco la **historia de tu empresa**. ¿Cómo empezó?'
  },
  {
    keywords: ['equipo', 'empleado', 'trabajador', 'persona', 'staff'],
    extractField: 'companyHistory',
    nextQuestion: '¡Casi terminamos! 👥 ¿Tienes un **equipo**? Cuéntame sobre ellos.'
  },
  {
    keywords: ['listo', 'terminar', 'finalizar', 'ya', 'todo'],
    extractField: 'team',
    nextQuestion: '🎉 ¡Excelente! Ya tengo toda la información necesaria.\n\nHaz clic en **"Finalizar"** para generar la estructura de tu web.'
  }
];

function detectFieldFromMessage(message: string, collectedFields: string[]): { field: string | null; response: string } {
  const lowerMessage = message.toLowerCase();

  // Determinar qué campo extraer basado en los campos ya recopilados
  const fieldsOrder = ['businessName', 'city', 'email', 'phone', 'socialMedia', 'services', 'brandColors', 'logo', 'schedule', 'exactLocation', 'companyHistory', 'team'];

  // Encontrar el siguiente campo a recopilar
  let nextFieldIndex = 0;
  for (let i = 0; i < fieldsOrder.length; i++) {
    if (!collectedFields.includes(fieldsOrder[i])) {
      nextFieldIndex = i;
      break;
    }
  }

  const currentField = fieldsOrder[nextFieldIndex];
  const nextField = fieldsOrder[nextFieldIndex + 1];

  // Generar respuesta apropiada
  let response = '';

  if (collectedFields.length === 0) {
    // Primera interacción - extraer nombre del negocio
    response = `¡Perfecto! He registrado tu negocio. 📝\n\n¿En qué **ciudad o zona** operas principalmente?`;
    return { field: 'businessName', response };
  }

  // Respuestas según el campo actual
  const responses: Record<string, string> = {
    city: `¡Excelente ubicación! 📍\n\n¿Cuál es tu **email de contacto**?`,
    email: `¡Perfecto! 📧\n\n¿Cuál es tu **teléfono o WhatsApp**?`,
    phone: `¡Genial! 📞\n\n¿Tienes **redes sociales**? (Instagram, Facebook, TikTok, etc.)`,
    socialMedia: `¡Muy bien! 📱\n\n¿Qué **servicios o productos** ofreces? Descríbelos brevemente.`,
    services: `¡Interesante! 🛍️\n\n¿Tienes **colores de marca** preferidos? (ej: "azul y dorado", "rojo corporativo")`,
    brandColors: `¡Me encantan esos colores! 🎨\n\n¿Ya tienes un **logo** o necesitas que creemos uno?`,
    logo: `¡Perfecto! 🖼️\n\n¿Cuáles son tus **horarios de atención**?`,
    schedule: `¡Muy bien! 🕐\n\n¿Cuál es tu **dirección o ubicación exacta**? (o si solo operas online, dímelo)`,
    exactLocation: `¡Excelente! 🗺️\n\n📖 Cuéntame brevemente la **historia de tu empresa**. ¿Cómo empezaron?`,
    companyHistory: `¡Qué historia interesante! 📖\n\n👥 Por último, ¿tienes un **equipo de trabajo**? Cuéntame sobre ellos.`,
    team: `🎉 **¡Perfecto! Ya tengo toda la información.**\n\nHaz clic en el botón **"Finalizar"** abajo para generar la estructura completa de tu web.`
  };

  response = responses[currentField] || `¡Gracias! ¿Algo más que quieras agregar?`;

  return { field: currentField, response };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, currentInfo } = body;

    // Si no hay mensajes, dar bienvenida
    if (!messages || messages.length === 0) {
      return NextResponse.json({
        response: '¡Hola! 👋 Soy el asistente de ATTOM.\n\nVoy a ayudarte a recopilar la información de tu negocio para crear tu página web profesional.\n\n¿Cuál es el **nombre de tu negocio**?',
        extractedInfo: [],
        success: true
      });
    }

    // Obtener el último mensaje del usuario
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Obtener campos ya recopilados
    const collectedFields = (currentInfo || []).map((info: BusinessInfo) => info.field);

    // Detectar qué información extraer
    const { field, response } = detectFieldFromMessage(lastUserMessage, collectedFields);

    // Crear bloque de información si se detectó un campo
    const extractedInfo: BusinessInfo[] = [];

    if (field && !collectedFields.includes(field) && lastUserMessage.trim().length > 0) {
      const fieldMeta = BUSINESS_FIELDS[field];
      extractedInfo.push({
        id: `${field}-${Date.now()}`,
        field: field,
        label: fieldMeta?.label || field,
        value: lastUserMessage.trim(),
        icon: fieldMeta?.icon || '📝',
        confirmed: true,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      response,
      extractedInfo,
      success: true
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      response: 'Hubo un error. Por favor intenta de nuevo.',
      extractedInfo: [],
      success: false
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: 'SIMULADO (sin API)',
    message: 'Chat funcionando en modo demo',
    fields: Object.keys(BUSINESS_FIELDS)
  });
}
