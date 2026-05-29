'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download,
  Loader2, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Info
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  price: number;
}

export default function InvoicePage() {
  // Base state
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Emisor (Sender)
  const [emisorName, setEmisorName] = useState('Universa Agency');
  const [emisorRepresentative, setEmisorRepresentative] = useState('Rosa Elena Pinto');
  const [emisorEmail, setEmisorEmail] = useState('info@universa.agency');
  const [emisorPhone, setEmisorPhone] = useState('+58 (424) 274-0620');
  const [emisorAddress, setEmisorAddress] = useState('Caracas, Venezuela / Miami, FL');
  const [emisorTaxId, setEmisorTaxId] = useState('C.I. V-20.870.884');

  // Receptor (Client)
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Servicio de Consultoría de Software', qty: 1, price: 150 }
  ]);

  // Financial details
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Notes
  const [paymentNotes, setPaymentNotes] = useState(
    'MÉTODOS DE PAGO:\n' +
    '• Pago Móvil: Banesco (0134), Tel: 0424-2740620, C.I. V-20.870.884\n' +
    '• Transferencia Bancaria: Solicitar datos de cuenta internacional.\n' +
    '• Pago Digital: Stripe o PayPal (+5% comisión).'
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    'Esta cotización es válida por 30 días a partir de la fecha de emisión. ' +
    'Cualquier cambio en los requerimientos del proyecto puede modificar los costos presentados.'
  );

  // UI state
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Set default dates on load
  useEffect(() => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 15);

    const formatDate = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    setDate(formatDate(today));
    setDueDate(formatDate(future));
    setInvoiceNumber(`UNV-26-${Math.floor(1000 + Math.random() * 9000)}`);

    // Load from local storage if available
    const saved = localStorage.getItem('universa-invoice-draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInvoiceNumber(parsed.invoiceNumber || '');
        setDate(parsed.date || '');
        setDueDate(parsed.dueDate || '');
        setEmisorName(parsed.emisorName || '');
        setEmisorRepresentative(parsed.emisorRepresentative || 'Rosa Elena Pinto');
        setEmisorEmail(parsed.emisorEmail || '');
        setEmisorPhone(parsed.emisorPhone || '');
        setEmisorAddress(parsed.emisorAddress || '');
        setEmisorTaxId(parsed.emisorTaxId || '');
        setClientName(parsed.clientName || '');
        setClientEmail(parsed.clientEmail || '');
        setClientPhone(parsed.clientPhone || '');
        setClientAddress(parsed.clientAddress || '');
        setItems(parsed.items || []);
        setTaxPercent(parsed.taxPercent ?? 0);
        setDiscountPercent(parsed.discountPercent ?? 0);
        setPaymentNotes(parsed.paymentNotes || '');
        setAdditionalNotes(parsed.additionalNotes || '');
      } catch (e) {
        console.error('Error parsing saved draft', e);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (!invoiceNumber) return; // Wait for initial mount
    const stateToSave = {
      invoiceNumber, date, dueDate,
      emisorName, emisorRepresentative, emisorEmail, emisorPhone, emisorAddress, emisorTaxId,
      clientName, clientEmail, clientPhone, clientAddress,
      items, taxPercent, discountPercent,
      paymentNotes, additionalNotes
    };
    localStorage.setItem('universa-invoice-draft', JSON.stringify(stateToSave));
  }, [
    invoiceNumber, date, dueDate,
    emisorName, emisorRepresentative, emisorEmail, emisorPhone, emisorAddress, emisorTaxId,
    clientName, clientEmail, clientPhone, clientAddress,
    items, taxPercent, discountPercent,
    paymentNotes, additionalNotes
  ]);

  // Calculations
  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  };

  const getTaxAmount = () => {
    return (getSubtotal() * taxPercent) / 100;
  };

  const getDiscountAmount = () => {
    return (getSubtotal() * discountPercent) / 100;
  };

  const getGrandTotal = () => {
    return getSubtotal() + getTaxAmount() - getDiscountAmount();
  };

  // Item Handlers
  const handleAddItem = () => {
    const newId = (items.length + 1).toString();
    setItems([...items, { id: newId, description: '', qty: 1, price: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      setItems([{ id: '1', description: '', qty: 1, price: 0 }]);
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (field === 'qty') {
          const num = parseInt(value) || 0;
          return { ...item, qty: num };
        }
        if (field === 'price') {
          const num = parseFloat(value) || 0;
          return { ...item, price: num };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todos los datos del formulario?')) {
      const today = new Date();
      const future = new Date();
      future.setDate(today.getDate() + 15);
      const formatDate = (d: Date) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      setInvoiceNumber(`UNV-26-${Math.floor(1000 + Math.random() * 9000)}`);
      setDate(formatDate(today));
      setDueDate(formatDate(future));
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setClientAddress('');
      setItems([{ id: '1', description: '', qty: 1, price: 0 }]);
      setTaxPercent(0);
      setDiscountPercent(0);
      triggerAlert('Formulario restablecido.');
    }
  };

  // Trigger temporary notification alert
  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  // Load Preset Templates
  const loadTemplate = (type: 'cups-pitillo' | 'cups-tapa' | 'cups' | 'growth' | 'web') => {
    if (type === 'cups-pitillo') {
      setClientName('Chocolat Deli café');
      setClientEmail('contacto@chocolatdelicafe.com');
      setClientPhone('+58 (412) 123-4567');
      setClientAddress('Caracas, Venezuela');
      setItems([
        { 
          id: '1', 
          description: 'Vaso de 16 oz con tapa y pitillo personalizado (Logotipo a 1 color)', 
          qty: 300, 
          price: 1.85 
        }
      ]);
      setTaxPercent(0);
      setDiscountPercent(0);
      triggerAlert('Cargada cotización de 300 Vasos con tapa y pitillo para Chocolat Deli café.');
    } else if (type === 'cups-tapa') {
      setClientName('Chocolat Deli café');
      setClientEmail('contacto@chocolatdelicafe.com');
      setClientPhone('+58 (412) 123-4567');
      setClientAddress('Caracas, Venezuela');
      setItems([
        { 
          id: '1', 
          description: 'Vaso de 16 oz con tapa personalizado (Logotipo a 1 color)', 
          qty: 300, 
          price: 1.70 
        }
      ]);
      setTaxPercent(0);
      setDiscountPercent(0);
      triggerAlert('Cargada cotización de 300 Vasos con tapa (sin pitillo) para Chocolat Deli café.');
    } else if (type === 'cups') {
      setClientName('Chocolat Deli café');
      setClientEmail('contacto@chocolatdelicafe.com');
      setClientPhone('+58 (412) 123-4567');
      setClientAddress('Caracas, Venezuela');
      setItems([
        { 
          id: '1', 
          description: 'Vaso de 16 oz con tapa y pitillo personalizado (Logotipo a 1 color)', 
          qty: 100, 
          price: 1.85 
        },
        { 
          id: '2', 
          description: 'Vaso de 16 oz con tapa personalizado (Logotipo a 1 color)', 
          qty: 100, 
          price: 1.70 
        }
      ]);
      setTaxPercent(0);
      setDiscountPercent(0);
      triggerAlert('Cargada cotización de Vasos para Chocolat Deli café.');
    } else if (type === 'growth') {
      setClientName('Cliente de Growth');
      setClientEmail('contacto@empresa.com');
      setClientPhone('');
      setClientAddress('Miami, FL');
      setItems([
        { 
          id: '1', 
          description: 'Membresía Mensual - Growth Maintenance (Monitoreo de Nodos, Soporte SEO y Estabilidad de Servidores)', 
          qty: 1, 
          price: 30.00 
        }
      ]);
      setTaxPercent(0);
      setDiscountPercent(0);
      triggerAlert('Cargada plantilla Growth Maintenance ($30/mes).');
    } else if (type === 'web') {
      setClientName('Corporación Global');
      setClientEmail('admin@corporacion.com');
      setClientPhone('');
      setClientAddress('Bogotá, Colombia');
      setItems([
        { 
          id: '1', 
          description: 'Arquitectura e Ingeniería Web Avanzada (Desarrollo en Next.js, Panel Autogestionable e Infraestructura Serverless)', 
          qty: 1, 
          price: 2500.00 
        },
        { 
          id: '2', 
          description: 'Estrategia de Google Domination (Optimización Técnica SEO de Alto Rendimiento y Posicionamiento de Activos)', 
          qty: 1, 
          price: 1500.00 
        }
      ]);
      setTaxPercent(16); // IVA standard
      setDiscountPercent(10); // 10% discount
      triggerAlert('Cargada plantilla Arquitectura Web y SEO.');
    }
  };

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    triggerAlert('Generando PDF...');

    try {
      const originalTheme = previewTheme;

      if (originalTheme !== 'light') {
        setPreviewTheme('light');
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const element = document.getElementById('printable-invoice');
      if (!element) {
        throw new Error('Elemento de factura no encontrado');
      }

      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default || html2canvasModule;

      const jspdfModule = await import('jspdf');
      const jsPDF = jspdfModule.jsPDF || jspdfModule.default || jspdfModule;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      if (originalTheme !== 'light') {
        setPreviewTheme(originalTheme);
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 12;
      const imgWidth = pdfWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pdfHeight - 2 * margin) {
        const yOffset = margin;
        pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;
        let page = 1;

        while (heightLeft > 0) {
          if (page > 1) {
            pdf.addPage();
          }
          
          pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
          
          heightLeft -= (pdfHeight - 2 * margin);
          position -= (pdfHeight - 2 * margin);
          page++;
        }
      }

      const fileName = `${invoiceNumber || 'cotizacion'}.pdf`.toLowerCase().replace(/\s+/g, '-');
      pdf.save(fileName);
      triggerAlert('PDF descargado con éxito.');
    } catch (error: any) {
      console.error('Error al generar el PDF:', error);
      triggerAlert(`Error: ${error.message || 'Error al generar el PDF'}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <main className="bg-[#08080A] min-h-screen text-zinc-100 selection:bg-[#2ddc80] selection:text-[#0e131f] relative overflow-x-hidden font-sans pb-24">
      {/* Background Cinematic Motion Blur (Hidden during print) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden print:hidden">
        <motion.div 
          animate={{ 
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.05, 0.95, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[450px] h-[450px] bg-[#2ddc80]/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -90, 60, 0],
            y: [0, 80, -40, 0],
            scale: [1, 0.9, 1.05, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[35%] -right-[10%] w-[600px] h-[600px] bg-[#2ddc80]/5 blur-[150px] rounded-full"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.01]" />
      </div>

      {/* Navigation Bar (Hidden during print) */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center bg-[#0e131f]/20 backdrop-blur-xl border-b border-white/5 print:hidden">
        <div className="flex items-center gap-6">
          <Link href="/" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center p-1 relative">
              <Image src="/images/universa_logo.png" alt="Universa" width={36} height={36} />
            </div>
            <span className="text-lg font-black italic tracking-tighter uppercase leading-none">Universa</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Control de Facturación v1.0
          </span>
          <div className="w-2 h-2 rounded-full bg-[#2ddc80] animate-pulse shadow-[0_0_8px_#2ddc80]" />
        </div>
      </nav>

      {/* Alert toast notification */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-xl shadow-lg shadow-black/50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container relative z-10 w-full max-w-7xl mx-auto px-6 pt-28">
        
        {/* Title Section (Hidden during print) */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
          <div className="space-y-3">
            <span className="text-[#2ddc80] font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Ecosistema de Cotizaciones
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
              Facturación <span className="text-[#2ddc80] italic">&</span> Cotizaciones.
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" /> Limpiar Datos
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#2ddc80] hover:bg-[#20b867] text-[#0e131f] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#2ddc80]/10 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Descargando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Descargar PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ========================================================================= */}
          {/* EDITOR PANEL (Left) - Hidden during print                                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-8 print:hidden">
            
            {/* Template Presets Card */}
            <div className="group relative bg-[#0e131f]/70 backdrop-blur-md rounded-3xl p-6 border border-white/5 overflow-hidden">
              <div 
                className="absolute inset-0 rounded-3xl border border-transparent z-10 pointer-events-none"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent, black)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 30%, black 100%)',
                  borderColor: 'rgba(45, 220, 128, 0.2)'
                }}
              />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#2ddc80] mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Acceso Rápido / Plantillas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                <button
                  onClick={() => loadTemplate('cups-pitillo')}
                  className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/30 rounded-xl transition-all text-[11px] font-black uppercase tracking-wider text-left flex flex-col gap-1"
                >
                  <span className="text-[#2ddc80] text-[9px]">MAMA ROSA PINTO</span>
                  <span>🥛 Con Pitillo (300 ud)</span>
                </button>
                <button
                  onClick={() => loadTemplate('cups-tapa')}
                  className="px-4 py-3 bg-teal-500/10 border border-teal-500/20 text-teal-300 hover:bg-teal-500/20 hover:border-teal-500/30 rounded-xl transition-all text-[11px] font-black uppercase tracking-wider text-left flex flex-col gap-1"
                >
                  <span className="text-teal-400 text-[9px]">MAMA ROSA PINTO</span>
                  <span>🥛 Sin Pitillo (300 ud)</span>
                </button>
                <button
                  onClick={() => loadTemplate('growth')}
                  className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 rounded-xl transition-all text-[11px] font-black uppercase tracking-wider text-left flex flex-col gap-1"
                >
                  <span className="text-zinc-500 text-[9px]">SUSCRIPCIÓN</span>
                  <span>⚡ Growth Maintenance ($30)</span>
                </button>
                <button
                  onClick={() => loadTemplate('web')}
                  className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 rounded-xl transition-all text-[11px] font-black uppercase tracking-wider text-left flex flex-col gap-1"
                >
                  <span className="text-zinc-500 text-[9px]">PAQUETE CORPORATIVO</span>
                  <span>🌐 Web Dev & SEO</span>
                </button>
              </div>
            </div>

            {/* Main Form Fields */}
            <div className="bg-[#0e131f]/50 border border-white/5 rounded-3xl p-6 md:p-8 space-y-8">
              
              {/* Header Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-white/5 pb-2">
                  1. Datos Generales de la Factura
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">No. Factura</label>
                    <input 
                      type="text" 
                      value={invoiceNumber} 
                      onChange={(e) => setInvoiceNumber(e.target.value)} 
                      placeholder="Ej: UNV-26-0042"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] focus:ring-1 focus:ring-[#2ddc80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Fecha de Emisión</label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] focus:ring-1 focus:ring-[#2ddc80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Vencimiento</label>
                    <input 
                      type="date" 
                      value={dueDate} 
                      onChange={(e) => setDueDate(e.target.value)} 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] focus:ring-1 focus:ring-[#2ddc80] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Emisor (Always Prefilled) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                    2. Datos del Emisor (Universa)
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Empresa</label>
                    <input 
                      type="text" 
                      value={emisorName} 
                      onChange={(e) => setEmisorName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Representante / CEO</label>
                    <input 
                      type="text" 
                      value={emisorRepresentative} 
                      onChange={(e) => setEmisorRepresentative(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Identificación / Cédula</label>
                    <input 
                      type="text" 
                      value={emisorTaxId} 
                      onChange={(e) => setEmisorTaxId(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Teléfono</label>
                    <input 
                      type="text" 
                      value={emisorPhone} 
                      onChange={(e) => setEmisorPhone(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Email</label>
                    <input 
                      type="email" 
                      value={emisorEmail} 
                      onChange={(e) => setEmisorEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Dirección Física</label>
                    <input 
                      type="text" 
                      value={emisorAddress} 
                      onChange={(e) => setEmisorAddress(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Receptor (Client) */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-white/5 pb-2">
                  3. Datos del Cliente (Receptor)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Nombre del Cliente / Empresa</label>
                    <input 
                      type="text" 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)} 
                      placeholder="Ej: Chocolat Deli café"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] focus:ring-1 focus:ring-[#2ddc80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Email de Facturación</label>
                    <input 
                      type="email" 
                      value={clientEmail} 
                      onChange={(e) => setClientEmail(e.target.value)} 
                      placeholder="Ej: cliente@correo.com"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Teléfono</label>
                    <input 
                      type="text" 
                      value={clientPhone} 
                      onChange={(e) => setClientPhone(e.target.value)} 
                      placeholder="Ej: +58 (424) 000-0000"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Dirección Cliente</label>
                    <input 
                      type="text" 
                      value={clientAddress} 
                      onChange={(e) => setClientAddress(e.target.value)} 
                      placeholder="Ej: Las Mercedes, Caracas"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Items Detail Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                    4. Detalles Financieros (Servicios/Productos)
                  </h3>
                  <button 
                    onClick={handleAddItem}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#2ddc80]/10 hover:bg-[#2ddc80]/20 text-[#2ddc80] border border-[#2ddc80]/30 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir Fila
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="bg-black/25 border border-white/5 p-4 rounded-2xl relative space-y-3 group/item hover:border-white/10 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-zinc-600 uppercase">Ítem #{index + 1}</span>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-zinc-600 hover:text-red-400 transition-colors"
                          title="Eliminar ítem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6">
                          <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Descripción</label>
                          <input 
                            type="text" 
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                            placeholder="Descripción del servicio o producto"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Cant.</label>
                          <input 
                            type="number" 
                            value={item.qty}
                            onChange={(e) => handleUpdateItem(item.id, 'qty', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-[#2ddc80] transition-all"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Precio Unit.</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-2 text-[10px] text-zinc-500">$</span>
                            <input 
                              type="number" 
                              step="0.01"
                              value={item.price || ''}
                              onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-black/40 border border-white/10 rounded-lg pl-6 pr-2 py-2 text-xs text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2 flex flex-col justify-end text-right pr-2">
                          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">Total</span>
                          <span className="text-xs font-bold text-white">${(item.qty * item.price).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax & Discount Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-white/5 pb-2">
                  5. Impuestos y Descuentos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">IVA / Impuesto (%)</label>
                    <input 
                      type="number" 
                      value={taxPercent || ''} 
                      onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)} 
                      placeholder="Ej: 16"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Descuento (%)</label>
                    <input 
                      type="number" 
                      value={discountPercent || ''} 
                      onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)} 
                      placeholder="Ej: 10"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2ddc80] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Payment notes */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-white/5 pb-2">
                  6. Datos de Pago y Notas
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Instrucciones de Pago</label>
                    <textarea 
                      value={paymentNotes} 
                      onChange={(e) => setPaymentNotes(e.target.value)} 
                      rows={5}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#2ddc80] transition-all font-mono leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Condiciones y Notas Adicionales</label>
                    <textarea 
                      value={additionalNotes} 
                      onChange={(e) => setAdditionalNotes(e.target.value)} 
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#2ddc80] transition-all leading-relaxed"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* LIVE INVOICE PREVIEW (Right)                                              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Theme Toggle (Hidden during print) */}
            <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl p-3 print:hidden">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-2">Estilo de Vista Previa</span>
              <div className="flex bg-black rounded-xl p-1 gap-1">
                <button 
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${previewTheme === 'dark' ? 'bg-[#2ddc80]/20 text-[#2ddc80]' : 'text-zinc-600 hover:text-white'}`}
                >
                  Digital (Dark)
                </button>
                <button 
                  onClick={() => setPreviewTheme('light')}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${previewTheme === 'light' ? 'bg-white text-black' : 'text-zinc-600 hover:text-white'}`}
                >
                  Imprenta (Light)
                </button>
              </div>
            </div>

            {/* The Actual Invoice Sheet Card */}
            <div 
              id="printable-invoice"
              className={`transition-all duration-500 shadow-2xl relative border overflow-hidden rounded-[2rem] md:rounded-[2.5rem]
                ${previewTheme === 'dark' 
                  ? 'bg-[#0e131f] border-white/5 text-white/90 p-8 md:p-12' 
                  : 'bg-white border-zinc-200 text-zinc-800 p-8 md:p-12'
                }
              `}
            >
              {/* Top Accent Line */}
              <div 
                className="absolute top-0 left-0 right-0 h-[4px] z-20" 
                style={{ background: 'linear-gradient(to right, transparent, #2ddc80, transparent)' }}
              />
              
              {/* Luxury Proposal Gradient Border (Only visible in dark theme screen, hidden in print) */}
              {previewTheme === 'dark' && (
                <div 
                  className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] border-[2.5px] border-transparent transition-all duration-500 z-10 pointer-events-none print:hidden"
                  style={{
                    maskImage: 'linear-gradient(to bottom, transparent, black)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)',
                    borderColor: 'rgba(45, 220, 128, 0.4)'
                  }}
                />
              )}

              {/* Digital preview pulse tag (Hidden during print) */}
              <div className="absolute top-6 right-6 z-20 print:hidden">
                <div className={`px-3 py-1.5 border rounded-full flex items-center gap-2 
                  ${previewTheme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80] animate-pulse shadow-[0_0_8px_#2ddc80]" />
                  <span className={`font-black text-[9px] uppercase tracking-widest ${previewTheme === 'dark' ? 'text-white' : 'text-zinc-500'}`}>
                    {previewTheme === 'dark' ? 'Universa Digital View' : 'Imprenta / PDF Layout'}
                  </span>
                </div>
              </div>

              {/* Texture Layer (Only on dark theme screen) */}
              {previewTheme === 'dark' && (
                <div className="absolute inset-0 z-0 opacity-[0.25] bg-[url('/images/texture.png')] bg-repeat bg-[length:50px_50px] pointer-events-none print:hidden" />
              )}

              {/* Content Container */}
              <div className="relative z-10 space-y-12">
                
                {/* 1. Header (Logo & Invoice Metas) */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                  <div className="space-y-4">
                    {/* Universa Brand Logo */}
                    <div className="flex items-center gap-4">
                      <div className={`w-20 h-20 flex items-center justify-center p-2 rounded-2xl border transition-colors print-logo-container
                        ${previewTheme === 'dark' 
                          ? 'bg-black/40 border-white/10' 
                          : 'bg-zinc-100 border-zinc-200 print:bg-transparent print:border-none'
                        }
                      `}>
                        <Image 
                          src="/images/universa_logo.png" 
                          alt="Universa Logo" 
                          width={72} 
                          height={72}
                          unoptimized
                          className={`transition-all duration-300 print-logo-dark print-logo-img object-contain
                            ${previewTheme === 'dark' ? '' : 'brightness-0'}
                          `}
                          style={{ height: 'auto', maxHeight: '100%', width: 'auto' }}
                        />
                      </div>
                      <span className={`text-2xl font-medium tracking-tight print-text-dark ${previewTheme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                        {emisorName}
                      </span>
                    </div>
                    {/* Emisor meta details */}
                    <div className={`text-xs space-y-1 print-text-muted ${previewTheme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                      <p className="font-bold text-zinc-400 print-text-dark">{emisorName}</p>
                      {emisorRepresentative && (
                        <p className={`font-semibold ${previewTheme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'} print-text-dark`}>
                          CEO: {emisorRepresentative}
                        </p>
                      )}
                      <p>{emisorAddress}</p>
                      <p>WhatsApp: {emisorPhone}</p>
                      <p>Email: {emisorEmail}</p>
                      <p className="text-[10px] font-mono mt-1 opacity-70">{emisorTaxId}</p>
                    </div>
                  </div>

                  {/* Invoice Meta */}
                  <div className="sm:text-right space-y-2 mt-2 sm:mt-0">
                    <p className={`text-[10px] font-black uppercase tracking-widest print-text-muted ${previewTheme === 'dark' ? 'text-[#2ddc80]' : 'text-emerald-700 font-bold'}`}>
                      Cotización / Factura
                    </p>
                    <p className={`text-3xl font-black tracking-tight print-text-dark leading-none ${previewTheme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {invoiceNumber || '#NO-NUM'}
                    </p>
                    <div className={`text-xs space-y-1 print-text-muted ${previewTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      <p><span className="font-bold">Fecha:</span> {date ? new Date(date).toLocaleDateString('es-ES', { timeZone: 'UTC' }) : '-'}</p>
                      <p><span className="font-bold text-[#2ddc80] print-text-dark">Vence:</span> {dueDate ? new Date(dueDate).toLocaleDateString('es-ES', { timeZone: 'UTC' }) : '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Header Divider Line */}
                <div 
                  className="h-[2px] w-full my-1 print:bg-zinc-200 print:h-[1px] print:my-4" 
                  style={{ background: 'linear-gradient(to right, transparent, rgba(45, 220, 128, 0.5), transparent)' }}
                />

                {/* 2. Client Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className={`p-6 rounded-2xl border-y border-r border-l-4 border-l-[#2ddc80] print-bg-light print-border ${previewTheme === 'dark' ? 'bg-[#060a14] border-y-white/5 border-r-white/5' : 'bg-zinc-50 border-y-zinc-200 border-r-zinc-200'}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-3">Facturado A:</span>
                    <h4 className={`text-lg font-black uppercase tracking-tight print-text-dark mb-2 ${previewTheme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
                      {clientName || 'Nombre del Cliente'}
                    </h4>
                    <div className={`text-xs space-y-1 print-text-muted ${previewTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {clientAddress && <p>{clientAddress}</p>}
                      {clientPhone && <p>Tel: {clientPhone}</p>}
                      {clientEmail && <p>{clientEmail}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center border-l border-white/5 border-zinc-200 pl-0 md:pl-8 pt-4 md:pt-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#2ddc80] print-text-dark block mb-2">Estado de la Orden</span>
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className={`text-xs font-black uppercase tracking-wider print-text-dark ${previewTheme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Esperando Confirmación / Pendiente
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">Los servicios comenzarán una vez sea abonado el primer pago de la cotización.</p>
                  </div>
                </div>

                {/* 3. Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-emerald-500/20 print:border-zinc-200">
                        <th className={`py-4 text-[10px] font-black uppercase tracking-wider print-text-muted ${previewTheme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>Detalle</th>
                        <th className={`py-4 text-[10px] font-black uppercase tracking-wider text-center print-text-muted ${previewTheme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>Cant.</th>
                        <th className={`py-4 text-[10px] font-black uppercase tracking-wider text-right print-text-muted ${previewTheme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>Precio</th>
                        <th className={`py-4 text-[10px] font-black uppercase tracking-wider text-right print-text-muted ${previewTheme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 divide-zinc-100">
                      {items.map((item, idx) => (
                        <tr 
                          key={item.id || idx} 
                          className="border-b border-emerald-500/10 last:border-0 hover:bg-emerald-500/[0.02] print:border-zinc-100 print:hover:bg-transparent"
                        >
                          <td className="py-4 pr-4">
                            <p className={`text-sm font-bold print-text-dark ${previewTheme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                              {item.description || 'Nuevo Servicio'}
                            </p>
                          </td>
                          <td className={`py-4 text-center text-sm print-text-dark ${previewTheme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {item.qty}
                          </td>
                          <td className={`py-4 text-right text-sm print-text-dark ${previewTheme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            ${item.price.toFixed(2)}
                          </td>
                          <td className={`py-4 text-right text-sm font-bold print-text-dark ${previewTheme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                            ${(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 4. Financial Calculation Summary */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-6 border-t print-border border-white/5 border-zinc-200">
                  <div className="space-y-4 w-full sm:max-w-md">
                    {paymentNotes && (
                      <div className={`p-4 rounded-xl border-y border-r border-l-4 border-l-[#2ddc80] print-border ${previewTheme === 'dark' ? 'bg-[#060a14]/50 border-y-white/5 border-r-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-2">Instrucciones de Transferencia</span>
                        <pre className={`text-[10px] leading-relaxed whitespace-pre-wrap font-mono print-text-muted ${previewTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {paymentNotes}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Pricing block */}
                  <div className="w-full sm:w-64 space-y-3 ml-auto">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-medium">Subtotal:</span>
                      <span className={`font-bold print-text-dark ${previewTheme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
                        ${getSubtotal().toFixed(2)}
                      </span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#2ddc80] print-text-dark font-medium">Descuento ({discountPercent}%):</span>
                        <span className="text-[#2ddc80] print-text-dark font-bold">
                          -${getDiscountAmount().toFixed(2)}
                        </span>
                      </div>
                    )}

                    {taxPercent > 0 && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium">IVA ({taxPercent}%):</span>
                        <span className={`font-bold print-text-dark ${previewTheme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
                          +${getTaxAmount().toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className={`flex justify-between items-center p-3.5 rounded-xl border-y border-r border-l-4 border-l-[#2ddc80] transition-colors
                      ${previewTheme === 'dark' 
                        ? 'bg-[#2ddc80]/5 border-y-white/5 border-r-white/5' 
                        : 'bg-emerald-50/50 border-y-zinc-200 border-r-zinc-200'
                      }`}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-widest print-text-dark ${previewTheme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Total Neto:
                      </span>
                      <span className={`text-lg font-black print-text-dark ${previewTheme === 'dark' ? 'text-[#2ddc80]' : 'text-emerald-800'}`}>
                        ${getGrandTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Footer & Remarks */}
                {additionalNotes && (
                  <div className="pt-8 border-t print-border border-white/5 border-zinc-200">
                    <div className="flex gap-3">
                      <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${previewTheme === 'dark' ? 'text-[#2ddc80]' : 'text-zinc-400'}`} />
                      <div className="space-y-1">
                        <p className={`text-[9px] font-black uppercase tracking-widest print-text-dark ${previewTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Condiciones adicionales</p>
                        <p className={`text-[10px] leading-relaxed print-text-muted ${previewTheme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                          {additionalNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center pt-8 opacity-40 print-text-dark">
                  <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${previewTheme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    © {new Date().getFullYear()} UNIVERSA AGENCY. ALL RIGHTS RESERVED.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Global CSS overrides for clean full-page Printing */}
      <style dangerouslySetInnerHTML={{ __html: `
        #printable-invoice {
          --color-zinc-50: #f9fafb;
          --color-zinc-100: #f3f4f6;
          --color-zinc-200: #e5e7eb;
          --color-zinc-300: #d1d5db;
          --color-zinc-400: #9ca3af;
          --color-zinc-500: #6b7280;
          --color-zinc-600: #4b5563;
          --color-zinc-700: #374151;
          --color-zinc-800: #1f2937;
          --color-zinc-900: #111827;
          
          --color-emerald-50: #ecfdf5;
          --color-emerald-100: #d1fae5;
          --color-emerald-200: #a7f3d0;
          --color-emerald-300: #6ee7b7;
          --color-emerald-400: #34d399;
          --color-emerald-500: #10b981;
          --color-emerald-600: #059669;
          --color-emerald-700: #047857;
          --color-emerald-800: #065f46;
          --color-emerald-900: #064e3b;
          --color-emerald-950: #022c22;
          
          --color-amber-50: #fffbeb;
          --color-amber-100: #fef3c7;
          --color-amber-200: #fde68a;
          --color-amber-300: #fcd34d;
          --color-amber-400: #fbbf24;
          --color-amber-500: #f59e0b;
          --color-amber-600: #d97706;
          --color-amber-700: #b45309;
          --color-amber-800: #92400e;
          --color-amber-900: #78350f;
          --color-amber-950: #451a03;
        }

        @media print {
          /* Force page margin to avoid headers/footers */
          @page {
            margin: 1.5cm;
            size: letter;
          }
          /* Hide everything in the document */
          body {
            background: white !important;
            color: black !important;
          }
          main {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Hide normal web elements */
          nav, .print\:hidden, button, input, textarea, select {
            display: none !important;
          }
          /* Re-position the printable element */
          #printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: white !important;
            color: #1f2937 !important; /* Tailwind grey-800 */
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            visibility: visible !important;
          }
          /* Ensure all nested text gets visibility */
          #printable-invoice * {
            visibility: visible !important;
          }
          /* Text replacements */
          .print-text-dark {
            color: #111827 !important; /* Gray 900 */
          }
          .print-text-muted {
            color: #4b5563 !important; /* Gray 600 */
          }
          .print-bg-light {
            background-color: #f3f4f6 !important; /* Gray 100 */
          }
          .print-border {
            border-color: #e5e7eb !important; /* Gray 200 */
          }
          .print-accent {
            color: #047857 !important; /* Emerald 700 */
          }
          .print-accent-bg {
            background-color: #ecfdf5 !important; /* Emerald 50 */
          }
          .print-logo-dark {
            filter: brightness(0) !important;
          }
          .print-logo-container {
            width: 110px !important;
            height: auto !important;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
          }
          .print-logo-img {
            width: 110px !important;
            height: auto !important;
          }
        }
      `}} />
    </main>
  );
}
