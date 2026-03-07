import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, X, AlertTriangle, 
  Sun, Moon, Eye, EyeOff, CheckCircle,
  ArrowRight, Sparkles, Info
} from 'lucide-react';

// --- Komponen Info Modal (Inline untuk mencegah error) ---
const InfoModal = ({ show, onClose, branding, isDarkMode }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className={`relative rounded-3xl shadow-2xl max-w-sm w-full transform animate-in zoom-in-95 duration-300 overflow-hidden border ${isDarkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-gray-100'}`}>
        
        {/* Header Gradient */}
        <div className="h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="pt-8 pb-6 px-6 relative">
          {/* Icon Overlapping */}
          <div className={`absolute -top-10 left-6 p-2 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="p-3 bg-gradient-to-br from-[#d7a217]/20 to-[#d7a217]/10 rounded-xl">
              <Info size={24} className="text-[#d7a217]" />
            </div>
          </div>

          <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Informasi Sistem</h3>
          <p className={`text-xs mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Versi 4.0.0 (Rilis Terbaru)</p>

          <div className="space-y-3 mb-6">
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Aplikasi</p>
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{branding?.name1} {branding?.name2}</p>
            </div>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>Pengembang</p>
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ataria Corp</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Partikel Emas Mengambang ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 20 + 15,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#d7a217] animate-float-login"
          style={{
            width: `${p.size}px`, height: `${p.size}px`,
            left: `${p.left}%`, top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.animDuration}s`,
            animationDelay: `${p.animDelay}s`,
            boxShadow: `0 0 ${p.size * 2}px #d7a217`,
          }}
        />
      ))}
    </div>
  );
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Efek paralaks ringan (Logika dipertahankan)
  useEffect(() => {
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(loginEmail, loginPassword, isRegisterMode);
  };

  // Palet warna Teal & Gold yang diminta
  const colorPalette = {
    light: {
      bg: '#e2eceb',
      card: 'rgba(255, 255, 255, 0.6)',
      border: 'rgba(202, 223, 223, 0.8)',
      text: '#425c5a',
      accent: '#d7a217'
    },
    dark: {
      bg: '#425c5a',
      card: 'rgba(60, 86, 84, 0.4)',
      border: 'rgba(202, 223, 223, 0.2)',
      text: '#e2eceb',
      accent: '#d7a217'
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-700 relative overflow-hidden font-sans"
      style={{ backgroundColor: isDarkMode ? colorPalette.dark.bg : colorPalette.light.bg }}
    >
      
      {/* --- BACKGROUND AESTHETICS --- */}
      {/* Subtle Grid (ECharts Vibe) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      />

      {/* Animated Orbs for Depth */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            backgroundColor: isDarkMode ? '#3c5654' : '#cadfdf',
            opacity: 0.4,
            transform: `translate(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px)`,
            top: '-20%', left: '-10%',
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{
            backgroundColor: '#d7a217',
            opacity: 0.15,
            transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`,
            bottom: '-10%', right: '-10%',
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>

      {/* Floating Gold Particles */}
      <FloatingGoldParticles />

      {/* --- NOTIFICATIONS --- */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-3 w-full max-w-sm pointer-events-none">
        {(notifications || []).map(n => (
          <div 
            key={n.id} 
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-xl backdrop-blur-xl animate-in slide-in-from-top-4 fade-in w-full border ${
              n.type === 'success' 
                ? 'bg-emerald-500/90 text-white border-emerald-400/50' 
                : 'bg-rose-500/90 text-white border-rose-400/50'
            }`}
          >
            {n.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertTriangle size={20} className="shrink-0" />}
            <p className="text-[13px] font-semibold leading-snug flex-1">{String(n.message || "")}</p>
            <button onClick={() => removeNotification(n.id)} className="opacity-70 hover:opacity-100 transition-opacity">
              <X size={16}/>
            </button>
          </div>
        ))}
      </div>

      {/* --- MAIN LOGIN CARD --- */}
      <div 
        className="w-full max-w-[420px] relative z-10 animate-in zoom-in-95 duration-700"
        style={{ transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)` }}
      >
        
        {/* Glassmorphism Container */}
        <div 
          className="backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-500 group/card border"
          style={{ 
            backgroundColor: isDarkMode ? colorPalette.dark.card : colorPalette.light.card,
            borderColor: isDarkMode ? colorPalette.dark.border : colorPalette.light.border,
          }}
        >
          {/* Subtle Inner Glow on Hover */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none shadow-[inset_0_0_50px_rgba(215,162,23,0.05)]" />
          
          {/* Header & Logo */}
          <div className="text-center mb-10 relative">
            <div className="relative inline-flex items-center justify-center mb-6">
              {/* Dynamic Glow Behind Logo */}
              <div className="absolute inset-0 rounded-full blur-2xl animate-pulse" style={{ backgroundColor: '#d7a217', opacity: 0.2 }} />
              
              {branding?.logoUrl ? (
                <img 
                  src={branding.logoUrl} 
                  alt={`${branding?.name1 || ''}${branding?.name2 || ''} Logo`}
                  className="w-24 h-24 object-contain relative z-10 drop-shadow-xl transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl relative z-10 transition-transform duration-500 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #425c5a 0%, #3c5654 100%)' }}
                >
                  <Sparkles size={24} className="absolute top-1 right-1 text-[#d7a217]/50" />
                  <span>{branding?.icon || 'S'}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: isDarkMode ? colorPalette.dark.text : colorPalette.light.text }}>
              {branding?.name1 || 'SIM'}
              <span style={{ color: colorPalette.light.accent }}>
                {' '}{branding?.name2 || 'ONALISA'}
              </span>
            </h1>
            
            <p className="text-sm font-medium tracking-wide" style={{ color: isDarkMode ? '#cadfdf' : '#3c5654', opacity: 0.8 }}>
              {isRegisterMode ? 'Registrasi Akun Pengguna' : (branding?.tagline || 'Sistem Monitoring Analisa Anggaran')}
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {/* Email Input */}
            <div className="space-y-1.5 group/input">
              <label className="text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ml-1" style={{ color: emailFocused ? '#d7a217' : (isDarkMode ? '#cadfdf' : '#3c5654') }}>
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: emailFocused ? '#d7a217' : (isDarkMode ? '#cadfdf' : '#3c5654'), opacity: emailFocused ? 1 : 0.5 }}>
                  <Mail size={18} />
                </div>
                <input
                  required
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="admin@pemda.go.id"
                  className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm rounded-2xl text-sm font-semibold outline-none transition-all duration-300 shadow-inner"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                    borderColor: emailFocused ? '#d7a217' : (isDarkMode ? 'rgba(202, 223, 223, 0.2)' : 'rgba(60, 86, 84, 0.2)'),
                    borderWidth: '1px',
                    color: isDarkMode ? '#e2eceb' : '#425c5a',
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 group/input">
              <label className="text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ml-1 flex justify-between" style={{ color: passwordFocused ? '#d7a217' : (isDarkMode ? '#cadfdf' : '#3c5654') }}>
                <span>Kata Sandi</span>
                {isRegisterMode && <span className="opacity-70 lowercase normal-case tracking-normal">(min. 6 char)</span>}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: passwordFocused ? '#d7a217' : (isDarkMode ? '#cadfdf' : '#3c5654'), opacity: passwordFocused ? 1 : 0.5 }}>
                  <Lock size={18} />
                </div>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  minLength={isRegisterMode ? 6 : 1}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 backdrop-blur-sm rounded-2xl text-sm font-semibold outline-none transition-all duration-300 shadow-inner"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                    borderColor: passwordFocused ? '#d7a217' : (isDarkMode ? 'rgba(202, 223, 223, 0.2)' : 'rgba(60, 86, 84, 0.2)'),
                    borderWidth: '1px',
                    color: isDarkMode ? '#e2eceb' : '#425c5a',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
                  style={{ color: '#d7a217', opacity: loginPassword ? 1 : 0.5 }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {!isRegisterMode && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded border transition-colors duration-300" style={{ borderColor: rememberMe ? '#d7a217' : (isDarkMode ? '#cadfdf' : '#3c5654'), backgroundColor: rememberMe ? '#d7a217' : 'transparent' }}>
                    <input type="checkbox" className="sr-only" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    {rememberMe && <CheckCircle size={12} color="white" className="absolute" />}
                  </div>
                  <span className="text-xs font-semibold transition-colors" style={{ color: isDarkMode ? '#cadfdf' : '#3c5654' }}>Ingat Saya</span>
                </label>
                <button type="button" className="text-xs font-bold hover:underline transition-all" style={{ color: '#d7a217' }}>
                  Lupa Sandi?
                </button>
              </div>
            )}

            {/* Submit Button (Premium Look) */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full relative group/btn overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              style={{ boxShadow: isLoggingIn ? 'none' : '0 8px 20px rgba(215, 162, 23, 0.25)' }}
            >
              <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-br from-[#d7a217] to-[#b58812]" />
              <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover/btn:translate-x-[150%]" />
              
              <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-xs">
                {isLoggingIn ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>MEMPROSES...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegisterMode ? 'Daftar Sekarang' : 'Masuk Sistem'}</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            {/* Toggle Mode */}
            <div className="text-center pt-3">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs font-medium transition-colors hover:underline"
                style={{ color: isDarkMode ? '#cadfdf' : '#3c5654' }}
              >
                {isRegisterMode ? (
                  <>Sudah terdaftar? <span style={{ color: '#d7a217', fontWeight: 'bold' }}>Login</span></>
                ) : (
                  <>Belum memiliki akses? <span style={{ color: '#d7a217', fontWeight: 'bold' }}>Daftar</span></>
                )}
              </button>
            </div>
          </form>

          {/* Footer Info */}
          <div className="mt-8 text-center relative z-10 border-t pt-4" style={{ borderColor: isDarkMode ? 'rgba(202, 223, 223, 0.1)' : 'rgba(60, 86, 84, 0.1)' }}>
            <button
              onClick={() => setShowInfoModal(true)}
              className="text-[10px] font-bold tracking-widest uppercase transition-colors hover:scale-105 transform inline-block"
              style={{ color: '#d7a217' }}
            >
              © {new Date().getFullYear()} Ataria Corp
            </button>
          </div>
        </div>
      </div>

      {/* --- FLOATING TOGGLES (Dark Mode & Info) --- */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={() => setShowInfoModal(true)}
          className="p-3.5 backdrop-blur-xl rounded-full shadow-lg border transition-all duration-300 hover:scale-110 hover:shadow-xl group"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.6)' : 'rgba(255, 255, 255, 0.6)',
            borderColor: isDarkMode ? 'rgba(202, 223, 223, 0.2)' : 'rgba(60, 86, 84, 0.2)'
          }}
          title="Informasi Sistem"
        >
          <Info size={18} style={{ color: '#d7a217' }} className="group-hover:rotate-12 transition-transform" />
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-3.5 backdrop-blur-xl rounded-full shadow-lg border transition-all duration-300 hover:scale-110 hover:shadow-xl group"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.6)' : 'rgba(255, 255, 255, 0.6)',
            borderColor: isDarkMode ? 'rgba(202, 223, 223, 0.2)' : 'rgba(60, 86, 84, 0.2)'
          }}
          title="Toggle Tema"
        >
          {isDarkMode ? 
            <Sun size={18} style={{ color: '#d7a217' }} className="group-hover:rotate-90 transition-transform" /> : 
            <Moon size={18} style={{ color: '#d7a217' }} className="group-hover:-rotate-12 transition-transform" />
          }
        </button>
      </div>

      {/* Info Modal Component */}
      <InfoModal
        show={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        branding={branding}
        isDarkMode={isDarkMode}
      />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-login {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: var(--opacity, 0.4); }
          80% { opacity: var(--opacity, 0.4); }
          100% { transform: translateY(-100px) translateX(30px) scale(0.8); opacity: 0; }
        }
        .animate-float-login {
          animation: float-login linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;