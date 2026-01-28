
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, BarChart, Zap, Search } from 'lucide-react';
import { performResearch } from '../services/geminiService';

const MarketIntel: React.FC = () => {
  const [sector, setSector] = useState('');
  const [loading, setLoading] = useState(false);
  const [intel, setIntel] = useState<any>(null);

  const analyzeMarket = async () => {
    if (!sector) return;
    setLoading(true);
    try {
      const prompt = `Perform a high-level market intelligence scan for the sector: ${sector}. Include 'Current Trends', 'Leading Competitors', 'Disruptive Technologies', and 'Future Forecast'. Structure it professionally.`;
      const result = await performResearch(prompt, "You are INTELIGENT MUNGA's Market Analysis Core. Provide sharp, data-driven market insights.");
      setIntel(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-8 md:p-12 space-y-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-4xl font-black text-white glow-text tracking-tighter font-tech uppercase">Market Intelligence Scan</h2>
          <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest">Global Trend synthesis // Node Alpha-Sector-9</p>
        </motion.div>

        <div className="glass-morphism p-8 rounded-3xl border-cyan-500/20">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50" size={18} />
              <input 
                type="text" 
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Target Sector (e.g., Renewable Energy, Quantum Computing)..."
                className="w-full bg-slate-900 border border-cyan-500/20 rounded-2xl pl-12 pr-6 py-4 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <button 
              onClick={analyzeMarket}
              disabled={loading || !sector}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg shadow-cyan-600/20 transition-all uppercase tracking-widest text-xs"
            >
              {loading ? 'Scanning...' : 'Execute Scan'}
            </button>
          </div>
        </div>

        {intel && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-8"
          >
            <div className="glass-morphism p-10 rounded-3xl border-cyan-500/20">
               <div className="flex items-center space-x-3 mb-6">
                 <Globe className="text-cyan-400" size={24} />
                 <h3 className="text-xl font-tech font-bold text-white uppercase tracking-tighter">Sector Intelligence: {sector}</h3>
               </div>
               <div className="prose prose-invert prose-cyan max-w-none font-mono text-sm whitespace-pre-wrap leading-relaxed opacity-90">
                 {intel.text}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-morphism p-8 rounded-2xl border-cyan-500/10">
                <div className="flex items-center space-x-2 text-cyan-500 mb-4">
                  <TrendingUp size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Growth Vectors</span>
                </div>
                <div className="space-y-3">
                   {['Market Cap Drift', 'Investment Velocity', 'Entry Barriers'].map((item, i) => (
                     <div key={i} className="flex justify-between items-center bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                        <span className="text-xs text-slate-400 uppercase">{item}</span>
                        <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                           <motion.div animate={{ width: ['20%', '80%', '50%'] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-cyan-500" />
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="glass-morphism p-8 rounded-2xl border-cyan-500/10 flex flex-col justify-center items-center">
                 <Zap className="text-yellow-400 mb-2 animate-pulse" size={32} />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Disruption Level</span>
                 <span className="text-4xl font-tech font-black text-cyan-400 mt-2 tracking-tighter">HIGH</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MarketIntel;
