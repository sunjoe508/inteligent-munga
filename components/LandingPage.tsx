
import React, { useContext } from 'react';
import Logo from './Logo';
import { PWAContext } from '../App';
import { motion } from 'framer-motion';
import { Search, Globe, BarChart, Shield, Download, Clock, Zap, Map } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { installPrompt, handleInstall, isStandalone } = useContext(PWAContext);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const coreModules = [
    { icon: Search, title: 'Deep Research', desc: 'Real-time global intelligence gathering with Google Search grounding.' },
    { icon: Globe, title: 'Market Scan', desc: 'Sector-wide disruption tracking and competitor intelligence synthesis.' },
    { icon: Map, title: 'Tactical Roadmap', desc: 'Visual project timelines with phased milestones and risk mapping.' },
    { icon: BarChart, title: 'Predictive ROI', desc: 'Data-driven outcome projections using advanced neural strategy cores.' },
    { icon: Shield, title: 'Tactical Vault', desc: 'Secure repository for critical assets with multi-format export protocols.' },
    { icon: Clock, title: 'Auto-Purge', desc: 'System-wide activity deletion after 30 minutes for ultimate operator privacy.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center px-6 relative overflow-x-hidden scroll-smooth">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] -z-10" />

      <header className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center max-w-7xl mx-auto w-full z-50 glass-morphism border-none bg-slate-950/20">
        <div className="flex items-center space-x-3">
          <Logo size="sm" />
          <span className="font-tech font-bold text-lg tracking-widest text-white uppercase">
            INTELIGENT <span className="text-cyan-400">MUNGA</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {installPrompt && (
            <button 
              onClick={handleInstall}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
            >
              <Download size={14} />
              <span>Deploy to Android</span>
            </button>
          )}
          <button 
            onClick={onStart}
            className="px-6 py-2 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/10 transition-all text-[10px] font-black tracking-widest text-cyan-400"
          >
            INITIALIZE SESSION
          </button>
        </div>
      </header>

      <div className="min-h-screen flex flex-col items-center justify-center text-center max-w-4xl pt-20 space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <Logo size="lg" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-5xl md:text-7xl font-black font-tech text-white leading-tight uppercase tracking-tighter"
        >
          Strategic Intel for <br />
          <span className="text-cyan-400 glow-text">The Modern Agent.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-mono"
        >
          Access global market synthesis, predictive strategy, and secure tactical documentation in a high-fidelity terminal.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-12 py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl shadow-2xl shadow-cyan-600/30 transition-all uppercase tracking-widest text-sm"
          >
            Access Terminal
          </button>
          {installPrompt ? (
            <button 
              onClick={handleInstall}
              className="w-full sm:w-auto px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-2xl shadow-emerald-600/30 transition-all uppercase tracking-widest text-sm flex items-center justify-center space-x-3"
            >
              <Download size={20} />
              <span>Deploy App</span>
            </button>
          ) : (
            <button 
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-12 py-5 glass-morphism text-slate-300 font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm border-slate-700"
            >
              Learn Capabilities
            </button>
          )}
        </div>
      </div>

      <section id="features" className="py-32 max-w-7xl w-full">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-tech font-black text-white uppercase tracking-widest mb-4">Core Operational Modules</h2>
          <div className="h-1 w-24 bg-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreModules.map((feat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              onClick={onStart}
              className="glass-morphism p-10 rounded-[32px] border-slate-800 hover:border-cyan-500/50 transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <feat.icon size={28} />
              </div>
              <h3 className="text-white font-tech font-bold text-xl mb-4 uppercase tracking-tighter">{feat.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-mono">{feat.desc}</p>
              <div className="mt-6 flex items-center space-x-2 text-cyan-500/40 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                 <span>Launch Module</span>
                 <Zap size={10} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-12 border-t border-slate-900 w-full text-center">
        <p className="text-[10px] font-mono text-slate-700 uppercase tracking-[0.5em]">
          MUNGA OPERATING SYSTEM // v4.0.5_STABLE
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
