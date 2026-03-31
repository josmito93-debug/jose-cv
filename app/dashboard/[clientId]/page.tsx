'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface ClientData {
  info: {
    businessName: string;
    contactName: string;
    phone: string;
    email?: string;
    businessType: string;
    createdAt: string;
  };
  branding: {
    colors: {
      primary: string;
      secondary?: string;
    };
    logo?: {
      url?: string;
      driveUrl?: string;
    };
  };
  assets?: {
    wireframes?: {
      pages: Array<{
        name: string;
        imageUrl?: string;
        driveUrl?: string;
      }>;
    };
    images?: Array<{
      type: string;
      url?: string;
      driveUrl?: string;
      description?: string;
    }>;
    seo?: {
      title: string;
      description: string;
      keywords: string[];
    };
  };
  payment: {
    method: string;
    status: string;
    amount: number;
    currency: string;
  };
  deployment: {
    status: string;
    github?: {
      repoUrl?: string;
    };
    hosting?: {
      url?: string;
      domain?: string;
    };
  };
}

export default function ClientDashboard() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      const data = await response.json();
      setClientData(data);
    } catch (error) {
      console.error('Failed to fetch client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    try {
      setProcessing(true);
      setError(null);
      const response = await fetch(`/api/clients/${clientId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skipPayment: true })
      });
      const data = await response.json();
      if (data.success) {
        // Refresh data to show new assets/status
        await fetchClientData();
        alert('Workflow started successfully!');
      } else {
        setError(data.error || 'Failed to start workflow');
      }
    } catch (err) {
      console.error('Error starting workflow:', err);
      setError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center animate-fade-in-up">
          <div className="relative inline-flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-500/20 border-r-transparent"></div>
            <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-500/40 border-r-transparent" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          <p className="mt-8 text-gray-600 font-light tracking-wide text-lg">Loading dashboard...</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Cliente no encontrado</h1>
          <p className="mt-2 text-gray-600">No se pudo cargar la información del cliente.</p>
        </div>
      </div>
    );
  }

  const primaryColor = clientData.branding.colors.primary;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between animate-slide-in-left">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">{clientData.info.businessName}</h1>
              <p className="text-sm text-gray-600 mt-1">Project Dashboard - Attom</p>
            </div>
            <div className="flex items-center gap-4">
              {clientData.deployment.status !== 'completed' && (
                <button
                  onClick={handleProcess}
                  disabled={processing}
                  className={`px-6 py-3 rounded-full text-sm font-semibold border transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{
                    backgroundColor: processing ? '#ccc' : primaryColor,
                    color: '#white',
                    borderColor: primaryColor
                  }}
                >
                  {processing ? '⏳ Processing...' : '🚀 Start Attom Workflow'}
                </button>
              )}
              <div className={`px-6 py-3 rounded-full text-sm font-semibold border transition-all duration-300 hover:scale-105`}
                   style={{
                     backgroundColor: primaryColor + '15',
                     color: primaryColor,
                     borderColor: primaryColor + '30'
                   }}>
                {clientData.deployment.status === 'completed' ? '✅ Completed' :
                 clientData.deployment.status === 'in_progress' ? '⏳ In Progress' :
                 '📋 New'}
              </div>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm animate-shake">
              ⚠️ Error: {error}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Payment</h3>
            <p className="text-3xl font-bold" style={{ color: primaryColor }}>
              ${clientData.payment.amount} {clientData.payment.currency}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {clientData.payment.status === 'completed' ? '✅ Paid' :
               clientData.payment.status === 'pending' ? '⏳ Pending' : '❌ Failed'}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Business Type</h3>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {clientData.info.businessType}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact</h3>
            <p className="text-sm text-gray-900 font-medium">{clientData.info.contactName}</p>
            <p className="text-sm text-gray-600">{clientData.info.email}</p>
          </div>
        </div>

        {/* Wireframes Section */}
        {clientData.assets?.wireframes && (
          <section className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Wireframes</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientData.assets.wireframes.pages.map((page, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    {page.imageUrl && (
                      <img src={page.imageUrl} alt={page.name} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{page.name}</h3>
                      {page.driveUrl && (
                        <a href={page.driveUrl} target="_blank" rel="noopener noreferrer"
                           className="text-sm text-indigo-600 hover:text-indigo-700">
                          Ver en Drive →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Images Section */}
        {clientData.assets?.images && clientData.assets.images.length > 0 && (
          <section className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Imágenes Generadas</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientData.assets.images.map((image, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    {image.url && (
                      <img src={image.url} alt={image.description} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 capitalize">{image.type}</h3>
                      <p className="text-sm text-gray-600">{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEO Section */}
        {clientData.assets?.seo && (
          <section className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">SEO</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Título</h3>
                <p className="text-gray-900 mt-1">{clientData.assets.seo.title}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                <p className="text-gray-900 mt-1">{clientData.assets.seo.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {clientData.assets.seo.keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Deployment Links */}
        <section className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Enlaces</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {clientData.deployment.github?.repoUrl && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">GitHub Repository</h3>
                  <a href={clientData.deployment.github.repoUrl} target="_blank" rel="noopener noreferrer"
                     className="text-indigo-600 hover:text-indigo-700 font-medium">
                    {clientData.deployment.github.repoUrl} →
                  </a>
                </div>
              )}
              {clientData.deployment.hosting?.url && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Sitio Web</h3>
                  <a href={clientData.deployment.hosting.url} target="_blank" rel="noopener noreferrer"
                     className="text-indigo-600 hover:text-indigo-700 font-medium text-lg">
                    {clientData.deployment.hosting.url} →
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
