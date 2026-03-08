import React from 'react';
import { Bell, X, Database } from 'lucide-react';

const NotificationPanel = ({ 
  notifications, 
  onClose, 
  removeNotification,
  setSelectedProposal,
  setView 
}) => {
  return (
    <>
      {/* Panel Container dengan Posisi Baru (Di Kanan Sidebar) & Glassmorphism Advanced */}
      <div 
        className="absolute left-full bottom-0 ml-4 mb-4 w-[320px] sm:w-[380px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-[#d7a217]/30 overflow-hidden z-50 animate-in slide-in-from-left-4 fade-in duration-300"
        style={{
          backgroundColor: 'rgba(30, 46, 45, 0.85)', // Default fallback
        }}
      >
        {/* CSS Background Dinamis bergantung pada tema via Tailwind class */}
        <div className="absolute inset-0 bg-white/95 dark:bg-[#1a2b29]/95 backdrop-blur-3xl z-[-1]"></div>
        
        {/* Ambient Glow Effect di Container */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#d7a217] blur-[80px] opacity-20 pointer-events-none z-[-1]"></div>

        {/* Header Premium */}
        <div className="p-5 bg-gradient-to-r from-[#425c5a] to-[#3c5654] dark:from-[#152322] dark:to-[#1a2b29] relative overflow-hidden flex justify-between items-center shadow-md">
          <div className="absolute inset-0 bg-[#d7a217] blur-2xl opacity-10 pointer-events-none"></div>
          <h3 className="font-black text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-3 text-[#d7a217] relative z-10 drop-shadow-md">
            <div className="p-1.5 rounded-lg bg-black/20 shadow-inner">
              <Bell size={16} className="animate-pulse-slow" /> 
            </div>
            Notifikasi Sistem
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-black/20 text-[#cadfdf] hover:text-white hover:bg-rose-500/80 transition-all duration-300 relative z-10 group"
          >
            <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Daftar Notifikasi */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 custom-scrollbar relative z-10">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                id={`notif-${notif.id}`}
                className={`relative p-4 md:p-5 rounded-2xl border transition-all duration-500 cursor-pointer group overflow-hidden hover:-translate-y-1 hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] ${
                  notif.read 
                    ? 'bg-black/5 dark:bg-white/5 border-transparent hover:border-[#d7a217]/30' 
                    : 'bg-gradient-to-br from-[#d7a217]/10 to-transparent border-[#d7a217]/40 shadow-[0_0_15px_rgba(215,162,23,0.1)]'
                }`}
                onClick={() => {
                  // Aksi saat notifikasi diklik
                  if (notif.data?.id) {
                    if (setSelectedProposal) {
                      setSelectedProposal(notif.data);
                    }
                    if (setView) {
                      setView('detail');
                    }
                    onClose();
                    removeNotification(notif.id);
                  }
                }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#425c5a] dark:text-[#cadfdf] flex items-center gap-2">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#d7a217] animate-pulse shadow-[0_0_8px_#d7a217]"></span>
                    )}
                    {notif.title || notif.type}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 dark:text-[#cadfdf] bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md shadow-inner">
                    {notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : ''}
                  </span>
                </div>
                
                <p className="text-xs md:text-sm font-semibold leading-relaxed text-[#3c5654] dark:text-white/90 mb-4 relative z-10">
                  {notif.message}
                </p>
                
                <div className="flex justify-between items-center pt-3 border-t border-black/5 dark:border-white/10 relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-50 dark:text-[#cadfdf]">
                    {notif.timestamp ? new Date(notif.timestamp).toLocaleDateString('id-ID') : ''}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notif.id);
                    }}
                    className="p-1.5 md:p-2 rounded-lg text-[#425c5a] dark:text-[#cadfdf] opacity-50 hover:opacity-100 hover:bg-rose-500/15 hover:text-rose-500 transition-all duration-300"
                    title="Hapus Notifikasi"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center flex flex-col items-center justify-center h-56">
              <div className="relative w-20 h-20 mb-5">
                <div className="absolute inset-0 bg-[#d7a217] blur-xl opacity-20 rounded-full animate-pulse-slow"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-[#d7a217]/10 border border-[#d7a217]/30 rounded-full shadow-inner backdrop-blur-sm">
                  <Database size={32} className="text-[#d7a217] opacity-80" />
                </div>
              </div>
              <p className="text-xs md:text-sm font-black uppercase tracking-widest text-[#425c5a] dark:text-[#cadfdf] opacity-60">
                Log Notifikasi Bersih
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-[#d7a370]/20 bg-black/5 dark:bg-black/20 flex justify-between items-center relative z-10 backdrop-blur-md">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#425c5a] dark:text-[#cadfdf] opacity-70">
            Total Data: <span className="text-[#d7a217] text-sm ml-1">{notifications.length}</span>
          </span>
          {notifications.length > 0 && (
            <button 
              onClick={() => {
                notifications.forEach(n => removeNotification(n.id));
              }}
              className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-transparent hover:shadow-[0_5px_15px_rgba(225,29,72,0.3)] transition-all duration-300"
            >
              Bersihkan Log
            </button>
          )}
        </div>
      </div>

      {/* Internal CSS Animations Specific to this Panel */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.3); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.6); }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        .animate-shimmer { animation: shimmer 2s infinite linear; }
        .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
      `}</style>
    </>
  );
};

export default NotificationPanel;