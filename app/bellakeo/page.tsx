'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TicketSelector, 
  TicketType 
} from './components/TicketSelector';
import { CartSummary } from './components/CartSummary';
import { CheckoutForm } from './components/CheckoutForm';
import { PaymentModal } from './components/PaymentModal';
import { VipLounge } from './components/VipLounge';
import { SponsorsMarquee } from './components/SponsorsMarquee';
import { Ticket, Calendar, MapPin, Clock, ShieldCheck, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

const TICKET_TYPES: TicketType[] = [
  {
    id: 'general',
    name: 'General Admission',
    price: 20,
    description: 'Segunda Pre-venta activa. (Primera pre-venta $15 AGOTADA)',
    includes: [
      'Entrada al evento (Acceso General)',
      'Primera Pre-venta ($15) - SOLD OUT ❌',
      'Música en vivo (DJs Internacionales)',
      'Robots LED & Laser Show'
    ],
    badge: 'Segunda Pre-venta',
    icon: <Ticket className="w-5 h-5" />,
    color: 'border-indigo-500/20 text-indigo-400',
  },
  {
    id: 'table',
    name: 'VIP Table',
    price: 600,
    description: 'Mesa reservada para grupo. Servicio de botella premium y atención vip.',
    includes: [
      'Mesa privada reservada (hasta 6 pers.)',
      'Atención y mesero personalizado',
      '1 Botella premium incluida + mixers',
      'Área exclusiva elevada',
      'Entradas express incluidas'
    ],
    badge: 'Luxury',
    icon: <Ticket className="w-5 h-5 rotate-45" />,
    color: 'border-pink-500/20 text-pink-400',
  }
];

export default function BellakeoLandPage() {
  const [phase, setPhase] = useState<'LOUNGE' | 'TICKET_SHOP' | 'CHECKOUT'>('LOUNGE');
  const [cart, setCart] = useState<Record<string, number>>({
    general: 0,
    vip: 0,
    table: 0
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    attendeeCount: 1,
    guests: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState('general');

  // Synchronize attendee count to match total ticket quantity in cart
  useEffect(() => {
    const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    setFormData(prev => ({
      ...prev,
      attendeeCount: Math.max(1, count)
    }));
  }, [cart]);

  const handleUpdateQuantity = (ticketId: string, delta: number) => {
    setCart(prev => {
      const current = prev[ticketId] || 0;
      const newQty = Math.max(0, current + delta);
      return { ...prev, [ticketId]: newQty };
    });
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    // If ticket is not in cart, add 1 unit
    if ((cart[ticketId] || 0) === 0) {
      setCart(prev => ({ ...prev, [ticketId]: 1 }));
    }
  };

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'El nombre completo es requerido';
    if (!formData.email.trim()) {
      tempErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'El correo no es válido';
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      tempErrors.phone = 'Formato de teléfono no válido (mín. 10 dígitos)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCheckoutTransition = () => {
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    if (totalItems === 0) {
      alert('Por favor selecciona al menos un ticket para continuar.');
      return;
    }
    setPhase('CHECKOUT');
  };

  const handleFinalCheckout = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      // 1. Calculate total amount
      const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
        const ticket = TICKET_TYPES.find(t => t.id === id);
        return sum + (ticket?.price || 0) * qty;
      }, 0);
      const serviceFee = Math.round(subtotal * 0.1);
      const totalAmount = subtotal + serviceFee;

      const ticketDescriptions = Object.entries(cart)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => `${TICKET_TYPES.find(t => t.id === id)?.name} (x${qty})`)
        .join(', ');

      // 2. Save Client in Airtable
      const clientRes = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: `BELLakeo LAND - ${ticketDescriptions}`,
          contactName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        })
      });

      const clientData = await clientRes.json();
      if (!clientData.success) {
        throw new Error(clientData.error || 'Failed to register client in Airtable');
      }

      const clientId = clientData.recordId;
      const host = window.location.origin;

      // 3. Create Stripe Checkout Session
      const stripeRes = await fetch('/api/payment/stripe/one-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          amount: totalAmount,
          description: `Tickets para BELLakeo LAND - ${ticketDescriptions}`,
          successUrl: `${host}/success?clientId=${clientId}&tickets=${encodeURIComponent(JSON.stringify(cart))}&fullName=${encodeURIComponent(formData.fullName)}`,
          cancelUrl: `${host}/bellakeo?status=cancel`
        })
      });

      const stripeData = await stripeRes.json();
      if (!stripeData.success) {
        throw new Error(stripeData.error || 'Failed to create Stripe payment session');
      }

      // 4. Redirect to Stripe
      window.location.href = stripeData.url;

    } catch (e: any) {
      console.error(e);
      alert('Ocurrió un error al iniciar la compra: ' + e.message);
      setIsSubmitting(false);
    }
  };

  const totalTicketsSelected = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden bg-[#050505]">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 filter brightness-[0.35] saturate-[0.85]"
        >
          <source src="/bellakeo_bg.mp4" type="video/mp4" />
        </video>
        {/* Overlay to dim video and ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/85 to-[#050505]" />
      </div>

      {/* Decorative Glow Overlays */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Payment Modal redirect screen */}
      <AnimatePresence>
        {isSubmitting && <PaymentModal isOpen={isSubmitting} />}
      </AnimatePresence>

      <div className="relative z-10">
        {phase === 'LOUNGE' ? (
          <VipLounge onEnter={() => setPhase('TICKET_SHOP')} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            
            {/* Header Back Link */}
            <div className="mb-6 flex justify-between items-center">
              <button
                onClick={() => setPhase(phase === 'CHECKOUT' ? 'TICKET_SHOP' : 'LOUNGE')}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-wider bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>

              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                Tickets Disponibles
              </div>
            </div>

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-black/60 backdrop-blur-2xl mb-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {/* Main Visual Video Banner */}
              <div className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center overflow-hidden bg-black/40">
                {/* Blurred background counterpart video */}
                <div className="absolute inset-0 scale-110 blur-xl opacity-40">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/bellakeo_bg.mp4" type="video/mp4" />
                  </video>
                </div>
                {/* Contained focused main video */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover md:object-contain opacity-95"
                  >
                    <source src="/bellakeo_bg.mp4" type="video/mp4" />
                  </video>
                </div>
                {/* Dark vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/10" />
              </div>

              {/* Event description floating cards */}
              <div className="p-6 md:p-8 relative -mt-16 md:-mt-24 z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-widest uppercase rounded-full mb-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      7 DE AGOSTO · FIESTA FUTURISTA
                    </span>
                    <div className="relative w-[180px] h-[55px] md:w-[240px] md:h-[72px] mb-2 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                      <Image
                        src="/bellakeo_logo.png"
                        alt="BELLakeo LAND"
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                    
                    {/* Meta details list */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-bold mt-4">
                      <span className="flex items-center gap-1.5 uppercase">
                        <MapPin className="w-4 h-4 text-indigo-400" />
                        Blue Hookah, Memphis
                      </span>
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                      <span className="flex items-center gap-1.5 uppercase">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        Viernes, 7 Agosto
                      </span>
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                      <span className="flex items-center gap-1.5 uppercase">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        8:00 PM - 5:00 AM
                      </span>
                    </div>
                  </div>

                  {phase === 'TICKET_SHOP' && (
                    <button
                      onClick={handleCheckoutTransition}
                      disabled={totalTicketsSelected === 0}
                      className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-black tracking-wider uppercase rounded-xl transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center gap-2 cursor-pointer"
                    >
                      Comprar Tickets
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Phase Conditionally Rendered Blocks */}
            {phase === 'TICKET_SHOP' ? (
              <div className="space-y-12">
                {/* Infinite sponsors marquee */}
                <SponsorsMarquee />

                <div>
                  <div className="text-center mb-8">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400">PASO 1 DE 2</span>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mt-1">Elige tu Experiencia</h2>
                    <div className="w-12 h-0.5 bg-indigo-500 mx-auto mt-3" />
                  </div>

                  {/* Selector grid of experience cards */}
                  <TicketSelector
                    tickets={TICKET_TYPES}
                    selectedTicketId={selectedTicketId}
                    onSelect={handleSelectTicket}
                  />
                </div>

                {/* Sticky/Responsive display summary and cart */}
                {totalTicketsSelected > 0 && (
                  <div className="max-w-md mx-auto">
                    <CartSummary
                      cart={cart}
                      tickets={TICKET_TYPES}
                      onUpdateQuantity={handleUpdateQuantity}
                      onCheckout={handleCheckoutTransition}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-center mb-10">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400">PASO 2 DE 2</span>
                  <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mt-1">Completa tu Registro</h2>
                  <div className="w-12 h-0.5 bg-indigo-500 mx-auto mt-3" />
                </div>

                {/* Checkout columns layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8">
                    <CheckoutForm
                      formData={formData}
                      onChange={setFormData}
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleFinalCheckout();
                      }}
                      errors={errors}
                    />
                  </div>

                  <div className="lg:col-span-4">
                    <CartSummary
                      cart={cart}
                      tickets={TICKET_TYPES}
                      onUpdateQuantity={handleUpdateQuantity}
                      onCheckout={handleFinalCheckout}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer info lockup */}
            <div className="mt-16 text-center border-t border-white/5 pt-8 text-zinc-500 text-[10px] font-bold uppercase tracking-wider space-y-2">
              <p>© 2026 BELLakeo LAND. Todos los derechos reservados.</p>
              <div className="flex items-center justify-center gap-1.5 text-zinc-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Transacciones protegidas mediante Stripe Payments</span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Floating Bottom Bar (Sticky on Mobile screens) */}
      <AnimatePresence>
        {totalTicketsSelected > 0 && phase === 'TICKET_SHOP' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 md:hidden flex justify-between items-center"
          >
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tickets Seleccionados</p>
              <p className="text-sm font-black text-white">{totalTicketsSelected} x BK Pass</p>
            </div>
            <button
              onClick={handleCheckoutTransition}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-[11px] uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center gap-1"
            >
              Comprar Ticket
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
