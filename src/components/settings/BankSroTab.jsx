import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, Download, Upload, Plus, Search, 
  ChevronLeft, ChevronRight, Edit3, Trash2, 
  X, CheckCircle, AlertCircle, FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import { formatFileSize } from '../../utils';

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
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header dengan tombol aksi */}
      <div className={glassCard}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${colors.gold}20` }}>
              <FileSpreadsheet size={24} style={{ color: colors.gold }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Bank Data SRO
              </h2>
              <p className="text-xs mt-1" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                Kelola kode rekening dan uraian Sub Rincian Objek
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onDownloadTemplate} 
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                border: `1px solid ${colors.tealPale}`,
                color: colors.tealDark
              }}
            >
              <Download size={14} style={{ color: colors.gold }} /> TEMPLATE
            </button>
            
            <div className="relative group">
              <input 
                type="file" 
                accept=".csv" 
                onChange={onImport} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isProcessing}
              />
              <div 
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
                  color: 'white'
                }}
              >
                <Upload size={14} /> IMPORT CSV
              </div>
            </div>

            {/* Tombol Hapus Semua */}
            {bankSro.length > 0 && (
              <button
                onClick={onDeleteAll}
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-2"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                  border: `1px solid ${colors.tealPale}`,
                  color: colors.tealDark
                }}
              >
                <Trash2 size={14} style={{ color: colors.gold }} /> HAPUS SEMUA
              </button>
            )}
          </div>
        </div>
        
        {/* Informasi Format CSV */}
        <div 
          className="p-4 rounded-xl text-xs"
          style={{ 
            backgroundColor: `${colors.gold}10`,
            border: `1px solid ${colors.gold}30`
          }}
        >
          <p className="flex items-start gap-2">
            <AlertCircle size={16} style={{ color: colors.gold }} className="shrink-0 mt-0.5" />
            <span style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>
              <strong>Format CSV:</strong> Gunakan titik koma (;) sebagai pemisah. 
              Kolom 1: KODE REKENING, Kolom 2: URAIAN
            </span>
          </p>
        </div>
      </div>

      {/* Progress Bar Import */}
      {importProgress?.show && (
        <div className={glassCard}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: colors.gold }}>
              <RefreshCw size={16} className="animate-spin" />
              Import Data
            </h4>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ 
              backgroundColor: `${colors.gold}20`,
              color: colors.gold
            }}>
              {importProgress.current}/{importProgress.total}
            </span>
          </div>
          
          <div className="w-full h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: colors.tealPale }}>
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(importProgress.current / importProgress.total) * 100}%`,
                background: `linear-gradient(90deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`
              }}
            />
          </div>
          
          <p className="text-xs mb-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>
            {importProgress.status}
          </p>
          
          {importProgress.errors?.length > 0 && (
            <details className="mt-2">
              <summary className="text-xs cursor-pointer" style={{ color: colors.gold }}>
                Lihat {importProgress.errors.length} error
              </summary>
              <div className="mt-2 max-h-32 overflow-y-auto text-[9px] space-y-1">
                {importProgress.errors.slice(0, 5).map((err, i) => (
                  <p key={i} style={{ color: '#ef4444' }}>{err}</p>
                ))}
                {importProgress.errors.length > 5 && (
                  <p style={{ color: colors.tealMedium }}>...dan {importProgress.errors.length - 5} error lainnya</p>
                )}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Form Tambah Manual */}
      <div className={glassCard}>
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: colors.gold }}>
          <Plus size={16} /> Tambah Data SRO Manual
        </h3>
        
        <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Kode Rekening
            </label>
            <input 
              required 
              value={newSro.kode} 
              onChange={(e) => setNewSro({...newSro, kode: e.target.value})} 
              placeholder="Contoh: 5.1.02.01.00001" 
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Uraian SRO
            </label>
            <input 
              required 
              value={newSro.uraian} 
              onChange={(e) => setNewSro({...newSro, uraian: e.target.value})} 
              placeholder="Contoh: Belanja Alat Tulis Kantor" 
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            />
          </div>
          
          <div className="md:col-span-2">
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
              {isProcessing ? 'MENYIMPAN...' : 'TAMBAH DATA SRO'}
            </button>
          </div>
        </form>
      </div>

      {/* Search Filter */}
      <div className={glassCard}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.gold }} />
          <input 
            type="text" 
            value={filterText} 
            onChange={(e) => setFilterText(e.target.value)} 
            placeholder="Cari berdasarkan kode rekening atau uraian..." 
            className={`${glassInput} pl-10`}
            style={{ borderWidth: '1px', borderStyle: 'solid' }}
          />
        </div>
      </div>

      {/* Tabel Bank SRO */}
      <div 
        className="backdrop-blur-md rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-xl"
        style={{ 
          backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
          borderColor: isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale
        }}
      >
        {/* Header Tabel */}
        <div 
          className="p-4 border-b flex justify-between items-center font-bold text-xs uppercase tracking-wider"
          style={{ 
            borderColor: colors.tealPale,
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.2)' : 'rgba(202, 223, 223, 0.3)'
          }}
        >
          <div className="flex items-center gap-4">
            <span style={{ color: colors.tealDark }}>Daftar Kode Rekening</span>
            <span 
              className="px-3 py-1 rounded-full text-[9px] font-bold"
              style={{ 
                backgroundColor: `${colors.gold}20`,
                color: colors.gold
              }}
            >
              {filteredData.length} Data
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[9px]" style={{ color: colors.tealMedium }}>Tampil:</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => { 
                setItemsPerPage(parseInt(e.target.value)); 
                setCurrentPage(1); 
              }} 
              className="bg-transparent border rounded p-1 text-xs outline-none"
              style={{ borderColor: colors.tealPale, color: colors.gold }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        
        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.tealMedium }}>
                <th className="p-4">Kode Rekening</th>
                <th className="p-4">Uraian SRO</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y" style={{ borderColor: colors.tealPale }}>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-opacity-50">
                    
                    {editingSro.id === item.id ? (
                      // Mode Edit
                      <>
                        <td className="p-4">
                          <input 
                            type="text" 
                            value={editingSro.kode} 
                            onChange={(e) => setEditingSro({...editingSro, kode: e.target.value})} 
                            className={`${glassInput} text-xs`}
                            style={{ borderWidth: '1px', borderStyle: 'solid', padding: '0.5rem' }}
                          />
                        </td>
                        <td className="p-4">
                          <input 
                            type="text" 
                            value={editingSro.uraian} 
                            onChange={(e) => setEditingSro({...editingSro, uraian: e.target.value})} 
                            className={`${glassInput} text-xs`}
                            style={{ borderWidth: '1px', borderStyle: 'solid', padding: '0.5rem' }}
                          />
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={handleCancelEdit} 
                              className="p-1.5 rounded-lg transition-all hover:scale-110"
                              style={{ backgroundColor: `${colors.tealDark}20`, color: colors.tealDark }}
                            >
                              <X size={14} />
                            </button>
                            <button 
                              onClick={handleEditSubmit} 
                              disabled={isProcessing} 
                              className="p-1.5 rounded-lg transition-all hover:scale-110"
                              style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
                            >
                              <CheckCircle size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Mode Lihat
                      <>
                        <td className="p-4 font-mono text-sm" style={{ color: colors.gold }}>
                          {item.kode}
                        </td>
                        <td className="p-4 text-sm" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                          {item.uraian}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => setEditingSro({ id: item.id, kode: item.kode, uraian: item.uraian })} 
                              className="p-1.5 rounded-lg transition-all hover:scale-110"
                              style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => onDelete(item)} 
                              className="p-1.5 rounded-lg transition-all hover:scale-110"
                              style={{ backgroundColor: `${colors.tealDark}20`, color: colors.tealDark }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-12 text-center">
                    <Database size={40} className="mx-auto mb-3 opacity-30" style={{ color: colors.tealMedium }} />
                    <p className="text-sm italic" style={{ color: colors.tealMedium }}>
                      {filterText ? 'Tidak ada data yang cocok' : 'Belum ada data SRO'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div 
            className="p-4 border-t flex justify-between items-center"
            style={{ borderColor: colors.tealPale }}
          >
            <span className="text-xs" style={{ color: colors.tealMedium }}>
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length}
            </span>
            
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="p-2 rounded-lg transition-all disabled:opacity-30 hover:scale-110"
                style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
              >
                <ChevronLeft size={14} />
              </button>
              
              <span className="px-3 py-2 text-xs" style={{ color: colors.tealDark }}>
                {currentPage} / {totalPages}
              </span>
              
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="p-2 rounded-lg transition-all disabled:opacity-30 hover:scale-110"
                style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankSroTab;