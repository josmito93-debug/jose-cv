'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FullDashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [tradingLogs, setTradingLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const [response, logsResponse] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/trading-logs')
      ]);
      const data = await response.json();
      if (data.success) {
        setClients(data.clients);
      }
      const logsData = await logsResponse.json();
      if (logsData.success) {
        setTradingLogs(logsData.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    
    // Auto-refresh trading logs every 15 seconds
    const interval = setInterval(fetchClients, 15000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: clients.length,
    pending: clients.filter(c => c.payment?.status === 'pending').length,
    inProgress: clients.filter(c => c.deployment?.status === 'in_progress').length,
    completed: clients.filter(c => c.deployment?.status === 'completed').length,
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      {/* Header with dark mode toggle */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-[1800px] mx-auto px-8 py-6">
          <div className="flex items-end justify-between">
            <div className="animate-slide-in-left">
              <h1 className={`text-5xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Attom
                </span> <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} font-extralight`}>/ Dashboard</span>
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-light tracking-wide`}>
                Automated Website Creation System
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
              <button
                onClick={fetchClients}
                className={`px-6 py-2.5 transition-all duration-500 hover:scale-105 hover:shadow-lg rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:border-blue-500 border border-gray-600'
                    : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-blue-500 border border-gray-300 shadow-sm'
                }`}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-8 py-12">
        {/* Stats Grid with blue/purple theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard
            label="Total Clients"
            value={stats.total}
            sublabel="All time"
            accentColor="border-l-blue-500"
            darkMode={darkMode}
            delay="0.1s"
          />
          <StatCard
            label="Pending Payment"
            value={stats.pending}
            sublabel="Awaiting confirmation"
            accentColor="border-l-violet-500"
            darkMode={darkMode}
            delay="0.2s"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            sublabel="Currently processing"
            accentColor="border-l-amber-500"
            darkMode={darkMode}
            delay="0.3s"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            sublabel="Successfully deployed"
            accentColor="border-l-emerald-500"
            darkMode={darkMode}
            delay="0.4s"
          />
        </div>

        {/* JF.OS Autonomous Trading Bot Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🤖 JF.OS Trading Agent
            </h2>
            {tradingLogs.length > 0 && (
              <span className={`px-4 py-1.5 rounded-full text-sm ${darkMode ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-100 text-green-700 border border-green-200'} animate-pulse`}>
                ● System Active
              </span>
            )}
          </div>

          <div className={`rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 shadow-sm overflow-hidden`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-900/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-xs uppercase tracking-widest font-light mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Current Capital</p>
                <p className={`text-4xl font-extralight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${tradingLogs.length > 0 ? tradingLogs[0].capital_actual : '300.00'}
                </p>
              </div>
              <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-900/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-xs uppercase tracking-widest font-light mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Last Decision</p>
                <p className={`text-2xl font-light ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {tradingLogs.length > 0 ? tradingLogs[0].accion : 'Waiting...'}
                </p>
              </div>
              <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-900/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-xs uppercase tracking-widest font-light mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Knowledge Memories</p>
                <p className={`text-4xl font-extralight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tradingLogs.length}
                </p>
              </div>
            </div>

            <div>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gemini AI Reasoning Log</h3>
              <div className={`space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar`}>
                {tradingLogs.length === 0 ? (
                  <p className={`text-sm italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No trades logged yet. Run python_bot/jfos_engine.py to activate.</p>
                ) : (
                  tradingLogs.map((log) => (
                    <div key={log.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} text-sm`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-mono text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(log.timestamp).toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          log.accion === 'COMPRA' ? 'bg-green-500/20 text-green-500' : 
                          log.accion === 'VENTA' ? 'bg-red-500/20 text-red-500' : 
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {log.accion} @ ${log.precio}
                        </span>
                      </div>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        {log.razon}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="mb-12">
          <h2 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
            🔗 Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <IntegrationCard
              darkMode={darkMode}
              title="GitHub"
              icon="⚙️"
              description="Repository management and CI/CD deployment"
              status="Connected"
              color="blue"
            />
            <IntegrationCard
              darkMode={darkMode}
              title="Figma"
              icon="🎨"
              description="Design system extraction and components"
              status="Connected"
              color="purple"
            />
            <IntegrationCard
              darkMode={darkMode}
              title="OpenAI"
              icon="🤖"
              description="AI-powered content generation"
              status="Connected"
              color="green"
            />
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <h2 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Recent Projects
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-light tracking-wide mb-8`}>
            {clients.length} projects registered
          </p>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-20 text-gray-500 font-light">
                <div className="h-8 w-8 animate-spin border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading projects...
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-20 bg-gray-800/20 border border-dashed border-gray-700 rounded-xl text-gray-500 font-light">
                No projects found. Use the Attom Collector to start.
              </div>
            ) : (
              clients.map((client, index) => (
                <ClientCard
                  key={client.info.clientId}
                  darkMode={darkMode}
                  index={index}
                  client={client}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  accentColor,
  darkMode = true,
  delay = "0s"
}: {
  label: string;
  value: number;
  sublabel: string;
  accentColor: string;
  darkMode?: boolean;
  delay?: string;
}) {
  return (
    <div
      className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} 
                  border ${accentColor} border-l-2 p-8 rounded-xl
                  transition-all duration-500 group hover:scale-105 hover:shadow-xl animate-fade-in-up`}
      style={{ animationDelay: delay }}
    >
      <div className="flex flex-col">
        <span className={`${darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500'} text-xs uppercase tracking-[0.2em] font-light mb-3 transition-colors`}>
          {label}
        </span>
        <span className={`text-5xl font-extralight transition-all duration-500 group-hover:scale-110 ${
          darkMode 
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 group-hover:from-blue-300 group-hover:to-purple-300' 
            : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500'
        }`}>
          {value}
        </span>
        <span className={`${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-600 group-hover:text-gray-500'} text-sm font-light tracking-wide transition-colors`}>
          {sublabel}
        </span>
      </div>
    </div>
  );
}

function IntegrationCard({
  darkMode,
  title,
  icon,
  description,
  status,
  color
}: {
  darkMode?: boolean;
  title: string;
  icon: string;
  description: string;
  status: string;
  color: string;
}) {
  const colorClasses = {
    blue: darkMode 
      ? 'bg-blue-900/20 border-blue-500/30 text-blue-300 hover:bg-blue-900/30'
      : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    purple: darkMode 
      ? 'bg-purple-900/20 border-purple-500/30 text-purple-300 hover:bg-purple-900/30'
      : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
    green: darkMode 
      ? 'bg-green-900/20 border-green-500/30 text-green-300 hover:bg-green-900/30'
      : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} 
                border rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up`}
         style={{ animationDelay: `${0.2 + Math.random() * 0.3}s` }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <div className={`w-3 h-3 rounded-full ${
          status === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'
        } animate-pulse`}></div>
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
      <div className={`mt-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-medium`}>
        Status: {status}
      </div>
    </div>
  );
}

function ClientCard({
  darkMode,
  index,
  client,
}: {
  darkMode?: boolean;
  index: number;
  client: any;
}) {
  return (
    <div
      className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500/30' : 'bg-white border-gray-200 hover:border-blue-500/50'}
                 transition-all duration-500 group hover:scale-[1.02] hover:shadow-xl rounded-xl animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className={`text-2xl font-extralight tracking-tight mb-2 transition-all duration-500 ${
              darkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 group-hover:from-blue-200 group-hover:to-white' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600 group-hover:from-blue-600 group-hover:to-gray-900'
            }`}>
              {client.info.businessName}
            </h3>
            <p className={`${darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-500'} font-light tracking-wide mb-1 transition-colors`}>
              {client.info.contactName}
            </p>
            <p className={`${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-600'} text-sm font-light transition-colors`}>
              {client.info.email || client.info.phone}
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 text-xs uppercase tracking-[0.2em] font-light rounded-full ${
              darkMode 
                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' 
                : 'bg-blue-100 border border-blue-200 text-blue-700'
            }`}>
              {client.info.businessType}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs uppercase tracking-[0.2em] font-light block mb-2`}>
              Payment
            </span>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs uppercase tracking-wider border ${
                client.payment.status === 'completed' 
                  ? darkMode ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-green-100 text-green-700 border-green-200'
                  : darkMode ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
              }`}>
                {client.payment.status}
              </span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-light`}>
                ${client.payment.amount} {client.payment.currency}
              </span>
            </div>
          </div>

          <div>
            <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs uppercase tracking-[0.2em] font-light block mb-2`}>
              Deployment
            </span>
            <span className={`px-3 py-1 text-xs uppercase tracking-wider border ${
              client.deployment.status === 'completed' 
                ? darkMode ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-green-100 text-green-700 border-green-200'
                : darkMode ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-amber-100 text-amber-700 border-amber-200'
            }`}>
              {client.deployment.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className={`flex items-center gap-3 pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
          <Link
            href={`/dashboard/${client.info.clientId}`}
            className={`px-6 py-2.5 text-sm font-light tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-lg rounded-lg ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:border-blue-500 border border-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:border-blue-500 border border-gray-300'
            }`}
          >
            View Dashboard
          </Link>

          {client.deployment.github?.repoUrl && (
            <a
              href={client.deployment.github.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-2.5 text-sm font-light tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-lg rounded-lg ${
                darkMode 
                  ? 'bg-gray-700/30 hover:bg-blue-900/30 text-gray-400 hover:text-blue-300 border border-gray-700/30 hover:border-blue-500/30' 
                  : 'bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200'
              }`}
            >
              GitHub →
            </a>
          )}

          {client.deployment.hosting?.url && (
            <a
              href={client.deployment.hosting.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-2.5 text-sm font-light tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-lg rounded-lg ${
                darkMode 
                  ? 'bg-gray-700/30 hover:bg-blue-900/30 text-gray-400 hover:text-blue-300 border border-gray-700/30 hover:border-blue-500/30' 
                  : 'bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200'
              }`}
            >
              Visit Site →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}