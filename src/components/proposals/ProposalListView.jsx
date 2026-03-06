import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FilterBar from './FilterBar';
import ProposalTableRow from './ProposalTableRow';
import Pagination from '../common/Pagination';
import { formatIDR } from '../../utils/formatters';

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
  handleBulkFinalize
}) => {
  const {
    filteredProposals,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedTahap,
    setSelectedTahap,
    selectedYear,
    setSelectedYear,
    selectedForBulk,
    setSelectedForBulk,
    updateProposalStatus
  } = proposals;

  const { tahapList, tahunList } = masterData;

  // Pagination logic
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProposals.slice(start, start + itemsPerPage);
  }, [filteredProposals, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);

  // Handle bulk selection
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedForBulk(currentData.map(p => p.id));
    } else {
      setSelectedForBulk([]);
    }
  };

  const handleSelectBulk = (id, checked) => {
    if (checked) {
      setSelectedForBulk(prev => [...prev, id]);
    } else {
      setSelectedForBulk(prev => prev.filter(item => item !== id));
    }
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
        : [{ kodeRekening: '-', uraian: String(p.subKegiatan || ''), 
             paguSebelum: p.paguSebelum, paguSesudah: p.paguSesudah }];
      
      const catatanAdmin = p.hasilVerifikasi || '';
      
      rincianList.forEach((r, index) => {
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

    const csvContent = "\uFEFF" + headers.join(";") + "\n" + 
                      rows.map(r => r.join(";")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `rekap_usulan_${selectedYear}_${selectedTahap.replace(/ /g, '_')}.csv`);
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
    proposals.handleEditClick(proposal);
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
      try { 
        window.print(); 
      } catch (ex) { 
        addNotification("Gunakan Ctrl+P (Windows) / Cmd+P (Mac) untuk mencetak.", "info"); 
      }
    }, 800);
  };

  const handleAddNew = () => {
    proposals.resetForm();
    proposals.setIsEditing(false);
    setView('add-proposal');
  };

  return (
    <div className="space-y-6 animate-in fade-in h-full flex flex-col text-left">
      
      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedTahap={selectedTahap}
        setSelectedTahap={setSelectedTahap}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        tahapList={tahapList}
        tahunList={tahunList}
        currentUserLevel={currentUserProfile.level}
        selectedForBulk={selectedForBulk}
        onBulkAction={handleBulkAction}
        onExportCSV={handleExportCSV}
        onAddNew={handleAddNew}
        isProcessing={isProcessing}
      />

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[1200px]">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
              <tr>
                {['Admin', 'Operator BKAD'].includes(currentUserProfile.level) && (
                  <th className="p-3 w-10 text-center">
                    <input 
                      type="checkbox" 
                      checked={currentData.length > 0 && selectedForBulk.length === currentData.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-50 cursor-pointer bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                    />
                  </th>
                )}
                <th className="p-3">Tanggal</th>
                <th className="p-3">No. Surat</th>
                <th className="p-3 w-48">SKPD</th>
                <th className="p-3 w-40">Sub Kegiatan</th>
                <th className="p-3">Kode Rekening</th>
                <th className="p-3 w-40">Sub Rincian Objek</th>
                <th className="p-3 text-right">Pagu Semula</th>
                <th className="p-3 text-right">Pagu Sesudah</th>
                <th className="p-3 text-right">Pagu Akhir (Selisih)</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium text-slate-700 dark:text-slate-300">
              {currentData.map(p => {
                const rincianList = p.rincian && p.rincian.length > 0 
                  ? p.rincian 
                  : [{ id: p.id+'-r', kodeRekening: '-', uraian: String(p.subKegiatan || '-'), 
                       paguSebelum: p.paguSebelum || 0, paguSesudah: p.paguSesudah || 0 }];
                
                // Rules untuk menampilkan tombol edit
                const canEdit = currentUserProfile.level === 'Admin' || 
                  (currentUserProfile.level === 'SKPD' && 
                   (String(p.status).includes('Ditolak') || p.status === 'Pending'));

                return rincianList.map((r, index) => (
                  <ProposalTableRow
                    key={`${p.id}-${r.id || index}`}
                    proposal={p}
                    rincian={r}
                    index={index}
                    isFirstRow={index === 0}
                    rowSpan={rincianList.length}
                    selectedForBulk={selectedForBulk}
                    onSelectBulk={handleSelectBulk}
                    currentUserLevel={currentUserProfile.level}
                    canEdit={canEdit}
                    onDetail={handleDetail}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPrint={handlePrint}
                  />
                ));
              })}
              
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={['Admin', 'Operator BKAD'].includes(currentUserProfile.level) ? 12 : 11} 
                      className="p-20 text-center text-slate-400 italic font-bold uppercase tracking-widest opacity-50">
                    Data Kosong.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={filteredProposals.length}
        />
      </div>
    </div>
  );
};

export default ProposalListView;