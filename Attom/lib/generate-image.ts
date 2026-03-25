import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_AI_API_KEY || 'AIzaSyDqh9Jx3jbSBFUaPV6EJM9BAkYt3tqZDf4';

export async function generateImage(prompt: string) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Generated image response:', text);
    return text;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

// Ejemplo de uso
export async function testImageGeneration() {
  const prompt = "A futuristic city with flying cars and neon lights";
  
  try {
    const result = await generateImage(prompt);
    console.log('Image generated successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to generate image:', error);
    return null;
  }
}