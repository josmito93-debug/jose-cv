import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MODEL_NAME = 'gemini-2.5-flash';

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

const SYSTEM_PROMPT = `
Eres Attom, la Inteligencia Artificial de Universa Agency encargada de la arquitectura de ecosistemas digitales. 
Tu misión no es recolectar datos, sino DESCUBRIR la esencia del negocio para proyectarla en una web de alta gama.

DATOS QUE DEBES EXTRAER (Identifiers):
- businessName: Nombre comercial.
- businessType: Tipo de negocio.
- valueProp: El "por qué" el cliente debería elegirlos.
- contact: WhatsApp o Email.
- brandStyle: Vibración (Minimalista, Lujoso, Tecnológico).
- industry: Sector específico.
- reference: Instagram o web actual.

FORMATO DE RESPUESTA (JSON):
{
  "response": "Tu feedback estratégico y siguiente pregunta.",
  "extractedInfo": [
    { "field": "identifier", "value": "Texto extraído o inferido" }
  ]
}
`;

async function scrapeUrl(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
    const textContent = data.replace(/<[^>]+>/g, ' ').substring(0, 2000);
    return `Título: ${titleMatch ? titleMatch[1] : ''}\nContenido: ${textContent}`;
  } catch (error) {
    return 'No se pudo acceder al contenido.';
  }
}

async function generateWithRetry(prompt: string, retries = 3) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return (await result.response).text();
    } catch (error: any) {
      if ((error.message?.includes('503') || error.message?.includes('429')) && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, currentInfo } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ response: '¡Hola! Soy tu arquitecto digital. ¿Cuál es el nombre de tu proyecto?', extractedInfo: [] });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = lastUserMessage.match(urlRegex);
    let scrapedContext = '';

    if (urls) {
      for (const url of urls) {
        scrapedContext += await scrapeUrl(url);
      }
    }

    const historyText = messages.slice(-5).map((m: any) => `${m.role}: ${m.content}`).join('\n');
    const prompt = `${SYSTEM_PROMPT}\n\nCONTEXTO ACTUAL: ${JSON.stringify(currentInfo || [])}\n\nSCRAPING: ${scrapedContext}\n\nHISTORIAL:\n${historyText}\n\nUSUARIO: ${lastUserMessage}\n\nResponde estrictamente en JSON.`;

    const responseText = await generateWithRetry(prompt);
    if (!responseText) throw new Error('No se pudo generar respuesta');

    const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedJson);

    const extractedInfo: BusinessInfo[] = [];
    if (parsedData.extractedInfo) {
      parsedData.extractedInfo.forEach((item: any) => {
        const meta = BUSINESS_FIELDS[item.field];
        if (meta) {
          extractedInfo.push({
            id: `${item.field}-${Date.now()}`,
            field: item.field,
            label: meta.label,
            value: item.value,
            icon: meta.icon,
            confirmed: true,
            timestamp: new Date().toISOString()
          });
        }
      });
    }

    return NextResponse.json({ response: parsedData.response, extractedInfo, success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
