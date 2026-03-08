import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import NotificationBell from '../common/NotificationBell';

// Definisikan palet warna
const colors = {
  tealDark: '#425c5a',
  tealMedium: '#3c5654',
  tealLight: '#e2eceb',
  tealPale: '#cadfdf',
  gold: '#d7a217'
};

const MobileHeader = ({ setIsMobileMenuOpen, branding, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 lg:hidden px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm print:hidden">
      {/* Tombol Menu */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)} 
        className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
      >
        <Menu size={24}/>
      </button>
      
      {/* Logo Aplikasi */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-br from-[#d7a217] to-[#b8860b] rounded flex items-center justify-center text-white font-black text-[10px] uppercase shadow-md">
          {branding.icon}
        </div>
        <span className="text-sm font-black text-slate-800 dark:text-slate-100 italic uppercase">
          {branding.name1}<span className="text-[#d7a217]">{branding.name2}</span>
        </span>
      </div>
      
      {/* Aksi: Notifikasi & Dark Mode */}
      <div className="flex items-center gap-3">
        {/* Lonceng Notifikasi - DENGAN PROPS COLORS */}
        <NotificationBell isDarkMode={isDarkMode} colors={colors} />
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? 
            <Sun size={20} className="text-[#d7a217]" /> : 
            <Moon size={20} className="text-[#d7a217]" />
          }
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;