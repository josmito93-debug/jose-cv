'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Camera, 
  CameraOff,
  User, 
  Ticket, 
  Calendar, 
  ShieldAlert,
  Search
} from 'lucide-react';
import Image from 'next/image';
import { Html5Qrcode } from 'html5-qrcode';

const ScanContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Camera scanner states
  const [scanActive, setScanActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  // Manual input state
  const [manualId, setManualId] = useState('');

  const fetchScanResult = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tickets/scan?id=${id}`);
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      console.error(e);
      setError('Error al conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  // If a ticketId URL parameter is provided, validate it immediately
  useEffect(() => {
    if (ticketId) {
      setScanActive(false); // Disable camera if viewing a static ID validation result
      fetchScanResult(ticketId);
    } else {
      setLoading(false);
      setResult(null);
    }
  }, [ticketId]);

  // Handle live camera QR scanner lifecycle
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (scanActive && !loading && !result) {
      // Ensure element exists before rendering
      const checkInterval = setInterval(() => {
        const element = document.getElementById('reader');
        if (element) {
          clearInterval(checkInterval);
          
          html5QrCode = new Html5Qrcode('reader');
          html5QrCode.start(
            { facingMode: 'environment' }, // Back camera for tickets
            {
              fps: 15,
              qrbox: (width, height) => {
                const size = Math.min(width, height) * 0.75;
                return { width: size, height: size };
              }
            },
            (decodedText) => {
              // Target detected
              console.log('Scanned text:', decodedText);
              
              // Extract ID from URL if decoded text is a validation URL
              let id = decodedText;
              if (decodedText.includes('?id=')) {
                try {
                  const url = new URL(decodedText);
                  id = url.searchParams.get('id') || decodedText;
                } catch (e) {
                  // Fallback string matching
                  const match = decodedText.match(/id=([^&]+)/);
                  if (match && match[1]) id = match[1];
                }
              }

              // Stop scanner and push route
              if (html5QrCode) {
                html5QrCode.stop().then(() => {
                  setScanActive(false);
                  router.push(`/bellakeo/scan?id=${id}`);
                }).catch((err) => {
                  console.error('Error stopping scanner:', err);
                  setScanActive(false);
                  router.push(`/bellakeo/scan?id=${id}`);
                });
              }
            },
            (errorMessage) => {
              // Silent loop errors
            }
          ).then(() => {
            setCameraPermission(true);
          }).catch((err) => {
            console.error('Camera initialization failed:', err);
            setCameraPermission(false);
            setScanActive(false);
          });
        }
      }, 100);

      return () => {
        clearInterval(checkInterval);
        if (html5QrCode && html5QrCode.isScanning) {
          html5QrCode.stop().catch(err => console.error('Cleanup stop error:', err));
        }
      };
    }
  }, [scanActive, loading, result, router]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      router.push(`/bellakeo/scan?id=${manualId.trim()}`);
    }
  };

  const startScanningMode = () => {
    setResult(null);
    setManualId('');
    router.push('/bellakeo/scan');
    setScanActive(true);
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
      
      {/* Styles for scanning laser animation */}
      <style>{`
        @keyframes laser-sweep {
          0% { top: 5%; }
          50% { top: 95%; }
          100% { top: 5%; }
        }
        .laser-sweep-bar {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, rgba(99,102,241,0) 0%, rgba(99,102,241,1) 50%, rgba(99,102,241,0) 100%);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
          animation: laser-sweep 2.5s ease-in-out infinite;
        }
        #reader video {
          object-fit: cover !important;
          border-radius: 1rem;
        }
      `}</style>

      {/* Decorative inner glow lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      {/* Title logo */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative w-[160px] h-[48px] filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          <Image
            src="/bellakeo_logo.png"
            alt="BELLakeo LAND"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-400 mt-2">
          LECTOR DE ACCESOS PUERTA
        </span>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center"
          >
            <div className="relative flex items-center justify-center mb-4">
              <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <div className="absolute w-10 h-10 border border-purple-500/10 border-b-purple-400 rounded-full animate-spin [animation-direction:reverse]" />
            </div>
            <p className="text-xs font-black uppercase text-zinc-500 tracking-wider">
              Verificando firma de ticket...
            </p>
          </motion.div>
        ) : scanActive ? (
          /* Live Scanner Viewport */
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-4 space-y-6"
          >
            <div className="relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-inner">
              
              {/* HTML5 Qrcode viewport */}
              <div id="reader" className="w-full h-full object-cover rounded-2xl" />

              {/* Scanning visual indicators overlay */}
              <div className="absolute inset-0 border border-indigo-500/10 rounded-2xl pointer-events-none" />
              
              {/* Aiming crosshairs */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-indigo-500 pointer-events-none" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-indigo-500 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-indigo-500 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-indigo-500 pointer-events-none" />
              
              {/* Sweeping laser bar */}
              <div className="laser-sweep-bar" />
            </div>

            <p className="text-xs font-medium text-zinc-400">
              Apunta con la cámara trasera al código QR
            </p>

            <button
              onClick={() => setScanActive(false)}
              className="py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <CameraOff className="w-3.5 h-3.5" />
              Cancelar Cámara
            </button>
          </motion.div>
        ) : !ticketId ? (
          /* Dashboard Landing Mode */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-4 space-y-6"
          >
            {/* Quick Banner Status */}
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-left text-xs text-zinc-400 space-y-2">
              <ShieldAlert className="w-5 h-5 text-indigo-400 mb-1" />
              <p className="font-bold text-white uppercase tracking-wider text-[10px]">Escanear Entradas Oficiales</p>
              <p>El sistema abrirá la cámara para verificar instantáneamente el QR de los clientes o puedes buscar una ID de forma manual.</p>
            </div>

            {/* Huge Camera Activation Button */}
            <button
              onClick={startScanningMode}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_35px_rgba(99,102,241,0.3)] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Camera className="w-5 h-5 animate-pulse" />
              Activar Cámara Escáner
            </button>

            {/* Custom separation line */}
            <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase text-zinc-600 tracking-wider my-4">
              <span className="h-px bg-zinc-800 flex-1" />
              <span>Ó Búsqueda Manual</span>
              <span className="h-px bg-zinc-800 flex-1" />
            </div>

            {/* Manual Form */}
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ID del ticket (ej. rec2qx...)"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 pl-10 text-xs text-white placeholder-zinc-600 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-4" />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-white/5 border border-white/10 hover:border-white/20 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Validar ID
              </button>
            </form>

            {cameraPermission === false && (
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mt-2">
                ⚠️ Error de cámara o permiso rechazado. Activa los permisos en tu navegador.
              </p>
            )}
          </motion.div>
        ) : result ? (
          /* Result Validation View */
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-4 space-y-6"
          >
            {result.success ? (
              /* Success Check-in */
              <div className="space-y-4">
                <div className="inline-flex p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-emerald-400 tracking-wider">
                    Acceso Autorizado
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">
                    ¡BIENVENIDO AL EVENTO!
                  </p>
                </div>
              </div>
            ) : result.alreadyScanned ? (
              /* Already Scanned / Duplicate */
              <div className="space-y-4">
                <div className="inline-flex p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-pulse">
                  <AlertTriangle className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-amber-400 tracking-wider">
                    Ticket Duplicado
                  </h3>
                  <p className="text-[10px] text-red-400 font-bold uppercase mt-1 tracking-widest">
                    YA FUE ESCANEADO
                  </p>
                </div>
              </div>
            ) : (
              /* Acceso Denegado (Unpaid, cancel, etc) */
              <div className="space-y-4">
                <div className="inline-flex p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <XCircle className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-red-500 tracking-wider">
                    Acceso Denegado
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">
                    TRANSACCIÓN INVÁLIDA
                  </p>
                </div>
              </div>
            )}

            {/* Details Sheet */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-left text-xs space-y-3.5">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Comprador</span>
                <span className="text-white font-black uppercase">{result.details?.name || 'Desconocido'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Tickets</span>
                <span className="text-zinc-300 font-bold text-right uppercase">
                  {result.details?.tickets || 'Entradas'}
                </span>
              </div>
              {result.details?.scanTime && (
                <div className="flex justify-between border-b border-white/5 pb-2 text-amber-400">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Primer Escaneo</span>
                  <span className="font-bold">{result.details.scanTime}</span>
                </div>
              )}
              {result.error && (
                <div className="text-[10px] text-red-400 font-semibold border-t border-dashed border-red-500/20 pt-3">
                  Detalle: {result.error}
                </div>
              )}
            </div>

            <button
              onClick={startScanningMode}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Escanear Siguiente Ticket
            </button>

            <button
              onClick={() => {
                setResult(null);
                setManualId('');
                router.push('/bellakeo/scan');
              }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Volver al Inicio
            </button>
          </motion.div>
        ) : (
          <div className="text-xs text-red-400 py-6">{error || 'Ha ocurrido un error inesperado.'}</div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ScanTicketPage() {
  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden bg-[#050505] flex items-center justify-center p-4">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 filter brightness-[0.3] saturate-[0.8]"
        >
          <source src="/bellakeo_bg.mp4" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-[#050505]" />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Page Content Suspended for query param parsing */}
      <Suspense fallback={
        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      }>
        <ScanContent />
      </Suspense>
    </div>
  );
}
