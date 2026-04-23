import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from '@/lib/chatbot/knowledge';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MODEL_NAME = 'gemini-2.5-flash';

async function getChatResponseWithRetry(messages: any[], retries = 3) {
  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT
  });

  const latestMessage = messages[messages.length - 1].content;
  
  for (let i = 0; i < retries; i++) {
    try {
      if (messages.length > 1) {
        const history = messages.slice(0, -1).map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

        const chat = model.startChat({
          history: history,
          generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
        });

        const result = await chat.sendMessage(latestMessage);
        return (await result.response).text();
      } else {
        const result = await model.generateContent(latestMessage);
        return (await result.response).text();
      }
    } catch (error: any) {
      console.error(`Error en intento ${i + 1} (${MODEL_NAME}):`, error.message);
      if ((error.message?.includes('503') || error.message?.includes('429')) && i < retries - 1) {
        // Espera exponencial: 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, action, clientInfo } = body;

    if (action === 'save' && clientInfo) {
      const result = await airtableCRM.syncClient({
        'Business Name': clientInfo.businessName || 'Cliente de Chat',
        'Contact Name': clientInfo.contactName || 'Pendiente',
        'Email': clientInfo.email || '',
        'Phone': clientInfo.phone || '',
        'Status': 'Lead',
        'Payment Status': 'PENDING'
      });
      return NextResponse.json({ success: true, recordId: result.id });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensajes inválidos' }, { status: 400 });
    }

    const responseText = await getChatResponseWithRetry(messages);
    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error('Error Crítico:', error);
    return NextResponse.json({ 
      error: error.message, 
      status: 'BUSY',
      suggestion: 'El servidor de Google está saturado. Por favor, espera un momento y vuelve a enviar tu mensaje.'
    }, { status: 500 });
  }
}
