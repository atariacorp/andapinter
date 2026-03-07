import React, { useState } from 'react';
import { Users, Plus, UserCog, Briefcase, Hash, Trash2 } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

const TapdTab = ({ 
  tapdList, 
  onAdd, 
  onDelete, 
  isProcessing,
  isDarkMode,
  colors 
}) => {
  const [newTapd, setNewTapd] = useState({ nip: '', nama: '', jabatan: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTapd.nama.trim() || !newTapd.nip.trim() || !newTapd.jabatan.trim()) {
      alert("Lengkapi semua isian form TAPD");
      return;
    }
    onAdd(newTapd);
    setNewTapd({ nip: '', nama: '', jabatan: '' });
  };

  const handleChange = (field, value) => {
    setNewTapd(prev => ({ ...prev, [field]: value }));
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
      
      {/* Left Column - Form */}
      <div className="lg:col-span-5 space-y-5">
        
        {/* Form Tambah TAPD */}
        <div className={glassCard}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${colors.gold}20` }}>
              <UserCog size={18} style={{ color: colors.gold }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Tambah Anggota TAPD
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* NIP */}
            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <Hash size={12} style={{ color: colors.gold }} />
                NIP / ID
              </label>
              <input 
                required 
                value={newTapd.nip} 
                onChange={e => handleChange('nip', e.target.value)} 
                placeholder="Contoh: 198001012005011001" 
                className={glassInput}
                style={{ borderWidth: '1px', borderStyle: 'solid' }}
              />
            </div>
            
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <Users size={12} style={{ color: colors.gold }} />
                Nama Lengkap
              </label>
              <input 
                required 
                value={newTapd.nama} 
                onChange={e => handleChange('nama', e.target.value)} 
                placeholder="Nama Pejabat beserta Gelar..." 
                className={glassInput}
                style={{ borderWidth: '1px', borderStyle: 'solid' }}
              />
            </div>
            
            {/* Jabatan */}
            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <Briefcase size={12} style={{ color: colors.gold }} />
                Jabatan
              </label>
              <input 
                required 
                value={newTapd.jabatan} 
                onChange={e => handleChange('jabatan', e.target.value)} 
                placeholder="Contoh: KEPALA DINAS" 
                className={glassInput}
                style={{ borderWidth: '1px', borderStyle: 'solid' }}
              />
            </div>
            
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
              {isProcessing ? 'MENYIMPAN...' : 'TAMBAH ANGGOTA TAPD'}
            </button>
          </form>
        </div>
        
        {/* Informasi */}
        <div 
          className="p-5 rounded-xl text-xs"
          style={{ 
            backgroundColor: `${colors.gold}10`,
            border: `1px solid ${colors.gold}30`,
          }}
        >
          <div className="flex items-start gap-3">
            <Briefcase size={18} style={{ color: colors.gold }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold mb-2" style={{ color: colors.gold }}>Informasi TAPD</p>
              <p style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>
                Nama-nama ini akan muncul sebagai kolom tanda tangan verifikator pada Berita Acara (BA) cetak.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Data Table */}
      <div className="lg:col-span-7">
        <div 
          className="backdrop-blur-md rounded-2xl border h-[600px] flex flex-col overflow-hidden transition-all hover:shadow-xl"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale
          }}
        >
          {/* Header */}
          <div 
            className="p-4 border-b flex justify-between items-center font-bold text-xs uppercase tracking-wider"
            style={{ 
              borderColor: colors.tealPale,
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.2)' : 'rgba(202, 223, 223, 0.3)'
            }}
          >
            <span style={{ color: colors.tealDark }}>Daftar Anggota TAPD</span>
            <span 
              className="px-3 py-1 rounded-full text-[9px] font-bold"
              style={{ 
                backgroundColor: `${colors.gold}20`,
                color: colors.gold
              }}
            >
              {tapdList.length} Anggota
            </span>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto p-4 grid grid-cols-1 gap-3 scrollbar-hide flex-1">
            {tapdList.length > 0 ? (
              tapdList.map(item => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl flex justify-between items-center group transition-all hover:scale-[1.02] hover:shadow-md"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                    border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
                      >
                        {item.nama?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: colors.tealDark }}>
                          {item.nama}
                        </p>
                        <p className="text-xs font-medium" style={{ color: colors.tealMedium }}>
                          {item.jabatan}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] font-mono" style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>
                      NIP: {item.nip}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => onDelete(item)} 
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ 
                      backgroundColor: `${colors.tealDark}20`,
                      color: colors.tealDark
                    }}
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users 
                  size={48} 
                  className="mx-auto mb-3 opacity-30"
                  style={{ color: colors.tealMedium }}
                />
                <p className="text-sm italic" style={{ color: colors.tealMedium }}>
                  Belum ada anggota TAPD
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapdTab;