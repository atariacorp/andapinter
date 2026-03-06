import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import SettingsTabs from './SettingsTabs';
import BrandingTab from './BrandingTab';
import SkpdTab from './SkpdTab';
import SubKegTab from './SubKegTab';
import TahapTab from './TahapTab';
import TahunTab from './TahunTab';
import TapdTab from './TapdTab';
import UsersTab from './UsersTab';
import BankSroTab from './BankSroTab';

const SettingsView = ({
  currentUserProfile,
  masterData,
  addNotification,
  setDeleteConfirm,
  isProcessing,
  setIsProcessing
}) => {
  const [activeTab, setActiveTab] = useState('master-skpd');
  const [brandingForm, setBrandingForm] = useState(masterData.branding || {});
  const [importProgress, setImportProgress] = useState({
    show: false,
    current: 0,
    total: 0,
    status: '',
    successCount: 0,
    errorCount: 0,
    errors: []
  });

  // ========== HANDLERS ==========

  // Branding
  const handleSaveBranding = async (formData) => {
    setIsProcessing(true);
    try {
      await masterData.saveBranding(formData);
      addNotification("Kustomisasi Tampilan Berhasil Disimpan!", "success");
    } catch (err) {
      addNotification("Gagal memperbarui kustomisasi.", "error");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // SKPD
  const handleAddSkpd = async (nama) => {
    setIsProcessing(true);
    try {
      await masterData.addSkpd(nama);
      addNotification("SKPD Berhasil ditambahkan", "success");
    } catch (err) {
      addNotification("Gagal menambahkan SKPD", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSkpd = (item) => {
    setDeleteConfirm({
      show: true,
      id: item.id,
      name: item.nama,
      type: 'SKPD'
    });
  };

  // Sub Kegiatan
  const handleAddSubKeg = async (nama) => {
    setIsProcessing(true);
    try {
      await masterData.addSubKeg(nama);
      addNotification("Sub Kegiatan Berhasil ditambahkan", "success");
    } catch (err) {
      addNotification("Gagal menambahkan Sub Kegiatan", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSubKeg = (item) => {
    setDeleteConfirm({
      show: true,
      id: item.id,
      name: item.nama,
      type: 'Sub Kegiatan'
    });
  };

  // Tahap
  const handleAddTahap = async (nama) => {
    setIsProcessing(true);
    try {
      await masterData.addTahap(nama);
      addNotification("Tahap Berhasil ditambahkan", "success");
    } catch (err) {
      addNotification("Gagal menambahkan Tahap", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTahap = (item) => {
    setDeleteConfirm({
      show: true,
      id: item.id,
      name: item.nama,
      type: 'Tahapan'
    });
  };

  const handleGenerateDefaultTahap = async () => {
    setIsProcessing(true);
    try {
      const defaultTahap = [
        'Pergeseran I',
        'Pergeseran II',
        'Pergeseran III',
        'Pergeseran IV'
      ];
      
      for (const nama of defaultTahap) {
        await masterData.addTahap(nama);
      }
      addNotification("Tahap default berhasil ditambahkan", "success");
    } catch (err) {
      addNotification(`Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Tahun Anggaran
  const handleAddTahun = async (tahun) => {
    setIsProcessing(true);
    try {
      await masterData.addTahun(tahun, currentUserProfile.nama);
      addNotification(`Tahun ${tahun} berhasil ditambahkan`, "success");
    } catch (err) {
      addNotification(`Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTahun = (item) => {
    setDeleteConfirm({
      show: true,
      id: item.id,
      name: `Tahun ${item.tahun || item.nama}`,
      type: 'TahunAnggaran'
    });
  };

  const handleGenerateDefaultTahun = async () => {
    setIsProcessing(true);
    try {
      const tahunDefault = ['2024', '2025', '2026'];
      for (const thn of tahunDefault) {
        await masterData.addTahun(thn, currentUserProfile.nama);
      }
      addNotification("Tahun default berhasil ditambahkan", "success");
    } catch (err) {
      addNotification(`Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // TAPD
  const handleAddTapd = async (data) => {
    setIsProcessing(true);
    try {
      await masterData.addTapd(data);
      addNotification("Anggota TAPD Berhasil ditambahkan", "success");
    } catch (err) {
      addNotification("Gagal menambahkan TAPD", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTapd = (item) => {
    setDeleteConfirm({
      show: true,
      id: item.id,
      name: item.nama,
      type: 'TAPD'
    });
  };

  // Users
  const handleAddUser = async (data) => {
    setIsProcessing(true);
    try {
      await masterData.addUser(data);
      addNotification("User Berhasil didaftarkan", "success");
    } catch (err) {
      addNotification("Gagal menambahkan User", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = (item) => {
    setDeleteConfirm({
      show: true,
      id: item.id,
      name: item.nama,
      type: 'User'
    });
  };

  // Bank SRO
  const handleAddSro = async (data) => {
    setIsProcessing(true);
    try {
      await masterData.addBankSro(data.kode, data.uraian, currentUserProfile.nama);
      addNotification("Data SRO berhasil ditambahkan", "success");
    } catch (err) {
      addNotification(`Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditSro = async (data) => {
    setIsProcessing(true);
    try {
      // Implement edit SRO
      addNotification("Fitur edit dalam pengembangan", "info");
    } catch (err) {
      addNotification(`Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSro = (item) => {
    setDeleteConfirm({
      show: true,
      id: item.id,
      name: `Kode: ${item.kode}`,
      type: 'SRO'
    });
  };

  const handleDeleteAllSro = () => {
    setDeleteConfirm({
      show: true,
      id: 'all',
      name: 'SEMUA DATA SRO',
      type: 'AllSRO'
    });
  };

  const handleImportSro = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      addNotification("Hanya file CSV yang didukung", "error");
      e.target.value = null;
      return;
    }

    setImportProgress({
      show: true,
      current: 0,
      total: 0,
      status: 'Membaca file...',
      successCount: 0,
      errorCount: 0,
      errors: []
    });

    const reader = new FileReader();
    
    reader.onload = async (ev) => {
      const text = ev.target.result.replace(/^\uFEFF/, '');
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.toLowerCase().startsWith('kode'));
      
      const total = lines.length;
      setImportProgress(p => ({ ...p, total, status: `Memproses ${total} baris...` }));

      const data = [];
      const errors = [];

      // Parse CSV
      for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].includes(';') ? lines[i].split(';') : lines[i].split(',');
        
        if (parts.length >= 2) {
          let kode = parts[0].trim().replace(/^"|"$/g, '');
          let uraian = parts[1].trim().replace(/^"|"$/g, '');
          
          if (!kode || !uraian) {
            errors.push(`Baris ${i+1}: kode atau uraian kosong`);
            continue;
          }
          
          // Bersihkan kode dari karakter non-digit dan titik
          kode = kode.replace(/[^\d.]/g, '');
          
          if (uraian.length > 500) uraian = uraian.substring(0, 500) + '...';
          
          data.push({
            kode,
            uraian,
            createdAt: new Date().toISOString(),
            createdBy: currentUserProfile?.nama || 'System'
          });
        } else {
          errors.push(`Baris ${i+1}: format tidak valid`);
        }
      }

      if (data.length === 0) {
        setImportProgress(p => ({ ...p, show: false }));
        addNotification(`Data kosong. ${errors.length} error`, "error");
        e.target.value = null;
        return;
      }

      // Import batch
      try {
        const result = await masterData.importSroBatch(data);
        
        setImportProgress(p => ({
          ...p,
          show: false,
          successCount: result.success,
          errorCount: result.errors.length,
          errors: [...errors, ...result.errors]
        }));

        addNotification(
          `Import: ${result.success}/${data.length} berhasil. ${result.errors.length + errors.length} error`, 
          result.success > 0 ? 'success' : 'error'
        );
      } catch (err) {
        console.error(err);
        addNotification(`Gagal import: ${err.message}`, "error");
        setImportProgress(p => ({ ...p, show: false }));
      }

      e.target.value = null;
    };

    reader.onerror = () => {
      setImportProgress(p => ({ ...p, show: false }));
      addNotification("Gagal baca file", "error");
      e.target.value = null;
    };

    reader.readAsText(file, 'UTF-8');
  };

  const handleDownloadTemplateSro = () => {
    const content = "KODE REKENING;URAIAN SUB RINCIAN OBJEK\n5.1.02.01.00001;Belanja Alat Tulis Kantor\n5.1.02.01.00002;Belanja Kertas dan Cover\n5.2.02.01.00001;Belanja Makanan dan Minuman Rapat";
    const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_bank_sro.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("Template SRO berhasil diunduh", "success");
  };

  const handleDownloadTemplate = (type) => {
    const content = type === 'skpd' 
      ? "Nama SKPD\nDinas Kesehatan Kota Medan\nDinas Pendidikan\nBKAD Medan" 
      : "Nama Sub Kegiatan\nPenatausahaan Keuangan\nPengadaan Alat Tulis";
    
    const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `template_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportMaster = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Implementasi import master data (SKPD/SubKeg)
    addNotification("Fitur import dalam pengembangan", "info");
    e.target.value = null;
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 pb-20">
      
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <SettingsIcon size={24} className="text-blue-500" />
          Pengaturan Master
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Kelola instansi, sub kegiatan, tahap, user, dan database sistem
        </p>
      </header>

      {/* Tabs Navigation */}
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'branding' && (
          <BrandingTab
            branding={masterData.branding}
            brandingForm={brandingForm}
            setBrandingForm={setBrandingForm}
            onSave={handleSaveBranding}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === 'master-skpd' && (
          <SkpdTab
            skpdList={masterData.skpdList}
            onAdd={handleAddSkpd}
            onDelete={handleDeleteSkpd}
            onImport={handleImportMaster}
            onDownloadTemplate={() => handleDownloadTemplate('skpd')}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === 'sub-keg' && (
          <SubKegTab
            subKegList={masterData.subKegList}
            onAdd={handleAddSubKeg}
            onDelete={handleDeleteSubKeg}
            onImport={handleImportMaster}
            onDownloadTemplate={() => handleDownloadTemplate('sub_keg')}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === 'tahap' && (
          <TahapTab
            tahapList={masterData.tahapList}
            onAdd={handleAddTahap}
            onDelete={handleDeleteTahap}
            onGenerateDefault={handleGenerateDefaultTahap}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === 'tahun' && (
          <TahunTab
            tahunList={masterData.tahunList}
            onAdd={handleAddTahun}
            onDelete={handleDeleteTahun}
            onGenerateDefault={handleGenerateDefaultTahun}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === 'tapd' && (
          <TapdTab
            tapdList={masterData.tapdList}
            onAdd={handleAddTapd}
            onDelete={handleDeleteTapd}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab
            usersList={masterData.usersList}
            skpdList={masterData.skpdList}
            onAdd={handleAddUser}
            onDelete={handleDeleteUser}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === 'bank_sro' && (
          <BankSroTab
            bankSro={masterData.bankSro}
            onAdd={handleAddSro}
            onEdit={handleEditSro}
            onDelete={handleDeleteSro}
            onDeleteAll={handleDeleteAllSro}
            onImport={handleImportSro}
            onDownloadTemplate={handleDownloadTemplateSro}
            isProcessing={isProcessing}
            importProgress={importProgress}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsView;