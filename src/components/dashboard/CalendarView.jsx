import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';

// --- Komponen Partikel Emas Mengambang (VISUAL ENHANCED) ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 25 + 15,
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
          className="absolute rounded-full bg-gradient-to-br from-[#f9d423] to-[#d7a217] animate-float-particle mix-blend-screen"
          style={{
            width: `${p.size}px`, height: `${p.size}px`,
            left: `${p.left}%`, top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.animDuration}s`,
            animationDelay: `${p.animDelay}s`,
            boxShadow: `0 0 ${p.size * 4}px ${p.size * 1.5}px rgba(215, 162, 23, 0.4)`,
          }}
        />
      ))}
    </div>
  );
};

const CalendarView = ({ proposals, isDarkMode, colors, branding, onDateClick }) => {
  // Gunakan nilai dari branding dengan default
  const deadlineDays = branding?.deadlineDays || 7;
  const urgentColor = branding?.urgentColor || '#ef4444';
  const warningColor = branding?.warningColor || '#d7a217';
  const safeColor = branding?.safeColor || '#10b981';
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Efek mouse parallax lokal
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mendapatkan tahun dan bulan saat ini
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Nama bulan dalam Bahasa Indonesia
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Nama hari dalam Bahasa Indonesia
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Mendapatkan jumlah hari dalam bulan
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Mendapatkan hari pertama dalam bulan (0 = Minggu, 1 = Senin, dst)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Mengelompokkan proposals berdasarkan tanggal
  const proposalsByDate = useMemo(() => {
    const grouped = {};
    
    proposals.forEach(p => {
      const date = p.tanggalSurat || p.createdAt;
      if (!date) return;
      
      const dateKey = date.substring(0, 10); // YYYY-MM-DD
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(p);
    });
    
    return grouped;
  }, [proposals]);

  // Mendapatkan proposals untuk tanggal tertentu
  const getProposalsForDate = (year, month, day) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return proposalsByDate[dateKey] || [];
  };

  // Navigasi bulan sebelumnya
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigasi bulan berikutnya
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Kembali ke bulan saat ini
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Parallax Handler
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 20, y: y * 20 });
  };

  // Render kalender
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    const days = [];

    // Empty cells untuk hari sebelum bulan dimulai
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 md:p-3"></div>);
    }

    // Cells untuk setiap hari dalam bulan
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayProposals = getProposalsForDate(currentYear, currentMonth, day);
      const isToday = isCurrentMonth && day === today.getDate();
      const isSelected = selectedDate === dateKey;
      
      // Hitung statistik untuk hari ini
      const total = dayProposals.length;
      const approved = dayProposals.filter(p => p.status === 'Disetujui').length;
      const pending = dayProposals.filter(p => p.status === 'Pending' || p.status === 'Diverifikasi').length;
      const rejected = dayProposals.filter(p => String(p.status).includes('Ditolak')).length;

      days.push(
        <div
          key={day}
          className={`relative p-2 md:p-3 min-h-[80px] rounded-2xl border backdrop-blur-md transition-all duration-500 cursor-pointer group ${
            isSelected 
              ? 'scale-105 z-10 shadow-[0_10px_25px_rgba(215,162,23,0.3)]' 
              : 'hover:scale-[1.03] hover:z-10 hover:shadow-lg'
          }`}
          style={{ 
            backgroundColor: isSelected 
              ? (isDarkMode ? 'rgba(215, 162, 23, 0.2)' : 'rgba(215, 162, 23, 0.15)')
              : isToday 
                ? (isDarkMode ? 'rgba(66, 92, 90, 0.4)' : 'rgba(66, 92, 90, 0.1)')
                : (isDarkMode ? 'rgba(30, 46, 45, 0.4)' : 'rgba(255, 255, 255, 0.7)'),
            borderColor: isSelected 
              ? colors.gold
              : isToday 
                ? colors.tealMedium
                : (isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.4)')
          }}
          onClick={() => {
            setSelectedDate(dateKey);
            if (onDateClick) {
              onDateClick(dateKey, dayProposals);
            }
          }}
        >
          {/* Ambient Glow for Today/Selected */}
          {(isToday || isSelected) && (
            <div className={`absolute inset-0 blur-xl opacity-20 pointer-events-none rounded-2xl ${isSelected ? 'bg-[#d7a217]' : 'bg-[#425c5a]'}`}></div>
          )}

          {/* Hover Shine Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          <div className={`text-right text-xs md:text-sm font-black mb-2 transition-colors duration-300 relative z-10 ${isSelected || isToday ? 'scale-110 origin-right' : ''}`} 
            style={{ color: isSelected ? colors.gold : (isDarkMode ? colors.tealLight : colors.tealDark) }}>
            {day}
          </div>
          
          {/* ECharts Style Status Dots */}
          {total > 0 && (
            <div className="space-y-1.5 relative z-10">
              {approved > 0 && (
                <div className="flex items-center justify-between gap-1 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: safeColor, color: safeColor }}></div>
                    <span style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }} className="hidden sm:inline">Setuju</span>
                  </div>
                  <span style={{ color: safeColor }}>{approved}</span>
                </div>
              )}
              {pending > 0 && (
                <div className="flex items-center justify-between gap-1 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: warningColor, color: warningColor }}></div>
                    <span style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }} className="hidden sm:inline">Proses</span>
                  </div>
                  <span style={{ color: warningColor }}>{pending}</span>
                </div>
              )}
              {rejected > 0 && (
                <div className="flex items-center justify-between gap-1 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: urgentColor, color: urgentColor }}></div>
                    <span style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }} className="hidden sm:inline">Tolak</span>
                  </div>
                  <span style={{ color: urgentColor }}>{rejected}</span>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Deadline mendatang (5 deadline terdekat)
  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const deadlines = [];
    
    proposals.forEach(p => {
      if (p.status === 'Pending' || p.status === 'Diverifikasi') {
        const proposalDate = p.tanggalSurat || p.createdAt;
        if (!proposalDate) return;
        
        const deadlineDate = new Date(proposalDate);
        deadlineDate.setDate(deadlineDate.getDate() + deadlineDays); // Gunakan nilai dari pengaturan
        
        if (deadlineDate >= today) {
          deadlines.push({
            id: p.id,
            title: p.nomorSurat || 'Usulan',
            skpd: p.skpd,
            deadline: deadlineDate,
            daysLeft: Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
          });
        }
      }
    });
    
    deadlines.sort((a, b) => a.deadline - b.deadline);
    return deadlines.slice(0, 5);
  }, [proposals, deadlineDays]);

  // Fungsi untuk mendapatkan warna berdasarkan sisa hari
  const getDeadlineColors = (daysLeft) => {
    if (daysLeft <= 2) {
      return {
        bg: `${urgentColor}15`,
        border: `${urgentColor}40`,
        text: urgentColor,
        glow: urgentColor
      };
    } else if (daysLeft <= 5) {
      return {
        bg: `${warningColor}15`,
        border: `${warningColor}40`,
        text: warningColor,
        glow: warningColor
      };
    } else {
      return {
        bg: `${safeColor}15`,
        border: `${safeColor}40`,
        text: safeColor,
        glow: safeColor
      };
    }
  };

  return (
    <div 
      className="relative w-full rounded-3xl p-6 md:p-8 overflow-hidden transition-colors duration-500 shadow-sm"
      style={{ 
        backgroundColor: isDarkMode ? 'rgba(20, 30, 29, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.5)'}`
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Background Ambience Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-10 -right-10 w-64 h-64 bg-[#d7a217] blur-[100px] opacity-10 transition-transform duration-300 ease-out"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        ></div>
        <div 
          className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#425c5a] blur-[100px] opacity-10 transition-transform duration-300 ease-out"
          style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
        ></div>
      </div>
      
      <FloatingGoldParticles />

      <div className="relative z-10">
        {/* Header Kalender */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#d7a217] to-[#b8860b] shadow-[0_0_15px_rgba(215,162,23,0.3)]">
              <Calendar size={24} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Kalender Data
              </h3>
              <p className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-60" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                Monitoring Timeline Usulan
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-2xl backdrop-blur-md border shadow-inner" style={{ 
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
            borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.3)'
          }}>
            <button
              onClick={prevMonth}
              className="p-2.5 rounded-xl transition-all duration-300 hover:bg-[#d7a217] hover:text-white group"
              style={{ color: colors.gold }}
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="px-4 py-2 rounded-xl border shadow-sm" style={{ 
              backgroundColor: isDarkMode ? 'rgba(66,92,90,0.4)' : 'rgba(255,255,255,0.8)',
              borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.4)'
            }}>
              <span className="text-sm font-black tracking-widest uppercase" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <span className="text-[#d7a217] mr-1">{monthNames[currentMonth]}</span> {currentYear}
              </span>
            </div>
            
            <button
              onClick={nextMonth}
              className="p-2.5 rounded-xl transition-all duration-300 hover:bg-[#d7a217] hover:text-white group"
              style={{ color: colors.gold }}
            >
              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            
            <button
              onClick={goToToday}
              className="ml-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 hover:scale-105 hover:shadow-[0_0_15px_rgba(215,162,23,0.4)] relative overflow-hidden group/btn"
              style={{ 
                background: `linear-gradient(135deg, ${colors.gold} 0%, #c29115 100%)`,
                color: 'white'
              }}
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-shimmer"></div>
              Hari Ini
            </button>
          </div>
        </div>

        {/* Grid Kalender */}
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {/* Nama Hari */}
          {dayNames.map(day => (
            <div 
              key={day} 
              className="text-center text-[10px] md:text-xs font-black uppercase tracking-[0.2em] py-3 rounded-xl mb-2 backdrop-blur-sm" 
              style={{ 
                color: isDarkMode ? colors.tealLight : colors.tealDark,
                backgroundColor: isDarkMode ? 'rgba(202,223,223,0.05)' : 'rgba(66,92,90,0.05)'
              }}
            >
              {day}
            </div>
          ))}
          
          {/* Tanggal */}
          {renderCalendar()}
        </div>

        {/* Deadline Mendatang */}
        {upcomingDeadlines.length > 0 && (
          <div className="mt-8 pt-6 border-t relative" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(202,223,223,0.3)' }}>
            <h4 className="text-sm font-black mb-4 uppercase tracking-widest flex items-center gap-3" style={{ color: colors.gold }}>
              <div className="p-1.5 rounded-lg bg-[#d7a217]/10">
                <Clock size={18} />
              </div>
              Timeline Deadline Terdekat
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingDeadlines.map((item) => {
                const { bg, border, text, glow } = getDeadlineColors(item.daysLeft);
                
                return (
                  <div
                    key={item.id}
                    className="group/dl relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.03] overflow-hidden backdrop-blur-md"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
                      border: `1px solid ${border}`,
                      boxShadow: `0 4px 20px -5px ${glow}15`
                    }}
                    onClick={() => {
                      if (onDateClick) {
                        onDateClick(item.id, [proposals.find(p => p.id === item.id)]);
                      }
                    }}
                  >
                    {/* Glowing highlight bar on left */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover/dl:w-2" style={{ backgroundColor: text, boxShadow: `0 0 10px ${glow}` }}></div>
                    
                    {/* Shine sweep effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/dl:animate-shimmer pointer-events-none"></div>

                    <div className="pl-3">
                      <p className="text-xs md:text-sm font-black truncate max-w-[150px] md:max-w-[200px]" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                        {item.skpd}
                      </p>
                      <p className="text-[10px] md:text-xs font-bold mt-1 opacity-70 truncate max-w-[150px] md:max-w-[200px]" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                        {item.title}
                      </p>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span 
                        className="text-[10px] md:text-xs font-black px-3 py-1.5 rounded-lg border shadow-inner inline-block"
                        style={{ 
                          backgroundColor: bg,
                          color: text,
                          borderColor: border
                        }}
                      >
                        {item.daysLeft === 0 ? 'HARI INI' : `${item.daysLeft} HARI`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS Animations internal khusus komponen ini */}
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0; }
          20% { opacity: var(--tw-opacity, 0.8); transform: scale(1.2) rotate(45deg); }
          80% { opacity: var(--tw-opacity, 0.8); transform: scale(0.8) rotate(90deg); }
          100% { transform: translateY(-120vh) translateX(100px) scale(1) rotate(180deg); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;