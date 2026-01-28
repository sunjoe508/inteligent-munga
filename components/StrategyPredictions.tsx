
import React, { useState } from 'react';
import { predictOutcomes } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { Target, ShieldAlert, Zap, Layers, Activity } from 'lucide-react';

interface PredictionData {
  recap: string;
  predictions: any[];
  viabilityRating: number;
  recommendations: any[];
}

const StrategyPredictions: React.FC = () => {
  const [dataInput, setDataInput] = useState('');
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!dataInput.trim() || loading) return;
    setLoading(true);
    try {
      const result = await predictOutcomes(dataInput);
      setPrediction(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderSafeItem = (item: any) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      const { scenario, grade, likelihood, reasoning } = item;
      return (
        <div className="flex flex-col space-y-1">
          {scenario && <span className="font-bold text-cyan-400 text-xs uppercase tracking-wider">{scenario}</span>}
          {grade && <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Impact Level: {grade}</span>}
          {reasoning && <span className="text-xs text-slate-300 italic">"{reasoning}"</span>}
          {!scenario && !reasoning && <span className="text-xs">{JSON.stringify(item)}</span>}
        </div>
      );
    }
    return String(item);
  };

  const chartData = prediction ? [
    { name: 'VIABILITY', value: prediction.viabilityRating },
    { name: 'PROXIMITY', value: Math.min(100, 100 - (prediction.viabilityRating / 2)) },
    { name: 'ENTROPY', value: Math.max(10, 80 - prediction.viabilityRating) },
    { name: 'RELEVANCE', value: 88 },
  ] : [];

  const COLORS = ['#00f3ff', '#bc13fe', '#ef4444', '#10b981'];

  return (
    <div className="flex flex-col h-full p-10 space-y-10 overflow-y-auto bg-slate-950/50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto w-full space-y-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl font-black text-white glow-text tracking-tighter font-tech uppercase">Tactical Outcome Projection</h2>
          <p className="text-slate-500 font-mono text-xs mt-2">ALGORITHM: MUNGA_STRAT_PREDICT_v1.2.0 // DEPLOY CORE ANALYTICS</p>
        </motion.div>

        <div className="glass-morphism p-8 rounded-3xl border-cyan-500/20 relative group">
          <div className="absolute top-0 right-0 p-4">
             <Layers className="text-cyan-500/20" size={48} />
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.4em]">Input Raw Statistics / Facts</p>
            <textarea
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              className="w-full h-44 bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-6 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-mono text-xs placeholder:text-slate-700 leading-relaxed"
              placeholder="PASTE INTEL PACKET HERE: e.g. Market saturation: 72%, Competitor ROI: 12.4%, Regulatory drift: High..."
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !dataInput.trim()}
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-cyan-600/20 tracking-widest text-sm"
            >
              {loading ? 'CALCULATING PROBABILITIES...' : 'DEPLOY STRATEGIC ANALYSIS'}
            </button>
          </div>
        </div>

        {prediction && (
          <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-morphism p-8 rounded-3xl border-cyan-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-cyan-400" /> Statistical Probability Distribution
                  </h3>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #00f3ff', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-morphism p-10 rounded-3xl border-cyan-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-4 block">Viability Index</span>
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-8xl font-black font-tech ${
                    prediction.viabilityRating > 70 ? 'text-emerald-400 glow-text' : prediction.viabilityRating > 40 ? 'text-yellow-400' : 'text-red-500'
                  }`}>
                    {prediction.viabilityRating}%
                  </motion.span>
                  <div className="mt-8 flex justify-center">
                    <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${prediction.viabilityRating}%` }} transition={{ duration: 1.5 }} className="h-full bg-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="glass-morphism p-10 rounded-3xl border-cyan-500/20 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 font-tech">Executive Briefing Recap</h3>
                <p className="text-cyan-50/80 font-mono text-sm leading-relaxed whitespace-pre-wrap">{prediction.recap}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-morphism p-10 rounded-3xl border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Target className="text-purple-500" size={20} /> Projected Scenarios
                  </h3>
                  <ul className="space-y-6">
                    {prediction.predictions.map((p, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                        <span className="mt-1 text-purple-400 font-bold font-mono text-xs">S-{i+1}</span>
                        <div className="flex-1">{renderSafeItem(p)}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-morphism p-10 rounded-3xl border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Zap className="text-emerald-400" size={20} /> Strategic Directives
                  </h3>
                  <ul className="space-y-6">
                    {prediction.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                        <span className="mt-1 text-emerald-400 font-bold font-mono text-xs">DIR-{i+1}</span>
                        <div className="flex-1">{renderSafeItem(r)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyPredictions;
