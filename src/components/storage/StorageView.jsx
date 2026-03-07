import React, { useState, useEffect } from 'react';
import { 
  Database, HardDrive, Download, Upload, RefreshCw, 
  Trash2, AlertTriangle, CheckCircle, X, FileText,
  Calendar, FolderOpen, PieChart, BarChart2, Server,
  Shield, Clock, Archive
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
  cleanupOrphanFiles,
  isDarkMode
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

  // Palet warna teal & gold
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealLight: '#e2eceb',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };

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

  // Glass card style
  const glassCard = `backdrop-blur-md rounded-2xl border transition-all hover:shadow-xl ${
    isDarkMode 
      ? 'bg-[#3c5654]/30 border-[#d7a217]/20' 
      : 'bg-white/70 border-[#cadfdf]'
  }`;

  return (
    <div className="space-y-6 animate-in fade-in relative">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: colors.gold,
            opacity: 0.03,
            top: '-10%',
            right: '-5%'
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            backgroundColor: colors.tealDark,
            opacity: 0.03,
            bottom: '-10%',
            left: '-5%'
          }}
        />
      </div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <h1 
            className="text-2xl font-bold tracking-tight flex items-center gap-2"
            style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
          >
            <Server size={24} style={{ color: colors.gold }} />
            Manajemen Storage
          </h1>
          <p 
            className="text-sm mt-1"
            style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}
          >
            Monitor dan backup file penyimpanan Firebase Storage
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading || IS_CANVAS}
          className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
          style={{ 
            background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
            color: 'white'
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'MEMUAT...' : 'REFRESH DATA'}
        </button>
      </div>

      {/* Canvas Mode Warning */}
      {IS_CANVAS && (
        <div 
          className={`${glassCard} p-5 rounded-xl flex items-start gap-4 relative z-10`}
          style={{ backgroundColor: `${colors.gold}10` }}
        >
          <div 
            className="p-3 rounded-xl shrink-0"
            style={{ backgroundColor: `${colors.gold}20` }}
          >
            <AlertTriangle size={20} style={{ color: colors.gold }} />
          </div>
          <div>
            <h4 className="text-sm font-bold" style={{ color: colors.gold }}>Mode Canvas Terdeteksi</h4>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: colors.tealMedium }}>
              Fitur storage tidak tersedia di lingkungan preview Canvas. Data yang ditampilkan adalah simulasi.
            </p>
          </div>
        </div>
      )}
      
      {/* Statistik Storage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Card Penggunaan */}
        <div className={glassCard}>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: `${colors.gold}20` }}
              >
                <HardDrive size={28} style={{ color: colors.gold }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.tealMedium }}>
                  Total Storage
                </p>
                <p 
                  className="text-3xl font-bold"
                  style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
                >
                  {storageStats.used}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-medium">
                <span style={{ color: colors.tealMedium }}>Terpakai</span>
                <span style={{ color: colors.gold }}>{storageStats.percentage.toFixed(1)}%</span>
              </div>
              
              <div 
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: isDarkMode ? colors.tealMedium : colors.tealPale }}
              >
                <div 
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${storageStats.percentage}%`,
                    background: `linear-gradient(90deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`
                  }}
                />
              </div>
              
              <div className="flex justify-between text-[10px]">
                <span style={{ color: colors.tealMedium }}>
                  <Archive size={12} className="inline mr-1" />
                  {storageStats.files || 0} file
                </span>
                <span style={{ color: colors.tealMedium }}>
                  <Shield size={12} className="inline mr-1" />
                  Kuota: {storageStats.total}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Aksi Backup */}
        <div className={`${glassCard} md:col-span-2`}>
          <div className="p-6">
            <h3 
              className="text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2"
              style={{ color: colors.gold }}
            >
              <Download size={18} /> Backup & Restore
            </h3>
            
            <div className="space-y-5">
              <p className="text-xs" style={{ color: colors.tealMedium }}>
                Download daftar semua file untuk backup ke server lokal. File akan di-download dalam format JSON.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Tombol Backup */}
                <button
                  onClick={handleBackup}
                  disabled={backupLoading || IS_CANVAS}
                  className="px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`,
                    color: 'white'
                  }}
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
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={restoreLoading || IS_CANVAS}
                  />
                  <div 
                    className={`w-full px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer ${
                      (restoreLoading || IS_CANVAS) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{ 
                      backgroundColor: colors.gold,
                      color: 'white'
                    }}
                  >
                    <Upload size={14} />
                    RESTORE
                  </div>
                </div>
                
                {/* Tombol Cleanup */}
                <button
                  onClick={handleCleanup}
                  disabled={IS_CANVAS}
                  className="px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ 
                    backgroundColor: isDarkMode ? colors.tealMedium : colors.tealPale,
                    color: isDarkMode ? colors.tealLight : colors.tealDark
                  }}
                >
                  <Trash2 size={14} />
                  CLEANUP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className={glassCard}>
        <div className="p-6">
          <h3 
            className="text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2"
            style={{ color: colors.gold }}
          >
            <BarChart2 size={18} /> Filter Data
          </h3>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Calendar size={16} style={{ color: colors.gold }} />
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedMonth('all');
                }}
                className="px-3 py-2 rounded-lg text-sm outline-none transition-all focus:ring-2"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                  border: `1px solid ${colors.tealPale}`,
                  color: isDarkMode ? colors.tealLight : colors.tealDark,
                  focusRing: colors.gold
                }}
              >
                <option value="all">Semua Tahun</option>
                {getYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {selectedYear !== 'all' && (
              <div className="flex items-center gap-3">
                <FolderOpen size={16} style={{ color: colors.gold }} />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm outline-none transition-all focus:ring-2"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                    border: `1px solid ${colors.tealPale}`,
                    color: isDarkMode ? colors.tealLight : colors.tealDark,
                    focusRing: colors.gold
                  }}
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
              <span 
                className="text-sm font-bold px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: `${colors.gold}20`,
                  color: colors.gold
                }}
              >
                Total: {formatFileSize(getTotalSize())}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail per Tahun/Bulan */}
      <div className={glassCard}>
        <div 
          className="p-4 border-b"
          style={{ borderColor: colors.tealPale }}
        >
          <h3 
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: colors.tealDark }}
          >
            Detail Penggunaan Storage
          </h3>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw size={40} className="animate-spin mx-auto mb-4" style={{ color: colors.gold }} />
              <p className="text-sm italic" style={{ color: colors.tealMedium }}>Memuat data storage...</p>
            </div>
          ) : Object.keys(storageStats.folders).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(getFilteredFolders())
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([year, months]) => {
                  const yearTotal = Object.values(months).reduce((a, b) => a + b, 0);
                  
                  return (
                    <div 
                      key={year} 
                      className="rounded-xl p-5 transition-all hover:shadow-md"
                      style={{ 
                        backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.2)' : 'rgba(202, 223, 223, 0.2)',
                        border: `1px solid ${colors.tealPale}`
                      }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 
                          className="text-base font-bold flex items-center gap-2"
                          style={{ color: colors.gold }}
                        >
                          <Calendar size={16} />
                          {year}
                        </h4>
                        <span 
                          className="text-sm font-bold px-3 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${colors.gold}20`,
                            color: colors.gold
                          }}
                        >
                          {formatFileSize(yearTotal)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {Object.entries(months)
                          .sort((a, b) => b[0].localeCompare(a[0]))
                          .map(([month, size]) => {
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
                            const monthName = monthNames[parseInt(month) - 1] || month;
                            
                            return (
                              <div 
                                key={`${year}-${month}`} 
                                className="p-3 rounded-lg text-center transition-all hover:scale-105"
                                style={{ 
                                  backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                                  border: `1px solid ${colors.tealPale}`
                                }}
                              >
                                <p className="text-[10px] font-bold uppercase mb-1" style={{ color: colors.gold }}>
                                  {monthName}
                                </p>
                                <p className="text-xs font-bold" style={{ color: colors.tealDark }}>
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
            <div className="text-center py-12">
              <Database size={48} className="mx-auto mb-4 opacity-30" style={{ color: colors.tealMedium }} />
              <p className="text-sm italic" style={{ color: colors.tealMedium }}>
                {IS_CANVAS 
                  ? 'Mode Canvas: Data storage tidak tersedia' 
                  : 'Belum ada data storage. Klik Refresh untuk memuat.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Restore dengan Glassmorphism */}
      {showRestoreModal && restoreFile && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
          onClick={() => setShowRestoreModal(false)}
        >
          <div 
            className="max-w-2xl w-full rounded-2xl overflow-hidden flex flex-col"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${colors.tealPale}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div 
              className="p-6 border-b flex justify-between items-center"
              style={{ 
                borderColor: colors.tealPale,
                background: `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`
              }}
            >
              <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <Upload size={18} /> PREVIEW RESTORE
              </h3>
              <button 
                onClick={() => setShowRestoreModal(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-grow overflow-y-auto p-6">
              {restoreLoading ? (
                <div className="text-center py-8">
                  <RefreshCw size={40} className="animate-spin mx-auto mb-4" style={{ color: colors.gold }} />
                  <p className="text-sm mb-4" style={{ color: colors.tealDark }}>Memproses restore...</p>
                  <div 
                    className="w-full h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.tealPale }}
                  >
                    <div 
                      className="h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${restoreProgress}%`,
                        background: `linear-gradient(90deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`
                      }}
                    />
                  </div>
                  <p className="text-xs mt-2 font-bold" style={{ color: colors.gold }}>
                    {Math.round(restoreProgress)}%
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm mb-4" style={{ color: colors.tealDark }}>
                    File backup: <span className="font-bold" style={{ color: colors.gold }}>{restoreFile.name}</span>
                  </p>
                  
                  <div 
                    className="p-4 rounded-xl mb-4"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(202, 223, 223, 0.3)',
                      border: `1px solid ${colors.tealPale}`
                    }}
                  >
                    <p className="text-[10px] font-bold uppercase mb-2" style={{ color: colors.gold }}>
                      Informasi Backup
                    </p>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium" style={{ color: colors.tealMedium }}>Nama File:</span> <span style={{ color: colors.tealDark }}>{restoreFile.name}</span></p>
                      <p><span className="font-medium" style={{ color: colors.tealMedium }}>Ukuran:</span> <span style={{ color: colors.tealDark }}>{(restoreFile.size / 1024).toFixed(2)} KB</span></p>
                    </div>
                  </div>
                  
                  <div 
                    className="p-4 rounded-xl"
                    style={{ 
                      backgroundColor: `${colors.gold}10`,
                      border: `1px solid ${colors.gold}30`
                    }}
                  >
                    <p className="text-xs flex items-start gap-2" style={{ color: colors.gold }}>
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
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
            <div 
              className="p-4 border-t flex justify-end gap-3"
              style={{ borderColor: colors.tealPale }}
            >
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setRestoreFile(null);
                }}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105"
                style={{ 
                  backgroundColor: isDarkMode ? colors.tealMedium : colors.tealPale,
                  color: isDarkMode ? colors.tealLight : colors.tealDark
                }}
              >
                Batal
              </button>
              <button
                onClick={handleRestore}
                disabled={restoreLoading}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
                  color: 'white'
                }}
              >
                {restoreLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin inline mr-2" />
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