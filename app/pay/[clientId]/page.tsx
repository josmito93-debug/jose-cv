'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Copy,
  Smartphone
} from 'lucide-react';

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PaymentPage() {
  const { clientId: clientUrlId } = useParams();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentTab, setPaymentTab] = useState<'paypal' | 'pagomovil'>('paypal');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isSubmittingPM, setIsSubmittingPM] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "AQxpVIzS_RkU9bweuhLgEC_0xbuU6qEpRRhIqoKLI-dhnhYvMDTwBBFQnGn6XF_IVplsUsBgd9DHvOaV";

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`/api/clients/${clientUrlId}`);
        const data = await res.json();
        if (data.success) {
          setClient(data.client);
        } else {
          setError(data.error || 'Client not found');
        }
      } catch (err) {
        setError('Failed to load client data');
      } finally {
        setLoading(false);
      }
    };

    if (clientUrlId) fetchClient();
  }, [clientUrlId]);

  useEffect(() => {
    if (!client || paid || paymentTab !== 'paypal') return;

    const scriptId = 'paypal-js-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.async = true;
      document.body.appendChild(script);
    }
    
    script.onload = () => {
      if (window.paypal && document.getElementById('paypal-button-container')) {
        // Clear container incase it already rendered
        document.getElementById('paypal-button-container')!.innerHTML = '';
        window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: (data: any, actions: any) => {
            return actions.subscription.create({
              'plan_id': 'P-5ML4271244401533MAV7NS7I' 
            });
          },
          onApprove: (data: any, actions: any) => {
            setPaid(true);
            fetch('/api/billing/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId: client.id, subscriptionId: data.subscriptionID, method: 'PAYPAL' })
            });
          }
        }).render('#paypal-button-container');
      }
    };

    return () => {
      /* Do not aggressively remove script to allow switching tabs back and forth smoothly */
    };
  }, [client, paid, paymentTab, PAYPAL_CLIENT_ID]);

  const handlePagoMovilSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) return;
    
    setIsSubmittingPM(true);
    try {
      const res = await fetch('/api/billing/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clientId: client.id, 
          subscriptionId: referenceNumber,
          method: 'PAGO_MOVIL' 
        })
      });
      if (res.ok) {
        setPaid(true);
      } else {
        alert("Ocurrió un error registrando el pago.");
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmittingPM(false);
  };

  const overrideCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center p-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center max-w-md w-full">
           <Zap className="w-12 h-12 text-red-500 mx-auto mb-6 opacity-50" />
           <h1 className="text-2xl font-black text-white mb-2 uppercase">Link Invalid</h1>
           <p className="text-zinc-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-100  antialiased flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-600/10 blur-[120px] -z-10 rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase text-indigo-400 mb-6">
                <ShieldCheck className="w-3 h-3" /> Secure Payment Portal
            </div>
            <div className="flex justify-center mb-6">
                <img src="/images/universa_logo.png" alt="Universa Agency" className="h-12 md:h-16 object-contain" />
            </div>
            <p className="text-zinc-500 text-sm font-medium tracking-wide">
                Factura para <span className="text-white font-bold">{client.business}</span>
            </p>
        </div>

        <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <AnimatePresence mode="wait">
              {!paid ? (
                <motion.div 
                  key="checkout"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 md:p-12 space-y-8"
                >
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                      <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Membresía</p>
                          <p className="text-lg font-black text-white uppercase italic">Growth Maintenance</p>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Mensual</p>
                          <p className="text-3xl font-black text-white">$30<span className="text-sm font-bold text-zinc-600 underline decoration-indigo-500">.00</span></p>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 flex items-center gap-3">
                          <CreditCard className="w-4 h-4" /> Método de Pago
                      </h3>

                      <div className="flex bg-black/50 border border-white/5 rounded-2xl p-1 gap-2">
                         <button 
                            onClick={() => setPaymentTab('paypal')}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${paymentTab === 'paypal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                         >
                            PayPal
                         </button>
                         <button 
                            onClick={() => setPaymentTab('pagomovil')}
                            className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${paymentTab === 'pagomovil' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                         >
                            <Smartphone className="w-4 h-4" /> Pago Móvil
                         </button>
                      </div>

                      {paymentTab === 'paypal' && (
                        <div id="paypal-button-container" className="min-h-[150px] relative z-10 animate-in fade-in zoom-in-95 duration-300" />
                      )}

                      {paymentTab === 'pagomovil' && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                           <div className="space-y-4">
                              <p className="text-xs text-zinc-400 font-medium">Transfiere el equivalente a $30 a los siguientes datos:</p>
                              <ul className="space-y-3">
                                <li className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                                   <span className="text-xs text-zinc-500 font-bold uppercase">Banco</span>
                                   <div className="flex items-center gap-3">
                                     <span className="text-sm text-white font-medium">Banesco (0134)</span>
                                     <button onClick={() => overrideCopy('0134', 'banco')} className="text-indigo-400 hover:text-white transition-colors">
                                        {copiedField === 'banco' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                     </button>
                                   </div>
                                </li>
                                <li className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                                   <span className="text-xs text-zinc-500 font-bold uppercase">Teléfono</span>
                                   <div className="flex items-center gap-3">
                                     <span className="text-sm text-white font-medium">0424 274 0620</span>
                                     <button onClick={() => overrideCopy('04242740620', 'telefono')} className="text-indigo-400 hover:text-white transition-colors">
                                        {copiedField === 'telefono' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                     </button>
                                   </div>
                                </li>
                                <li className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                                   <span className="text-xs text-zinc-500 font-bold uppercase">Cédula</span>
                                   <div className="flex items-center gap-3">
                                     <span className="text-sm text-white font-medium">V-20.870.884</span>
                                     <button onClick={() => overrideCopy('20870884', 'cedula')} className="text-indigo-400 hover:text-white transition-colors">
                                        {copiedField === 'cedula' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                     </button>
                                   </div>
                                </li>
                              </ul>
                           </div>

                           <form onSubmit={handlePagoMovilSubmit} className="pt-4 border-t border-white/10 space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Número de Referencia</label>
                                <input 
                                  type="text" 
                                  value={referenceNumber}
                                  onChange={(e) => setReferenceNumber(e.target.value)}
                                  placeholder="Ej: 14598212"
                                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                  required
                                />
                              </div>
                              <button 
                                type="submit" 
                                disabled={isSubmittingPM || !referenceNumber}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all text-sm"
                              >
                                {isSubmittingPM ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reportar Pago'}
                              </button>
                           </form>
                        </div>
                      )}
                  </div>

                  <div className="pt-6 border-t border-white/5 text-center">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-2">
                          <Lock className="w-3 h-3" /> Transacción Segura
                      </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                   key="success"
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="p-12 text-center space-y-8"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                        {paymentTab === 'paypal' ? (
                          <>
                            <h2 className="text-2xl font-black text-white uppercase italic">Facturación Activa</h2>
                            <p className="text-zinc-500 text-sm px-6">
                                Tu pago automático fue completado. Los nodos de Universa se han sincronizado con tu cuenta.
                            </p>
                          </>
                        ) : (
                          <>
                            <h2 className="text-2xl font-black text-white uppercase italic">En Revisión</h2>
                            <p className="text-zinc-500 text-sm px-6">
                                Hemos recibido tu número de referencia. Activaremos la factura tan pronto se confirme la recepción de fondos.
                            </p>
                          </>
                        )}
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-30 grayscale">
            <Globe className="w-6 h-6" />
            <Zap className="w-6 h-6" />
            <ShieldCheck className="w-6 h-6" />
        </div>
      </motion.div>
    </div>
  );
}
