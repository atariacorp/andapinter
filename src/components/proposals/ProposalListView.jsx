import React, { useMemo, useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Plus, Layers, 
  CalendarDays, ChevronLeft, ChevronRight, 
  Edit3, Trash2, FileText, Printer, Settings2 
} from 'lucide-react';

// ============================================================================
// MOCK COMPONENTS (Ditambahkan agar dapat dirender di pratinjau ini. 
// Saat disalin ke proyek lokal Anda, Anda dapat menghapus bagian mock ini 
// dan menggunakan import asli Anda).
// ============================================================================

const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val || 0);

const StatusBadge = ({ status }) => {
  let bg = 'bg-[#e2eceb] text-[#425c5a] border-[#cadfdf] dark:bg-[#3c5654] dark:text-[#cadfdf] dark:border-[#425c5a]';
  if (status === 'Disetujui') bg = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
  else if (status === 'Ditolak Operator' || status === 'Ditolak Admin') bg = 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50';
  else if (status === 'Diverifikasi') bg = 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50';
  else if (status === 'Pending') bg = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50';
  
  return (
    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm ${bg} transition-colors inline-flex items-center justify-center`}>
      {status || 'Draft'}
    </span>
  );
};

const FilterBar = ({ 
  searchTerm, setSearchTerm, statusFilter, setStatusFilter, selectedTahap, setSelectedTahap, 
  selectedYear, setSelectedYear, tahapList, tahunList, currentUserLevel, selectedForBulk, 
  onBulkAction, onExportCSV, onAddNew, isProcessing, isDarkMode 
}) => {
  const glassInput = isDarkMode
    ? "bg-black/20 border border-[#cadfdf]/20 text-[#e2eceb] focus:ring-2 focus:ring-[#d7a217]/50 rounded-xl outline-none transition-all duration-300 placeholder-[#cadfdf]/40"
    : "bg-white/70 border border-[#cadfdf]/60 text-[#425c5a] focus:ring-2 focus:ring-[#d7a217]/50 rounded-xl outline-none transition-all duration-300 placeholder-[#3c5654]/50";

  return (
    <div className={`p-5 rounded-2xl backdrop-blur-xl border transition-all duration-500 shadow-sm hover:shadow-lg ${isDarkMode ? 'bg-[#3c5654]/40 border-[#cadfdf]/20' : 'bg-white/60 border-[#cadfdf]/80'}`}>
      <div className="flex flex-col xl:flex-row justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="relative group/filter">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Cari Instansi..." className={`${glassInput} w-full pl-9 pr-3.5 py-3 text-xs`} />
          </div>
          <div className="relative group/filter">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${glassInput} w-full pl-9 pr-3.5 py-3 text-xs appearance-none cursor-pointer`}>
              <option value="Semua">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Diverifikasi">Diverifikasi</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
          <div className="relative group/filter">
            <Layers size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50" />
            <select value={selectedTahap} onChange={e => setSelectedTahap(e.target.value)} className={`${glassInput} w-full pl-9 pr-3.5 py-3 text-xs appearance-none cursor-pointer`}>
              <option value="Semua">Semua Tahap</option>
              {tahapList?.map(t => <option key={t.id} value={t.nama}>{t.nama}</option>)}
            </select>
          </div>
          <div className="relative group/filter">
            <CalendarDays size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3c5654]/50 dark:text-[#cadfdf]/50" />
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className={`${glassInput} w-full pl-9 pr-3.5 py-3 text-xs appearance-none cursor-pointer`}>
              <option value="Semua">Semua Tahun</option>
              {tahunList?.map(t => <option key={t.id} value={t.tahun}>{t.tahun}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap xl:flex-nowrap shrink-0">
          {selectedForBulk?.length > 0 && ['Admin', 'Operator BKAD'].includes(currentUserLevel) && (
            <div className="flex gap-2 bg-[#d7a217]/10 p-1.5 rounded-xl border border-[#d7a217]/30">
              <span className="text-[10px] font-bold text-[#d7a217] flex items-center px-2">{selectedForBulk.length} Dipilih:</span>
              {currentUserLevel === 'Operator BKAD' && (
                <button onClick={() => onBulkAction('Diverifikasi')} disabled={isProcessing} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[10px] font-bold transition-all">VERIF</button>
              )}
              {currentUserLevel === 'Admin' && (
                <button onClick={() => onBulkAction('Disetujui')} disabled={isProcessing} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold transition-all">SETUJUI</button>
              )}
            </div>
          )}
          <button onClick={onExportCSV} className="px-4 py-3 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 border border-[#cadfdf]/50 dark:border-[#cadfdf]/20 text-[#425c5a] dark:text-[#cadfdf] rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm hover:-translate-y-0.5">
            <Download size={14}/> EXPORT
          </button>
          <button onClick={onAddNew} className="px-5 py-3 bg-gradient-to-br from-[#d7a217] to-[#c29115] hover:shadow-[0_0_15px_rgba(215,162,23,0.5)] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg hover:-translate-y-0.5">
            <Plus size={16}/> BUAT USULAN
          </button>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange, totalItems, isDarkMode }) => (
  <div className={`p-5 border-t flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 ${isDarkMode ? 'bg-[#3c5654]/40 border-[#cadfdf]/20' : 'bg-[#cadfdf]/10 border-[#cadfdf]/40'}`}>
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/80">Limit:</span>
      <select value={itemsPerPage} onChange={(e) => { onItemsPerPageChange(Number(e.target.value)); onPageChange(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer border focus:ring-2 focus:ring-[#d7a217]/50 ${isDarkMode ? 'bg-[#425c5a] border-[#cadfdf]/30 text-white' : 'bg-white border-[#cadfdf] text-[#425c5a]'}`}>
        <option value="10">10 Baris</option>
        <option value="25">25 Baris</option>
        <option value="50">50 Baris</option>
      </select>
    </div>
    <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-1.5 rounded-xl border border-[#cadfdf]/50 dark:border-[#cadfdf]/20 shadow-sm">
      <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg transition-all hover:bg-[#d7a217] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit text-[#425c5a] dark:text-[#cadfdf]">
        <ChevronLeft size={16} />
      </button>
      <span className="text-[11px] font-black uppercase tracking-widest px-3 text-[#425c5a] dark:text-[#cadfdf]">
        Halaman <span className="text-[#d7a217]">{currentPage}</span> / {totalPages || 1}
      </span>
      <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg transition-all hover:bg-[#d7a217] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit text-[#425c5a] dark:text-[#cadfdf]">
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

const ProposalTableRow = ({ proposal, rincian, index, isFirstRow, rowSpan, selectedForBulk, onSelectBulk, currentUserLevel, canEdit, onDetail, onEdit, onDelete, onPrint, isDarkMode }) => {
  const isSelected = selectedForBulk?.includes(proposal.id);
  const selisih = Number(rincian.paguSesudah || 0) - Number(rincian.paguSebelum || 0);
  
  return (
    <tr className={`transition-colors hover:bg-white/40 dark:hover:bg-white/5 ${isSelected ? (isDarkMode ? 'bg-[#d7a217]/10' : 'bg-[#d7a217]/5') : ''}`}>
      {isFirstRow && ['Admin', 'Operator BKAD'].includes(currentUserLevel) && (
        <td rowSpan={rowSpan} className="p-4 align-top border-r border-[#cadfdf]/20 dark:border-[#cadfdf]/10 text-center">
          <input type="checkbox" checked={isSelected || false} onChange={(e) => onSelectBulk(proposal.id, e.target.checked)} className="w-4 h-4 rounded cursor-pointer accent-[#d7a217]" />
        </td>
      )}
      {isFirstRow && (
        <>
          <td rowSpan={rowSpan} className="p-4 align-top border-r border-[#cadfdf]/20 dark:border-[#cadfdf]/10">
            <span className="text-[10px] font-bold text-[#3c5654]/80 dark:text-[#cadfdf]/80">{proposal.tanggalSurat}</span>
          </td>
          <td rowSpan={rowSpan} className="p-4 align-top border-r border-[#cadfdf]/20 dark:border-[#cadfdf]/10">
            <span className="text-xs font-bold text-[#425c5a] dark:text-white">{proposal.nomorSurat}</span>
          </td>
          <td rowSpan={rowSpan} className="p-4 align-top border-r border-[#cadfdf]/20 dark:border-[#cadfdf]/10">
            <span className="text-xs font-semibold text-[#425c5a] dark:text-[#e2eceb] line-clamp-2">{proposal.skpd}</span>
          </td>
          <td rowSpan={rowSpan} className="p-4 align-top border-r border-[#cadfdf]/20 dark:border-[#cadfdf]/10">
            <span className="text-xs text-[#3c5654] dark:text-[#cadfdf] line-clamp-2">{proposal.subKegiatan}</span>
          </td>
        </>
      )}
      <td className="p-4 align-top font-mono text-[10px] text-[#3c5654] dark:text-[#cadfdf]/80">{rincian.kodeRekening}</td>
      <td className="p-4 align-top text-xs text-[#425c5a] dark:text-white line-clamp-2">{rincian.uraian}</td>
      <td className="p-4 align-top text-right text-xs font-medium text-[#3c5654]/90 dark:text-[#cadfdf] tabular-nums">{formatIDR(rincian.paguSebelum)}</td>
      <td className="p-4 align-top text-right text-xs font-bold text-[#d7a217] tabular-nums">{formatIDR(rincian.paguSesudah)}</td>
      <td className="p-4 align-top text-right tabular-nums">
        <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black ${
          selisih > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
          selisih < 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
          'text-[#3c5654] dark:text-[#cadfdf]'
        }`}>
          {selisih > 0 ? '+' : ''}{formatIDR(selisih)}
        </div>
      </td>
      {isFirstRow && (
        <>
          <td rowSpan={rowSpan} className="p-4 align-top border-l border-[#cadfdf]/20 dark:border-[#cadfdf]/10 text-center">
            <StatusBadge status={proposal.status} />
            <div className="mt-2 text-[9px] font-bold text-[#d7a217] uppercase tracking-widest">{proposal.tahap}</div>
          </td>
          <td rowSpan={rowSpan} className="p-4 align-top border-l border-[#cadfdf]/20 dark:border-[#cadfdf]/10">
            <div className="flex flex-col gap-1.5 items-center justify-center">
              <button onClick={() => onDetail(proposal)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors" title="Detail Analisa">
                <FileText size={14} />
              </button>
              <button onClick={() => onPrint(proposal)} className="p-1.5 rounded-lg bg-[#d7a217]/10 text-[#d7a217] hover:bg-[#d7a217]/20 transition-colors" title="Cetak BA">
                <Printer size={14} />
              </button>
              {canEdit && (
                <button onClick={() => onEdit(proposal)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-colors" title="Edit Usulan">
                  <Edit3 size={14} />
                </button>
              )}
              {canEdit && (
                <button onClick={() => onDelete(proposal)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 transition-colors" title="Hapus Usulan">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </td>
        </>
      )}
    </tr>
  );
};

const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i, size: Math.random() * 4 + 2, left: Math.random() * 100, top: Math.random() * 100,
      animDuration: Math.random() * 20 + 15, animDelay: Math.random() * -20, opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full bg-[#d7a217] animate-float-list"
          style={{ width: `${p.size}px`, height: `${p.size}px`, left: `${p.left}%`, top: `${p.top}%`,
            opacity: p.opacity, animationDuration: `${p.animDuration}s`, animationDelay: `${p.animDelay}s`, boxShadow: `0 0 ${p.size * 2}px #d7a217`,
          }} />
      ))}
    </div>
  );
};
// ============================================================================


// --- MAIN COMPONENT ---
const ProposalListView = ({
  currentUserProfile,
  proposals,
  masterData,
  setSelectedProposal,
  setLocalCatatan,
  setView,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  setDeleteConfirm,
  addNotification,
  isProcessing,
  setIsProcessing,
  handleBulkFinalize,
  isDarkMode
}) => {
  const {
    filteredProposals = [],
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    selectedTahap, setSelectedTahap,
    selectedYear, setSelectedYear,
    selectedForBulk = [], setSelectedForBulk,
    updateProposalStatus
  } = proposals || {};

  const { tahapList = [], tahunList = [] } = masterData || {};

  
  // Palet warna teal & gold
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealLight: '#e2eceb',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };

  // ===== FILTER BERDASARKAN LEVEL USER =====
const userLevelFilteredProposals = useMemo(() => {
  return filteredProposals.filter(p => {
    const userLevel = currentUserProfile?.level;
    
    // Super Admin dan Admin bisa melihat semua usulan
    if (userLevel === 'Super Admin' || userLevel === 'Admin') {
      return true;
    }
    
    // Operator BKAD: hanya melihat usulan dengan status Pending
    if (userLevel === 'Operator BKAD') {
      return p.status === 'Pending';
    }
    
    // Kepala Sub Bidang: hanya melihat usulan yang sudah diverifikasi
    if (userLevel === 'Kepala Sub Bidang') {
      return p.status === 'Diverifikasi';
    }
    
    // SKPD: hanya melihat usulan milik SKPD sendiri
    if (userLevel === 'SKPD') {
      return p.skpdId === currentUserProfile?.skpdId;
    }
    
    // TAPD/Viewer: bisa melihat semua tapi tidak bisa mengubah
    if (userLevel === 'TAPD' || userLevel === 'Viewer') {
      return true;
    }
    
    return false;
  });
}, [filteredProposals, currentUserProfile]);

  // Pagination logic
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProposals.slice(start, start + itemsPerPage);
  }, [filteredProposals, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);

  // Handle bulk selection
  const handleSelectAll = (checked) => {
    if (checked) setSelectedForBulk(currentData.map(p => p.id));
    else setSelectedForBulk([]);
  };

  const handleSelectBulk = (id, checked) => {
    if (checked) setSelectedForBulk(prev => [...prev, id]);
    else setSelectedForBulk(prev => prev.filter(item => item !== id));
  };

  // Handle bulk action
  const handleBulkAction = async (status) => {
    if (selectedForBulk.length === 0) return;
    setIsProcessing(true);
    try {
      await Promise.all(selectedForBulk.map(async (id) => {
        await updateProposalStatus(id, status, currentUserProfile.nama);
      }));
      addNotification(`✓ ${selectedForBulk.length} berkas sukses diproses`, 'success');
      setSelectedForBulk([]);
    } catch (err) {
      console.error(err);
      addNotification("Gagal memproses persetujuan massal", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle export CSV
  const handleExportCSV = () => {
    const headers = ["Tahap", "Tanggal Surat", "No. Surat", "SKPD", "Sub Kegiatan", 
                     "Kode Rekening", "Sub Rincian Objek", "Pagu Semula", 
                     "Pagu Sesudah", "Pagu Akhir (Selisih)", "Status", "Catatan Admin"];
    const rows = [];
    
    filteredProposals.forEach(p => {
      const rincianList = p.rincian && p.rincian.length > 0 
        ? p.rincian 
        : [{ kodeRekening: '-', uraian: String(p.subKegiatan || ''), paguSebelum: p.paguSebelum, paguSesudah: p.paguSesudah }];
      
      const catatanAdmin = p.hasilVerifikasi || '';
      
      rincianList.forEach((r) => {
        rows.push([
          `"${String(p.tahap || 'Belum Ditentukan')}"`,
          `"${String(p.tanggalSurat || '')}"`,
          `"${String(p.nomorSurat || '')}"`,
          `"${String(p.skpd || '')}"`,
          `"${String(p.subKegiatan || '')}"`,
          `"${String(r.kodeRekening || '')}"`,
          `"${String(r.uraian || '')}"`,
          r.paguSebelum,
          r.paguSesudah,
          Number(r.paguSesudah || 0) - Number(r.paguSebelum || 0),
          `"${String(p.status || '')}"`,
          `"${String(catatanAdmin).replace(/"/g, '""')}"` 
        ]);
      });
    });

    const csvContent = "\uFEFF" + headers.join(";") + "\n" + rows.map(r => r.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `rekap_usulan_${selectedYear || 'All'}_${(selectedTahap || 'All').replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("Data Excel Berhasil Diekspor", "success");
  };

  // Handle navigation
  const handleDetail = (proposal) => {
    setSelectedProposal(proposal);
    setLocalCatatan(proposal.hasilVerifikasi || '');
    setView('detail');
  };

  const handleEdit = (proposal) => {
    if(proposals.handleEditClick) proposals.handleEditClick(proposal);
    setView('add-proposal');
  };

  const handleDelete = (proposal) => {
    setDeleteConfirm({
      show: true,
      id: proposal.id,
      name: proposal.nomorSurat || 'Usulan ini',
      type: 'Usulan'
    });
  };

  const handlePrint = (proposal) => {
    setSelectedProposal(proposal);
    setView('detail');
    addNotification("Menyiapkan dokumen...", "info");
    setTimeout(() => {
      try { window.print(); } 
      catch (ex) { addNotification("Gunakan Ctrl+P (Windows) / Cmd+P (Mac) untuk mencetak.", "info"); }
    }, 800);
  };

  const handleAddNew = () => {
    if(proposals.resetForm) proposals.resetForm();
    if(proposals.setIsEditing) proposals.setIsEditing(false);
    setView('add-proposal');
  };

  // --- Konstanta Desain UI Modern ---
  const glassCard = isDarkMode 
    ? "bg-[#3c5654]/40 backdrop-blur-xl border border-[#cadfdf]/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-3xl transition-all duration-500"
    : "bg-white/60 backdrop-blur-xl border border-[#cadfdf]/80 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-3xl transition-all duration-500";

  return (
    <div className={`space-y-6 animate-in fade-in h-full flex flex-col text-left relative font-sans ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#3c5654]'}`}>
      
      {/* Background Aesthetic ECharts (Subtle Grid) & Particles */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      />
      <FloatingGoldParticles />

      {/* Filter Bar (Glassmorphism inside Mock) */}
      <div className="relative z-10">
        <FilterBar
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          selectedTahap={selectedTahap} setSelectedTahap={setSelectedTahap}
          selectedYear={selectedYear} setSelectedYear={setSelectedYear}
          tahapList={tahapList} tahunList={tahunList}
          currentUserLevel={currentUserProfile?.level}
          selectedForBulk={selectedForBulk || []}
          onBulkAction={handleBulkAction}
          onExportCSV={handleExportCSV}
          onAddNew={handleAddNew}
          isProcessing={isProcessing}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Table Container dengan Glass Effect & ECharts Vibe */}
      <div className={`relative z-10 ${glassCard} overflow-hidden flex flex-col hover:shadow-xl flex-1 min-h-[500px]`}>
        
        {/* Info Header Table */}
        <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-[#cadfdf]/10 bg-[#3c5654]/50' : 'border-[#cadfdf]/50 bg-white/50'}`}>
          <div className="flex items-center gap-2">
            <Settings2 size={16} className="text-[#d7a217]" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#425c5a] dark:text-[#cadfdf]">
              Database Usulan APBD
            </h3>
          </div>
          <span className="text-[10px] font-bold bg-[#d7a217]/10 text-[#d7a217] border border-[#d7a217]/30 px-3 py-1 rounded-full">
            {filteredProposals.length} Dokumen Ditemukan
          </span>
        </div>

        <div className="overflow-x-auto flex-1 custom-table-scroll">
          <table className="w-full text-left text-sm min-w-[1200px] border-collapse">
            <thead className="sticky top-0 z-20">
              <tr className={`text-[10px] font-black uppercase tracking-widest border-b backdrop-blur-md ${isDarkMode ? 'bg-[#3c5654]/90 text-[#cadfdf] border-[#cadfdf]/20' : 'bg-[#cadfdf]/80 text-[#425c5a] border-[#cadfdf]'}`}>
                {['Admin', 'Operator BKAD'].includes(currentUserProfile?.level) && (
                  <th className="p-4 w-10 text-center">
                    <input 
                      type="checkbox" 
                      checked={currentData.length > 0 && selectedForBulk?.length === currentData.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer accent-[#d7a217]"
                    />
                  </th>
                )}
                <th className="p-4">Tanggal</th>
                <th className="p-4">No. Surat</th>
                <th className="p-4 w-48">SKPD / Instansi</th>
                <th className="p-4 w-40">Sub Kegiatan</th>
                <th className="p-4">Kd. Rekening</th>
                <th className="p-4 w-40">Rincian Objek</th>
                <th className="p-4 text-right">Pagu Semula</th>
                <th className="p-4 text-right">Pagu Menjadi</th>
                <th className="p-4 text-right">Selisih</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Tindakan</th>
              </tr>
            </thead>

        {/* Info Panel - Menampilkan Level User dan Jumlah Data */}
<div className={`${glassCard} p-4 mb-2 flex justify-between items-center`}>
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-[#d7a217]/20 flex items-center justify-center">
      <Settings2 size={16} className="text-[#d7a217]" />
    </div>
    <div>
      <span className="text-sm font-bold" style={{ color: colors.tealDark }}>
        Akses sebagai: <span style={{ color: colors.gold }}>{currentUserProfile?.level}</span>
      </span>
      <p className="text-xs mt-1" style={{ color: colors.tealMedium }}>
        Menampilkan {userLevelFilteredProposals.length} dari {filteredProposals.length} usulan
        {currentUserProfile?.level === 'Operator BKAD' && ' (Pending)'}
        {currentUserProfile?.level === 'Kepala Sub Bidang' && ' (Menunggu Persetujuan)'}
      </p>
    </div>
  </div>
  <div className="text-xs px-3 py-1 rounded-full" style={{ 
    backgroundColor: `${colors.gold}20`,
    color: colors.gold
  }}>
    {currentUserProfile?.level}
  </div>
</div>

            <tbody className={`divide-y ${isDarkMode ? 'divide-[#cadfdf]/10' : 'divide-[#cadfdf]/40'}`}>
              {currentData.map(p => {
                const rincianList = p.rincian && p.rincian.length > 0 
                  ? p.rincian 
                  : [{ id: p.id+'-r', kodeRekening: '-', uraian: String(p.subKegiatan || '-'), 
                       paguSebelum: p.paguSebelum || 0, paguSesudah: p.paguSesudah || 0 }];
                
                const canEdit = currentUserProfile?.level === 'Admin' || 
                  (currentUserProfile?.level === 'SKPD' && 
                   (String(p.status).includes('Ditolak') || p.status === 'Pending'));

                return rincianList.map((r, index) => (
                  <ProposalTableRow
                    key={`${p.id}-${r.id || index}`}
                    proposal={p}
                    rincian={r}
                    index={index}
                    isFirstRow={index === 0}
                    rowSpan={rincianList.length}
                    selectedForBulk={selectedForBulk || []}
                    onSelectBulk={handleSelectBulk}
                    currentUserLevel={currentUserProfile?.level}
                    canEdit={canEdit}
                    onDetail={handleDetail}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPrint={handlePrint}
                    isDarkMode={isDarkMode}
                  />
                ));
              })}
              
              {currentData.length === 0 && (
  <tr>
    <td colSpan={['Admin', 'Operator BKAD', 'Super Admin', 'Kepala Sub Bidang'].includes(currentUserProfile?.level) ? 12 : 11} 
        className="p-24 text-center">
      <div className="flex flex-col items-center justify-center opacity-60">
        <div className="w-20 h-20 rounded-full bg-[#d7a217]/10 flex items-center justify-center mb-4 shadow-inner border border-[#d7a217]/20">
          <Search size={32} className="text-[#d7a217]" />
        </div>
        <p className="text-base font-black uppercase tracking-widest text-[#425c5a] dark:text-[#cadfdf]">
          Data Kosong
        </p>
        <p className="text-xs font-medium text-[#3c5654]/70 dark:text-[#cadfdf]/70 mt-1">
          {currentUserProfile?.level === 'Operator BKAD' && 'Tidak ada usulan Pending yang perlu diverifikasi'}
          {currentUserProfile?.level === 'Kepala Sub Bidang' && 'Tidak ada usulan yang perlu disetujui'}
          {currentUserProfile?.level === 'SKPD' && 'Belum ada usulan dari instansi Anda'}
          {currentUserProfile?.level === 'Super Admin' && 'Tidak ada usulan yang cocok dengan filter'}
          {currentUserProfile?.level === 'Admin' && 'Tidak ada usulan yang cocok dengan filter'}
          {currentUserProfile?.level === 'TAPD' && 'Tidak ada usulan yang cocok dengan filter'}
          {!['Operator BKAD', 'Kepala Sub Bidang', 'SKPD', 'Super Admin', 'Admin', 'TAPD'].includes(currentUserProfile?.level) && 
            'Tidak ada usulan yang cocok dengan parameter filter Anda.'}
        </p>
      </div>
    </td>
  </tr>
)}
            </tbody>
          </table>
        </div>

        {/* Pagination Container */}
        {filteredProposals.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredProposals.length}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {/* Internal CSS for Animations and Custom Scrollbar */}
      <style jsx>{`
        @keyframes float-list {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: var(--opacity, 0.4); }
          80% { opacity: var(--opacity, 0.4); }
          100% { transform: translateY(-100px) translateX(30px) scale(0.8); opacity: 0; }
        }
        .animate-float-list {
          animation-name: float-list;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        
        .custom-table-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-table-scroll::-webkit-scrollbar-track {
          background: rgba(202, 223, 223, 0.1);
        }
        .custom-table-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.4);
          border-radius: 10px;
        }
        .custom-table-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ProposalListView;