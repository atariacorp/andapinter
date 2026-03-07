import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Calendar, Building2, Search, X, Send, 
  Info, Database, Upload, FileText, Download, Trash2,
  Plus, MessageSquare, History, CheckCircle, Save,
  Sparkles, Edit3, Clock
} from 'lucide-react';
import RincianSRORow from './RincianSRORow';
import FileUploader from '../common/FileUploader';
import BankSroModal from '../settings/BankSroModal';
import { formatIDR, generateUniqueId, IS_CANVAS } from '../../utils';

// --- Komponen Partikel Emas Mengambang (Pure Visual) ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 20 + 15,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#d7a217] animate-float-form"
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

const ProposalFormView = ({
  currentUserProfile,
  proposals,
  masterData,
  setView,
  addNotification,
  isProcessing,
  setIsProcessing,
  selectedProposal,
  localCatatan,
  setLocalCatatan,
  commentText,
  setCommentText,
  isDarkMode
}) => {
  const {
    proposalForm,
    setProposalForm,
    isEditing,
    createProposal,
    updateProposal,
    addComment
  } = proposals || {};

  const { skpdList = [], subKegList = [], tahapList = [], bankSro = [] } = masterData || {};

  // Palet warna teal & gold
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealLight: '#e2eceb',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };

  // Local states
  const [showSubKegDropdown, setShowSubKegDropdown] = useState(false);
  const [searchSubKeg, setSearchSubKeg] = useState('');
  const [filteredSubKeg, setFilteredSubKeg] = useState([]);
  const [showBankSro, setShowBankSro] = useState(false);
  const [filterBankSro, setFilterBankSro] = useState('');
  
  // Upload states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Chat scroll ref
  const chatContainerRef = useRef(null);

  // Auto-scroll chat if present
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [selectedProposal?.comments]);

  // Filter sub kegiatan
  useEffect(() => {
    if (searchSubKeg.trim() === '') {
      setFilteredSubKeg([]);
    } else {
      const filtered = subKegList.filter(item => 
        item.nama?.toLowerCase().includes(searchSubKeg.toLowerCase())
      );
      setFilteredSubKeg(filtered.slice(0, 10));
    }
  }, [searchSubKeg, subKegList]);

  // Calculate totals
  const formTotalSebelum = (proposalForm?.rincian || []).reduce(
    (sum, item) => sum + Number(item.paguSebelum || 0), 0
  );
  const formTotalSesudah = (proposalForm?.rincian || []).reduce(
    (sum, item) => sum + Number(item.paguSesudah || 0), 0
  );
  const formTotalSelisih = formTotalSesudah - formTotalSebelum;

  // Handlers
  const handleAddRincian = (e) => {
    e.preventDefault();
    setProposalForm(prev => ({
      ...prev,
      rincian: [...(prev.rincian || []), { 
        id: generateUniqueId(), 
        kodeRekening: '', 
        uraian: '', 
        paguSebelum: 0, 
        paguSesudah: 0 
      }]
    }));
  };

  const handleRemoveRincian = (id) => {
    setProposalForm(prev => ({
      ...prev,
      rincian: prev.rincian.filter(r => r.id !== id)
    }));
  };

  const handleRincianChange = (index, field, value) => {
    const newRincian = [...proposalForm.rincian];
    newRincian[index] = { ...newRincian[index], [field]: value };
    setProposalForm(prev => ({ ...prev, rincian: newRincian }));
  };

  const handlePilihSro = (index, kode, uraian) => {
    const newRincian = [...proposalForm.rincian];
    newRincian[index] = {
      ...newRincian[index],
      kodeRekening: kode,
      uraian: uraian
    };
    setProposalForm(prev => ({ ...prev, rincian: newRincian }));
    addNotification(`✅ Kode ${kode} diterapkan`, "success");
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      addNotification(`Tipe file ${file.type} tidak diizinkan. Gunakan PDF/JPG/PNG.`, "error");
      e.target.value = null;
      return;
    }

    // Validasi ukuran (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      addNotification(`File terlalu besar (${(file.size/1024/1024).toFixed(2)}MB). Maksimal 2MB.`, "error");
      e.target.value = null;
      return;
    }

    try {
      addNotification("Mengupload file...", "info");
      setUploadingFile(true);
      setUploadProgress(0);
      
      // Simulasi progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }
      
      const dummyResult = {
        url: "#",
        path: "dummy/path",
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
      
      setProposalForm(prev => ({ ...prev, lampiran: dummyResult }));
      addNotification("✅ File berhasil diupload!", "success");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message);
      addNotification(`Gagal upload: ${error.message}`, "error");
    } finally {
      setUploadingFile(false);
      e.target.value = null;
    }
  };

  const handleSaveProposal = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const totalPaguSebelum = (proposalForm.rincian || []).reduce(
      (sum, item) => sum + Number(item.paguSebelum || 0), 0
    );
    const totalPaguSesudah = (proposalForm.rincian || []).reduce(
      (sum, item) => sum + Number(item.paguSesudah || 0), 0
    );
    const totalSelisih = totalPaguSesudah - totalPaguSebelum;

    const isSkpdRole = currentUserProfile?.level === 'SKPD';
    const finalSkpdId = isSkpdRole ? currentUserProfile.skpdId : proposalForm.skpdId;
    const finalSkpdName = isSkpdRole ? currentUserProfile.nama : 
      (skpdList.find(s => s.id === proposalForm.skpdId)?.nama || proposalForm.skpd);

    const historyEntry = {
      action: isEditing ? 'Usulan Diperbarui' : 'Usulan Dibuat',
      by: String(currentUserProfile?.nama || "System"),
      date: new Date().toISOString()
    };

    const { id, history, comments, ...cleanForm } = proposalForm;

    const dataToSave = {
      ...cleanForm,
      skpd: String(finalSkpdName),
      skpdId: String(finalSkpdId),
      paguSebelum: totalPaguSebelum,
      paguSesudah: totalPaguSesudah,
      selisih: totalSelisih,
      updatedAt: new Date().toISOString(),
      updatedBy: String(currentUserProfile?.nama || "System"),
      history: [...(history || []), historyEntry]
    };

    if (isSkpdRole && isEditing && selectedProposal) {
      dataToSave.tahap = selectedProposal.tahap;
    }

    try {
      if (isEditing && proposalForm.id) {
        await updateProposal(proposalForm.id, dataToSave);
        addNotification("Usulan berhasil diperbarui", "success");
      } else {
        await createProposal(dataToSave);
        addNotification("Usulan berhasil dikirim", "success");
      }
      setView('list');
      proposals.resetForm();
    } catch (err) {
      console.error(err);
      addNotification(`Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedProposal) return;
    
    const newComment = {
      text: commentText.trim(),
      sender: String(currentUserProfile?.nama || "User"),
      role: String(currentUserProfile?.level || "Guest"),
      timestamp: new Date().toISOString()
    };

    try {
      await addComment(selectedProposal.id, newComment);
      setCommentText('');
      addNotification("Pesan terkirim", "success");
    } catch (err) {
      console.error(err);
      addNotification("Gagal mengirim pesan", "error");
    }
  };

  // Jika form belum diinisialisasi
  if (!proposalForm) return null;

  // --- Konstanta Desain ---
  const glassCard = isDarkMode 
    ? "bg-[#3c5654]/40 backdrop-blur-xl border border-[#cadfdf]/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-3xl transition-all duration-500"
    : "bg-white/60 backdrop-blur-xl border border-[#cadfdf]/80 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-3xl transition-all duration-500";
    
  const glassInput = isDarkMode
    ? "bg-black/20 border border-[#cadfdf]/20 text-[#e2eceb] focus:ring-2 focus:ring-[#d7a217]/50 rounded-xl outline-none transition-all duration-300 placeholder-[#cadfdf]/40"
    : "bg-white/70 border border-[#cadfdf]/60 text-[#425c5a] focus:ring-2 focus:ring-[#d7a217]/50 rounded-xl outline-none transition-all duration-300 placeholder-[#3c5654]/50";

  return (
    <div className={`space-y-6 animate-in fade-in relative font-sans min-h-screen pb-10 ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#3c5654]'}`}>
      
      {/* Background Aesthetic ECharts (Subtle Grid) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      />
      <FloatingGoldParticles />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className={`${glassCard} p-6 mb-6 flex items-center gap-4 hover:shadow-xl group/header`}>
          <button 
            onClick={() => { 
              setView('list'); 
              if(proposals.resetForm) proposals.resetForm(); 
            }} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 hover:-translate-x-1 shadow-md bg-[#425c5a] dark:bg-[#cadfdf]/10 text-white dark:text-[#d7a217] hover:bg-[#d7a217] dark:hover:bg-[#d7a217] dark:hover:text-white"
          >
            <ArrowLeft size={20}/>
          </button>
          <div className="transform transition-transform duration-500 group-hover/header:translate-x-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#d7a217]/10 border border-[#d7a217]/30 mb-1">
              <Sparkles size={12} className="text-[#d7a217]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d7a217]">Formulir Sistem</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#425c5a] dark:text-white">
              {isEditing ? 'Perbarui Usulan' : 'Tambah Usulan Baru'}
            </h2>
            <p className="text-xs md:text-sm mt-1 flex items-center gap-2 text-[#3c5654]/80 dark:text-[#cadfdf]/80 font-medium">
              <Building2 size={14} className="text-[#d7a217]" />
              Pemohon: <span className="text-[#d7a217] font-bold">{String(currentUserProfile?.nama || "User")}</span>
            </p>
          </div>
        </div>
        
        {/* --- MAIN FORM CONTENT --- */}
        <div className={`grid grid-cols-1 ${isEditing && selectedProposal ? 'xl:grid-cols-3' : ''} gap-6`}>
          
          {/* KOLOM KIRI (Form Input Utama) */}
          <div className={`${isEditing && selectedProposal ? 'xl:col-span-2' : ''} space-y-6`}>
            
            {/* Warning Banner */}
            <div className={`p-4 rounded-2xl flex items-start gap-4 backdrop-blur-md border animate-in slide-in-from-top-2 shadow-sm ${
              isDarkMode ? 'bg-[#d7a217]/10 border-[#d7a217]/30' : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-[#d7a217] shrink-0 mt-0.5">
                <Info size={20} />
              </div>
              <div>
                <h4 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-[#d7a217]' : 'text-amber-800'}`}>Peringatan Regulasi</h4>
                <p className={`text-xs mt-1.5 leading-relaxed font-medium ${isDarkMode ? 'text-[#cadfdf]/90' : 'text-amber-700/80'}`}>
                  Pastikan seluruh rincian Sub Rincian Objek (SRO) yang ditambahkan sesuai dengan peraturan dan standarisasi nomenklatur yang berlaku.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProposal} className="space-y-6">
              
              {/* Bagian 1: Header Surat */}
              <div className={`${glassCard} p-6 md:p-8 hover:-translate-y-1`}>
                <h3 className="text-sm font-black uppercase flex items-center gap-3 tracking-widest text-[#425c5a] dark:text-white border-b border-[#cadfdf]/50 dark:border-[#cadfdf]/10 pb-4 mb-6">
                  <div className="p-2 bg-[#d7a217]/20 rounded-lg text-[#d7a217]">
                    <Calendar size={18}/>
                  </div>
                  Informasi Surat & Dokumen
                </h3>
                
                <div className="space-y-5">
                  {/* Tahap & SKPD */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2 group/input">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">
                        Tahap Pergeseran
                      </label>
                      {currentUserProfile?.level === 'SKPD' ? (
                        <div className={`w-full p-4 rounded-xl text-sm font-bold italic border ${isDarkMode ? 'bg-black/20 border-[#cadfdf]/20 text-[#cadfdf]/60' : 'bg-gray-50 border-[#cadfdf]/60 text-[#3c5654]/60'}`}>
                          Akan ditentukan oleh Admin
                        </div>
                      ) : (
                        <select 
                          required 
                          value={proposalForm.tahap || ''} 
                          onChange={e => setProposalForm({...proposalForm, tahap: e.target.value})} 
                          className={`${glassInput} w-full p-4 text-sm font-bold uppercase tracking-wider cursor-pointer appearance-none`}
                        >
                          <option value="Belum Ditentukan">-- Pilih Tahap --</option>
                          {tahapList && tahapList.length > 0 ? (
                            tahapList.map(t => (
                              <option key={t.id} value={t.nama} className="bg-white dark:bg-[#425c5a]">{String(t.nama || "")}</option>
                            ))
                          ) : null}
                        </select>
                      )}
                    </div>

                    <div className="space-y-2 group/input">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">
                        Instansi Pengusul
                      </label>
                      {currentUserProfile?.level === 'SKPD' ? (
                        <div className={`w-full p-4 rounded-xl text-sm font-bold flex items-center gap-3 border ${isDarkMode ? 'bg-black/20 border-[#cadfdf]/20 text-[#e2eceb]' : 'bg-white/50 border-[#cadfdf]/60 text-[#425c5a]'}`}>
                          <Building2 size={16} className="text-[#d7a217]" /> 
                          {String(currentUserProfile.nama || "")}
                        </div>
                      ) : (
                        <select 
                          required 
                          value={proposalForm.skpdId || ''} 
                          onChange={e => setProposalForm({...proposalForm, skpdId: e.target.value})} 
                          className={`${glassInput} w-full p-4 text-sm font-bold cursor-pointer appearance-none`}
                        >
                          <option value="">Pilih Instansi...</option>
                          {skpdList.map(s => (
                            <option key={s.id} value={s.id} className="bg-white dark:bg-[#425c5a]">{String(s.nama || "")}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Nomor Surat & Tanggal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2 group/input">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">
                        Nomor Surat Usulan
                      </label>
                      <input 
                        required 
                        value={proposalForm.nomorSurat || ''} 
                        onChange={e => setProposalForm({...proposalForm, nomorSurat: e.target.value})} 
                        className={`${glassInput} w-full p-4 text-sm font-bold`} 
                        placeholder="Contoh: 900/123/BPKAD/2026" 
                      />
                    </div>
                    <div className="space-y-2 group/input">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">
                        Tanggal Surat
                      </label>
                      <input 
                        required 
                        type="date" 
                        value={proposalForm.tanggalSurat || ''} 
                        onChange={e => setProposalForm({...proposalForm, tanggalSurat: e.target.value})} 
                        className={`${glassInput} w-full p-4 text-sm font-bold cursor-pointer`} 
                      />
                    </div>
                  </div>
                  
                  {/* Sub Kegiatan (Searchable) */}
                  <div className="space-y-2 relative group/input">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">
                      Sub Kegiatan Utama
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchSubKeg}
                        onChange={(e) => {
                          setSearchSubKeg(e.target.value);
                          setShowSubKegDropdown(true);
                        }}
                        onFocus={() => setShowSubKegDropdown(true)}
                        placeholder="Ketik untuk mencari sub kegiatan..."
                        className={`${glassInput} w-full p-4 pl-12 text-sm font-medium`}
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3c5654]/50 dark:text-[#cadfdf]/50 group-focus-within/input:text-[#d7a217] transition-colors" />
                    </div>
                    
                    {proposalForm.subKegiatan && (
                      <div className="mt-3 p-3.5 rounded-xl text-xs flex items-center justify-between shadow-sm bg-[#d7a217]/10 border border-[#d7a217]/30 text-[#d7a217] animate-in fade-in">
                        <span className="font-bold">Terpilih: {proposalForm.subKegiatan}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setProposalForm({...proposalForm, subKegiatan: ''});
                            setSearchSubKeg('');
                          }}
                          className="p-1.5 rounded-lg bg-[#d7a217]/20 hover:bg-[#d7a217] hover:text-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    
                    {showSubKegDropdown && filteredSubKeg.length > 0 && (
                      <>
                        <div className={`absolute z-50 mt-2 w-full rounded-2xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-2xl border custom-form-scroll ${isDarkMode ? 'bg-[#1a2625]/95 border-[#cadfdf]/20' : 'bg-white/95 border-[#cadfdf]/60'}`}>
                          {filteredSubKeg.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className={`w-full text-left px-5 py-3.5 border-b last:border-0 transition-colors text-sm font-semibold hover:bg-[#d7a217]/10 hover:text-[#d7a217] ${isDarkMode ? 'border-[#cadfdf]/10 text-[#cadfdf]' : 'border-[#cadfdf]/30 text-[#425c5a]'}`}
                              onClick={() => {
                                setProposalForm({...proposalForm, subKegiatan: item.nama});
                                setSearchSubKeg('');
                                setShowSubKegDropdown(false);
                              }}
                            >
                              {item.nama}
                            </button>
                          ))}
                        </div>
                        <div className="fixed inset-0 z-40" onClick={() => setShowSubKegDropdown(false)} />
                      </>
                    )}
                  </div>

                  {/* Perihal */}
                  <div className="space-y-2 group/input">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">
                      Perihal Pergeseran
                    </label>
                    <textarea 
                      required 
                      rows="2" 
                      value={proposalForm.perihal || ''} 
                      onChange={e => setProposalForm({...proposalForm, perihal: e.target.value})} 
                      className={`${glassInput} w-full p-4 text-sm font-medium resize-y custom-form-scroll`} 
                      placeholder="Uraikan perihal ringkas pengajuan ini..." 
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Rincian SRO */}
              <div className={`${glassCard} p-6 md:p-8 hover:-translate-y-1`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-[#cadfdf]/50 dark:border-[#cadfdf]/10 pb-4 mb-6">
                  <h3 className="text-sm font-black uppercase flex items-center gap-3 tracking-widest text-[#425c5a] dark:text-white">
                    <div className="p-2 bg-[#d7a217]/20 rounded-lg text-[#d7a217]">
                      <Database size={18}/>
                    </div>
                    Rincian Pergeseran S.R.O
                  </h3>
                  <button 
                    type="button" 
                    onClick={handleAddRincian} 
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-md bg-gradient-to-r from-[#d7a217] to-[#c29115] text-white"
                  >
                    <Plus size={16}/> Tambah Rincian
                  </button>
                </div>

                {/* Header Tabel Rincian (Hidden on Mobile) */}
                <div className="hidden md:grid grid-cols-12 gap-3 text-[10px] font-black uppercase tracking-widest px-3 mb-3 text-[#3c5654]/70 dark:text-[#cadfdf]/70">
                  <div className="col-span-3">Kode Rekening</div>
                  <div className="col-span-3">Uraian SRO</div>
                  <div className="col-span-2 text-right">Pagu Semula</div>
                  <div className="col-span-2 text-right">Pagu Menjadi</div>
                  <div className="col-span-2 text-center">Aksi</div>
                </div>

                {/* List Rincian */}
                <div className="space-y-4 md:space-y-3 relative z-10">
                  {(proposalForm.rincian || []).map((item, index) => (
                    <RincianSRORow
                      key={item.id}
                      item={item}
                      index={index}
                      onItemChange={handleRincianChange}
                      onRemove={handleRemoveRincian}
                      onOpenBankSro={() => setShowBankSro(true)}
                      isLastItem={(proposalForm.rincian || []).length === 1}
                      isDarkMode={isDarkMode}
                      colors={colors}
                    />
                  ))}
                </div>

                {/* Ringkasan Pagu (Dashboard Vibe) */}
                <div className={`p-6 rounded-2xl mt-8 border shadow-inner ${isDarkMode ? 'bg-black/20 border-[#cadfdf]/10' : 'bg-white/50 border-[#cadfdf]/40'}`}>
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="font-bold text-[#3c5654] dark:text-[#cadfdf]/80 uppercase tracking-widest text-[11px]">Total Pagu Semula</span>
                    <span className="font-bold text-[#425c5a] dark:text-[#e2eceb] tabular-nums">{formatIDR(formTotalSebelum)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-4 border-b border-[#cadfdf]/40 dark:border-[#cadfdf]/10 pb-4">
                    <span className="font-bold text-[#d7a217] uppercase tracking-widest text-[11px]">Total Pagu Sesudah</span>
                    <span className="font-black text-[#d7a217] tabular-nums">{formatIDR(formTotalSesudah)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-black uppercase tracking-widest text-[#425c5a] dark:text-white">Total Selisih</span>
                    <span className={`text-lg font-black tabular-nums ${
                      formTotalSelisih > 0 ? 'text-emerald-500' : formTotalSelisih < 0 ? 'text-rose-500' : 'text-[#3c5654] dark:text-[#cadfdf]'
                    }`}>
                      {formTotalSelisih > 0 ? '+' : ''}{formatIDR(formTotalSelisih)}
                    </span>
                  </div>
                </div>

                {/* Alasan Pergeseran */}
                <div className="mt-8 space-y-2 group/input">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#3c5654]/80 dark:text-[#cadfdf]/70 ml-1">
                    Alasan Pergeseran SRO
                  </label>
                  <textarea 
                    required 
                    rows="3" 
                    value={proposalForm.alasan || ''} 
                    onChange={e => setProposalForm({...proposalForm, alasan: e.target.value})} 
                    className={`${glassInput} w-full p-4 text-sm font-medium resize-y custom-form-scroll`} 
                    placeholder="Uraikan secara detail alasan pemindahan anggaran antar SRO..." 
                  />
                </div>
                
                {/* Catatan Admin (Hanya untuk Non-SKPD) */}
                {currentUserProfile?.level !== 'SKPD' && (
                  <div className="mt-6 pt-6 border-t border-[#cadfdf]/50 dark:border-[#cadfdf]/10 space-y-2 group/input">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#d7a217] flex items-center gap-2 ml-1">
                      <Edit3 size={14} /> Catatan Verifikasi Admin
                    </label>
                    <textarea 
                      rows="3" 
                      value={proposalForm.hasilVerifikasi || ''} 
                      onChange={e => setProposalForm({...proposalForm, hasilVerifikasi: e.target.value})} 
                      className={`w-full p-4 text-sm font-medium resize-y custom-form-scroll outline-none rounded-xl transition-all focus:ring-2 focus:ring-[#d7a217] border shadow-inner ${
                        isDarkMode ? 'bg-[#1a2625]/60 border-[#d7a217]/30 text-[#e2eceb]' : 'bg-[#d7a217]/5 border-[#d7a217]/30 text-[#425c5a]'
                      }`} 
                      placeholder="Masukkan catatan verifikasi atau alasan penolakan (jika ada)..."
                    />
                  </div>
                )}
                
                {/* Submit Button */}
                <button 
  disabled={isProcessing} 
  type="submit" 
  className="w-full py-5 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg transition-all duration-300 hover:scale-[1.02] mt-6 flex items-center justify-center gap-3 disabled:opacity-50 backdrop-blur-md border"
  style={{ 
    backgroundColor: isDarkMode ? 'rgba(66, 92, 90, 0.4)' : 'rgba(66, 92, 90, 0.8)',
    borderColor: 'rgba(215, 162, 23, 0.3)',
    color: isDarkMode ? '#e2eceb' : 'white',
    boxShadow: '0 8px 32px rgba(66, 92, 90, 0.2)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(66, 92, 90, 0.6)' : 'rgba(66, 92, 90, 1)';
    e.currentTarget.style.borderColor = 'rgba(215, 162, 23, 0.5)';
    e.currentTarget.style.boxShadow = '0 8px 32px rgba(215, 162, 23, 0.3)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(66, 92, 90, 0.4)' : 'rgba(66, 92, 90, 0.8)';
    e.currentTarget.style.borderColor = 'rgba(215, 162, 23, 0.3)';
    e.currentTarget.style.boxShadow = '0 8px 32px rgba(66, 92, 90, 0.2)';
  }}
>
  {isProcessing ? (
    <>
      <span className="animate-spin text-lg">⟳</span> 
      MENYIMPAN DATA...
    </>
  ) : (
    <>
      <Save size={20} /> 
      {isEditing ? 'PERBARUI USULAN' : 'KIRIM USULAN SEKARANG'}
    </>
  )}
</button>
              </div>
            </form>
          </div>
          
          {/* KOLOM KANAN (Chat & History) - Tampil Saat Edit */}
          {isEditing && selectedProposal && (
            <div className="space-y-6">
              
              {/* Chat Panel Glassmorphism */}
              <div className={`${glassCard} flex flex-col h-[450px] transition-all hover:-translate-y-1`}>
                <div className="p-5 border-b border-[#cadfdf]/50 dark:border-[#cadfdf]/10 flex items-center gap-3 bg-gradient-to-r from-[#e2eceb]/50 to-transparent dark:from-[#3c5654]/50 dark:to-transparent">
                  <div className="w-8 h-8 rounded-lg bg-[#d7a217]/20 flex items-center justify-center text-[#d7a217] shadow-inner">
                    <MessageSquare size={16} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#425c5a] dark:text-[#e2eceb]">Ruang Diskusi</h3>
                  <span className="ml-auto text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm bg-[#d7a217]/10 text-[#d7a217] border border-[#d7a217]/30">
                    {selectedProposal.comments?.length || 0} Pesan
                  </span>
                </div>
                
                <div ref={chatContainerRef} className="flex-grow p-5 overflow-y-auto space-y-5 custom-form-scroll scroll-smooth relative">
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                  
                  {!selectedProposal.comments || selectedProposal.comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-70 relative z-10 animate-in fade-in">
                      <div className="w-14 h-14 rounded-full bg-[#d7a217]/10 flex items-center justify-center mb-3 shadow-inner">
                        <MessageSquare size={24} className="text-[#d7a217]" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#425c5a] dark:text-[#cadfdf]">Belum Ada Diskusi</p>
                    </div>
                  ) : (
                    selectedProposal.comments.map((c, i) => {
                      const isMe = c.sender === currentUserProfile?.nama;
                      return (
                        <div key={i} className={`flex flex-col relative z-10 w-full animate-in slide-in-from-bottom-2 ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`flex items-center gap-2 mb-1.5 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            {!isMe && <span className="text-[10px] font-black uppercase tracking-wider text-[#3c5654] dark:text-[#cadfdf]">{c.sender}</span>}
                            <span className="text-[8px] font-bold text-[#3c5654]/60 dark:text-[#cadfdf]/60">
                              {new Date(c.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          
                          <div className={`relative p-3.5 max-w-[85%] text-xs font-medium leading-relaxed shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                              isMe 
                                ? 'rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#d7a217] to-[#c29115] text-white shadow-[#d7a217]/20' 
                                : `rounded-2xl rounded-tl-sm border ${isDarkMode ? 'bg-[#3c5654]/80 text-[#e2eceb] border-[#cadfdf]/20' : 'bg-white/90 text-[#425c5a] border-[#cadfdf]/50'}`
                            }`}
                          >
                            {c.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {currentUserProfile?.level !== 'TAPD' && (
                  <div className={`p-4 border-t backdrop-blur-xl ${isDarkMode ? 'border-[#cadfdf]/10 bg-[#3c5654]/50' : 'border-[#cadfdf]/50 bg-white/60'}`}>
                    <form onSubmit={handleAddComment} className="flex gap-3 relative group/chat">
                      <input 
                        type="text" 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        placeholder="Ketik pesan..." 
                        className={`flex-1 px-4 py-3 rounded-xl text-xs font-medium outline-none transition-all duration-300 focus:ring-2 focus:ring-[#d7a217]/50 border shadow-inner ${
                          isDarkMode ? 'bg-black/20 border-[#cadfdf]/20 text-[#e2eceb]' : 'bg-white/80 border-[#cadfdf]/60 text-[#425c5a]'
                        }`}
                      />
                      <button 
                        type="submit" 
                        disabled={!commentText.trim()} 
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#d7a217] to-[#c29115] text-white shadow-lg shadow-[#d7a217]/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        <Send size={16} className="ml-0.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* History Timeline - Glass Card */}
              <div className={`${glassCard} flex flex-col max-h-[400px] hover:-translate-y-1`}>
                <div className="p-5 border-b border-[#cadfdf]/50 dark:border-[#cadfdf]/10 flex items-center gap-3 bg-gradient-to-r from-[#e2eceb]/50 to-transparent dark:from-[#3c5654]/50 dark:to-transparent">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-inner">
                    <History size={16} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#425c5a] dark:text-[#e2eceb]">Log Aktivitas</h3>
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto custom-form-scroll relative">
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                  
                  <div className="space-y-5 relative z-10 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#d7a217] before:via-[#cadfdf] before:to-transparent">
                    {(selectedProposal.history || []).length === 0 ? (
                      <p className="text-xs italic text-center font-medium opacity-60">Belum ada riwayat tercatat.</p>
                    ) : (
                      (selectedProposal.history || []).map((h, i) => (
                        <div key={i} className="flex gap-5 relative group/hist animate-in slide-in-from-bottom-2">
                          {/* Timeline Dot */}
                          <div className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center bg-[#d7a217]/20 shrink-0 mt-0.5 transition-transform group-hover/hist:scale-125">
                            <div className="w-2 h-2 rounded-full bg-[#d7a217] shadow-[0_0_8px_#d7a217]" />
                          </div>
                          
                          <div className={`pb-4 flex-1 transition-all duration-300 transform group-hover/hist:translate-x-1`}>
                            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#425c5a]'}`}>
                              {String(h.action)}
                            </p>
                            <div className={`flex items-center gap-1.5 mt-1 text-[10px] font-medium ${isDarkMode ? 'text-[#cadfdf]/80' : 'text-[#3c5654]/80'}`}>
                              <span className="font-bold text-[#d7a217]">{String(h.by)}</span>
                              <span>•</span>
                              <Clock size={10} className="opacity-70" />
                              {new Date(h.date).toLocaleDateString('id-ID', {day:'numeric', month:'short'})} {new Date(h.date).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Bank SRO */}
      {BankSroModal && (
        <BankSroModal
          show={showBankSro}
          onClose={() => {
            setShowBankSro(false);
            setFilterBankSro('');
          }}
          bankSro={bankSro}
          onSelect={(kode, uraian) => {
            const index = parseInt(sessionStorage.getItem('editingSroIndex') || '0');
            handlePilihSro(index, kode, uraian);
          }}
          filterText={filterBankSro}
          onFilterChange={setFilterBankSro}
          isDarkMode={isDarkMode}
          colors={colors}
        />
      )}

      {/* Internal Styles */}
      <style jsx>{`
        @keyframes float-form {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: var(--opacity, 0.4); }
          80% { opacity: var(--opacity, 0.4); }
          100% { transform: translateY(-100px) translateX(30px) scale(0.8); opacity: 0; }
        }
        .animate-float-form {
          animation-name: float-form;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .custom-form-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-form-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-form-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.3);
          border-radius: 10px;
        }
        .custom-form-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.6);
        }
      `}</style>
    </div>
  );
};

export default ProposalFormView;