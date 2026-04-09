#!/usr/bin/env node

/**
 * Attom - Create New Client
 *
 * This script creates a new client manually (for testing or admin purposes)
 */

require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const readline = require('readline');
const { fileManager } = require('../lib/utils/file-manager');
const { createLogger } = require('../lib/utils/logger');

const logger = createLogger('CreateClient');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createClient() {
  try {
    console.log('\n🚀 Attom - Crear Nuevo Cliente\n');

    // Collect client information
    const businessName = await question('Nombre del negocio: ');
    const contactName = await question('Nombre del contacto: ');
    const phone = await question('Teléfono: ');
    const email = await question('Email: ');

    console.log('\nTipos de negocio:');
    console.log('1. restaurant');
    console.log('2. ecommerce');
    console.log('3. portfolio');
    console.log('4. blog');
    console.log('5. corporate');
    console.log('6. landing');
    console.log('7. other');
    const businessTypeChoice = await question('Selecciona tipo (1-7): ');

    const businessTypeMap = {
      '1': 'restaurant',
      '2': 'ecommerce',
      '3': 'portfolio',
      '4': 'blog',
      '5': 'corporate',
      '6': 'landing',
      '7': 'other',
    };

    const businessType = businessTypeMap[businessTypeChoice] || 'other';

    const primaryColor = await question('Color principal (ej: #FF5733): ');
    const amountStr = await question('Monto del proyecto (USD): ');
    const amount = parseFloat(amountStr) || 0;

    // Generate client ID
    const clientId = uuidv4();

    // Create client data
    const clientData = {
      info: {
        clientId,
        businessName,
        contactName,
        phone,
        email,
        businessType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      branding: {
        colors: {
          primary: primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`,
        },
      },
      payment: {
        method: 'pago_movil',
        status: 'pending',
        amount,
        currency: 'USD',
      },
      deployment: {
        status: 'not_started',
      },
    };

    // Create directory and save
    logger.info('Creating client directory and saving data');
    await fileManager.createClientDirectory(clientId);
    await fileManager.saveClientInfo(clientId, clientData);

    logger.success('✅ Cliente creado exitosamente!', {
      clientId,
      businessName,
    });

    console.log(`\n✅ Cliente creado!`);
    console.log(`\nID del cliente: ${clientId}`);
    console.log(`Negocio: ${businessName}`);
    console.log(`Contacto: ${contactName}`);
    console.log(`\nPara procesar este cliente, ejecuta:`);
    console.log(`npm run attom:process-client ${clientId}`);
    console.log(`\nO con el script directo:`);
    console.log(`node scripts/process-client.js ${clientId}\n`);

    rl.close();
  } catch (error) {
    logger.error('Failed to create client', error);
    rl.close();
    process.exit(1);
  }
}

// Execute
createClient();
