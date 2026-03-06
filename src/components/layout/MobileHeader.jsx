import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';

const MobileHeader = ({ setIsMobileMenuOpen, branding, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 lg:hidden px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm print:hidden">
      <button 
        onClick={() => setIsMobileMenuOpen(true)} 
        className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
      >
        <Menu size={24}/>
      </button>
      
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-black text-[10px] uppercase">
          {branding.icon}
        </div>
        <span className="text-sm font-black text-slate-800 dark:text-slate-100 italic uppercase">
          {branding.name1}<span className="text-blue-500">{branding.name2}</span>
        </span>
      </div>
      
      <button 
        onClick={toggleDarkMode} 
        className="p-2 text-slate-600 dark:text-slate-300"
      >
        {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
      </button>
    </header>
  );
};

export default MobileHeader;