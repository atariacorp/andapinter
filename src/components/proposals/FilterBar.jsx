import React from 'react';
import { Search, FileSpreadsheet, CalendarDays, Layers, Filter } from 'lucide-react';

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
  isProcessing
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Daftar Usulan Pergeseran
        </h2>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest italic">
          Akses: {currentUserLevel}
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        
        {/* BULK ACTION BUTTONS */}
        {selectedForBulk.length > 0 && ['Admin', 'Operator BKAD'].includes(currentUserLevel) && (
          <div className="flex gap-2 mr-2 border-r pr-4 border-slate-200 dark:border-slate-700 items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 mr-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              {selectedForBulk.length} Terpilih
            </span>
            
            {currentUserLevel === 'Operator BKAD' && (
              <>
                <button 
                  disabled={isProcessing} 
                  onClick={() => onBulkAction('Diverifikasi')} 
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg font-black text-[10px] shadow-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <Filter size={14}/> VERIFIKASI
                </button>
                <button 
                  disabled={isProcessing} 
                  onClick={() => onBulkAction('Ditolak Operator')} 
                  className="px-3 py-2 bg-rose-600 text-white rounded-lg font-black text-[10px] shadow-sm hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <Filter size={14}/> TOLAK
                </button>
              </>
            )}
            
            {currentUserLevel === 'Admin' && (
              <>
                <button 
                  disabled={isProcessing} 
                  onClick={() => onBulkAction('Disetujui')} 
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-black text-[10px] shadow-sm hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <Filter size={14}/> SETUJUI FINAL
                </button>
                <button 
                  disabled={isProcessing} 
                  onClick={() => onBulkAction('Ditolak Admin')} 
                  className="px-3 py-2 bg-rose-600 text-white rounded-lg font-black text-[10px] shadow-sm hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <Filter size={14}/> TOLAK
                </button>
              </>
            )}
          </div>
        )}

        {/* Filter Tahap */}
        <select 
          value={selectedTahap} 
          onChange={e => {
            setSelectedTahap(e.target.value);
          }} 
          className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-bold text-blue-600 dark:text-blue-400 shadow-sm outline-none transition-colors"
        >
          <option value="Semua">Semua Tahap</option>
          {tahapList && tahapList.length > 0 ? (
            tahapList.map(t => (
              <option key={t.id} value={t.nama}>{String(t.nama || "")}</option>
            ))
          ) : null}
        </select>

        {/* Filter Tahun */}
        <select 
          value={selectedYear} 
          onChange={e => {
            setSelectedYear(e.target.value);
          }} 
          className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 shadow-sm outline-none transition-colors"
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

        {/* Search Input */}
        <div className="relative group flex-grow md:w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari SKPD/No Surat..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }} 
            className="pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs w-full outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm transition-colors" 
          />
        </div>

        {/* Status Filter */}
        <select 
          value={statusFilter} 
          onChange={e => {
            setStatusFilter(e.target.value);
          }} 
          className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 shadow-sm outline-none transition-colors"
        >
          <option value="Semua">Semua Status</option>
          <option value="Pending">Pending (Verifikasi)</option>
          <option value="Diverifikasi">Diverifikasi (Setuju Admin)</option>
          <option value="Disetujui">Disetujui Final</option>
          <option value="Ditolak">Ditolak</option>
        </select>

        {/* Export Button */}
        <button 
          onClick={onExportCSV} 
          className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400" 
          title="Ekspor Excel"
        >
          <FileSpreadsheet size={18}/> EXCEL
        </button>

        {/* Add New Button */}
        {['SKPD', 'Admin', 'Operator BKAD'].includes(currentUserLevel) && (
          <button 
            onClick={onAddNew} 
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            TAMBAH USULAN
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;