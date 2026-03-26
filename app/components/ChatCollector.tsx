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

Voy a ayudarte a recopilar toda la información de tu negocio para crear tu página web profesional.

¿Cuál es el **nombre de tu negocio**?`;

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
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Hubo un error. Por favor intenta de nuevo.',
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

  const handleDeleteInfo = (id: string) => {
    setCollectedInfo(prev => prev.filter(info => info.id !== id));
  };

  const progress = Math.round((collectedInfo.length / 12) * 100);

  const renderMessageContent = (content: string) => {
    return content.split('**').map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="text-purple-300 font-semibold">{part}</strong> : part
    );
  };

  const renderFieldIcon = (field: string) => {
    const IconComponent = getFieldIcon(field);
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Sistema Online</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              ATTOM
            </span>
            <span className="text-white/40 font-extralight ml-2">Collector</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Recopilación inteligente de información empresarial
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-zinc-500">Progreso</span>
            <span className="text-xs font-mono text-purple-400">{progress}%</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #a855f7, #6366f1)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-zinc-600">{collectedInfo.length}/12 campos</span>
            {collectedInfo.length >= 5 && (
              <button
                onClick={() => onComplete?.(collectedInfo)}
                className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors"
              >
                Continuar →
              </button>
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50 overflow-hidden mb-6">
          {/* Chat Header */}
          <div className="px-5 py-3 border-b border-zinc-800/50 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-zinc-900" />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-sm font-medium">ATTOM Assistant</h2>
              <p className="text-[11px] text-zinc-500">
                {isLoading ? 'Procesando...' : 'Listo'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/50">
              <SparklesIcon className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] text-zinc-400 font-medium">AI</span>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[380px] overflow-y-auto p-5 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white rounded-2xl rounded-br-sm'
                      : 'bg-zinc-800/50 text-zinc-200 rounded-2xl rounded-bl-sm'
                  } px-4 py-3`}
                >
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                    {message.role === 'assistant'
                      ? renderMessageContent(message.content)
                      : message.content
                    }
                  </p>
                  <span className={`text-[9px] mt-1.5 block ${
                    message.role === 'user' ? 'text-purple-200/50' : 'text-zinc-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800/50 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-800/50">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu respuesta..."
                className="flex-1 px-4 py-3 bg-zinc-800/30 border border-zinc-700/50 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 resize-none"
                disabled={isLoading}
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="w-12 h-12 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white transition-all flex items-center justify-center"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Collected Data */}
        {collectedInfo.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <DocumentIcon className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Información Recopilada</h3>
                  <p className="text-[10px] text-zinc-500">Hover para editar</p>
                </div>
              </div>

              {collectedInfo.length >= 5 && (
                <button
                  onClick={() => onComplete?.(collectedInfo)}
                  className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1.5"
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                  Generar Web
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {collectedInfo.map((info) => (
                <div
                  key={info.id}
                  className={`group bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-3.5 hover:border-purple-500/30 transition-all ${
                    newBlockIds.has(info.id) ? 'ring-1 ring-purple-500/40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-purple-400">
                        {renderFieldIcon(info.field)}
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                        {info.label}
                      </span>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          const newValue = prompt('Editar:', info.value);
                          if (newValue !== null) handleEditInfo(info.id, newValue);
                        }}
                        className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-purple-400 transition-colors"
                      >
                        <PencilIcon className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteInfo(info.id)}
                        className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed pl-9">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {collectedInfo.length === 0 && (
          <div className="bg-zinc-900/30 rounded-xl border border-zinc-800/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <LightbulbIcon className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-white text-sm font-medium">Tips</h4>
            </div>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">→</span>
                Responde con detalle para mejores resultados
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">→</span>
                Toda la información es editable después
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">→</span>
                Mínimo 5 campos para continuar
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
