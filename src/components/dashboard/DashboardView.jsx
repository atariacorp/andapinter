import React, { useMemo, useState, useEffect } from 'react';
import { 
  Inbox, Clock, FileCheck, FileX, 
  PieChart, BarChart2, CalendarDays, Layers,
  TrendingUp, Users, Award, Star, PlusCircle,
  FileText, Download, Search, CheckCircle, XCircle,
  AlertCircle, DollarSign, Activity, Zap, Shield,
  UserCheck, UserX, Eye, EyeOff, Filter
} from 'lucide-react';
import CalendarView from './CalendarView';
import ExportModal from '../common/ExportModal';

// ===== KOMPONEN PARTIKEL EMAS (VISUAL ENHANCED) =====
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 1.5,
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
      {particles.map((p) => (
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

const DashboardView = ({ 
  filteredProposals, 
  tahapList, 
  tahunList,
  selectedTahap, 
  setSelectedTahap, 
  selectedYear, 
  setSelectedYear,
  setCurrentPage,
  setView,
  proposals,
  addNotification,
  branding,
  currentUserProfile,
  isDarkMode
}) => {
  
  // State untuk efek paralaks
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showExportModal, setShowExportModal] = useState(false);

  // Efek paralaks halus
  useEffect(() => {
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 25,
          y: (e.clientY / window.innerHeight - 0.5) * 25
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Cek level user
  const userLevel = currentUserProfile?.level;
  const isSuperAdmin = userLevel === 'Super Admin';
  const isAdmin = userLevel === 'Admin' || isSuperAdmin;
  const isKasubid = userLevel === 'Kepala Sub Bidang';
  const isOperator = userLevel === 'Operator BKAD';
  const isSkpd = userLevel === 'SKPD';
  const isViewer = userLevel === 'TAPD' || userLevel === 'Viewer';

  // ===== STATISTIK DASAR =====
  const chartData = useMemo(() => {
    const total = filteredProposals.length;
    const pending = filteredProposals.filter(p => p.status === 'Pending').length;
    const verified = filteredProposals.filter(p => p.status === 'Diverifikasi').length;
    const approved = filteredProposals.filter(p => p.status === 'Disetujui').length;
    const rejected = filteredProposals.filter(p => String(p.status).includes('Ditolak')).length;

    const skpdCounts = {};
    filteredProposals.forEach(p => {
      skpdCounts[p.skpd] = (skpdCounts[p.skpd] || 0) + 1;
    });
    const topSkpds = Object.entries(skpdCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);
    const maxSkpdCount = topSkpds.length > 0 ? topSkpds[0][1] : 1;

    return { total, pending, verified, approved, rejected, topSkpds, maxSkpdCount };
  }, [filteredProposals]);

  // ===== STATISTIK KHUSUS =====
  const kasubidStats = useMemo(() => {
    const menungguPersetujuan = filteredProposals.filter(p => p.status === 'Diverifikasi').length;
    const sudahDisetujui = filteredProposals.filter(p => p.status === 'Disetujui').length;
    const ditolak = filteredProposals.filter(p => p.status === 'Ditolak Kasubid').length;
    
    return {
      menungguPersetujuan,
      sudahDisetujui,
      ditolak,
      totalDiproses: menungguPersetujuan + sudahDisetujui + ditolak
    };
  }, [filteredProposals]);

  const operatorStats = useMemo(() => {
    const menungguVerifikasi = filteredProposals.filter(p => p.status === 'Pending').length;
    const sudahDiverifikasi = filteredProposals.filter(p => p.status === 'Diverifikasi').length;
    const ditolak = filteredProposals.filter(p => p.status === 'Ditolak Operator').length;
    
    return {
      menungguVerifikasi,
      sudahDiverifikasi,
      ditolak,
      totalDiproses: menungguVerifikasi + sudahDiverifikasi + ditolak
    };
  }, [filteredProposals]);

  const skpdStats = useMemo(() => {
    const usulanSaya = filteredProposals.filter(p => p.skpdId === currentUserProfile?.skpdId).length;
    const disetujui = filteredProposals.filter(p => p.skpdId === currentUserProfile?.skpdId && p.status === 'Disetujui').length;
    const ditolak = filteredProposals.filter(p => p.skpdId === currentUserProfile?.skpdId && String(p.status).includes('Ditolak')).length;
    const pending = filteredProposals.filter(p => p.skpdId === currentUserProfile?.skpdId && p.status === 'Pending').length;
    
    return {
      usulanSaya,
      disetujui,
      ditolak,
      pending
    };
  }, [filteredProposals, currentUserProfile]);

  // ===== FITUR 1: GRAFIK TREN BULANAN =====
  const monthlyTrend = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const proposalsThisMonth = filteredProposals.filter(p => {
        const proposalDate = p.tanggalSurat || p.createdAt;
        if (!proposalDate) return false;
        const proposalYearMonth = proposalDate.substring(0, 7);
        return proposalYearMonth === yearMonth;
      });
      
      const total = proposalsThisMonth.length;
      const disetujui = proposalsThisMonth.filter(p => p.status === 'Disetujui').length;
      const ditolak = proposalsThisMonth.filter(p => String(p.status).includes('Ditolak')).length;
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

  // ===== FITUR 2: AKTIVITAS TERBARU =====
  const recentActivities = useMemo(() => {
    let filtered = filteredProposals;
    
    if (isOperator) {
      filtered = filteredProposals.filter(p => p.status === 'Pending');
    } else if (isKasubid) {
      filtered = filteredProposals.filter(p => p.status === 'Diverifikasi');
    } else if (isSkpd) {
      filtered = filteredProposals.filter(p => p.skpdId === currentUserProfile?.skpdId);
    }
    
    return filtered.slice(0, 5).map(p => {
      let icon = <FileText size={18} />;
      let color = '#3c5654';
      let bgColor = '#3c565420';
      
      switch(p.status) {
        case 'Pending':
          icon = <Clock size={18} />;
          color = '#d7a217';
          bgColor = '#d7a21720';
          break;
        case 'Diverifikasi':
          icon = <CheckCircle size={18} />;
          color = '#3c5654';
          bgColor = '#3c565420';
          break;
        case 'Disetujui':
          icon = <CheckCircle size={18} />;
          color = '#10b981';
          bgColor = '#10b98120';
          break;
        case 'Ditolak Operator':
        case 'Ditolak Kasubid':
        case 'Ditolak Admin':
          icon = <XCircle size={18} />;
          color = '#ef4444';
          bgColor = '#ef444420';
          break;
        default:
          icon = <FileText size={18} />;
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
  }, [filteredProposals, isOperator, isKasubid, isSkpd, currentUserProfile]);

  // ===== FITUR 3: QUICK ACTIONS =====
  const quickActions = useMemo(() => {
    const actions = [
      {
        id: 'add',
        label: 'Tambah Usulan Baru',
        icon: <PlusCircle size={22} />,
        color: '#d7a217',
        bgColor: '#d7a21720',
        onClick: () => {
          if (proposals?.resetForm) proposals.resetForm();
          setView('add-proposal');
        },
        showFor: ['SKPD', 'Admin', 'Super Admin', 'Operator BKAD']
      },
      {
        id: 'pending',
        label: isOperator ? 'Lihat Antrian Verifikasi' : (isKasubid ? 'Lihat Antrian Persetujuan' : 'Lihat Daftar Pending'),
        icon: <Clock size={22} />,
        color: '#d7a217',
        bgColor: '#d7a21720',
        onClick: () => {
          setView('list');
        },
        showFor: ['Admin', 'Super Admin', 'Operator BKAD', 'Kepala Sub Bidang']
      },
      {
        id: 'export',
        label: 'Export Data Laporan',
        icon: <Download size={22} />,
        color: '#425c5a',
        bgColor: '#425c5a20',
        onClick: () => setShowExportModal(true),
        showFor: ['Admin', 'Super Admin', 'Operator BKAD', 'Kepala Sub Bidang', 'TAPD']
      },
      {
        id: 'search',
        label: 'Pencarian Dokumen',
        icon: <Search size={22} />,
        color: '#425c5a',
        bgColor: '#425c5a20',
        onClick: () => {
          setView('list');
        },
        showFor: ['Admin', 'Super Admin', 'Operator BKAD', 'Kepala Sub Bidang', 'SKPD', 'TAPD']
      }
    ];
    
    return actions.filter(action => action.showFor.includes(userLevel));
  }, [userLevel, isOperator, isKasubid, proposals, setView]);

  // Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(angka);
  };

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

  // Palet warna
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
        alert('Fitur export PDF akan segera hadir!');
      }
      
      setShowExportModal(false);
      addNotification(`Data berhasil diekspor (${dataToExport.length} usulan)`, 'success');
      
    } catch (error) {
      console.error('Export error:', error);
      addNotification('Gagal mengekspor data', 'error');
    }
  };

  // ===== ENHANCED ADVANCED GLASSMORPHISM STYLES =====
  const glassCard = `backdrop-blur-2xl border transition-all duration-700 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_40px_-10px_rgba(215,162,23,0.25)] ${
    isDarkMode 
      ? 'bg-gradient-to-br from-[#3c5654]/40 to-[#2a3f3d]/60 border-[#cadfdf]/10' 
      : 'bg-gradient-to-br from-white/70 to-white/40 border-white/60'
  }`;

  return (
    <div className="space-y-8 animate-in fade-in relative overflow-hidden pb-12 min-h-screen text-sans">
      
      {/* ADVANCED BACKGROUND PARALLAX ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[10%] -right-[5%] w-[50vw] h-[50vw] bg-gradient-to-bl from-[#d7a217]/10 to-transparent rounded-full blur-[100px] transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(${mousePosition.x * -1}px, ${mousePosition.y * -1}px, 0)` }}
        />
        <div 
          className="absolute -bottom-[10%] -left-[5%] w-[60vw] h-[60vw] bg-gradient-to-tr from-[#425c5a]/20 dark:from-[#cadfdf]/10 to-transparent rounded-full blur-[120px] transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px, 0)` }}
        />
        <div 
          className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-gradient-to-r from-[#d7a217]/5 to-transparent rounded-full blur-[80px] animate-pulse-slow mix-blend-overlay transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px, 0)` }}
        />
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
      
      {/* Floating Particles */}
      <FloatingGoldParticles />

      {/* Header dengan Info Level User */}
      <div className="relative z-10 animate-slide-up-fade">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
          <div className="group">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#d7a217] to-[#b8860b] shadow-[0_0_20px_rgba(215,162,23,0.4)] transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Shield size={20} className="text-white drop-shadow-md" />
              </div>
              <span className="text-xs md:text-sm px-4 py-1.5 rounded-full font-black tracking-[0.15em] uppercase backdrop-blur-md shadow-inner transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(215,162,23,0.3)]" style={{ 
                backgroundColor: `${colors.gold}15`,
                color: colors.gold,
                border: `1px solid ${colors.gold}30`
              }}>
                {userLevel || 'User'}
              </span>
            </div>
            <h1 
              className="text-4xl md:text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent transition-all duration-500 group-hover:translate-x-1"
              style={{ 
                backgroundImage: isDarkMode ? `linear-gradient(to right, ${colors.tealLight}, #ffffff)` : `linear-gradient(to right, ${colors.tealDark}, ${colors.tealMedium})`,
                textShadow: isDarkMode ? '0 4px 10px rgba(0,0,0,0.4)' : '0 4px 10px rgba(0,0,0,0.05)'
              }}
            >
              {isOperator && 'Panel Verifikasi Operator'}
              {isKasubid && 'Panel Persetujuan'}
              {isSkpd && 'Dashboard Instansi'}
              {isAdmin && 'Dashboard Administrator'}
              {isViewer && 'Dashboard Viewer'}
              {!isOperator && !isKasubid && !isSkpd && !isAdmin && !isViewer && 'Monitoring Berkas'}
            </h1>
            <p 
              className="text-base font-semibold max-w-2xl tracking-wide"
              style={{ color: isDarkMode ? `${colors.tealLight}CC` : `${colors.tealDark}CC` }}
            >
              {isOperator && 'Kelola verifikasi usulan yang masuk dari SKPD dengan efisien.'}
              {isKasubid && 'Berikan persetujuan akhir untuk usulan yang telah melewati tahap verifikasi.'}
              {isSkpd && 'Pantau dan kelola status usulan instansi Anda secara real-time.'}
              {isAdmin && 'Pusat kendali dan monitoring utama sistem e-budgeting.'}
              {isViewer && 'Pantau seluruh aktivitas dan progres sistem secara transparan.'}
              {!isOperator && !isKasubid && !isSkpd && !isAdmin && !isViewer && 'Dashboard Utama Aplikasi.'}
            </p>
          </div>
          
          {/* Filters dengan Glassmorphism */}
          <div className="flex flex-wrap items-center gap-4">
            <div className={`relative group ${glassCard} rounded-2xl`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer pointer-events-none rounded-2xl"></div>
              <div className="relative flex items-center gap-3 px-5 py-3">
                <Layers size={20} className="text-[#d7a217] transition-transform duration-300 group-hover:scale-110" />
                <select 
                  value={selectedTahap} 
                  onChange={e => setSelectedTahap(e.target.value)} 
                  className="bg-transparent text-sm md:text-base font-bold outline-none cursor-pointer pr-4 appearance-none"
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
            </div>
            
            <div className={`relative group ${glassCard} rounded-2xl`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer pointer-events-none rounded-2xl"></div>
              <div className="relative flex items-center gap-3 px-5 py-3">
                <CalendarDays size={20} className="text-[#d7a217] transition-transform duration-300 group-hover:scale-110" />
                <select 
                  value={selectedYear} 
                  onChange={e => {
                    setSelectedYear(e.target.value); 
                    setCurrentPage(1);
                  }} 
                  className="bg-transparent text-sm md:text-base font-bold outline-none cursor-pointer pr-4 appearance-none"
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
          </div>
        </div>
      </div>

      {/* ===== STAT CARDS UTAMA ===== */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up-fade animation-delay-100">
        <StatCard 
          title="TOTAL MASUK" 
          value={chartData.total} 
          icon={<Inbox size={26} />}
          color="#425c5a"
          description="Seluruh Berkas Usulan"
          isDarkMode={isDarkMode}
          colors={colors}
          glassCard={glassCard}
        />
        
        <StatCard 
          title="DALAM PROSES" 
          value={chartData.pending + chartData.verified} 
          icon={<Clock size={26} />}
          color="#d7a217"
          description="Sedang Berjalan"
          isDarkMode={isDarkMode}
          colors={colors}
          glassCard={glassCard}
        />
        
        <StatCard 
          title="DISETUJUI FINAL" 
          value={chartData.approved} 
          icon={<FileCheck size={26} />}
          color="#10b981"
          description="Berkas Tervalidasi"
          isDarkMode={isDarkMode}
          colors={colors}
          glassCard={glassCard}
        />
        
        <StatCard 
          title="PERLU PERBAIKAN" 
          value={chartData.rejected} 
          icon={<FileX size={26} />}
          color="#ef4444"
          description="Usulan Ditolak"
          isDarkMode={isDarkMode}
          colors={colors}
          glassCard={glassCard}
        />
      </div>

      {/* ===== STATISTIK KHUSUS PER LEVEL ===== */}
      {isOperator && (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 animate-slide-up-fade animation-delay-200">
          <StatCard 
            title="Menunggu Verifikasi" 
            value={operatorStats.menungguVerifikasi} 
            icon={<Clock size={26} />}
            color="#d7a217"
            description="Tugas Verifikasi Anda"
            isDarkMode={isDarkMode}
            colors={colors}
            glassCard={glassCard}
          />
          <StatCard 
            title="Selesai Diverifikasi" 
            value={operatorStats.sudahDiverifikasi} 
            icon={<CheckCircle size={26} />}
            color="#3c5654"
            description="Lanjut ke Kasubid"
            isDarkMode={isDarkMode}
            colors={colors}
            glassCard={glassCard}
          />
        </div>
      )}

      {isKasubid && (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 animate-slide-up-fade animation-delay-200">
          <StatCard 
            title="Menunggu Persetujuan" 
            value={kasubidStats.menungguPersetujuan} 
            icon={<Clock size={26} />}
            color="#d7a217"
            description="Tugas Persetujuan Anda"
            isDarkMode={isDarkMode}
            colors={colors}
            glassCard={glassCard}
          />
          <StatCard 
            title="Sudah Disetujui" 
            value={kasubidStats.sudahDisetujui} 
            icon={<CheckCircle size={26} />}
            color="#10b981"
            description="Finalisasi Berhasil"
            isDarkMode={isDarkMode}
            colors={colors}
            glassCard={glassCard}
          />
        </div>
      )}

      {isSkpd && (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 animate-slide-up-fade animation-delay-200">
          <StatCard 
            title="Total Usulan Saya" 
            value={skpdStats.usulanSaya} 
            icon={<FileText size={26} />}
            color="#425c5a"
            description="Akumulasi Pengajuan"
            isDarkMode={isDarkMode}
            colors={colors}
            glassCard={glassCard}
          />
          <StatCard 
            title="Status Pending" 
            value={skpdStats.pending} 
            icon={<Clock size={26} />}
            color="#d7a217"
            description="Menunggu Evaluasi"
            isDarkMode={isDarkMode}
            colors={colors}
            glassCard={glassCard}
          />
        </div>
      )}

      {/* ===== KALENDER DEADLINE ===== */}
      <div className="relative z-10 mt-8 animate-slide-up-fade animation-delay-300">
        <div className={`${glassCard} rounded-3xl overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.2)]`}>
          <CalendarView 
            proposals={filteredProposals}
            isDarkMode={isDarkMode}
            colors={colors}
            branding={branding}
            onDateClick={(date, proposals) => {
              console.log('Selected date:', date, proposals);
            }}
          />
        </div>
      </div>

      {/* ===== GRAFIK TREN BULANAN & RINGKASAN ANGGARAN ===== */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 animate-slide-up-fade animation-delay-400">
        <div className="lg:col-span-2">
          <div className={`${glassCard} p-8 rounded-3xl relative overflow-hidden h-full group`}>
            {/* Ambient Chart Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d7a217] blur-[100px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700"></div>
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-xl font-black flex items-center gap-3" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[0_0_15px_rgba(215,162,23,0.2)]">
                  <TrendingUp size={24} style={{ color: colors.gold }} />
                </div>
                Tren Usulan 6 Bulan Terakhir
              </h3>
              <span className="text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-inner backdrop-blur-md" style={{ 
                backgroundColor: `${colors.gold}15`,
                color: colors.gold,
                border: `1px solid ${colors.gold}30`
              }}>
                {selectedYear}
              </span>
            </div>
            
            {/* HTML/CSS Bar Chart ECharts Style Simulation */}
            <div className="space-y-6 relative z-10">
              {monthlyTrend.map((item, idx) => (
                <div key={idx} className="space-y-2 group/bar cursor-pointer">
                  <div className="flex justify-between items-end text-sm">
                    <span className="font-bold tracking-wider" style={{ color: colors.tealMedium }}>{item.month}</span>
                    <div className="flex gap-4 font-bold opacity-70 group-hover/bar:opacity-100 transition-opacity duration-300">
                      <span className="bg-gradient-to-r from-[#f9d423] to-[#d7a217] bg-clip-text text-transparent">{item.total} usulan</span>
                      <span style={{ color: '#10b981' }}>{item.disetujui} ✓</span>
                      <span style={{ color: '#ef4444' }}>{item.ditolak} ✗</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-4 rounded-full overflow-hidden bg-black/5 dark:bg-white/5 shadow-inner">
                    {item.total > 0 ? (
                      <>
                        <div 
                          className="h-full relative overflow-hidden transition-all duration-1000 ease-out group-hover/bar:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                          style={{ 
                            width: `${(item.disetujui / item.total) * 100}%`,
                            background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/bar:animate-shimmer"></div>
                        </div>
                        <div 
                          className="h-full relative overflow-hidden transition-all duration-1000 ease-out group-hover/bar:shadow-[0_0_15px_rgba(215,162,23,0.5)]"
                          style={{ 
                            width: `${(item.berjalan / item.total) * 100}%`,
                            background: 'linear-gradient(90deg, #b8860b 0%, #d7a217 100%)'
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/bar:animate-shimmer"></div>
                        </div>
                        <div 
                          className="h-full relative overflow-hidden transition-all duration-1000 ease-out group-hover/bar:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                          style={{ 
                            width: `${(item.ditolak / item.total) * 100}%`,
                            background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)'
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/bar:animate-shimmer"></div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full w-full bg-gray-200/30 dark:bg-gray-700/30" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-end gap-6 mt-8 text-sm font-bold tracking-wide relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}></div>
                <span style={{ color: colors.tealMedium }}>Disetujui</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md shadow-[0_0_10px_rgba(215,162,23,0.4)]" style={{ background: 'linear-gradient(135deg, #b8860b, #d7a217)' }}></div>
                <span style={{ color: colors.tealMedium }}>Proses Berjalan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md shadow-[0_0_10px_rgba(239,68,68,0.4)]" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}></div>
                <span style={{ color: colors.tealMedium }}>Ditolak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Anggaran */}
        <div className="lg:col-span-1">
          <div className={`${glassCard} p-8 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden group`}>
            {/* Ambient Glow */}
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#10b981] blur-[100px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700"></div>

            <h3 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[0_0_15px_rgba(215,162,23,0.2)]">
                <DollarSign size={24} style={{ color: colors.gold }} />
              </div>
              Ringkasan Anggaran
            </h3>
            
            <div className="space-y-5 relative z-10 flex-1 flex flex-col justify-center">
              <div className="p-5 rounded-2xl relative overflow-hidden group/card shadow-sm hover:shadow-md transition-shadow duration-300" style={{ backgroundColor: `${colors.gold}08`, border: `1px solid ${colors.gold}20` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:animate-shimmer"></div>
                <p className="text-sm font-bold tracking-wider mb-2 uppercase" style={{ color: colors.tealMedium }}>Total Diajukan</p>
                <p className="text-2xl font-black bg-clip-text text-transparent" style={{ backgroundImage: isDarkMode ? `linear-gradient(135deg, #ffffff, ${colors.tealPale})` : `linear-gradient(135deg, ${colors.tealDark}, ${colors.tealMedium})` }}>
                  {formatRupiah(chartData.total * 1000000)}
                </p>
              </div>
              
              <div className="p-5 rounded-2xl relative overflow-hidden group/card shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-shadow duration-300" style={{ backgroundColor: '#10b98108', border: '1px solid #10b98130' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/card:animate-shimmer"></div>
                <p className="text-sm font-bold tracking-wider mb-2 uppercase" style={{ color: colors.tealMedium }}>Total Disetujui</p>
                <p className="text-2xl font-black bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  {formatRupiah(chartData.approved * 1000000)}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-4 rounded-xl backdrop-blur-md" style={{ backgroundColor: `${colors.tealPale}15`, border: `1px solid ${colors.tealPale}30` }}>
                <span className="text-sm font-bold tracking-wide" style={{ color: colors.tealMedium }}>Sisa / Selisih</span>
                <span className="text-lg font-black" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  {formatRupiah((chartData.total - chartData.approved) * 1000000)}
                </span>
              </div>

              {/* Progress Circle - ECharts Enhanced Simulation */}
              <div className="relative w-32 h-32 mx-auto mt-6 group/circle">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-lg">
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f9d423" />
                      <stop offset="100%" stopColor="#d7a217" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                    stroke={isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.5)'} strokeWidth="3.5"/>
                  <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                    stroke="url(#progressGrad)" strokeWidth="3.5"
                    strokeDasharray={`${chartData.total > 0 ? (chartData.approved / chartData.total) * 100 : 0} ${100 - (chartData.total > 0 ? (chartData.approved / chartData.total) * 100 : 0)}`}
                    strokeDashoffset="100"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    className="transition-all duration-1000 ease-out group-hover/circle:drop-shadow-[0_0_10px_rgba(215,162,23,0.8)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-b from-[#f9d423] to-[#d7a217] drop-shadow-md">
                    {chartData.total > 0 ? ((chartData.approved / chartData.total) * 100).toFixed(0) : 0}%
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">Realisasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== AKTIVITAS TERBARU & QUICK ACTIONS ===== */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 animate-slide-up-fade animation-delay-500">
        
        {/* Aktivitas Terbaru */}
        <div className="lg:col-span-2">
          <div className={`${glassCard} p-8 rounded-3xl h-full`}>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-black flex items-center gap-3" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[0_0_15px_rgba(215,162,23,0.2)]">
                  <Activity size={24} style={{ color: colors.gold }} />
                </div>
                Log Aktivitas Terbaru
              </h3>
              
              {(isOperator || isKasubid) && (
                <span className="text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-inner backdrop-blur-md" style={{ 
                  backgroundColor: isKasubid ? '#10b98115' : `${colors.gold}15`,
                  color: isKasubid ? '#10b981' : colors.gold,
                  border: `1px solid ${isKasubid ? '#10b98130' : `${colors.gold}30`}`
                }}>
                  {isOperator ? 'Antrian Verifikasi Aktif' : 'Menunggu Persetujuan Final'}
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, idx) => (
                  <div 
                    key={activity.id || idx}
                    className="flex items-start md:items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group hover:bg-white/40 dark:hover:bg-black/20"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.1)' : 'rgba(255,255,255,0.4)',
                      border: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.05)' : 'rgba(202,223,223,0.3)'}`,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                    }}
                    onClick={() => {
                      if (activity.id) {
                        // Navigasi ke detail proposal
                      }
                    }}
                  >
                    <div 
                      className="p-3.5 rounded-xl shrink-0 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 relative"
                      style={{ backgroundColor: activity.bgColor || `${colors.gold}20` }}
                    >
                      <div className="absolute inset-0 rounded-xl animate-pulse-slow opacity-50" style={{ backgroundColor: activity.bgColor, filter: 'blur(8px)' }}></div>
                      <span className="relative z-10" style={{ color: activity.color || colors.gold }}>{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold truncate mb-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                        {activity.title}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium opacity-80" style={{ color: colors.tealMedium }}>
                        <span className="truncate">{activity.description}</span>
                        <span className="hidden sm:inline opacity-30">•</span>
                        <span className="font-bold tracking-wide" style={{ color: activity.color }}>{activity.status}</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-sm self-start md:self-auto" style={{ 
                      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)',
                      color: colors.tealMedium,
                      border: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.3)'}`
                    }}>
                      {getRelativeTime(activity.time)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 px-4 rounded-2xl" style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-[#d7a217] blur-xl opacity-20 rounded-full animate-pulse-slow"></div>
                    <div className="relative w-full h-full rounded-full border border-[#d7a217]/30 bg-[#d7a217]/10 flex items-center justify-center backdrop-blur-md">
                      <Activity size={36} style={{ color: colors.gold }} />
                    </div>
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-widest mb-2" style={{ color: colors.gold }}>Data Kosong</h4>
                  <p className="text-sm font-medium max-w-sm mx-auto opacity-70 leading-relaxed" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                    {isOperator && 'Belum ada usulan masuk yang memerlukan verifikasi Anda.'}
                    {isKasubid && 'Belum ada usulan terverifikasi yang memerlukan persetujuan.'}
                    {isSkpd && 'Instansi Anda belum melakukan aktivitas pengajuan usulan.'}
                    {isAdmin && 'Belum ada aktivitas terekam dalam sistem saat ini.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-1">
          <div className={`${glassCard} p-8 rounded-3xl h-full flex flex-col`}>
            <h3 className="text-xl font-black mb-6 flex items-center gap-3" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[0_0_15px_rgba(215,162,23,0.2)]">
                <Zap size={24} style={{ color: colors.gold }} />
              </div>
              Akses Cepat
            </h3>
            
            <div className="space-y-4 flex-1">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.2)] group relative overflow-hidden"
                  style={{ 
                    backgroundColor: action.bgColor,
                    border: `1px solid ${action.color}30`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                  <div 
                    className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative z-10 shadow-sm"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <span style={{ color: action.color }}>{action.icon}</span>
                  </div>
                  <span className="text-base font-black tracking-wide relative z-10" style={{ color: action.color }}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Stats Mini */}
            <div className="mt-8 pt-6 border-t relative" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.3)' }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold tracking-wider uppercase" style={{ color: colors.tealMedium }}>Usulan Hari Ini</span>
                <span className="font-black px-4 py-1.5 rounded-lg text-lg shadow-inner" style={{ 
                  backgroundColor: `${colors.gold}20`,
                  color: colors.gold,
                  border: `1px solid ${colors.gold}40`
                }}>
                  {filteredProposals.filter(p => {
                    const today = new Date().toISOString().split('T')[0];
                    return (p.tanggalSurat || p.createdAt)?.startsWith(today);
                  }).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold tracking-wider uppercase" style={{ color: colors.tealMedium }}>
                  {isOperator ? 'Perlu Verifikasi' : (isKasubid ? 'Perlu Persetujuan' : 'Antrian Pending')}
                </span>
                <span className="font-black text-xl drop-shadow-sm" style={{ color: colors.gold }}>
                  {isOperator ? operatorStats.menungguVerifikasi : 
                   isKasubid ? kasubidStats.menungguPersetujuan : 
                   chartData.pending}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CHARTS TAMBAHAN (HANYA UNTUK ADMIN) ===== */}
      {(isAdmin || isSuperAdmin || isViewer) && (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 animate-slide-up-fade animation-delay-700">
          
          {/* Chart Distribusi Status - ECharts Style */}
          <div className={`${glassCard} p-8 rounded-3xl group/pie`}>
            <h3 className="text-xl font-black mb-8 flex items-center gap-3" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[0_0_15px_rgba(215,162,23,0.2)]">
                <PieChart size={24} style={{ color: colors.gold }} />
              </div>
              Distribusi Status Berkas Keseluruhan
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
              <div className="relative w-48 h-48 transition-transform duration-500 group-hover/pie:scale-105">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
                  <defs>
                    <linearGradient id="gradApproved" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="gradRejected" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                    <linearGradient id="gradPending" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#b8860b" />
                      <stop offset="100%" stopColor="#d7a217" />
                    </linearGradient>
                    <filter id="pieGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                    stroke={isDarkMode ? 'rgba(202,223,223,0.05)' : 'rgba(202,223,223,0.2)'} strokeWidth="4"/>
                  
                  {chartData.approved > 0 && (
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                      stroke="url(#gradApproved)" strokeWidth="4"
                      strokeDasharray={`${(chartData.approved/chartData.total)*100} ${100 - (chartData.approved/chartData.total)*100}`} 
                      strokeDashoffset="100"
                      strokeLinecap="round"
                      filter="url(#pieGlow)"
                      className="transition-all duration-1000 ease-out hover:stroke-width-[5px] cursor-pointer"
                    />
                  )}
                  {chartData.rejected > 0 && (
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                      stroke="url(#gradRejected)" strokeWidth="4"
                      strokeDasharray={`${(chartData.rejected/chartData.total)*100} ${100 - (chartData.rejected/chartData.total)*100}`} 
                      strokeDashoffset={`${100 - ((chartData.approved/chartData.total)*100)}`}
                      strokeLinecap="round"
                      filter="url(#pieGlow)"
                      className="transition-all duration-1000 ease-out hover:stroke-width-[5px] cursor-pointer"
                    />
                  )}
                  {chartData.pending + chartData.verified > 0 && (
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" 
                      stroke="url(#gradPending)" strokeWidth="4"
                      strokeDasharray={`${((chartData.pending + chartData.verified)/chartData.total)*100} ${100 - ((chartData.pending + chartData.verified)/chartData.total)*100}`} 
                      strokeDashoffset={`${100 - ((chartData.approved/chartData.total)*100) - ((chartData.rejected/chartData.total)*100)}`}
                      strokeLinecap="round"
                      filter="url(#pieGlow)"
                      className="transition-all duration-1000 ease-out hover:stroke-width-[5px] cursor-pointer"
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black bg-clip-text text-transparent" style={{ backgroundImage: isDarkMode ? `linear-gradient(to bottom, #ffffff, ${colors.tealPale})` : `linear-gradient(to bottom, ${colors.tealDark}, ${colors.tealMedium})` }}>
                    {chartData.total}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-70" style={{ color: colors.tealMedium }}>Total Dokumen</span>
                </div>
              </div>
              
              <div className="space-y-4 w-full md:w-auto min-w-[200px]">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}></div>
                    <span className="text-base font-bold tracking-wide" style={{ color: colors.tealMedium }}>Disetujui</span>
                  </div>
                  <span className="text-xl font-black text-[#10b981] drop-shadow-sm">{chartData.approved}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-md shadow-[0_0_10px_rgba(215,162,23,0.5)]" style={{ background: 'linear-gradient(135deg, #b8860b, #d7a217)' }}></div>
                    <span className="text-base font-bold tracking-wide" style={{ color: colors.tealMedium }}>Dalam Proses</span>
                  </div>
                  <span className="text-xl font-black text-[#d7a217] drop-shadow-sm">{chartData.pending + chartData.verified}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-md shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}></div>
                    <span className="text-base font-bold tracking-wide" style={{ color: colors.tealMedium }}>Ditolak</span>
                  </div>
                  <span className="text-xl font-black text-[#ef4444] drop-shadow-sm">{chartData.rejected}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Top SKPD - ECharts Style */}
          <div className={`${glassCard} p-8 rounded-3xl relative overflow-hidden group/barChart`}>
            {/* Ambient Glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#d7a217] blur-[80px] opacity-10 pointer-events-none group-hover/barChart:opacity-20 transition-opacity duration-700"></div>

            <h3 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-[0_0_15px_rgba(215,162,23,0.2)]">
                <BarChart2 size={24} style={{ color: colors.gold }} />
              </div>
              5 Instansi Pengaju Teraktif
            </h3>
            
            <div className="space-y-5 relative z-10">
              {chartData.topSkpds.length > 0 ? (
                chartData.topSkpds.map(([name, count], idx) => (
                  <div key={idx} className="space-y-2 group/bar">
                    <div className="flex justify-between items-end text-sm md:text-base">
                      <span className="truncate max-w-[250px] md:max-w-[300px] font-bold tracking-wide" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                        {idx === 0 && <Star size={14} className="inline mr-2 text-[#d7a217] animate-pulse-slow" />}
                        {name}
                      </span>
                      <span className="font-black text-lg bg-clip-text text-transparent drop-shadow-sm" style={{ backgroundImage: 'linear-gradient(to right, #f9d423, #d7a217)' }}>{count}</span>
                    </div>
                    <div className="w-full h-3.5 bg-black/5 dark:bg-white/5 shadow-inner rounded-full overflow-hidden p-[1.5px]">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out relative group-hover/bar:shadow-[0_0_10px_rgba(215,162,23,0.6)]"
                        style={{ 
                          width: `${(count / chartData.maxSkpdCount) * 100}%`,
                          background: `linear-gradient(90deg, ${colors.gold} 0%, #f9d423 100%)`
                        }}
                      >
                         <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover/bar:animate-shimmer rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                  <BarChart2 size={40} style={{ color: colors.tealMedium, marginBottom: '1rem' }} />
                  <p className="text-base font-bold italic tracking-wide" style={{ color: colors.tealMedium }}>
                    Belum ada data visualisasi
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Export */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in zoom-in duration-300">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExportModal(false)}></div>
           <div className="relative z-10 w-full max-w-lg">
             <ExportModal
              show={showExportModal}
              onClose={() => setShowExportModal(false)}
              onExport={handleExport}
              isDarkMode={isDarkMode}
              colors={colors}
              totalData={filteredProposals.length}
             />
           </div>
        </div>
      )}

      {/* Custom CSS Animations & Advanced Glass Styles */}
      <style>{`
        /* Custom Modern Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(202, 223, 223, 0.05); border-radius: 20px; margin: 10px 0; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, transparent, rgba(215, 162, 23, 0.5), transparent); border-radius: 20px; transition: all 0.3s; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #d7a217, #b8860b); box-shadow: 0 0 10px rgba(215, 162, 23, 0.5); }

        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0; }
          20% { opacity: var(--tw-opacity, 0.8); transform: scale(1.2) rotate(45deg); }
          80% { opacity: var(--tw-opacity, 0.8); transform: scale(0.8) rotate(90deg); }
          100% { transform: translateY(-120vh) translateX(100px) scale(1) rotate(180deg); opacity: 0; }
        }
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-shimmer { animation: shimmer 2s infinite linear; }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        .animate-slide-up-fade { animation: slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-700 { animation-delay: 700ms; }
      `}</style>
    </div>
  );
};

// ===== KOMPONEN STAT CARD (VISUAL ENHANCED) =====
const StatCard = ({ title, value, icon, color, description, isDarkMode, colors, glassCard }) => {
  return (
    <div 
      className={`${glassCard} p-6 rounded-3xl transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] group relative overflow-hidden`}
    >
      {/* Dynamic Ambient Glow Based on Card Color */}
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: color }}
      ></div>
      
      {/* Shine Sweep Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div 
          className="p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm group-hover:shadow-md"
          style={{ 
            backgroundColor: `${color}15`,
            border: `1px solid ${color}30`,
            boxShadow: `0 0 15px ${color}20`
          }}
        >
          <div style={{ color: color }} className="drop-shadow-md">{icon}</div>
        </div>
        <span 
          className="text-4xl md:text-5xl font-black transition-all duration-500 group-hover:scale-105 origin-right" 
          style={{ 
            color: isDarkMode ? colors.tealLight : colors.tealDark,
            textShadow: isDarkMode ? `0 4px 10px rgba(0,0,0,0.5)` : `0 4px 10px rgba(0,0,0,0.05)`
          }}
        >
          {value}
        </span>
      </div>
      
      <div className="relative z-10">
        <h3 
          className="text-sm md:text-base font-black uppercase tracking-[0.15em] mb-1.5 transition-colors duration-300" 
          style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
        >
          {title}
        </h3>
        <p 
          className="text-sm font-bold tracking-wide" 
          style={{ color: color }}
        >
          {description}
        </p>
      </div>
      
      {/* Bottom Accent Line */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r w-0 group-hover:w-full transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `linear-gradient(to right, transparent, ${color}, transparent)` }}
      ></div>
    </div>
  );
};

export default DashboardView;