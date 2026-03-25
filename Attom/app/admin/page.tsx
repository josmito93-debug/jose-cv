'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ClientData {
  info: {
    clientId: string;
    businessName: string;
    contactName: string;
    phone: string;
    email?: string;
    businessType: string;
    createdAt: string;
    updatedAt: string;
  };
  payment: {
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
    };
  };
}

interface Stats {
  total: number;
  pending: number;
  completed: number;
  inProgress: number;
}

export default function AdminDashboard() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, completed: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);
  const [processingClient, setProcessingClient] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      const data = await response.json();
      setClients(data.clients || []);
      calculateStats(data.clients || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (clientList: ClientData[]) => {
    const stats = {
      total: clientList.length,
      pending: clientList.filter(c => c.payment.status === 'pending').length,
      completed: clientList.filter(c => c.deployment.status === 'completed').length,
      inProgress: clientList.filter(c => c.deployment.status === 'in_progress').length,
    };
    setStats(stats);
  };

  const processClient = async (clientId: string) => {
    setProcessingClient(clientId);
    try {
      const response = await fetch('/api/admin/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });

      if (response.ok) {
        await fetchClients();
      }
    } catch (error) {
      console.error('Failed to process client:', error);
    } finally {
      setProcessingClient(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'in_progress': return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'failed': return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-teal-500/10 text-teal-300 border-teal-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'failed': return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      default: return 'bg-violet-500/10 text-violet-300 border-violet-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="relative inline-flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-500/20 border-r-transparent"></div>
            <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-500/40 border-r-transparent" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
          <p className="mt-8 text-slate-300 font-light tracking-wide text-lg">Loading dashboard...</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/30 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-8 py-6">
          <div className="flex items-end justify-between">
            <div className="animate-slide-in-left">
              <h1 className="text-5xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-2">
                Attom <span className="text-slate-500 font-extralight">/ Admin</span>
              </h1>
              <p className="text-slate-400 font-light tracking-wide">
                Automated Website Creation System
              </p>
            </div>
            <button
              onClick={fetchClients}
              className="px-6 py-2.5 bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-purple-900/30 hover:to-slate-700/50 border border-slate-700/30 hover:border-purple-500/30
                       text-slate-300 text-sm font-light tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 rounded-lg"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard
            label="Total Clients"
            value={stats.total}
            sublabel="All time"
            accentColor="border-l-slate-500"
            delay="0.1s"
          />
          <StatCard
            label="Pending Payment"
            value={stats.pending}
            sublabel="Awaiting confirmation"
            accentColor="border-l-violet-500"
            delay="0.2s"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            sublabel="Currently processing"
            accentColor="border-l-amber-500"
            delay="0.3s"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            sublabel="Successfully deployed"
            accentColor="border-l-emerald-500"
            delay="0.4s"
          />
        </div>

        {/* Clients Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-light text-slate-100 mb-2 tracking-tight">
            Client Projects
          </h2>
          <p className="text-slate-400 font-light tracking-wide">
            {clients.length} {clients.length === 1 ? 'project' : 'projects'} in system
          </p>
        </div>

        {clients.length === 0 ? (
          <div className="bg-[#13131a] border border-slate-800/50 rounded-none p-16 text-center">
            <p className="text-slate-400 text-lg font-light tracking-wide">
              No clients yet. Create your first client to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client, index) => (
              <ClientCard
                key={client.info.clientId}
                client={client}
                index={index}
                processing={processingClient === client.info.clientId}
                onProcess={processClient}
                getStatusColor={getStatusColor}
                getPaymentStatusColor={getPaymentStatusColor}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-24">
        <div className="max-w-[1800px] mx-auto px-8 py-8">
          <p className="text-slate-500 text-sm font-light tracking-wide">
            © 2024 Universa Agency. Built with Attom.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  accentColor,
  delay = "0s"
}: {
  label: string;
  value: number;
  sublabel: string;
  accentColor: string;
  delay?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/30 ${accentColor} border-l-2 p-8
                  hover:from-purple-900/20 hover:to-slate-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 rounded-xl animate-fade-in-up`}
      style={{ animationDelay: delay }}
    >
      <div className="flex flex-col">
        <span className="text-slate-400 text-xs uppercase tracking-[0.2em] font-light mb-3 group-hover:text-purple-300 transition-colors">
          {label}
        </span>
        <span className="text-5xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-2 group-hover:from-purple-200 group-hover:to-white transition-all duration-500">
          {value}
        </span>
        <span className="text-slate-500 text-sm font-light tracking-wide group-hover:text-slate-400 transition-colors">
          {sublabel}
        </span>
      </div>
    </div>
  );
}

function ClientCard({
  client,
  index,
  processing,
  onProcess,
  getStatusColor,
  getPaymentStatusColor,
}: {
  client: ClientData;
  index: number;
  processing: boolean;
  onProcess: (id: string) => void;
  getStatusColor: (status: string) => string;
  getPaymentStatusColor: (status: string) => string;
}) {
  const canProcess = client.payment.status === 'completed' &&
                     client.deployment.status !== 'completed' &&
                     client.deployment.status !== 'in_progress';

  return (
    <div
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/30 hover:border-purple-500/30
                 transition-all duration-500 group hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 rounded-xl animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.05}s`
      }}
    >
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-2 tracking-tight group-hover:from-purple-200 group-hover:to-white transition-all duration-500">
              {client.info.businessName}
            </h3>
            <p className="text-slate-400 font-light tracking-wide mb-1 group-hover:text-slate-300 transition-colors">
              {client.info.contactName}
            </p>
            <p className="text-slate-500 text-sm font-light group-hover:text-slate-400 transition-colors">
              {client.info.email || client.info.phone}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs uppercase tracking-[0.2em] font-light rounded-full">
              {client.info.businessType}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-light block mb-2">
              Payment
            </span>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs uppercase tracking-wider border ${getPaymentStatusColor(client.payment.status)}`}>
                {client.payment.status}
              </span>
              <span className="text-slate-300 font-light">
                ${client.payment.amount} {client.payment.currency}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-light block mb-2">
              Deployment
            </span>
            <span className={`inline-block px-3 py-1 text-xs uppercase tracking-wider border ${getStatusColor(client.deployment.status)}`}>
              {client.deployment.status.replace('_', ' ')}
            </span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500 font-light block mb-2">
              Created
            </span>
            <span className="text-slate-400 font-light text-sm">
              {new Date(client.info.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-slate-700/30">
          <Link
            href={`/dashboard/${client.info.clientId}`}
            className="px-6 py-2.5 bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-purple-900/30 hover:to-slate-700/50 border border-slate-700/30 hover:border-purple-500/30
                     text-slate-300 text-sm font-light tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 rounded-lg"
          >
            View Dashboard
          </Link>

          {canProcess && (
            <button
              onClick={() => onProcess(client.info.clientId)}
              disabled={processing}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 border border-emerald-500/30
                       text-emerald-300 text-sm font-light tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {processing ? 'Processing...' : 'Process Client'}
            </button>
          )}

          {client.deployment.github?.repoUrl && (
            <a
              href={client.deployment.github.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-gradient-to-r from-slate-800/30 to-slate-700/30 hover:from-purple-900/20 hover:to-slate-700/30 border border-slate-700/30 hover:border-purple-500/30
                       text-slate-400 text-sm font-light tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 hover:text-purple-300 rounded-lg"
            >
              GitHub →
            </a>
          )}

          {client.deployment.hosting?.url && (
            <a
              href={client.deployment.hosting.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-gradient-to-r from-slate-800/30 to-slate-700/30 hover:from-purple-900/20 hover:to-slate-700/30 border border-slate-700/30 hover:border-purple-500/30
                       text-slate-400 text-sm font-light tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 hover:text-purple-300 rounded-lg"
            >
              Visit Site →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
