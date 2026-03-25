import Stripe from 'stripe';
import { ClientData, PaymentInfo } from '../types/client';
import { createLogger } from '../utils/logger';
import { fileManager } from '../utils/file-manager';

const logger = createLogger('PaymentProcessor');

export class PaymentProcessor {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-12-18.acacia',
    });
  }

  /**
   * Process payment based on method
   */
  async processPayment(
    clientData: ClientData,
    paymentData: Partial<PaymentInfo>
  ): Promise<PaymentInfo> {
    logger.info('Processing payment', {
      clientId: clientData.info.clientId,
      method: paymentData.method,
    });

    const payment: PaymentInfo = {
      method: paymentData.method || 'stripe',
      status: 'pending',
      amount: paymentData.amount || 0,
      currency: paymentData.currency || 'USD',
    };

    try {
      if (payment.method === 'stripe' || payment.method === 'both') {
        const stripePayment = await this.processStripePayment(
          clientData,
          payment.amount,
          payment.currency
        );
        payment.stripe = stripePayment;
        payment.status = stripePayment.status === 'succeeded' ? 'completed' : 'processing';
      }

      if (payment.method === 'pago_movil' || payment.method === 'both') {
        // Pago Móvil requires manual confirmation
        payment.status = 'pending';
        logger.info('Pago Móvil payment awaiting confirmation');
      }

      if (payment.status === 'completed') {
        payment.completedAt = new Date().toISOString();
      }

      // Update client data
      clientData.payment = payment;
      await fileManager.updateClientInfo(clientData.info.clientId, clientData);

      // Log action
      await fileManager.logAction(clientData.info.clientId, 'payment-processed', {
        method: payment.method,
        status: payment.status,
        amount: payment.amount,
      });

      logger.success('Payment processed', { status: payment.status });

      return payment;
    } catch (error) {
      logger.error('Payment processing failed', error);

      payment.status = 'failed';
      await fileManager.updateClientInfo(clientData.info.clientId, {
        ...clientData,
        payment,
      });

      throw error;
    }
  }

  /**
   * Process Stripe payment
   */
  private async processStripePayment(
    clientData: ClientData,
    amount: number,
    currency: string
  ): Promise<{ paymentIntentId: string; status: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        description: `Website creation for ${clientData.info.businessName}`,
        metadata: {
          clientId: clientData.info.clientId,
          businessName: clientData.info.businessName,
        },
      });

      logger.info('Stripe payment intent created', { id: paymentIntent.id });

      return {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      logger.error('Stripe payment failed', error);
      throw error;
    }
  }

  /**
   * Confirm Pago Móvil payment manually
   */
  async confirmPagoMovil(
    clientId: string,
    pagoMovilData: {
      bank: string;
      phone: string;
      id: string;
      reference: string;
    }
  ): Promise<void> {
    logger.info('Confirming Pago Móvil payment', { clientId });

    const clientData = await fileManager.loadClientInfo(clientId);

    clientData.payment.pagoMovil = pagoMovilData;
    clientData.payment.status = 'completed';
    clientData.payment.completedAt = new Date().toISOString();

    await fileManager.updateClientInfo(clientId, clientData);

    await fileManager.logAction(clientId, 'pago-movil-confirmed', pagoMovilData);

    logger.success('Pago Móvil payment confirmed');
  }

  /**
   * Generate payment template HTML
   */
  generatePaymentTemplate(clientData: ClientData, amount: number): string {
    const { businessName } = clientData.info;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pago - ${businessName}</title>
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
    .container { max-width: 600px; margin: 50px auto; padding: 20px; }
    .card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px; }
    h1 { font-size: 24px; margin-bottom: 20px; color: #333; }
    .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
    .tab { flex: 1; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.3s; }
    .tab.active { border-color: #4F46E5; background: #4F46E5; color: white; }
    .payment-method { display: none; }
    .payment-method.active { display: block; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; font-weight: 500; color: #555; }
    input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; }
    button { width: 100%; padding: 14px; background: #4F46E5; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.3s; }
    button:hover { background: #4338CA; }
    .info { background: #EEF2FF; padding: 15px; border-radius: 8px; margin-top: 15px; font-size: 14px; color: #4338CA; }
    .amount { font-size: 32px; font-weight: 700; color: #4F46E5; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>Pago para ${businessName}</h1>
      <div class="amount">$${amount.toFixed(2)} ${clientData.payment.currency}</div>

      <div class="tabs">
        <div class="tab active" onclick="showPaymentMethod('stripe')">💳 Tarjeta (Stripe)</div>
        <div class="tab" onclick="showPaymentMethod('pago-movil')">📱 Pago Móvil</div>
      </div>

      <div id="stripe" class="payment-method active">
        <form id="payment-form">
          <div class="form-group">
            <label>Tarjeta de crédito/débito</label>
            <div id="card-element"></div>
          </div>
          <button type="submit">Pagar $${amount.toFixed(2)}</button>
        </form>
        <div class="info">✓ Pago seguro con Stripe. Tus datos están protegidos.</div>
      </div>

      <div id="pago-movil" class="payment-method">
        <div class="form-group">
          <label>Datos para Pago Móvil:</label>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p><strong>Banco:</strong> ${process.env.PAGO_MOVIL_BANK}</p>
            <p><strong>Teléfono:</strong> ${process.env.PAGO_MOVIL_PHONE}</p>
            <p><strong>Cédula:</strong> ${process.env.PAGO_MOVIL_ID}</p>
            <p><strong>Titular:</strong> ${process.env.PAGO_MOVIL_NAME}</p>
            <p style="margin-top: 10px; color: #4F46E5;"><strong>Monto:</strong> $${amount.toFixed(2)}</p>
          </div>
        </div>

        <form id="pago-movil-form">
          <div class="form-group">
            <label>Número de referencia</label>
            <input type="text" name="reference" required placeholder="Ingresa tu número de referencia">
          </div>
          <div class="form-group">
            <label>Tu banco</label>
            <input type="text" name="bank" required placeholder="Ej: Banesco">
          </div>
          <div class="form-group">
            <label>Tu teléfono</label>
            <input type="tel" name="phone" required placeholder="Ej: 0414-1234567">
          </div>
          <button type="submit">Confirmar Pago Móvil</button>
        </form>
        <div class="info">✓ Enviaremos confirmación por WhatsApp.</div>
      </div>
    </div>
  </div>

  <script>
    function showPaymentMethod(method) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.payment-method').forEach(p => p.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById(method).classList.add('active');
    }

    // Stripe integration
    const stripe = Stripe('${process.env.STRIPE_PUBLISHABLE_KEY}');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    document.getElementById('payment-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        alert('Error: ' + error.message);
      } else {
        // Send paymentMethod.id to your server
        console.log('Payment method created:', paymentMethod.id);
        alert('Pago procesado exitosamente');
      }
    });

    // Pago Móvil form
    document.getElementById('pago-movil-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      console.log('Pago Móvil data:', Object.fromEntries(formData));
      alert('Pago Móvil registrado. Te contactaremos pronto.');
    });
  </script>
</body>
</html>
`;
  }
}

export const paymentProcessor = new PaymentProcessor();
