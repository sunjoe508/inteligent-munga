
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { ViewMode, UserSession } from './types';
import Layout from './components/Layout';
import AgentChat from './components/AgentChat';
import StrategyPredictions from './components/StrategyPredictions';
import KnowledgeBase from './components/KnowledgeBase';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Communication from './components/Communication';
import MarketIntel from './components/MarketIntel';
import StrategyRoadmap from './components/StrategyRoadmap';
import DynamicBackground from './components/DynamicBackground';
import { AnimatePresence, motion } from 'framer-motion';

const AUTO_DELETE_TIME = 30 * 60 * 1000; // 30 minutes in ms

// Context for PWA Installation
export const PWAContext = createContext<{ 
  installPrompt: any; 
  handleInstall: () => void; 
  isStandalone: boolean 
}>({ 
  installPrompt: null, 
  handleInstall: () => {}, 
  isStandalone: false 
});

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [view, setView] = useState<ViewMode>(ViewMode.LANDING);
  const [isInitializing, setIsInitializing] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect if already installed/standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const clearAppData = useCallback(() => {
    localStorage.removeItem('munga_session');
    localStorage.removeItem('munga_chat_history');
    localStorage.removeItem('munga_vault');
    setSession(null);
    setView(ViewMode.LANDING);
    console.log(">>> MUNGA OS: System Purge Executed (Security Protocol)");
  }, []);

  const updateActivity = useCallback(() => {
    if (session) {
      const now = Date.now();
      const updatedSession = { ...session, lastActivity: now };
      setSession(updatedSession);
      localStorage.setItem('munga_session', JSON.stringify(updatedSession));
    }
  }, [session]);

  useEffect(() => {
    const saved = localStorage.getItem('munga_session');
    if (saved) {
      try {
        const parsed: UserSession = JSON.parse(saved);
        const now = Date.now();
        if (now - parsed.lastActivity > AUTO_DELETE_TIME) {
          clearAppData();
        } else {
          setSession(parsed);
          setView(ViewMode.RESEARCH);
        }
      } catch (e) {
        clearAppData();
      }
    }
    const bootTimer = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(bootTimer);
  }, [clearAppData]);

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      if (Date.now() - session.lastActivity > AUTO_DELETE_TIME) {
        clearAppData();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [session, clearAppData]);

  const handleLogin = (data: { username: string; email: string }) => {
    const newSession: UserSession = { 
      username: data.username, 
      email: data.email, 
      token: 'jwt_' + Math.random(), 
      isVerified: true,
      lastActivity: Date.now()
    };
    setSession(newSession);
    localStorage.setItem('munga_session', JSON.stringify(newSession));
    setView(ViewMode.RESEARCH);
  };

  if (isInitializing) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center space-y-6 overflow-hidden">
      <div className="relative w-24 h-24">
         <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full" />
         <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-t-2 border-cyan-500 rounded-full shadow-[0_0_15px_#00f3ff]" 
         />
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-400 font-mono text-[10px] tracking-[0.8em] uppercase">Synchronizing Core...</motion.div>
    </div>
  );

  return (
    <PWAContext.Provider value={{ installPrompt, handleInstall, isStandalone }}>
      <div className="h-screen relative overflow-hidden selection:bg-cyan-500/30" onMouseMove={updateActivity} onKeyDown={updateActivity}>
        <DynamicBackground />
        {view === ViewMode.LANDING && !session ? (
          <LandingPage onStart={() => setView(ViewMode.RESEARCH)} />
        ) : !session ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Layout activeView={view} onViewChange={setView} onLogout={clearAppData} username={session.username}>
            <div className="h-full relative z-10">
              <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-full">
                  {view === ViewMode.RESEARCH && <AgentChat />}
                  {view === ViewMode.MARKET && <MarketIntel />}
                  {view === ViewMode.ROADMAP && <StrategyRoadmap />}
                  {view === ViewMode.ANALYTICS && <StrategyPredictions />}
                  {view === ViewMode.DOCUMENTS && <KnowledgeBase />}
                  {view === ViewMode.COMMUNICATION && <Communication />}
                </motion.div>
              </AnimatePresence>
            </div>
          </Layout>
        )}
      </div>
    </PWAContext.Provider>
  );
};

export default App;
