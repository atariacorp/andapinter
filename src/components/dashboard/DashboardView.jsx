import React, { useMemo } from 'react';
import { 
  Inbox, Clock, FileCheck, FileX, 
  PieChart, BarChart2, CalendarDays, Layers 
} from 'lucide-react';
import StatCard from '../common/StatCard';

const DashboardView = ({ 
  filteredProposals, 
  tahapList, 
  tahunList,
  selectedTahap, 
  setSelectedTahap, 
  selectedYear, 
  setSelectedYear,
  setCurrentPage 
}) => {
  
  // Hitung statistik dashboard
  const chartData = useMemo(() => {
    const total = filteredProposals.length;
    const pending = filteredProposals.filter(p => p.status === 'Pending' || p.status === 'Diverifikasi').length;
    const approved = filteredProposals.filter(p => p.status === 'Disetujui').length;
    const rejected = filteredProposals.filter(p => String(p.status).includes('Ditolak')).length;

    const skpdCounts = {};
    filteredProposals.forEach(p => {
      skpdCounts[p.skpd] = (skpdCounts[p.skpd] || 0) + 1;
    });
    const topSkpds = Object.entries(skpdCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);
    const maxSkpdCount = topSkpds.length > 0 ? topSkpds[0][1] : 1;

    return { total, pending, approved, rejected, topSkpds, maxSkpdCount };
  }, [filteredProposals]);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Monitoring Berkas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Dashboard Utama Aplikasi Pendataan Pergeseran Anggaran
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Tahap */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <Layers size={18} className="text-blue-500 ml-2" />
            <select 
              value={selectedTahap} 
              onChange={e => setSelectedTahap(e.target.value)} 
              className="bg-transparent text-sm font-bold text-blue-600 dark:text-blue-400 outline-none cursor-pointer pr-2"
            >
              <option value="Semua">Semua Tahap</option>
              {tahapList && tahapList.length > 0 ? (
                tahapList.map(t => (
                  <option key={t.id} value={t.nama}>
                    {String(t.nama || t.id || "Tanpa Nama")}
                  </option>
                ))
              ) : null}
            </select>
          </div>
          
          {/* Filter Tahun */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <CalendarDays size={18} className="text-slate-400 ml-2" />
            <select 
              value={selectedYear} 
              onChange={e => {
                setSelectedYear(e.target.value); 
                setCurrentPage(1);
              }} 
              className="bg-transparent text-sm font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer pr-2"
            >
              <option value="Semua">Semua Tahun</option>
              {tahunList && tahunList.length > 0 ? (
                tahunList.map(t => (
                  <option key={t.id} value={t.tahun || t.nama}>
                    {t.tahun || t.nama}
                  </option>
                ))
              ) : (
                <>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </>
              )}
            </select>
          </div>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Masuk" 
          value={chartData.total} 
          icon={<Inbox size={18} className="text-blue-600 dark:text-blue-400"/>} 
          color="bg-blue-50" 
          darkColor="dark:bg-blue-900/20" 
          description="Filter Aktif" 
        />
        <StatCard 
          title="Proses" 
          value={chartData.pending} 
          icon={<Clock size={18} className="text-amber-600 dark:text-amber-400"/>} 
          color="bg-amber-50" 
          darkColor="dark:bg-amber-900/20" 
          description="Sedang Berjalan" 
        />
        <StatCard 
          title="Disetujui" 
          value={chartData.approved} 
          icon={<FileCheck size={18} className="text-emerald-600 dark:text-emerald-400"/>} 
          color="bg-emerald-50" 
          darkColor="dark:bg-emerald-900/20" 
          description="Selesai Final" 
        />
        <StatCard 
          title="Ditolak" 
          value={chartData.rejected} 
          icon={<FileX size={18} className="text-rose-600 dark:text-rose-400"/>} 
          color="bg-rose-50" 
          darkColor="dark:bg-rose-900/20" 
          description="Perlu Perbaikan" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Chart 1: Status Distribution */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-blue-600 dark:text-blue-400"/> 
            Distribusi Status Berkas
          </h3>
          
          <div className="flex-grow flex items-center justify-center gap-8">
            {chartData.total === 0 ? (
              <p className="text-slate-400 italic text-sm">Data tidak tersedia untuk filter ini.</p>
            ) : (
              <>
                {/* Donut Chart */}
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                      stroke={isDarkMode ? "#334155" : "#f1f5f9"} strokeWidth="4"></circle>
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                      stroke="#10b981" strokeWidth="4" 
                      strokeDasharray={`${(chartData.approved/chartData.total)*100} ${100 - (chartData.approved/chartData.total)*100}`} 
                      strokeDashoffset="100"></circle>
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                      stroke="#f43f5e" strokeWidth="4" 
                      strokeDasharray={`${(chartData.rejected/chartData.total)*100} ${100 - (chartData.rejected/chartData.total)*100}`} 
                      strokeDashoffset={`${100 - ((chartData.approved/chartData.total)*100)}`}></circle>
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                      stroke="#f59e0b" strokeWidth="4" 
                      strokeDasharray={`${(chartData.pending/chartData.total)*100} ${100 - (chartData.pending/chartData.total)*100}`} 
                      strokeDashoffset={`${100 - ((chartData.approved/chartData.total)*100) - ((chartData.rejected/chartData.total)*100)}`}></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{chartData.total}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Total</span>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Disetujui Final</span>
                    </div>
                    <span className="font-black dark:text-slate-100">
                      {((chartData.approved/chartData.total)*100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Ditolak</span>
                    </div>
                    <span className="font-black dark:text-slate-100">
                      {((chartData.rejected/chartData.total)*100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Berjalan</span>
                    </div>
                    <span className="font-black dark:text-slate-100">
                      {((chartData.pending/chartData.total)*100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chart 2: Top SKPDs */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-600 dark:text-blue-400"/> 
            5 Instansi Teraktif Mengusulkan
          </h3>
          
          <div className="flex-grow flex flex-col justify-center space-y-4">
            {chartData.topSkpds.length === 0 ? (
              <p className="text-slate-400 italic text-sm text-center">Data tidak tersedia untuk filter ini.</p>
            ) : (
              chartData.topSkpds.map(([name, count], index) => (
                <div key={index} className="w-full">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-3/4">
                      {String(name || "")}
                    </span>
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">
                      {String(count || "0")} Usulan
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${(count / chartData.maxSkpdCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;