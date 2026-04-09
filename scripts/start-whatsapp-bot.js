#!/usr/bin/env node

/**
 * Attom - Start WhatsApp Bot
 *
 * This script starts the WhatsApp bot for collecting client information
 */

require('dotenv').config();
const { whatsappBot } = require('../lib/integrations/whatsapp-bot');
const { createLogger } = require('../lib/utils/logger');

const logger = createLogger('WhatsAppBot-Starter');

async function startBot() {
  try {
    console.log('\n🤖 Attom WhatsApp Bot\n');
    console.log('Iniciando bot de WhatsApp...\n');

    logger.info('Starting WhatsApp bot');

    await whatsappBot.initialize();

    console.log('\n✅ Bot de WhatsApp iniciado correctamente!');
    console.log('\n📱 El bot está escuchando mensajes.');
    console.log('   Los clientes pueden enviar /start para comenzar.\n');

    logger.success('WhatsApp bot is running');

    // Keep process alive
    process.on('SIGINT', () => {
      logger.info('Shutting down WhatsApp bot');
      console.log('\n\n👋 Cerrando bot de WhatsApp...\n');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start WhatsApp bot', error);
    console.error('\n❌ Error al iniciar el bot:', error.message);
    process.exit(1);
  }
}

// Execute
startBot();
