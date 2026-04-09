#!/usr/bin/env node

/**
 * Attom - Process All Clients
 *
 * This script processes all pending clients in batch
 */

require('dotenv').config();
const { fileManager } = require('../lib/utils/file-manager');
const { processClient } = require('./process-client');
const { createLogger } = require('../lib/utils/logger');

const logger = createLogger('ProcessAllClients');

async function processAllClients(options = {}) {
  try {
    logger.info('Starting batch processing of all clients');

    // Get all client IDs
    const clientIds = await fileManager.getAllClientIds();

    logger.info(`Found ${clientIds.length} clients`);

    const results = {
      total: clientIds.length,
      processed: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    // Process each client
    for (const clientId of clientIds) {
      try {
        logger.info(`Processing client ${results.processed + 1}/${results.total}`, { clientId });

        // Load client to check status
        const clientData = await fileManager.loadClientInfo(clientId);

        // Skip if already completed (unless force option is set)
        if (clientData.deployment.status === 'completed' && !options.force) {
          logger.info('Client already completed, skipping', { clientId });
          results.skipped++;
          continue;
        }

        // Skip if payment not completed (unless skipPayment option is set)
        if (clientData.payment.status !== 'completed' && !options.skipPayment) {
          logger.info('Payment not completed, skipping', { clientId });
          results.skipped++;
          continue;
        }

        // Process client
        await processClient(clientId, {
          skipPayment: options.skipPayment,
          skipNotification: options.skipNotification,
        });

        results.processed++;
        logger.success(`Client processed successfully (${results.processed}/${results.total})`, {
          clientId,
        });
      } catch (error) {
        results.failed++;
        results.errors.push({
          clientId,
          error: error.message,
        });

        logger.error(`Failed to process client`, { clientId, error });
      }
    }

    // Summary
    logger.info('Batch processing completed', results);

    console.log(`\n📊 Resumen del Procesamiento por Lotes:`);
    console.log(`Total de clientes: ${results.total}`);
    console.log(`✅ Procesados: ${results.processed}`);
    console.log(`⏭️  Omitidos: ${results.skipped}`);
    console.log(`❌ Fallidos: ${results.failed}\n`);

    if (results.errors.length > 0) {
      console.log('Errores:');
      results.errors.forEach(({ clientId, error }) => {
        console.log(`  - ${clientId}: ${error}`);
      });
    }

    return results;
  } catch (error) {
    logger.error('Batch processing failed', error);
    throw error;
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  const options = {
    force: args.includes('--force'),
    skipPayment: args.includes('--skip-payment'),
    skipNotification: args.includes('--skip-notification'),
  };

  console.log('\n🚀 Attom - Procesar Todos los Clientes\n');

  if (options.force) {
    console.log('⚠️  Modo FORCE: Se reprocesarán todos los clientes, incluso los completados\n');
  }

  processAllClients(options)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { processAllClients };
