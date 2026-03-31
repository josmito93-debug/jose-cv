import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Import existing BUSINESS_FIELDS from original file conceptually, or redefine them here for reference
const BUSINESS_FIELDS: Record<string, { label: string; icon: string }> = {
  businessName: { label: 'Nombre del Negocio', icon: '🏢' },
  businessType: { label: 'Tipo de Negocio', icon: '🛍️' },
  industry: { label: 'Industria/Sector', icon: '🏗️' },
  valueProp: { label: 'Propuesta de Valor', icon: '✨' },
  contact: { label: 'Contacto Directo', icon: '📞' },
  email: { label: 'Email Corporativo', icon: '📧' },
  brandStyle: { label: 'Estética de Marca', icon: '🎨' },
  reference: { label: 'URL de Referencia', icon: '🔗' },
  logo: { label: 'Logotipo', icon: '🖼️' },
  targetAudience: { label: 'Audiencia Objetivo', icon: '👥' },
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
  role: 'user' | 'assistant' | 'model';
  content: string;
}

const SYSTEM_PROMPT = `
Eres Attom, la Inteligencia Artificial de Universa Agency encargada de la arquitectura de ecosistemas digitales. 
Tu misión no es recolectar datos, sino DESCUBRIR la esencia del negocio para proyectarla en una web de alta gama.

DATOS QUE DEBES EXTRAER (Identifiers):
- businessName: Nombre comercial.
- businessType: Tipo de negocio (Restaurante, SaaS, etc).
- valueProp: El "por qué" el cliente debería elegirlos.
- contact: WhatsApp o Email.
- brandStyle: Vibración (Minimalista, Lujoso, Tecnológico).
- industry: Sector específico.
- reference: Instagram o web actual.

CRITERIOS:
1. Habla como un consultor de tecnología de Silicon Valley: sofisticado, minimalista y visionario.
2. NUNCA preguntes como un formulario. Si te dan un dato, elógialo analíticamente y haz la siguiente pregunta estratégica.
3. Si el usuario envía una URL, el contenido scrapeado se te proporcionará. Úsalo para validar y autocompletar campos sin preguntar lo que ya sabes.

FORMATO DE RESPUESTA (JSON):
{
  "response": "Tu feedback estratégico y siguiente pregunta.",
  "extractedInfo": [
    { "field": "identifier", "value": "Texto extraído o inferido" }
  ]
}

NUNCA respondas con texto plano fuera del JSON.
`;

// Helper: Scrape URL content
async function scrapeUrl(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url, { 
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0 (JF.OS Attom Bot)' }
    });
    const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    const metaDescMatch = data.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const metaDesc = metaDescMatch ? metaDescMatch[1] : '';
    const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let textContent = '';
    if (bodyMatch) {
      let cleanBody = bodyMatch[1].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      cleanBody = cleanBody.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
      cleanBody = cleanBody.replace(/<[^>]+>/g, ' ');
      cleanBody = cleanBody.replace(/\s+/g, ' ').trim();
      textContent = cleanBody.substring(0, 3000);
    }
    return `Título Web: ${title}\nMeta Descripción: ${metaDesc}\nContenido: ${textContent}`;
  } catch (error) {
    return 'No se pudo acceder al contenido.';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, currentInfo } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: GEMINI_API_KEY is missing in environment.');
      return NextResponse.json({
        response: 'ERR_CONFIG: La API Key de Gemini no está configurada en los Secretos de Vercel.',
        extractedInfo: [],
        success: false
      }, { status: 500 });
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        response: '¡Protocolo Attom Iniciado! Soy tu arquitecto digital. ¿Cuál es el nombre de tu proyecto?',
        extractedInfo: [],
        success: true
      });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = lastUserMessage.match(urlRegex);
    let scrapedContext = '';

    if (urls && urls.length > 0) {
      for (const url of urls) {
        scrapedContext += `\n\nCONTENIDO EXTRAÍDO DE ${url}:\n`;
        scrapedContext += await scrapeUrl(url);
      }
    }

    // Build History
    const historyText = messages.slice(-6).map((m: any) => `${m.role === 'user' ? 'USER' : 'ATTOM'}: ${m.content}`).join('\n');
    
    const prompt = `
${SYSTEM_PROMPT}

CONTEXTO ACTUAL RECOPILADO:
${JSON.stringify(currentInfo || [])}

${scrapedContext ? `CONTEXTO EXTERNO (Web Scraping):\n${scrapedContext}\n` : ''}

ULTIMOS MENSAJES:
${historyText}

NUEVO MENSAJE DEL USUARIO:
${lastUserMessage}

Responde extrictamente en JSON. Asegúrate de incluir por lo menos el campo "response".
`;

    // Setup Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Use a slightly more robust generation
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
        // We'll trust the prompt for JSON if responseMimeType is causing issues in some environments
      }
    });

    const responseText = result.response.text();
    
    let parsedData;
    try {
      // Robust JSON cleaning
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanedJson);
    } catch (e) {
      console.error("RAW AI RESPONSE:", responseText);
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        parsedData = JSON.parse(match[0]);
      } else {
        return NextResponse.json({
          response: 'He tenido una interferencia en la señal. ¿Puedes repetirme eso de forma más sencilla?',
          extractedInfo: [],
          success: false
        });
      }
    }

    // Process extracted info
    const extractedInfo: BusinessInfo[] = [];
    if (parsedData.extractedInfo && Array.isArray(parsedData.extractedInfo)) {
      parsedData.extractedInfo.forEach((item: any) => {
        if (!item.field || !item.value) return;
        const fieldMeta = BUSINESS_FIELDS[item.field];
        if (fieldMeta) {
          extractedInfo.push({
            id: `${item.field}-${Date.now()}`,
            field: item.field,
            label: fieldMeta.label,
            value: item.value,
            icon: fieldMeta.icon,
            confirmed: true,
            timestamp: new Date().toISOString()
          });
        }
      });
    }

    return NextResponse.json({
      response: parsedData.response || "Excelente punto. ¿Qué más debería saber?",
      extractedInfo,
      success: true
    });

  } catch (error: any) {
    console.error('CRITICAL ERROR in chat-collector:', error);
    return NextResponse.json({
      response: `FALLO_NEURONAL: ${error.message || 'Error desconocido'}. ¿Podemos intentarlo de nuevo?`,
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
