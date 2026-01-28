
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, ArrowRight, ShieldCheck, Loader2, AlertCircle, Info, KeyRound } from 'lucide-react';

interface LoginProps {
  onLogin: (session: { username: string; email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDispatchHUD, setShowDispatchHUD] = useState(false);

  // Simulated Database Helper
  const getDB = () => JSON.parse(localStorage.getItem('munga_user_db') || '[]');
  
  const checkUserExists = (targetEmail: string) => {
    return getDB().find((u: any) => u.email.toLowerCase() === targetEmail.toLowerCase());
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const user = checkUserExists(email);

    if (!isSignUp && !user) {
      setError("OPERATOR NOT FOUND. PLEASE INITIALIZE REGISTRY PROTOCOL.");
      setLoading(false);
      return;
    }

    if (isSignUp && user) {
      setError("EMAIL ALREADY REGISTERED. ACCESS DENIED.");
      setLoading(false);
      return;
    }

    if (isSignUp && !username) {
      setError("OPERATOR HANDLE REQUIRED FOR REGISTRY.");
      setLoading(false);
      return;
    }

    // Generate Mock OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    // Simulate Secure Transmission Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep('otp');
    setLoading(false);
    setShowDispatchHUD(true);
    
    // HUD stays visible for 20 seconds
    setTimeout(() => setShowDispatchHUD(false), 20000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Allow the generated OTP or the master override for the user's specific email
    const isMasterKey = email.toLowerCase() === "joemunga329@gmail.com" && otp === "123456";
    const isCorrectOtp = otp === generatedOtp;

    if (isCorrectOtp || isMasterKey) {
      if (isSignUp) {
        const users = getDB();
        users.push({ email: email.toLowerCase(), username, registeredAt: Date.now() });
        localStorage.setItem('munga_user_db', JSON.stringify(users));
      } else {
        const user = checkUserExists(email);
        if (user) setUsername(user.username);
      }
      onLogin({ username: username || email.split('@')[0], email });
    } else {
      setLoading(false);
      setError("INVALID_VERIFICATION_HASH. ACCESS REVOKED.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative font-tech overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-20" />
      
      {/* Visual Email Dispatch HUD - This simulates the email arriving */}
      <AnimatePresence>
        {showDispatchHUD && (
          <motion.div 
            initial={{ y: -150, opacity: 0, scale: 0.8 }}
            animate={{ y: 40, opacity: 1, scale: 1 }}
            exit={{ y: -150, opacity: 0 }}
            className="fixed top-0 z-[100] glass-morphism border-cyan-500/50 p-6 rounded-[32px] flex flex-col items-center space-y-4 max-w-sm shadow-[0_0_50px_rgba(0,243,255,0.3)] border-2"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Incoming Encrypted Mail</p>
                <p className="text-[9px] text-cyan-500/60 font-mono truncate">From: MUNGA_RELAY_ALPHA</p>
              </div>
              <div className="text-[8px] font-mono text-cyan-500/40">JUST NOW</div>
            </div>
            <div className="w-full bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/20 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em] mb-2">Verification Passcode</p>
              <p className="text-3xl font-black text-white tracking-[0.4em] glow-text">{generatedOtp}</p>
            </div>
            <p className="text-[8px] text-slate-500 uppercase font-mono italic">Security protocol: Do not share this code.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md glass-morphism p-10 rounded-[40px] shadow-2xl relative z-10 border-2 transition-colors duration-700 ${isSignUp ? 'border-purple-500/30' : 'border-cyan-500/30'}`}
      >
        <div className={`absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 rounded-tl-[40px] opacity-60 ${isSignUp ? 'border-purple-500' : 'border-cyan-500'}`} />
        <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 rounded-br-[40px] opacity-60 ${isSignUp ? 'border-purple-500' : 'border-cyan-500'}`} />

        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>
          <h2 className="text-3xl font-black text-white glow-text tracking-tighter uppercase mb-2">
            {step === 'otp' ? 'Handshake' : isSignUp ? 'Registry' : 'Login'}
          </h2>
          <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
             <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSignUp ? 'bg-purple-500' : 'bg-cyan-500'}`} />
             <span>Terminal OS v4.0.5</span>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center space-x-3 text-red-400 text-[9px] font-mono uppercase font-black"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'auth' ? (
            <motion.form 
              key="auth"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleInitialSubmit} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Operator Identity</label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSignUp ? 'text-purple-500' : 'text-cyan-500'}`} size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER_EMAIL_LINK"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-5 text-white font-mono text-xs focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all"
                  />
                </div>
              </div>

              {isSignUp && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Handle Assignment</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" size={16} />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="NEW_OPERATOR_NAME"
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-5 text-white font-mono text-xs focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-3 uppercase tracking-widest text-xs ${
                  isSignUp 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-900/20 hover:from-purple-500' 
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-900/20 hover:from-cyan-500'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>{isSignUp ? 'Begin Registry' : 'Initiate Session'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="w-full text-[9px] font-mono text-slate-600 hover:text-cyan-400 transition-colors py-2 uppercase tracking-widest"
              >
                {isSignUp ? '>>> RETURN TO AUTH PROTOCOL' : '>>> NO OPERATOR FOUND? REGISTER HERE'}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="otp"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleVerifyOtp} 
              className="space-y-8"
            >
              <div className="text-center space-y-6">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-center space-x-3 text-emerald-400">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-mono uppercase tracking-widest truncate">Packet Routed: {email}</span>
                </div>
                
                <div className="relative group">
                  <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-cyan-500 transition-colors" size={24} />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    autoFocus
                    placeholder="000000"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-6 text-center text-4xl font-black font-tech tracking-[0.4em] text-white focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all placeholder:text-slate-800"
                  />
                </div>
                
                <p className="text-[9px] font-mono text-slate-600 uppercase italic">Check your secure inbox (Simulated HUD above).</p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 transition-all uppercase tracking-widest text-xs"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Finalize Handshake'}
              </button>
              
              <button
                type="button"
                onClick={() => { setStep('auth'); setShowDispatchHUD(false); }}
                className="w-full text-[9px] font-mono text-slate-600 hover:text-white transition-colors uppercase tracking-widest"
              >
                {'<<< RESET TRANSMISSION'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-8 border-t border-slate-900 text-center opacity-40">
          <p className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.5em]">
            MUNGA SECURE LINK SYSTEM // STABLE
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
