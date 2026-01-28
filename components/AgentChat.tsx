
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { performResearch, generateStrategicImage } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Loader2, Link2, Eye } from 'lucide-react';

const AgentChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('munga_chat_history');
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'System Initialized. I am INTELIGENT MUNGA. Tactical research link established. Input intelligence objectives for global synthesis.',
          timestamp: Date.now(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('munga_chat_history', JSON.stringify(messages));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const research = await performResearch(input, "You are INTELIGENT MUNGA, an ultra-advanced strategic AI. Structure insights with 'Tactical Summary', 'Deep Analysis', and 'Strategic Conclusion'.");
      
      let imageUrl = "";
      if (input.length > 10) {
        imageUrl = await generateStrategicImage(input);
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: research.text,
        sources: research.sources,
        imageUrl: imageUrl,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: ">>> ERROR: COMMUNICATION LINK BREACHED. RETRYING CORE PROTOCOL...",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-950/50 backdrop-blur-sm relative">
      <div className="flex-1 flex flex-col min-w-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div 
                initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={m.id} 
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-6 font-mono text-sm leading-relaxed relative ${
                  m.role === 'user' 
                    ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(0,243,255,0.2)] border border-cyan-400/50' 
                    : 'glass-morphism border-slate-700/80 text-cyan-50'
                }`}>
                  {m.role === 'assistant' && (
                    <div className="absolute -top-6 left-0 flex items-center space-x-2 text-[9px] font-tech text-cyan-400 uppercase tracking-widest">
                      <Terminal size={10} />
                      <span>Munga_Core_v5.2.5</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap leading-relaxed">
                    {m.role === 'assistant' && <span className="text-cyan-400 mr-2 font-black">>>></span>}
                    {m.content}
                  </div>
                  
                  {m.imageUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 rounded-xl overflow-hidden border border-cyan-500/30 group relative"
                    >
                      <img src={m.imageUrl} alt="Strategic Asset" className="w-full h-auto object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 text-[8px] font-mono text-cyan-400/80 uppercase tracking-tighter">AI GEN_ASSET_{m.id.substr(-4)}</div>
                    </motion.div>
                  )}

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-cyan-500/10">
                      <p className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-4">External Intelligence Nodes</p>
                      <div className="grid grid-cols-1 gap-2">
                        {m.sources.map((s, idx) => (
                          <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="bg-slate-900/50 border border-cyan-500/20 p-3 rounded-lg flex items-center justify-between group hover:border-cyan-400 transition-all">
                            <div className="flex items-center space-x-3">
                              <Link2 size={12} className="text-cyan-500" />
                              <span className="text-[10px] text-slate-300 truncate max-w-[200px] uppercase font-bold">{s.title}</span>
                            </div>
                            <Eye size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="glass-morphism p-6 rounded-2xl flex items-center space-x-4 border-cyan-500/30">
                <Loader2 className="animate-spin text-cyan-400" size={18} />
                <span className="text-xs font-mono text-cyan-400 animate-pulse tracking-widest uppercase">Analyzing Network Layers...</span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-10 border-t border-cyan-500/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="INPUT COMMAND (e.g., 'Research quantum computing impacts' or 'Analyze sector 7 vulnerability')..."
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-2xl pl-6 pr-24 py-5 text-cyan-50 font-mono text-xs focus:ring-2 focus:ring-cyan-500/50 outline-none"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-3 rounded-xl transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
