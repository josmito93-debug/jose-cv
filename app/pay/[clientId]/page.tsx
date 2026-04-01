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
  Lock
} from 'lucide-react';

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalPaymentPage() {
  const { clientId: clientUrlId } = useParams();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!client || paid) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    
    script.onload = () => {
      if (window.paypal && document.getElementById('paypal-button-container')) {
        window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: (data: any, actions: any) => {
            return actions.subscription.create({
              /* Plan ID for recurring $30/mo - this should be created in PayPal Dashboard */
              /* For now, we use a placeholder or the user can provide it. 
                 Standard practice is to create the plan via API or Dashboard. */
              'plan_id': 'P-5ML4271244401533MAV7NS7I' // This is a placeholder
            });
          },
          onApprove: (data: any, actions: any) => {
            setPaid(true);
            // Here we would call an API to update Airtable status
            fetch('/api/billing/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId: client.id, subscriptionId: data.subscriptionID })
            });
          }
        }).render('#paypal-button-container');
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [client, paid, PAYPAL_CLIENT_ID]);

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
    <div className="min-h-screen bg-[#08080A] text-zinc-100 font-inter antialiased flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
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
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white mb-4">
                Universa <span className="text-zinc-500">Agency</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium tracking-wide">
                Invoice for <span className="text-white font-bold">{client.business}</span>
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
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subscription Tier</p>
                          <p className="text-lg font-black text-white uppercase italic">Growth Maintenance</p>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Monthly</p>
                          <p className="text-3xl font-black text-white">$30<span className="text-sm font-bold text-zinc-600 underline decoration-indigo-500">.00</span></p>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 flex items-center gap-3">
                          <CreditCard className="w-4 h-4" /> Payment Selection
                      </h3>
                      <div id="paypal-button-container" className="min-h-[150px] relative z-10" />
                  </div>

                  <div className="pt-6 border-t border-white/5 text-center">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-2">
                          <Lock className="w-3 h-3" /> Encrypted Transaction Processing
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
                        <h2 className="text-2xl font-black text-white uppercase italic">Subscription Active</h2>
                        <p className="text-zinc-500 text-sm px-6">
                            Your payment was successful. The Universa Agency nodes have been synchronized with your account.
                        </p>
                    </div>
                    <button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase rounded-2xl hover:bg-zinc-200 transition-all text-xs"
                    >
                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
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
