'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Database, 
  Layers, 
  Activity, 
  Zap, 
  Cpu, 
  ArrowLeft,
  RefreshCw,
  GitBranch,
  Terminal,
  ShieldCheck,
  ArrowUpRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Play,
  Copy,
  ChevronRight,
  User,
  Settings2
} from 'lucide-react';

export default function N8NArchitectDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [task, setTask] = useState('');
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/agents/architect');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        if (!selectedClient && json.data.clients?.length > 0) {
           setSelectedClient(json.data.clients[0]);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const addSignal = (trigger: string, action: string, status: 'SUCCESS' | 'ERROR' = 'SUCCESS') => {
    const newSignal = {
      id: Math.random().toString(36).substr(2, 9),
      trigger,
      action,
      status,
      time: 'Just now'
    };
    setSignals(prev => [newSignal, ...prev].slice(0, 10));
  };

  const handleArchitect = async () => {
    if (!selectedClient || !task) return;
    
    setIsArchitecting(true);
    setBlueprint(null);
    addSignal('Task Received', `Analyzing architect request for ${selectedClient.businessName}...`);

    try {
      // Step 1: Neural Analysis
      await new Promise(r => setTimeout(r, 800));
      addSignal('Neural Engine', 'Mapping task to required n8n nodes...');
      
      // Step 2: Call API
      const res = await fetch('/api/agents/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: selectedClient.id, task })
      });
      
      const json = await res.json();
      
      if (json.success) {
        await new Promise(r => setTimeout(r, 1000));
        setBlueprint(json.blueprint);
        if (json.n8nWorkflowId) {
          addSignal('Deployment Successful', `Workflow live on n8n (ID: ${json.n8nWorkflowId})`, 'SUCCESS');
        } else {
          addSignal('Architecture Ready', 'Blueprint generated and synced to Airtable', 'SUCCESS');
        }
        fetchData(); // Refresh to see updated readiness
      } else {
        addSignal('Error', json.error || 'Failed to generate blueprint', 'ERROR');
      }
    } catch (error) {
      addSignal('System Failure', 'Network error during architecting', 'ERROR');
    } finally {
      setIsArchitecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white  overflow-hidden selection:bg-[#00F0FF]/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ 
        backgroundImage: `radial-gradient(#00F0FF 0.5px, transparent 0.5px)`, 
        backgroundSize: '32px 32px' 
      }} />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00F0FF]/5 blur-[150px] rounded-full" />

      {/* Cinematic HUD Header */}
      <header className="h-20 border-b border-white/5 backdrop-blur-xl px-8 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-6">
          <Link href="/hq" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-white" />
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF]">
                <Database className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic">N8N <span className="text-[#00F0FF]">Hyper-Architect</span></h1>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00F0FF]/60 -mt-1">Autonomous Workflow Engine</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">Autonomous Core</span>
              <div className="flex gap-1 mt-1">
                 {[1,2,3,4,5].map(i => <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }} className="w-2.5 h-1 bg-[#00F0FF] rounded-full" />)}
              </div>
           </div>
           <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Ready</span>
           </div>
        </div>
      </header>

      <main className="p-8 grid grid-cols-12 gap-8 relative z-10 h-[calc(100vh-80px)] overflow-hidden">
        
        {/* Left Column: Client Fleet & Progress (Width 4/12) */}
        <div className="col-span-4 space-y-6 overflow-y-auto pr-4 custom-scrollbar h-full pb-20">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#00F0FF]">Client Fleet Status</h2>
              <RefreshCw className={`w-4 h-4 text-zinc-500 cursor-pointer ${loading ? 'animate-spin' : ''}`} onClick={() => fetchData()} />
           </div>

           <div className="space-y-3">
              {data?.clients.map((client: any) => (
                <motion.div 
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  whileHover={{ x: 5 }}
                  className={`p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden group ${selectedClient?.id === client.id ? 'bg-[#00F0FF]/5 border-[#00F0FF]/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex items-center justify-between relative z-10">
                     <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase tracking-widest text-white">{client.businessName}</p>
                        <p className={`text-[8px] font-bold uppercase ${client.isReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                           {client.isReady ? 'Ready to Deploy' : 'Information Incomplete'}
                        </p>
                     </div>
                     <CircularProgress size={48} progress={client.readinessScore} />
                  </div>
                  {selectedClient?.id === client.id && (
                    <motion.div layoutId="client-glow" className="absolute inset-0 bg-[#00F0FF]/5 blur-2xl pointer-events-none" />
                  )}
                </motion.div>
              ))}
           </div>
        </div>

        {/* Center Column: Architect HUD (Width 8/12) */}
        <div className="col-span-8 space-y-6 flex flex-col h-full">
           
           {/* Dependency Infrastructure Map */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfrastructureLayer 
                 title="Intelligence Layer"
                 icon={<Cpu className="w-5 h-5" />}
                 items={[
                    { name: 'LLM Node (OpenAI)', status: selectedClient?.dependencies?.llmProvider === 'openai' ? 'active' : 'idle' },
                    { name: 'Neural Logic (Gemini)', status: selectedClient?.dependencies?.llmProvider === 'gemini' ? 'active' : 'idle' }
                 ]}
                 color="text-[#00F0FF]"
              />
              <InfrastructureLayer 
                 title="Memory Layer"
                 icon={<Database className="w-5 h-5" />}
                 items={[
                    { name: 'Client CRM (Airtable)', status: selectedClient?.readinessScore > 30 ? 'active' : 'idle' },
                    { name: 'Vector Store (Chroma)', status: selectedClient?.readinessScore > 60 ? 'active' : 'idle' }
                 ]}
                 color="text-indigo-400"
              />
              <InfrastructureLayer 
                 title="Execution Layer"
                 icon={<Zap className="w-5 h-5" />}
                 items={[
                    { name: 'n8n Workflow Node', status: selectedClient?.isReady ? 'active' : 'idle' },
                    { name: 'Control Plane (Vercel)', status: 'active' }
                 ]}
                 color="text-emerald-400"
              />
           </div>

           {/* Command Center: Task Input */}
           <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap className="w-40 h-40 text-[#00F0FF]" />
              </div>

              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-[#00F0FF]/10 rounded-2xl border border-[#00F0FF]/20">
                    <Cpu className="w-6 h-6 text-[#00F0FF]" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black italic tracking-tighter uppercase">Architect Command Center</h2>
                    <p className="text-[10px] font-bold text-[#00F0FF]/50 uppercase tracking-widest">Selected Client: {selectedClient?.businessName || 'None'}</p>
                 </div>
              </div>

              <div className="flex-1 flex flex-col space-y-6">
                 <div className="relative">
                    <textarea 
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="Give me a task and I'll architect it perfectly... (e.g. Set up a dental appointment bot with Airtable sync)"
                      className="w-full h-32 bg-black/40 border border-white/10 rounded-[2rem] p-8 text-sm font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00F0FF]/40 transition-all resize-none custom-scrollbar"
                    />
                    <div className="absolute bottom-6 right-6">
                       <button 
                         onClick={handleArchitect}
                         disabled={isArchitecting || !task || !selectedClient}
                         className={`px-8 py-4 ${isArchitecting ? 'bg-zinc-800' : 'bg-[#00F0FF] hover:scale-105'} text-black font-black uppercase text-[11px] rounded-2xl transition-all flex items-center gap-3 shadow-[0_0_30px_#00F0FF33] active:scale-95`}
                       >
                          {isArchitecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-black" />}
                          {isArchitecting ? 'Architecting...' : 'Execute Task'}
                       </button>
                    </div>
                 </div>

                 {/* Blueprint Preview */}
                 <AnimatePresence>
                   {blueprint && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 bg-black/60 border border-white/10 rounded-[2rem] p-6 font-mono text-[10px] text-[#00F0FF]/80 overflow-hidden flex flex-col"
                     >
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4 shrink-0">
                           <span className="text-zinc-500 uppercase tracking-widest text-[8px] font-bold">PERFECTED BLUEPRINT GENERATED</span>
                           <button onClick={() => navigator.clipboard.writeText(JSON.stringify(blueprint, null, 2))} className="hover:text-white transition-colors flex items-center gap-1">
                              <Copy className="w-3 h-3" /> COPY
                           </button>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                           <pre>{JSON.stringify(blueprint, null, 2)}</pre>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>

           {/* Signal System (Footer area of main content) */}
           <div className="h-40 bg-white/[0.02] border border-white/5 rounded-[3rem] p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                 <Activity className="w-4 h-4 text-[#00F0FF]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Reasoning Stream</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                 {signals.length === 0 && <p className="text-[9px] font-bold text-zinc-700 italic">No signals active. Awaiting command...</p>}
                 {signals.map((signal) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex items-center justify-between text-[9px] border-b border-white/[0.02] pb-2"
                   >
                      <div className="flex items-center gap-3">
                         <span className={signal.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}>●</span>
                         <span className="font-black text-white uppercase">{signal.trigger}</span>
                         <span className="text-zinc-500 tracking-wider">→ {signal.action}</span>
                      </div>
                      <span className="text-[8px] text-zinc-700">{signal.time}</span>
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-black border-t border-white/5 px-8 flex items-center justify-between text-[10px] font-black text-zinc-600 tracking-widest z-[60]">
        <div className="flex gap-8">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
              <span>ARCHITECT CORE: VERSION 3.5_HYPER</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>AIRTABLE CRM: SYNCED</span>
           </div>
        </div>
        <span>AUTONOMOUS ENGINE ACTIVE</span>
      </footer>
    </div>
  );
}

function CircularProgress({ size, progress }: { size: number, progress: number }) {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#00F0FF"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-black text-white">{progress}%</span>
    </div>
  );
}

function InfrastructureLayer({ title, icon, items, color }: any) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all">
       <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className={`p-2.5 rounded-xl bg-white/5 ${color} border border-white/5`}>
             {icon}
          </div>
          <h4 className="text-[11px] font-black uppercase tracking-widest text-white">{title}</h4>
       </div>
       <div className="space-y-3 relative z-10">
          {items.map((item: any, i: number) => (
             <div key={i} className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">{item.name}</span>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-zinc-800'}`} />
                   <span className={`text-[8px] font-black uppercase ${item.status === 'active' ? 'text-emerald-400' : 'text-zinc-700'}`}>{item.status}</span>
                </div>
             </div>
          ))}
       </div>
       <motion.div className={`absolute top-0 right-0 w-32 h-32 ${color.replace('text-', 'bg-')}/5 blur-3xl -mr-16 -mt-16 pointer-events-none`} />
    </div>
  );
}
