import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  isDarkMode
}) => {
  
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };

  return (
    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
      <div className="flex items-center gap-2 font-medium" style={{ color: colors.tealMedium }}>
        Baris per halaman: 
        <select 
          value={itemsPerPage} 
          onChange={e => {
            onItemsPerPageChange(parseInt(e.target.value));
            onPageChange(1);
          }} 
          className="bg-transparent border rounded p-1 outline-none cursor-pointer"
          style={{ 
            borderColor: colors.tealPale,
            color: colors.gold
          }}
        >
          {[10, 30, 50, 100].map(v => (
            <option key={v} value={v}>{String(v)}</option>
          ))}
        </select>
        <span className="ml-2" style={{ color: colors.tealMedium }}>
          Total: {totalItems} data
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)} 
          className="p-2 border rounded transition-all hover:scale-105 disabled:opacity-30"
          style={{ 
            borderColor: colors.tealPale,
            color: colors.tealDark
          }}
        >
          <ChevronLeft size={14} />
        </button>
        
        <span className="font-medium px-3 py-2" style={{ color: colors.tealDark }}>
          Halaman {currentPage} dari {totalPages || 1}
        </span>
        
        <button 
          disabled={currentPage === totalPages || totalPages === 0} 
          onClick={() => onPageChange(currentPage + 1)} 
          className="p-2 border rounded transition-all hover:scale-105 disabled:opacity-30"
          style={{ 
            borderColor: colors.tealPale,
            color: colors.tealDark
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;