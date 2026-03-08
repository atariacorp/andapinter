import React, { useState, useEffect, useMemo } from 'react';
import { 
  History, Filter, Calendar, Download, RefreshCw,
  ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle,
  User, Activity, Clock, Database, FileText, Settings as SettingsIcon,
  LogIn, LogOut, Edit3, Trash2, Upload, CheckSquare, Search, Sparkles
} from 'lucide-react';

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
      blur: Math.random() * 2,
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
            filter: `blur(${p.blur}px)`,
            animationDuration: `${p.animDuration}s`,
            animationDelay: `${p.animDelay}s`,
            boxShadow: `0 0 ${p.size * 4}px ${p.size * 1.5}px rgba(215, 162, 23, 0.4)`,
          }}
        />
      ))}
    </div>
  );
};

const LogsView = ({ 
  addNotification,
  activityLogs = [],
  loading = false,
  onRefresh,
  onExport,
  isDarkMode = false
}) => {
  const [filter, setFilter] = useState('semua');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [expandedLog, setExpandedLog] = useState(null);

  // ===== TAMBAHKAN INI =====
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealLight: '#e2eceb',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };
  // ===== END TAMBAHAN =====
  
  // ==========================================
  // LOGIKA ASLI - TIDAK DIUBAH SAMA SEKALI
  // ==========================================
  const filteredLogs = useMemo(() => {
    return activityLogs.filter(log => {
      if (filter !== 'semua' && log.category !== filter) return false;
      if (dateRange.start && log.timestamp < dateRange.start) return false;
      if (dateRange.end && log.timestamp > dateRange.end + 'T23:59:59') return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          (log.userName?.toLowerCase() || '').includes(term) ||
          (log.description?.toLowerCase() || '').includes(term) ||
          (log.action?.toLowerCase() || '').includes(term) ||
          (log.category?.toLowerCase() || '').includes(term)
        );
      }
      return true;
    });
  }, [activityLogs, filter, dateRange, searchTerm]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, dateRange, searchTerm]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  // Visual Enhancement pada Returns Badge & Icon
  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE': return <FileText size={16} className="text-[#10b981] drop-shadow-sm" />;
      case 'UPDATE': return <Edit3 size={16} className="text-[#3b82f6] drop-shadow-sm" />;
      case 'DELETE': return <Trash2 size={16} className="text-[#ef4444] drop-shadow-sm" />;
      case 'UPDATE_STATUS': return <CheckSquare size={16} className="text-[#f59e0b] drop-shadow-sm" />;
      case 'LOGIN': return <LogIn size={16} className="text-[#22c55e] drop-shadow-sm" />;
      case 'LOGOUT': return <LogOut size={16} className="text-[#f97316] drop-shadow-sm" />;
      case 'IMPORT': return <Upload size={16} className="text-[#a855f7] drop-shadow-sm" />;
      case 'REGISTER': return <User size={16} className="text-[#6366f1] drop-shadow-sm" />;
      default: return <Activity size={16} className="text-[#d7a217] drop-shadow-sm" />;
    }
  };

  const getCategoryBadge = (category) => {
    const baseStyle = "px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest border backdrop-blur-sm shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:shadow-md";
    switch (category) {
      case 'auth':
      case 'AUTH': return `${baseStyle} bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300`;
      case 'proposal': return `${baseStyle} bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300`;
      case 'bank_sro': return `${baseStyle} bg-indigo-500/10 text-indigo-700 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300`;
      case 'bank_catatan': return `${baseStyle} bg-pink-500/10 text-pink-700 border-pink-500/30 dark:bg-pink-500/20 dark:text-pink-300`;
      case 'master': return `${baseStyle} bg-orange-500/10 text-orange-700 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-300`;
      default: return `${baseStyle} bg-gray-500/10 text-gray-700 border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-300`;
    }
  };

  const getActionBadge = (action) => {
    const baseStyle = "px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest border backdrop-blur-sm flex items-center gap-2 w-fit shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:shadow-md group-hover:scale-105 origin-left";
    switch (action) {
      case 'CREATE': return `${baseStyle} bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300`;
      case 'UPDATE':
      case 'UPDATE_STATUS': return `${baseStyle} bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300`;
      case 'DELETE': return `${baseStyle} bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300`;
      case 'LOGIN': return `${baseStyle} bg-green-500/10 text-green-700 border-green-500/30 dark:bg-green-500/20 dark:text-green-300`;
      case 'LOGOUT': return `${baseStyle} bg-orange-500/10 text-orange-700 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-300`;
      case 'IMPORT': return `${baseStyle} bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300`;
      case 'REGISTER': return `${baseStyle} bg-indigo-500/10 text-indigo-700 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300`;
      default: return `${baseStyle} bg-gray-500/10 text-gray-700 border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-300`;
    }
  };

  const handleExport = () => {
    const headers = ['Waktu', 'User', 'Level', 'Kategori', 'Aksi', 'Deskripsi', 'Data ID'];
    const rows = filteredLogs.map(log => [
      log.timestamp || '', log.userName || '', log.userLevel || '',
      log.category || '', log.action || '', log.description || '', log.dataId || ''
    ]);

    const csvContent = "\uFEFF" + headers.join(';') + '\n' + rows.map(r => r.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_logs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Log berhasil diekspor', 'success');
  };
  // ==========================================

  // --- Konstanta Desain Glassmorphism Advanced ---
  const glassCard = `backdrop-blur-2xl border transition-all duration-700 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_40px_-10px_rgba(215,162,23,0.25)] relative overflow-hidden ${
    isDarkMode 
      ? 'bg-gradient-to-br from-[#3c5654]/40 to-[#2a3f3d]/60 border-[#cadfdf]/10' 
      : 'bg-gradient-to-br from-white/70 to-white/40 border-white/60'
  }`;
    
  const glassInput = `w-full px-5 py-3.5 text-sm md:text-base rounded-xl backdrop-blur-xl border outline-none transition-all duration-500 focus:ring-2 focus:ring-[#d7a217]/50 focus:shadow-[0_0_20px_rgba(215,162,23,0.2)] ${
    isDarkMode 
      ? 'bg-[#1e2e2d]/50 border-[#cadfdf]/10 text-[#e2eceb] placeholder-[#cadfdf]/40 focus:bg-[#1e2e2d]/80 focus:border-[#d7a217]/50' 
      : 'bg-white/50 border-white/80 text-[#425c5a] placeholder-[#3c5654]/40 focus:bg-white/90 focus:border-[#d7a217]/40'
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
        <div className={`${glassCard} p-6 md:p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none rounded-3xl"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-40 rounded-2xl animate-pulse-slow"></div>
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#425c5a] to-[#2a3f3d] dark:from-[#cadfdf]/20 dark:to-transparent flex items-center justify-center shadow-lg border border-[#d7a217]/40 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <History size={24} className="text-[#d7a217] drop-shadow-md" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#d7a217]/15 border border-[#d7a217]/40 mb-1.5 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(215,162,23,0.3)]">
                <Sparkles size={12} className="text-[#d7a217] animate-pulse-slow" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d7a217]">Sistem Monitoring</span>
              </div>
              <h1 
                className="text-2xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent transition-all duration-500 group-hover:translate-x-1"
                style={{ 
                  backgroundImage: isDarkMode ? `linear-gradient(to right, #e2eceb, #cadfdf)` : `linear-gradient(to right, #425c5a, #3c5654)`,
                  textShadow: isDarkMode ? '0 4px 10px rgba(0,0,0,0.4)' : '0 4px 10px rgba(0,0,0,0.05)'
                }}
              >
                Log Aktivitas
              </h1>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto relative z-10">
            <button
              onClick={onRefresh}
              disabled={loading}
              className={`p-4 rounded-xl flex items-center justify-center transition-all duration-500 hover:scale-110 hover:rotate-12 shadow-md ${isDarkMode ? 'bg-[#1e2e2d]/80 border border-[#cadfdf]/20 text-[#cadfdf] hover:bg-[#1e2e2d] hover:border-[#d7a217]/50 hover:shadow-[0_0_20px_rgba(215,162,23,0.2)]' : 'bg-white/90 border border-[#cadfdf]/60 text-[#425c5a] hover:bg-white hover:border-[#d7a217]/50 hover:shadow-[0_0_20px_rgba(215,162,23,0.2)]'}`}
              title="Refresh Data"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin text-[#d7a217]' : ''} />
            </button>
            
            <button
              onClick={handleExport}
              className="flex-1 md:flex-none px-8 py-4 bg-gradient-to-r from-[#d7a217] via-[#e6b32a] to-[#b8860b] hover:shadow-[0_10px_25px_-5px_rgba(215,162,23,0.5)] text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all duration-500 hover:-translate-y-1 bg-[length:200%_auto] hover:bg-[position:right_center]"
            >
              <Download size={18} className="drop-shadow-md" /> EXPORT CSV
            </button>
          </div>
        </div>

        {/* --- FILTER PANEL (Glassmorphism Advanced) --- */}
        <div className={`${glassCard} p-6 md:p-8 rounded-3xl mb-8 group/filter`}>
          <div className="flex items-center gap-3 mb-6 border-b border-[#cadfdf]/30 dark:border-[#cadfdf]/10 pb-5">
            <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[0_0_15px_rgba(215,162,23,0.15)] group-hover/filter:rotate-12 transition-transform duration-500">
              <Filter size={20} className="text-[#d7a217]" />
            </div>
            <h3 className="text-sm md:text-base font-black uppercase tracking-widest" style={{ color: isDarkMode ? '#cadfdf' : '#425c5a' }}>
              Parameter Pencarian
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Filter Kategori */}
            <div className="space-y-2 relative group/input">
              <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-2" style={{ color: isDarkMode ? '#cadfdf' : '#3c5654' }}>Kategori</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`${glassInput} appearance-none cursor-pointer font-bold`}
              >
                <option value="semua" className="bg-white dark:bg-[#1e2e2d] text-black dark:text-white">Semua Kategori</option>
                <option value="auth" className="bg-white dark:bg-[#1e2e2d] text-black dark:text-white">Autentikasi (Auth)</option>
                <option value="proposal" className="bg-white dark:bg-[#1e2e2d] text-black dark:text-white">Usulan / Proposal</option>
                <option value="master" className="bg-white dark:bg-[#1e2e2d] text-black dark:text-white">Master Data</option>
                <option value="bank_sro" className="bg-white dark:bg-[#1e2e2d] text-black dark:text-white">Bank SRO</option>
                <option value="bank_catatan" className="bg-white dark:bg-[#1e2e2d] text-black dark:text-white">Bank Catatan</option>
              </select>
            </div>
            
            {/* Filter Tanggal Mulai */}
            <div className="space-y-2 relative group/input">
              <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-2" style={{ color: isDarkMode ? '#cadfdf' : '#3c5654' }}>Dari Tanggal</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3c5654]/40 dark:text-[#cadfdf]/40 pointer-events-none transition-colors duration-300 group-focus-within/input:text-[#d7a217]" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className={`${glassInput} pl-12 pr-4 cursor-pointer font-bold`}
                />
              </div>
            </div>
            
            {/* Filter Tanggal Akhir */}
            <div className="space-y-2 relative group/input">
              <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-2" style={{ color: isDarkMode ? '#cadfdf' : '#3c5654' }}>Sampai Tanggal</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3c5654]/40 dark:text-[#cadfdf]/40 pointer-events-none transition-colors duration-300 group-focus-within/input:text-[#d7a217]" />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className={`${glassInput} pl-12 pr-4 cursor-pointer font-bold`}
                />
              </div>
            </div>
            
            {/* Pencarian */}
            <div className="space-y-2 relative group/input">
              <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-2" style={{ color: isDarkMode ? '#cadfdf' : '#3c5654' }}>Cari Kata Kunci</label>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3c5654]/40 dark:text-[#cadfdf]/40 pointer-events-none transition-colors duration-300 group-focus-within/input:text-[#d7a217]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ketik user, deskripsi, aksi..."
                  className={`${glassInput} pl-12 pr-4 font-bold`}
                />
              </div>
            </div>
          </div>
          
          {/* Tombol Reset Filter */}
          {(filter !== 'semua' || dateRange.start || dateRange.end || searchTerm) && (
            <div className="mt-6 flex justify-end animate-in fade-in slide-in-from-top-2">
              <button
                onClick={() => {
                  setFilter('semua');
                  setDateRange({ start: '', end: '' });
                  setSearchTerm('');
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 hover:shadow-[0_5px_15px_rgba(225,29,72,0.2)]' : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:shadow-[0_5px_15px_rgba(225,29,72,0.15)]'}`}
              >
                <X size={16} /> RESET FILTER
              </button>
            </div>
          )}
        </div>

        {/* --- INFO BAR --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5 px-4 animate-slide-up-fade animation-delay-100">
          <span className="text-sm font-bold tracking-wide" style={{ color: isDarkMode ? 'rgba(202,223,223,0.8)' : 'rgba(60,86,84,0.8)' }}>
            Menampilkan <span className="text-lg font-black" style={{ color: isDarkMode ? '#ffffff' : '#425c5a' }}>{paginatedLogs.length}</span> dari <span className="text-lg font-black" style={{ color: isDarkMode ? '#ffffff' : '#425c5a' }}>{filteredLogs.length}</span> log 
            {filteredLogs.length !== activityLogs.length && <span className="italic opacity-70"> (difilter dari total {activityLogs.length})</span>}
          </span>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-inner backdrop-blur-md" style={{ backgroundColor: `${colors.gold}15`, border: `1px solid ${colors.gold}30` }}>
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#d7a217]">
              Status: Live Sync
            </span>
          </div>
        </div>

        {/* --- TABEL LOGS (ECharts / Premium Dashboard Aesthetic) --- */}
        <div className={`${glassCard} rounded-3xl animate-slide-up-fade animation-delay-200`}>
          <div className="overflow-x-auto relative z-10 custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className={`text-xs md:text-sm font-black uppercase tracking-widest backdrop-blur-2xl shadow-sm ${isDarkMode ? 'bg-[#1a2b29]/80 text-[#cadfdf] border-b border-[#cadfdf]/10' : 'bg-white/70 text-[#425c5a] border-b border-[#cadfdf]/40'}`}>
                  <th className="p-6 whitespace-nowrap">Timestamp</th>
                  <th className="p-6 whitespace-nowrap">Identitas User</th>
                  <th className="p-6 whitespace-nowrap">Hak Akses</th>
                  <th className="p-6 whitespace-nowrap">Modul Data</th>
                  <th className="p-6 whitespace-nowrap">Jenis Aksi</th>
                  <th className="p-6">Rincian Aktivitas</th>
                  <th className="p-6 text-center whitespace-nowrap">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y transition-colors duration-500" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.05)' : 'rgba(202,223,223,0.3)' }}>
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <tr className={`transition-all duration-500 hover:bg-gradient-to-r hover:from-transparent ${isDarkMode ? 'hover:via-white/5' : 'hover:via-[#d7a217]/5'} hover:to-transparent group relative`}>
                        {/* Highlight border on hover */}
                        <td className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d7a217] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></td>
                        
                        <td className="p-6 whitespace-nowrap align-middle">
                          <div className="flex items-center gap-3 text-xs md:text-sm font-bold opacity-90" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                            <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[inset_0_0_10px_rgba(215,162,23,0.1)]">
                              <Clock size={14} className="text-[#d7a217]" />
                            </div>
                            <span className="tracking-wide">{formatTimestamp(log.timestamp)}</span>
                          </div>
                        </td>
                        <td className="p-6 align-middle">
                          <div className="flex items-center gap-3 text-sm md:text-base font-black" style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}>
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d7a217]/20 to-transparent flex items-center justify-center text-[#d7a217] shrink-0 border border-[#d7a217]/30 shadow-sm group-hover:scale-110 transition-transform duration-300">
                              <User size={16} />
                            </div>
                            {log.userName || 'System'}
                          </div>
                        </td>
                        <td className="p-6 align-middle">
                          <span className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest border shadow-sm backdrop-blur-sm ${
                            log.userLevel === 'Admin' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' :
                            log.userLevel === 'Operator BKAD' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' :
                            log.userLevel === 'SKPD' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' :
                            'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30'
                          }`}>
                            {log.userLevel || 'System'}
                          </span>
                        </td>
                        <td className="p-6 align-middle">
                          {getCategoryBadge(log.category)}
                        </td>
                        <td className="p-6 align-middle">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="p-6 text-sm md:text-base font-bold leading-relaxed align-middle" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                          <p className="max-w-md truncate group-hover:whitespace-normal group-hover:text-clip transition-all duration-300 opacity-90">
                            {log.description}
                          </p>
                        </td>
                        <td className="p-6 text-center align-middle">
                          <button
                            onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-md flex items-center justify-center gap-2 mx-auto hover:scale-105 ${
                              expandedLog === log.id 
                                ? 'bg-rose-500 text-white shadow-[0_5px_15px_rgba(225,29,72,0.4)] border-none' 
                                : 'bg-gradient-to-r from-[#1e2e2d] to-[#2a3f3d] dark:from-white/10 dark:to-white/5 text-[#d7a217] border border-[#d7a217]/30 hover:shadow-[0_5px_15px_rgba(215,162,23,0.3)]'
                            }`}
                          >
                            {expandedLog === log.id ? (
                              <><X size={14}/> TUTUP</>
                            ) : (
                              <><Database size={14}/> DETAIL</>
                            )}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Row - High-Tech Terminal Aesthetic */}
                      {expandedLog === log.id && (
                        <tr className="bg-black/5 dark:bg-black/40 shadow-inner">
                          <td colSpan="7" className="p-0 border-b border-[#cadfdf]/40 dark:border-[#cadfdf]/10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(215,162,23,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(215,162,23,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                            
                            <div className="animate-in slide-in-from-top-4 fade-in duration-500 ease-out p-6 md:p-8 relative z-10">
                              <div className={`p-8 rounded-3xl border shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative overflow-hidden group/terminal ${isDarkMode ? 'bg-[#0f1716]/90 border-[#d7a217]/20' : 'bg-white/95 border-[#d7a217]/40'}`}>
                                
                                {/* Ambient Glow Inside Terminal */}
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#d7a217] blur-[100px] opacity-10 pointer-events-none"></div>

                                <div className="flex items-center gap-3 mb-6 border-b border-dashed border-[#d7a217]/30 pb-4">
                                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
                                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                  <h4 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-[#d7a217] ml-4 flex items-center gap-2">
                                    <Database size={16} /> Payload Data Teknis
                                  </h4>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
                                  {log.dataId && (
                                    <div className="col-span-full flex items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10">
                                      <span className="text-xs font-black uppercase tracking-widest opacity-70" style={{ color: isDarkMode ? '#cadfdf' : '#425c5a' }}>Reference ID:</span>
                                      <code className="px-4 py-1.5 rounded-lg bg-black/20 dark:bg-black/40 font-mono text-sm font-bold text-[#d7a217] shadow-inner">{log.dataId}</code>
                                    </div>
                                  )}
                                  
                                  {log.oldData && (
                                    <div className="space-y-3">
                                      <p className="text-xs font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                                        <span className="p-1.5 rounded-md bg-rose-500/20"><XCircle size={14} /></span> State Sebelumnya
                                      </p>
                                      <div className="relative group/code rounded-2xl overflow-hidden shadow-lg border border-rose-500/30">
                                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent pointer-events-none"></div>
                                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                                        <pre className={`p-6 pl-8 font-mono text-xs md:text-sm overflow-x-auto custom-scrollbar relative z-10 leading-relaxed ${isDarkMode ? 'bg-[#0a0f0e] text-rose-200' : 'bg-[#fff5f5] text-rose-900'}`}>
                                          {JSON.stringify(JSON.parse(log.oldData), null, 2)}
                                        </pre>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {log.newData && (
                                    <div className="space-y-3">
                                      <p className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                        <span className="p-1.5 rounded-md bg-emerald-500/20"><CheckCircle size={14} /></span> State Terbaru
                                      </p>
                                      <div className="relative group/code rounded-2xl overflow-hidden shadow-lg border border-emerald-500/30">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
                                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                        <pre className={`p-6 pl-8 font-mono text-xs md:text-sm overflow-x-auto custom-scrollbar relative z-10 leading-relaxed ${isDarkMode ? 'bg-[#0a0f0e] text-emerald-200' : 'bg-[#f0fdf4] text-emerald-900'}`}>
                                          {JSON.stringify(JSON.parse(log.newData), null, 2)}
                                        </pre>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {!log.oldData && !log.newData && (
                                    <div className="col-span-full p-8 rounded-2xl border-2 border-dashed border-[#cadfdf]/30 text-center bg-black/5 dark:bg-white/5">
                                      <div className="w-16 h-16 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center mx-auto mb-4">
                                        <FileX size={28} className="opacity-50" style={{ color: isDarkMode ? '#cadfdf' : '#425c5a' }}/>
                                      </div>
                                      <p className="text-sm font-bold uppercase tracking-widest opacity-60" style={{ color: isDarkMode ? '#cadfdf' : '#425c5a' }}>Payload data tidak tersedia untuk aktivitas ini.</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-24 text-center">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <div className="absolute inset-0 bg-[#d7a217] blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#d7a217]/10 to-transparent flex items-center justify-center border border-[#d7a217]/30 backdrop-blur-md shadow-[0_0_40px_rgba(215,162,23,0.1)]">
                          <History size={48} className="text-[#d7a217]" />
                        </div>
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#d7a217] to-[#b8860b]">
                        Log Tidak Ditemukan
                      </h3>
                      <p className="text-sm md:text-base font-bold opacity-60 max-w-md mx-auto leading-relaxed" style={{ color: isDarkMode ? '#cadfdf' : '#425c5a' }}>
                        {searchTerm || filter !== 'semua' || dateRange.start || dateRange.end
                          ? 'Coba sesuaikan parameter filter atau kata kunci pencarian Anda untuk melihat data.'
                          : 'Sistem belum mencatat aktivitas apapun pada saat ini.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION (Glassmorphism Advanced) --- */}
          {filteredLogs.length > 0 && (
            <div className={`p-6 md:p-8 border-t flex flex-col sm:flex-row justify-between items-center gap-5 relative z-10 backdrop-blur-3xl rounded-b-3xl ${isDarkMode ? 'bg-[#1a2b29]/40 border-[#cadfdf]/10' : 'bg-white/40 border-[#cadfdf]/30'}`}>
              <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase tracking-widest opacity-70" style={{ color: isDarkMode ? '#cadfdf' : '#3c5654' }}>Baris per hal:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-3 rounded-xl text-sm font-black outline-none cursor-pointer border focus:ring-2 focus:ring-[#d7a217]/50 transition-all duration-300 shadow-sm ${isDarkMode ? 'bg-[#1e2e2d] border-[#cadfdf]/20 text-white' : 'bg-white border-[#cadfdf]/60 text-[#425c5a]'}`}
                >
                  <option value="25">25 Data</option>
                  <option value="50">50 Data</option>
                  <option value="100">100 Data</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-2 rounded-2xl border border-black/10 dark:border-white/10 shadow-inner backdrop-blur-md">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl transition-all duration-300 hover:bg-[#d7a217]/20 hover:text-[#d7a217] hover:shadow-md disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:hover:shadow-none text-[#425c5a] dark:text-[#cadfdf]"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="px-6 py-2 rounded-xl bg-white/50 dark:bg-black/40 shadow-sm border border-white/20 dark:border-black/20">
                  <span className="text-xs md:text-sm font-black uppercase tracking-widest text-[#425c5a] dark:text-[#cadfdf]">
                    Hal <span className="text-[#d7a217] text-base mx-1">{currentPage}</span> / {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl transition-all duration-300 hover:bg-[#d7a217]/20 hover:text-[#d7a217] hover:shadow-md disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:hover:shadow-none text-[#425c5a] dark:text-[#cadfdf]"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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

export default LogsView;