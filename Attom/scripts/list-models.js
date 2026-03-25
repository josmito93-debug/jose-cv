const https = require('https');

const API_KEY = 'AIzaSyDqh9Jx3jbSBFUaPV6EJM9BAkYt3tqZDf4';

function listModels() {
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: '/v1beta/models',
    method: 'GET',
    headers: {
      'x-goog-api-key': API_KEY
    }
  };
  
  const req = https.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Available models:', responseData);
    });
  });
  
  req.on('error', (error) => {
    console.error('Error:', error);
  });
  
  req.end();
}

listModels();