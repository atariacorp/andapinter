import React from 'react';
import { History } from 'lucide-react';

const HistoryTimeline = ({ history = [] }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <History size={16} className="text-slate-400 dark:text-slate-500"/>
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
          Riwayat Usulan
        </h3>
        <span className="ml-auto text-[8px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
          {history.length} kejadian
        </span>
      </div>
      
      {/* Timeline */}
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-4">
            Belum ada riwayat.
          </p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="flex gap-4 relative">
              
              {/* Connector Line (except last item) */}
              {index !== history.length - 1 && (
                <div className="absolute left-[7px] top-6 w-0.5 h-full bg-slate-200 dark:bg-slate-700"></div>
              )}
              
              {/* Timeline Dot */}
              <div className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 flex-shrink-0 mt-0.5 z-10"></div>
              
              {/* Content */}
              <div className="pb-4">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {String(item.action || 'Aksi')}
                </p>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {String(item.by || 'Sistem')} • {
                    item.date 
                      ? new Date(item.date).toLocaleDateString('id-ID', {
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        }) + ' ' + 
                        new Date(item.date).toLocaleTimeString('id-ID', {
                          hour: '2-digit', 
                          minute: '2-digit'
                        })
                      : 'Tanggal tidak diketahui'
                  }
                </p>
                
                {/* Additional details if available */}
                {item.details && (
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 italic">
                    {item.details}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryTimeline;