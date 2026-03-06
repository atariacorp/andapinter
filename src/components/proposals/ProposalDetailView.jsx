import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Printer, CheckCircle, XCircle, 
  History, MessageSquare, Database, FileText,
  Calendar, Building2, Download
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import ChatPanel from './ChatPanel';
import HistoryTimeline from './HistoryTimeline';
import LampiranView from './LampiranView';
import BankCatatanPanel from './BankCatatanPanel';
import { formatIDR } from '../../utils';
import { doc, updateDoc } from 'firebase/firestore';
import { db, appId } from '../../utils/firebase';

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
  handleAddComment
}) => {
  const { tahapList, bankCatatan } = masterData;
  const [showBankCatatan, setShowBankCatatan] = useState(false);

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

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 pb-20">
      
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('list')} 
            className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft size={18}/>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Detail Berkas #{String(selectedProposal.nomorSurat || "")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
              {String(selectedProposal.skpd || "")} • 
              <span className="text-blue-500 dark:text-blue-400 ml-1">
                {String(selectedProposal.tahap || "Belum Ditentukan")}
              </span>
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="ml-auto flex gap-2 w-full md:w-auto">
          
          {/* Operator Actions */}
          {currentUserProfile.level === 'Operator BKAD' && (
            <>
              <button 
                disabled={isProcessing} 
                onClick={() => handleStatusChange('Diverifikasi')} 
                className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-lg transition-all active:scale-95 text-center disabled:opacity-50"
              >
                {isProcessing ? 'PROSES...' : 'VERIFIKASI BERKAS'}
              </button>
              <button 
                disabled={isProcessing} 
                onClick={() => handleStatusChange('Ditolak Operator')} 
                className="flex-1 md:flex-none px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs shadow-lg transition-all active:scale-95 text-center disabled:opacity-50"
              >
                {isProcessing ? 'PROSES...' : 'TOLAK (KEMBALIKAN)'}
              </button>
            </>
          )}

          {/* Admin Actions */}
          {currentUserProfile.level === 'Admin' && (
            <>
              <button 
                disabled={isProcessing} 
                onClick={() => handleStatusChange('Disetujui')} 
                className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-lg transition-all active:scale-95 text-center disabled:opacity-50"
              >
                {isProcessing ? 'PROSES...' : 'SETUJUI FINAL'}
              </button>
              <button 
                disabled={isProcessing} 
                onClick={() => handleStatusChange('Ditolak Admin')} 
                className="flex-1 md:flex-none px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs shadow-lg transition-all active:scale-95 text-center disabled:opacity-50"
              >
                {isProcessing ? 'PROSES...' : 'TOLAK'}
              </button>
            </>
          )}

          {/* Print Button */}
          <button 
            onClick={handlePrint} 
            className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-black text-xs shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Printer size={18} /> CETAK BA
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column - Data Berkas */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Informasi Surat */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-2 gap-6 relative overflow-hidden transition-colors">
            
            <div>
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Tgl Surat
              </h4>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {String(selectedProposal.tanggalSurat || "")}
              </p>
            </div>
            
            <div className="mt-10 md:mt-0">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Status Terkini
              </h4>
              <StatusBadge status={selectedProposal.status}/>
            </div>
            
            <div className="col-span-full pt-4 border-t border-slate-100 dark:border-slate-700">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">
                Perihal
              </h4>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic border-l-4 border-blue-500 pl-4">
                {String(selectedProposal.perihal || "")}
              </p>
            </div>
            
            <div className="col-span-full pt-4 border-t border-slate-100 dark:border-slate-700">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">
                Sub Kegiatan Utama
              </h4>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {String(selectedProposal.subKegiatan || "N/A")}
              </p>
            </div>
            
            {/* Penentuan Tahap */}
            <div className="col-span-full pt-4 border-t border-slate-100 dark:border-slate-700">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">
                Penentuan Tahap (Admin/Operator)
              </h4>
              
              {isAdminOrOperator ? (
                <select 
                  value={selectedProposal.tahap || 'Belum Ditentukan'} 
                  onChange={(e) => handleTahapChange(e.target.value)}
                  className="w-full md:w-1/2 p-3 border border-blue-200 dark:border-blue-800 rounded-xl text-sm bg-blue-50/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-black focus:ring-2 focus:ring-blue-500 outline-none uppercase tracking-widest cursor-pointer shadow-inner transition-colors"
                >
                  <option value="Belum Ditentukan">-- PILIH TAHAP PERGESERAN --</option>
                  {tahapList && tahapList.length > 0 ? (
                    tahapList.map(t => (
                      <option key={t.id} value={t.nama}>{String(t.nama || "")}</option>
                    ))
                  ) : null}
                </select>
              ) : (
                <div className="w-full md:w-1/2 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                  {String(selectedProposal.tahap || "Belum Ditentukan")}
                </div>
              )}
              
              {isAdminOrOperator && (
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 italic font-medium">
                  Hanya Admin & Operator yang dapat melihat dan mengubah pilihan ini.
                </p>
              )}
            </div>

            {/* Catatan Verifikasi */}
            <div className="col-span-full pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase italic">
                  Catatan Verifikasi (Admin Bidang Perencanaan Anggaran)
                </h4>
                
                {isAdminOrOperator && (
                  <button
                    onClick={() => setShowBankCatatan(!showBankCatatan)}
                    className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-purple-200 dark:border-purple-800"
                  >
                    <Database size={14} />
                    {showBankCatatan ? 'Tutup Bank Catatan' : 'Buka Bank Catatan'}
                  </button>
                )}
              </div>
              
              {isSkpd || isTapd ? (
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 font-medium italic text-xs leading-relaxed">
                  {String(selectedProposal.hasilVerifikasi || "Sedang dalam proses pemeriksaan...")}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  
                  {/* Bank Catatan Panel */}
                  {showBankCatatan && (
                    <BankCatatanPanel
                      bankCatatan={bankCatatan}
                      onTambah={(judul, isi) => {
                        // Implement add bank catatan
                        addNotification("Fitur dalam pengembangan", "info");
                      }}
                      onEdit={(id, judul, isi) => {
                        // Implement edit bank catatan
                        addNotification("Fitur dalam pengembangan", "info");
                      }}
                      onHapus={(id, judul) => {
                        // Implement delete bank catatan
                        addNotification("Fitur dalam pengembangan", "info");
                      }}
                      onGunakan={(isi) => {
                        setLocalCatatan(isi);
                        setShowBankCatatan(false);
                        addNotification("Catatan telah digunakan", "success");
                      }}
                      isProcessing={isProcessing}
                      currentUser={currentUserProfile}
                    />
                  )}

                  {/* Lampiran */}
                  <LampiranView lampiran={selectedProposal.lampiran} />

                  {/* Catatan Input */}
                  <textarea 
                    rows="4" 
                    value={localCatatan} 
                    onChange={e => setLocalCatatan(e.target.value)} 
                    placeholder="Masukkan catatan analisa teknis untuk SKPD..." 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                  
                  <button 
                    disabled={isProcessing} 
                    onClick={handleSaveCatatan} 
                    className="self-end px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg font-black text-[10px] uppercase shadow-sm transition-colors border border-blue-200 dark:border-blue-800 disabled:opacity-50"
                  >
                    {isProcessing ? 'Menyimpan...' : 'Simpan Catatan'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabel Rincian SRO */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                Tabel Rincian Objek & Sub Rincian Objek (SRO)
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                  <tr>
                    <th className="p-3 border-b dark:border-slate-700">Kode Rekening</th>
                    <th className="p-3 border-b dark:border-slate-700">Uraian</th>
                    <th className="p-3 border-b dark:border-slate-700 text-right">Semula</th>
                    <th className="p-3 border-b dark:border-slate-700 text-right">Menjadi</th>
                    <th className="p-3 border-b dark:border-slate-700 text-right">Selisih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {(selectedProposal.rincian && selectedProposal.rincian.length > 0 
                    ? selectedProposal.rincian 
                    : [{ 
                        kodeRekening: '-', 
                        uraian: String(selectedProposal.subKegiatan || ""), 
                        paguSebelum: selectedProposal.paguSebelum, 
                        paguSesudah: selectedProposal.paguSesudah 
                      }]
                  ).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                      <td className="p-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        {String(r.kodeRekening || "")}
                      </td>
                      <td className="p-3 font-bold text-slate-700 dark:text-slate-200">
                        {String(r.uraian || "")}
                      </td>
                      <td className="p-3 text-right">{formatIDR(r.paguSebelum)}</td>
                      <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">
                        {formatIDR(r.paguSesudah)}
                      </td>
                      <td className={`p-3 text-right font-black ${
                        (Number(r.paguSesudah||0)-Number(r.paguSebelum||0)) > 0 
                          ? 'text-emerald-500' 
                          : (Number(r.paguSesudah||0)-Number(r.paguSebelum||0)) < 0 
                            ? 'text-rose-500' 
                            : 'text-slate-400'
                      }`}>
                        {formatIDR(Number(r.paguSesudah||0)-Number(r.paguSebelum||0))}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Total Row */}
                  <tr className="bg-slate-50 dark:bg-slate-900/50 font-black">
                    <td colSpan="2" className="p-4 text-right uppercase tracking-widest text-slate-700 dark:text-slate-300">
                      Total Akumulasi
                    </td>
                    <td className="p-4 text-right text-slate-800 dark:text-slate-200">
                      {formatIDR(selectedProposal.paguSebelum)}
                    </td>
                    <td className="p-4 text-right text-blue-600 dark:text-blue-400">
                      {formatIDR(selectedProposal.paguSesudah)}
                    </td>
                    <td className="p-4 text-right text-emerald-600 dark:text-emerald-400">
                      {formatIDR(Number(selectedProposal.paguSesudah||0) - Number(selectedProposal.paguSebelum||0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Chat & History */}
        <div className="space-y-6">
          
          {/* Chat Panel */}
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
          />

          {/* History Timeline */}
          <HistoryTimeline history={selectedProposal.history || []} />
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailView;