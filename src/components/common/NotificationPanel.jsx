import React from 'react';
import { Bell, X } from 'lucide-react';

const NotificationPanel = ({ 
  notifications, 
  onClose, 
  removeNotification,
  setSelectedProposal,
  setView 
}) => {
  return (
    <div className="absolute left-64 top-auto bottom-20 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center">
        <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <Bell size={14} /> NOTIFIKASI
        </h3>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <X size={14} />
        </button>
      </div>
      
      {/* Daftar Notifikasi */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              id={`notif-${notif.id}`}
              className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer ${
                notif.read ? 'opacity-60' : 'bg-blue-50/30 dark:bg-blue-900/10'
              }`}
              onClick={() => {
                // Aksi saat notifikasi diklik
                if (notif.data?.id) {
                  // Cari proposal berdasarkan ID
                  // Ini akan dihandle oleh parent component
                  if (setSelectedProposal) {
                    setSelectedProposal(notif.data);
                  }
                  if (setView) {
                    setView('detail');
                  }
                  onClose();
                  
                  // Tandai sebagai dibaca
                  removeNotification(notif.id);
                }
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase">
                  {notif.title || notif.type}
                </span>
                <span className="text-[8px] text-slate-400">
                  {notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : ''}
                </span>
              </div>
              <p className="text-[10px] text-slate-700 dark:text-slate-300 mb-2">
                {notif.message}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-slate-400">
                  {notif.timestamp ? new Date(notif.timestamp).toLocaleDateString('id-ID') : ''}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notif.id);
                  }}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 italic text-xs">
            <Bell size={24} className="mx-auto mb-2 opacity-30" />
            <p>Belum ada notifikasi</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-between text-[8px] text-slate-400">
        <span>{notifications.length} notifikasi</span>
        {notifications.length > 0 && (
          <button 
            onClick={() => {
              // Hapus semua notifikasi
              notifications.forEach(n => removeNotification(n.id));
            }}
            className="text-rose-600 hover:text-rose-700"
          >
            Hapus Semua
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;