'use client';

import { useState } from 'react';
import ChatCollector from '../components/ChatCollector';
import { InfoBlockData } from '../components/InfoBlock';
import WebStructureBuilder, { WebStructure } from '../components/WebStructureBuilder';

type Step = 'collect' | 'generating' | 'structure' | 'complete';

export default function CollectorPage() {
  const [currentStep, setCurrentStep] = useState<Step>('collect');
  const [businessInfo, setBusinessInfo] = useState<InfoBlockData[]>([]);
  const [webStructure, setWebStructure] = useState<WebStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 'collect', label: 'Recopilar Info', icon: '💬' },
    { id: 'generating', label: 'Generando', icon: '⚡' },
    { id: 'structure', label: 'Estructura Web', icon: '🏗️' },
    { id: 'complete', label: 'Completado', icon: '✅' },
  ];

  const handleInfoComplete = async (collectedInfo: InfoBlockData[]) => {
    setBusinessInfo(collectedInfo);
    setCurrentStep('generating');
    setError(null);

    try {
      const response = await fetch('/api/generate-structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessInfo: collectedInfo.map(info => ({
            field: info.field,
            label: info.label,
            value: info.value
          }))
        }),
      });

      const data = await response.json();

      if (data.success && data.structure) {
        setWebStructure(data.structure);
        setCurrentStep('structure');
      } else {
        throw new Error(data.error || 'Error al generar estructura');
      }
    } catch (err) {
      console.error('Error generando estructura:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCurrentStep('collect');
    }
  };

  const handleStructureUpdate = (updatedStructure: WebStructure) => {
    setWebStructure(updatedStructure);
  };

  const handleStructureConfirm = () => {
    setCurrentStep('complete');
  };

  const handleStartOver = () => {
    setCurrentStep('collect');
    setBusinessInfo([]);
    setWebStructure(null);
    setError(null);
  };

  const StepProgress = () => (
    <div className="max-w-3xl mx-auto px-6 py-10 relative z-20">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepIndex = steps.findIndex(s => s.id === currentStep);
          const isActive = step.id === currentStep;
          const isCompleted = index < stepIndex;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 border ${
                    isActive
                      ? 'bg-purple-500 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-110'
                      : isCompleted
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : step.icon}
                </div>
                <span
                  className={`mt-3 text-[10px] uppercase tracking-widest font-bold ${
                    isActive ? 'text-purple-400' : isCompleted ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 md:w-24 h-[1px] mx-2 ${
                    isCompleted ? 'bg-emerald-500/40' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (currentStep === 'generating') {
    return (
      <div className="min-h-screen bg-[#080810] text-slate-100 flex flex-col">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        </div>
        
        <StepProgress />
        <div className="relative z-10 flex items-center justify-center flex-1 py-12">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-ping opacity-20" />
              <div className="absolute inset-4 rounded-full border-4 border-purple-500/30 animate-ping opacity-30 animation-delay-200" />
              <div className="absolute inset-8 rounded-full border-4 border-purple-500/40 animate-ping opacity-40 animation-delay-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl animate-bounce drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">🤖</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              Claude está analizando tu negocio...
            </h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8 font-light text-lg">
              Estamos generando la estructura perfecta para tu web basada en tu nicho y la información proporcionada.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <StatusBadge icon="📄" label="Creando secciones" />
              <StatusBadge icon="📁" label="Organizando categorías" delay="200" />
              <StatusBadge icon="🛍️" label="Detallando productos" delay="400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'structure' && webStructure) {
    return (
      <div className="min-h-screen bg-[#080810] text-slate-100 flex flex-col">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        </div>
        
        <StepProgress />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
              Estructura de tu Web
            </h1>
            <p className="text-slate-400 font-light text-lg">
              Revisa y personaliza cada sección, categoría y producto
            </p>
          </div>

          <WebStructureBuilder
            structure={webStructure}
            onUpdate={handleStructureUpdate}
            onConfirm={handleStructureConfirm}
          />

          <div className="mt-8 text-center">
            <button
              onClick={() => setCurrentStep('collect')}
              className="text-sm text-slate-500 hover:text-purple-400 transition-colors uppercase tracking-widest font-medium"
            >
              ← Volver a editar información
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete' && webStructure) {
    return (
      <div className="min-h-screen bg-[#080810] text-slate-100 flex flex-col">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full"></div>
        </div>
        
        <StepProgress />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 w-full">
          <div className="text-center mb-16">
            <div className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-in shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
              ¡Tu Web Está Lista para Crear!
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto text-lg font-light">
              Hemos guardado toda la información y estructura de tu negocio. Nuestro equipo comenzará a trabajar en tu web inmediatamente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <SummaryCard icon="📄" label="Secciones" value={webStructure.sections.filter(s => s.enabled).length} color="purple" />
            <SummaryCard icon="📁" label="Categorías" value={webStructure.categories.length} color="indigo" />
            <SummaryCard icon="🛍️" label="Productos" value={webStructure.products.length} color="pink" />
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 mb-12 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="p-2 bg-purple-500/20 rounded-lg text-xl">🚀</span> Próximos Pasos
            </h3>
            <div className="space-y-8">
              <StepItem number={1} title="Diseño del Wireframe" description="Crearemos el boceto visual de tu web (1-2 días)" />
              <StepItem number={2} title="Desarrollo Inmediato" description="Construiremos tu web con todas las secciones (3-5 días)" />
              <StepItem number={3} title="Revisión y Lanzamiento" description="Aprobarás el diseño y lo publicaremos" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartOver}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-300 font-medium hover:bg-white/10 transition-all"
            >
              Crear Otro Proyecto
            </button>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const response = await fetch('/api/collector/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ businessInfo, webStructure }),
                  });
                  const data = await response.json();
                  if (data.success) {
                    alert('¡Información enviada con éxito! Te contactaremos pronto.');
                  } else {
                    throw new Error(data.error || 'Error al guardar');
                  }
                } catch (err) {
                  console.error('Save error:', err);
                  alert('Error al enviar. Por favor, intenta de nuevo.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar y Finalizar 🚀'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-slate-100 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full"></div>
      </div>

      <StepProgress />

      {error && (
        <div className="relative z-30 max-w-4xl mx-auto px-6 mb-8 w-full">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="text-red-400 font-bold">Error del Sistema</p>
              <p className="text-red-400/80 text-sm font-light">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400/40 hover:text-red-400">✕</button>
          </div>
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col">
        <ChatCollector onComplete={handleInfoComplete} />
      </div>
    </div>
  );
}

// Support Components
function SummaryCard({ icon, label, value, color }: { icon: string, label: string, value: number, color: string }) {
  const colors: Record<string, string> = {
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
  };
  return (
    <div className={`p-8 rounded-[2rem] border ${colors[color]} backdrop-blur-sm text-center transition-transform hover:scale-105`}>
      <div className="text-2xl mb-4">{icon}</div>
      <div className="text-4xl font-bold mb-1 tracking-tighter">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">{label}</div>
    </div>
  );
}

function StepItem({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-sm font-bold text-slate-400 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 group-hover:text-purple-400 transition-all">
        {number}
      </div>
      <div>
        <p className="font-bold text-white text-lg">{title}</p>
        <p className="text-slate-400 font-light mt-1">{description}</p>
      </div>
    </div>
  );
}

function StatusBadge({ icon, label, delay = "0" }: { icon: string, label: string, delay?: string }) {
  return (
    <span 
      className="px-5 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-full text-sm font-medium animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="mr-2">{icon}</span> {label}
    </span>
  );
}
