import React from 'react';

const NavItem = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm uppercase tracking-tighter ${
      active 
        ? 'bg-blue-600 text-white shadow-xl translate-x-1' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800 hover:text-slate-200 dark:hover:bg-slate-800/50'
    }`}
  >
    {icon} {String(label)}
  </button>
);

export default NavItem;