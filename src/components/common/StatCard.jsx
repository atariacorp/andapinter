import React from 'react';

const StatCard = ({ title, value, icon, color, darkColor, description }) => (
  <div className={`${color} ${darkColor} p-4 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col gap-2 text-left transition-transform hover:scale-[1.03] active:scale-95 duration-200`}>
    <div className="flex justify-between items-start">
      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100/50 dark:border-slate-700">{icon}</div>
      <p className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{String(value)}</p>
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest leading-none">{String(title)}</p>
      <p className="text-[9px] text-slate-500 dark:text-slate-500 font-bold italic mt-1.5 opacity-70">{String(description)}</p>
    </div>
  </div>
);

export default StatCard;