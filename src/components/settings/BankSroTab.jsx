import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, Download, Upload, Plus, Search, 
  ChevronLeft, ChevronRight, Edit3, Trash2, 
  X, CheckCircle, AlertCircle, FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import { formatFileSize } from '../../utils';

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

const BankSroTab = ({ 
  bankSro, 
  onAdd, 
  onEdit, 
  onDelete, 
  onDeleteAll,
  onImport,
  onDownloadTemplate,
  isProcessing,
  importProgress,
  isDarkMode,
  colors 
}) => {
  // Local states
  const [newSro, setNewSro] = useState({ kode: '', uraian: '' });
  const [editingSro, setEditingSro] = useState({ id: null, kode: '', uraian: '' });
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Filter data
  const filteredData = useMemo(() => {
    return bankSro.filter(item => 
      (item.kode?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (item.uraian?.toLowerCase() || '').includes(filterText.toLowerCase())
    );
  }, [bankSro, filterText]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset ke halaman 1 ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText]);

  // Handlers
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newSro.kode.trim() && newSro.uraian.trim()) {
      onAdd(newSro);
      setNewSro({ kode: '', uraian: '' });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingSro.id && editingSro.kode.trim() && editingSro.uraian.trim()) {
      onEdit(editingSro);
      setEditingSro({ id: null, kode: '', uraian: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingSro({ id: null, kode: '', uraian: '' });
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
    <div className="relative space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Background Decorative Ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-3xl">
        <div className="absolute top-[5%] right-[10%] w-80 h-80 bg-[#d7a217] blur-[120px] opacity-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[20%] left-[5%] w-96 h-96 bg-[#425c5a] blur-[140px] opacity-10 animate-pulse-slow"></div>
      </div>
      
      <FloatingGoldParticles />

      {/* Header dengan tombol aksi */}
      <div className={`${glassCard} animate-slide-up-fade`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#d7a217]/20 to-transparent border border-[#d7a217]/30 shadow-[inset_0_0_15px_rgba(215,162,23,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <FileSpreadsheet size={28} style={{ color: colors.gold }} className="drop-shadow-md" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest drop-shadow-sm" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Bank Data SRO
              </h2>
              <p className="text-sm md:text-base font-semibold mt-1 opacity-70" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Kelola master kode rekening dan uraian Sub Rincian Objek.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full xl:w-auto">
            {/* Tombol Download Template */}
            <button 
              onClick={onDownloadTemplate} 
              disabled={isProcessing}
              className="flex-1 xl:flex-none px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 border shadow-sm group/btn"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.4)' : 'white',
                border: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.1)' : colors.tealPale}`,
                color: isDarkMode ? colors.tealLight : colors.tealDark
              }}
            >
              <Download size={16} style={{ color: colors.gold }} className="group-hover/btn:-translate-y-1 transition-transform" /> 
              <span>Template</span>
            </button>
            
            {/* Tombol Import CSV */}
            <div className="flex-1 xl:flex-none relative group/up">
              <input 
                type="file" 
                accept=".csv" 
                onChange={onImport} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isProcessing}
              />
              <div 
                className="w-full px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] shadow-[0_5px_15px_rgba(66,92,90,0.3)] flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`,
                  color: 'white'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/up:animate-shimmer pointer-events-none"></div>
                <Upload size={16} className="drop-shadow-md group-hover/up:-translate-y-1 transition-transform" /> 
                <span className="relative z-10">Import CSV</span>
              </div>
            </div>

            {/* Tombol Hapus Semua */}
            {bankSro.length > 0 && (
              <button
                onClick={onDeleteAll}
                className="flex-1 xl:flex-none px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_5px_15px_rgba(225,29,72,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 border group/del"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(225, 29, 72, 0.1)' : 'rgba(225, 29, 72, 0.05)',
                  border: '1px solid rgba(225, 29, 72, 0.3)',
                  color: isDarkMode ? '#f43f5e' : '#e11d48'
                }}
              >
                <Trash2 size={16} className="group-hover/del:animate-pulse" /> 
                <span>Hapus Semua</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Informasi Format CSV */}
        <div 
          className="p-5 md:p-6 rounded-2xl border border-dashed relative overflow-hidden group/info z-10"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
            borderColor: isDarkMode ? 'rgba(215, 162, 23, 0.3)' : 'rgba(215, 162, 23, 0.5)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#d7a217]/5 to-transparent pointer-events-none"></div>
          <div className="flex items-start gap-3 relative z-10">
            <AlertCircle size={20} style={{ color: colors.gold }} className="shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm font-semibold leading-relaxed tracking-wide" style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>
              <strong className="uppercase tracking-widest" style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}>Format CSV Import:</strong> Gunakan pemisah titik koma (<code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">;</code>). 
              <br className="hidden md:block" />
              Kolom 1: <span className="font-mono text-[#d7a217]">KODE REKENING</span>, Kolom 2: <span className="font-mono text-[#d7a217]">URAIAN OBJEK</span>
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar Import (ECharts Aesthetic) */}
      {importProgress?.show && (
        <div className={`${glassCard} animate-in fade-in zoom-in-95 duration-300`}>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h4 className="text-base font-black uppercase tracking-widest flex items-center gap-3" style={{ color: colors.gold }}>
              <RefreshCw size={20} className="animate-spin drop-shadow-md" />
              Sistem Sinkronisasi Data
            </h4>
            <span className="text-xs md:text-sm font-black px-4 py-1.5 rounded-lg shadow-inner border" style={{ 
              backgroundColor: `${colors.gold}15`,
              color: colors.gold,
              borderColor: `${colors.gold}30`
            }}>
              {importProgress.current} / {importProgress.total} Proses
            </span>
          </div>
          
          <div className="relative w-full h-4 rounded-full overflow-hidden mb-3 shadow-inner bg-black/10 dark:bg-white/5 p-[2px] z-10">
            <div 
              className="h-full rounded-full transition-all duration-300 relative shadow-[0_0_15px_rgba(215,162,23,0.5)]"
              style={{ 
                width: `${(importProgress.current / importProgress.total) * 100}%`,
                background: `linear-gradient(90deg, ${colors.gold} 0%, #f9d423 100%)`
              }}
            >
              <div className="absolute inset-0 bg-white/30 -translate-x-full animate-shimmer"></div>
              <div className="absolute top-0 right-0 w-2 h-full bg-white rounded-full blur-[2px] opacity-80"></div>
            </div>
          </div>
          
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest relative z-10" style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>
            Status: <span style={{ color: colors.gold }}>{importProgress.status}</span>
          </p>
          
          {importProgress.errors?.length > 0 && (
            <details className="mt-4 relative z-10 group/details">
              <summary className="text-xs md:text-sm font-black uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2" style={{ color: '#ef4444' }}>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Tinjau {importProgress.errors.length} Log Error
              </summary>
              <div className="mt-3 p-4 rounded-xl max-h-40 overflow-y-auto custom-scrollbar border" style={{ backgroundColor: 'rgba(225,29,72,0.05)', borderColor: 'rgba(225,29,72,0.2)' }}>
                {importProgress.errors.slice(0, 5).map((err, i) => (
                  <p key={i} className="text-[10px] md:text-xs font-mono mb-1.5 pb-1.5 border-b border-rose-500/10 last:border-0 last:mb-0 last:pb-0" style={{ color: '#ef4444' }}>• {err}</p>
                ))}
                {importProgress.errors.length > 5 && (
                  <p className="text-xs font-bold mt-2 pt-2 border-t border-rose-500/20" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                    ...dan {importProgress.errors.length - 5} log error lainnya disembunyikan.
                  </p>
                )}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Grid Layout untuk Form Tambah & Pencarian */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
        
        {/* Form Tambah Manual */}
        <div className="lg:col-span-5">
          <div className={`${glassCard} animate-slide-up-fade animation-delay-100 h-full flex flex-col`}>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10" style={{ color: colors.gold }}>
              <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[0_0_15px_rgba(215,162,23,0.15)]">
                <Plus size={20} /> 
              </div>
              Tambah SRO Manual
            </h3>
            
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-5 relative z-10 flex-1">
              <div className="space-y-2 relative group/input">
                <label className="text-xs font-black uppercase tracking-widest ml-1 opacity-80" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  Kode Rekening
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                  <input 
                    required 
                    value={newSro.kode} 
                    onChange={(e) => setNewSro({...newSro, kode: e.target.value})} 
                    placeholder="Contoh: 5.1.02.01.00001" 
                    className={`${glassInput} font-mono tracking-wider relative z-10`}
                    style={{ borderWidth: '1px', borderStyle: 'solid' }}
                  />
                </div>
              </div>
              
              <div className="space-y-2 relative group/input flex-1">
                <label className="text-xs font-black uppercase tracking-widest ml-1 opacity-80" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  Uraian Detail SRO
                </label>
                <div className="relative h-[calc(100%-1.5rem)]">
                  <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                  <textarea 
                    required 
                    value={newSro.uraian} 
                    onChange={(e) => setNewSro({...newSro, uraian: e.target.value})} 
                    placeholder="Contoh: Belanja Alat Tulis Kantor" 
                    className={`${glassInput} relative z-10 resize-none h-full min-h-[100px]`}
                    style={{ borderWidth: '1px', borderStyle: 'solid' }}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full mt-2 py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-[0.15em] shadow-[0_10px_25px_-5px_rgba(215,162,23,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(215,162,23,0.6)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-[length:200%_auto] hover:bg-[position:right_center]"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.gold} 0%, #e6b32a 50%, #b8860b 100%)`,
                  color: 'white'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer pointer-events-none"></div>
                <Database size={18} className="drop-shadow-md transition-transform group-hover/btn:scale-110 duration-500" />
                <span className="relative z-10 drop-shadow-md">
                  {isProcessing ? 'MENYIMPAN DATA...' : 'DAFTARKAN SRO'}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Tabel Data & Pencarian */}
        <div className="lg:col-span-7 flex flex-col gap-6 animate-slide-up-fade animation-delay-200">
          
          {/* Search Filter */}
          <div className={`${glassCard} !p-5 md:!p-6`}>
            <div className="relative group/search">
              <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/search:opacity-20 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within/search:text-[#d7a217]" style={{ color: isDarkMode ? 'rgba(202,223,223,0.5)' : 'rgba(60,86,84,0.5)' }} size={20} />
                <input 
                  type="text" 
                  value={filterText} 
                  onChange={(e) => setFilterText(e.target.value)} 
                  placeholder="Cari berdasarkan kode rekening atau uraian objek..." 
                  className={`${glassInput} pl-12 py-4 font-bold tracking-wide`}
                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                />
              </div>
            </div>
          </div>

          {/* Tabel Bank SRO */}
          <div 
            className="backdrop-blur-2xl rounded-3xl border h-[600px] flex flex-col overflow-hidden transition-all duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative z-0"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(26, 43, 41, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)'
            }}
          >
            {/* Header Tabel */}
            <div 
              className="p-5 md:p-6 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4 backdrop-blur-md relative z-10 shadow-sm"
              style={{ 
                borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)',
                backgroundColor: isDarkMode ? 'rgba(20, 30, 29, 0.4)' : 'rgba(240, 245, 245, 0.6)'
              }}
            >
              <div className="flex items-center gap-4">
                <span className="font-black text-sm md:text-base uppercase tracking-[0.2em]" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  Daftar Kode Rekening
                </span>
                <span 
                  className="px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest shadow-inner border"
                  style={{ 
                    backgroundColor: `${colors.gold}15`,
                    color: colors.gold,
                    borderColor: `${colors.gold}30`
                  }}
                >
                  {filteredData.length} Ditemukan
                </span>
              </div>
              
              <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-1.5 rounded-xl border border-black/10 dark:border-white/10 shadow-inner">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70 px-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>Tampil:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { 
                    setItemsPerPage(parseInt(e.target.value)); 
                    setCurrentPage(1); 
                  }} 
                  className="bg-transparent border-none outline-none font-bold cursor-pointer pr-2 appearance-none text-center"
                  style={{ color: colors.gold }}
                >
                  <option value="10" className="bg-white dark:bg-[#1e2e2d]">10</option>
                  <option value="20" className="bg-white dark:bg-[#1e2e2d]">20</option>
                  <option value="50" className="bg-white dark:bg-[#1e2e2d]">50</option>
                  <option value="100" className="bg-white dark:bg-[#1e2e2d]">100</option>
                </select>
              </div>
            </div>
            
            {/* Tabel Content */}
            <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar relative z-10">
              <table className="w-full text-left min-w-[600px] border-collapse">
                <thead className="sticky top-0 z-20">
                  <tr className="text-[10px] md:text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-xl" 
                      style={{ 
                        color: isDarkMode ? colors.tealPale : colors.tealMedium,
                        backgroundColor: isDarkMode ? 'rgba(26, 43, 41, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)'}`
                      }}>
                    <th className="p-5 pl-8 w-[30%]">Kode Rekening</th>
                    <th className="p-5 w-[55%]">Uraian SRO</th>
                    <th className="p-5 pr-8 text-center w-[15%]">Manajemen</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y transition-colors duration-500" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.05)' : 'rgba(202,223,223,0.3)' }}>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, idx) => (
                      <tr 
                        key={item.id || idx} 
                        className={`transition-all duration-500 hover:bg-gradient-to-r hover:from-transparent ${isDarkMode ? 'hover:via-white/5' : 'hover:via-[#d7a217]/5'} hover:to-transparent group relative`}
                      >
                        {/* Highlight border on hover */}
                        <td className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d7a217] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></td>

                        {editingSro.id === item.id ? (
                          // Mode Edit Full Row
                          <td colSpan="3" className="p-4 md:p-5">
                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl border shadow-inner animate-in fade-in" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)' }}>
                              <div className="w-full sm:w-1/3 relative group/edit">
                                <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-20 rounded-xl"></div>
                                <input 
                                  type="text" 
                                  value={editingSro.kode} 
                                  onChange={(e) => setEditingSro({...editingSro, kode: e.target.value})} 
                                  className={`${glassInput} relative z-10 font-mono tracking-wider font-bold`}
                                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                                />
                              </div>
                              <div className="w-full sm:w-flex-1 relative group/edit">
                                <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-20 rounded-xl"></div>
                                <input 
                                  type="text" 
                                  value={editingSro.uraian} 
                                  onChange={(e) => setEditingSro({...editingSro, uraian: e.target.value})} 
                                  className={`${glassInput} relative z-10 font-bold`}
                                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                                />
                              </div>
                              <div className="w-full sm:w-auto flex justify-center sm:justify-end gap-3 shrink-0">
                                <button 
                                  onClick={handleCancelEdit} 
                                  className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] border"
                                  style={{ backgroundColor: 'rgba(225, 29, 72, 0.1)', color: '#f43f5e', borderColor: 'rgba(225, 29, 72, 0.2)' }}
                                  title="Batalkan Perubahan"
                                >
                                  <X size={18} />
                                </button>
                                <button 
                                  onClick={handleEditSubmit} 
                                  disabled={isProcessing} 
                                  className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(215,162,23,0.4)] disabled:opacity-50"
                                  style={{ backgroundColor: `${colors.gold}20`, color: colors.gold, border: `1px solid ${colors.gold}40` }}
                                  title="Simpan Pembaruan"
                                >
                                  <CheckCircle size={18} />
                                </button>
                              </div>
                            </div>
                          </td>
                        ) : (
                          // Mode Lihat
                          <>
                            <td className="p-5 pl-8 align-middle">
                              <code className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs md:text-sm font-mono font-bold tracking-widest shadow-inner inline-block" style={{ color: colors.gold }}>
                                {item.kode}
                              </code>
                            </td>
                            <td className="p-5 align-middle">
                              <span className="text-sm md:text-base font-bold leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300" style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}>
                                {item.uraian}
                              </span>
                            </td>
                            <td className="p-5 pr-8 text-center align-middle">
                              <div className="flex justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                <button 
                                  onClick={() => setEditingSro({ id: item.id, kode: item.kode, uraian: item.uraian })} 
                                  className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(215,162,23,0.3)] border bg-black/5 dark:bg-white/5"
                                  style={{ borderColor: `${colors.gold}40` }}
                                  title="Edit SRO"
                                >
                                  <Edit3 size={16} className="text-[#d7a217]" />
                                </button>
                                <button 
                                  onClick={() => onDelete(item)} 
                                  className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(225,29,72,0.3)] border bg-black/5 dark:bg-white/5 group/del"
                                  style={{ borderColor: 'rgba(225, 29, 72, 0.3)' }}
                                  title="Hapus SRO"
                                >
                                  <Trash2 size={16} className="text-rose-500 group-hover/del:animate-pulse" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-24 text-center">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                          <div className="absolute inset-0 bg-[#d7a217] blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
                          <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-[#d7a217]/10 to-transparent border border-[#d7a217]/30 backdrop-blur-md shadow-inner">
                            <Database size={48} className="text-[#d7a217]" />
                          </div>
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-[0.2em] mb-2" style={{ color: colors.gold }}>Database SRO Kosong</h4>
                        <p className="text-base font-medium opacity-70" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                          {filterText ? 'Tidak ada kode rekening atau uraian yang cocok dengan pencarian.' : 'Belum ada data Sub Rincian Objek terdaftar dalam sistem.'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Premium */}
            {filteredData.length > 0 && (
              <div 
                className="p-5 md:p-6 border-t flex flex-col sm:flex-row justify-between items-center gap-5 relative z-10 backdrop-blur-3xl"
                style={{ 
                  borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)',
                  backgroundColor: isDarkMode ? 'rgba(26, 43, 41, 0.4)' : 'rgba(255, 255, 255, 0.4)'
                }}
              >
                <span className="text-xs font-black uppercase tracking-widest opacity-70" style={{ color: isDarkMode ? '#cadfdf' : '#3c5654' }}>
                  Halaman Data {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>
                
                <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-2 rounded-2xl border border-black/10 dark:border-white/10 shadow-inner backdrop-blur-md">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(p => p - 1)} 
                    className="p-3 rounded-xl transition-all duration-300 hover:bg-[#d7a217]/20 hover:text-[#d7a217] hover:shadow-md disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:hover:shadow-none"
                    style={{ color: colors.gold }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="px-6 py-2 rounded-xl bg-white/50 dark:bg-black/40 shadow-sm border border-white/20 dark:border-black/20">
                    <span className="text-xs md:text-sm font-black uppercase tracking-widest text-[#425c5a] dark:text-[#cadfdf]">
                      Hal <span className="text-[#d7a217] text-base mx-1">{currentPage}</span> / {totalPages}
                    </span>
                  </div>
                  
                  <button 
                    disabled={currentPage === totalPages || totalPages === 0} 
                    onClick={() => setCurrentPage(p => p + 1)} 
                    className="p-3 rounded-xl transition-all duration-300 hover:bg-[#d7a217]/20 hover:text-[#d7a217] hover:shadow-md disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:hover:shadow-none"
                    style={{ color: colors.gold }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations & Custom Scrollbar */}
      <style jsx>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; margin: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.4); border-radius: 10px; transition: all 0.3s; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.8); }

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

export default BankSroTab;