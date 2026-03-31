import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Import existing BUSINESS_FIELDS from original file conceptually, or redefine them here for reference
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
  role: 'user' | 'assistant' | 'model'; // Gemini uses 'model' instead of 'assistant' sometimes, or we map it.
  content: string;
}

const SYSTEM_PROMPT = `
Eres Attom, un asistente virtual avanzado e inteligente de Universa Agency. 
Tu misión es conversar con el cliente para recopilar información clave de su negocio para poder construirle una página web profesional.

Debes extraer la siguiente información durante la conversación (cuando sea natural):
- businessName: Nombre del Negocio
- city: Ciudad o zona de operación
- email: Email de contacto
- phone: Teléfono o WhatsApp
- socialMedia: Redes sociales
- services: Servicios o productos que ofrece
- brandColors: Colores de marca
- logo: Si tiene logo o requiere uno
- schedule: Horarios de atención
- exactLocation: Ubicación exacta (o si es solo virtual)
- companyHistory: Breve historia de la empresa
- team: Si tiene un equipo de trabajo

Reglas críticas:
1. Haz las preguntas UNA POR UNA, de forma conversacional y amigable. No abrumes al usuario haciendo muchas preguntas a la vez.
2. Si el usuario te proporciona la URL de su página web actual o red social, indícale que vas a extraer información automáticamente para agilizar el proceso basado en esa web y agradécele.
3. SIEMPRE debes retornar un objeto JSON estricto usando este esquema:
{
  "response": "El mensaje que le dirás al usuario. (Mantenlo conversacional, amigable y usando emojis modestamente)",
  "extractedInfo": [
    {
      "field": "identificador_del_campo", 
      "value": "el valor extraído o resumido de lo que dijo el usuario"
    }
  ]
}

- Asegúrate de que los identificadores de campo coincidan exactamente con la lista provista.
- Si en este último turno no lograste extraer ninguna información nueva o ya tenías la información extraída, 'extractedInfo' puede ser un arreglo vacío [].
- NUNCA devuelvas Markdown fuera del JSON, SOLO retorna el objeto JSON.
`;

// Helper: Scrape URL content
async function scrapeUrl(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url, { timeout: 8000 });
    // Very basic extraction using regex to avoid external DOM parsing dependencies
    const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';

    const metaDescMatch = data.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const metaDesc = metaDescMatch ? metaDescMatch[1] : '';

    const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let textContent = '';
    if (bodyMatch) {
      // Strip script and style tags
      let cleanBody = bodyMatch[1].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      cleanBody = cleanBody.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
      // Strip HTML tags
      cleanBody = cleanBody.replace(/<[^>]+>/g, ' ');
      // Compress whitespace
      cleanBody = cleanBody.replace(/\s+/g, ' ').trim();
      textContent = cleanBody.substring(0, 3000); // Only first 3000 chars to save tokens
    }

    return `Título Web: ${title}\nMeta Descripción: ${metaDesc}\nContenido Principal (truncado): ${textContent}`;
  } catch (error) {
    console.error('Scraping error:', error);
    return 'No se pudo acceder al contenido de la URL.';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, currentInfo } = body;

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response: 'La API Key de Gemini no está configurada.',
        extractedInfo: [],
        success: false
      }, { status: 500 });
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        response: '¡Hola! 👋 Soy Attom, el asistente de creación web. ¿De qué trata tu negocio o cuál es su nombre?',
        extractedInfo: [],
        success: true
      });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    
    // Check for URLs in the user message
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = lastUserMessage.match(urlRegex);
    let scrapedContext = '';

    if (urls && urls.length > 0) {
      for (const url of urls) {
        scrapedContext += `\n\nContenido scrapeado de ${url}:\n`;
        scrapedContext += await scrapeUrl(url);
      }
    }

    // Build the instruction for this turn
    let turnInstruction = 'Por favor responde al último mensaje del usuario, extrae cualquier información pertinente y si falta información, haz la siguiente pregunta lógica.\\n';
    
    if (scrapedContext) {
      turnInstruction += `El usuario compartió uno o más enlaces. Usa esta información extraída para autocompletar la información restante que falta del negocio: ${scrapedContext}\n`;
    }

    turnInstruction += 'Información ya recopilada hasta ahora (No la repitas ni la extraigas de nuevo si ya tiene valor):\\n' + JSON.stringify(currentInfo || []) + '\\n';
    turnInstruction += 'Mensaje del usuario actual: ' + lastUserMessage;

    // Setup Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: 'v1beta' });
    
    // We can map earlier history if needed, but for simplicity we'll just send the system prompt + history as one prompt or use chat
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }]
        },
        {
          role: "model",
          parts: [{ text: "Entendido, soy Attom y extraeré información devolviendo únicamente un objeto JSON." }]
        },
        // We could inject previous context here, but keeping it simple for the turn format
      ],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await chat.sendMessage(turnInstruction);
    const responseText = result.response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      return NextResponse.json({
        response: 'Lo siento, hubo una confusión al procesar la información. ¿Puedes repetir eso?',
        extractedInfo: [],
        success: false
      });
    }

    // Format new information blocks
    const extractedInfo: BusinessInfo[] = [];
    if (parsedData.extractedInfo && Array.isArray(parsedData.extractedInfo)) {
      for (const item of parsedData.extractedInfo) {
        const fieldMeta = BUSINESS_FIELDS[item.field];
        if (fieldMeta) {
          extractedInfo.push({
            id: `${item.field}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            field: item.field,
            label: fieldMeta.label,
            value: item.value,
            icon: fieldMeta.icon,
            confirmed: true,
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({
      response: parsedData.response || "Comprendido.",
      extractedInfo,
      success: true
    });

  } catch (error) {
    console.error('Error in chat-collector:', error);
    return NextResponse.json({
      response: 'Hubo un error del servidor. Por favor intenta de nuevo.',
      extractedInfo: [],
      success: false
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: 'ATTO-GEMINI (AI Powered)',
    message: 'Attom Chat Collector is active with Gemini and Web Scraping capabilities.'
  });
}
