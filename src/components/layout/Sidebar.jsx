import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Database, 
  History, 
  Settings, 
  Bell,
  Sun,
  Moon,
  LogOut,
  X,
  Coffee,
  Leaf,
  Users,
  Shield,
  UserCog,
  BarChart3,
  CalendarClock,
  FileCheck
} from 'lucide-react';
import NavItem from '../common/NavItem';


// Definisikan palet warna
const colors = {
  tealDark: '#425c5a',
  tealMedium: '#3c5654',
  tealLight: '#e2eceb',
  tealPale: '#cadfdf',
  gold: '#d7a217'
};

// --- Komponen Partikel Emas Mengambang (VISUAL ENHANCED) ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 20 + 15,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.4 + 0.1,
      blur: Math.random() * 1.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-[#f9d423] to-[#d7a217] animate-float-particle mix-blend-screen"
          style={{
            width: `${p.size}px`, height: `${p.size}px`,
            left: `${p.left}%`, top: `${p.top}%`,
            opacity: p.opacity,
            filter: `blur(${p.blur}px)`,
            animationDuration: `${p.animDuration}s`,
            animationDelay: `${p.animDelay}s`,
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(215, 162, 23, 0.4)`,
          }}
        />
      ))}
    </div>
  );
};

const Sidebar = ({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  view, 
  setView, 
  branding, 
  currentUserProfile,
  isDarkMode,
  toggleDarkMode,
  onLogout,
  showNotificationPanel,
  setShowNotificationPanel,
  notifications,
  unreadCount
}) => {
  
  // Cek level user untuk menentukan menu yang ditampilkan
  const userLevel = currentUserProfile?.level;
  const isSuperAdmin = userLevel === 'Super Admin';
  const isAdmin = userLevel === 'Admin' || isSuperAdmin;
  const isKasubid = userLevel === 'Kepala Sub Bidang';
  const isOperator = userLevel === 'Operator BKAD';
  const isSkpd = userLevel === 'SKPD';
  const isViewer = userLevel === 'TAPD' || userLevel === 'Viewer';

  return (
    <>
      {/* Overlay untuk mobile dengan blur tingkat tinggi */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
      
      {/* Sidebar dengan Glassmorphism & Gradasi Premium */}
      <aside className={`fixed inset-y-0 left-0 w-[280px] md:w-[300px] flex flex-col z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static lg:translate-x-0 print:hidden border-r border-[#d7a370]/20 shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)] ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Background Base Premium Brown/Gold */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#312214]/95 via-[#3d2b1a]/95 to-[#1a110a]/95 backdrop-blur-3xl z-0"></div>
        
        {/* Ambient Glow / Parallax Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[150%] h-[200px] bg-gradient-to-br from-[#d7a217]/20 to-transparent blur-[80px] -translate-x-1/4 -translate-y-1/4 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-[150%] h-[300px] bg-gradient-to-tl from-[#7b5435]/30 to-transparent blur-[100px] translate-x-1/4 translate-y-1/4"></div>
        </div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(#d7a370 1px, transparent 1px), linear-gradient(90deg, #d7a370 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        {/* Particles Effect */}
        <FloatingGoldParticles />
        
        {/* Content Container */}
        <div className="relative flex flex-col h-full z-10">
          
          {/* Header Sidebar dengan Logo */}
          <div className="p-6 md:p-8 border-b border-[#d7a370]/20 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                {/* Logo with Advanced Glow */}
                <div className="relative">
                  <div className="absolute inset-0 bg-[#d7a217] rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse-slow"></div>
                  <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#b87e4f] to-[#7b5435] flex items-center justify-center text-white font-black text-xl shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-[#d7a217]/30 transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 overflow-hidden">
                    {branding.logoUrl ? (
                      <img 
                        src={branding.logoUrl} 
                        alt={`${branding.name1}${branding.name2} Logo`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      branding.icon
                    )}
                  </div>
                </div>
                
                {/* Nama Aplikasi */}
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-baseline gap-1">
                    <span className="text-xl md:text-2xl font-black tracking-tight text-white drop-shadow-md">
                      {branding.name1}
                    </span>
                    <span className="text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#f9d423] to-[#d7a217] drop-shadow-md">
                      {branding.name2}
                    </span>
                  </div>
                  <p className="text-[9px] md:text-[10px] text-[#d7a370] mt-1 tracking-[0.2em] font-bold uppercase opacity-80">
                    {branding.tagline}
                  </p>
                </div>
              </div>
              
              {/* Tombol close mobile */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="lg:hidden p-2.5 text-[#d7a370] hover:text-white bg-black/20 hover:bg-[#7b5435]/80 rounded-xl transition-all border border-transparent hover:border-[#d7a370]/30 shadow-sm"
              >
                <X size={20}/>
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 md:p-6 space-y-2 flex-grow overflow-y-auto custom-scrollbar relative z-10">
            
            {/* Dashboard - SEMUA LEVEL */}
            <NavItem 
              active={view === 'dashboard'} 
              icon={<LayoutDashboard size={20}/>} 
              label="Dashboard Utama" 
              onClick={() => { 
                setView('dashboard'); 
                setIsMobileMenuOpen(false); 
              }} 
            />
            
            {/* Daftar Berkas - SEMUA LEVEL */}
            <NavItem 
              active={view === 'list' || view === 'detail' || view === 'add-proposal'} 
              icon={<FileText size={20}/>} 
              label="Daftar Dokumen" 
              onClick={() => { 
                setView('list'); 
                setIsMobileMenuOpen(false); 
              }} 
            />
            
            {/* Menu Khusus untuk KEPALA SUB BIDANG */}
            {isKasubid && (
              <NavItem 
                active={view === 'approval'} 
                icon={<FileCheck size={20}/>} 
                label="Persetujuan Akhir" 
                onClick={() => { 
                  setView('list'); 
                  setIsMobileMenuOpen(false); 
                }} 
              />
            )}
            
            {/* Menu Khusus untuk OPERATOR */}
            {isOperator && (
              <NavItem 
                active={view === 'verification'} 
                icon={<FileCheck size={20}/>} 
                label="Verifikasi Berkas" 
                onClick={() => { 
                  setView('list'); 
                  setIsMobileMenuOpen(false); 
                }} 
              />
            )}
            
            {/* Audit Log - Hanya SUPER ADMIN dan ADMIN */}
            {(isSuperAdmin || isAdmin) && (
              <NavItem 
                active={view === 'audit-log'} 
                icon={<History size={20}/>} 
                label="Audit Log Aktivitas" 
                onClick={() => { 
                  setView('logs'); 
                  setIsMobileMenuOpen(false); 
                }} 
              />
            )}
            
            {/* Panduan Sistem - SEMUA LEVEL */}
            <NavItem 
              active={view === 'panduan'} 
              icon={<BookOpen size={20}/>} 
              label="Panduan Sistem" 
              onClick={() => { 
                setView('panduan'); 
                setIsMobileMenuOpen(false); 
              }} 
            />
            
            {/* Storage Management - Hanya SUPER ADMIN dan ADMIN */}
            {(isSuperAdmin || isAdmin) && (
              <NavItem 
                active={view === 'storage'} 
                icon={<Database size={20}/>} 
                label="Manajemen Storage" 
                onClick={() => { 
                  setView('storage'); 
                  setIsMobileMenuOpen(false); 
                }} 
              />
            )}
            
            {/* History Log - Hanya SUPER ADMIN dan ADMIN */}
            {(isSuperAdmin || isAdmin) && (
              <NavItem 
                active={view === 'logs'} 
                icon={<History size={20}/>} 
                label="Riwayat Sistem" 
                onClick={() => { 
                  setView('logs'); 
                  setIsMobileMenuOpen(false); 
                }} 
              />
            )}
          </nav>

          {/* Footer Sidebar */}
          <div className="relative p-5 md:p-6 border-t border-[#d7a370]/20 space-y-4 bg-black/10 backdrop-blur-xl z-10">
            
            {/* Ambient Glow in Footer */}
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-[#d7a217]/5 to-transparent pointer-events-none"></div>

            {/* Settings - Hanya SUPER ADMIN dan ADMIN */}
            {(isSuperAdmin || isAdmin) && (
              <div className="relative z-10">
                <NavItem 
                  active={view === 'settings'} 
                  icon={<Settings size={20}/>} 
                  label="Pengaturan Master" 
                  onClick={() => { 
                    setView('settings'); 
                    setIsMobileMenuOpen(false); 
                  }} 
                />
              </div>
            )}
            
            {/* Dark Mode Toggle Premium */}
            <button 
              onClick={toggleDarkMode} 
              className="relative z-10 w-full flex items-center justify-center gap-3 p-3.5 md:p-4 rounded-xl bg-black/20 hover:bg-[#7b5435]/40 text-[#e6c3a0] hover:text-white transition-all duration-300 font-black text-xs uppercase tracking-widest border border-[#d7a370]/20 shadow-inner group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
              {isDarkMode ? (
                <>
                  <Sun size={18} className="text-[#d7a370] group-hover:rotate-90 transition-transform duration-500" />
                  Ganti Tema Terang
                </>
              ) : (
                <>
                  <Moon size={18} className="text-[#d7a370] group-hover:-rotate-12 transition-transform duration-500" />
                  Ganti Tema Gelap
                </>
              )}
            </button>

            {/* Profile Card Premium Glassmorphism */}
            <div className="relative z-10 p-4 md:p-5 bg-gradient-to-br from-[#4f3822]/60 to-[#2c1e12]/80 rounded-2xl border border-[#d7a370]/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(215,162,23,0.15)] transition-shadow duration-500 group/profile">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#d7a217] rounded-xl blur-md opacity-30 group-hover/profile:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#b87e4f] to-[#7b5435] flex items-center justify-center text-white font-black text-lg shadow-lg border border-[#d7a370]/40">
                    {String(currentUserProfile?.nama || "User").charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-black text-white truncate leading-tight mb-1">
                    {String(currentUserProfile?.nama || "User")}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Shield size={12} className="text-[#d7a217]" />
                    <p className="text-[9px] text-[#e6c3a0] font-black uppercase tracking-widest truncate">
                      {String(currentUserProfile?.level || "Viewer")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tombol Logout - MERAH DENGAN GLASSMORPHISM ADVANCED */}
              <button 
                onClick={onLogout} 
                className="w-full flex items-center justify-center gap-2.5 p-3.5 rounded-xl backdrop-blur-md transition-all duration-300 font-black text-[10px] md:text-xs uppercase tracking-widest border group/logout relative overflow-hidden"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(225, 29, 72, 0.15)' : 'rgba(225, 29, 72, 0.1)',
                  borderColor: 'rgba(225, 29, 72, 0.3)',
                  color: '#f43f5e'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(225, 29, 72, 0.25)' : 'rgba(225, 29, 72, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(225, 29, 72, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(225, 29, 72, 0.15)' : 'rgba(225, 29, 72, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Internal Glow for Logout */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/logout:animate-shimmer pointer-events-none"></div>
                <LogOut size={16} className="group-hover/logout:-translate-x-1 transition-transform" /> 
                <span className="relative z-10">Keluar Akses</span>
              </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-6 right-6 opacity-10 pointer-events-none z-0 mix-blend-overlay">
              <Coffee size={80} className="text-[#d7a217]" />
            </div>
            <div className="absolute top-24 left-6 opacity-5 pointer-events-none rotate-45 z-0 mix-blend-overlay">
              <Leaf size={60} className="text-[#d7a217]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Internal CSS for Animations and Custom Scrollbar */}
      <style jsx>{`
        /* Custom Premium Scrollbar for Sidebar */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.3); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.6); }

        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0; }
          20% { opacity: var(--tw-opacity, 0.8); transform: scale(1.2) rotate(45deg); }
          80% { opacity: var(--tw-opacity, 0.8); transform: scale(0.8) rotate(90deg); }
          100% { transform: translateY(-100vh) translateX(50px) scale(1) rotate(180deg); opacity: 0; }
        }
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-shimmer { animation: shimmer 2.5s infinite linear; }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
      `}</style>
    </>
  );
};

export default Sidebar;