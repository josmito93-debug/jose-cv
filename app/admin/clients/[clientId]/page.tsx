'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ExternalLink, 
  Globe as Github, 
  CreditCard, 
  Globe, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Mail, 
  Phone, 
  Tag,
  Rocket,
  Link as LinkIcon,
  Copy
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClientDetail() {
  const { clientId } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyInvoice = () => {
    const url = `${window.location.origin}/pay/${clientId}`;
    
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        textArea.remove();
      }
    };

    copyToClipboard(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clients');
        const data = await response.json();
        if (data.success) {
          const found = data.clients.find((c: any) => c.info.clientId === clientId);
          setClient(found);
        }
      } catch (error) {
        console.error('Failed to fetch client:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  if (loading) return <div className="h-96 flex items-center justify-center text-zinc-600 animate-pulse font-black tracking-widest text-xs uppercase">Loading specifications...</div>;
  if (!client) return (
    <div className="h-96 flex flex-col items-center justify-center text-zinc-600">
      <FileText className="w-12 h-12 mb-4 opacity-20" />
      <p className="font-black uppercase tracking-widest text-xs mb-8">Client specification not found</p>
      <button onClick={() => router.push('/admin')} className="text-indigo-400 font-bold hover:underline">Return to repository</button>
    </div>
  );

  const isPaid = client.payment.status === 'completed';
  const isLive = client.deployment.status === 'completed';

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Back & Title */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to clients
        </button>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isLive ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' : 'bg-zinc-800 border-white/5 text-zinc-500'}`}>
            {isLive ? 'Live Deployment' : 'Project in Progress'}
          </span>
        </div>
      </div>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-3xl font-black shadow-2xl">
               {client.info.businessName.charAt(0)}
             </div>
             <div>
               <h1 className="text-5xl font-black tracking-tighter text-white">{client.info.businessName}</h1>
               <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">ID: {client.info.clientId}</p>
             </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-end">
          <button 
             onClick={handleCopyInvoice}
             className="px-6 py-4 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            {copiedLink ? 'Link Copiado' : 'Generar Invoice'}
          </button>
          <button className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 font-black text-[10px] uppercase tracking-widest transition-all">
            Update Specs
          </button>
          <button className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-600/20 font-black text-[10px] uppercase tracking-widest text-white transition-all flex items-center gap-3">
            <Rocket className="w-4 h-4" /> Trigger Deploy
          </button>
        </div>
      </header>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Card */}
        <div className="lg:col-span-1 space-y-8">
           <DetailCard title="Primary Contact" icon={<Mail className="w-4 h-4" />}>
              <div className="space-y-6">
                 <div>
                   <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-1">Rep Name</span>
                   <p className="text-white font-bold">{client.info.contactName}</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-zinc-700" />
                    <p className="text-zinc-400 text-sm font-medium">{client.info.email || 'No email provided'}</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-zinc-700" />
                    <p className="text-zinc-400 text-sm font-medium">{client.info.phone}</p>
                 </div>
                 <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                    <Tag className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-300">{client.info.businessType}</span>
                 </div>
              </div>
           </DetailCard>

           <DetailCard title="Payment Status" icon={<CreditCard className="w-4 h-4" />}>
              <div className={`p-6 rounded-[1.5rem] border ${isPaid ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-amber-500/5 border-amber-500/10'} mb-6`}>
                 <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>Current Ledger</span>
                    {isPaid ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                 </div>
                 <p className="text-3xl font-black text-white">${client.payment.amount} <span className="text-xs text-zinc-600 opacity-60 ml-2">{client.payment.currency}</span></p>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">Payment received via automated gateway on {new Date().toLocaleDateString()}.</p>
           </DetailCard>
        </div>

        {/* Technical & Deployment Section */}
        <div className="lg:col-span-2 space-y-10">
           <DetailCard title="Technical Infrastructure" icon={<Globe className="w-4 h-4" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col justify-between group">
                    <div className="flex items-center justify-between mb-8">
                       <Github className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Repository Active</span>
                    </div>
                    <div>
                       <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Source Code</p>
                       <p className="text-sm font-mono text-zinc-300 truncate mb-4">{client.deployment.github?.repoUrl || 'Pending initialization'}</p>
                       <a href={client.deployment.github?.repoUrl} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 hover:text-indigo-300 transition-colors">
                          Open Repo <ExternalLink className="w-3 h-3" />
                       </a>
                    </div>
                 </div>

                 <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col justify-between group">
                    <div className="flex items-center justify-between mb-8">
                       <Rocket className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                       <span className={`text-[9px] font-black uppercase tracking-widest ${isLive ? 'text-indigo-400' : 'text-amber-400'}`}>
                          {isLive ? 'Live on Vercel' : 'Deploy Pending'}
                       </span>
                    </div>
                    <div>
                       <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Production URL</p>
                       <p className="text-sm font-mono text-zinc-300 truncate mb-4">{client.deployment.hosting?.url || 'Awaiting first pulse'}</p>
                       <a href={client.deployment.hosting?.url} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 hover:text-indigo-300 transition-colors">
                          Visit Site <ExternalLink className="w-3 h-3" />
                       </a>
                    </div>
                 </div>
              </div>
           </DetailCard>

           <DetailCard title="Project Definition" icon={<FileText className="w-4 h-4" />}>
              <div className="space-y-10">
                 <div>
                    <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-3">Project Overview</span>
                    <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                       {client.info.projectDesc || 'No project description provided. The Attom engine will derive content strategies from the niche definition and business type during the first execution phase.'}
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                    <div>
                       <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-4">Design Preferences</span>
                       <div className="flex flex-wrap gap-2">
                          {['Premium', 'Modern', 'Minimalist', 'Dark Mode'].map(tag => (
                             <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-500">{tag}</span>
                          ))}
                       </div>
                    </div>
                    <div>
                       <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-4">Core Functionalities</span>
                       <ul className="space-y-3">
                          {['SEO Optimization', 'Responsive CMS', 'Custom Animations'].map(feat => (
                             <li key={feat} className="flex items-center gap-3 text-xs text-zinc-500 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {feat}
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
           </DetailCard>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-10">
         <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-600 transition-colors group-hover:text-indigo-400 group-hover:border-indigo-400/30">
           {icon}
         </div>
         <h3 className="text-xl font-black tracking-tighter text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}
