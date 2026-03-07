import React, { useState } from 'react';
import { CalendarDays, Plus, AlertCircle, Zap } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

const TahunTab = ({ 
  tahunList, 
  onAdd, 
  onDelete, 
  onGenerateDefault,
  isProcessing,
  isDarkMode,
  colors 
}) => {
  const [newTahun, setNewTahun] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTahun.trim()) return;

    // Validasi format tahun (4 digit)
    const tahunRegex = /^\d{4}$/;
    if (!tahunRegex.test(newTahun.trim())) {
      alert("Format tahun tidak valid. Gunakan 4 digit angka (contoh: 2024)");
      return;
    }

    // Cek duplikasi
    const existing = tahunList.find(t => t.tahun === newTahun.trim() || t.nama === newTahun.trim());
    if (existing) {
      alert(`Tahun ${newTahun.trim()} sudah ada dalam database`);
      return;
    }

    onAdd(newTahun.trim());
    setNewTahun('');
  };

  // Glass card style
  const glassCard = `backdrop-blur-md rounded-2xl border transition-all hover:shadow-xl p-6 ${
    isDarkMode 
      ? 'bg-[#3c5654]/30 border-[#d7a217]/20' 
      : 'bg-white/70 border-[#cadfdf]'
  }`;

  const glassInput = `w-full p-3 rounded-xl text-sm outline-none transition-all focus:ring-2 ${
    isDarkMode 
      ? 'bg-[#3c5654]/30 border-[#d7a217]/30 text-[#e2eceb] focus:ring-[#d7a217]/50' 
      : 'bg-white/70 border-[#cadfdf] text-[#425c5a] focus:ring-[#d7a217]/50'
  }`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column - Forms */}
      <div className="lg:col-span-5 space-y-5">
        
        {/* Form Tambah Manual */}
        <div className={glassCard}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${colors.gold}20` }}>
              <CalendarDays size={18} style={{ color: colors.gold }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Tambah Tahun Anggaran
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              required 
              type="number" 
              min="2000" 
              max="2100" 
              value={newTahun} 
              onChange={e => setNewTahun(e.target.value)} 
              placeholder="Contoh: 2024" 
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            />
            
            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
                color: 'white'
              }}
            >
              <Plus size={14} />
              {isProcessing ? 'MENAMBAH...' : 'TAMBAH TAHUN'}
            </button>
          </form>
        </div>
        
        {/* Generate Default */}
        {tahunList.length === 0 && (
          <div className={glassCard}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.gold}20` }}>
                <AlertCircle size={18} style={{ color: colors.gold }} />
              </div>
              <div>
                <p className="text-sm font-bold mb-2" style={{ color: colors.gold }}>
                  Database Tahun Kosong
                </p>
                <p className="text-xs mb-4" style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>
                  Klik tombol di bawah untuk membuat tahun default (2024-2026).
                </p>
                <button 
                  onClick={onGenerateDefault} 
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
                    color: 'white'
                  }}
                >
                  <Zap size={14} />
                  GENERATE TAHUN DEFAULT
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Info */}
        <div 
          className="p-4 rounded-xl text-xs italic"
          style={{ 
            backgroundColor: `${colors.gold}10`,
            border: `1px solid ${colors.gold}30`,
            color: isDarkMode ? colors.tealLight : colors.tealMedium
          }}
        >
          <CalendarDays size={14} className="inline mr-1" style={{ color: colors.gold }} />
          Tahun anggaran akan muncul di dropdown filter pada halaman Dashboard dan Daftar Berkas.
        </div>
      </div>
      
      {/* Right Column - Data Table */}
      <div className="lg:col-span-7">
        <MasterDataTable
          data={tahunList}
          columns={[
            { 
              field: 'tahun', 
              render: (item) => (
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} style={{ color: colors.gold }} />
                  <span className="font-bold">{item.tahun || item.nama}</span>
                </div>
              )
            }
          ]}
          onDelete={onDelete}
          emptyMessage="Belum ada data Tahun Anggaran"
          isDarkMode={isDarkMode}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default TahunTab;