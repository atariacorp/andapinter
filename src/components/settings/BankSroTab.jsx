import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, Download, Upload, Plus, Search, 
  ChevronLeft, ChevronRight, Edit3, Trash2, 
  X, CheckCircle, AlertCircle, Info 
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
  importProgress
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

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header dengan tombol download template */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2 tracking-tighter">
            <Database size={18} className="text-blue-500"/> BANK DATA KODE REKENING & SRO
          </h2>
          
          <div className="flex gap-2">
            <button 
              onClick={onDownloadTemplate} 
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 flex items-center gap-2"
              disabled={isProcessing}
            >
              <Download size={14}/> TEMPLATE
            </button>
            
            <div className="relative group">
              <input 
                type="file" 
                accept=".csv" 
                onChange={onImport} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isProcessing}
              />
              <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer">
                <Upload size={14}/> IMPORT CSV
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-xl">
                ⚡ 250 data/batch, 0.8s delay
              </div>
            </div>

            {/* Tombol Hapus Semua */}
            {bankSro.length > 0 && (
              <button
                onClick={() => onDeleteAll()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 flex items-center gap-2"
                disabled={isProcessing}
              >
                <Trash2 size={14}/> HAPUS SEMUA ({bankSro.length})
              </button>
            )}
          </div>
        </div>
        
        {/* Informasi Format CSV */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium flex items-start gap-2">
            <Info size={16} className="flex-shrink-0 mt-0.5" />
            <span><strong>Format CSV:</strong> Gunakan titik koma (;) sebagai pemisah. Kolom 1: KODE REKENING, Kolom 2: URAIAN</span>
          </p>
        </div>
      </div>

      {/* Progress Bar Import */}
      {importProgress?.show && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 shadow-sm animate-pulse">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Database size={16}/> PROGRESS IMPORT
            </h3>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {importProgress.current}/{importProgress.total}
            </span>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden mb-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white" 
              style={{ width: `${importProgress.total > 0 ? (importProgress.current / importProgress.total) * 100 : 0}%` }}
            >
              {importProgress.total > 0 && importProgress.current > 0 && 
                `${Math.round((importProgress.current / importProgress.total) * 100)}%`}
            </div>
          </div>
          
          <p className="text-xs text-slate-600 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {importProgress.status}
          </p>
          
          <div className="mt-3 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg">
            <p>✅ {importProgress.successCount || 0} berhasil • ❌ {importProgress.errorCount || 0} gagal</p>
            {importProgress.errors?.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-rose-600">Lihat error</summary>
                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                  {importProgress.errors.slice(0, 10).map((err, i) => (
                    <li key={i} className="text-[8px] text-rose-500">{err}</li>
                  ))}
                  {importProgress.errors.length > 10 && (
                    <li className="text-[8px] text-slate-400">...dan {importProgress.errors.length - 10} error lainnya</li>
                  )}
                </ul>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Form Tambah Manual */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-widest flex items-center gap-2">
          <Plus size={16} className="text-emerald-500" /> TAMBAH DATA SRO MANUAL
        </h3>
        
        <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              Kode Rekening <span className="text-rose-500">*</span>
            </label>
            <input 
              required 
              value={newSro.kode} 
              onChange={(e) => setNewSro({...newSro, kode: e.target.value})} 
              placeholder="Contoh: 5.1.02.01.00001" 
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-mono outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              Uraian Sub Rincian Objek <span className="text-rose-500">*</span>
            </label>
            <input 
              required 
              value={newSro.uraian} 
              onChange={(e) => setNewSro({...newSro, uraian: e.target.value})} 
              placeholder="Contoh: Belanja Alat Tulis Kantor" 
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing} 
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? 'MENYIMPAN...' : <><Plus size={16} /> TAMBAH DATA SRO</>}
          </button>
        </form>
      </div>

      {/* Search Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={filterText} 
            onChange={(e) => setFilterText(e.target.value)} 
            placeholder="Cari berdasarkan kode rekening atau uraian..." 
            className="pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-full outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
          />
        </div>
      </div>

      {/* Tabel Bank SRO */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        
        {/* Header Tabel */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span>📋 Daftar Kode Rekening & SRO</span>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px]">
              {filteredData.length} Data (Ditampilkan {paginatedData.length})
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[9px]">Tampil:</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => { 
                setItemsPerPage(parseInt(e.target.value)); 
                setCurrentPage(1); 
              }} 
              className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded p-1 text-[10px] outline-none text-blue-600 dark:text-blue-400 font-black"
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
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
              <tr>
                <th className="p-4">Kode Rekening</th>
                <th className="p-4">Uraian SRO</th>
                <th className="p-4 text-center" style={{ width: '100px' }}>Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                    
                    {editingSro.id === item.id ? (
                      // Mode Edit
                      <>
                        <td className="p-4">
                          <input 
                            type="text" 
                            value={editingSro.kode} 
                            onChange={(e) => setEditingSro({...editingSro, kode: e.target.value})} 
                            className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg font-mono" 
                            placeholder="Kode" 
                          />
                        </td>
                        <td className="p-4">
                          <input 
                            type="text" 
                            value={editingSro.uraian} 
                            onChange={(e) => setEditingSro({...editingSro, uraian: e.target.value})} 
                            className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg" 
                            placeholder="Uraian" 
                          />
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={handleCancelEdit} 
                              className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                            >
                              <X size={14} />
                            </button>
                            <button 
                              onClick={handleEditSubmit} 
                              disabled={isProcessing} 
                              className="p-1.5 bg-emerald-600 text-white rounded-lg"
                            >
                              <CheckCircle size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Mode Lihat
                      <>
                        <td className="p-4 font-mono text-sm text-slate-800 dark:text-slate-200">
                          {item.kode}
                        </td>
                        <td className="p-4 text-sm text-slate-700 dark:text-slate-300">
                          {item.uraian}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => setEditingSro({ 
                                id: item.id, 
                                kode: item.kode, 
                                uraian: item.uraian 
                              })} 
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => onDelete(item)} 
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg"
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
                  <td colSpan="3" className="p-10 text-center">
                    <Database size={40} className="text-slate-300 mx-auto mb-2"/>
                    <p className="text-slate-400 italic">
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
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data
            </span>
            
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="p-2 bg-white dark:bg-slate-700 border rounded disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              
              <span className="px-3 py-2 text-xs">
                {currentPage} / {totalPages}
              </span>
              
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="p-2 bg-white dark:bg-slate-700 border rounded disabled:opacity-30"
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