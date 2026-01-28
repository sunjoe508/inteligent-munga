
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateRoadmap } from '../services/geminiService';
import { Map, Flag, Clock, AlertCircle, Loader2, ChevronRight } from 'lucide-react';

const StrategyRoadmap: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goal) return;
    setLoading(true);
    try {
      const data = await generateRoadmap(goal);
      setRoadmap(data);
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
          <h2 className="text-4xl font-black text-white glow-text tracking-tighter font-tech uppercase">Roadmap Generator</h2>
          <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest">Tactical pathing // Project lifecycle v2.0</p>
        </motion.div>

        <div className="glass-morphism p-8 rounded-3xl border-cyan-500/20">
          <div className="flex flex-col space-y-4">
            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Define Operational Objective</label>
            <div className="flex space-x-4">
              <input 
                type="text" 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Launching a global fintech startup in 6 months..."
                className="flex-1 bg-slate-900 border border-cyan-500/20 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading || !goal}
                className="px-10 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center space-x-2"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><Map size={16} /><span>Plan Path</span></>}
              </button>
            </div>
          </div>
        </div>

        {roadmap && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-12 pb-20"
          >
            <div className="flex items-center space-x-4">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-cyan-500/30" />
              <h3 className="text-xl font-tech font-bold text-white uppercase tracking-widest">{roadmap.title}</h3>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-cyan-500/30" />
            </div>

            <div className="relative">
              {/* Central Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-cyan-500/20 md:left-1/2" />

              <div className="space-y-12">
                {roadmap.phases.map((phase: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative flex items-center md:justify-between ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Circle Indicator */}
                    <div className="absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-500 z-10 md:left-1/2">
                       <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-20" />
                    </div>

                    <div className="ml-16 md:ml-0 md:w-[45%]">
                      <div className="glass-morphism p-6 rounded-2xl border-cyan-500/10 hover:border-cyan-500/40 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-sm font-black text-cyan-400 uppercase tracking-widest">{phase.name}</h4>
                          <div className="flex items-center text-[10px] text-slate-500 font-mono">
                            <Clock size={10} className="mr-1" /> {phase.duration}
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {phase.tasks.map((task: string, tIdx: number) => (
                            <li key={tIdx} className="text-[11px] text-slate-300 flex items-start">
                              <ChevronRight size={12} className="text-cyan-600 mt-0.5 mr-1" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-morphism p-8 rounded-2xl border-red-500/20 bg-red-500/5">
              <div className="flex items-center space-x-3 mb-4 text-red-400">
                <AlertCircle size={20} />
                <h4 className="text-xs font-black uppercase tracking-widest">Tactical Risk Assessment</h4>
              </div>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">{roadmap.riskAssessment}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StrategyRoadmap;
