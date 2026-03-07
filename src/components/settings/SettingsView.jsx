import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Sparkles } from 'lucide-react';
import SettingsTabs from './SettingsTabs';
import BrandingTab from './BrandingTab';
import SkpdTab from './SkpdTab';
import SubKegTab from './SubKegTab';
import TahapTab from './TahapTab';
import TahunTab from './TahunTab';
import TapdTab from './TapdTab';
import UsersTab from './UsersTab';
import BankSroTab from './BankSroTab';

// Komponen Floating Particles
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 15 + 10,
      animDelay: Math.random() * -15,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#d7a217] animate-float-settings"
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

const SettingsView = ({
  currentUserProfile,
  masterData,
  addNotification,
  setDeleteConfirm,
  isProcessing,
  setIsProcessing,
  isDarkMode
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

  // State untuk efek paralaks
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Efek paralaks ringan
  useEffect(() => {
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 15,
          y: (e.clientY / window.innerHeight - 0.5) * 15
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Palet warna teal & gold
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealLight: '#e2eceb',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };

  // ========== HANDLERS ==========

  // SKPD - Tambah handler edit
const handleEditSkpd = async (id, newName) => {
  setIsProcessing(true);
  try {
    // Panggil fungsi edit dari masterData
    await masterData.updateSkpd(id, newName);
    addNotification("Nama SKPD berhasil diperbarui", "success");
  } catch (err) {
    addNotification("Gagal memperbarui SKPD", "error");
    console.error(err);
  } finally {
    setIsProcessing(false);
  }
};

// Sub Kegiatan - Tambah handler edit
const handleEditSubKeg = async (id, newName) => {
  setIsProcessing(true);
  try {
    // Panggil fungsi edit dari masterData
    await masterData.updateSubKeg(id, newName);
    addNotification("Nama Sub Kegiatan berhasil diperbarui", "success");
  } catch (err) {
    addNotification("Gagal memperbarui Sub Kegiatan", "error");
    console.error(err);
  } finally {
    setIsProcessing(false);
  }
};

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
    <div className="space-y-6 animate-in fade-in relative min-h-screen">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated orbs dengan efek paralaks */}
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: colors.gold,
            opacity: 0.03,
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            top: '10%',
            right: '5%',
            transition: 'transform 0.2s ease-out'
          }}
        />
        
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            backgroundColor: colors.tealDark,
            opacity: 0.03,
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
            bottom: '5%',
            left: '5%',
            transition: 'transform 0.2s ease-out'
          }}
        />
        
        {/* Grid pattern subtle */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{ 
            backgroundImage: `linear-gradient(${colors.gold} 1px, transparent 1px), linear-gradient(90deg, ${colors.gold} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Floating particles */}
      <FloatingGoldParticles />
      
      {/* Header */}
      <header className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="p-4 rounded-2xl"
            style={{ backgroundColor: `${colors.gold}20` }}
          >
            <SettingsIcon size={28} style={{ color: colors.gold }} />
          </div>
          <div>
            <h1 
              className="text-3xl font-bold tracking-tight flex items-center gap-3"
              style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
            >
              Pengaturan Master
              <span 
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: `${colors.gold}20`,
                  color: colors.gold
                }}
              >
                Admin Area
              </span>
            </h1>
            <p 
              className="text-sm mt-1"
              style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}
            >
              Kelola instansi, sub kegiatan, tahap, user, dan database sistem
            </p>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="relative z-10">
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} isDarkMode={isDarkMode} colors={colors} />
      </div>

      {/* Tab Content */}
      <div className="relative z-10 mt-8">
        {activeTab === 'branding' && (
          <BrandingTab
            branding={masterData.branding}
            brandingForm={brandingForm}
            setBrandingForm={setBrandingForm}
            onSave={handleSaveBranding}
            isProcessing={isProcessing}
            isDarkMode={isDarkMode}
            colors={colors}
          />
        )}

        {activeTab === 'master-skpd' && (
          <SkpdTab
            skpdList={masterData.skpdList}
            onAdd={handleAddSkpd}
            onEdit={handleEditSkpd}
            onDelete={handleDeleteSkpd}
            onImport={handleImportMaster}
            onDownloadTemplate={() => handleDownloadTemplate('skpd')}
            isProcessing={isProcessing}
            isDarkMode={isDarkMode}
            colors={colors}
          />
        )}

        {activeTab === 'sub-keg' && (
          <SubKegTab
            subKegList={masterData.subKegList}
            onAdd={handleAddSubKeg}
            onEdit={handleEditSubKeg}
            onDelete={handleDeleteSubKeg}
            onImport={handleImportMaster}
            onDownloadTemplate={() => handleDownloadTemplate('sub_keg')}
            isProcessing={isProcessing}
            isDarkMode={isDarkMode}
            colors={colors}
          />
        )}

        {activeTab === 'tahap' && (
          <TahapTab
            tahapList={masterData.tahapList}
            onAdd={handleAddTahap}
            onDelete={handleDeleteTahap}
            onGenerateDefault={handleGenerateDefaultTahap}
            isProcessing={isProcessing}
            isDarkMode={isDarkMode}
            colors={colors}
          />
        )}

        {activeTab === 'tahun' && (
          <TahunTab
            tahunList={masterData.tahunList}
            onAdd={handleAddTahun}
            onDelete={handleDeleteTahun}
            onGenerateDefault={handleGenerateDefaultTahun}
            isProcessing={isProcessing}
            isDarkMode={isDarkMode}
            colors={colors}
          />
        )}

        {activeTab === 'tapd' && (
          <TapdTab
            tapdList={masterData.tapdList}
            onAdd={handleAddTapd}
            onDelete={handleDeleteTapd}
            isProcessing={isProcessing}
            isDarkMode={isDarkMode}
            colors={colors}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab
            usersList={masterData.usersList}
            skpdList={masterData.skpdList}
            onAdd={handleAddUser}
            onDelete={handleDeleteUser}
            isProcessing={isProcessing}
            isDarkMode={isDarkMode}
            colors={colors}
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
            isDarkMode={isDarkMode}
            colors={colors}
          />
        )}
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes float-settings {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: var(--opacity); }
          80% { opacity: var(--opacity); }
          100% { transform: translateY(-80px) translateX(30px); opacity: 0; }
        }
        .animate-float-settings {
          animation-name: float-settings;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default SettingsView;