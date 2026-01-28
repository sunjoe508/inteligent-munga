
import React, { useState, useEffect, useContext } from 'react';
import { ViewMode } from '../types';
import Logo from './Logo';
import { PWAContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BarChart3, Briefcase, Radio, LogOut, Cpu, Wifi, MapPin, Clock, MessageSquareText, Menu, X, Terminal, Globe, Map, Download } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onLogout: () => void;
  username: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, onLogout, username }) => {
  const [time, setTime] = useState(new Date());
  const [coords, setCoords] = useState({ lat: '0.000', lng: '0.000' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>(['System initialized.', 'Encryption active.', 'Neural link ready.']);
  const { installPrompt, handleInstall, isStandalone } = useContext(PWAContext);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude.toFixed(3), lng: pos.coords.longitude.toFixed(3) }),
      () => {}
    );
    
    const logInterval = setInterval(() => {
      const messages = ['Syncing with Node-B...', 'Data packet received.', 'Scanning network layers...', 'Access granted.', 'Intel updated.'];
      setLogs(prev => [messages[Math.floor(Math.random() * messages.length)], ...prev].slice(0, 5));
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(logInterval);
    };
  }, []);

  const navItems = [
    { id: ViewMode.RESEARCH, label: 'INTEL GATHERING', icon: Search },
    { id: ViewMode.MARKET, label: 'MARKET SCAN', icon: Globe },
    { id: ViewMode.ROADMAP, label: 'STRATEGY ROADMAP', icon: Map },
    { id: ViewMode.ANALYTICS, label: 'PREDICTION OPS', icon: BarChart3 },
    { id: ViewMode.DOCUMENTS, label: 'TACTICAL VAULT', icon: Briefcase },
    { id: ViewMode.COMMUNICATION, label: 'FEEDBACK HUB', icon: MessageSquareText },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-tech selection:bg-cyan-500/30">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 glass-morphism border-r-2 border-cyan-500/20 flex flex-col transition-transform duration-500 md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-cyan-500/10 flex flex-col items-center">
          <Logo size="sm" />
          <div className="mt-4 text-center">
            <h1 className="text-lg font-black text-white glow-text tracking-widest uppercase">
              INTELIGENT <span className="text-cyan-400">MUNGA</span>
            </h1>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[9px] text-cyan-500/80 tracking-[0.3em] uppercase font-mono">Terminal Active</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide">
          <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 pl-2">System Commands</p>
          {navItems.map((item) => (
            <motion.button
              whileHover={{ x: 4, backgroundColor: 'rgba(0, 243, 255, 0.05)' }}
              whileTap={{ scale: 0.98 }}
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full group flex items-center space-x-4 px-4 py-4 rounded-xl transition-all relative overflow-hidden ${
                activeView === item.id 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {activeView === item.id && (
                <motion.div layoutId="nav-glow-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.8)]" />
              )}
              <item.icon size={18} className={activeView === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400/50'} />
              <span className="text-[11px] font-bold tracking-widest">{item.label}</span>
            </motion.button>
          ))}
          
          <div className="mt-6 pt-6 border-t border-cyan-500/10">
            {installPrompt && (
              <button 
                onClick={handleInstall}
                className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all mb-4"
              >
                <Download size={18} />
                <span className="text-[10px] font-black tracking-widest uppercase">Install to Android</span>
              </button>
            )}

            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 pl-2">Tactical Logs</p>
            <div className="space-y-2 px-2">
              {logs.map((log, i) => (
                <div key={i} className="text-[8px] font-mono text-cyan-500/40 flex items-start space-x-2">
                  <span className="text-cyan-500/20">{'>'}</span>
                  <span className="truncate uppercase">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-cyan-500/10 bg-slate-900/40">
          <div className="grid grid-cols-2 gap-4 text-[8px] font-mono text-cyan-500/60 uppercase mb-4">
            <div className="flex items-center space-x-1"><MapPin size={10} /><span>{coords.lat} N</span></div>
            <div className="flex items-center space-x-1"><Clock size={10} /><span>{time.toLocaleTimeString([], { hour12: false })}</span></div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-xl border border-cyan-500/20">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center font-bold text-cyan-400 text-xs border border-cyan-400/20">
              {username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-white truncate uppercase tracking-tighter">{username}</p>
              <p className="text-[7px] text-cyan-500/50 font-mono italic">OP_ID: {Math.floor(Math.random()*10000)}</p>
            </div>
            <button 
              onClick={onLogout} 
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 border-b border-cyan-500/10 glass-morphism flex items-center justify-between px-6 md:px-10 relative z-30">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-cyan-400 rounded-lg"><Menu size={20} /></button>
            <div className="hidden sm:flex items-center space-x-3">
              <Terminal size={14} className="text-cyan-500" />
              <div className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
                Access: <span className="text-white">INTEL_TERMINAL_01</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Session Secure</span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </section>
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-20 -z-10" />
      </main>
    </div>
  );
};

export default Layout;
