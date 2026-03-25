const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyDqh9Jx3jbSBFUaPV6EJM9BAkYt3tqZDf4';

async function generateDogImage() {
  try {
    const prompt = "Un perro feliz jugando en un parque verde con sol brillante";
    
    const data = JSON.stringify({
      instances: [{
        prompt: prompt
      }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1"
      }
    });
    
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: '/v1beta/models/imagen-4.0-generate-001:predict',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'x-goog-api-key': API_KEY
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log('Generated image response:', responseData);
        
        // Guardar la respuesta en un archivo
        const outputPath = path.join(__dirname, '../generated-dog-image.json');
        fs.writeFileSync(outputPath, responseData);
        
        console.log('Image response saved to:', outputPath);
      });
    });
    
    req.on('error', (error) => {
      console.error('Error:', error);
    });
    
    req.write(data);
    req.end();
    
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

generateDogImage().catch(console.error);