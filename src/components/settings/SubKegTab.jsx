import React, { useState, useMemo, useEffect } from 'react';
import { Database, Upload, Download, Plus, Search, Edit3, Check, X, Trash2, FolderTree } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

// --- Komponen Partikel Emas Mengambang (VISUAL ENHANCED) ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 1.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 25 + 15,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-[#f9d423] to-[#d7a217] animate-float-particle mix-blend-screen"
          style={{
            width: `${p.size}px`, height: `${p.size}px`,
            left: `${p.left}%`, top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.animDuration}s`,
            animationDelay: `${p.animDelay}s`,
            boxShadow: `0 0 ${p.size * 4}px ${p.size * 1.5}px rgba(215, 162, 23, 0.4)`,
          }}
        />
      ))}
    </div>
  );
};

const SubKegTab = ({ 
  subKegList, 
  onAdd, 
  onDelete, 
  onEdit, 
  onImport,
  onDownloadTemplate,
  isProcessing,
  isDarkMode,
  colors 
}) => {
  const [newSubKeg, setNewSubKeg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Filter data berdasarkan pencarian
  const filteredSubKegList = useMemo(() => {
    if (!searchTerm.trim()) return subKegList;
    return subKegList.filter(item => 
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subKegList, searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSubKeg.trim()) {
      onAdd(newSubKeg.trim());
      setNewSubKeg('');
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

  // --- Advanced Glassmorphism Styles ---
  const glassCard = `backdrop-blur-2xl border transition-all duration-700 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_40px_-10px_rgba(215,162,23,0.25)] relative overflow-hidden group p-6 md:p-8 rounded-3xl ${
    isDarkMode 
      ? 'bg-gradient-to-br from-[#3c5654]/40 to-[#2a3f3d]/60 border-[#cadfdf]/10' 
      : 'bg-gradient-to-br from-white/70 to-white/40 border-white/60'
  }`;

  const glassInput = `w-full p-4 rounded-xl text-sm md:text-base outline-none transition-all duration-500 focus:ring-2 focus:ring-[#d7a217]/50 focus:shadow-[0_0_20px_rgba(215,162,23,0.2)] appearance-none ${
    isDarkMode 
      ? 'bg-[#1e2e2d]/50 border-[#cadfdf]/20 text-[#e2eceb] focus:bg-[#1e2e2d]/80 placeholder-[#cadfdf]/40' 
      : 'bg-white/50 border-white/80 text-[#425c5a] focus:bg-white/90 placeholder-[#3c5654]/50'
  }`;

  return (
    <div className="relative animate-in fade-in duration-500">
      
      {/* Background Decorative Ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-3xl">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-[#d7a217] blur-[100px] opacity-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[#425c5a] blur-[120px] opacity-10 animate-pulse-slow"></div>
      </div>
      
      <FloatingGoldParticles />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
        
        {/* Left Column - Forms */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8 animate-slide-up-fade">
          
          {/* Form Tambah Manual */}
          <div className={glassCard}>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#d7a217]/20 to-transparent border border-[#d7a217]/30 shadow-[inset_0_0_15px_rgba(215,162,23,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <FolderTree size={24} style={{ color: colors.gold }} className="drop-shadow-md" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Tambah Sub Kegiatan
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="relative group/input">
                <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                <input 
                  required 
                  value={newSubKeg} 
                  onChange={e => setNewSubKeg(e.target.value)} 
                  placeholder="Ketik Nama Sub Kegiatan Baru..." 
                  className={`${glassInput} relative z-10`}
                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-[0.15em] shadow-[0_10px_25px_-5px_rgba(215,162,23,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(215,162,23,0.6)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-[length:200%_auto] hover:bg-[position:right_center]"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.gold} 0%, #e6b32a 50%, #b8860b 100%)`,
                  color: 'white'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
                <Plus size={18} className="drop-shadow-md transition-transform group-hover/btn:rotate-90 duration-500" />
                <span className="relative z-10 drop-shadow-md">
                  {isProcessing ? 'MENYIMPAN DATA...' : 'SIMPAN SUB KEGIATAN'}
                </span>
              </button>
            </form>
          </div>
          
          {/* Import Massal */}
          <div className={`${glassCard} animate-slide-up-fade animation-delay-100`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#425c5a]/20 to-transparent border border-[#425c5a]/30 shadow-[inset_0_0_15px_rgba(66,92,90,0.2)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <Upload size={24} style={{ color: colors.gold }} className="drop-shadow-md" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Impor Massal Data
              </h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <button 
                onClick={onDownloadTemplate} 
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md border group/dl"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.4)' : 'rgba(255,255,255,0.8)',
                  borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : colors.tealPale,
                  color: isDarkMode ? colors.tealLight : colors.tealDark
                }}
              >
                <span className="text-sm font-bold tracking-wide">Download Template CSV</span>
                <div className="p-1.5 rounded-lg bg-[#d7a217]/10 group-hover/dl:bg-[#d7a217]/20 transition-colors">
                  <Download size={18} style={{ color: colors.gold }} className="group-hover/dl:-translate-y-1 transition-transform" />
                </div>
              </button>
              
              <div className="relative group/up">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={(e) => onImport(e, 'sub_keg')} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isProcessing}
                />
                <div 
                  className="w-full py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer transition-all duration-500 group-hover/up:scale-[1.02] shadow-lg relative overflow-hidden"
                  style={{ 
                    background: isDarkMode ? `linear-gradient(135deg, ${colors.tealMedium} 0%, ${colors.tealDark} 100%)` : `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`,
                    color: 'white'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/up:animate-shimmer"></div>
                  <Upload size={18} className="drop-shadow-md group-hover/up:-translate-y-1 transition-transform" /> 
                  <span className="relative z-10 drop-shadow-md">PILIH FILE CSV</span>
                </div>
              </div>
              
              <div className="p-3 rounded-xl border border-dashed text-center" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.2)' : 'rgba(60,86,84,0.3)', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.5)' }}>
                <p className="text-[10px] md:text-xs font-medium" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                  <strong>Format:</strong> Nama Sub Kegiatan (gunakan pemisah <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">;</code>)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Data Table dengan Pencarian dan Edit */}
        <div className="lg:col-span-7 flex flex-col h-full animate-slide-up-fade animation-delay-200">
          
          {/* Search Bar */}
          <div className="mb-6 relative group/search">
            <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/search:opacity-20 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within/search:text-[#d7a217]" style={{ color: isDarkMode ? 'rgba(202,223,223,0.5)' : 'rgba(60,86,84,0.5)' }} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari master sub kegiatan..." 
                className={`${glassInput} pl-12 py-4 rounded-2xl font-bold tracking-wide`}
                style={{ borderWidth: '1px', borderStyle: 'solid' }}
              />
            </div>
          </div>
          
          {/* Data Table */}
          <div 
            className="backdrop-blur-2xl rounded-3xl border h-[600px] flex flex-col overflow-hidden transition-all duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(26, 43, 41, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)'
            }}
          >
            {/* Header Table */}
            <div 
              className="p-5 md:p-6 border-b flex justify-between items-center backdrop-blur-md relative z-10 shadow-sm"
              style={{ 
                borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)',
                backgroundColor: isDarkMode ? 'rgba(20, 30, 29, 0.4)' : 'rgba(240, 245, 245, 0.6)'
              }}
            >
              <span className="font-black text-sm md:text-base uppercase tracking-[0.2em]" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Daftar Sub Kegiatan
              </span>
              <span 
                className="px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest shadow-inner border"
                style={{ 
                  backgroundColor: `${colors.gold}15`,
                  color: colors.gold,
                  borderColor: `${colors.gold}30`
                }}
              >
                {filteredSubKegList.length} Terdaftar
              </span>
            </div>
            
            {/* Content Table */}
            <div className="overflow-y-auto p-5 grid grid-cols-1 gap-3 custom-scrollbar flex-1 relative z-10">
              {filteredSubKegList.length > 0 ? (
                filteredSubKegList.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 md:p-5 rounded-2xl flex justify-between items-center group/item transition-all duration-500 hover:scale-[1.01] hover:shadow-md relative overflow-hidden"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.2)' : 'rgba(255, 255, 255, 0.6)',
                      border: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.05)' : 'rgba(66,92,90,0.1)'}`
                    }}
                  >
                    {/* Hover Highlight Bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d7a217] scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-center"></div>

                    {editingItem === item.id ? (
                      // Mode Edit
                      <div className="flex-1 flex items-center gap-3 animate-in fade-in duration-300">
                        <div className="relative flex-1 group/edit">
                          <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-20 rounded-xl"></div>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className={`${glassInput} relative z-10 font-bold`}
                            style={{ borderWidth: '1px', borderStyle: 'solid', padding: '0.75rem 1rem' }}
                            autoFocus
                          />
                        </div>
                        <button
                          onClick={() => handleEditSave(item.id)}
                          className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(215,162,23,0.4)]"
                          style={{ backgroundColor: `${colors.gold}20`, color: colors.gold, border: `1px solid ${colors.gold}40` }}
                          title="Simpan Perubahan"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                          style={{ backgroundColor: 'rgba(225, 29, 72, 0.1)', color: '#f43f5e', border: '1px solid rgba(225, 29, 72, 0.2)' }}
                          title="Batalkan"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      // Mode Lihat
                      <>
                        <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent group-hover/item:border-[#d7a217]/30 transition-colors duration-300 shrink-0">
                            <Database size={18} style={{ color: colors.gold }} />
                          </div>
                          <span 
                            className="font-bold text-sm md:text-base truncate" 
                            style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}
                          >
                            {item.nama}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover/item:translate-x-0">
                          <button 
                            onClick={() => handleEditClick(item)} 
                            className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md border"
                            style={{ 
                              backgroundColor: `${colors.gold}15`, 
                              color: colors.gold,
                              borderColor: `${colors.gold}30`
                            }}
                            title="Edit Sub Kegiatan"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => onDelete(item)} 
                            className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md border"
                            style={{ 
                              backgroundColor: 'rgba(225, 29, 72, 0.1)', 
                              color: '#f43f5e',
                              borderColor: 'rgba(225, 29, 72, 0.2)'
                            }}
                            title="Hapus Sub Kegiatan"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-60 animate-in fade-in">
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-[#d7a217] blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
                    <div className="relative flex items-center justify-center w-full h-full rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md">
                      <FolderTree size={40} style={{ color: colors.gold }} />
                    </div>
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-widest mb-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                    Data Kosong
                  </h4>
                  <p className="text-sm font-medium tracking-wide text-center max-w-xs" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                    {searchTerm ? 'Tidak ada sub kegiatan yang sesuai dengan kata kunci pencarian.' : 'Belum ada data Master Sub Kegiatan terdaftar di sistem.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations & Custom Scrollbar */}
      <style jsx>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.3); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.6); }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0; }
          20% { opacity: var(--tw-opacity, 0.8); transform: scale(1.2) rotate(45deg); }
          80% { opacity: var(--tw-opacity, 0.8); transform: scale(0.8) rotate(90deg); }
          100% { transform: translateY(-120vh) translateX(100px) scale(1) rotate(180deg); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-shimmer { animation: shimmer 2.5s infinite linear; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        .animate-slide-up-fade { animation: slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
};

export default SubKegTab;