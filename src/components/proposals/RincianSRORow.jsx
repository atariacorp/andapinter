import React from 'react';
import { Trash2, Database } from 'lucide-react';

const RincianSRORow = ({ 
  item, 
  index, 
  onItemChange, 
  onRemove, 
  onOpenBankSro,
  isLastItem 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-slate-50 dark:bg-slate-900/50 p-4 md:p-2 rounded-xl border border-slate-100 dark:border-slate-700 items-center">
      
      {/* Kode Rekening */}
      <div className="md:col-span-3">
        <label className="md:hidden text-[10px] font-bold text-slate-400 mb-1 block">
          Kode Rekening
        </label>
        <input 
          required 
          placeholder="Contoh: 5.1.02.xx" 
          value={item.kodeRekening} 
          onChange={(e) => onItemChange(index, 'kodeRekening', e.target.value)} 
          className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500" 
        />
      </div>
      
      {/* Uraian SRO */}
      <div className="md:col-span-3">
        <label className="md:hidden text-[10px] font-bold text-slate-400 mb-1 block">
          Uraian SRO
        </label>
        <input 
          required 
          placeholder="Nama Sub Rincian Objek..." 
          value={item.uraian} 
          onChange={(e) => onItemChange(index, 'uraian', e.target.value)} 
          className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500" 
        />
      </div>
      
      {/* Pagu Semula */}
      <div className="md:col-span-2">
        <label className="md:hidden text-[10px] font-bold text-slate-400 mb-1 block">
          Pagu Semula
        </label>
        <input 
          required 
          type="number" 
          placeholder="0" 
          value={item.paguSebelum} 
          onChange={(e) => onItemChange(index, 'paguSebelum', parseFloat(e.target.value || 0))} 
          className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none text-right focus:ring-1 focus:ring-emerald-500" 
        />
      </div>
      
      {/* Pagu Sesudah */}
      <div className="md:col-span-2">
        <label className="md:hidden text-[10px] font-bold text-slate-400 mb-1 block">
          Pagu Sesudah
        </label>
        <input 
          required 
          type="number" 
          placeholder="0" 
          value={item.paguSesudah} 
          onChange={(e) => onItemChange(index, 'paguSesudah', parseFloat(e.target.value || 0))} 
          className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-800 font-bold text-blue-600 dark:text-blue-400 outline-none text-right focus:ring-1 focus:ring-emerald-500" 
        />
      </div>
      
      {/* Aksi */}
      <div className="md:col-span-2 flex justify-center gap-2 mt-2 md:mt-0">
        <button 
          type="button" 
          onClick={() => {
            sessionStorage.setItem('editingSroIndex', index);
            onOpenBankSro();
          }} 
          className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors" 
          title="Pilih dari Bank Data"
        >
          <Database size={16} />
        </button>
        
        <button 
          type="button" 
          onClick={() => onRemove(item.id)} 
          disabled={isLastItem} 
          className="p-2 text-slate-400 hover:text-rose-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg disabled:opacity-30 transition-colors" 
          title="Hapus Rincian"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default RincianSRORow;