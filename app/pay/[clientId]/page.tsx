'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft,
  Lock,
  Globe,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Note: Ensure NEXT_PUBLIC_PAYPAL_CLIENT_ID is set in .env
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb'; // 'sb' for sandbox

export default function PaymentPage() {
  const { clientId } = useParams();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`/api/clients/${clientId}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setClient(data);
      } catch (err) {
        console.error('Failed to load client:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  // Load PayPal SDK Script
  useEffect(() => {
    if (!loading && client) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        if (window.paypal) {
          // @ts-ignore
          window.paypal.Buttons({
            createSubscription: (data: any, actions: any) => {
              return actions.subscription.create({
                // Replace with actual Plan ID from PayPal Dashboard
                'plan_id': process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID || 'P-FIXME' 
              });
            },
            onApprove: async (data: any) => {
              setPaymentStatus('SUCCESS');
              // Notify backend of successful subscription
              await fetch(`/api/clients/${clientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  'Payment Status': 'PAID',
                  'Deployment Status': 'Active',
                  'Notes': `Subscription ID: ${data.subscriptionID}`
                })
              });
            },
            onError: (err: any) => {
              console.error('PayPal Error:', err);
              setPaymentStatus('ERROR');
            }
          }).render('#paypal-button-container');
        }
      };
      document.body.appendChild(script);
    }
  }, [loading, client]);

  if (loading) return (
    <div className="min-h-screen bg-[#08080A] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-100 font-inter antialiased overflow-hidden relative selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-16 space-y-6">
           <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-600/20 border border-white/5 animate-pulse">
              <img src="/images/universa_logo.png" alt="Universa" className="w-full h-full object-cover" />
           </div>
           <div className="text-center">
              <h1 className="text-4xl font-black tracking-tightest uppercase italic mb-2">Universa Billing</h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                 <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secure Payment Gateway
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
           
           {/* Left: Summary */}
           <div className="space-y-8 animate-[fadeInLeft_0.8s_ease-out]">
              <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                 <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                    <CreditCard className="w-3 h-3" /> Subscription Summary
                 </h2>
                 
                 <div className="space-y-6 pb-6 border-b border-white/5">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-xl font-bold tracking-tight">{client?.info?.businessName}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Institutional Plan</p>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-indigo-400">$30.00</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase">per month</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 space-y-4">
                    <BenefitItem text="24/7 Bot Surveillance & Deployment" icon={<Zap className="w-3 h-3" />} />
                    <BenefitItem text="Real-time Analytics Dashboard" icon={<LayoutDashboard className="w-3 h-3" />} />
                    <BenefitItem text="Universa Infrastructure Managed" icon={<Globe className="w-3 h-3" />} />
                 </div>
              </div>

              <div className="flex items-center gap-3 text-zinc-600 px-2">
                 <Lock className="w-3 h-3" />
                 <p className="text-[9px] font-black uppercase tracking-widest">End-to-end Encrypted Transaction (AES-256)</p>
              </div>
           </div>

           {/* Right: Payment Method */}
           <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 animate-[fadeInRight_0.8s_ease-out]">
              <AnimatePresence mode="wait">
                {paymentStatus === 'SUCCESS' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                       <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Subscription Active</h3>
                    <p className="text-zinc-500 text-sm mb-8">Your automated infrastructure is now synchronized.</p>
                    <button 
                      onClick={() => window.location.href = '/admin'}
                      className="px-8 py-3 bg-white text-black font-black rounded-xl text-xs uppercase tracking-widest"
                    >
                       Return to HQ
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    <div>
                       <h3 className="text-lg font-black italic mb-2">Select Payment Method</h3>
                       <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Choose how you want to pay</p>
                    </div>

                    <div id="paypal-button-container" className="min-h-[150px]" />
                    
                    <div className="text-center pt-4">
                       <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                          By subscribing, you authorize Autom Agency to charge $30.00 monthly. <br/>
                          You can cancel anytime from your PayPal dashboard.
                       </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
       <div className="w-6 h-6 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          {icon}
       </div>
       <span className="text-[11px] font-medium text-zinc-400">{text}</span>
    </div>
  );
}
