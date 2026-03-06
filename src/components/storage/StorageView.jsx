import React, { useState, useEffect } from 'react';
import { 
  Database, HardDrive, Download, Upload, RefreshCw, 
  Trash2, AlertTriangle, CheckCircle, X, FileText,
  Calendar, FolderOpen, PieChart, BarChart2
} from 'lucide-react';
import { formatFileSize, IS_CANVAS } from '../../utils';

const StorageView = ({ 
  addNotification, 
  setDeleteConfirm,
  isProcessing,
  setIsProcessing,
  user,
  storage,
  checkStorageUsage,
  backupAllFiles,
  restoreFromBackup,
  cleanupOrphanFiles
}) => {
  const [loading, setLoading] = useState(false);
  const [storageStats, setStorageStats] = useState({
    used: '0 MB',
    total: '5 GB',
    percentage: 0,
    files: 0,
    folders: {},
    recentFiles: []
  });
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Load data saat komponen mount
  useEffect(() => {
    if (user && !IS_CANVAS) {
      handleRefresh();
    }
  }, [user]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const stats = await checkStorageUsage();
      setStorageStats(stats);
      addNotification("Data storage berhasil dimuat", "success");
    } catch (error) {
      console.error("Error loading storage:", error);
      addNotification(`Gagal memuat data: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    if (!window.confirm('Proses backup akan mendownload daftar file (bukan file aslinya). Lanjutkan?')) return;
    
    setBackupLoading(true);
    try {
      await backupAllFiles();
    } catch (error) {
      console.error("Backup error:", error);
      addNotification(`Gagal backup: ${error.message}`, "error");
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestoreFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
      addNotification("Hanya file JSON yang diperbolehkan", "error");
      e.target.value = null;
      return;
    }
    
    setRestoreFile(file);
    setShowRestoreModal(true);
    e.target.value = null;
  };

  const handleRestore = async () => {
    if (!restoreFile) return;
    
    const confirmMessage = "Proses restore akan mengupload ulang semua file ke storage. File dengan nama yang sama akan ditimpa. Lanjutkan?";
    if (!window.confirm(confirmMessage)) return;
    
    setRestoreLoading(true);
    setRestoreProgress(0);
    
    try {
      await restoreFromBackup(restoreFile, (progress) => {
        setRestoreProgress(progress);
      });
      addNotification("Restore selesai!", "success");
      setShowRestoreModal(false);
      setRestoreFile(null);
      handleRefresh();
    } catch (error) {
      console.error("Restore error:", error);
      addNotification(`Gagal restore: ${error.message}`, "error");
    } finally {
      setRestoreLoading(false);
      setRestoreProgress(0);
    }
  };

  const handleCleanup = () => {
    if (window.confirm('Hapus semua file yang tidak terhubung dengan usulan?')) {
      cleanupOrphanFiles();
    }
  };

  // Filter data berdasarkan tahun/bulan
  const getFilteredFolders = () => {
    if (selectedYear === 'all') return storageStats.folders;
    
    const yearData = storageStats.folders[selectedYear];
    if (!yearData) return {};
    
    if (selectedMonth === 'all') {
      return { [selectedYear]: yearData };
    }
    
    return {
      [selectedYear]: {
        [selectedMonth]: yearData[selectedMonth] || 0
      }
    };
  };

  const getYears = () => {
    return Object.keys(storageStats.folders || {}).sort((a, b) => b.localeCompare(a));
  };

  const getMonths = () => {
    if (selectedYear === 'all' || !storageStats.folders[selectedYear]) return [];
    return Object.keys(storageStats.folders[selectedYear]).sort((a, b) => b.localeCompare(a));
  };

  const getTotalSize = () => {
    let total = 0;
    const folders = getFilteredFolders();
    
    Object.values(folders).forEach(yearData => {
      if (typeof yearData === 'object') {
        Object.values(yearData).forEach(monthSize => {
          total += monthSize;
        });
      } else {
        total += yearData;
      }
    });
    
    return total;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Database size={24} className="text-blue-500" />
            Manajemen Storage
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitor dan backup file penyimpanan Firebase Storage
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading || IS_CANVAS}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'MEMUAT...' : 'REFRESH'}
        </button>
      </div>

      {/* Canvas Mode Warning */}
      {IS_CANVAS && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">Mode Canvas Terdeteksi</h4>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 leading-relaxed">
              Fitur storage tidak tersedia di lingkungan preview Canvas. Data yang ditampilkan adalah simulasi.
            </p>
          </div>
        </div>
      )}
      
      {/* Statistik Storage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card Penggunaan */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <HardDrive size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Storage</p>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{storageStats.used}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-slate-500">Terpakai</span>
              <span className="text-blue-600">{storageStats.percentage.toFixed(1)}%</span>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  storageStats.percentage > 90 ? 'bg-rose-500' : 
                  storageStats.percentage > 70 ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${storageStats.percentage}%` }}
              ></div>
            </div>
            
            <p className="text-[9px] text-slate-400 mt-2">
              Kuota: {storageStats.total} • {storageStats.files || 0} file
            </p>
          </div>
        </div>
        
        {/* Card Aksi Backup */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm md:col-span-2">
          <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 mb-4 uppercase flex items-center gap-2">
            <Download size={16} /> Backup & Restore
          </h3>
          
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Download daftar semua file untuk backup ke server lokal. File akan di-download dalam format JSON.
            </p>
            
            <div className="flex gap-3 flex-wrap">
              {/* Tombol Backup */}
              <button
                onClick={handleBackup}
                disabled={backupLoading || IS_CANVAS}
                className="flex-1 min-w-[150px] px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {backupLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    MEMBACKUP...
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    BACKUP
                  </>
                )}
              </button>
              
              {/* Tombol Restore */}
              <div className="relative flex-1 min-w-[150px]">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={restoreLoading || IS_CANVAS}
                />
                <div className={`w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  (restoreLoading || IS_CANVAS) ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <Upload size={14} />
                  RESTORE
                </div>
              </div>
              
              {/* Tombol Cleanup */}
              <button
                onClick={handleCleanup}
                disabled={IS_CANVAS}
                className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs uppercase shadow-lg disabled:opacity-50"
              >
                Bersihkan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 mb-4 uppercase flex items-center gap-2">
          <BarChart2 size={16} /> Filter Data
        </h3>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedMonth('all');
              }}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800"
            >
              <option value="all">Semua Tahun</option>
              {getYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          {selectedYear !== 'all' && (
            <div className="flex items-center gap-2">
              <FolderOpen size={16} className="text-slate-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800"
              >
                <option value="all">Semua Bulan</option>
                {getMonths().map(month => {
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
                  return (
                    <option key={month} value={month}>
                      {monthNames[parseInt(month) - 1] || month}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          
          <div className="ml-auto">
            <span className="text-sm font-bold text-blue-600">
              Total: {formatFileSize(getTotalSize())}
            </span>
          </div>
        </div>
      </div>

      {/* Detail per Tahun/Bulan */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
            Detail Penggunaan Storage
          </h3>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw size={32} className="animate-spin mx-auto mb-3 text-blue-500" />
              <p className="text-slate-400 italic">Memuat data storage...</p>
            </div>
          ) : Object.keys(storageStats.folders).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(getFilteredFolders())
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([year, months]) => {
                  const yearTotal = Object.values(months).reduce((a, b) => a + b, 0);
                  
                  return (
                    <div key={year} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">{year}</h4>
                        <span className="text-xs font-bold text-blue-600">
                          {formatFileSize(yearTotal)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(months)
                          .sort((a, b) => b[0].localeCompare(a[0]))
                          .map(([month, size]) => {
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
                            const monthName = monthNames[parseInt(month) - 1] || month;
                            
                            return (
                              <div key={`${year}-${month}`} className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                                <p className="text-[9px] font-bold text-slate-500">{monthName}</p>
                                <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                                  {formatFileSize(size)}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-center text-slate-400 italic py-8">
              {IS_CANVAS 
                ? 'Mode Canvas: Data storage tidak tersedia' 
                : 'Belum ada data storage. Klik Refresh untuk memuat.'}
            </p>
          )}
        </div>
      </div>

      {/* Modal Restore */}
      {showRestoreModal && restoreFile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={() => setShowRestoreModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600">
              <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                <Upload size={18} /> PREVIEW RESTORE
              </h3>
            </div>
            
            {/* Body */}
            <div className="flex-grow overflow-y-auto p-6">
              {restoreLoading ? (
                <div className="text-center py-8">
                  <RefreshCw size={32} className="animate-spin mx-auto mb-3 text-blue-500" />
                  <p className="text-slate-600 dark:text-slate-400">Memproses restore...</p>
                  <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${restoreProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{Math.round(restoreProgress)}%</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    File backup: <span className="font-bold">{restoreFile.name}</span>
                  </p>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Informasi Backup</p>
                    <div className="space-y-1 text-xs">
                      <p><span className="font-medium">Nama File:</span> {restoreFile.name}</p>
                      <p><span className="font-medium">Ukuran:</span> {(restoreFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                    <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                      <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Perhatian:</strong> Proses restore akan mengupload ulang semua file ke storage.
                        File dengan nama yang sama akan ditimpa. Pastikan Anda memiliki koneksi internet yang stabil.
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setRestoreFile(null);
                }}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase"
              >
                Batal
              </button>
              <button
                onClick={handleRestore}
                disabled={restoreLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase flex items-center gap-2"
              >
                {restoreLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    MEMULAI...
                  </>
                ) : (
                  'MULAI RESTORE'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageView;