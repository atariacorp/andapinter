import React from 'react';

const NavItem = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm uppercase tracking-tighter group ${
      active 
        ? 'bg-gradient-to-r from-[#b87e4f] to-[#9a6942] text-white shadow-lg shadow-[#b87e4f]/30 translate-x-1' 
        : 'text-[#e6c3a0]/80 hover:text-white hover:bg-[#7b5435]/50'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-[#d7a370] group-hover:text-white'} transition-colors`}>
      {icon}
    </span>
    {String(label)}
  </button>
);

export default NavItem;