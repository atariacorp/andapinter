import React, { useState, useEffect, useMemo } from 'react';
import { 
  History, Filter, Calendar, Download, RefreshCw,
  ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle,
  User, Activity, Clock, Database, FileText, Settings as SettingsIcon,
  LogIn, LogOut, Edit3, Trash2, Upload, CheckSquare
} from 'lucide-react';

const LogsView = ({ 
  addNotification,
  activityLogs = [],
  loading = false,
  onRefresh,
  onExport
}) => {
  const [filter, setFilter] = useState('semua');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [expandedLog, setExpandedLog] = useState(null);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter(log => {
      // Filter kategori
      if (filter !== 'semua' && log.category !== filter) return false;
      
      // Filter tanggal
      if (dateRange.start && log.timestamp < dateRange.start) return false;
      if (dateRange.end && log.timestamp > dateRange.end + 'T23:59:59') return false;
      
      // Pencarian teks
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

  // Pagination
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // Reset ke halaman 1 ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, dateRange, searchTerm]);

  // Format tanggal untuk display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Dapatkan icon berdasarkan action
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
      default: return <Activity size={14} className="text-slate-500" />;
    }
  };

  // Dapatkan warna badge berdasarkan kategori
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'auth':
      case 'AUTH':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'proposal':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'bank_sro':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'bank_catatan':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      case 'master':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  // Dapatkan warna badge berdasarkan action
  const getActionBadge = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'UPDATE':
      case 'UPDATE_STATUS':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'DELETE':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      case 'LOGIN':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'LOGOUT':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'IMPORT':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'REGISTER':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  // Handler export CSV
  const handleExport = () => {
    const headers = ['Waktu', 'User', 'Level', 'Kategori', 'Aksi', 'Deskripsi', 'Data ID'];
    const rows = filteredLogs.map(log => [
      log.timestamp || '',
      log.userName || '',
      log.userLevel || '',
      log.category || '',
      log.action || '',
      log.description || '',
      log.dataId || ''
    ]);

    const csvContent = "\uFEFF" + headers.join(';') + '\n' + 
                      rows.map(r => r.join(';')).join('\n');
    
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

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <History size={24} className="text-blue-500" />
            History Log Aktivitas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Catatan semua aktivitas dalam sistem
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase shadow-lg flex items-center gap-2"
          >
            <Download size={14} /> EXPORT CSV
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Filter Kategori */}
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">
              Kategori
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800"
            >
              <option value="semua">Semua Kategori</option>
              <option value="auth">Auth</option>
              <option value="proposal">Usulan</option>
              <option value="master">Master Data</option>
              <option value="bank_sro">Bank SRO</option>
              <option value="bank_catatan">Bank Catatan</option>
            </select>
          </div>
          
          {/* Filter Tanggal Mulai */}
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800"
            />
          </div>
          
          {/* Filter Tanggal Akhir */}
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800"
            />
          </div>
          
          {/* Pencarian */}
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">
              Cari
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari user/deskripsi..."
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800"
            />
          </div>
        </div>
        
        {/* Tombol Reset Filter */}
        {(filter !== 'semua' || dateRange.start || dateRange.end || searchTerm) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilter('semua');
                setDateRange({ start: '', end: '' });
                setSearchTerm('');
              }}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase flex items-center gap-1"
            >
              <X size={12} /> RESET FILTER
            </button>
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="flex justify-between items-center text-xs text-slate-500">
        <span>
          Menampilkan {paginatedLogs.length} dari {filteredLogs.length} log 
          {filteredLogs.length !== activityLogs.length && ` (difilter dari ${activityLogs.length} total)`}
        </span>
        <span className="text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
          100 log terbaru
        </span>
      </div>

      {/* Tabel Logs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <th className="p-4">Waktu</th>
                <th className="p-4">User</th>
                <th className="p-4">Level</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Aksi</th>
                <th className="p-4">Deskripsi</th>
                <th className="p-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-xs">
                      <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-1">
                          <User size={12} className="text-slate-400" />
                          {log.userName || 'System'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          log.userLevel === 'Admin' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                          log.userLevel === 'Operator BKAD' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          log.userLevel === 'SKPD' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {log.userLevel || 'System'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getCategoryBadge(log.category)}`}>
                          {log.category || '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black flex items-center gap-1 w-fit ${getActionBadge(log.action)}`}>
                          {getActionIcon(log.action)}
                          {log.action || '-'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {log.description}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-[9px] font-black uppercase"
                        >
                          {expandedLog === log.id ? 'Sembunyikan' : 'Lihat'}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Row untuk Detail Data */}
                    {expandedLog === log.id && (
                      <tr className="bg-slate-50 dark:bg-slate-900/50">
                        <td colSpan="7" className="p-4">
                          <div className="space-y-2 text-xs">
                            <p className="font-bold text-slate-700 dark:text-slate-300">Detail Data:</p>
                            
                            {log.dataId && (
                              <p><span className="font-medium text-slate-500">Data ID:</span> {log.dataId}</p>
                            )}
                            
                            {log.oldData && (
                              <div>
                                <p className="font-medium text-slate-500 mb-1">Data Sebelum:</p>
                                <pre className="bg-white dark:bg-slate-800 p-2 rounded border text-[9px] overflow-x-auto">
                                  {JSON.stringify(JSON.parse(log.oldData), null, 2)}
                                </pre>
                              </div>
                            )}
                            
                            {log.newData && (
                              <div>
                                <p className="font-medium text-slate-500 mb-1">Data Sesudah:</p>
                                <pre className="bg-white dark:bg-slate-800 p-2 rounded border text-[9px] overflow-x-auto">
                                  {JSON.stringify(JSON.parse(log.newData), null, 2)}
                                </pre>
                              </div>
                            )}
                            
                            {!log.oldData && !log.newData && (
                              <p className="text-slate-400 italic">Tidak ada detail data</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-10 text-center">
                    <History size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-slate-400 dark:text-slate-500 italic">
                      {searchTerm || filter !== 'semua' || dateRange.start || dateRange.end
                        ? 'Tidak ada log yang sesuai filter'
                        : 'Belum ada log aktivitas'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Baris per halaman:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded p-1 text-xs"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white dark:bg-slate-700 border rounded disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              
              <span className="text-xs font-medium">
                Halaman {currentPage} dari {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
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

export default LogsView;