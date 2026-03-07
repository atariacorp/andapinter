import React from 'react';
import { Trash2, Database } from 'lucide-react';

const RincianSRORow = ({ 
  item, 
  index, 
  onItemChange, 
  onRemove, 
  onOpenBankSro,
  isLastItem,
  isDarkMode,
  colors
}) => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-12 gap-2 p-4 md:p-2 rounded-xl border items-center transition-all hover:shadow-md"
      style={{ 
        backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.2)' : 'rgba(255, 255, 255, 0.5)',
        borderColor: colors.tealPale
      }}
    >
      
      {/* Kode Rekening */}
      <div className="md:col-span-3">
        <label className="md:hidden text-[10px] font-bold mb-1 block" style={{ color: colors.tealMedium }}>
          Kode Rekening
        </label>
        <input 
          required 
          placeholder="Contoh: 5.1.02.xx" 
          value={item.kodeRekening} 
          onChange={(e) => onItemChange(index, 'kodeRekening', e.target.value)} 
          className="w-full p-2 rounded-lg text-xs outline-none transition-all focus:ring-2 font-mono"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
            border: `1px solid ${colors.tealPale}`,
            color: colors.tealDark,
            focusRing: colors.gold
          }}
        />
      </div>
      
      {/* Uraian SRO */}
      <div className="md:col-span-3">
        <label className="md:hidden text-[10px] font-bold mb-1 block" style={{ color: colors.tealMedium }}>
          Uraian SRO
        </label>
        <input 
          required 
          placeholder="Nama Sub Rincian Objek..." 
          value={item.uraian} 
          onChange={(e) => onItemChange(index, 'uraian', e.target.value)} 
          className="w-full p-2 rounded-lg text-xs outline-none transition-all focus:ring-2"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
            border: `1px solid ${colors.tealPale}`,
            color: colors.tealDark,
            focusRing: colors.gold
          }}
        />
      </div>
      
      {/* Pagu Semula */}
      <div className="md:col-span-2">
        <label className="md:hidden text-[10px] font-bold mb-1 block" style={{ color: colors.tealMedium }}>
          Pagu Semula
        </label>
        <input 
          required 
          type="number" 
          placeholder="0" 
          value={item.paguSebelum} 
          onChange={(e) => onItemChange(index, 'paguSebelum', parseFloat(e.target.value || 0))} 
          className="w-full p-2 rounded-lg text-xs outline-none transition-all focus:ring-2 text-right"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
            border: `1px solid ${colors.tealPale}`,
            color: colors.tealDark,
            focusRing: colors.gold
          }}
        />
      </div>
      
      {/* Pagu Sesudah */}
      <div className="md:col-span-2">
        <label className="md:hidden text-[10px] font-bold mb-1 block" style={{ color: colors.tealMedium }}>
          Pagu Sesudah
        </label>
        <input 
          required 
          type="number" 
          placeholder="0" 
          value={item.paguSesudah} 
          onChange={(e) => onItemChange(index, 'paguSesudah', parseFloat(e.target.value || 0))} 
          className="w-full p-2 rounded-lg text-xs outline-none transition-all focus:ring-2 text-right font-bold"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
            border: `1px solid ${colors.gold}`,
            color: colors.gold,
            focusRing: colors.gold
          }}
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
          className="p-2 rounded-lg transition-all hover:scale-110"
          style={{ 
            backgroundColor: `${colors.gold}20`,
            color: colors.gold
          }}
          title="Pilih dari Bank Data"
        >
          <Database size={16} />
        </button>
        
        <button 
          type="button" 
          onClick={() => onRemove(item.id)} 
          disabled={isLastItem} 
          className="p-2 rounded-lg transition-all hover:scale-110 disabled:opacity-30"
          style={{ 
            backgroundColor: isLastItem ? 'transparent' : `${colors.tealDark}20`,
            color: colors.tealDark
          }}
          title="Hapus Rincian"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default RincianSRORow;