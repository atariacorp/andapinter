import React from 'react';
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
import NotificationBell from '../common/NotificationBell';

// Definisikan palet warna
const colors = {
  tealDark: '#425c5a',
  tealMedium: '#3c5654',
  tealLight: '#e2eceb',
  tealPale: '#cadfdf',
  gold: '#d7a217'
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
  const isAdmin = userLevel === 'Admin' || isSuperAdmin; // Admin termasuk Super Admin
  const isKasubid = userLevel === 'Kepala Sub Bidang';
  const isOperator = userLevel === 'Operator BKAD';
  const isSkpd = userLevel === 'SKPD';
  const isViewer = userLevel === 'TAPD' || userLevel === 'Viewer';

  return (
    <>
      {/* Overlay untuk mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
      
      {/* Sidebar dengan gradasi coklat */}
      <aside className={`fixed inset-y-0 left-0 w-72 flex flex-col z-50 transition-transform lg:static lg:translate-x-0 print:hidden ${
        isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        
        {/* Background dengan gradasi */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3d2b1a] via-[#4f3822] to-[#2c1e12]"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, #d7a370 2px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Content */}
        <div className="relative flex flex-col h-full z-10">
          
          {/* Header Sidebar dengan Logo */}
          <div className="p-6 border-b border-[#d7a370]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="relative">
                  <div className="absolute inset-0 bg-[#b87e4f] rounded-xl blur-md opacity-50"></div>
                  {branding.logoUrl ? (
                    <img 
                      src={branding.logoUrl} 
                      alt={`${branding.name1}${branding.name2} Logo`}
                      className="w-10 h-10 object-contain rounded-xl relative z-10"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-[#b87e4f] to-[#7b5435] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg relative z-10">
                      {branding.icon}
                    </div>
                  )}
                </div>
                
                {/* Nama Aplikasi */}
                <div>
                  <span className="text-xl font-black tracking-tight text-white">
                    {branding.name1}
                  </span>
                  <span className="text-xl font-black tracking-tight text-[#e6c3a0]">
                    {branding.name2}
                  </span>
                  <p className="text-[8px] text-[#d7a370] mt-0.5 tracking-wider">
                    {branding.tagline}
                  </p>
                </div>
              </div>
              
              {/* Tombol close mobile */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="lg:hidden p-2 text-[#d7a370] hover:text-white hover:bg-[#7b5435]/50 rounded-lg transition-all"
              >
                <X size={20}/>
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5 flex-grow overflow-y-auto scrollbar-hide">
            
            {/* Dashboard - SEMUA LEVEL */}
            <NavItem 
              active={view === 'dashboard'} 
              icon={<LayoutDashboard size={18}/>} 
              label="Dashboard" 
              onClick={() => { 
                setView('dashboard'); 
                setIsMobileMenuOpen(false); 
              }} 
            />
            
            {/* Daftar Berkas - SEMUA LEVEL */}
            <NavItem 
              active={view === 'list' || view === 'detail' || view === 'add-proposal'} 
              icon={<FileText size={18}/>} 
              label="Daftar Berkas" 
              onClick={() => { 
                setView('list'); 
                setIsMobileMenuOpen(false); 
              }} 
            />
            
            {/* Menu Khusus untuk KEPALA SUB BIDANG */}
            {isKasubid && (
              <NavItem 
                active={view === 'approval'} 
                icon={<FileCheck size={18}/>} 
                label="Persetujuan Akhir" 
                onClick={() => { 
                  setView('list'); 
                  // Set filter ke status Diverifikasi
                  // Implementasi filter akan ditambahkan nanti
                  setIsMobileMenuOpen(false); 
                }} 
              />
            )}
            
            {/* Menu Khusus untuk OPERATOR */}
            {isOperator && (
              <NavItem 
                active={view === 'verification'} 
                icon={<FileCheck size={18}/>} 
                label="Verifikasi Berkas" 
                onClick={() => { 
                  setView('list'); 
                  // Set filter ke status Pending
                  setIsMobileMenuOpen(false); 
                }} 
              />
            )}
            
            {/* Menu Khusus untuk SUPER ADMIN / ADMIN */}
            {(isSuperAdmin || isAdmin) && (
              <>
                <NavItem 
                  active={view === 'users-management'} 
                  icon={<Users size={18}/>} 
                  label="Manajemen User" 
                  onClick={() => { 
                    setView('settings'); 
                    // Set tab ke users
                    setIsMobileMenuOpen(false); 
                  }} 
                />
                
                <NavItem 
                  active={view === 'audit-log'} 
                  icon={<History size={18}/>} 
                  label="Audit Log" 
                  onClick={() => { 
                    setView('logs'); 
                    setIsMobileMenuOpen(false); 
                  }} 
                />
              </>
            )}
            
            {/* Panduan Sistem - SEMUA LEVEL */}
            <NavItem 
              active={view === 'panduan'} 
              icon={<BookOpen size={18}/>} 
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
                icon={<Database size={18}/>} 
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
                icon={<History size={18}/>} 
                label="History Log" 
                onClick={() => { 
                  setView('logs'); 
                  setIsMobileMenuOpen(false); 
                }} 
              />
            )}
          </nav>

          {/* Footer Sidebar */}
          <div className="relative p-4 border-t border-[#d7a370]/20 space-y-3">
            
            {/* Settings - Hanya SUPER ADMIN dan ADMIN */}
            {(isSuperAdmin || isAdmin) && (
              <NavItem 
                active={view === 'settings'} 
                icon={<Settings size={18}/>} 
                label="Pengaturan Master" 
                onClick={() => { 
                  setView('settings'); 
                  setIsMobileMenuOpen(false); 
                }} 
              />
            )}
            
            {/* Notifikasi */}
            <div className="relative">
              <NotificationBell isDarkMode={isDarkMode} colors={colors} />
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#4f3822]/30 hover:bg-[#7b5435]/30 text-[#e6c3a0] hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest border border-[#d7a370]/20"
            >
              {isDarkMode ? (
                <>
                  <Sun size={16} className="text-[#d7a370]" />
                  Mode Terang
                </>
              ) : (
                <>
                  <Moon size={16} className="text-[#d7a370]" />
                  Mode Gelap
                </>
              )}
            </button>

            {/* Profile Card */}
            <div className="p-4 bg-gradient-to-br from-[#4f3822]/80 to-[#2c1e12]/80 rounded-2xl border border-[#d7a370]/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b87e4f] to-[#7b5435] flex items-center justify-center text-white font-black shadow-lg">
                  {String(currentUserProfile?.nama || "User").charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-white truncate leading-none mb-1">
                    {String(currentUserProfile?.nama || "User")}
                  </p>
                  <div className="flex items-center gap-1">
                    <Shield size={10} className="text-[#d7a217]" />
                    <p className="text-[8px] text-[#e6c3a0] font-black uppercase tracking-widest">
                      {String(currentUserProfile?.level || "Viewer")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tombol Logout - MERAH DENGAN GLASSMORPHISM */}
              <button 
                onClick={onLogout} 
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 font-bold text-[10px] uppercase tracking-widest border group"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: '#ef4444'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
              >
                <LogOut size={14}/> Keluar Akun
              </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
              <Coffee size={60} className="text-[#e6c3a0]" />
            </div>
            <div className="absolute top-20 left-4 opacity-10 pointer-events-none rotate-45">
              <Leaf size={40} className="text-[#d7a370]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;