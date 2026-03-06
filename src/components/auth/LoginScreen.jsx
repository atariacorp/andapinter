import React, { useState } from 'react';
import { 
  Mail, Lock, ChevronRight, X, AlertTriangle, 
  Sun, Moon, Phone, Globe, Coffee, Leaf,
  ArrowRight, Eye, EyeOff, CheckCircle
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(loginEmail, loginPassword, isRegisterMode);
  };

  // Background pattern (subtle)
  const bgPattern = {
    backgroundImage: `radial-gradient(circle at 10px 10px, rgba(180, 140, 92, 0.03) 2px, transparent 2px)`,
    backgroundSize: '30px 30px'
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#faf7f2] to-[#f0e9db] dark:from-[#1f1812] dark:to-[#2d231b] flex items-center justify-center p-4 transition-colors duration-500 relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none" style={bgPattern}></div>
      
      {/* Animated Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#b48c5c]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8b6b4c]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Floating Leaves */}
      <div className="absolute top-20 right-20 opacity-10 animate-float">
        <Leaf size={120} className="text-[#b48c5c]" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-10 animate-float-delay">
        <Coffee size={120} className="text-[#8b6b4c]" />
      </div>

      {/* Notifikasi */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-2 w-full max-w-sm pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-top-4 fade-in backdrop-blur-md w-full ${
              n.type === 'success' 
                ? 'bg-[#8b6b4c] text-white border-[#b48c5c]' 
                : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {n.type === 'success' 
              ? <CheckCircle size={20} className="flex-shrink-0" /> 
              : <AlertTriangle size={20} className="flex-shrink-0" />
            }
            <p className="text-xs font-medium tracking-wide text-white leading-tight flex-1">
              {String(n.message || "")}
            </p>
            <button onClick={() => removeNotification(n.id)} className="opacity-60 hover:opacity-100 text-white">
              <X size={16}/>
            </button>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md relative">
        
        {/* Card dengan efek shadow dan border */}
        <div className="bg-white/90 dark:bg-[#2d231b]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#e6d5bf] dark:border-[#4f3d2f] p-8 animate-in zoom-in-95 duration-500">
          
          {/* Header dengan Logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Background blur */}
              <div className="absolute inset-0 bg-[#b48c5c]/20 rounded-full blur-xl animate-pulse"></div>
              
              {/* Logo */}
              {branding.logoUrl ? (
                <img 
                  src={branding.logoUrl} 
                  alt={`${branding.name1}${branding.name2} Logo`}
                  className="w-24 h-24 mx-auto mb-4 object-contain relative z-10"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-[#b48c5c] to-[#8b6b4c] rounded-2xl flex items-center justify-center text-white font-black text-4xl mx-auto mb-4 shadow-xl shadow-[#b48c5c]/30 transform rotate-3 hover:rotate-0 transition-transform duration-300 relative z-10">
                  {branding.icon}
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-black text-[#362b21] dark:text-[#f0e9db] tracking-tight">
              {branding.name1}
              <span className="text-[#b48c5c] dark:text-[#d4b99b]"> {branding.name2}</span>
            </h1>
            
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-[#6d5340] dark:text-[#d4b99b]">
                {isRegisterMode ? 'Buat Akun Baru' : branding.tagline}
              </p>
              <p className="text-xs text-[#8b6b4c] dark:text-[#b48c5c] opacity-80">
                {branding.subTagline}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className={`text-xs font-medium tracking-wide transition-colors duration-200 ${
                emailFocused ? 'text-[#b48c5c]' : 'text-[#6d5340] dark:text-[#e6d5bf]'
              }`}>
                Email
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                  emailFocused ? 'text-[#b48c5c]' : 'text-[#8b6b4c] group-hover:text-[#b48c5c]'
                }`}>
                  <Mail size={18} />
                </div>
                <input
                  required
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="nama@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-[#faf7f2] dark:bg-[#362b21] border-2 border-[#e6d5bf] dark:border-[#4f3d2f] rounded-xl text-sm text-[#362b21] dark:text-[#f0e9db] placeholder-[#b48c5c]/50 focus:border-[#b48c5c] dark:focus:border-[#d4b99b] outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className={`text-xs font-medium tracking-wide transition-colors duration-200 ${
                passwordFocused ? 'text-[#b48c5c]' : 'text-[#6d5340] dark:text-[#e6d5bf]'
              }`}>
                Kata Sandi {isRegisterMode && '(min. 6 karakter)'}
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                  passwordFocused ? 'text-[#b48c5c]' : 'text-[#8b6b4c] group-hover:text-[#b48c5c]'
                }`}>
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
                  className="w-full pl-12 pr-12 py-4 bg-[#faf7f2] dark:bg-[#362b21] border-2 border-[#e6d5bf] dark:border-[#4f3d2f] rounded-xl text-sm text-[#362b21] dark:text-[#f0e9db] placeholder-[#b48c5c]/50 focus:border-[#b48c5c] dark:focus:border-[#d4b99b] outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b6b4c] hover:text-[#b48c5c] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {!isRegisterMode && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#e6d5bf] text-[#b48c5c] focus:ring-[#b48c5c]"
                  />
                  <span className="text-xs text-[#6d5340] dark:text-[#e6d5bf]">Ingat saya</span>
                </label>
                <button
                  type="button"
                  className="text-xs text-[#8b6b4c] hover:text-[#b48c5c] transition-colors"
                >
                  Lupa password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#b48c5c] to-[#8b6b4c] rounded-xl opacity-100 group-hover:opacity-90 transition-opacity"></div>
              <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-bold text-sm tracking-wide">
                {isLoggingIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegisterMode ? 'Daftar Sekarang' : 'Masuk ke Aplikasi'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            {/* Toggle Register/Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-sm text-[#8b6b4c] hover:text-[#b48c5c] transition-colors"
              >
                {isRegisterMode ? (
                  <>Sudah punya akun? <span className="font-bold">Masuk</span></>
                ) : (
                  <>Belum punya akun? <span className="font-bold">Daftar</span></>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowInfoModal(true)}
              className="text-xs text-[#8b6b4c]/60 hover:text-[#b48c5c] transition-colors border-t border-[#e6d5bf] dark:border-[#4f3d2f] pt-4 w-full"
            >
              © 2026 Ataria Corp • {branding.name1}{branding.name2} v1.0
            </button>
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 p-4 bg-white dark:bg-[#2d231b] rounded-full shadow-lg border border-[#e6d5bf] dark:border-[#4f3d2f] hover:shadow-xl transition-all group"
      >
        {isDarkMode ? 
          <Sun size={20} className="text-[#b48c5c] group-hover:rotate-90 transition-transform" /> : 
          <Moon size={20} className="text-[#8b6b4c] group-hover:rotate-12 transition-transform" />
        }
      </button>

      {/* Info Modal */}
      <InfoModal
        show={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        branding={branding}
      />

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 8s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;