import React, { useMemo, useState, useEffect } from 'react';
import { 
  Inbox, Clock, FileCheck, FileX, 
  PieChart, BarChart2, CalendarDays, Layers,
  TrendingUp, Users, Award, Star, PlusCircle,
  FileText, Download, Search, CheckCircle, XCircle,
  AlertCircle, DollarSign, Activity, Zap
} from 'lucide-react';
import CalendarView from './CalendarView';
import ExportModal from '../common/ExportModal';  

const DashboardView = ({ 
  filteredProposals, 
  tahapList, 
  tahunList,
  selectedTahap, 
  setSelectedTahap, 
  selectedYear, 
  setSelectedYear,
  setCurrentPage,
  setView,  // <-- TAMBAHKAN UNTUK NAVIGASI
  proposals, // <-- TAMBAHKAN UNTUK AKSES RESET FORM
  addNotification,
  isDarkMode
}) => {
  
  // State untuk efek paralaks
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // State untuk modal export  <-- TAMBAHKAN INI
  const [showExportModal, setShowExportModal] = useState(false);

  // Efek paralaks ringan
  useEffect(() => {
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Hitung statistik dashboard
  const chartData = useMemo(() => {
    const total = filteredProposals.length;
    const pending = filteredProposals.filter(p => p.status === 'Pending' || p.status === 'Diverifikasi').length;
    const approved = filteredProposals.filter(p => p.status === 'Disetujui').length;
    const rejected = filteredProposals.filter(p => String(p.status).includes('Ditolak')).length;

    const skpdCounts = {};
    filteredProposals.forEach(p => {
      skpdCounts[p.skpd] = (skpdCounts[p.skpd] || 0) + 1;
    });
    const topSkpds = Object.entries(skpdCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);
    const maxSkpdCount = topSkpds.length > 0 ? topSkpds[0][1] : 1;

    return { total, pending, approved, rejected, topSkpds, maxSkpdCount };
  }, [filteredProposals]);

  // ===== FITUR 1: GRAFIK TREN BULANAN (MENGGUNAKAN DATA REAL) =====
const monthlyTrend = useMemo(() => {
  // Ambil 6 bulan terakhir (dari bulan sekarang mundur ke belakang)
  const months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Filter proposals untuk bulan ini
    const proposalsThisMonth = filteredProposals.filter(p => {
      const proposalDate = p.tanggalSurat || p.createdAt;
      if (!proposalDate) return false;
      
      // Ambil tahun-bulan dari tanggal proposal (format: YYYY-MM-DD)
      const proposalYearMonth = proposalDate.substring(0, 7);
      return proposalYearMonth === yearMonth;
    });
    
    const total = proposalsThisMonth.length;
    const disetujui = proposalsThisMonth.filter(p => p.status === 'Disetujui').length;
    const ditolak = proposalsThisMonth.filter(p => 
      String(p.status).includes('Ditolak')
    ).length;
    const berjalan = total - disetujui - ditolak;
    
    months.push({
      month: monthName,
      yearMonth,
      total,
      disetujui,
      ditolak,
      berjalan
    });
  }
  
  return months;
}, [filteredProposals]);

  // ===== FITUR 2: RINGKASAN ANGGARAN =====
  const anggaranSummary = useMemo(() => {
    const totalDiajukan = filteredProposals.reduce((sum, p) => 
      sum + (p.paguSesudah || 0), 0
    );
    const totalDisetujui = filteredProposals
      .filter(p => p.status === 'Disetujui')
      .reduce((sum, p) => sum + (p.paguSesudah || 0), 0);
    
    const persentase = totalDiajukan > 0 
      ? ((totalDisetujui / totalDiajukan) * 100).toFixed(1) 
      : 0;
    
    const sisa = totalDiajukan - totalDisetujui;
    
    return {
      totalDiajukan,
      totalDisetujui,
      persentase,
      sisa
    };
  }, [filteredProposals]);

  // ===== FITUR 3: AKTIVITAS TERBARU =====
  const recentActivities = useMemo(() => {
    // Ambil 5 proposal terbaru dan buat aktivitas
    return filteredProposals
      .slice(0, 5)
      .map(p => {
        let icon = <FileText size={14} />;
        let color = '#3c5654';
        let bgColor = '#3c565420';
        
        switch(p.status) {
          case 'Pending':
            icon = <Clock size={14} />;
            color = '#d7a217';
            bgColor = '#d7a21720';
            break;
          case 'Diverifikasi':
            icon = <CheckCircle size={14} />;
            color = '#3c5654';
            bgColor = '#3c565420';
            break;
          case 'Disetujui':
            icon = <CheckCircle size={14} />;
            color = '#10b981';
            bgColor = '#10b98120';
            break;
          case 'Ditolak':
          case 'Ditolak Admin':
          case 'Ditolak Operator':
            icon = <XCircle size={14} />;
            color = '#ef4444';
            bgColor = '#ef444420';
            break;
          default:
            icon = <FileText size={14} />;
        }
        
        return {
          id: p.id,
          time: p.updatedAt || p.createdAt || new Date().toISOString(),
          title: `${p.skpd || 'SKPD'} mengajukan usulan`,
          description: p.nomorSurat || 'No. Surat',
          status: p.status,
          icon,
          color,
          bgColor
        };
      });
  }, [filteredProposals]);

  // ===== FITUR 4: QUICK ACTIONS PANEL =====
  const quickActions = [
    {
      id: 'add',
      label: 'Tambah Usulan',
      icon: <PlusCircle size={18} />,
      color: '#d7a217',
      bgColor: '#d7a21720',
      onClick: () => {
        if (proposals?.resetForm) proposals.resetForm();
        setView('add-proposal');
      }
    },
    {
      id: 'pending',
      label: 'Lihat Pending',
      icon: <Clock size={18} />,
      color: '#d7a217',
      bgColor: '#d7a21720',
      onClick: () => {
        setView('list');
        // Set filter ke Pending (perlu implementasi di komponen lain)
      }
    },
    {
      id: 'export',
      label: 'Export Laporan',
      icon: <Download size={18} />,
      color: '#425c5a',
      bgColor: '#425c5a20',
      onClick: () => setShowExportModal(true)
      },
    {
      id: 'search',
      label: 'Pencarian',
      icon: <Search size={18} />,
      color: '#425c5a',
      bgColor: '#425c5a20',
      onClick: () => {
        setView('list');
        // Fokus ke search (perlu implementasi)
      }
    }
  ];

  // Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(angka);
  };

  // Format waktu relatif
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  // Palet warna teal & gold
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealLight: '#e2eceb',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };

  // ===== FUNGSI EXPORT DATA =====
const handleExport = async ({ type, dateRange, includeDetails }) => {
  try {
    // Filter data berdasarkan rentang tanggal
    let dataToExport = filteredProposals;
    
    if (dateRange.start) {
      dataToExport = dataToExport.filter(p => 
        (p.tanggalSurat || p.createdAt) >= dateRange.start
      );
    }
    if (dateRange.end) {
      dataToExport = dataToExport.filter(p => 
        (p.tanggalSurat || p.createdAt) <= dateRange.end
      );
    }
    
    if (type === 'excel') {
      // Export Excel
      const headers = ["Tahap", "Tanggal Surat", "No. Surat", "SKPD", "Sub Kegiatan", 
                       "Kode Rekening", "Uraian", "Pagu Semula", "Pagu Sesudah", "Status"];
      const rows = [];
      
      dataToExport.forEach(p => {
        const rincianList = includeDetails && p.rincian?.length > 0 
          ? p.rincian 
          : [{ kodeRekening: '-', uraian: p.subKegiatan, paguSebelum: p.paguSebelum, paguSesudah: p.paguSesudah }];
        
        rincianList.forEach(r => {
          rows.push([
            p.tahap || '-',
            p.tanggalSurat || '-',
            p.nomorSurat || '-',
            p.skpd || '-',
            p.subKegiatan || '-',
            r.kodeRekening || '-',
            r.uraian || '-',
            r.paguSebelum || 0,
            r.paguSesudah || 0,
            p.status || '-'
          ]);
        });
      });
      
      const csvContent = "\uFEFF" + headers.join(';') + '\n' + 
                        rows.map(r => r.join(';')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `export_usulan_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } else if (type === 'pdf') {
      // Export PDF (sederhana - bisa dikembangkan dengan library seperti jsPDF)
      alert('Fitur export PDF akan segera hadir!');
    }
    
    setShowExportModal(false);
    addNotification(`Data berhasil diekspor (${dataToExport.length} usulan)`, 'success');
    
  } catch (error) {
    console.error('Export error:', error);
    addNotification('Gagal mengekspor data', 'error');
  }
};

  return (
    <div className="space-y-6 animate-in fade-in relative overflow-hidden pb-10">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-float"
              style={{
                backgroundColor: colors.gold,
                opacity: 0.15,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${5 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: colors.gold,
            opacity: 0.03,
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
            top: '10%',
            left: '5%',
            transition: 'transform 0.2s ease-out'
          }}
        />
        
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            backgroundColor: colors.tealDark,
            opacity: 0.03,
            transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)`,
            bottom: '5%',
            right: '5%',
            transition: 'transform 0.2s ease-out'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
          <div>
            <h1 
              className="text-2xl font-bold tracking-tight"
              style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
            >
              Monitoring Berkas
            </h1>
            <p 
              className="text-sm mt-1"
              style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}
            >
              Dashboard Utama Aplikasi Pendataan Pergeseran Anggaran
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div 
              className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md transition-all hover:shadow-lg"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
              }}
            >
              <Layers size={18} style={{ color: colors.gold }} />
              <select 
                value={selectedTahap} 
                onChange={e => setSelectedTahap(e.target.value)} 
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
              >
                <option value="Semua">Semua Tahap</option>
                {tahapList && tahapList.length > 0 ? (
                  tahapList.map(t => (
                    <option key={t.id} value={t.nama}>
                      {String(t.nama || t.id || "Tanpa Nama")}
                    </option>
                  ))
                ) : null}
              </select>
            </div>
            
            <div 
              className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md transition-all hover:shadow-lg"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
              }}
            >
              <CalendarDays size={18} style={{ color: colors.gold }} />
              <select 
                value={selectedYear} 
                onChange={e => {
                  setSelectedYear(e.target.value); 
                  setCurrentPage(1);
                }} 
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
              >
                <option value="Semua">Semua Tahun</option>
                {tahunList && tahunList.length > 0 ? (
                  tahunList.map(t => (
                    <option key={t.id} value={t.tahun || t.nama}>
                      {t.tahun || t.nama}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </header>
      </div>

      {/* Stat Cards (Existing) */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-5">
        {/* Card MASUK */}
        <div 
          className="glass-card p-5 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl group"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
            border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div 
              className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: `${colors.gold}20` }}
            >
              <Inbox size={22} style={{ color: colors.gold }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              {chartData.total}
            </span>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
            MASUK
          </h3>
          <p className="text-xs" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
            Filter Aktif
          </p>
        </div>

        {/* Card PROSES */}
        <div 
          className="glass-card p-5 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl group"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
            border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div 
              className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: `${colors.gold}20` }}
            >
              <Clock size={22} style={{ color: colors.gold }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              {chartData.pending}
            </span>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
            PROSES
          </h3>
          <p className="text-xs" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
            Sedang Berjalan
          </p>
        </div>

        {/* Card DISETUJUI */}
        <div 
          className="glass-card p-5 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl group"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
            border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div 
              className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: `${colors.gold}20` }}
            >
              <FileCheck size={22} style={{ color: colors.gold }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              {chartData.approved}
            </span>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
            DISETUJUI
          </h3>
          <p className="text-xs" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
            Selesai Final
          </p>
        </div>

        {/* Card DITOLAK */}
        <div 
          className="glass-card p-5 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl group"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
            border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div 
              className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: `${colors.gold}20` }}
            >
              <FileX size={22} style={{ color: colors.gold }} />
            </div>
            <span className="text-3xl font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              {chartData.rejected}
            </span>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
            DITOLAK
          </h3>
          <p className="text-xs" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
            Perlu Perbaikan
          </p>
        </div>
      </div>

      {/* ===== KALENDER DEADLINE ===== */}
<div className="relative z-10 mt-6">
  <CalendarView 
    proposals={filteredProposals}
    isDarkMode={isDarkMode}
    colors={colors}
    onDateClick={(date, proposals) => {
      // Navigasi ke daftar berkas dengan filter tanggal
      console.log('Selected date:', date, proposals);
      // Jika ingin navigasi ke halaman daftar dengan filter:
      // setView('list');
      // dan set filter tanggal (perlu implementasi di komponen list)
    }}
  />
</div>    

      {/* ===== FITUR 1: GRAFIK TREN BULANAN ===== */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div 
            className="glass-card p-6 rounded-2xl backdrop-blur-md transition-all hover:shadow-xl"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <TrendingUp size={20} style={{ color: colors.gold }} />
                Tren Usulan 6 Bulan Terakhir
              </h3>
              <span className="text-xs px-3 py-1 rounded-full" style={{ 
                backgroundColor: `${colors.gold}20`,
                color: colors.gold
              }}>
                {selectedYear}
              </span>
            </div>
            
            {/* Bar Chart dengan Data Real */}
<div className="space-y-4">
  {monthlyTrend.map((item, idx) => (
    <div key={idx} className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span style={{ color: colors.tealMedium }}>{item.month}</span>
        <div className="flex gap-3">
          <span style={{ color: colors.gold }}>{item.total} usulan</span>
          <span style={{ color: '#10b981' }}>{item.disetujui} ✓</span>
          <span style={{ color: '#ef4444' }}>{item.ditolak} ✗</span>
        </div>
      </div>
      <div className="flex gap-1 h-2">
        {item.total > 0 ? (
          <>
            <div 
              className="h-2 rounded-l-full transition-all"
              style={{ 
                width: `${(item.disetujui / item.total) * 100}%`,
                backgroundColor: '#10b981'
              }}
              title={`Disetujui: ${item.disetujui}`}
            />
            <div 
              className="h-2 transition-all"
              style={{ 
                width: `${(item.berjalan / item.total) * 100}%`,
                backgroundColor: colors.gold
              }}
              title={`Berjalan: ${item.berjalan}`}
            />
            <div 
              className="h-2 rounded-r-full transition-all"
              style={{ 
                width: `${(item.ditolak / item.total) * 100}%`,
                backgroundColor: '#ef4444'
              }}
              title={`Ditolak: ${item.ditolak}`}
            />
          </>
        ) : (
          <div 
            className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 w-full"
            title="Tidak ada data"
          />
        )}
      </div>
    </div>
  ))}
</div>

{/* Legend (Update) */}
<div className="flex justify-end gap-4 mt-4 text-xs">
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
    <span style={{ color: colors.tealMedium }}>Disetujui</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-[#d7a217]"></div>
    <span style={{ color: colors.tealMedium }}>Berjalan</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
    <span style={{ color: colors.tealMedium }}>Ditolak</span>
  </div>
</div>
          </div>
        </div>

        {/* ===== FITUR 2: RINGKASAN ANGGARAN ===== */}
        <div className="lg:col-span-1">
          <div 
            className="glass-card p-6 rounded-2xl backdrop-blur-md transition-all hover:shadow-xl h-full"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
            }}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <DollarSign size={20} style={{ color: colors.gold }} />
              Ringkasan Anggaran
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: `${colors.gold}10` }}>
                <p className="text-xs mb-1" style={{ color: colors.tealMedium }}>Total Diajukan</p>
                <p className="text-xl font-bold" style={{ color: colors.tealDark }}>
                  {formatRupiah(anggaranSummary.totalDiajukan)}
                </p>
              </div>
              
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#10b98110' }}>
                <p className="text-xs mb-1" style={{ color: colors.tealMedium }}>Total Disetujui</p>
                <p className="text-xl font-bold" style={{ color: '#10b981' }}>
                  {formatRupiah(anggaranSummary.totalDisetujui)}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-xl" style={{ backgroundColor: `${colors.tealPale}30` }}>
                <span className="text-sm" style={{ color: colors.tealMedium }}>Persentase</span>
                <span className="text-lg font-bold" style={{ color: colors.gold }}>{anggaranSummary.persentase}%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-xl" style={{ backgroundColor: `${colors.tealPale}30` }}>
                <span className="text-sm" style={{ color: colors.tealMedium }}>Sisa Anggaran</span>
                <span className="text-lg font-bold" style={{ color: colors.tealDark }}>
                  {formatRupiah(anggaranSummary.sisa)}
                </span>
              </div>
              
              {/* Progress Circle */}
              <div className="relative w-24 h-24 mx-auto mt-2">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                    stroke={colors.tealPale} strokeWidth="3"/>
                  <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                    stroke={colors.gold} strokeWidth="3"
                    strokeDasharray={`${anggaranSummary.persentase} ${100 - anggaranSummary.persentase}`}
                    strokeDashoffset="100"
                    strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: colors.gold }}>{anggaranSummary.persentase}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FITUR 3 & 4: AKTIVITAS TERBARU & QUICK ACTIONS ===== */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Aktivitas Terbaru */}
        <div className="lg:col-span-2">
          <div 
            className="glass-card p-6 rounded-2xl backdrop-blur-md transition-all hover:shadow-xl"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
            }}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <Activity size={20} style={{ color: colors.gold }} />
              Aktivitas Terbaru
            </h3>
            
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, idx) => (
                  <div 
                    key={activity.id || idx}
                    className="flex items-start gap-3 p-3 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.2)' : 'white',
                      border: `1px solid ${colors.tealPale}`
                    }}
                    onClick={() => {
                      // Navigasi ke detail proposal
                      if (activity.id) {
                        // Implementasi navigasi ke detail
                      }
                    }}
                  >
                    <div 
                      className="p-2 rounded-lg shrink-0"
                      style={{ backgroundColor: activity.bgColor || `${colors.gold}20` }}
                    >
                      <span style={{ color: activity.color || colors.gold }}>{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: colors.tealDark }}>
                        {activity.title}
                      </p>
                      <p className="text-xs mt-1" style={{ color: colors.tealMedium }}>
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-[9px] whitespace-nowrap" style={{ color: colors.tealMedium }}>
                      {getRelativeTime(activity.time)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity size={32} className="mx-auto mb-2 opacity-30" style={{ color: colors.tealMedium }} />
                  <p className="text-sm italic" style={{ color: colors.tealMedium }}>Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-1">
          <div 
            className="glass-card p-6 rounded-2xl backdrop-blur-md transition-all hover:shadow-xl h-full"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
            }}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <Zap size={20} style={{ color: colors.gold }} />
              Aksi Cepat
            </h3>
            
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-md"
                  style={{ 
                    backgroundColor: action.bgColor,
                    border: `1px solid ${action.color}40`
                  }}
                >
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <span style={{ color: action.color }}>{action.icon}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: action.color }}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Stats Mini */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.tealPale }}>
              <div className="flex justify-between items-center text-xs">
                <span style={{ color: colors.tealMedium }}>Usulan Hari Ini</span>
                <span className="font-bold" style={{ color: colors.gold }}>8</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-2">
                <span style={{ color: colors.tealMedium }}>Perlu Verifikasi</span>
                <span className="font-bold" style={{ color: colors.gold }}>{chartData.pending}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Charts Section (Distribusi Status & Top SKPD) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Chart 1: Status Distribution */}
        <div 
          className="glass-card p-6 rounded-2xl backdrop-blur-md transition-all hover:shadow-xl"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
            border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
          }}
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
            <PieChart size={20} style={{ color: colors.gold }} />
            Distribusi Status Berkas
          </h3>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            {chartData.total === 0 ? (
              <p className="text-center py-8 italic w-full" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                Data tidak tersedia untuk filter ini.
              </p>
            ) : (
              <>
                {/* Donut Chart */}
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                      stroke={isDarkMode ? colors.tealMedium : colors.tealPale} 
                      strokeWidth="3"/>
                    {chartData.approved > 0 && (
                      <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                        stroke={colors.gold} strokeWidth="3"
                        strokeDasharray={`${(chartData.approved/chartData.total)*100} ${100 - (chartData.approved/chartData.total)*100}`} 
                        strokeDashoffset="100"
                        strokeLinecap="round"/>
                    )}
                    {chartData.rejected > 0 && (
                      <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                        stroke={colors.tealDark} strokeWidth="3"
                        strokeDasharray={`${(chartData.rejected/chartData.total)*100} ${100 - (chartData.rejected/chartData.total)*100}`} 
                        strokeDashoffset={`${100 - ((chartData.approved/chartData.total)*100)}`}
                        strokeLinecap="round"/>
                    )}
                    {chartData.pending > 0 && (
                      <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                        stroke={colors.tealLight} strokeWidth="3"
                        strokeDasharray={`${(chartData.pending/chartData.total)*100} ${100 - (chartData.pending/chartData.total)*100}`} 
                        strokeDashoffset={`${100 - ((chartData.approved/chartData.total)*100) - ((chartData.rejected/chartData.total)*100)}`}
                        strokeLinecap="round"/>
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      {chartData.total}
                    </span>
                    <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                      Total
                    </span>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.gold }}></div>
                      <span className="text-sm font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                        Disetujui
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: colors.gold }}>
                      {((chartData.approved/chartData.total)*100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.tealDark }}></div>
                      <span className="text-sm font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                        Ditolak
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: colors.gold }}>
                      {((chartData.rejected/chartData.total)*100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.tealLight }}></div>
                      <span className="text-sm font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                        Berjalan
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: colors.gold }}>
                      {((chartData.pending/chartData.total)*100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chart 2: Top SKPDs */}
        <div 
          className="glass-card p-6 rounded-2xl backdrop-blur-md transition-all hover:shadow-xl"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
            border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
          }}
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
            <BarChart2 size={20} style={{ color: colors.gold }} />
            5 Instansi Teraktif
          </h3>
          
          <div className="space-y-5">
            {chartData.topSkpds.length === 0 ? (
              <p className="text-center py-8 italic" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                Data tidak tersedia
              </p>
            ) : (
              chartData.topSkpds.map(([name, count], index) => (
                <div key={index} className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Star size={14} style={{ color: colors.gold }} className="animate-pulse" />}
                      <span className="text-sm font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                        {String(name || "")}
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: colors.gold }}>
                      {count} Usulan
                    </span>
                  </div>
                  <div 
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: isDarkMode ? colors.tealMedium : colors.tealPale }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-1000 group-hover:opacity-80"
                      style={{ 
                        width: `${(count / chartData.maxSkpdCount) * 100}%`,
                        background: `linear-gradient(90deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

       {/* Modal Export */}
      {showExportModal && (
        <ExportModal
          show={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          isDarkMode={isDarkMode}
          colors={colors}
          totalData={filteredProposals.length}
        />
      )}        

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardView;