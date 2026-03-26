import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/chatbot/knowledge';

// Interfaz para los mensajes
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Función para llamar a la API de Claude (Anthropic)
async function getChatResponse(messages: Message[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY no está configurada');
    return 'Lo siento, el servicio de chat no está disponible en este momento. Por favor, contáctanos por WhatsApp.';
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // Modelo rápido y económico
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error de Claude:', error);
      throw new Error('Error al comunicarse con Claude');
    }

    const data = await response.json();
    return data.content[0]?.text || 'No pude generar una respuesta.';

  } catch (error) {
    console.error('Error en getChatResponse:', error);
    return 'Hubo un error al procesar tu mensaje. Por favor, intenta de nuevo o contáctanos por WhatsApp.';
  }
}

// Respuestas rápidas para preguntas comunes (sin usar IA)
function getQuickResponse(message: string): string | null {
  const lowerMessage = message.toLowerCase().trim();

  // Saludos
  if (['hola', 'hi', 'hello', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches'].some(g => lowerMessage.includes(g))) {
    return '¡Hola! 👋 Soy el asistente de ATTOM. ¿En qué puedo ayudarte hoy? Puedo contarte sobre nuestro servicio de creación de páginas web o resolver tus dudas.';
  }

  // Precio directo
  if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto cuesta') || lowerMessage.includes('cuanto cuesta')) {
    return '💰 ¡Excelente pregunta! El diseño de tu web es **GRATIS**. Solo pagas el hosting de $29.29/mes para mantener tu web activa 24/7 con SSL incluido. ¿Te gustaría comenzar?';
  }

  // Tiempo
  if (lowerMessage.includes('cuánto tarda') || lowerMessage.includes('cuanto tarda') || lowerMessage.includes('tiempo') || lowerMessage.includes('días')) {
    return '⏱️ El proceso completo toma entre **5-7 días hábiles** desde que nos envías toda la información de tu negocio. ¿Quieres conocer los pasos del proceso?';
  }

  return null; // No hay respuesta rápida, usar IA
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, userMessage } = body;

    if (!userMessage && (!messages || messages.length === 0)) {
      return NextResponse.json(
        { error: 'Se requiere un mensaje' },
        { status: 400 }
      );
    }

    // Intentar respuesta rápida primero
    const currentMessage = userMessage || messages[messages.length - 1]?.content;
    const quickResponse = getQuickResponse(currentMessage);

    if (quickResponse) {
      return NextResponse.json({
        response: quickResponse,
        isQuickResponse: true
      });
    }

    // Si no hay respuesta rápida, usar IA
    const chatMessages: Message[] = messages || [{ role: 'user', content: userMessage }];
    const aiResponse = await getChatResponse(chatMessages);

    return NextResponse.json({
      response: aiResponse,
      isQuickResponse: false
    });

  } catch (error) {
    console.error('Error en /api/chatbot:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        response: 'Lo siento, hubo un error. Por favor, intenta de nuevo.'
      },
      { status: 500 }
    );
  }
}

// GET para verificar que la API está funcionando
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'ATTOM Chatbot API está funcionando',
    endpoints: {
      POST: 'Envía un mensaje al chatbot',
      body: {
        messages: 'Array de mensajes con role y content',
        userMessage: 'O simplemente el mensaje del usuario'
      }
    }
  });
}
