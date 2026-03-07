import React from 'react';

// Style untuk setiap status dengan warna yang diminta
const STATUS_STYLES = {
  'Pending': {
    bg: 'rgba(251, 191, 36, 0.15)', // Amber-400 dengan opacity
    text: '#d97706', // Amber-600
    border: 'rgba(251, 191, 36, 0.3)'
  },
  'Diverifikasi': {
    bg: 'rgba(99, 102, 241, 0.15)', // Indigo-500 dengan opacity
    text: '#4f46e5', // Indigo-600
    border: 'rgba(99, 102, 241, 0.3)'
  },
  'Disetujui': {
    bg: 'rgba(16, 185, 129, 0.15)', // Emerald-500 dengan opacity
    text: '#059669', // Emerald-600
    border: 'rgba(16, 185, 129, 0.3)'
  },
  'Ditolak Operator': {
    bg: 'rgba(244, 63, 94, 0.15)', // Rose-500 dengan opacity
    text: '#e11d48', // Rose-600
    border: 'rgba(244, 63, 94, 0.3)'
  },
  'Ditolak Admin': {
    bg: 'rgba(244, 63, 94, 0.15)', // Rose-500 dengan opacity
    text: '#e11d48', // Rose-600
    border: 'rgba(244, 63, 94, 0.3)'
  },
  'Ditolak': {
    bg: 'rgba(244, 63, 94, 0.15)', // Rose-500 dengan opacity
    text: '#e11d48', // Rose-600
    border: 'rgba(244, 63, 94, 0.3)'
  }
};

const StatusBadge = ({ status }) => {
  const statusKey = String(status || "Pending");
  const style = STATUS_STYLES[statusKey] || STATUS_STYLES['Pending'];
  
  return (
    <span 
      className="px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm inline-flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:shadow-md"
      style={{ 
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`
      }}
    >
      {statusKey}
    </span>
  );
};

export default StatusBadge;