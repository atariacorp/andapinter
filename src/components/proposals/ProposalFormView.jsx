import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, Building2, Search, X, Send, 
  Info, Database, Upload, FileText, Download, Trash2,
  Plus, MessageSquare, History, CheckCircle
} from 'lucide-react';
import RincianSRORow from './RincianSRORow';
import FileUploader from '../common/FileUploader';
import BankSroModal from '../settings/BankSroModal';
import { formatIDR, generateUniqueId } from '../../utils/helpers';
import { IS_CANVAS } from '../../utils/constants';

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
  setCommentText
}) => {
  const {
    proposalForm,
    setProposalForm,
    isEditing,
    createProposal,
    updateProposal,
    addComment
  } = proposals;

  const { skpdList, subKegList, tahapList, bankSro } = masterData;

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
  const formTotalSebelum = (proposalForm.rincian || []).reduce(
    (sum, item) => sum + Number(item.paguSebelum || 0), 0
  );
  const formTotalSesudah = (proposalForm.rincian || []).reduce(
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

    const proposalId = proposalForm.id || 'draft';
    
    try {
      addNotification("Mengupload file...", "info");
      // Di sini Anda perlu mengimplementasi upload ke Firebase Storage
      // Untuk sementara, kita simulasi
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

    const isSkpdRole = currentUserProfile.level === 'SKPD';
    const finalSkpdId = isSkpdRole ? currentUserProfile.skpdId : proposalForm.skpdId;
    const finalSkpdName = isSkpdRole ? currentUserProfile.nama : 
      (skpdList.find(s => s.id === proposalForm.skpdId)?.nama || proposalForm.skpd);

    const historyEntry = {
      action: isEditing ? 'Usulan Diperbarui' : 'Usulan Dibuat',
      by: String(currentUserProfile.nama),
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
      updatedBy: String(currentUserProfile.nama),
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
      sender: String(currentUserProfile.nama),
      role: String(currentUserProfile.level),
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

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => { 
            setView('list'); 
            proposals.resetForm(); 
          }} 
          className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft size={18}/>
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {isEditing ? 'Perbarui Usulan' : 'Tambah Usulan Baru'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
            {String(currentUserProfile.nama || "")}
          </p>
        </div>
      </div>
      
      {/* Main Form */}
      <div className={`grid grid-cols-1 ${isEditing && selectedProposal ? 'xl:grid-cols-3' : ''} gap-6`}>
        
        {/* Left Column (Form) */}
        <div className={`${isEditing && selectedProposal ? 'xl:col-span-2' : ''} space-y-6`}>
          
          {/* Warning Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3">
            <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">Peringatan Regulasi</h4>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 leading-relaxed">
                Pastikan seluruh rincian SRO yang ditambahkan sesuai dengan peraturan yang berlaku.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProposal} className="space-y-6">
            
            {/* Bagian 1: Header Surat */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
              <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2 tracking-widest italic">
                <Calendar size={14}/> INFORMASI SURAT & DOKUMEN
              </h3>
              
              {/* Tahap dan SKPD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">
                    Tahap Pergeseran
                  </label>
                  {currentUserProfile.level === 'SKPD' ? (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 italic">
                      Akan ditentukan oleh Admin
                    </div>
                  ) : (
                    <select 
                      required 
                      value={proposalForm.tahap} 
                      onChange={e => setProposalForm({...proposalForm, tahap: e.target.value})} 
                      className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-black focus:ring-2 focus:ring-blue-500 outline-none uppercase tracking-widest"
                    >
                      <option value="Belum Ditentukan">-- Pilih Tahap --</option>
                      {tahapList && tahapList.length > 0 ? (
                        tahapList.map(t => (
                          <option key={t.id} value={t.nama}>{String(t.nama || "")}</option>
                        ))
                      ) : null}
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">
                    Instansi Pengusul
                  </label>
                  {currentUserProfile.level === 'SKPD' ? (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 italic flex items-center gap-2 shadow-inner">
                      <Building2 size={16}/> {String(currentUserProfile.nama || "")}
                    </div>
                  ) : (
                    <select 
                      required 
                      value={proposalForm.skpdId} 
                      onChange={e => setProposalForm({...proposalForm, skpdId: e.target.value})} 
                      className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Pilih Instansi...</option>
                      {skpdList.map(s => (
                        <option key={s.id} value={s.id}>{String(s.nama || "")}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Nomor Surat dan Tanggal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">
                    Nomor Surat Usulan
                  </label>
                  <input 
                    required 
                    value={proposalForm.nomorSurat} 
                    onChange={e => setProposalForm({...proposalForm, nomorSurat: e.target.value})} 
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="900/..." 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">
                    Tanggal
                  </label>
                  <input 
                    required 
                    type="date" 
                    value={proposalForm.tanggalSurat} 
                    onChange={e => setProposalForm({...proposalForm, tanggalSurat: e.target.value})} 
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none" 
                  />
                </div>
              </div>
              
              {/* Sub Kegiatan dengan Pencarian */}
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">
                  Sub Kegiatan
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
                    className="w-full p-3 pl-10 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                
                {/* Nilai yang dipilih */}
                {proposalForm.subKegiatan && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-700 dark:text-blue-300 flex items-center justify-between">
                    <span className="font-medium">Dipilih: {proposalForm.subKegiatan}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setProposalForm({...proposalForm, subKegiatan: ''});
                        setSearchSubKeg('');
                      }}
                      className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {/* Dropdown Hasil Pencarian */}
                {showSubKegDropdown && filteredSubKeg.length > 0 && (
                  <>
                    <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {filteredSubKeg.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
                          onClick={() => {
                            setProposalForm({...proposalForm, subKegiatan: item.nama});
                            setSearchSubKeg('');
                            setShowSubKegDropdown(false);
                          }}
                        >
                          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {item.nama}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowSubKegDropdown(false)}
                    />
                  </>
                )}
              </div>

              {/* Perihal */}
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">
                  Perihal Pergeseran
                </label>
                <textarea 
                  required 
                  rows="2" 
                  value={proposalForm.perihal} 
                  onChange={e => setProposalForm({...proposalForm, perihal: e.target.value})} 
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 font-medium outline-none" 
                />
              </div>

              {/* Upload File */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2 tracking-widest italic mb-4">
                  <Upload size={14}/> DOKUMEN PENDUKUNG
                </h3>
                
                <FileUploader
                  file={proposalForm.lampiran}
                  onUpload={handlePdfUpload}
                  onRemove={() => setProposalForm({...proposalForm, lampiran: null})}
                  uploading={uploadingFile}
                  uploadProgress={uploadProgress}
                  error={uploadError}
                />
              </div>
            </div>

            {/* Bagian 2: Rincian SRO */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
                <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2 tracking-widest italic">
                  <Database size={14}/> RINCIAN PERGESERAN S.R.O
                </h3>
                <button 
                  type="button" 
                  onClick={handleAddRincian} 
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-200 transition-colors"
                >
                  <Plus size={14}/> Tambah Rincian
                </button>
              </div>

              {/* Header Tabel */}
              <div className="hidden md:grid grid-cols-12 gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">
                <div className="col-span-3">Kode Rekening</div>
                <div className="col-span-3">Uraian Sub Rincian Objek</div>
                <div className="col-span-2 text-right">Pagu Semula</div>
                <div className="col-span-2 text-right">Pagu Sesudah</div>
                <div className="col-span-2 text-center">Aksi</div>
              </div>

              {/* Mapping List SRO */}
              <div className="space-y-4 md:space-y-2">
                {(proposalForm.rincian || []).map((item, index) => (
                  <RincianSRORow
                    key={item.id}
                    item={item}
                    index={index}
                    onItemChange={handleRincianChange}
                    onRemove={handleRemoveRincian}
                    onOpenBankSro={() => setShowBankSro(true)}
                    isLastItem={(proposalForm.rincian || []).length === 1}
                  />
                ))}
              </div>

              {/* Ringkasan Pagu */}
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 p-4 rounded-xl mt-6">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Total Pagu Semula</span>
                  <span className="font-black text-slate-800 dark:text-slate-200">{formatIDR(formTotalSebelum)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-4 border-b border-emerald-200 dark:border-emerald-800/50 pb-4">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Total Pagu Sesudah</span>
                  <span className="font-black text-blue-700 dark:text-blue-300">{formatIDR(formTotalSesudah)}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-black uppercase tracking-tighter text-slate-700 dark:text-slate-300">Total Selisih</span>
                  <span className={`font-black ${
                    formTotalSelisih > 0 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : formTotalSelisih < 0 
                        ? 'text-rose-600 dark:text-rose-400' 
                        : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {formatIDR(formTotalSelisih)}
                  </span>
                </div>
              </div>

              {/* Alasan */}
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">
                  Alasan Pergeseran SRO
                </label>
                <textarea 
                  required 
                  rows="2" 
                  value={proposalForm.alasan} 
                  onChange={e => setProposalForm({...proposalForm, alasan: e.target.value})} 
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none" 
                  placeholder="Uraikan alasan memindahkan rincian tersebut..." 
                />
              </div>
              
              {/* Catatan Admin (hanya untuk non-SKPD) */}
              {currentUserProfile.level !== 'SKPD' && (
                <div className="pt-2 border-t dark:border-slate-700 mt-4 text-left">
                  <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase block mb-1 tracking-widest">
                    Catatan Admin
                  </label>
                  <textarea 
                    rows="3" 
                    value={proposalForm.hasilVerifikasi || ''} 
                    onChange={e => setProposalForm({...proposalForm, hasilVerifikasi: e.target.value})} 
                    className="w-full p-3 border border-blue-200 dark:border-blue-900 rounded-xl text-sm bg-blue-50/50 dark:bg-blue-900/20 text-slate-800 dark:text-slate-100 outline-none font-medium shadow-inner" 
                  />
                </div>
              )}
              
              {/* Submit Button */}
              <button 
                disabled={isProcessing} 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? 'MENYIMPAN...' : <><Send size={18} /> {isEditing ? 'PERBARUI USULAN' : 'KIRIM USULAN'}</>}
              </button>
            </div>
          </form>
        </div>
        
        {/* Right Column (Chat & History) - Hanya saat Edit */}
        {isEditing && selectedProposal && (
          <div className="space-y-6">
            
            {/* Chat Panel */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[350px] transition-colors">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-600 dark:text-blue-400"/>
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Ruang Diskusi</h3>
                <span className="ml-auto text-[8px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  {selectedProposal.comments?.length || 0} pesan
                </span>
              </div>
              
              <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/20 scrollbar-thin">
                {!selectedProposal.comments || selectedProposal.comments.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 italic font-medium">
                    <div className="text-center">
                      <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
                      <p>Belum ada diskusi</p>
                    </div>
                  </div>
                ) : (
                  selectedProposal.comments.map((c, i) => {
                    const isMe = c.sender === currentUserProfile.nama;
                    return (
                      <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-1">
                          {c.sender} • {new Date(c.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <div className={`p-3 rounded-xl max-w-[85%] text-xs font-medium leading-relaxed shadow-sm ${
                          isMe 
                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                            : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                        }`}>
                          {c.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Form Input Chat */}
              {currentUserProfile.level !== 'TAPD' && (
                <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl">
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input 
                      type="text" 
                      value={commentText} 
                      onChange={(e) => setCommentText(e.target.value)} 
                      placeholder="Tulis pesan..." 
                      className="flex-grow p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                    />
                    <button 
                      type="submit" 
                      disabled={!commentText.trim()} 
                      className="p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* History Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
              <div className="flex items-center gap-2 mb-6">
                <History size={16} className="text-slate-400 dark:text-slate-500"/>
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Riwayat Usulan</h3>
              </div>
              <div className="space-y-4">
                {(selectedProposal.history || []).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada riwayat.</p>
                ) : (
                  (selectedProposal.history || []).map((h, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {i !== (selectedProposal.history.length - 1) && (
                        <div className="absolute left-[7px] top-6 w-0.5 h-full bg-slate-200 dark:bg-slate-700"></div>
                      )}
                      <div className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 flex-shrink-0 mt-0.5 z-10"></div>
                      <div className="pb-4">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{String(h.action)}</p>
                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                          {String(h.by)} • {new Date(h.date).toLocaleDateString('id-ID', {day:'numeric', month:'short'})} {new Date(h.date).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bank SRO Modal */}
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
      />
    </div>
  );
};

export default ProposalFormView;