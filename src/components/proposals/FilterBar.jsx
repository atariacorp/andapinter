import React, { useState, useEffect } from 'react';
import { Search, CalendarDays, Layers, Filter, Download, Plus, CheckSquare } from 'lucide-react';

// --- Komponen Partikel Emas Mengambang Khusus Filter Bar ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 15 + 10,
      animDelay: Math.random() * -15,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-2xl">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#d7a217] animate-float-filter"
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

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  selectedTahap,
  setSelectedTahap,
  selectedYear,
  setSelectedYear,
  tahapList,
  tahunList,
  currentUserLevel,
  selectedForBulk,
  onBulkAction,
  onExportCSV,
  onAddNew,
  isProcessing,
  isDarkMode
}) => {
  
  // Palet warna teal & gold
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealLight: '#e2eceb',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };

  const glassInput = isDarkMode
    ? "bg-black/20 border border-[#cadfdf]/20 text-[#e2eceb] focus:ring-2 focus:ring-[#d7a217]/50 rounded-xl outline-none transition-all duration-300 placeholder-[#cadfdf]/40"
    : "bg-white/70 border border-[#cadfdf]/60 text-[#425c5a] focus:ring-2 focus:ring-[#d7a217]/50 rounded-xl outline-none transition-all duration-300 placeholder-[#3c5654]/50";

  return (
    <div 
      className={`relative p-5 rounded-2xl backdrop-blur-xl border transition-all duration-500 shadow-sm hover:shadow-xl group/filterbar ${
        isDarkMode 
          ? 'bg-[#3c5654]/40 border-[#cadfdf]/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]' 
          : 'bg-white/60 border-[#cadfdf]/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Background Aesthetic ECharts (Subtle Grid) & Particles */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] z-0 rounded-2xl" 
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      />
      <FloatingGoldParticles />

      <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        
        {/* Title Section (Parallax Hover) */}
        <div className="transform transition-transform duration-500 group-hover/filterbar:translate-x-1 shrink-0">
          <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#425c5a]'}`}>
            Database Usulan
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d7a217] shadow-[0_0_8px_#d7a217] animate-pulse"></span>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-[#cadfdf]/80' : 'text-[#3c5654]/80'}`}>
              Otoritas: <span className="text-[#d7a217]">{currentUserLevel}</span>
            </p>
          </div>
        </div>
        
        {/* Control Area */}
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full xl:w-auto">
          
          {/* Main Filters (Glassmorphism) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full lg:w-auto">
            
            {/* Search */}
            <div className="relative group/input">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50 group-focus-within/input:text-[#d7a217] transition-colors duration-300" />
              <input 
                type="text" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Cari Instansi / Nomor..." 
                className={`${glassInput} w-full pl-9 pr-3.5 py-3 text-xs font-medium shadow-inner`} 
              />
            </div>
            
            {/* Filter Status */}
            <div className="relative group/input">
              <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50 group-focus-within/input:text-[#d7a217] transition-colors duration-300" />
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)} 
                className={`${glassInput} w-full pl-9 pr-3.5 py-3 text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer shadow-inner`}
              >
                <option value="Semua" className="bg-white dark:bg-[#425c5a] text-[#425c5a] dark:text-white">Semua Status</option>
                <option value="Pending" className="bg-white dark:bg-[#425c5a] text-amber-600 dark:text-amber-400">Pending</option>
                <option value="Diverifikasi" className="bg-white dark:bg-[#425c5a] text-indigo-600 dark:text-indigo-400">Diverifikasi</option>
                <option value="Disetujui" className="bg-white dark:bg-[#425c5a] text-emerald-600 dark:text-emerald-400">Disetujui</option>
                <option value="Ditolak" className="bg-white dark:bg-[#425c5a] text-rose-600 dark:text-rose-400">Ditolak</option>
              </select>
            </div>
            
            {/* Filter Tahap */}
            <div className="relative group/input">
              <Layers size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50 group-focus-within/input:text-[#d7a217] transition-colors duration-300" />
              <select 
                value={selectedTahap} 
                onChange={e => setSelectedTahap(e.target.value)} 
                className={`${glassInput} w-full pl-9 pr-3.5 py-3 text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer shadow-inner`}
              >
                <option value="Semua" className="bg-white dark:bg-[#425c5a] text-[#425c5a] dark:text-white">Semua Tahap</option>
                {tahapList?.map(t => <option key={t.id} value={t.nama} className="bg-white dark:bg-[#425c5a] text-[#425c5a] dark:text-white">{t.nama}</option>)}
              </select>
            </div>
            
            {/* Filter Tahun */}
            <div className="relative group/input">
              <CalendarDays size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50 group-focus-within/input:text-[#d7a217] transition-colors duration-300" />
              <select 
                value={selectedYear} 
                onChange={e => setSelectedYear(e.target.value)} 
                className={`${glassInput} w-full pl-9 pr-3.5 py-3 text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer shadow-inner`}
              >
                <option value="Semua" className="bg-white dark:bg-[#425c5a] text-[#425c5a] dark:text-white">Semua Tahun</option>
                {tahunList?.map(t => <option key={t.id} value={t.tahun} className="bg-white dark:bg-[#425c5a] text-[#425c5a] dark:text-white">{t.tahun}</option>)}
              </select>
            </div>
          </div>

          {/* Action Buttons Container */}
          <div className={`flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 ${isDarkMode ? 'border-[#cadfdf]/20' : 'border-[#cadfdf]/60'}`}>
            
            {/* BULK ACTION BUTTONS (Show only if selected and authorized) */}
            {selectedForBulk?.length > 0 && ['Admin', 'Operator BKAD'].includes(currentUserLevel) && (
              <div className="flex items-center gap-2 bg-[#d7a217]/10 p-1.5 rounded-xl border border-[#d7a217]/30 shadow-inner animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-1.5 px-3">
                  <CheckSquare size={12} className="text-[#d7a217]" />
                  <span className="text-[10px] font-black text-[#d7a217] uppercase tracking-widest">{selectedForBulk.length} Data</span>
                </div>
                
                {currentUserLevel === 'Operator BKAD' && (
                  <>
                    <button 
                      disabled={isProcessing} 
                      onClick={() => onBulkAction('Diverifikasi')} 
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 shadow-md"
                    >
                      VERIF
                    </button>
                    <button 
                      disabled={isProcessing} 
                      onClick={() => onBulkAction('Ditolak Operator')} 
                      className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 shadow-md"
                    >
                      TOLAK
                    </button>
                  </>
                )}
                
                {currentUserLevel === 'Admin' && (
                  <>
                    <button 
                      disabled={isProcessing} 
                      onClick={() => onBulkAction('Disetujui')} 
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 shadow-md"
                    >
                      SETUJUI
                    </button>
                    <button 
                      disabled={isProcessing} 
                      onClick={() => onBulkAction('Ditolak Admin')} 
                      className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 shadow-md"
                    >
                      TOLAK
                    </button>
                  </>
                )}
              </div>
            )}

            {/* General Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto ml-auto">
              <button 
                onClick={onExportCSV} 
                className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-sm border ${
                  isDarkMode 
                    ? 'bg-black/30 border-[#cadfdf]/20 text-[#cadfdf] hover:bg-black/50 hover:border-[#d7a217]/50 hover:text-[#d7a217]' 
                    : 'bg-white/80 border-[#cadfdf]/60 text-[#425c5a] hover:bg-white hover:border-[#d7a217]/50 hover:text-[#d7a217]'
                }`}
              >
                <Download size={14}/> EXPORT
              </button>
              
              {['SKPD', 'Admin', 'Operator BKAD'].includes(currentUserLevel) && (
                <button 
                  onClick={onAddNew} 
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(215,162,23,0.4)] shadow-lg shadow-[#d7a217]/20 bg-gradient-to-br from-[#d7a217] to-[#c29115] text-white"
                >
                  <Plus size={16}/> BUAT USULAN
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-filter {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: var(--opacity, 0.4); }
          80% { opacity: var(--opacity, 0.4); }
          100% { transform: translateY(-50px) translateX(20px) scale(0.8); opacity: 0; }
        }
        .animate-float-filter {
          animation-name: float-filter;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default FilterBar;