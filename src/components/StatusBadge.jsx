import React from 'react';
import { STATUS_STYLES } from '../../utils/constants';

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