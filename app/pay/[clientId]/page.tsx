'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

interface ClientData {
  info: {
    businessName: string;
    clientId: string;
  };
  payment: {
    amount: number;
    currency: string;
  };
}

export default function PaymentPage() {
  const { clientId } = useParams();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<'pago_movil' | 'stripe' | 'paypal' | null>(null);
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/admin/clients`);
        const data = await response.json();
        const found = data.clients.find((c: any) => c.info.clientId === clientId);
        if (found) setClient(found);
      } catch (error) {
        console.error('Failed to load client:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  const handleSubmitReference = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, reference, method: 'pago_movil' }),
      });
      if (response.ok) setSuccess(true);
    } catch (error) {
      console.error('Payment confirmation failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center text-slate-400">
        Factura no encontrada o expirada.
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white/[0.02] border border-white/10 p-12 rounded-[3rem] backdrop-blur-3xl animate-fade-in-up">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">✓</div>
          <h2 className="text-3xl font-bold text-white mb-4">Pago Recibido</h2>
          <p className="text-slate-400 font-light leading-relaxed">
            Hemos registrado tu referencia **{reference}**. Un administrador validará el pago en las próximas horas para activar tu servicio.
          </p>
          <div className="mt-10 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-slate-100 font-sans selection:bg-purple-500/30 py-20 px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header Invoice Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl transition-transform group-hover:scale-110 duration-700">💳</div>
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-purple-500 font-black mb-2">Invoice Details</p>
              <h1 className="text-4xl font-bold tracking-tighter text-white">{client.info.businessName}</h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">Total a Pagar</span>
              <span className="text-3xl font-bold text-white tracking-tighter">$30.00</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-light max-w-xs leading-relaxed">
            Activación de servicios Attom AI Assistant (Mantenimiento mensual recurrente).
          </p>
        </div>

        {/* Method Selection */}
        <div className="space-y-4">
          <button 
            onClick={() => setMethod('pago_movil')}
            className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between group ${
              method === 'pago_movil' ? 'bg-purple-600/15 border-purple-500/40 text-white shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🇻🇪</span>
              <div className="text-left">
                <p className="text-sm font-bold tracking-wide uppercase">Pago Móvil</p>
                <p className="text-[10px] opacity-60">Venezuela / Transferencia Inmediata</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 transition-all ${method === 'pago_movil' ? 'border-purple-500 bg-purple-500' : 'border-white/10 group-hover:border-white/20'}`}></div>
          </button>

          <button 
            onClick={() => setMethod('stripe')}
            className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between group ${
              method === 'stripe' ? 'bg-indigo-600/15 border-indigo-500/40 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">💳</span>
              <div className="text-left">
                <p className="text-sm font-bold tracking-wide uppercase">Stripe / Card</p>
                <p className="text-[10px] opacity-60">International Credit/Debit Cards</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 transition-all ${method === 'stripe' ? 'border-indigo-500 bg-indigo-500' : 'border-white/10 group-hover:border-white/20'}`}></div>
          </button>

          <button 
            onClick={() => setMethod('paypal')}
            className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between group ${
              method === 'paypal' ? 'bg-blue-600/15 border-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🅿️</span>
              <div className="text-left">
                <p className="text-sm font-bold tracking-wide uppercase">PayPal</p>
                <p className="text-[10px] opacity-60">One-click checkout with PayPal</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 transition-all ${method === 'paypal' ? 'border-blue-500 bg-blue-500' : 'border-white/10 group-hover:border-white/20'}`}></div>
          </button>
        </div>

        {/* Action Forms */}
        <div className="mt-8 transition-all duration-500">
          {method === 'pago_movil' && (
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 animate-fade-in-up">
              <h3 className="text-lg font-bold mb-6 text-white">Detalles para Transferencia</h3>
              <div className="space-y-4 mb-8">
                <DetailRow label="Banco" value="Banesco" />
                <DetailRow label="Teléfono" value="+58 412 XXX XXXX" />
                <DetailRow label="ID / RIF" value="V-XXX.XXX.XXX" />
              </div>
              
              <form onSubmit={handleSubmitReference} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">Número de Referencia (Últimos 6 dígitos)</label>
                  <input 
                    required
                    type="text" 
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ej: 123456"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-mono"
                  />
                </div>
                <button 
                  disabled={submitting || !reference}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-all shadow-[0_10px_30px_rgba(168,85,247,0.3)] disabled:opacity-30"
                >
                  {submitting ? 'Registrando...' : 'Confirmar Pago'}
                </button>
              </form>
            </div>
          )}

          {method === 'stripe' && (
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 text-center animate-fade-in-up">
              <p className="text-slate-400 mb-6 font-light">Serás redirigido a la plataforma segura de Stripe.</p>
              <button className="w-full py-4 bg-indigo-500 rounded-2xl text-sm font-bold tracking-widest uppercase hover:bg-indigo-600 transition-all">Pagar con Tarjeta →</button>
            </div>
          )}

          {method === 'paypal' && (
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 text-center animate-fade-in-up">
              <p className="text-slate-400 mb-8 font-light italic text-sm">
                Seguro. Rápido. Global.
              </p>
              <div id="paypal-button-container" className="w-full"></div>
              <Script 
                src="https://www.paypal.com/sdk/js?client-id=sb&currency=USD" 
                onLoad={() => {
                  // @ts-ignore
                  if (window.paypal) {
                    // @ts-ignore
                    window.paypal.Buttons({
                      createOrder: (data: any, actions: any) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: {
                              value: "30.00"
                            },
                            description: `Attom AI Service - ${client.info.businessName}`
                          }]
                        });
                      },
                      onApprove: async (data: any, actions: any) => {
                        const order = await actions.order.capture();
                        console.log('PayPal Order Captured:', order);
                        setSuccess(true);
                        // Call API to confirm
                        await fetch('/api/payment/confirm', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            clientId, 
                            method: 'paypal',
                            paypalOrderId: order.id
                          }),
                        });
                      }
                    }).render('#paypal-button-container');
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/5">
      <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}
