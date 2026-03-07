import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Printer, CheckCircle, XCircle, 
  History, MessageSquare, Database, FileText,
  Calendar, Building2, Download, Edit3, Save,
  Sparkles, ChevronRight, AlertCircle
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import ChatPanel from './ChatPanel';
import HistoryTimeline from './HistoryTimeline';
import LampiranView from './LampiranView';
import BankCatatanPanel from './BankCatatanPanel';
import VersionHistoryModal from './VersionHistoryModal'; 
import { formatIDR } from '../../utils';
import { doc, updateDoc } from 'firebase/firestore';
import { db, appId } from '../../utils/firebase';

// --- Komponen Partikel Emas Mengambang ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDuration: Math.random() * 20 + 15,
      animationDelay: Math.random() * -20,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#d7a217] animate-float-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.animationDelay}s`,
            boxShadow: `0 0 ${p.size * 2}px #d7a217`,
          }}
        />
      ))}
    </div>
  );
};

const ProposalDetailView = ({
  currentUserProfile,
  proposals,
  masterData,
  setView,
  addNotification,
  isProcessing,
  setIsProcessing,
  selectedProposal,
  setSelectedProposal,
  localCatatan,
  setLocalCatatan,
  commentText,
  setCommentText,
  handleFinalize,
  handleAddComment,
  isDarkMode
}) => {
  const { tahapList, bankCatatan } = masterData;
  const [showBankCatatan, setShowBankCatatan] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);  

  // Palet warna teal & gold
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealLight: '#e2eceb',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };

  // Update selected proposal when data changes
  useEffect(() => {
    const updated = proposals.proposals.find(p => p.id === selectedProposal?.id);
    if (updated && JSON.stringify(updated) !== JSON.stringify(selectedProposal)) {
      setSelectedProposal(updated);
      setLocalCatatan(updated.hasilVerifikasi || '');
    }
  }, [proposals.proposals, selectedProposal?.id]);

  if (!selectedProposal) return null;

  const isAdminOrOperator = ['Admin', 'Operator BKAD'].includes(currentUserProfile.level);
  const isSkpd = currentUserProfile.level === 'SKPD';
  const isTapd = currentUserProfile.level === 'TAPD';

  // Handle status change
  const handleStatusChange = async (status) => {
    if (!selectedProposal?.id) return;
    
    setIsProcessing(true);
    try {
      await handleFinalize(selectedProposal.id, status, currentUserProfile.nama, selectedProposal.status);
      addNotification(`✓ Berkas ${status}`, 'success');
    } catch (err) {
      console.error(err);
      addNotification(`✗ Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle tahap change
  const handleTahapChange = async (newTahap) => {
    if (!selectedProposal?.id) return;
    
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', selectedProposal.id), 
        { tahap: newTahap }
      );
      setSelectedProposal(prev => ({...prev, tahap: newTahap}));
      addNotification(`✓ Berhasil menandai ke: ${newTahap}`, "success");
    } catch (err) {
      addNotification(`✗ Gagal menyimpan tahap: ${err.message}`, "error");
    }
  };

  // Handle save catatan
  const handleSaveCatatan = async () => {
    if (!selectedProposal?.id) return;
    
    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', selectedProposal.id), 
        { hasilVerifikasi: localCatatan }
      );
      setSelectedProposal(prev => ({...prev, hasilVerifikasi: localCatatan}));
      addNotification("✓ Catatan berhasil disimpan!", "success");
    } catch (err) {
      console.error(err);
      addNotification(`✗ Gagal menyimpan catatan: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    addNotification("Menyiapkan dokumen...", "info");
    setTimeout(() => {
      try { 
        window.print(); 
      } catch (ex) { 
        addNotification("Gunakan Ctrl+P (Windows) / Cmd+P (Mac) untuk mencetak.", "info"); 
      }
    }, 500);
  };

  // --- Konstanta Desain Glassmorphism ---
  const glassCard = isDarkMode 
    ? "bg-[#3c5654]/40 backdrop-blur-xl border border-[#cadfdf]/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-2xl transition-all duration-500 hover:shadow-[0_8px_30px_rgba(215,162,23,0.15)] relative z-10"
    : "bg-white/60 backdrop-blur-xl border border-[#cadfdf]/80 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-500 hover:shadow-[0_8px_30px_rgba(215,162,23,0.15)] relative z-10";

  return (
    <div className={`space-y-6 animate-in slide-in-from-right-4 pb-20 relative font-sans ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#3c5654]'}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#d7a217]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-0 w-[50%] h-[50%] bg-[#425c5a]/20 dark:bg-[#cadfdf]/10 rounded-full blur-[100px]"></div>
      </div>
      <FloatingGoldParticles />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10 p-6 rounded-3xl bg-gradient-to-br from-white/80 to-[#cadfdf]/30 dark:from-[#3c5654]/80 dark:to-[#425c5a]/80 backdrop-blur-md border border-white/50 dark:border-[#cadfdf]/20 shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('list')} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 hover:scale-105 shadow-md bg-[#425c5a] dark:bg-[#cadfdf]/10 text-white dark:text-[#d7a217] hover:bg-[#d7a217] dark:hover:bg-[#d7a217] dark:hover:text-white"
          >
            <ArrowLeft size={20}/>
          </button>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#d7a217]/10 border border-[#d7a217]/30 mb-1.5">
              <Sparkles size={12} className="text-[#d7a217]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d7a217]">Detail Pengajuan</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#425c5a] dark:text-white">
              Berkas #{String(selectedProposal.nomorSurat || "")}
            </h2>
            <p className="text-xs md:text-sm mt-1 flex items-center gap-2 text-[#3c5654]/80 dark:text-[#cadfdf]/80 font-medium">
              <Building2 size={14} className="text-[#d7a217]" />
              {String(selectedProposal.skpd || "")}
              <span className="text-[#cadfdf] mx-1">•</span>
              <span className="text-[#d7a217] font-bold">{String(selectedProposal.tahap || "Belum Ditentukan")}</span>
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="ml-auto flex flex-wrap gap-3 w-full md:w-auto">
          
          {/* Tombol History Versi */}
          <button
            onClick={() => setShowVersionHistory(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
              border: `1px solid ${colors.gold}`,
              color: colors.gold
            }}
          >
            <History size={16} />
            RIWAYAT
          </button>

          {currentUserProfile.level === 'Operator BKAD' && (
            <>
              <button 
                disabled={isProcessing} 
                onClick={() => handleStatusChange('Diverifikasi')} 
                className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:-translate-y-1 disabled:opacity-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white border border-orange-400/50"
              >
                {isProcessing ? 'PROSES...' : 'VERIFIKASI BERKAS'}
              </button>
              <button 
                disabled={isProcessing} 
                onClick={() => handleStatusChange('Ditolak Operator')} 
                className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:-translate-y-1 disabled:opacity-50 bg-gradient-to-r from-rose-500 to-red-600 text-white border border-rose-400/50"
              >
                {isProcessing ? 'PROSES...' : 'TOLAK'}
              </button>
            </>
          )}

          {currentUserProfile.level === 'Admin' && (
            <>
              <button 
                disabled={isProcessing} 
                onClick={() => handleStatusChange('Disetujui')} 
                className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:-translate-y-1 disabled:opacity-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-400/50"
              >
                {isProcessing ? 'PROSES...' : 'SETUJUI FINAL'}
              </button>
              <button 
                disabled={isProcessing} 
                onClick={() => handleStatusChange('Ditolak Admin')} 
                className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:-translate-y-1 disabled:opacity-50 bg-gradient-to-r from-rose-500 to-red-600 text-white border border-rose-400/50"
              >
                {isProcessing ? 'PROSES...' : 'TOLAK'}
              </button>
            </>
          )}

          {/* Print Button */}
          <button 
            onClick={handlePrint} 
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
              border: `1px solid ${colors.gold}`,
              color: colors.gold
            }}
          >
            <Printer size={18} /> CETAK BA
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        
        {/* Kolom Kiri - Data Berkas */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Informasi Surat - Glass Card Paralaks */}
          <div className={`${glassCard} p-8 group hover:-translate-y-1`}>
            {/* Watermark Icon */}
            <div className="absolute top-4 right-4 w-40 h-40 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transform group-hover:scale-110 transition-transform duration-700 ease-out text-[#d7a217]">
              <FileText size={160} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-[#3c5654] dark:text-[#cadfdf]/80">
                  <Calendar size={12} className="text-[#d7a217]" /> Tanggal Surat
                </h4>
                <p className="text-base font-bold text-[#425c5a] dark:text-white">
                  {String(selectedProposal.tanggalSurat || "")}
                </p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-[#3c5654] dark:text-[#cadfdf]/80">
                  <AlertCircle size={12} className="text-[#d7a217]" /> Status Terkini
                </h4>
                <div className="mt-1 inline-block">
                  <StatusBadge status={selectedProposal.status} />
                </div>
              </div>
              
              <div className="col-span-full pt-6 border-t border-[#cadfdf]/50 dark:border-[#cadfdf]/10 space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3c5654] dark:text-[#cadfdf]/80">
                  Perihal Pengajuan
                </h4>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-black/20 border-l-4 border-[#d7a217]">
                  <p className="text-sm font-medium italic text-[#425c5a] dark:text-[#e2eceb] leading-relaxed">
                    "{String(selectedProposal.perihal || "")}"
                  </p>
                </div>
              </div>
              
              <div className="col-span-full pt-6 border-t border-[#cadfdf]/50 dark:border-[#cadfdf]/10 space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3c5654] dark:text-[#cadfdf]/80">
                  Sub Kegiatan Utama
                </h4>
                <p className="text-sm font-bold text-[#425c5a] dark:text-white bg-[#cadfdf]/20 dark:bg-[#cadfdf]/5 p-3 rounded-lg border border-[#cadfdf]/40 dark:border-[#cadfdf]/10">
                  {String(selectedProposal.subKegiatan || "N/A")}
                </p>
              </div>
              
              {/* Penentuan Tahap */}
              <div className="col-span-full pt-6 border-t border-[#cadfdf]/50 dark:border-[#cadfdf]/10 space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3c5654] dark:text-[#cadfdf]/80">
                  Penentuan Tahap APBD
                </h4>
                
                {isAdminOrOperator ? (
                  <div className="flex items-center gap-3">
                    <select 
                      value={selectedProposal.tahap || 'Belum Ditentukan'} 
                      onChange={(e) => handleTahapChange(e.target.value)}
                      className={`flex-1 p-3.5 rounded-xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-[#d7a217] uppercase tracking-widest appearance-none cursor-pointer border border-[#d7a217]/50 hover:border-[#d7a217] ${isDarkMode ? 'bg-[#3c5654]/60 text-[#d7a217]' : 'bg-white/80 text-[#425c5a]'}`}
                    >
                      <option value="Belum Ditentukan">-- PILIH TAHAP --</option>
                      {tahapList && tahapList.length > 0 ? (
                        tahapList.map(t => (
                          <option key={t.id} value={t.nama} className="bg-white dark:bg-[#425c5a] text-[#425c5a] dark:text-white">{String(t.nama || "")}</option>
                        ))
                      ) : null}
                    </select>
                    <button
                      onClick={() => handleTahapChange(selectedProposal.tahap)}
                      className="p-3.5 rounded-xl transition-all hover:scale-105 shadow-md shadow-[#d7a217]/20 bg-[#d7a217] text-white hover:bg-[#c29115]"
                      title="Simpan Tahap"
                    >
                      <Save size={20} />
                    </button>
                  </div>
                ) : (
                  <div className={`w-full md:w-1/2 p-3.5 rounded-xl text-sm font-bold uppercase tracking-widest border border-[#cadfdf] dark:border-[#cadfdf]/20 ${isDarkMode ? 'bg-[#3c5654]/40 text-[#cadfdf]' : 'bg-[#cadfdf]/30 text-[#425c5a]'}`}>
                    {String(selectedProposal.tahap || "Belum Ditentukan")}
                  </div>
                )}
                
                {isAdminOrOperator && (
                  <p className="text-[10px] italic font-medium text-[#3c5654]/80 dark:text-[#cadfdf]/60">
                    * Hanya Admin & Operator yang memiliki otoritas mengubah tahapan.
                  </p>
                )}
              </div>

              {/* Catatan Verifikasi */}
              <div className="col-span-full pt-6 border-t border-[#cadfdf]/50 dark:border-[#cadfdf]/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d7a217] flex items-center gap-2">
                    <Edit3 size={14} /> Catatan Verifikasi & Analisa
                  </h4>
                  
                  {isAdminOrOperator && (
                    <button
                      onClick={() => setShowBankCatatan(!showBankCatatan)}
                      className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 bg-[#d7a217]/10 text-[#d7a217] border border-[#d7a217]/30 hover:bg-[#d7a217]/20"
                    >
                      <Database size={14} />
                      {showBankCatatan ? 'Tutup Bank' : 'Buka Bank Catatan'}
                    </button>
                  )}
                </div>
                
                {isSkpd || isTapd ? (
                  <div className={`p-6 rounded-2xl font-medium italic text-sm leading-relaxed border border-[#cadfdf] dark:border-[#cadfdf]/20 ${isDarkMode ? 'bg-black/20 text-[#cadfdf]' : 'bg-white/50 text-[#3c5654]'}`}>
                    {String(selectedProposal.hasilVerifikasi || "Belum ada catatan verifikasi. Sedang dalam proses pemeriksaan...")}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Bank Catatan Panel */}
                    {showBankCatatan && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <BankCatatanPanel
                          bankCatatan={bankCatatan}
                          onTambah={(judul, isi) => addNotification("Fitur dalam pengembangan", "info")}
                          onEdit={(id, judul, isi) => addNotification("Fitur dalam pengembangan", "info")}
                          onHapus={(id, judul) => addNotification("Fitur dalam pengembangan", "info")}
                          onGunakan={(isi) => {
                            setLocalCatatan(isi);
                            setShowBankCatatan(false);
                            addNotification("Catatan otomatis diterapkan", "success");
                          }}
                          isProcessing={isProcessing}
                          currentUser={currentUserProfile}
                          isDarkMode={isDarkMode}
                          colors={colors}
                        />
                      </div>
                    )}

                    {/* Lampiran Module */}
                    <div className="bg-white/40 dark:bg-black/10 rounded-2xl border border-[#cadfdf]/50 dark:border-[#cadfdf]/10 overflow-hidden">
                      <LampiranView 
                        lampiran={selectedProposal.lampiran} 
                        isDarkMode={isDarkMode}
                        colors={colors}
                      />
                    </div>

                    {/* Input Textarea ECharts Vibe */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#d7a217]/20 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                      <textarea 
                        rows="5" 
                        value={localCatatan} 
                        onChange={e => setLocalCatatan(e.target.value)} 
                        placeholder="Ketik rincian analisa teknis, koreksi kode rekening, atau instruksi perbaikan untuk SKPD disini..." 
                        className={`w-full p-5 rounded-2xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#d7a217] relative z-10 resize-y border ${isDarkMode ? 'bg-[#3c5654]/40 border-[#cadfdf]/20 text-[#e2eceb] placeholder-[#cadfdf]/40' : 'bg-white/70 border-[#cadfdf]/80 text-[#425c5a] placeholder-[#3c5654]/40'}`}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        disabled={isProcessing} 
                        onClick={handleSaveCatatan} 
                        className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:-translate-y-1 flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#d7a217]/20 bg-gradient-to-r from-[#d7a217] to-[#c29115] text-white"
                      >
                        {isProcessing ? 'MENYIMPAN...' : <><Save size={16} /> SIMPAN ANALISA</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabel Rincian SRO - ECharts Aesthetic */}
          <div className={`${glassCard} overflow-hidden group hover:-translate-y-1`}>
            <div className="p-5 border-b border-[#cadfdf]/50 dark:border-[#cadfdf]/10 bg-gradient-to-r from-[#e2eceb]/50 to-transparent dark:from-[#3c5654]/50 dark:to-transparent flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d7a217]/20 flex items-center justify-center text-[#d7a217]">
                <Database size={16} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#425c5a] dark:text-[#e2eceb]">
                Matriks Rincian SRO
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-[#3c5654]/60 text-[#cadfdf]' : 'bg-[#cadfdf]/40 text-[#425c5a]'}`}>
                    <th className="p-4 border-b border-[#cadfdf]/30 dark:border-[#cadfdf]/10">Kode Rekening</th>
                    <th className="p-4 border-b border-[#cadfdf]/30 dark:border-[#cadfdf]/10">Uraian / Rincian</th>
                    <th className="p-4 border-b border-[#cadfdf]/30 dark:border-[#cadfdf]/10 text-right">Pagu Semula</th>
                    <th className="p-4 border-b border-[#cadfdf]/30 dark:border-[#cadfdf]/10 text-right">Pagu Menjadi</th>
                    <th className="p-4 border-b border-[#cadfdf]/30 dark:border-[#cadfdf]/10 text-right">Selisih (Gap)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cadfdf]/40 dark:divide-[#cadfdf]/10">
                  {(selectedProposal.rincian && selectedProposal.rincian.length > 0 
                    ? selectedProposal.rincian 
                    : [{ 
                        kodeRekening: '-', 
                        uraian: String(selectedProposal.subKegiatan || ""), 
                        paguSebelum: selectedProposal.paguSebelum, 
                        paguSesudah: selectedProposal.paguSesudah 
                      }]
                  ).map((r, i) => {
                    const selisih = Number(r.paguSesudah||0) - Number(r.paguSebelum||0);
                    return (
                      <tr key={i} className="transition-colors hover:bg-white/40 dark:hover:bg-white/5">
                        <td className="p-4 font-mono text-[11px] text-[#3c5654] dark:text-[#cadfdf]/80 align-top">
                          {String(r.kodeRekening || "")}
                        </td>
                        <td className="p-4 font-semibold text-[#425c5a] dark:text-white align-top">
                          {String(r.uraian || "")}
                        </td>
                        <td className="p-4 text-right font-medium text-[#3c5654]/90 dark:text-[#cadfdf] align-top tabular-nums">
                          {formatIDR(r.paguSebelum)}
                        </td>
                        <td className="p-4 text-right font-bold text-[#d7a217] align-top tabular-nums">
                          {formatIDR(r.paguSesudah)}
                        </td>
                        <td className="p-4 text-right align-top tabular-nums">
                          <div className={`inline-flex items-center justify-end px-2.5 py-1 rounded-md text-[11px] font-black ${
                            selisih > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                            selisih < 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
                            'text-[#3c5654] dark:text-[#cadfdf]'
                          }`}>
                            {selisih > 0 ? '+' : ''}{formatIDR(selisih)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Total Row ECharts Style */}
                  <tr className={`${isDarkMode ? 'bg-[#d7a217]/10' : 'bg-[#d7a217]/5'}`}>
                    <td colSpan="2" className="p-5 text-right font-black uppercase tracking-widest text-[#425c5a] dark:text-[#e2eceb]">
                      Total Akumulasi Pergeseran
                    </td>
                    <td className="p-5 text-right font-bold text-[#425c5a] dark:text-[#e2eceb] tabular-nums">
                      {formatIDR(selectedProposal.paguSebelum)}
                    </td>
                    <td className="p-5 text-right font-black text-[#d7a217] tabular-nums text-base">
                      {formatIDR(selectedProposal.paguSesudah)}
                    </td>
                    <td className="p-5 text-right tabular-nums">
                      <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-black shadow-sm ${
                        (Number(selectedProposal.paguSesudah||0) - Number(selectedProposal.paguSebelum||0)) > 0 ? 'bg-emerald-500 text-white' :
                        (Number(selectedProposal.paguSesudah||0) - Number(selectedProposal.paguSebelum||0)) < 0 ? 'bg-rose-500 text-white' :
                        'bg-[#cadfdf] text-[#425c5a] dark:bg-[#3c5654] dark:text-[#cadfdf]'
                      }`}>
                        {formatIDR(Number(selectedProposal.paguSesudah||0) - Number(selectedProposal.paguSebelum||0))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Interaksi & Log */}
        <div className="space-y-6">
          {/* Chat Panel Glassmorphism */}
          <div className={`${glassCard} overflow-hidden h-[500px] flex flex-col group hover:-translate-y-1`}>
            <div className="p-4 border-b border-[#cadfdf]/50 dark:border-[#cadfdf]/10 bg-gradient-to-r from-[#e2eceb]/50 to-transparent dark:from-[#3c5654]/50 dark:to-transparent flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <MessageSquare size={16} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#425c5a] dark:text-[#e2eceb]">
                Ruang Diskusi
              </h3>
            </div>
            <div className="flex-1 overflow-hidden p-0 relative">
              <ChatPanel
                comments={selectedProposal.comments || []}
                currentUser={currentUserProfile}
                onSendComment={(e) => {
                  e.preventDefault();
                  if (commentText.trim()) {
                    handleAddComment(selectedProposal.id, {
                      text: commentText.trim(),
                      sender: currentUserProfile.nama,
                      role: currentUserProfile.level,
                      timestamp: new Date().toISOString()
                    });
                    setCommentText('');
                  }
                }}
                commentText={commentText}
                setCommentText={setCommentText}
                disabled={isTapd}
                isDarkMode={isDarkMode}
                colors={colors}
              />
            </div>
          </div>

          {/* History Timeline Glassmorphism */}
          <div className={`${glassCard} overflow-hidden group hover:-translate-y-1`}>
            <div className="p-4 border-b border-[#cadfdf]/50 dark:border-[#cadfdf]/10 bg-gradient-to-r from-[#e2eceb]/50 to-transparent dark:from-[#3c5654]/50 dark:to-transparent flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <History size={16} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#425c5a] dark:text-[#e2eceb]">
                Log Aktivitas
              </h3>
            </div>
            <div className="p-5">
              <HistoryTimeline 
                history={selectedProposal.history || []} 
                isDarkMode={isDarkMode}
                colors={colors}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal History Versi - LETAKKAN DI SINI (DI DALAM RETURN, SEBELUM PENUTUP DIV) */}
      {showVersionHistory && (
        <VersionHistoryModal
          show={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          proposal={selectedProposal}
          isDarkMode={isDarkMode}
          colors={colors}
        />
      )}

      {/* Styles for particles and smooth details */}
      <style jsx>{`
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: var(--opacity, 0.4); }
          90% { opacity: var(--opacity, 0.4); }
          100% { transform: translateY(-100vh) translateX(50px) rotate(360deg); opacity: 0; }
        }
        .animate-float-particle {
          animation-name: float-particle;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default ProposalDetailView;