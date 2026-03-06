import { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db, appId } from '../utils/firebase';
import { generateUniqueId } from '../utils';

export const useProposals = (user, currentUserProfile) => {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedTahap, setSelectedTahap] = useState('Semua');
  const [selectedForBulk, setSelectedForBulk] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Default form state
  const defaultProposalForm = {
    id: null,
    skpd: '',
    skpdId: '',
    tahap: 'Belum Ditentukan',
    nomorSurat: '',
    tanggalSurat: new Date().toISOString().split('T')[0],
    perihal: '',
    subKegiatan: '',
    alasan: '',
    hasilVerifikasi: '',
    lampiran: null,
    history: [],
    comments: [],
    rincian: [{ id: generateUniqueId(), kodeRekening: '', uraian: '', paguSebelum: 0, paguSesudah: 0 }]
  };

  const [proposalForm, setProposalForm] = useState(defaultProposalForm);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubProposals = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'proposals'), 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProposals(list);
        setLoading(false);
      },
      (err) => console.error("Proposals error:", err)
    );

    return () => unsubProposals();
  }, [user]);

  // Sinkronisasi selected proposal dengan data terbaru
  useEffect(() => {
    if (selectedProposal) {
      const updated = proposals.find(p => p.id === selectedProposal.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedProposal)) {
        setSelectedProposal(updated);
      }
    }
  }, [proposals, selectedProposal]);

  // Filtered proposals
  const filteredProposals = useMemo(() => {
    return proposals.filter(p => {
      const searchMatch = (String(p.skpd || "")).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (String(p.nomorSurat || "")).toLowerCase().includes(searchTerm.toLowerCase());
      
      let statusMatch = statusFilter === 'Semua' || p.status === statusFilter;
      if (statusFilter === 'Ditolak' && String(p.status).includes('Ditolak')) {
        statusMatch = true;
      }

      const yearMatch = selectedYear === 'Semua' || 
                        (p.tanggalSurat && p.tanggalSurat.startsWith(selectedYear)) || 
                        (!p.tanggalSurat && p.createdAt && p.createdAt.startsWith(selectedYear));
      
      const tahapMatch = selectedTahap === 'Semua' || p.tahap === selectedTahap;
      
      let authMatch = false;
      if (currentUserProfile?.level === 'Admin' || currentUserProfile?.level === 'TAPD') authMatch = true;
      if (currentUserProfile?.level === 'SKPD') authMatch = p.skpdId === currentUserProfile.skpdId;
      if (currentUserProfile?.level === 'Operator BKAD') authMatch = currentUserProfile.assignedSkpds?.includes(p.skpdId) || true; 
      
      return searchMatch && statusMatch && yearMatch && tahapMatch && authMatch;
    });
  }, [proposals, currentUserProfile, searchTerm, statusFilter, selectedYear, selectedTahap]);

  const createProposal = async (data) => {
    const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'proposals'), data);
    return docRef.id;
  };

  const updateProposal = async (id, data) => {
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', String(id)), data);
  };

  const deleteProposal = async (id) => {
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', String(id)));
  };

  const updateProposalStatus = async (id, status, updatedBy) => {
    const historyEntry = {
      action: `Status diubah: ${status}`,
      by: updatedBy,
      date: new Date().toISOString()
    };

    const proposal = proposals.find(p => p.id === id);
    const newHistory = [...(proposal?.history || []), historyEntry];

    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', String(id)), { 
      status, 
      finalizedAt: new Date().toISOString(), 
      finalizedBy: updatedBy,
      history: newHistory
    });
  };

  const addComment = async (id, comment) => {
    const proposal = proposals.find(p => p.id === id);
    const updatedComments = [...(proposal?.comments || []), comment];
    
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', String(id)), { 
      comments: updatedComments 
    });
  };

  const resetForm = () => {
    setProposalForm(defaultProposalForm);
    setIsEditing(false);
  };

  const handleEditClick = (p) => {
    const rincian = p.rincian && p.rincian.length > 0 
      ? p.rincian 
      : [{ id: generateUniqueId(), kodeRekening: '-', uraian: String(p.subKegiatan || ''), paguSebelum: p.paguSebelum || 0, paguSesudah: p.paguSesudah || 0 }];
    
    setSelectedProposal(p);
    setProposalForm({ ...p, rincian });
    setIsEditing(true);
  };

  return {
    proposals,
    selectedProposal,
    setSelectedProposal,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedYear,
    setSelectedYear,
    selectedTahap,
    setSelectedTahap,
    selectedForBulk,
    setSelectedForBulk,
    proposalForm,
    setProposalForm,
    isEditing,
    setIsEditing,
    filteredProposals,
    currentPage,
    setCurrentPage,
    createProposal,
    updateProposal,
    deleteProposal,
    updateProposalStatus,
    addComment,
    resetForm,
    handleEditClick
  };
};