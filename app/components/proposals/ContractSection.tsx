'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ShieldAlert, Award, PenTool, CheckCircle, RotateCcw, AlertTriangle, Key, PlayCircle } from 'lucide-react';

interface ContractSectionProps {
  clientName: string;
  clientSlug: string;
  phases: Array<{ name: string; investment: number }>;
  contractTerms?: {
    payments: Array<{ name: string; amount: number }>;
    clauses: string[];
  };
}

export default function ContractSection({ clientName, clientSlug, phases, contractTerms }: ContractSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [sigDetails, setSigDetails] = useState<any>(null);
  const [signatureMode, setSignatureMode] = useState<'type' | 'draw'>('type');
  const [typedSignature, setTypedSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Load signature from localStorage if it exists
  useEffect(() => {
    const savedSig = localStorage.getItem(`proposal_signature_${clientSlug}`);
    if (savedSig) {
      const parsed = JSON.parse(savedSig);
      setIsSigned(true);
      setSigDetails(parsed);
      setName(parsed.name);
      setEmail(parsed.email);
    }
  }, [clientSlug]);

  // Handle canvas drawing setup
  useEffect(() => {
    if (signatureMode === 'draw' && canvasRef.current && !isSigned) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#2ddc80';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      // Handle touch coordinates scaling
      const getPos = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      };

      const startDrawing = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        isDrawingRef.current = true;
        const pos = getPos(e);
        ctx?.beginPath();
        ctx?.moveTo(pos.x, pos.y);
      };

      const draw = (e: MouseEvent | TouchEvent) => {
        if (!isDrawingRef.current) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx?.lineTo(pos.x, pos.y);
        ctx?.stroke();
      };

      const stopDrawing = () => {
        isDrawingRef.current = false;
      };

      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseleave', stopDrawing);

      canvas.addEventListener('touchstart', startDrawing, { passive: false });
      canvas.addEventListener('touchmove', draw, { passive: false });
      canvas.addEventListener('touchend', stopDrawing);

      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseleave', stopDrawing);

        canvas.removeEventListener('touchstart', startDrawing);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDrawing);
      };
    }
  }, [signatureMode, isSigned]);

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Por favor introduce tu nombre completo.');
    if (!email.trim() || !email.includes('@')) return setError('Por favor introduce un correo electrónico válido.');
    if (!agreed) return setError('Debes aceptar las cláusulas y condiciones.');

    let signatureData = '';
    if (signatureMode === 'draw') {
      if (canvasRef.current) {
        // Simple check to make sure they actually drew something (not empty canvas)
        signatureData = canvasRef.current.toDataURL();
      }
    } else {
      if (!typedSignature.trim()) return setError('Por favor escribe tu firma.');
      signatureData = typedSignature;
    }

    setIsSubmitting(true);

    try {
      const signedAt = new Date().toISOString();
      const res = await fetch('/api/proposals/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          name,
          email,
          signatureData,
          signedAt
        })
      });

      const data = await res.json();
      if (data.success) {
        const sigObj = {
          id: data.signature.id,
          name,
          email,
          signedAt,
          signatureData,
          mode: signatureMode
        };
        localStorage.setItem(`proposal_signature_${clientSlug}`, JSON.stringify(sigObj));
        setSigDetails(sigObj);
        setIsSigned(true);
      } else {
        setError(data.error || 'Error al guardar la firma.');
      }
    } catch (err) {
      setError('Error de conexión al firmar el contrato.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clauses = contractTerms?.clauses || [
    "PROPIEDAD DE CONTENIDOS Y CÓDIGO: Todo el contenido y código fuente desarrollado pertenece al CLIENTE una vez liquidados los montos acordados.",
    "CUMPLIMIENTO DE TIEMPOS: Ambas partes se comprometen a respetar los tiempos de entrega y pagos establecidos."
  ];

  const total = phases.reduce((acc, curr) => acc + curr.investment, 0);

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-t from-[#090d16] to-[#0e131f] border-t border-white/5">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#2ddc80]/15 border border-[#2ddc80]/20 rounded-full mb-6">
            <FileText className="w-4 h-4 text-[#2ddc80]" />
            <span className="text-[#2ddc80] text-[10px] font-black uppercase tracking-widest">
              Acuerdo Formal
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
            Contrato de Servicios
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Por favor, revisa las condiciones comerciales del proyecto y firma digitalmente para formalizar el inicio de los trabajos.
          </p>
        </div>

        {/* Contract Sheet */}
        <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 mb-12">
          {/* Subtle glow border */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#2ddc80]/30 to-transparent" />
          
          <div className="space-y-10">
            {/* Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/5 pb-8">
              <div>
                <span className="text-[10px] font-black text-[#2ddc80] uppercase tracking-widest">Contratante (Cliente)</span>
                <p className="text-white font-black text-xl mt-1 uppercase">{clientName}</p>
              </div>
              <div className="md:text-right">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Prestador (Agencia)</span>
                <p className="text-white font-black text-xl mt-1 uppercase">Universa Agency</p>
              </div>
            </div>

            {/* Scope / Objective */}
            <div>
              <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#2ddc80]" />
                Objeto y Presupuesto
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <p className="text-white/60 text-sm leading-relaxed">
                  El presente acuerdo tiene como objeto el desarrollo técnico de la plataforma digital y producción de activos para la marca <strong className="text-white font-bold">{clientName}</strong>, con una inversión total acordada de <strong className="text-[#2ddc80] font-black">${total.toLocaleString()} USD</strong>.
                </p>
              </div>
            </div>

            {/* Clauses */}
            <div>
              <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#2ddc80]" />
                Cláusulas de Cumplimiento
              </h3>
              <ol className="space-y-4 list-decimal pl-4">
                {clauses.map((clause, idx) => (
                  <li key={idx} className="text-white/60 text-xs md:text-sm leading-relaxed pl-2 font-medium">
                    <span className="text-white font-bold">{clause.split(':')[0]}:</span>
                    {clause.split(':')[1] || clause}
                  </li>
                ))}
              </ol>
            </div>

            {/* Payments */}
            {contractTerms?.payments && (
              <div>
                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-[#2ddc80]" />
                  Calendario de Desembolsos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contractTerms.payments.map((p, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                      <span className="text-white/40 text-[9px] font-black uppercase tracking-wider">{p.name}</span>
                      <span className="text-white font-black text-xl mt-2">${p.amount.toLocaleString()} USD</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Signature Box */}
        <AnimatePresence mode="wait">
          {!isSigned ? (
            <motion.form
              key="sign-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSign}
              className="bg-white/[0.01] backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10 space-y-6"
            >
              <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Firma Digital del Cliente</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ivonne Roxe"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#2ddc80]/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-white/20 font-bold"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@roxe.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#2ddc80]/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-white/20 font-bold"
                  />
                </div>
              </div>

              {/* Signature Canvas / Typed Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Firma Autorizada</label>
                  <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setSignatureMode('type')}
                      className={`px-3 py-1 text-[9px] font-black uppercase rounded ${signatureMode === 'type' ? 'bg-[#2ddc80] text-[#0e131f]' : 'text-white/60 hover:text-white'}`}
                    >
                      Escribir
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode('draw')}
                      className={`px-3 py-1 text-[9px] font-black uppercase rounded ${signatureMode === 'draw' ? 'bg-[#2ddc80] text-[#0e131f]' : 'text-white/60 hover:text-white'}`}
                    >
                      Dibujar
                    </button>
                  </div>
                </div>

                {signatureMode === 'draw' ? (
                  <div className="relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden h-40 flex items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={160}
                      className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                    />
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="absolute bottom-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Limpiar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      placeholder="Escribe tu nombre para firmar..."
                      className="w-full bg-white/5 border border-white/10 focus:border-[#2ddc80]/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-white/20 font-bold"
                    />
                    {typedSignature && (
                      <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Vista previa de la firma</span>
                        <span className="font-serif italic text-3xl text-[#2ddc80] tracking-wider select-none font-semibold block py-2">
                          {typedSignature}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group mt-4">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 accent-[#2ddc80] cursor-pointer"
                />
                <span className="text-white/50 text-xs font-medium leading-relaxed group-hover:text-white/80 transition-colors">
                  Confirmo que he leído detenidamente los términos descritos y doy mi conformidad para proceder con el cronograma y pagos estipulados.
                </span>
              </label>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/25 p-4 rounded-xl text-xs font-bold uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-[#2ddc80] hover:bg-[#20bd6b] text-[#0e131f] font-black text-md uppercase tracking-tight py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Procesando Firma...' : 'Firmar y Aceptar Contrato'}
                <PenTool className="w-5 h-5" />
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2ddc80]/5 border border-[#2ddc80]/20 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden"
            >
              {/* Decorative radial glow */}
              <div className="absolute -bottom-1/2 -right-1/2 w-64 h-64 bg-[#2ddc80]/10 blur-[80px] rounded-full" />
              
              <div className="w-20 h-20 bg-[#2ddc80]/15 rounded-full border border-[#2ddc80]/30 flex items-center justify-center text-[#2ddc80] mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2">
                ¡Contrato Firmado!
              </h3>
              <p className="text-white/60 text-sm max-w-md mx-auto mb-8 font-medium">
                El acuerdo de desarrollo técnico para <strong className="text-white">{clientName}</strong> ha sido formalizado digitalmente de forma exitosa.
              </p>

              {/* Signature display block */}
              {sigDetails && (
                <div className="bg-[#0e131f]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 max-w-md mx-auto space-y-4 text-left">
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase font-bold">Código de Firma</span>
                    <code className="text-[#2ddc80] font-mono font-bold select-all">{sigDetails.id}</code>
                  </div>
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase font-bold">Firmante</span>
                    <span className="text-white font-bold uppercase">{sigDetails.name}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase font-bold">Email</span>
                    <span className="text-white font-bold">{sigDetails.email}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase font-bold">Fecha / Hora</span>
                    <span className="text-white font-bold">{new Date(sigDetails.signedAt).toLocaleString()}</span>
                  </div>
                  
                  {/* Signature visual representation */}
                  <div className="pt-4 flex flex-col items-center justify-center bg-black/20 rounded-xl p-4 border border-white/5">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">Firma Registrada</span>
                    {sigDetails.mode === 'draw' ? (
                      <img src={sigDetails.signatureData} alt="Firma digital" className="max-h-16 max-w-full object-contain filter invert brightness-200" />
                    ) : (
                      <span className="font-serif italic text-3xl text-[#2ddc80] select-none tracking-wider font-semibold py-1">
                        {sigDetails.signatureData}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
