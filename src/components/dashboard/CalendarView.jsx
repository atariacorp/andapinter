import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const CalendarView = ({ proposals, isDarkMode, colors, branding, onDateClick }) => {
  // Gunakan nilai dari branding dengan default
  const deadlineDays = branding?.deadlineDays || 7;
  const urgentColor = branding?.urgentColor || '#ef4444';
  const warningColor = branding?.warningColor || '#d7a217';
  const safeColor = branding?.safeColor || '#10b981';
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

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

  // Render kalender
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    const days = [];

    // Empty cells untuk hari sebelum bulan dimulai
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
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
          className={`p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 ${
            isSelected ? 'ring-2' : ''
          }`}
          style={{ 
            backgroundColor: isSelected 
              ? `${colors.gold}30`
              : isToday 
                ? `${colors.tealDark}20`
                : 'transparent',
            borderColor: isSelected 
              ? colors.gold
              : isToday 
                ? colors.tealDark
                : colors.tealPale
          }}
          onClick={() => {
            setSelectedDate(dateKey);
            if (onDateClick) {
              onDateClick(dateKey, dayProposals);
            }
          }}
        >
          <div className="text-right text-sm font-bold mb-1" style={{ color: colors.tealDark }}>
            {day}
          </div>
          
          {total > 0 && (
            <div className="space-y-1">
              {approved > 0 && (
                <div className="flex items-center gap-1 text-[8px]">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: safeColor }}></div>
                  <span style={{ color: colors.tealMedium }}>{approved}</span>
                </div>
              )}
              {pending > 0 && (
                <div className="flex items-center gap-1 text-[8px]">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: warningColor }}></div>
                  <span style={{ color: colors.tealMedium }}>{pending}</span>
                </div>
              )}
              {rejected > 0 && (
                <div className="flex items-center gap-1 text-[8px]">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: urgentColor }}></div>
                  <span style={{ color: colors.tealMedium }}>{rejected}</span>
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
        bg: `${urgentColor}20`,
        text: urgentColor
      };
    } else if (daysLeft <= 5) {
      return {
        bg: `${warningColor}20`,
        text: warningColor
      };
    } else {
      return {
        bg: `${safeColor}20`,
        text: safeColor
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Kalender */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
          <Calendar size={20} style={{ color: colors.gold }} />
          Kalender Deadline
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg transition-all hover:scale-110"
            style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold px-3 py-1 rounded-lg" style={{ 
            backgroundColor: `${colors.tealDark}20`,
            color: colors.tealDark
          }}>
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg transition-all hover:scale-110"
            style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
              color: 'white'
            }}
          >
            Hari Ini
          </button>
        </div>
      </div>

      {/* Grid Kalender */}
      <div className="grid grid-cols-7 gap-2">
        {/* Nama Hari */}
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-bold py-2" style={{ color: colors.tealMedium }}>
            {day}
          </div>
        ))}
        
        {/* Tanggal */}
        {renderCalendar()}
      </div>

      {/* Deadline Mendatang */}
      {upcomingDeadlines.length > 0 && (
        <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.tealPale }}>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: colors.gold }}>
            <Clock size={16} />
            Deadline Mendatang
          </h4>
          
          <div className="space-y-2">
            {upcomingDeadlines.map((item) => {
              const { bg, text } = getDeadlineColors(item.daysLeft);
              
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:scale-[1.02] transition-all"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                    border: `1px solid ${colors.tealPale}`
                  }}
                  onClick={() => {
                    if (onDateClick) {
                      onDateClick(item.id, [proposals.find(p => p.id === item.id)]);
                    }
                  }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.tealDark }}>
                      {item.skpd}
                    </p>
                    <p className="text-xs" style={{ color: colors.tealMedium }}>
                      {item.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <span 
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: bg,
                        color: text
                      }}
                    >
                      {item.daysLeft === 0 ? 'Hari ini' : `${item.daysLeft} hari lagi`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;