import React, { useState, useEffect, useMemo } from 'react';
import { 
  History, Filter, Calendar, Download, RefreshCw,
  ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle,
  User, Activity, Clock, Database, FileText, Settings as SettingsIcon,
  LogIn, LogOut, Edit3, Trash2, Upload, CheckSquare, Search, Sparkles
} from 'lucide-react';

// --- Komponen Partikel Emas Mengambang ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 20 + 15,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#d7a217] animate-float-particle"
          style={{
            width: `${p.size}px`, height: `${p.size}px`,
            left: `${p.left}%`, top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.animDuration}s`,
            animationDelay: `${p.animDelay}s`,
            boxShadow: `0 0 ${p.size * 2}px #d7a217`,
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
  isDarkMode = false // Ditambahkan untuk konsistensi tema
}) => {
  const [filter, setFilter] = useState('semua');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [expandedLog, setExpandedLog] = useState(null);

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

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE': return <FileText size={14} className="text-emerald-500" />;
      case 'UPDATE': return <Edit3 size={14} className="text-blue-500" />;
      case 'DELETE': return <Trash2 size={14} className="text-rose-500" />;
      case 'UPDATE_STATUS': return <CheckSquare size={14} className="text-amber-500" />;
      case 'LOGIN': return <LogIn size={14} className="text-green-500" />;
      case 'LOGOUT': return <LogOut size={14} className="text-orange-500" />;
      case 'IMPORT': return <Upload size={14} className="text-purple-500" />;
      case 'REGISTER': return <User size={14} className="text-indigo-500" />;
      default: return <Activity size={14} className="text-[#d7a217]" />;
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'auth':
      case 'AUTH': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50';
      case 'proposal': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
      case 'bank_sro': return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50';
      case 'bank_catatan': return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/50';
      case 'master': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
      default: return 'bg-[#cadfdf]/30 text-[#3c5654] border-[#cadfdf] dark:bg-[#cadfdf]/10 dark:text-[#cadfdf] dark:border-[#cadfdf]/30';
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
      case 'UPDATE':
      case 'UPDATE_STATUS': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
      case 'DELETE': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50';
      case 'LOGIN': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50';
      case 'LOGOUT': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
      case 'IMPORT': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50';
      case 'REGISTER': return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50';
      default: return 'bg-[#cadfdf]/30 text-[#3c5654] border-[#cadfdf] dark:bg-[#cadfdf]/10 dark:text-[#cadfdf] dark:border-[#cadfdf]/30';
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

  // --- Konstanta Desain ---
  const glassCard = isDarkMode 
    ? "bg-[#3c5654]/40 backdrop-blur-xl border border-[#cadfdf]/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-2xl transition-all duration-500"
    : "bg-white/60 backdrop-blur-xl border border-[#cadfdf]/80 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-500";
    
  const glassInput = isDarkMode
    ? "bg-black/20 border border-[#cadfdf]/20 text-[#e2eceb] focus:ring-2 focus:ring-[#d7a217]/50 rounded-xl outline-none transition-all duration-300 placeholder-[#cadfdf]/40"
    : "bg-white/70 border border-[#cadfdf]/60 text-[#425c5a] focus:ring-2 focus:ring-[#d7a217]/50 rounded-xl outline-none transition-all duration-300 placeholder-[#3c5654]/50";

  return (
    <div className={`relative space-y-6 animate-in fade-in font-sans min-h-screen ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#3c5654]'}`}>
      
      {/* Background Ambience & Particles */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#d7a217]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-0 w-[50%] h-[50%] bg-[#425c5a]/20 dark:bg-[#cadfdf]/10 rounded-full blur-[100px]"></div>
      </div>
      <FloatingGoldParticles />

      <div className="relative z-10">
        {/* --- HEADER --- */}
        <div className={`${glassCard} p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#425c5a] to-[#3c5654] dark:from-[#cadfdf]/10 dark:to-[#cadfdf]/5 flex items-center justify-center shadow-inner border border-[#d7a217]/30">
              <History size={24} className="text-[#d7a217]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#d7a217]/10 border border-[#d7a217]/30 mb-1.5">
                <Sparkles size={12} className="text-[#d7a217]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d7a217]">Sistem Monitoring</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#425c5a] dark:text-white">
                Log Aktivitas
              </h1>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={onRefresh}
              disabled={loading}
              className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md ${isDarkMode ? 'bg-[#3c5654]/60 border border-[#cadfdf]/20 text-[#cadfdf] hover:bg-[#cadfdf]/20' : 'bg-white/80 border border-[#cadfdf]/60 text-[#425c5a] hover:bg-white'}`}
              title="Refresh Data"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin text-[#d7a217]' : ''} />
            </button>
            
            <button
              onClick={handleExport}
              className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-br from-[#d7a217] to-[#c29115] hover:shadow-[0_0_15px_rgba(215,162,23,0.5)] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Download size={16} /> EXPORT CSV
            </button>
          </div>
        </div>

        {/* --- FILTER PANEL (Glassmorphism) --- */}
        <div className={`${glassCard} p-6 mb-6 hover:shadow-lg`}>
          <div className="flex items-center gap-2 mb-4 border-b border-[#cadfdf]/50 dark:border-[#cadfdf]/10 pb-4">
            <Filter size={16} className="text-[#d7a217]" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#425c5a] dark:text-[#cadfdf]">
              Parameter Pencarian
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* Filter Kategori */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">Kategori</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`${glassInput} w-full p-3.5 appearance-none cursor-pointer`}
              >
                <option value="semua" className="bg-white dark:bg-[#425c5a]">Semua Kategori</option>
                <option value="auth" className="bg-white dark:bg-[#425c5a]">Autentikasi (Auth)</option>
                <option value="proposal" className="bg-white dark:bg-[#425c5a]">Usulan / Proposal</option>
                <option value="master" className="bg-white dark:bg-[#425c5a]">Master Data</option>
                <option value="bank_sro" className="bg-white dark:bg-[#425c5a]">Bank SRO</option>
                <option value="bank_catatan" className="bg-white dark:bg-[#425c5a]">Bank Catatan</option>
              </select>
            </div>
            
            {/* Filter Tanggal Mulai */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">Dari Tanggal</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50 pointer-events-none" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className={`${glassInput} w-full pl-10 pr-3.5 py-3.5 cursor-pointer`}
                />
              </div>
            </div>
            
            {/* Filter Tanggal Akhir */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">Sampai Tanggal</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50 pointer-events-none" />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className={`${glassInput} w-full pl-10 pr-3.5 py-3.5 cursor-pointer`}
                />
              </div>
            </div>
            
            {/* Pencarian */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">Cari Kata Kunci</label>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari user, deskripsi, aksi..."
                  className={`${glassInput} w-full pl-10 pr-3.5 py-3.5`}
                />
              </div>
            </div>
          </div>
          
          {/* Tombol Reset Filter */}
          {(filter !== 'semua' || dateRange.start || dateRange.end || searchTerm) && (
            <div className="mt-5 flex justify-end animate-in fade-in slide-in-from-top-2">
              <button
                onClick={() => {
                  setFilter('semua');
                  setDateRange({ start: '', end: '' });
                  setSearchTerm('');
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 ${isDarkMode ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30' : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'}`}
              >
                <X size={14} /> RESET FILTER
              </button>
            </div>
          )}
        </div>

        {/* --- INFO BAR --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 px-2">
          <span className="text-xs font-semibold text-[#3c5654]/80 dark:text-[#cadfdf]/80">
            Menampilkan <span className="text-[#425c5a] dark:text-white font-black">{paginatedLogs.length}</span> dari <span className="text-[#425c5a] dark:text-white font-black">{filteredLogs.length}</span> log 
            {filteredLogs.length !== activityLogs.length && ` (difilter dari total ${activityLogs.length})`}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#d7a217]/10 text-[#d7a217] border border-[#d7a217]/30 px-3 py-1.5 rounded-full shadow-sm">
            Status: Real-time
          </span>
        </div>

        {/* --- TABEL LOGS (ECharts Aesthetic) --- */}
        <div className={`${glassCard} overflow-hidden hover:shadow-xl relative`}>
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="overflow-x-auto relative z-10 custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className={`text-[10px] font-black uppercase tracking-widest border-b ${isDarkMode ? 'bg-[#3c5654]/60 text-[#cadfdf] border-[#cadfdf]/20' : 'bg-[#cadfdf]/30 text-[#425c5a] border-[#cadfdf]/60'}`}>
                  <th className="p-4 whitespace-nowrap">Waktu</th>
                  <th className="p-4 whitespace-nowrap">User</th>
                  <th className="p-4 whitespace-nowrap">Level</th>
                  <th className="p-4 whitespace-nowrap">Kategori</th>
                  <th className="p-4 whitespace-nowrap">Aksi</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4 text-center whitespace-nowrap">Analisis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cadfdf]/40 dark:divide-[#cadfdf]/10">
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <tr className={`transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-white/60'}`}>
                        <td className="p-4 whitespace-nowrap align-top">
                          <div className="flex items-center gap-2 text-[11px] font-medium text-[#3c5654]/90 dark:text-[#cadfdf]/90">
                            <Clock size={12} className="text-[#d7a217]" />
                            {formatTimestamp(log.timestamp)}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#425c5a] dark:text-white">
                            <div className="w-6 h-6 rounded-full bg-[#d7a217]/20 flex items-center justify-center text-[#d7a217] shrink-0">
                              <User size={12} />
                            </div>
                            {log.userName || 'System'}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase border shadow-sm ${
                            log.userLevel === 'Admin' ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50' :
                            log.userLevel === 'Operator BKAD' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' :
                            log.userLevel === 'SKPD' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50' :
                            'bg-[#cadfdf]/30 text-[#3c5654] border-[#cadfdf] dark:bg-[#cadfdf]/10 dark:text-[#cadfdf] dark:border-[#cadfdf]/30'
                          }`}>
                            {log.userLevel || 'System'}
                          </span>
                        </td>
                        <td className="p-4 align-top">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase border shadow-sm ${getCategoryBadge(log.category)}`}>
                            {log.category || '-'}
                          </span>
                        </td>
                        <td className="p-4 align-top">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black border shadow-sm flex items-center gap-1.5 w-fit ${getActionBadge(log.action)}`}>
                            {getActionIcon(log.action)}
                            {log.action || '-'}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium text-[#3c5654] dark:text-[#cadfdf] max-w-xs truncate group-hover:whitespace-normal group-hover:text-clip transition-all duration-300 align-top">
                          {log.description}
                        </td>
                        <td className="p-4 text-center align-top">
                          <button
                            onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                            className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all bg-[#d7a217]/10 text-[#d7a217] border border-[#d7a217]/30 hover:bg-[#d7a217] hover:text-white shadow-sm"
                          >
                            {expandedLog === log.id ? 'Tutup' : 'Detail'}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Row - Terminal / Tooltip Aesthetic */}
                      {expandedLog === log.id && (
                        <tr className="animate-in slide-in-from-top-2 duration-300">
                          <td colSpan="7" className="p-0 border-b border-[#cadfdf]/40 dark:border-[#cadfdf]/10">
                            <div className={`p-6 m-4 rounded-xl border border-[#d7a217]/30 shadow-inner ${isDarkMode ? 'bg-[#1a2625]' : 'bg-[#e2eceb]/50'}`}>
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d7a217] flex items-center gap-2 mb-4">
                                <Database size={14} /> Payload Data Teknis
                              </h4>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                                {log.dataId && (
                                  <div className="col-span-full">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#3c5654]/70 dark:text-[#cadfdf]/70">Reference ID:</span>
                                    <code className="ml-2 px-2 py-1 rounded bg-black/10 dark:bg-white/10 font-mono text-[11px] text-[#425c5a] dark:text-[#cadfdf]">{log.dataId}</code>
                                  </div>
                                )}
                                
                                {log.oldData && (
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500 flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-rose-500"></span> State Sebelumnya
                                    </p>
                                    <div className="relative group/code">
                                      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent rounded-xl pointer-events-none"></div>
                                      <pre className={`p-4 rounded-xl border font-mono text-[10px] overflow-x-auto custom-scrollbar relative z-10 ${isDarkMode ? 'bg-black/40 border-rose-500/20 text-rose-200' : 'bg-white/80 border-rose-200 text-rose-800'}`}>
                                        {JSON.stringify(JSON.parse(log.oldData), null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                )}
                                
                                {log.newData && (
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> State Terbaru
                                    </p>
                                    <div className="relative group/code">
                                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-xl pointer-events-none"></div>
                                      <pre className={`p-4 rounded-xl border font-mono text-[10px] overflow-x-auto custom-scrollbar relative z-10 ${isDarkMode ? 'bg-black/40 border-emerald-500/20 text-emerald-200' : 'bg-white/80 border-emerald-200 text-emerald-800'}`}>
                                        {JSON.stringify(JSON.parse(log.newData), null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                )}
                                
                                {!log.oldData && !log.newData && (
                                  <div className="col-span-full p-4 rounded-xl border border-dashed border-[#cadfdf]/50 text-center">
                                    <p className="text-xs font-medium text-[#3c5654]/50 dark:text-[#cadfdf]/50 italic">Payload data tidak tersedia untuk aktivitas ini.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-16 text-center">
                      <div className="w-20 h-20 rounded-full bg-[#d7a217]/10 flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <History size={36} className="text-[#d7a217]" />
                      </div>
                      <h3 className="text-base font-black uppercase tracking-widest text-[#425c5a] dark:text-[#cadfdf] mb-1">
                        Log Tidak Ditemukan
                      </h3>
                      <p className="text-xs font-medium text-[#3c5654]/70 dark:text-[#cadfdf]/60 max-w-sm mx-auto">
                        {searchTerm || filter !== 'semua' || dateRange.start || dateRange.end
                          ? 'Coba sesuaikan filter atau kata kunci pencarian Anda untuk melihat data.'
                          : 'Sistem belum mencatat aktivitas apapun.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION (Glassmorphism) --- */}
          {filteredLogs.length > 0 && (
            <div className={`p-5 border-t flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 ${isDarkMode ? 'bg-[#3c5654]/40 border-[#cadfdf]/20' : 'bg-[#cadfdf]/10 border-[#cadfdf]/40'}`}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/80">Limit:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer border focus:ring-2 focus:ring-[#d7a217]/50 ${isDarkMode ? 'bg-[#425c5a] border-[#cadfdf]/30 text-white' : 'bg-white border-[#cadfdf] text-[#425c5a]'}`}
                >
                  <option value="25">25 Baris</option>
                  <option value="50">50 Baris</option>
                  <option value="100">100 Baris</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-1.5 rounded-xl border border-[#cadfdf]/50 dark:border-[#cadfdf]/20 shadow-sm">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg transition-all hover:bg-[#d7a217] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit text-[#425c5a] dark:text-[#cadfdf]"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <span className="text-[11px] font-black uppercase tracking-widest px-3 text-[#425c5a] dark:text-[#cadfdf]">
                  Halaman <span className="text-[#d7a217]">{currentPage}</span> / {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg transition-all hover:bg-[#d7a217] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit text-[#425c5a] dark:text-[#cadfdf]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Internal CSS for Animations and Custom Scrollbar */}
      <style jsx>{`
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: var(--opacity, 0.4); }
          80% { opacity: var(--opacity, 0.4); }
          100% { transform: translateY(-100px) translateX(30px) scale(0.8); opacity: 0; }
        }
        .animate-float-particle {
          animation-name: float-particle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.6);
        }
      `}</style>
    </div>
  );
};

export default LogsView;