import React, { useMemo, useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Plus, Layers, 
  CalendarDays, ChevronLeft, ChevronRight, 
  Edit3, Trash2, FileText, Printer, Settings2,
  Eye, EyeOff, AlertCircle
} from 'lucide-react';

// ===== KOMPONEN PARTICLES (VISUAL ENHANCED) =====
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 1,
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
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
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

  // Palet warna
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealLight: '#e2eceb',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };

  // Filter berdasarkan level user
  const userLevelFilteredProposals = useMemo(() => {
    return filteredProposals.filter(p => {
      const userLevel = currentUserProfile?.level;
      
      if (userLevel === 'Super Admin' || userLevel === 'Admin') return true;
      if (userLevel === 'Operator BKAD') return p.status === 'Pending';
      if (userLevel === 'Kepala Sub Bidang') return p.status === 'Diverifikasi';
      if (userLevel === 'SKPD') return p.skpdId === currentUserProfile?.skpdId;
      if (userLevel === 'TAPD' || userLevel === 'Viewer') return true;
      
      return false;
    });
  }, [filteredProposals, currentUserProfile]);

  // Pagination
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return userLevelFilteredProposals.slice(start, start + itemsPerPage);
  }, [userLevelFilteredProposals, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(userLevelFilteredProposals.length / itemsPerPage);

  // Handlers (TETAP SAMA)
  const handleSelectAll = (checked) => {
    if (checked) setSelectedForBulk(currentData.map(p => p.id));
    else setSelectedForBulk([]);
  };

  const handleSelectBulk = (id, checked) => {
    if (checked) setSelectedForBulk(prev => [...prev, id]);
    else setSelectedForBulk(prev => prev.filter(item => item !== id));
  };

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

  // ENHANCED ADVANCED GLASSMORPHISM STYLES
  const glassCard = `backdrop-blur-2xl border transition-all duration-700 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_40px_-10px_rgba(215,162,23,0.25)] ${
    isDarkMode 
      ? 'bg-gradient-to-br from-[#3c5654]/40 to-[#2a3f3d]/60 border-[#cadfdf]/10' 
      : 'bg-gradient-to-br from-white/70 to-white/40 border-white/60'
  }`;

  const glassInput = `w-full px-5 py-4 text-sm md:text-base rounded-xl backdrop-blur-xl border outline-none transition-all duration-500 focus:ring-2 focus:ring-[#d7a217]/50 focus:shadow-[0_0_20px_rgba(215,162,23,0.2)] ${
    isDarkMode 
      ? 'bg-[#1e2e2d]/50 border-[#cadfdf]/10 text-[#e2eceb] placeholder-[#cadfdf]/40 focus:bg-[#1e2e2d]/80 focus:border-[#d7a217]/50' 
      : 'bg-white/50 border-white/80 text-[#425c5a] placeholder-[#3c5654]/40 focus:bg-white/90 focus:border-[#d7a217]/40'
  }`;

  return (
    <div className={`space-y-8 animate-in fade-in h-full flex flex-col text-left relative font-sans ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#3c5654]'}`}>
      
      {/* ADVANCED BACKGROUND PARALLAX ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-gradient-to-bl from-[#d7a217]/10 to-transparent rounded-full blur-[120px] animate-blob-float"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] bg-gradient-to-tr from-[#425c5a]/20 dark:from-[#cadfdf]/10 to-transparent rounded-full blur-[100px] animate-blob-float animation-delay-2000"></div>
        <div className="absolute top-[30%] left-[20%] w-[30vw] h-[30vw] bg-gradient-to-r from-[#d7a217]/5 to-transparent rounded-full blur-[80px] animate-pulse-slow mix-blend-overlay"></div>
      </div>
      
      {/* Grid Pattern with Depth */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(10deg) scale(1.1)',
          transformOrigin: 'top center'
        }}
      />
      
      {/* Particles */}
      <FloatingGoldParticles />

      {/* Filter Bar */}
      <div className="relative z-10 animate-slide-up-fade">
        <div className={`${glassCard} p-6 rounded-3xl relative overflow-hidden group`}>
          {/* Subtle shine effect on card */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer pointer-events-none"></div>

          <div className="flex flex-col xl:flex-row justify-between gap-5 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 flex-1">
              
              {/* Search */}
              <div className="relative group/input">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3c5654]/40 dark:text-[#cadfdf]/40 transition-colors duration-300 group-focus-within/input:text-[#d7a217]" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  placeholder="Cari Instansi..." 
                  className={`${glassInput} pl-12`}
                />
              </div>
              
              {/* Status Filter */}
              <div className="relative group/input">
                <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3c5654]/40 dark:text-[#cadfdf]/40 transition-colors duration-300 group-focus-within/input:text-[#d7a217]" />
                <select 
                  value={statusFilter} 
                  onChange={e => setStatusFilter(e.target.value)} 
                  className={`${glassInput} pl-12 appearance-none cursor-pointer`}
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Diverifikasi">Diverifikasi</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>
              
              {/* Tahap Filter */}
              <div className="relative group/input">
                <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3c5654]/40 dark:text-[#cadfdf]/40 transition-colors duration-300 group-focus-within/input:text-[#d7a217]" />
                <select 
                  value={selectedTahap} 
                  onChange={e => setSelectedTahap(e.target.value)} 
                  className={`${glassInput} pl-12 appearance-none cursor-pointer`}
                >
                  <option value="Semua">Semua Tahap</option>
                  {tahapList?.map(t => <option key={t.id} value={t.nama}>{t.nama}</option>)}
                </select>
              </div>
              
              {/* Tahun Filter */}
              <div className="relative group/input">
                <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3c5654]/40 dark:text-[#cadfdf]/40 transition-colors duration-300 group-focus-within/input:text-[#d7a217]" />
                <select 
                  value={selectedYear} 
                  onChange={e => setSelectedYear(e.target.value)} 
                  className={`${glassInput} pl-12 appearance-none cursor-pointer`}
                >
                  <option value="Semua">Semua Tahun</option>
                  {tahunList?.map(t => <option key={t.id} value={t.tahun}>{t.tahun}</option>)}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap xl:flex-nowrap shrink-0 items-center">
              {selectedForBulk?.length > 0 && ['Admin', 'Operator BKAD', 'Super Admin'].includes(currentUserProfile?.level) && (
                <div className={`flex gap-3 p-2 rounded-2xl ${glassCard} border border-[#d7a217]/30 shadow-[0_0_15px_rgba(215,162,23,0.15)] animate-fade-in`}>
                  <span className="text-xs font-black text-[#d7a217] flex items-center px-4 tracking-widest uppercase">
                    {selectedForBulk.length} Dipilih
                  </span>
                  {currentUserProfile?.level === 'Operator BKAD' && (
                    <button 
                      onClick={() => handleBulkAction('Diverifikasi')} 
                      disabled={isProcessing} 
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white rounded-xl text-xs font-black tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] relative overflow-hidden group/btn"
                    >
                      <span className="relative z-10">VERIF</span>
                    </button>
                  )}
                  {['Admin', 'Super Admin'].includes(currentUserProfile?.level) && (
                    <button 
                      onClick={() => handleBulkAction('Disetujui')} 
                      disabled={isProcessing} 
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-xs font-black tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] relative overflow-hidden group/btn"
                    >
                      <span className="relative z-10">SETUJUI</span>
                    </button>
                  )}
                </div>
              )}
              
              <button 
                onClick={handleExportCSV} 
                className={`${glassCard} px-6 py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(215,162,23,0.3)]`}
                style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
              >
                <Download size={18} style={{ color: colors.gold }} className="drop-shadow-md"/> EXPORT
              </button>
              
              <button 
                onClick={handleAddNew} 
                className="px-8 py-4 bg-gradient-to-r from-[#d7a217] via-[#e6b32a] to-[#b8860b] text-white rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(215,162,23,0.5)] bg-[length:200%_auto] hover:bg-[position:right_center]"
              >
                <Plus size={20} className="drop-shadow-md"/> BUAT USULAN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel Level User */}
      <div className={`relative z-10 ${glassCard} p-5 rounded-2xl flex justify-between items-center animate-slide-up-fade animation-delay-100`}>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-40 rounded-xl"></div>
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#d7a217] to-[#b8860b] border border-white/20 shadow-lg">
              <Settings2 size={22} className="text-white drop-shadow-md" />
            </div>
          </div>
          <div>
            <span className="text-base md:text-lg font-black tracking-wide">
              Akses sebagai: <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d7a217] to-[#f9d423] drop-shadow-sm">{currentUserProfile?.level || 'User'}</span>
            </span>
            <p className="text-sm mt-1 opacity-80 font-medium">
              Menampilkan {userLevelFilteredProposals.length} dari {filteredProposals.length} usulan
              {currentUserProfile?.level === 'Operator BKAD' && ' (Pending)'}
              {currentUserProfile?.level === 'Kepala Sub Bidang' && ' (Menunggu Persetujuan)'}
            </p>
          </div>
        </div>
        <div className="text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(215,162,23,0.2)]" style={{ 
          backgroundColor: `${colors.gold}15`,
          color: colors.gold,
          border: `1px solid ${colors.gold}30`
        }}>
          {currentUserProfile?.level || 'User'}
        </div>
      </div>

      {/* Tabel Container */}
      <div className={`relative z-10 ${glassCard} rounded-3xl overflow-hidden flex flex-col flex-1 min-h-[500px] animate-slide-up-fade animation-delay-200`}>
        
        {/* Header Tabel */}
        <div className={`px-8 py-6 border-b flex justify-between items-center backdrop-blur-3xl ${isDarkMode ? 'border-[#cadfdf]/10 bg-black/10' : 'border-[#cadfdf]/30 bg-white/30'}`}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#d7a217] blur-sm opacity-30 rounded-lg"></div>
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-white/40 to-white/10 dark:from-[#cadfdf]/20 dark:to-transparent border border-white/30 dark:border-[#cadfdf]/10 flex items-center justify-center">
                <FileText size={20} style={{ color: colors.gold }} />
              </div>
            </div>
            <h3 className="text-sm md:text-base font-black uppercase tracking-widest bg-clip-text text-transparent" style={{ backgroundImage: isDarkMode ? `linear-gradient(to right, ${colors.tealLight}, #ffffff)` : `linear-gradient(to right, ${colors.tealDark}, ${colors.tealMedium})` }}>
              DATABASE USULAN APBD
            </h3>
          </div>
          <span className="text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-inner" style={{ 
            backgroundColor: `${colors.gold}15`,
            color: colors.gold,
            border: `1px solid ${colors.gold}30`
          }}>
            {userLevelFilteredProposals.length} Dokumen
          </span>
        </div>

        {/* Tabel dengan Scroll */}
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-base min-w-[1400px] border-collapse">
            <thead className="sticky top-0 z-20">
              <tr className={`text-xs md:text-sm font-black uppercase tracking-widest backdrop-blur-2xl shadow-sm ${
                isDarkMode 
                  ? 'bg-[#1a2b29]/80 text-[#cadfdf] border-b border-[#cadfdf]/10' 
                  : 'bg-white/70 text-[#425c5a] border-b border-[#cadfdf]/40'
              }`}>
                {['Admin', 'Operator BKAD', 'Super Admin'].includes(currentUserProfile?.level) && (
                  <th className="p-6 w-12 text-center">
                    <input 
                      type="checkbox" 
                      checked={currentData.length > 0 && selectedForBulk?.length === currentData.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-5 h-5 rounded cursor-pointer accent-[#d7a217] transition-all duration-300 hover:scale-110"
                    />
                  </th>
                )}
                <th className="p-6 whitespace-nowrap">Tanggal</th>
                <th className="p-6 whitespace-nowrap">No. Surat</th>
                <th className="p-6">SKPD / Instansi</th>
                <th className="p-6">Sub Kegiatan</th>
                <th className="p-6 whitespace-nowrap">Kd. Rekening</th>
                <th className="p-6">Rincian Objek</th>
                <th className="p-6 text-right whitespace-nowrap">Pagu Semula</th>
                <th className="p-6 text-right whitespace-nowrap">Pagu Menjadi</th>
                <th className="p-6 text-right whitespace-nowrap">Selisih</th>
                <th className="p-6 text-center whitespace-nowrap">Status</th>
                <th className="p-6 text-center whitespace-nowrap">Tindakan</th>
              </tr>
            </thead>
            
            <tbody className="divide-y transition-colors duration-500" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.05)' : 'rgba(202,223,223,0.3)' }}>
              {currentData.map(p => {
                const rincianList = p.rincian && p.rincian.length > 0 
                  ? p.rincian 
                  : [{ id: p.id+'-r', kodeRekening: '-', uraian: String(p.subKegiatan || '-'), 
                       paguSebelum: p.paguSebelum || 0, paguSesudah: p.paguSesudah || 0 }];
                
                const canEdit = currentUserProfile?.level === 'Admin' || 
                  currentUserProfile?.level === 'Super Admin' ||
                  (currentUserProfile?.level === 'SKPD' && 
                   (String(p.status).includes('Ditolak') || p.status === 'Pending'));

                return rincianList.map((r, index) => {
                  const selisih = Number(r.paguSesudah||0) - Number(r.paguSebelum||0);
                  const isSelected = selectedForBulk?.includes(p.id);
                  
                  return (
                    <tr 
                      key={`${p.id}-${r.id || index}`} 
                      className={`transition-all duration-500 hover:bg-gradient-to-r hover:from-transparent ${isDarkMode ? 'hover:via-white/5' : 'hover:via-[#d7a217]/5'} hover:to-transparent group relative ${
                        isSelected ? (isDarkMode ? 'bg-[#d7a217]/10 shadow-[inset_0_0_20px_rgba(215,162,23,0.1)]' : 'bg-[#d7a217]/5 shadow-[inset_0_0_20px_rgba(215,162,23,0.05)]') : ''
                      }`}
                    >
                      {/* Highlight border on hover */}
                      <td className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d7a217] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></td>

                      {/* Checkbox */}
                      {index === 0 && ['Admin', 'Operator BKAD', 'Super Admin'].includes(currentUserProfile?.level) && (
                        <td rowSpan={rincianList.length} className="p-6 align-top border-r border-[#cadfdf]/10 dark:border-[#cadfdf]/5 text-center relative z-10">
                          <input 
                            type="checkbox" 
                            checked={isSelected || false} 
                            onChange={(e) => handleSelectBulk(p.id, e.target.checked)} 
                            className="w-5 h-5 rounded cursor-pointer accent-[#d7a217] transition-all duration-300 hover:scale-125 hover:shadow-[0_0_15px_rgba(215,162,23,0.5)]"
                          />
                        </td>
                      )}
                      
                      {/* Data Baris */}
                      {index === 0 && (
                        <>
                          <td rowSpan={rincianList.length} className="p-6 align-top border-r border-[#cadfdf]/10 dark:border-[#cadfdf]/5">
                            <span className="text-xs md:text-sm font-black px-4 py-2 rounded-full backdrop-blur-sm shadow-sm" style={{ 
                              backgroundColor: isDarkMode ? 'rgba(60,86,84,0.4)' : 'rgba(255,255,255,0.6)',
                              color: isDarkMode ? colors.tealLight : colors.tealDark,
                              border: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.5)'}`
                            }}>
                              {p.tanggalSurat || '-'}
                            </span>
                          </td>
                          <td rowSpan={rincianList.length} className="p-6 align-top border-r border-[#cadfdf]/10 dark:border-[#cadfdf]/5">
                            <span className="text-sm md:text-base font-black bg-clip-text text-transparent bg-gradient-to-r from-[#d7a217] to-[#b8860b]">{p.nomorSurat || '-'}</span>
                            {p.tahap && p.tahap !== 'Belum Ditentukan' && (
                              <div className="mt-3 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block backdrop-blur-sm transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(215,162,23,0.2)]" style={{ 
                                backgroundColor: `${colors.gold}15`,
                                color: colors.gold,
                                border: `1px solid ${colors.gold}30`
                              }}>
                                {p.tahap}
                              </div>
                            )}
                          </td>
                          <td rowSpan={rincianList.length} className="p-6 align-top border-r border-[#cadfdf]/10 dark:border-[#cadfdf]/5">
                            <span className="text-sm md:text-base font-bold leading-relaxed line-clamp-3">{p.skpd || '-'}</span>
                          </td>
                          <td rowSpan={rincianList.length} className="p-6 align-top border-r border-[#cadfdf]/10 dark:border-[#cadfdf]/5">
                            <span className="text-sm md:text-base leading-relaxed opacity-80 line-clamp-3">{p.subKegiatan || '-'}</span>
                          </td>
                        </>
                      )}
                      
                      {/* Rincian */}
                      <td className="p-6 align-top font-mono text-xs md:text-sm font-bold text-[#d7a217] tracking-wider">{r.kodeRekening || '-'}</td>
                      <td className="p-6 align-top text-sm md:text-base leading-relaxed opacity-90">{r.uraian || '-'}</td>
                      <td className="p-6 align-top text-right text-sm md:text-base font-semibold tabular-nums tracking-wide">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(r.paguSebelum || 0)}
                      </td>
                      <td className="p-6 align-top text-right text-sm md:text-base font-black tabular-nums tracking-wide" style={{ color: colors.gold }}>
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(r.paguSesudah || 0)}
                      </td>
                      <td className="p-6 align-top text-right tabular-nums">
                        <div className={`inline-flex px-4 py-2 rounded-lg text-xs md:text-sm font-black tracking-widest shadow-sm backdrop-blur-sm border ${
                          selisih > 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                          selisih < 0 ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' : 
                          'bg-black/5 dark:bg-white/5 text-[#3c5654] dark:text-[#cadfdf] border-transparent'
                        }`}>
                          {selisih > 0 ? '+' : ''}{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(selisih)}
                        </div>
                      </td>
                      
                      {/* Status & Actions */}
                      {index === 0 && (
                        <>
                          <td rowSpan={rincianList.length} className="p-6 align-top text-center border-l border-[#cadfdf]/10 dark:border-[#cadfdf]/5">
                            <StatusBadge status={p.status} />
                          </td>
                          <td rowSpan={rincianList.length} className="p-6 align-top text-center border-l border-[#cadfdf]/10 dark:border-[#cadfdf]/5">
                            <div className="flex flex-col gap-3 items-center justify-center">
                              <button 
                                onClick={() => handleDetail(p)} 
                                className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(202,223,223,0.3)] group/btn relative overflow-hidden backdrop-blur-md"
                                style={{ backgroundColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.3)', border: `1px solid ${colors.tealPale}30` }}
                                title="Detail"
                              >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                <Eye size={18} className="relative z-10 group-hover/btn:text-[#d7a217] transition-colors" />
                              </button>
                              <button 
                                onClick={() => handlePrint(p)} 
                                className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(215,162,23,0.3)] group/btn relative overflow-hidden backdrop-blur-md"
                                style={{ backgroundColor: `${colors.gold}15`, border: `1px solid ${colors.gold}30` }}
                                title="Cetak"
                              >
                                <div className="absolute inset-0 bg-[#d7a217] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                <Printer size={18} className="relative z-10 text-[#d7a217] group-hover/btn:text-white transition-colors" />
                              </button>
                              {canEdit && (
                                <>
                                  <button 
                                    onClick={() => handleEdit(p)} 
                                    className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(16,185,129,0.3)] group/btn relative overflow-hidden backdrop-blur-md"
                                    style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                                    title="Edit"
                                  >
                                    <div className="absolute inset-0 bg-[#10b981] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                    <Edit3 size={18} className="relative z-10 text-[#10b981] group-hover/btn:text-white transition-colors" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(p)} 
                                    className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(239,68,68,0.3)] group/btn relative overflow-hidden backdrop-blur-md"
                                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                                    title="Hapus"
                                  >
                                    <div className="absolute inset-0 bg-[#ef4444] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                    <Trash2 size={18} className="relative z-10 text-[#ef4444] group-hover/btn:text-white transition-colors" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                });
              })}
              
              {/* Empty State */}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={['Admin', 'Operator BKAD', 'Super Admin'].includes(currentUserProfile?.level) ? 12 : 11} 
                      className="p-32 text-center">
                    <div className="flex flex-col items-center justify-center opacity-80 animate-fade-in">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-[#d7a217] blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
                        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#d7a217]/10 to-transparent flex items-center justify-center border border-[#d7a217]/30 backdrop-blur-md shadow-[0_0_40px_rgba(215,162,23,0.1)]">
                          <AlertCircle size={48} className="text-[#d7a217]" />
                        </div>
                      </div>
                      <p className="text-xl font-black uppercase tracking-widest mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#d7a217] to-[#b8860b]">Data Kosong</p>
                      <p className="text-sm md:text-base font-bold opacity-60 tracking-wide max-w-lg text-center leading-relaxed">
                        {currentUserProfile?.level === 'Operator BKAD' && 'Tidak ada usulan Pending yang perlu diverifikasi pada saat ini.'}
                        {currentUserProfile?.level === 'Kepala Sub Bidang' && 'Tidak ada usulan yang perlu disetujui pada saat ini.'}
                        {currentUserProfile?.level === 'SKPD' && 'Belum ada usulan dari instansi Anda yang terdaftar.'}
                        {!['Operator BKAD', 'Kepala Sub Bidang', 'SKPD'].includes(currentUserProfile?.level) && 
                          'Tidak ada dokumen usulan yang cocok dengan kombinasi filter pencarian Anda.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {userLevelFilteredProposals.length > 0 && (
          <div className={`p-6 border-t flex flex-col sm:flex-row justify-between items-center gap-5 ${glassCard} rounded-t-none rounded-b-3xl backdrop-blur-3xl border-none`}>
            <div className="flex items-center gap-4">
              <span className="text-sm font-black uppercase tracking-widest opacity-60">Baris per hal:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => { 
                  setItemsPerPage(Number(e.target.value)); 
                  setCurrentPage(1); 
                }} 
                className={`px-5 py-3 rounded-xl text-sm font-black outline-none cursor-pointer border focus:ring-2 focus:ring-[#d7a217]/50 transition-all duration-300 ${isDarkMode ? 'bg-[#1e2e2d]/60 border-[#cadfdf]/20' : 'bg-white/60 border-white/80'}`}
              >
                <option value="10">10 Data</option>
                <option value="25">25 Data</option>
                <option value="50">50 Data</option>
                <option value="100">100 Data</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                disabled={currentPage === 1} 
                className={`p-3 rounded-xl transition-all duration-300 hover:bg-[#d7a217]/20 hover:text-[#d7a217] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit`}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-5 py-2 rounded-lg bg-black/10 dark:bg-black/20 shadow-inner">
                <span className="text-sm font-black uppercase tracking-widest">
                  Hal <span className="text-[#d7a217] text-base mx-2">{currentPage}</span> / {totalPages || 1}
                </span>
              </div>
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                disabled={currentPage === totalPages || totalPages === 0} 
                className={`p-3 rounded-xl transition-all duration-300 hover:bg-[#d7a217]/20 hover:text-[#d7a217] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADVANCED CSS UNTUK ANIMASI DAN STYLING */}
      <style>{`
        /* Custom Modern Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(202, 223, 223, 0.05);
          border-radius: 20px;
          margin: 10px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, transparent, rgba(215, 162, 23, 0.5), transparent);
          border-radius: 20px;
          transition: all 0.3s;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #d7a217, #b8860b);
          box-shadow: 0 0 10px rgba(215, 162, 23, 0.5);
        }

        /* Keyframes Animations */
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
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Utility Classes */
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-blob-float { animation: blob-float 20s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
        .animate-shimmer { animation: shimmer 2s infinite linear; }
        .animate-slide-up-fade { animation: slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
      `}</style>
    </div>
  );
};

// Komponen StatusBadge (VISUAL ENHANCED)
const StatusBadge = ({ status }) => {
  let bgColor = 'rgba(202, 223, 223, 0.1)';
  let textColor = '#425c5a';
  let borderColor = 'rgba(202, 223, 223, 0.3)';
  let glowColor = 'transparent';
  
  if (status === 'Disetujui') {
    bgColor = 'rgba(16, 185, 129, 0.15)';
    textColor = '#10b981';
    borderColor = 'rgba(16, 185, 129, 0.4)';
    glowColor = 'rgba(16, 185, 129, 0.3)';
  } else if (status === 'Ditolak' || status?.includes('Ditolak')) {
    bgColor = 'rgba(239, 68, 68, 0.15)';
    textColor = '#ef4444';
    borderColor = 'rgba(239, 68, 68, 0.4)';
    glowColor = 'rgba(239, 68, 68, 0.3)';
  } else if (status === 'Diverifikasi') {
    bgColor = 'rgba(60, 86, 84, 0.15)';
    textColor = '#3c5654';
    borderColor = 'rgba(60, 86, 84, 0.4)';
  } else if (status === 'Pending') {
    bgColor = 'rgba(215, 162, 23, 0.15)';
    textColor = '#d7a217';
    borderColor = 'rgba(215, 162, 23, 0.4)';
    glowColor = 'rgba(215, 162, 23, 0.3)';
  }

  return (
    <div className="relative inline-flex group/badge">
      <div 
        className="absolute inset-0 blur-md opacity-40 group-hover/badge:opacity-70 transition-opacity duration-300 rounded-lg"
        style={{ backgroundColor: glowColor }}
      ></div>
      <span 
        className="relative px-4 py-2 rounded-lg text-xs md:text-sm font-black uppercase tracking-[0.15em] backdrop-blur-md transition-all duration-300 group-hover/badge:scale-105"
        style={{ 
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          textShadow: `0 0 10px ${glowColor}`
        }}
      >
        {status || 'Pending'}
      </span>
    </div>
  );
};

export default ProposalListView;