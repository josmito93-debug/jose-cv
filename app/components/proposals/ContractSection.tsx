'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ShieldAlert, Award, PenTool, CheckCircle, RotateCcw, AlertTriangle, PlayCircle, Download } from 'lucide-react';

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
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [sigDetails, setSigDetails] = useState<any>(null);
  const [signatureMode, setSignatureMode] = useState<'type' | 'draw'>('type');
  const [typedSignature, setTypedSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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
      setPhone(parsed.phone || '');
      setCompanyName(parsed.companyName || '');
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
    if (!phone.trim()) return setError('Por favor introduce tu número de teléfono.');
    if (!companyName.trim()) return setError('Por favor introduce el nombre de la empresa.');
    if (!agreed) return setError('Debes aceptar las cláusulas y condiciones.');

    let signatureData = '';
    if (signatureMode === 'draw') {
      if (canvasRef.current) {
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
          phone,
          companyName,
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
          phone,
          companyName,
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
    "POLÍTICA DE NO DEVOLUCIÓN DE DINERO (NO REFUNDS): Dadas la naturaleza de los servicios de consultoría, diseño, producción de creativos, desarrollo técnico y configuración publicitaria (donde se comprometen horas de trabajo profesional y recursos técnicos de forma inmediata), bajo ninguna circunstancia se realizarán devoluciones de dinero una vez iniciado el proyecto o realizado cualquier pago de reserva.",
    "PLAZOS DE ENTREGA Y REQUERIMIENTOS: Los plazos de entrega pactados comenzarán a correr únicamente a partir del día hábil siguiente a la recepción total por parte de la Agencia de todos los insumos, accesos, contraseñas, información y materiales requeridos al CLIENTE. Los retrasos por parte del CLIENTE suspenderán automáticamente los plazos de entrega de la Agencia.",
    "RONDAS DE REVISIÓN Y CAMBIOS: Se incluyen un máximo de 2 (dos) rondas de revisiones/correcciones por fase sobre los entregables presentados. Cualquier modificación posterior al cierre de una fase o que modifique el alcance original acordado se cotizará por separado (tarifa del 20% del valor de la fase por ronda adicional de corrección).",
    "PROPIEDAD DE CONTENIDOS Y ACTIVOS: Todo el contenido y activos digitales desarrollados (sitios web, códigos, videos UGC, copys, artes e integraciones) pertenecerán en su totalidad y de forma exclusiva al CLIENTE una vez se haya liquidado el 100% de los pagos acordados en este acuerdo comercial."
  ];

  const total = phases.reduce((acc, curr) => acc + curr.investment, 0);

  const generatePDF = async () => {
    if (!sigDetails) return;
    setIsGeneratingPDF(true);

    try {
      const jspdfModule = await import('jspdf');
      const jsPDF = jspdfModule.jsPDF || jspdfModule.default || jspdfModule;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      let y = 20;

      // Draw Top Tech/Modern Border Accent
      pdf.setFillColor(14, 19, 31); // Dark background
      pdf.rect(0, 0, pdfWidth, 40, 'F');
      
      pdf.setFillColor(45, 220, 128); // Emerald line accent
      pdf.rect(0, 38, pdfWidth, 2, 'F');

      // Title & Branding inside the header
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text("UNIVERSA AGENCY", 20, 18);
      
      pdf.setFontSize(16);
      pdf.text("CONTRATO DE PRESTACIÓN DE SERVICIOS", 20, 28);
      
      y = 55;

      // Metadata Section
      pdf.setTextColor(14, 19, 31);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text("1. PARTES CONTRATANTES", 20, y);
      y += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      
      // Client Data Grid Layout
      pdf.text(`Cliente / Firmante: ${sigDetails.name}`, 20, y);
      pdf.text(`Empresa: ${sigDetails.companyName}`, 110, y);
      y += 6;
      pdf.text(`Correo Electrónico: ${sigDetails.email}`, 20, y);
      pdf.text(`Teléfono: ${sigDetails.phone}`, 110, y);
      y += 6;
      pdf.text(`Fecha de Firma: ${new Date(sigDetails.signedAt).toLocaleString()}`, 20, y);
      pdf.text(`ID Acuerdo: ${sigDetails.id}`, 110, y);
      y += 12;

      // Object & Investment Section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text("2. SERVICIOS Y PRESUPUESTO ACORDADO", 20, y);
      y += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Se acuerda la prestación de servicios detallada en la propuesta de ${clientName} por las siguientes fases:`, 20, y);
      y += 8;

      // Phase List table-like view
      phases.forEach((phase, i) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Fase 0${i + 1}: ${phase.name}`, 25, y);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`$${phase.investment.toLocaleString()} USD`, 160, y, { align: 'right' });
        y += 6;
      });

      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, y, pdfWidth - 20, y);
      y += 6;

      pdf.setFont('helvetica', 'bold');
      pdf.text("TOTAL INVERSIÓN ACUMULADA:", 20, y);
      pdf.setTextColor(45, 220, 128);
      pdf.text(`$${total.toLocaleString()} USD`, 160, y, { align: 'right' });
      pdf.setTextColor(14, 19, 31);
      y += 14;

      // Terms & Clauses Section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text("3. TÉRMINOS Y CLÁUSULAS LEGALES DE PRESTACIÓN", 20, y);
      y += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      
      const maxTextWidth = pdfWidth - 40;

      clauses.forEach((clause) => {
        const titlePart = clause.split(':')[0] + ":";
        const contentPart = clause.split(':')[1] || '';
        
        pdf.setFont('helvetica', 'bold');
        const formattedTitle = pdf.splitTextToSize(titlePart, maxTextWidth);
        
        // Check page break before rendering
        const lineCount = formattedTitle.length + 3;
        if (y + (lineCount * 5) > pdfHeight - 25) {
          pdf.addPage();
          y = 25;
        }

        pdf.text(formattedTitle, 20, y);
        y += (formattedTitle.length * 4.5);

        pdf.setFont('helvetica', 'normal');
        const formattedContent = pdf.splitTextToSize(contentPart.trim(), maxTextWidth);
        pdf.text(formattedContent, 20, y);
        y += (formattedContent.length * 4.5) + 5;
      });

      y += 5;

      // Signatures Footer area
      if (y + 40 > pdfHeight - 20) {
        pdf.addPage();
        y = 25;
      }

      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, y, pdfWidth - 20, y);
      y += 10;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text("FIRMAS DE CONFORMIDAD", 20, y);
      y += 10;

      // Representative and Client Side by Side
      const signY = y;
      
      // Left side: Agency representative
      pdf.text("UNIVERSA AGENCY S.A.", 20, signY);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.text("Firma de Representación Autorizada", 20, signY + 5);
      pdf.setFont('times', 'italic');
      pdf.setFontSize(16);
      pdf.text("Universa Lab", 25, signY + 18);
      pdf.setDrawColor(150, 150, 150);
      pdf.line(20, signY + 22, 85, signY + 22);

      // Right side: Client signature
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text("EL CLIENTE (CONTRATANTE)", 110, signY);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.text(`Nombre: ${sigDetails.name}`, 110, signY + 5);
      pdf.text(`Cargo/Empresa: ${sigDetails.companyName}`, 110, signY + 9);
      
      if (sigDetails.mode === 'draw') {
        try {
          pdf.addImage(sigDetails.signatureData, 'PNG', 110, signY + 11, 60, 15);
        } catch (imgErr) {
          pdf.setFont('times', 'italic');
          pdf.setFontSize(16);
          pdf.text(sigDetails.name, 115, signY + 18);
        }
      } else {
        pdf.setFont('times', 'italic');
        pdf.setFontSize(18);
        pdf.text(sigDetails.signatureData, 115, signY + 18);
      }
      
      pdf.line(110, signY + 22, 175, signY + 22);

      // Footer notice
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Este documento fue firmado digitalmente bajo el código de seguridad única ${sigDetails.id}.`, 20, pdfHeight - 12);
      pdf.text("Universa Agency LLC © 2026. Todos los derechos reservados.", pdfWidth - 20, pdfHeight - 12, { align: 'right' });

      // Save PDF
      pdf.save(`${clientSlug}_contrato_firmado.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Ocurrió un error al generar el PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
            Por favor, ingresa los datos correspondientes, revisa las condiciones comerciales y firma digitalmente para formalizar la propuesta.
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
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nombre Completo del Firmante</label>
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
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nombre de la Empresa</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej. Roxe LLC"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#2ddc80]/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-white/20 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Número de Teléfono</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +1 (786) 123-4567"
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
                <div className="bg-[#0e131f]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 max-w-md mx-auto space-y-4 text-left mb-8">
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase font-bold">Código de Firma</span>
                    <code className="text-[#2ddc80] font-mono font-bold select-all">{sigDetails.id}</code>
                  </div>
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase font-bold">Firmante</span>
                    <span className="text-white font-bold uppercase">{sigDetails.name}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase font-bold">Empresa</span>
                    <span className="text-white font-bold uppercase">{sigDetails.companyName}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase font-bold">Teléfono</span>
                    <span className="text-white font-bold">{sigDetails.phone}</span>
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

              {/* Action buttons */}
              <button
                type="button"
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-[#0e131f] font-black text-sm uppercase tracking-wider px-8 py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg"
              >
                {isGeneratingPDF ? 'Generando PDF...' : 'Descargar Contrato (PDF)'}
                <Download className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
