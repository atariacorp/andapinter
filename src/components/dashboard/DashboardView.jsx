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
  currentUserProfile,  // <-- TAMBAHKAN INI
  isDarkMode
}) => {
  
  // State untuk efek paralaks
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  // ===== STATISTIK KHUSUS UNTUK KASUBID =====
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

  // ===== STATISTIK KHUSUS UNTUK OPERATOR =====
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

  // ===== STATISTIK KHUSUS UNTUK SKPD =====
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

  // ===== FITUR 2: AKTIVITAS TERBARU (BERDASARKAN LEVEL) =====
  const recentActivities = useMemo(() => {
    let filtered = filteredProposals;
    
    // Filter berdasarkan level
    if (isOperator) {
      filtered = filteredProposals.filter(p => p.status === 'Pending');
    } else if (isKasubid) {
      filtered = filteredProposals.filter(p => p.status === 'Diverifikasi');
    } else if (isSkpd) {
      filtered = filteredProposals.filter(p => p.skpdId === currentUserProfile?.skpdId);
    }
    
    return filtered.slice(0, 5).map(p => {
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
        case 'Ditolak Operator':
        case 'Ditolak Kasubid':
        case 'Ditolak Admin':
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
  }, [filteredProposals, isOperator, isKasubid, isSkpd, currentUserProfile]);

  // ===== QUICK ACTIONS (BERDASARKAN LEVEL) =====
  const quickActions = useMemo(() => {
    const actions = [
      {
        id: 'add',
        label: 'Tambah Usulan',
        icon: <PlusCircle size={18} />,
        color: '#d7a217',
        bgColor: '#d7a21720',
        onClick: () => {
          if (proposals?.resetForm) proposals.resetForm();
          setView('add-proposal');
        },
        showFor: ['SKPD', 'Admin', 'Super Admin', 'Operator BKAD'] // Bisa tambah usulan
      },
      {
        id: 'pending',
        label: isOperator ? 'Lihat Antrian' : (isKasubid ? 'Lihat Persetujuan' : 'Lihat Pending'),
        icon: <Clock size={18} />,
        color: '#d7a217',
        bgColor: '#d7a21720',
        onClick: () => {
          setView('list');
        },
        showFor: ['Admin', 'Super Admin', 'Operator BKAD', 'Kepala Sub Bidang']
      },
      {
        id: 'export',
        label: 'Export Laporan',
        icon: <Download size={18} />,
        color: '#425c5a',
        bgColor: '#425c5a20',
        onClick: () => setShowExportModal(true),
        showFor: ['Admin', 'Super Admin', 'Operator BKAD', 'Kepala Sub Bidang', 'TAPD']
      },
      {
        id: 'search',
        label: 'Pencarian',
        icon: <Search size={18} />,
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

  return (
    <div className="space-y-6 animate-in fade-in relative overflow-hidden pb-10">
      
      {/* Animated Background */}
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

      {/* Header dengan Info Level User */}
      <div className="relative z-10">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#d7a217]/20 flex items-center justify-center">
                <Shield size={16} className="text-[#d7a217]" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full" style={{ 
                backgroundColor: `${colors.gold}20`,
                color: colors.gold
              }}>
                {userLevel}
              </span>
            </div>
            <h1 
              className="text-2xl font-bold tracking-tight"
              style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
            >
              {isOperator && 'Panel Verifikasi Operator'}
              {isKasubid && 'Panel Persetujuan Kepala Sub Bidang'}
              {isSkpd && 'Dashboard Instansi'}
              {isAdmin && 'Dashboard Administrator'}
              {isViewer && 'Dashboard Viewer'}
              {!isOperator && !isKasubid && !isSkpd && !isAdmin && !isViewer && 'Monitoring Berkas'}
            </h1>
            <p 
              className="text-sm mt-1"
              style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}
            >
              {isOperator && 'Kelola verifikasi usulan yang masuk dari SKPD'}
              {isKasubid && 'Berikan persetujuan akhir untuk usulan yang sudah diverifikasi'}
              {isSkpd && 'Pantau status usulan instansi Anda'}
              {isAdmin && 'Dashboard Utama Administrator'}
              {isViewer && 'Lihat seluruh aktivitas sistem'}
              {!isOperator && !isKasubid && !isSkpd && !isAdmin && !isViewer && 'Dashboard Utama Aplikasi'}
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
        </div>
      </div>

      {/* Stat Cards - Dinamis berdasarkan level */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card untuk OPERATOR */}
        {isOperator && (
          <>
            <StatCard 
              title="Menunggu Verifikasi" 
              value={operatorStats.menungguVerifikasi} 
              icon={<Clock size={22} />}
              color="#d7a217"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Sudah Diverifikasi" 
              value={operatorStats.sudahDiverifikasi} 
              icon={<CheckCircle size={22} />}
              color="#3c5654"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Ditolak" 
              value={operatorStats.ditolak} 
              icon={<XCircle size={22} />}
              color="#ef4444"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Total Diproses" 
              value={operatorStats.totalDiproses} 
              icon={<Activity size={22} />}
              color="#425c5a"
              isDarkMode={isDarkMode}
              colors={colors}
            />
          </>
        )}

        {/* Card untuk KASUBID */}
        {isKasubid && (
          <>
            <StatCard 
              title="Menunggu Persetujuan" 
              value={kasubidStats.menungguPersetujuan} 
              icon={<Clock size={22} />}
              color="#d7a217"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Sudah Disetujui" 
              value={kasubidStats.sudahDisetujui} 
              icon={<CheckCircle size={22} />}
              color="#10b981"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Ditolak" 
              value={kasubidStats.ditolak} 
              icon={<XCircle size={22} />}
              color="#ef4444"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Total Diproses" 
              value={kasubidStats.totalDiproses} 
              icon={<Activity size={22} />}
              color="#425c5a"
              isDarkMode={isDarkMode}
              colors={colors}
            />
          </>
        )}

        {/* Card untuk SKPD */}
        {isSkpd && (
          <>
            <StatCard 
              title="Usulan Saya" 
              value={skpdStats.usulanSaya} 
              icon={<FileText size={22} />}
              color="#425c5a"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Disetujui" 
              value={skpdStats.disetujui} 
              icon={<CheckCircle size={22} />}
              color="#10b981"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Pending" 
              value={skpdStats.pending} 
              icon={<Clock size={22} />}
              color="#d7a217"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Ditolak" 
              value={skpdStats.ditolak} 
              icon={<XCircle size={22} />}
              color="#ef4444"
              isDarkMode={isDarkMode}
              colors={colors}
            />
          </>
        )}

        {/* Card untuk ADMIN / SUPER ADMIN / VIEWER */}
        {(isAdmin || isViewer) && !isOperator && !isKasubid && !isSkpd && (
          <>
            <StatCard 
              title="Total Usulan" 
              value={chartData.total} 
              icon={<Inbox size={22} />}
              color="#425c5a"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Proses" 
              value={chartData.pending + chartData.verified} 
              icon={<Clock size={22} />}
              color="#d7a217"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Disetujui" 
              value={chartData.approved} 
              icon={<FileCheck size={22} />}
              color="#10b981"
              isDarkMode={isDarkMode}
              colors={colors}
            />
            <StatCard 
              title="Ditolak" 
              value={chartData.rejected} 
              icon={<FileX size={22} />}
              color="#ef4444"
              isDarkMode={isDarkMode}
              colors={colors}
            />
          </>
        )}
      </div>

      {/* Calendar View - Untuk semua level (opsional) */}
      <div className="relative z-10 mt-6">
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

      {/* Quick Actions & Aktivitas Terbaru */}
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
              {isOperator && <span className="text-xs ml-2 px-2 py-1 bg-[#d7a217]/20 text-[#d7a217] rounded-full">Antrian Verifikasi</span>}
              {isKasubid && <span className="text-xs ml-2 px-2 py-1 bg-[#10b981]/20 text-[#10b981] rounded-full">Menunggu Persetujuan</span>}
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
                      if (activity.id) {
                        // Navigasi ke detail proposal
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
                        {activity.description} • {activity.status}
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
                  <p className="text-sm italic" style={{ color: colors.tealMedium }}>
                    {isOperator && 'Tidak ada usulan yang perlu diverifikasi'}
                    {isKasubid && 'Tidak ada usulan yang perlu disetujui'}
                    {isSkpd && 'Belum ada aktivitas dari instansi Anda'}
                    {isAdmin && 'Belum ada aktivitas terbaru'}
                  </p>
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
                <span className="font-bold" style={{ color: colors.gold }}>
                  {filteredProposals.filter(p => {
                    const today = new Date().toISOString().split('T')[0];
                    return (p.tanggalSurat || p.createdAt)?.startsWith(today);
                  }).length}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs mt-2">
                <span style={{ color: colors.tealMedium }}>
                  {isOperator ? 'Perlu Verifikasi' : (isKasubid ? 'Perlu Persetujuan' : 'Perlu Verifikasi')}
                </span>
                <span className="font-bold" style={{ color: colors.gold }}>
                  {isOperator ? operatorStats.menungguVerifikasi : 
                   isKasubid ? kasubidStats.menungguPersetujuan : 
                   chartData.pending}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Sesuai level */}
      {(isAdmin || isSuperAdmin || isViewer) && (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Chart Distribusi Status */}
          <div 
            className="glass-card p-6 rounded-2xl backdrop-blur-md transition-all hover:shadow-xl"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Distribusi Status
            </h3>
            {/* Chart content */}
          </div>

          {/* Chart Top SKPD */}
          <div 
            className="glass-card p-6 rounded-2xl backdrop-blur-md transition-all hover:shadow-xl"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`,
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Instansi Teraktif
            </h3>
            {/* Chart content */}
          </div>
        </div>
      )}

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

// Komponen StatCard (internal)
const StatCard = ({ title, value, icon, color, isDarkMode, colors }) => {
  return (
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
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color: color }}>{icon}</div>
        </div>
        <span className="text-3xl font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
          {value}
        </span>
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
        {title}
      </h3>
    </div>
  );
};

export default DashboardView;