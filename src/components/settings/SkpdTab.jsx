import React, { useState, useMemo } from 'react';
import { Building2, Upload, Download, Plus, Search, Edit3, Check, X, Trash2 } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

const SkpdTab = ({ 
  skpdList, 
  onAdd, 
  onDelete, 
  onEdit,  // <-- TAMBAHKAN PROPS EDIT
  onImport,
  onDownloadTemplate,
  isProcessing,
  isDarkMode,
  colors 
}) => {
  const [newSkpd, setNewSkpd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Filter data berdasarkan pencarian
  const filteredSkpdList = useMemo(() => {
    if (!searchTerm.trim()) return skpdList;
    return skpdList.filter(item => 
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [skpdList, searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSkpd.trim()) {
      onAdd(newSkpd.trim());
      setNewSkpd('');
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item.id);
    setEditValue(item.nama);
  };

  const handleEditSave = (id) => {
    if (editValue.trim() && onEdit) {
      onEdit(id, editValue.trim());
    }
    setEditingItem(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingItem(null);
    setEditValue('');
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
              <Building2 size={18} style={{ color: colors.gold }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Tambah Instansi Baru
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              required 
              value={newSkpd} 
              onChange={e => setNewSkpd(e.target.value)} 
              placeholder="Nama Instansi / SKPD..." 
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
              {isProcessing ? 'MENYIMPAN...' : 'TAMBAH INSTANSI'}
            </button>
          </form>
        </div>
        
        {/* Import Massal */}
        <div className={glassCard}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${colors.gold}20` }}>
              <Upload size={18} style={{ color: colors.gold }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Impor Massal Data
            </h3>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={onDownloadTemplate} 
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                border: `1px solid ${colors.tealPale}`,
                color: colors.tealDark
              }}
            >
              <span className="text-sm font-medium">Download Template CSV</span>
              <Download size={16} style={{ color: colors.gold }} />
            </button>
            
            <div className="relative">
              <input 
                type="file" 
                accept=".csv" 
                onChange={(e) => onImport(e, 'skpd')} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isProcessing}
              />
              <div 
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`,
                  color: 'white'
                }}
              >
                <Upload size={14} /> PILIH FILE CSV
              </div>
            </div>
            
            <p className="text-[9px] italic mt-2" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
              Format: Nama SKPD (gunakan ; sebagai pemisah)
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Column - Data Table dengan Pencarian dan Edit */}
      <div className="lg:col-span-7">
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.gold }} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari instansi..." 
              className={`${glassInput} pl-10`}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            />
          </div>
        </div>
        
        {/* Data Table */}
        <div 
          className="backdrop-blur-md rounded-2xl border h-[500px] flex flex-col overflow-hidden transition-all hover:shadow-xl"
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
            <span style={{ color: colors.tealDark }}>Daftar Instansi</span>
            <span 
              className="px-3 py-1 rounded-full text-[9px] font-bold"
              style={{ 
                backgroundColor: `${colors.gold}20`,
                color: colors.gold
              }}
            >
              {filteredSkpdList.length} Data
            </span>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto p-4 grid grid-cols-1 gap-2 scrollbar-hide flex-1">
            {filteredSkpdList.length > 0 ? (
              filteredSkpdList.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl flex justify-between items-center group transition-all hover:scale-[1.02] hover:shadow-md"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                    border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`
                  }}
                >
                  {editingItem === item.id ? (
                    // Mode Edit
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={`${glassInput} flex-1`}
                        style={{ borderWidth: '1px', borderStyle: 'solid', padding: '0.5rem' }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditSave(item.id)}
                        className="p-2 rounded-lg transition-all hover:scale-110"
                        style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
                        title="Simpan"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="p-2 rounded-lg transition-all hover:scale-110"
                        style={{ backgroundColor: `${colors.tealDark}20`, color: colors.tealDark }}
                        title="Batal"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    // Mode Lihat
                    <>
                      <div className="flex items-center gap-2 flex-1">
                        <Building2 size={14} style={{ color: colors.gold }} />
                        <span style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                          {item.nama}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditClick(item)} 
                          className="p-2 rounded-lg transition-all hover:scale-110"
                          style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={() => onDelete(item)} 
                          className="p-2 rounded-lg transition-all hover:scale-110"
                          style={{ backgroundColor: `${colors.tealDark}20`, color: colors.tealDark }}
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Building2 
                  size={48} 
                  className="mx-auto mb-3 opacity-30"
                  style={{ color: colors.tealMedium }}
                />
                <p className="text-sm italic" style={{ color: colors.tealMedium }}>
                  {searchTerm ? 'Tidak ada instansi yang cocok' : 'Belum ada data SKPD'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkpdTab;