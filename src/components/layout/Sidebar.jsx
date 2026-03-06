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
  X
} from 'lucide-react';
import NavItem from '../common/NavItem';

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
  return (
    <>
      {/* Overlay untuk mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm print:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
      
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 flex flex-col z-50 transition-transform lg:static lg:translate-x-0 border-r border-slate-800 dark:border-slate-800/50 print:hidden ${
        isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        
        {/* Header Sidebar */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {branding.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt={`${branding.name1}${branding.name2} Logo`}
                className="w-9 h-9 object-contain rounded-xl"
              />
            ) : (
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30 uppercase">
                {branding.icon}
              </div>
            )}
            
            <span className="text-xl font-black tracking-tight text-white italic uppercase">
              {branding.name1}<span className="text-blue-500">{branding.name2}</span>
            </span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-grow overflow-y-auto scrollbar-hide">
          <NavItem 
            active={view === 'dashboard'} 
            icon={<LayoutDashboard size={18}/>} 
            label="Dashboard" 
            onClick={() => { 
              setView('dashboard'); 
              setIsMobileMenuOpen(false); 
            }} 
          />
          
          <NavItem 
            active={view === 'list' || view === 'detail' || view === 'add-proposal'} 
            icon={<FileText size={18}/>} 
            label="Daftar Berkas" 
            onClick={() => { 
              setView('list'); 
              setIsMobileMenuOpen(false); 
            }} 
          />
          
          <NavItem 
            active={view === 'panduan'} 
            icon={<BookOpen size={18}/>} 
            label="Panduan Sistem" 
            onClick={() => { 
              setView('panduan'); 
              setIsMobileMenuOpen(false); 
            }} 
          />
          
          {/* Storage Management - Hanya untuk Admin */}
          {currentUserProfile?.level === 'Admin' && (
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
          
          {/* History Log - Hanya untuk Admin */}
          {currentUserProfile?.level === 'Admin' && (
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
        <div className="p-4 border-t border-slate-800 space-y-3">
          
          {/* Settings - Hanya untuk Admin */}
          {currentUserProfile?.level === 'Admin' && (
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
          
          {/* Tombol Notifikasi */}
          <button 
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className="w-full flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-bold text-xs uppercase tracking-widest relative"
          >
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-yellow-400" />
              <span>Notifikasi</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[8px] rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode} 
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-bold text-xs uppercase tracking-widest"
          >
            {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-blue-400" />}
            {isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          </button>

          {/* Profile & Logout */}
          <div className="p-4 bg-slate-800/40 dark:bg-slate-900/50 rounded-2xl text-left border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black shadow-inner uppercase">
                {String(currentUserProfile?.nama || "User").charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black truncate leading-none mb-1">
                  {String(currentUserProfile?.nama || "User")}
                </p>
                <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">
                  {String(currentUserProfile?.level || "Viewer")}
                </p>
              </div>
            </div>

            <button 
              onClick={onLogout} 
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors font-bold text-[10px] uppercase tracking-widest"
            >
              <LogOut size={14}/> Keluar Akun
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;