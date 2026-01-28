
import React, { useState } from 'react';
import { downloadAsText, downloadAsPDF, downloadAsMarkdown } from '../utils/documentExport';
import { motion } from 'framer-motion';
import { FileText, FileCode, FileDown, ShieldCheck, Database, Layers, Lock } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [encryptionStatus, setEncryptionStatus] = useState('Standby');

  const handleDownload = (format: 'txt' | 'pdf' | 'md') => {
    const title = docTitle || 'Tactical_Intel_Export';
    const content = docContent || 'No intelligence data recorded.';
    
    setEncryptionStatus('Decrypting...');
    setTimeout(() => {
      if (format === 'txt') downloadAsText(content, title);
      if (format === 'pdf') downloadAsPDF(content, title);
      if (format === 'md') downloadAsMarkdown(content, title);
      setEncryptionStatus('Standby');
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full p-8 md:p-12 space-y-10 overflow-y-auto bg-slate-950/40 backdrop-blur-md">
      <div className="max-w-5xl mx-auto w-full space-y-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-4xl font-black text-white glow-text tracking-tighter font-tech uppercase">Tactical Vault</h2>
          <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest">Repository: MUNGA_SECRET_STORAGE // SECURE EXPORT MODE</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Workspace */}
          <div className="lg:col-span-3 glass-morphism p-8 rounded-3xl border-cyan-500/20 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Database size={120} />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em] ml-1">Document Registry Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="E.G., OPERATION_NIGHTHAWK_FINAL"
                    className="w-full bg-slate-900/60 border border-cyan-500/20 rounded-xl px-5 py-4 text-cyan-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono text-cyan-500/40 uppercase">UID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em] ml-1">Intel Compilation Field</label>
                <textarea
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Assemble strategic data points for encrypted export..."
                  className="w-full h-80 bg-slate-900/60 border border-cyan-500/20 rounded-xl px-6 py-5 text-cyan-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all leading-relaxed resize-none scrollbar-hide"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <button
                  onClick={() => handleDownload('pdf')}
                  className="group relative bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 p-5 rounded-2xl transition-all flex flex-col items-center space-y-3"
                >
                  <FileText className="text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">PDF Export</span>
                </button>
                <button
                  onClick={() => handleDownload('md')}
                  className="group relative bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 p-5 rounded-2xl transition-all flex flex-col items-center space-y-3"
                >
                  <FileCode className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">MD Export</span>
                </button>
                <button
                  onClick={() => handleDownload('txt')}
                  className="group relative bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 p-5 rounded-2xl transition-all flex flex-col items-center space-y-3"
                >
                  <FileDown className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Plain Text</span>
                </button>
              </div>
            </div>
          </div>

          {/* Side Status Panel */}
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-2xl border-cyan-500/10 space-y-4">
              <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-4">Vault Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-500 font-mono">STATUS</span>
                  <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold tracking-widest">ENCRYPTED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-500 font-mono">NODE</span>
                  <span className="text-[9px] text-cyan-400 font-mono uppercase">PRIMARY_HUB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-500 font-mono">EXPORT</span>
                  <span className="text-[9px] text-purple-400 font-mono uppercase">{encryptionStatus}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-cyan-500/10">
                <div className="flex items-center space-x-2">
                  <Lock size={12} className="text-cyan-500" />
                  <span className="text-[9px] text-slate-400 font-mono">AES-256 Enabled</span>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-6 rounded-2xl border-cyan-500/10 space-y-6">
              <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Asset Protocols</h3>
              {[
                { label: 'Immutable Logs', desc: 'Auto-recorded metadata', icon: ShieldCheck },
                { label: 'Global Distribution', desc: 'Secure relay endpoints', icon: Layers }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <item.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-white uppercase">{item.label}</h4>
                    <p className="text-[9px] text-slate-500 italic mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
               <p className="text-[8px] text-red-400 font-mono uppercase leading-tight">Warning: Exports from this terminal are final. Ensure tactical integrity before compilation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
