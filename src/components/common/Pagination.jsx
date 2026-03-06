import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems 
}) => {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs transition-colors">
      <div className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400">
        Baris per halaman: 
        <select 
          value={itemsPerPage} 
          onChange={e => {
            onItemsPerPageChange(parseInt(e.target.value));
            onPageChange(1);
          }} 
          className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded p-1 outline-none text-blue-600 dark:text-blue-400 font-black tracking-tighter"
        >
          {[10, 30, 50, 100].map(v => (
            <option key={v} value={v}>{String(v)}</option>
          ))}
        </select>
        <span className="ml-2">
          Total: {totalItems} data
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)} 
          className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm disabled:opacity-30 text-slate-600 dark:text-slate-300"
        >
          <ChevronLeft size={14}/>
        </button>
        
        <span className="font-black text-slate-600 dark:text-slate-300 tracking-tighter">
          Halaman {currentPage} dari {totalPages || 1}
        </span>
        
        <button 
          disabled={currentPage === totalPages || totalPages === 0} 
          onClick={() => onPageChange(currentPage + 1)} 
          className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm disabled:opacity-30 text-slate-600 dark:text-slate-300"
        >
          <ChevronRight size={14}/>
        </button>
      </div>
    </div>
  );
};

export default Pagination;