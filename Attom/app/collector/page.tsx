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
      // Volver al paso anterior para reintentar
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

  // Step Progress Bar
  const StepProgress = () => (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepIndex = steps.findIndex(s => s.id === currentStep);
          const isActive = step.id === currentStep;
          const isCompleted = index < stepIndex;
          const isFuture = index > stepIndex;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-110'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : step.icon}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 md:w-24 h-1 mx-2 rounded ${
                    isCompleted ? 'bg-green-500' : isFuture ? 'bg-gray-200' : 'bg-purple-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Generating State
  if (currentStep === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
        <StepProgress />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping opacity-20" />
              <div className="absolute inset-4 rounded-full border-4 border-purple-300 animate-ping opacity-30 animation-delay-200" />
              <div className="absolute inset-8 rounded-full border-4 border-purple-400 animate-ping opacity-40 animation-delay-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl animate-bounce">🤖</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Claude está analizando tu negocio...
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Estamos generando la estructura perfecta para tu web basada en tu nicho y la información proporcionada.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full animate-pulse">
                📄 Creando secciones
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full animate-pulse animation-delay-200">
                📁 Organizando categorías
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full animate-pulse animation-delay-400">
                🛍️ Detallando productos
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Structure Builder
  if (currentStep === 'structure' && webStructure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
        <StepProgress />
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Estructura de tu Web
            </h1>
            <p className="text-gray-500">
              Revisa y personaliza cada sección, categoría y producto
            </p>
          </div>

          <WebStructureBuilder
            structure={webStructure}
            onUpdate={handleStructureUpdate}
            onConfirm={handleStructureConfirm}
          />

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentStep('collect')}
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              ← Volver a editar información
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Complete State
  if (currentStep === 'complete' && webStructure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
        <StepProgress />
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Success Animation */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              ¡Tu Web Está Lista para Crear!
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Hemos guardado toda la información y estructura de tu negocio. Nuestro equipo comenzará a trabajar en tu web inmediatamente.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-4xl font-bold text-purple-600 mb-1">
                {webStructure.sections.filter(s => s.enabled).length}
              </h3>
              <p className="text-gray-500">Secciones</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="text-4xl font-bold text-indigo-600 mb-1">
                {webStructure.categories.length}
              </h3>
              <p className="text-gray-500">Categorías</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛍️</span>
              </div>
              <h3 className="text-4xl font-bold text-pink-600 mb-1">
                {webStructure.products.length}
              </h3>
              <p className="text-gray-500">Productos</p>
            </div>
          </div>

          {/* Color Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Paleta de Colores</h3>
            <div className="flex gap-4">
              {Object.entries(webStructure.colorScheme).map(([key, color]) => (
                <div key={key} className="flex-1 text-center">
                  <div
                    className="h-16 rounded-xl shadow-inner mb-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-500 capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🚀</span> Próximos Pasos
            </h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <p className="font-medium text-gray-800">Diseño del Wireframe</p>
                  <p className="text-sm text-gray-500">Crearemos el boceto visual de tu web (1-2 días)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <p className="font-medium text-gray-800">Desarrollo</p>
                  <p className="text-sm text-gray-500">Construiremos tu web con todas las secciones (3-5 días)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <p className="font-medium text-gray-800">Revisión y Lanzamiento</p>
                  <p className="text-sm text-gray-500">Aprobarás el diseño y lo publicaremos</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartOver}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Crear Otro Proyecto
            </button>
            <button
              onClick={() => {
                // Aquí enviarías los datos a tu backend/CRM
                console.log('Business Info:', businessInfo);
                console.log('Web Structure:', webStructure);
                alert('¡Datos enviados! Te contactaremos pronto.');
              }}
              className="px-8 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              Enviar y Continuar 🚀
            </button>
          </div>

          {/* Dev Tools */}
          <details className="mt-12">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-600">
              Ver datos completos (desarrollo)
            </summary>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">Información del Negocio:</h4>
                <pre className="p-4 bg-gray-900 text-green-400 rounded-xl text-xs overflow-auto max-h-48">
                  {JSON.stringify(businessInfo, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">Estructura Web:</h4>
                <pre className="p-4 bg-gray-900 text-green-400 rounded-xl text-xs overflow-auto max-h-96">
                  {JSON.stringify(webStructure, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </div>
      </div>
    );
  }

  // Collect Info (Default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
      <StepProgress />

      {error && (
        <div className="max-w-4xl mx-auto px-4 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-red-500">⚠️</span>
            <div className="flex-1">
              <p className="text-red-700 font-medium">Error al generar estructura</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <ChatCollector onComplete={handleInfoComplete} />
    </div>
  );
}
