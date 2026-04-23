import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

export async function generateImage(prompt: string) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY || '');
    // gemini-2.5-flash es el modelo con cuota verificada en mis pruebas
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Generated response:', text);
    return text;
  } catch (error) {
    console.error('Error in generation:', error);
    throw error;
  }
}

// Ejemplo de uso
export async function testImageGeneration() {
  const prompt = "A futuristic city with flying cars and neon lights";
  
  try {
    const result = await generateImage(prompt);
    console.log('Generation successful:', result);
    return result;
  } catch (error) {
    console.error('Failed generation:', error);
    return null;
  }
}