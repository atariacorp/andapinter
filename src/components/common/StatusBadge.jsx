import React from 'react';

// Style untuk setiap status
const STATUS_STYLES = {
  'Pending': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50',
  'Diverifikasi': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
  'Disetujui': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
  'Ditolak Operator': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50',
  'Ditolak Admin': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50',
  'Ditolak': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50'
};

const StatusBadge = ({ status }) => {
  const statusKey = String(status || "Pending");
  const style = STATUS_STYLES[statusKey] || STATUS_STYLES['Pending'];
  
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black border uppercase tracking-widest shadow-sm ${style}`}>
      {statusKey}
    </span>
  );
};

export default StatusBadge;