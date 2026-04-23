const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testModel(modelName) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hi");
    const response = await result.response;
    console.log(`✅ ${modelName}: ${response.text().substring(0, 20)}...`);
    return true;
  } catch (error) {
    console.log(`❌ ${modelName}: ${error.message}`);
    return false;
  }
}

async function run() {
  const models = [
    'gemini-2.5-flash',
    'gemini-1.5-flash-002',
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash-001',
    'gemini-1.5-pro-002'
  ];
  for (const m of models) {
    await testModel(m);
  }
}

run();
