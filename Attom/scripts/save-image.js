const fs = require('fs');
const path = require('path');

// Extraer el base64 del archivo de respuesta
const responsePath = path.join(__dirname, '../generated-dog-image.json');
const response = JSON.parse(fs.readFileSync(responsePath, 'utf8'));

// Obtener el base64 de la imagen
const base64Data = response.predictions[0].bytesBase64Encoded;

// Guardar como archivo PNG
const imagePath = path.join(__dirname, '../dog-image.png');
fs.writeFileSync(imagePath, base64Data, 'base64');

console.log('Image saved to:', imagePath);