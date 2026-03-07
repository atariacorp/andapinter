import React, { useState } from 'react';
import { Layers, Plus, AlertCircle, Zap } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

const TahapTab = ({ 
  tahapList, 
  onAdd, 
  onDelete, 
  onGenerateDefault,
  isProcessing,
  isDarkMode,
  colors 
}) => {
  const [newTahap, setNewTahap] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTahap.trim()) {
      onAdd(newTahap.trim());
      setNewTahap('');
    }
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
              <Layers size={18} style={{ color: colors.gold }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Tambah Tahap Baru
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              required 
              value={newTahap} 
              onChange={e => setNewTahap(e.target.value)} 
              placeholder="Contoh: Pergeseran III" 
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
              {isProcessing ? 'MENYIMPAN...' : 'TAMBAH TAHAP'}
            </button>
          </form>
        </div>
        
        {/* Generate Default */}
        {tahapList.length === 0 && (
          <div className={glassCard}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.gold}20` }}>
                <AlertCircle size={18} style={{ color: colors.gold }} />
              </div>
              <div>
                <p className="text-sm font-bold mb-2" style={{ color: colors.gold }}>
                  Database Tahap Kosong
                </p>
                <p className="text-xs mb-4" style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>
                  Anda dapat menambahkan tahap secara manual atau generate tahap default.
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
                  GENERATE TAHAP DEFAULT
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
          <Layers size={14} className="inline mr-1" style={{ color: colors.gold }} />
          Tahapan akan muncul pada opsi filter dan form verifikasi. SKPD tidak dapat memilih tahap ini secara mandiri.
        </div>
      </div>
      
      {/* Right Column - Data Table */}
      <div className="lg:col-span-7">
        <MasterDataTable
          data={tahapList}
          columns={[
            { 
              field: 'nama', 
              render: (item) => (
                <div className="flex items-center gap-2">
                  <Layers size={14} style={{ color: colors.gold }} />
                  <span className="font-bold uppercase tracking-wider">{item.nama}</span>
                </div>
              )
            }
          ]}
          onDelete={onDelete}
          emptyMessage="Belum ada data Tahap"
          isDarkMode={isDarkMode}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default TahapTab;