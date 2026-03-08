import React, { useState, useEffect } from 'react';
import { 
  Database, HardDrive, Download, Upload, RefreshCw, 
  Trash2, AlertTriangle, CheckCircle, X, FileText,
  Calendar, FolderOpen, PieChart, BarChart2, Server,
  Shield, Clock, Archive
} from 'lucide-react';
import { formatFileSize, IS_CANVAS } from '../../utils';

// --- Komponen Partikel Emas Mengambang (VISUAL ENHANCED) ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 1.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 25 + 15,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.5 + 0.1,
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

  // ===== ENHANCED ADVANCED GLASSMORPHISM STYLES =====
  const glassCard = `backdrop-blur-2xl border transition-all duration-700 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_40px_-10px_rgba(215,162,23,0.25)] relative overflow-hidden group ${
    isDarkMode 
      ? 'bg-gradient-to-br from-[#3c5654]/40 to-[#2a3f3d]/60 border-[#cadfdf]/10' 
      : 'bg-gradient-to-br from-white/70 to-white/40 border-white/60'
  }`;

  const glassInput = `px-5 py-3.5 text-sm md:text-base rounded-xl backdrop-blur-xl border outline-none transition-all duration-500 focus:ring-2 focus:ring-[#d7a217]/50 focus:shadow-[0_0_20px_rgba(215,162,23,0.2)] appearance-none ${
    isDarkMode 
      ? 'bg-[#1e2e2d]/50 border-[#cadfdf]/10 text-[#e2eceb] focus:bg-[#1e2e2d]/80' 
      : 'bg-white/50 border-white/80 text-[#425c5a] focus:bg-white/90'
  }`;

  return (
    <div className={`relative space-y-8 animate-in fade-in font-sans min-h-screen pb-12 ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#3c5654]'}`}>
      
      {/* ADVANCED BACKGROUND PARALLAX ELEMENTS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[50vw] h-[50vw] bg-gradient-to-bl from-[#d7a217]/10 to-transparent rounded-full blur-[100px] animate-blob-float"></div>
        <div className="absolute -bottom-[10%] -left-[5%] w-[60vw] h-[60vw] bg-gradient-to-tr from-[#425c5a]/20 dark:from-[#cadfdf]/10 to-transparent rounded-full blur-[120px] animate-blob-float animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-gradient-to-r from-[#d7a217]/5 to-transparent rounded-full blur-[80px] animate-pulse-slow mix-blend-overlay"></div>
      </div>

      {/* Grid Pattern with Depth */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(10deg) scale(1.1)',
          transformOrigin: 'top center'
        }}
      />
      
      <FloatingGoldParticles />
      
      <div className="relative z-10 animate-slide-up-fade">
        {/* --- HEADER --- */}
        <div className={`${glassCard} p-6 md:p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none rounded-3xl"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-40 rounded-2xl animate-pulse-slow"></div>
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#425c5a] to-[#2a3f3d] dark:from-[#cadfdf]/20 dark:to-transparent flex items-center justify-center shadow-lg border border-[#d7a217]/40 transition-transform duration-500 hover:scale-110 hover:rotate-3">
                <Server size={28} className="text-[#d7a217] drop-shadow-md" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d7a217]/15 border border-[#d7a217]/40 mb-2 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(215,162,23,0.3)]">
                <Shield size={14} className="text-[#d7a217] animate-pulse-slow" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#d7a217]">System Storage</span>
              </div>
              <h1 
                className="text-3xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent transition-all duration-500 hover:translate-x-1"
                style={{ 
                  backgroundImage: isDarkMode ? `linear-gradient(to right, #e2eceb, #cadfdf)` : `linear-gradient(to right, #425c5a, #3c5654)`,
                  textShadow: isDarkMode ? '0 4px 10px rgba(0,0,0,0.4)' : '0 4px 10px rgba(0,0,0,0.05)'
                }}
              >
                Manajemen Storage
              </h1>
              <p 
                className="text-base font-semibold max-w-2xl tracking-wide mt-2"
                style={{ color: isDarkMode ? `${colors.tealLight}CC` : `${colors.tealDark}CC` }}
              >
                Monitor penggunaan, backup konfigurasi, dan kelola file penyimpanan sistem.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading || IS_CANVAS}
            className="w-full md:w-auto px-8 py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-[0.15em] shadow-[0_10px_25px_-5px_rgba(215,162,23,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(215,162,23,0.6)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed bg-[length:200%_auto] hover:bg-[position:right_center]"
            style={{ 
              background: `linear-gradient(135deg, ${colors.gold} 0%, #e6b32a 50%, #b8860b 100%)`,
              color: 'white'
            }}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin drop-shadow-md' : 'drop-shadow-md'} />
            {loading ? 'SINKRONISASI...' : 'REFRESH DATA'}
          </button>
        </div>

        {/* Canvas Mode Warning */}
        {IS_CANVAS && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4">
            <div className={`relative p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-5 border shadow-lg overflow-hidden group/warning ${isDarkMode ? 'bg-[#d7a217]/10 border-[#d7a217]/30' : 'bg-[#fffbeb] border-[#fde68a]'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/warning:animate-shimmer pointer-events-none"></div>
              <div className="p-4 rounded-2xl shrink-0 shadow-inner relative z-10" style={{ backgroundColor: isDarkMode ? 'rgba(215,162,23,0.2)' : '#fef3c7' }}>
                <AlertTriangle size={28} style={{ color: colors.gold }} className="animate-pulse" />
              </div>
              <div className="relative z-10">
                <h4 className="text-lg md:text-xl font-black tracking-wide mb-1" style={{ color: colors.gold }}>Mode Canvas Terdeteksi</h4>
                <p className="text-sm md:text-base font-bold leading-relaxed opacity-80" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  Akses langsung ke Storage Firebase tidak diaktifkan dalam lingkungan preview. Data yang Anda lihat saat ini adalah <span className="underline decoration-[#d7a217] decoration-2">simulasi visual</span>.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Statistik Storage (ECharts Style / Modern Dashboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 animate-slide-up-fade animation-delay-100">
          
          {/* Card Penggunaan */}
          <div className={`${glassCard} rounded-3xl group/stat`}>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d7a217] blur-[80px] opacity-10 pointer-events-none group-hover/stat:opacity-20 transition-opacity duration-700"></div>
            <div className="p-8 h-full flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-5 mb-8">
                <div className="p-4 rounded-2xl shadow-[0_0_20px_rgba(215,162,23,0.2)] group-hover/stat:scale-110 group-hover/stat:rotate-6 transition-all duration-500" style={{ backgroundColor: `${colors.gold}15`, border: `1px solid ${colors.gold}30` }}>
                  <HardDrive size={32} style={{ color: colors.gold }} />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-black uppercase tracking-widest opacity-70 mb-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                    Kapasitas Storage
                  </p>
                  <p className="text-4xl md:text-5xl font-black bg-clip-text text-transparent drop-shadow-sm" style={{ backgroundImage: isDarkMode ? `linear-gradient(135deg, #ffffff, ${colors.tealPale})` : `linear-gradient(135deg, ${colors.tealDark}, ${colors.tealMedium})` }}>
                    {storageStats.used}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end text-sm md:text-base font-bold">
                  <span style={{ color: colors.tealMedium }}>Total Terpakai</span>
                  <span className="text-xl font-black drop-shadow-sm" style={{ color: colors.gold }}>{storageStats.percentage.toFixed(1)}%</span>
                </div>
                
                {/* Modern Glowing Progress Bar */}
                <div className="w-full h-4 rounded-full bg-black/10 dark:bg-white/5 shadow-inner p-[2px] overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out relative group-hover/stat:shadow-[0_0_15px_rgba(215,162,23,0.5)]"
                    style={{ 
                      width: `${storageStats.percentage}%`,
                      background: `linear-gradient(90deg, ${colors.gold} 0%, #f9d423 100%)`
                    }}
                  >
                    <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover/stat:animate-shimmer"></div>
                    {/* Glowing dot at the end */}
                    <div className="absolute top-0 right-0 w-2 h-full bg-white rounded-full blur-[2px] opacity-70"></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs md:text-sm font-bold pt-2">
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                    <Archive size={14} className="text-[#d7a217]" />
                    {storageStats.files || 0} File Aktif
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                    <Shield size={14} className="text-[#d7a217]" />
                    Kuota: {storageStats.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Aksi Backup & Restore */}
          <div className={`${glassCard} lg:col-span-2 rounded-3xl flex flex-col relative`}>
            <div className="p-8 flex-grow flex flex-col justify-center relative z-10">
              <h3 className="text-lg md:text-xl font-black mb-4 uppercase tracking-widest flex items-center gap-3" style={{ color: colors.gold }}>
                <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[0_0_15px_rgba(215,162,23,0.15)]">
                  <Download size={22} />
                </div>
                Sistem Backup & Restore
              </h3>
              
              <p className="text-sm md:text-base font-semibold leading-relaxed mb-8 opacity-80 max-w-2xl" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Amankan struktur dan daftar file Anda dengan mengunduh snapshot JSON. Anda dapat memulihkan (restore) koneksi data atau membersihkan file yang tidak terpakai kapan saja.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Tombol Backup */}
                <button
                  onClick={handleBackup}
                  disabled={backupLoading || IS_CANVAS}
                  className="group/btn relative px-5 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_20px_-5px_rgba(66,92,90,0.4)] flex flex-col items-center justify-center gap-3 disabled:opacity-50 overflow-hidden border border-transparent"
                  style={{ 
                    background: isDarkMode ? `linear-gradient(135deg, ${colors.tealMedium} 0%, ${colors.tealDark} 100%)` : `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`,
                    color: 'white'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
                  {backupLoading ? (
                    <>
                      <RefreshCw size={24} className="animate-spin drop-shadow-md" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Download size={24} className="drop-shadow-md group-hover/btn:-translate-y-1 transition-transform" />
                      <span>Backup Data</span>
                    </>
                  )}
                </button>
                
                {/* Tombol Restore */}
                <div className="relative group/btn">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={restoreLoading || IS_CANVAS}
                  />
                  <div 
                    className={`w-full h-full px-5 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-lg transition-all duration-300 hover:scale-[1.03] flex flex-col items-center justify-center gap-3 overflow-hidden relative border border-transparent ${
                      (restoreLoading || IS_CANVAS) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_10px_20px_-5px_rgba(215,162,23,0.4)]'
                    }`}
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.gold} 0%, #c29115 100%)`,
                      color: 'white'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
                    <Upload size={24} className="drop-shadow-md group-hover/btn:-translate-y-1 transition-transform" />
                    <span>Restore Data</span>
                  </div>
                </div>
                
                {/* Tombol Cleanup */}
                <button
                  onClick={handleCleanup}
                  disabled={IS_CANVAS}
                  className="group/btn relative px-5 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_20px_-5px_rgba(225,29,72,0.3)] flex flex-col items-center justify-center gap-3 disabled:opacity-50 overflow-hidden"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(225, 29, 72, 0.1)' : 'rgba(225, 29, 72, 0.05)',
                    border: '1px solid rgba(225, 29, 72, 0.3)',
                    color: isDarkMode ? '#f43f5e' : '#e11d48'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
                  <Trash2 size={24} className="drop-shadow-sm group-hover/btn:-translate-y-1 transition-transform" />
                  <span>Cleanup File</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className={`${glassCard} rounded-3xl mt-8 animate-slide-up-fade animation-delay-200`}>
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.4)' }}>
            <h3 className="text-base md:text-lg font-black uppercase tracking-widest flex items-center gap-3" style={{ color: colors.gold }}>
              <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[0_0_15px_rgba(215,162,23,0.15)]">
                <BarChart2 size={20} />
              </div>
              Filter Analisis Data
            </h3>
            
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
              <div className="relative group/filter">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within/filter:text-[#d7a217]" style={{ color: isDarkMode ? 'rgba(202,223,223,0.5)' : 'rgba(60,86,84,0.5)' }} />
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMonth('all');
                  }}
                  className={`${glassInput} pl-12 pr-10 font-bold tracking-wide`}
                >
                  <option value="all">Semua Tahun</option>
                  {getYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              {selectedYear !== 'all' && (
                <div className="relative group/filter animate-in fade-in slide-in-from-left-4">
                  <FolderOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within/filter:text-[#d7a217]" style={{ color: isDarkMode ? 'rgba(202,223,223,0.5)' : 'rgba(60,86,84,0.5)' }} />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={`${glassInput} pl-12 pr-10 font-bold tracking-wide`}
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
              
              <div className="md:ml-4 flex items-center">
                <span className="text-xs md:text-sm font-black uppercase tracking-widest px-5 py-3 rounded-xl shadow-inner border backdrop-blur-md"
                  style={{ 
                    backgroundColor: `${colors.gold}15`,
                    color: colors.gold,
                    border: `1px solid ${colors.gold}30`
                  }}
                >
                  Total Data: <span className="text-base md:text-lg drop-shadow-sm ml-2">{formatFileSize(getTotalSize())}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Detail per Tahun/Bulan */}
          <div className="p-6 md:p-8">
            {loading ? (
              <div className="text-center py-20 animate-in fade-in">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-[#d7a217] blur-xl opacity-30 rounded-full animate-pulse-slow"></div>
                  <div className="relative flex items-center justify-center w-full h-full bg-[#d7a217]/10 border border-[#d7a217]/30 rounded-full">
                    <RefreshCw size={36} className="animate-spin" style={{ color: colors.gold }} />
                  </div>
                </div>
                <p className="text-base font-bold tracking-wide animate-pulse" style={{ color: colors.tealMedium }}>Mengkalkulasi arsitektur storage...</p>
              </div>
            ) : Object.keys(storageStats.folders).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(getFilteredFolders())
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .map(([year, months], idx) => {
                    const yearTotal = Object.values(months).reduce((a, b) => a + b, 0);
                    
                    return (
                      <div 
                        key={year} 
                        className="rounded-3xl p-6 md:p-8 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] group/year animate-in slide-in-from-bottom-4"
                        style={{ 
                          backgroundColor: isDarkMode ? 'rgba(30, 46, 45, 0.4)' : 'rgba(255, 255, 255, 0.5)',
                          border: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.4)'}`,
                          animationDelay: `${idx * 100}ms`
                        }}
                      >
                        <div className="flex justify-between items-end mb-6 border-b border-dashed pb-4" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.2)' : 'rgba(60,86,84,0.2)' }}>
                          <h4 className="text-2xl font-black flex items-center gap-3 bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${colors.gold}, #f9d423)` }}>
                            <Calendar size={24} className="text-[#d7a217]" />
                            Tahun {year}
                          </h4>
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>Akumulasi</p>
                            <span className="text-xl font-black drop-shadow-sm" style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}>
                              {formatFileSize(yearTotal)}
                            </span>
                          </div>
                        </div>
                        
                        {/* ECharts-like Data Nodes */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
                          {Object.entries(months)
                            .sort((a, b) => b[0].localeCompare(a[0]))
                            .map(([month, size]) => {
                              const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                              const monthName = monthNames[parseInt(month) - 1] || month;
                              
                              // Calculate intensity for visual hierarchy
                              const intensity = Math.min((size / (yearTotal || 1)) * 100, 100);
                              
                              return (
                                <div 
                                  key={`${year}-${month}`} 
                                  className="relative rounded-2xl p-4 md:p-5 text-center transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-default group/node overflow-hidden"
                                  style={{ 
                                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)',
                                    border: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.5)'}`,
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                                  }}
                                >
                                  {/* Dynamic Ambient Background based on data size */}
                                  <div 
                                    className="absolute inset-0 opacity-10 group-hover/node:opacity-20 transition-opacity duration-300"
                                    style={{ background: `linear-gradient(to top, ${colors.gold}, transparent)`, height: `${intensity + 20}%`, top: 'auto', bottom: 0 }}
                                  ></div>
                                  
                                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover/node:animate-shimmer pointer-events-none"></div>
                                  
                                  <FolderOpen size={24} className="mx-auto mb-3 opacity-70 group-hover/node:opacity-100 group-hover:scale-110 transition-all duration-300" style={{ color: colors.gold }} />
                                  <p className="text-xs md:text-sm font-black uppercase tracking-wider mb-1 relative z-10" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                                    {monthName}
                                  </p>
                                  <p className="text-base md:text-lg font-black relative z-10" style={{ color: colors.gold }}>
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
              <div className="text-center py-20 px-6 rounded-3xl" style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)' }}>
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-[#d7a217] blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
                  <div className="relative flex items-center justify-center w-full h-full bg-[#d7a217]/10 border border-[#d7a217]/30 rounded-full backdrop-blur-md">
                    <Database size={40} className="opacity-80" style={{ color: colors.gold }} />
                  </div>
                </div>
                <h4 className="text-xl font-black uppercase tracking-[0.2em] mb-2" style={{ color: colors.gold }}>Visualisasi Kosong</h4>
                <p className="text-sm md:text-base font-bold opacity-70 max-w-md mx-auto" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  {IS_CANVAS 
                    ? 'Mode preview Canvas aktif. Modul data storage yang sesungguhnya diisolasi demi keamanan.' 
                    : 'Arsitektur data belum terbentuk. Silakan muat ulang (refresh) untuk sinkronisasi.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Restore dengan Glassmorphism Tingkat Lanjut */}
      {showRestoreModal && restoreFile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowRestoreModal(false)}
        >
          <div 
            className="max-w-2xl w-full rounded-3xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] border animate-in zoom-in-95 duration-300 relative"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(20, 30, 29, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: `${colors.gold}40`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Ambient Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#d7a217] blur-[100px] opacity-30 pointer-events-none"></div>

            {/* Header */}
            <div 
              className="p-6 md:p-8 flex justify-between items-center relative z-10 shadow-md"
              style={{ 
                background: `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`
              }}
            >
              <h3 className="text-white font-black text-base md:text-lg uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10 shadow-inner">
                  <Upload size={20} className="text-[#d7a217]" /> 
                </div>
                Sistem Recovery Data
              </h3>
              <button 
                onClick={() => setShowRestoreModal(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500 hover:text-white transition-colors duration-300 text-white/70"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 relative z-10">
              {restoreLoading ? (
                <div className="text-center py-12">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-[#d7a217] blur-xl opacity-30 rounded-full animate-pulse-slow"></div>
                    <div className="relative flex items-center justify-center w-full h-full bg-[#d7a217]/10 border border-[#d7a217]/40 rounded-full">
                      <RefreshCw size={40} className="animate-spin" style={{ color: colors.gold }} />
                    </div>
                  </div>
                  <p className="text-base font-black uppercase tracking-widest mb-6" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>Inisialisasi Recovery...</p>
                  
                  {/* High-tech Progress Bar */}
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="w-full h-4 rounded-full bg-black/10 dark:bg-white/10 shadow-inner p-[2px] overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300 ease-out relative shadow-[0_0_15px_rgba(215,162,23,0.5)]"
                        style={{ 
                          width: `${restoreProgress}%`,
                          background: `linear-gradient(90deg, ${colors.gold} 0%, #f9d423 100%)`
                        }}
                      >
                        <div className="absolute inset-0 bg-white/30 -translate-x-full animate-shimmer"></div>
                        <div className="absolute top-0 right-0 w-2 h-full bg-white rounded-full blur-[2px] opacity-80"></div>
                      </div>
                    </div>
                    <p className="absolute -right-12 top-1/2 -translate-y-1/2 text-sm font-black" style={{ color: colors.gold }}>
                      {Math.round(restoreProgress)}%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/10 dark:border-white/10">
                    <FileText size={32} style={{ color: colors.gold }} className="shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>Target File Backup</p>
                      <p className="text-base font-black truncate" style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}>
                        {restoreFile.name}
                      </p>
                    </div>
                  </div>
                  
                  <div 
                    className="p-6 rounded-2xl shadow-inner border"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)',
                      borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.5)'
                    }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: colors.gold }}>
                      <Database size={14} /> Metrik Ekstraksi
                    </p>
                    <div className="space-y-3 text-sm md:text-base font-medium">
                      <div className="flex justify-between items-center pb-3 border-b border-dashed" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(60,86,84,0.1)' }}>
                        <span style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>Identifikasi File</span> 
                        <span className="font-bold" style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}>{restoreFile.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>Volume Data</span> 
                        <span className="font-black" style={{ color: colors.gold }}>{(restoreFile.size / 1024).toFixed(2)} KB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <p className="text-sm font-bold flex items-start gap-3 leading-relaxed">
                      <AlertTriangle size={24} className="shrink-0 text-rose-500 animate-pulse" />
                      <span>
                        <strong className="uppercase tracking-widest block mb-1">Peringatan Kritikal:</strong> 
                        Algoritma restore akan melakukan over-write (menimpa) konstelasi data saat ini dengan arsitektur dari file backup. Pastikan latensi jaringan stabil.
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div 
              className="p-6 md:p-8 border-t flex flex-col-reverse sm:flex-row justify-end gap-4 relative z-10 bg-black/5 dark:bg-white/5"
              style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.3)' }}
            >
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setRestoreFile(null);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 border shadow-sm"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'white',
                  borderColor: isDarkMode ? 'transparent' : colors.tealPale,
                  color: isDarkMode ? colors.tealLight : colors.tealDark
                }}
              >
                Batalkan
              </button>
              <button
                onClick={handleRestore}
                disabled={restoreLoading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(215,162,23,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_25px_-5px_rgba(215,162,23,0.6)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 bg-[length:200%_auto] hover:bg-[position:right_center]"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.gold} 0%, #e6b32a 50%, #b8860b 100%)`,
                  color: 'white'
                }}
              >
                {restoreLoading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin drop-shadow-md" />
                    EXECUTING...
                  </>
                ) : (
                  <>
                    <Shield size={18} className="drop-shadow-md" />
                    EKSEKUSI RESTORE
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal CSS for Animations and Custom Scrollbar */}
      <style jsx>{`
        /* Custom Modern Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(202, 223, 223, 0.05); border-radius: 20px; margin: 10px 0; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, transparent, rgba(215, 162, 23, 0.5), transparent); border-radius: 20px; transition: all 0.3s; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #d7a217, #b8860b); box-shadow: 0 0 10px rgba(215, 162, 23, 0.5); }

        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0; }
          20% { opacity: var(--tw-opacity, 0.8); transform: scale(1.2) rotate(45deg); }
          80% { opacity: var(--tw-opacity, 0.8); transform: scale(0.8) rotate(90deg); }
          100% { transform: translateY(-120vh) translateX(100px) scale(1) rotate(180deg); opacity: 0; }
        }
        
        @keyframes blob-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-blob-float { animation: blob-float 20s infinite ease-in-out; }
        .animate-shimmer { animation: shimmer 2.5s infinite linear; }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        .animate-slide-up-fade { animation: slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
      `}</style>
    </div>
  );
};

export default StorageView;