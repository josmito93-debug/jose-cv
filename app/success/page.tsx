'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Download, 
  Calendar, 
  Share2, 
  MapPin, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Users,
  Activity,
  QrCode
} from 'lucide-react';

// Custom canvas-based lightweight neon confetti/particles effect
const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];
    const particles: Array<{
      x: number;
      y: number;
      r: number;
      d: number;
      color: string;
      tilt: number;
      tiltAngleIncremental: number;
      tiltAngle: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 4 + 2,
        d: Math.random() * height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;

        // Reset particle if it goes off bottom
        if (p.y > height) {
          p.x = Math.random() * width;
          p.y = -20;
          p.tilt = Math.random() * 10 - 5;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Stop after 6 seconds to conserve battery/resources
    const timeout = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, width, height);
    }, 6000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-40 pointer-events-none" />;
};

// Main Confirmation View that reads search params
const ConfirmationContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const clientId = searchParams.get('clientId') || `CLNT-${Date.now().toString().slice(-6)}`;
  const fullName = searchParams.get('fullName') || 'Invitado Exclusivo';
  
  let tickets: Record<string, number> = { general: 1 };
  try {
    const rawTickets = searchParams.get('tickets');
    if (rawTickets) {
      tickets = JSON.parse(decodeURIComponent(rawTickets));
    }
  } catch (e) {
    console.error('Failed to parse tickets:', e);
  }

  const ticketItems = Object.entries(tickets).filter(([_, qty]) => qty > 0);
  const ticketDescriptions = ticketItems
    .map(([id, qty]) => `${id === 'table' ? 'VIP Table' : 'General Pass'} (x${qty})`)
    .join(', ');

  const totalAttendees = Object.values(tickets).reduce((sum, q) => sum + q, 0);

  // Admin simulation states
  const [showAdmin, setShowAdmin] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const handleSimulateScan = () => {
    setQrScanned(true);
    setScanMessage('Verificando firma criptográfica del ticket...');
    setTimeout(() => {
      setScanMessage('✓ TICKET CONFIRMADO. ¡Bienvenido a BELLakeo LAND!');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
      
      {/* Title Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>
        <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">PAGO COMPLETADO</span>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider mt-2">
          🔥 Compra Confirmada
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm font-medium mt-3 max-w-md mx-auto uppercase tracking-wider">
          Tu acceso a Bellakeo Land está asegurado. Presenta tu ticket QR en la puerta.
        </p>
      </div>

      {/* Main Grid: Ticket display left, Details right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Left Side: Interactive Apple Wallet/Ticketmaster Digital Pass */}
        <div className="md:col-span-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -10 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[340px] rounded-3xl bg-[#09090c] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            {/* Holographic glowing borders */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none" />

            {/* Ticket Header */}
            <div className="p-5 border-b border-dashed border-white/10 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">BK PASS</p>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">BELLakeo LAND</h3>
              </div>
              <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-black tracking-widest uppercase text-zinc-400">
                {ticketItems[0] ? (ticketItems[0][0] === 'table' ? 'VIP TABLE' : 'GENERAL PASS') : 'PASS'}
              </div>
            </div>

            {/* Ticket Info Section */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] font-black uppercase text-zinc-500 tracking-wider">COMPRADOR</p>
                  <p className="text-xs font-black uppercase text-white tracking-tight mt-0.5 line-clamp-1">{fullName}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-zinc-500 tracking-wider">TIPO TICKET</p>
                  <p className="text-xs font-black uppercase text-white tracking-tight mt-0.5 line-clamp-1">
                    {ticketItems[0] ? (ticketItems[0][0] === 'table' ? 'VIP Table' : 'General Admission') : 'Pass'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] font-black uppercase text-zinc-500 tracking-wider">FECHA</p>
                  <p className="text-xs font-black uppercase text-white tracking-tight mt-0.5">VIERNES 7 AGOSTO</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-zinc-500 tracking-wider">UBICACIÓN</p>
                  <p className="text-xs font-black uppercase text-white tracking-tight mt-0.5">MEMPHIS, TN</p>
                </div>
              </div>

              {/* QR Code Segment */}
              <div className="pt-6 pb-2 flex flex-col items-center justify-center border-t border-white/5">
                <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.2)] mb-3 relative group cursor-pointer" onClick={handleSimulateScan}>
                  {/* Real Dynamic QR Image containing scanning check-in link */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://www.universaagency.com/bellakeo/scan?id=${clientId}`)}`} 
                    alt="Acceso QR" 
                    className="w-32 h-32 object-contain" 
                  />
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <span className="text-[9px] font-black uppercase text-indigo-700 bg-white/95 px-2.5 py-1.5 rounded-lg shadow-sm">
                      Probar Escaneo
                    </span>
                  </div>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  CÓDIGO DE ENTRADA: {clientId}
                </p>
              </div>
            </div>

            {/* Apple Wallet Badge Simulator */}
            <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-black/40 flex justify-center">
              <div className="flex items-center gap-2 bg-black border border-white/10 hover:border-white/20 px-3.5 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase text-white cursor-pointer select-none">
                <span>Add to Apple Wallet</span>
                <ChevronRight className="w-3 h-3 text-zinc-500" />
              </div>
            </div>

          </motion.div>
        </div>

        {/* Right Side: Detailed Invoice Breakdown & Actions */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Resumen del Pedido</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Orden ID</span>
                <span className="text-zinc-300 font-mono">{clientId}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Tickets Comprados</span>
                <span className="text-white font-black uppercase">{ticketDescriptions}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Asistentes Registrados</span>
                <span className="text-zinc-300 font-bold">{totalAttendees} {totalAttendees === 1 ? 'Persona' : 'Personas'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Lugar</span>
                <span className="text-zinc-300 font-bold">Blue Hookah, Memphis</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Estatus de Transacción</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded">
                  PAGADO
                </span>
              </div>
            </div>
          </div>

          {/* Call-to-action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => window.print()}
              className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Descargar Ticket PDF
            </button>
            <button
              onClick={() => alert('¡Agregado con éxito a tu calendario!')}
              className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Agregar al Calendario
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'BELLakeo LAND',
                    text: '¡Ya tengo mi pase para Bellakeo Land en Memphis!',
                    url: window.location.origin + '/bellakeo'
                  });
                } else {
                  alert('¡Enlace de evento copiado al portapapeles!');
                }
              }}
              className="py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <Share2 className="w-4 h-4" />
              Compartir con Amigos
            </button>

            {/* Simulated verification success alert */}
            {qrScanned && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl border text-center text-xs font-black uppercase tracking-widest ${
                  scanMessage.startsWith('✓')
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 animate-pulse'
                }`}
              >
                {scanMessage}
              </motion.div>
            )}

            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="py-3 px-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-400 flex items-center justify-center gap-2 transition-all mt-4"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {showAdmin ? 'Ocultar Panel de Control' : 'Ver Panel de Acceso e Ingesta'}
            </button>
          </div>

        </div>

      </div>

      {/* Admin Panel Simulator drawer/box */}
      {showAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto shadow-[0_0_60px_rgba(0,0,0,0.8)] mt-12 mb-8 relative"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Panel Administrativo Puerta</h4>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">MONITOR DE ACCESOS Y ESTADÍSTICAS</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-black tracking-widest uppercase text-zinc-400">
              MEMPHIS NEXUS DISTRICT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tickets Vendidos</span>
              <span className="text-2xl font-black text-white mt-2">148 / 250</span>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-wider mt-1">Capacidad: 59.2%</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ventas Totales</span>
              <span className="text-2xl font-black text-white mt-2">$12,480.00</span>
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +15.4% de margen
              </span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ingresos en Puerta</span>
              <span className="text-2xl font-black text-white mt-2">32 Asistidos</span>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider mt-1">116 por arribar</span>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <h5 className="text-[10px] font-black uppercase tracking-wider text-white mb-3">Simulación Lector Puerta</h5>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-[11px] text-zinc-400 max-w-md">
                Simula el escáner de seguridad para este pase. Al escanear, el sistema valida la entrada y registra la asistencia del comprador ({fullName}).
              </p>
              <button
                onClick={handleSimulateScan}
                className="w-full sm:w-auto py-3 px-6 bg-white text-black hover:bg-zinc-200 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center"
              >
                Escanear Ticket QR
              </button>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default function SuccessPage() {
  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans overflow-x-hidden relative">
      <ConfettiCanvas />
      
      {/* Decorative Blur Overlays */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Confirmation Content with Suspense Boundary for useSearchParams */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      }>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
