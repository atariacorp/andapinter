import React, { useState } from 'react';
import { 
  Mail, Lock, CheckCircle, ChevronRight, X, 
  AlertTriangle, Sun, Moon, Phone, Globe 
} from 'lucide-react';
import InfoModal from './InfoModal';

const LoginScreen = ({ 
  onLogin, 
  isLoggingIn, 
  notifications, 
  removeNotification,
  branding,
  isDarkMode,
  toggleDarkMode
}) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(loginEmail, loginPassword, isRegisterMode);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      
      {/* POP-UP ALERTS */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-2 w-full max-w-sm pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl border animate-in slide-in-from-top-4 fade-in backdrop-blur-md w-full ${n.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-rose-600 text-white border-rose-500'}`}>
            {n.type === 'success' ? <CheckCircle size={20} className="flex-shrink-0" /> : <AlertTriangle size={20} className="flex-shrink-0" />}
            <p className="text-xs font-black tracking-tighter uppercase text-white leading-tight">{String(n.message || "")}</p>
            <button onClick={() => removeNotification(n.id)} className="ml-auto opacity-60 hover:opacity-100 text-white"><X size={16}/></button>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700/50 p-8 animate-in zoom-in-95 relative overflow-hidden text-left">
        {/* Ornamen Desain */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/5 rounded-bl-full -z-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-tr-full -z-10 blur-2xl"></div>

        <div className="text-center mb-10">
          {branding.logoUrl ? (
            <img 
              src={branding.logoUrl} 
              alt={`${branding.name1}${branding.name2} Logo`}
              className="w-24 h-24 mx-auto mb-6 object-contain"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-4xl mx-auto mb-6 shadow-xl shadow-blue-500/30 transform -rotate-6 uppercase">
              {branding.icon}
            </div>
          )}
          
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight italic uppercase">
            {branding.name1}<span className="text-blue-600 dark:text-blue-400">{branding.name2}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
            {isRegisterMode ? 'Pendaftaran Akun Baru' : branding.tagline}
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1">
            {branding.subTagline}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Email Pengguna</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required 
                type="email" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                placeholder="nama@email.com" 
                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
              />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
              Kata Sandi {isRegisterMode && '(Min. 6 Karakter)'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required 
                type="password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                placeholder="••••••••" 
                minLength={isRegisterMode ? 6 : 1} 
                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoggingIn} 
            className={`w-full ${isRegisterMode ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'} text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2`}
          >
            {isLoggingIn ? 'Memproses...' : (isRegisterMode ? 'Daftar Sistem' : 'Masuk Sistem')} 
            {isRegisterMode ? <CheckCircle size={16}/> : <ChevronRight size={16}/>}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            type="button" 
            onClick={() => setIsRegisterMode(!isRegisterMode)} 
            className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold uppercase tracking-widest"
          >
            {isRegisterMode ? 'Sudah memiliki akun? Login' : 'Belum punya akun? Daftar'}
          </button>
        </div>

        {/* Informasi Aplikasi */}
        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => setShowInfoModal(true)} 
            className="text-[9px] font-medium text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors border-t border-slate-200 dark:border-slate-700 pt-4 w-full"
          >
            © 2026 Ataria Corp • {branding.name1}{branding.name2} v1.0 • Tentang Aplikasi
          </button>
        </div>

        {/* Modal Informasi */}
        <InfoModal 
          show={showInfoModal} 
          onClose={() => setShowInfoModal(false)} 
          branding={branding}
        />

        <button 
          onClick={toggleDarkMode} 
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;