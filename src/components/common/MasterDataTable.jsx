import React from 'react';
import { Trash2, Edit3 } from 'lucide-react';

const MasterDataTable = ({ 
  data, 
  columns, 
  onDelete, 
  onEdit,
  emptyMessage = "Belum ada data",
  showActions = true
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[600px] flex flex-col overflow-hidden">
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
        <span>Daftar Data</span>
        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px]">
          {data.length} Data
        </span>
      </div>
      
      <div className="overflow-y-auto p-4 grid grid-cols-1 gap-2 scrollbar-hide">
        {data.length > 0 ? (
          data.map((item) => (
            <div 
              key={item.id} 
              className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex justify-between items-center group hover:border-blue-200 dark:hover:border-blue-600 shadow-sm transition-all"
            >
              <div className="flex-1">
                {columns.map((col, idx) => (
                  <div key={idx} className={idx === 0 ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-xs text-slate-600 dark:text-slate-400'}>
                    {col.render ? col.render(item) : item[col.field]}
                  </div>
                ))}
              </div>
              
              {showActions && (
                <div className="flex gap-2">
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(item)} 
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => onDelete(item)} 
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 italic text-sm mt-10">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default MasterDataTable;