'use client';

import { useState, useRef, useEffect } from 'react';
import { InfoBlockData } from './InfoBlock';
import {
  DocumentIcon, PencilIcon, TrashIcon, SendIcon, BotIcon,
  LightbulbIcon, CheckIcon, SparklesIcon, getFieldIcon
} from './Icons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatCollectorProps {
  onComplete?: (collectedInfo: InfoBlockData[]) => void;
  welcomeMessage?: string;
}

export default function ChatCollector({ onComplete, welcomeMessage }: ChatCollectorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [collectedInfo, setCollectedInfo] = useState<InfoBlockData[]>([]);
  const [newBlockIds, setNewBlockIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const defaultWelcome = `¡Hola! Soy el asistente de **ATTOM**.

Voy a ayudarte a recopilar la información de tu negocio para crear tu página web profesional.
Si ya tienes una web actual o redes sociales, puedes pegarme el **enlace (URL)** y extraeré la información automáticamente.

Si no, dime: ¿Cuál es el **nombre de tu negocio**?`;

    const welcome: Message = {
      id: 'welcome',
      role: 'assistant',
      content: welcomeMessage || defaultWelcome,
      timestamp: new Date(),
    };
    setMessages([welcome]);
  }, [welcomeMessage]);

  useEffect(() => {
    if (newBlockIds.size > 0) {
      const timer = setTimeout(() => setNewBlockIds(new Set()), 3000);
      return () => clearTimeout(timer);
    }
  }, [newBlockIds]);

  const [fallbackStep, setFallbackStep] = useState(0);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const SLOW_QUESTIONS = [
    { field: 'businessName', label: 'Nombre del Negocio', icon: '🏢', question: 'No te preocupes, sigamos por aquí. ¿Cuál es el **nombre de tu negocio**?' },
    { field: 'businessType', label: 'Tipo de Negocio', icon: '🛍️', question: '¡Excelente! ¿A qué se dedica principalmente? (Ejm: Restaurante, Consultoría, Tienda Online)' },
    { field: 'industry', label: 'Industria/Sector', icon: '🏗️', question: 'Perfecto. ¿En qué sector o industria específica te encuentras?' },
    { field: 'valueProp', label: 'Propuesta de Valor', icon: '✨', question: 'Entendido. ¿Cuál es la **visión** o el beneficio principal que te hace diferente a la competencia?' },
    { field: 'contact', label: 'Contacto', icon: '📞', question: 'Perfecto. Por último, ¿cuál es tu **email o WhatsApp** para que los clientes te contacten?' }
  ];

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // --- FALLBACK MODE LOGIC ---
    if (isFallbackMode) {
      const currentQ = SLOW_QUESTIONS[fallbackStep];
      const newBlock: InfoBlockData = {
        id: `${currentQ.field}-${Date.now()}`,
        field: currentQ.field,
        label: currentQ.label,
        value: userMessage.content,
        icon: currentQ.icon,
        confirmed: true,
        timestamp: new Date().toISOString()
      };

      setCollectedInfo(prev => [...prev, newBlock]);
      setNewBlockIds(new Set([newBlock.id]));

      if (fallbackStep < SLOW_QUESTIONS.length - 1) {
        setIsLoading(true);
        setTimeout(() => {
          const nextQ = SLOW_QUESTIONS[fallbackStep + 1];
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: nextQ.question,
            timestamp: new Date()
          }]);
          setFallbackStep(prev => prev + 1);
          setIsLoading(false);
        }, 800);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: '¡Magnífico! Ya tengo los pilares de tu ecosistema. Haz clic en **Finalizar y Desplegar** para ver tu arquitectura.',
          timestamp: new Date()
        }]);
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-collector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          currentInfo: collectedInfo
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.response || 'API Error');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Continúa contándome sobre tu negocio.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (data.extractedInfo && data.extractedInfo.length > 0) {
        const newIds = new Set<string>(data.extractedInfo.map((info: InfoBlockData) => info.id));
        setNewBlockIds(newIds);

        setCollectedInfo(prev => {
          const existingFields = new Set(prev.map(p => p.field));
          const newInfo = data.extractedInfo.filter(
            (info: InfoBlockData) => !existingFields.has(info.field)
          );
          return [...prev, ...newInfo];
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      setIsFallbackMode(true);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Neural Link Error: ${error.message || 'Interferencia detectada'}. Pasando a **Modo Resiliente** para no detener tu flujo.\n\n${SLOW_QUESTIONS[0].question}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEditInfo = (id: string, newValue: string) => {
    setCollectedInfo(prev =>
      prev.map(info =>
        info.id === id ? { ...info, value: newValue, timestamp: new Date().toISOString() } : info
      )
    );
  };

  const processToHQ = async () => {
    if (collectedInfo.length < 3 || isLoading) return;
    setIsLoading(true);

    try {
      // Map collected info to ClientData structure
      const data: any = {};
      collectedInfo.forEach(info => {
        data[info.field] = info.value;
      });

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: data.businessName,
          businessType: data.businessType || data.industry,
          contactName: 'Pendiente (Attom Link)',
          contact: data.contact || '',
          valueProp: data.valueProp,
          brandStyle: data.brandStyle,
          reference: data.reference,
        }),
      });

      if (!response.ok) throw new Error('Failed to save to HQ');
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `📈 **¡Sincronización Exitosa!**\nHe cargado tu proyecto en el **Attom Command HQ**. Ya puedes verlo como un "Proyecto Pendiente" en tu panel de administración.\n\n¿Deseas iniciar con el despliegue ahora?`,
        timestamp: new Date()
      }]);

      if (onComplete) onComplete(collectedInfo);

    } catch (error: any) {
      console.error('HQ Ingestion Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `⚠️ Hubo un error al sincronizar con el HQ: ${error.message}. Por favor, regístrate manualmente en el dashboard.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInfo = (id: string) => {
    setCollectedInfo(prev => prev.filter(info => info.id !== id));
  };

  const progress = Math.round((collectedInfo.length / 12) * 100);

  const renderMessageContent = (content: string) => {
    // Handle suggestions in brackets [Suggestion Text]
    const parts = content.split(/(\[.*?\])/);
    
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const suggestion = part.slice(1, -1);
        return (
          <button
            key={i}
            onClick={() => {
              setInputValue(suggestion);
              // We'll leave it in the input so the user can see it before sending, 
              // or we could auto-send if we had access to the sendMessage function.
              // For now, setting the value is a good first step.
            }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold hover:bg-purple-500 hover:text-white transition-all my-1 mx-1 shadow-lg shadow-purple-500/5 group"
          >
            {suggestion}
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </button>
        );
      }
      
      // Handle bold text
      return part.split('**').map((text, j) => 
        j % 2 === 1 ? <strong key={`${i}-${j}`} className="text-purple-300 font-semibold">{text}</strong> : text
      );
    });
  };

  const renderFieldIcon = (field: string) => {
    const IconComponent = getFieldIcon(field);
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-[#060608] relative overflow-hidden selection:bg-purple-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-[fadeInUp_1s_ease-out]">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Neural Link Active</span>
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-black mb-4 tracking-tighter leading-none">
            <span className="text-white">ATTOM</span>
            <span className="text-zinc-600 font-extralight ml-3">Collector</span>
          </h1>
          <p className="text-zinc-500 text-base max-w-lg mx-auto font-light leading-relaxed">
            Nuestra IA está lista para estructurar el ecosistema digital de tu negocio.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12 animate-[fadeInUp_1s_ease-out_0.2s_both]">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Estructuración</span>
            <span className="text-sm font-black font-mono text-purple-400">{progress}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
            <div
              className="h-full rounded-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366f1, #a855f7, #6366f1)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
          <div className="flex justify-between mt-3 px-1">
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">{collectedInfo.length} / 12 Atributos</span>
            {collectedInfo.length >= 3 && (
              <button
                onClick={processToHQ}
                disabled={isLoading}
                className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-all hover:translate-x-1 flex items-center gap-2 group"
              >
                {isLoading ? 'Sincronizando...' : 'Procesar a HQ Admin →'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* RIGHT: Chat Interface (Moved up on mobile) */}
          <div className="lg:col-span-8 lg:order-2">
            <div className="bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden mb-6 md:mb-10 animate-[fadeInUp_1s_ease-out_0.4s_both]">
              {/* Chat Header */}
              <div className="px-6 md:px-8 py-4 md:py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <BotIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 md:border-4 border-[#09090b]" />
                  </div>
                  <div>
                    <h2 className="text-white text-sm md:text-base font-bold tracking-tight italic">Attom Intelligence</h2>
                    <p className="text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                      {isLoading ? 'Analizando...' : 'Sincronizado'}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block px-4 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                  Gemini 2.0 Engine
                </div>
              </div>

              {/* Messages Container */}
              <div className="h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 custom-scrollbar-premium">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-[popIn_0.4s_cubic-bezier(0.16,1,0.3,1)]`}
                  >
                    <div
                      className={`max-w-[80%] px-6 py-4 shadow-xl ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-[2rem] rounded-br-[0.5rem] shadow-indigo-600/10'
                          : 'bg-white/[0.03] text-zinc-200 border border-white/5 rounded-[2.5rem] rounded-bl-[0.5rem] backdrop-blur-md'
                      }`}
                    >
                      <div className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium tracking-wide">
                        {message.role === 'assistant'
                          ? renderMessageContent(message.content)
                          : message.content
                        }
                      </div>
                      <div className={`text-[8px] mt-3 font-black uppercase tracking-widest opacity-30 ${
                        message.role === 'user' ? 'text-white' : 'text-zinc-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 px-6 py-4 rounded-[2rem] rounded-bl-[0.5rem] border border-white/5 backdrop-blur-md flex gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:1s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white/[0.01] border-t border-white/5">
                <div className="flex gap-4 items-end bg-white/[0.03] border border-white/5 rounded-[2rem] p-2 pr-3 focus-within:border-indigo-500/30 transition-all shadow-inner">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Dime más sobre tu negocio..."
                    className="flex-1 px-5 py-4 bg-transparent text-white text-[14px] placeholder-zinc-700 focus:outline-none resize-none max-h-32 min-h-[56px]"
                    disabled={isLoading}
                    rows={1}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-zinc-800 text-white transition-all flex items-center justify-center group shadow-xl shadow-indigo-600/20"
                  >
                    <SendIcon className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LEFT: Collected Data (Restored and moved below on mobile) */}
          <div className="lg:col-span-4 lg:order-1 order-2 space-y-6 md:space-y-8 animate-[fadeInUp_1s_ease-out_0.2s_both]">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <DocumentIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight italic">Estructura</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Contexto Recopilado</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[500px] lg:max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar-premium">
              {collectedInfo.length === 0 ? (
                <div className="col-span-full p-8 border border-dashed border-white/5 rounded-3xl text-center">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Esperando datos...</p>
                </div>
              ) : (
                collectedInfo.map((info) => (
                  <div
                    key={info.id}
                    className={`group relative bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 p-4 md:p-5 hover:border-purple-500/30 transition-all ${
                      newBlockIds.has(info.id) ? 'ring-2 ring-purple-500/20 border-purple-500/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-purple-400">
                          {renderFieldIcon(info.field)}
                        </div>
                        <span className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                          {info.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed font-medium pl-9 md:pl-10">{info.value}</p>
                  </div>
                ))
              )}
            </div>

            {/* Progress Visualization (Simplified for side) */}
            <div className="p-5 md:p-6 bg-white/[0.02] border border-white/5 rounded-3xl hidden lg:block">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Progreso</span>
                <span className="text-sm font-black font-mono text-purple-400">{progress}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
