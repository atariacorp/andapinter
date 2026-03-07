import React, { useState, useEffect } from 'react';
import { History, Clock } from 'lucide-react';

const HistoryTimeline = ({ history = [], isDarkMode, colors }) => {
  // State untuk efek partikel emas khusus komponen ini
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 15 + 10,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden backdrop-blur-xl border transition-all duration-500 hover:shadow-2xl hover:shadow-[#d7a217]/10 group/timeline ${
        isDarkMode 
          ? 'bg-[#3c5654]/40 border-[#cadfdf]/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
          : 'bg-white/60 border-[#cadfdf]/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Background Aesthetic ECharts (Subtle Grid) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      />
      
      {/* Floating Gold Particles Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#d7a217] animate-float-history"
            style={{
              width: `${p.size}px`, height: `${p.size}px`,
              left: `${p.left}%`, top: `${p.top}%`,
              opacity: p.opacity,
              animationDuration: `${p.animDuration}s`,
              animationDelay: `${p.animDelay}s`,
              boxShadow: `0 0 ${p.size * 2}px #d7a217`,
            }}
          />
        ))}
      </div>

      {/* Header Glassmorphism */}
      <div className={`relative z-10 p-5 border-b flex items-center gap-3 backdrop-blur-md transition-colors ${
        isDarkMode ? 'bg-[#3c5654]/60 border-[#cadfdf]/10' : 'bg-white/50 border-[#cadfdf]/50'
      }`}>
        <div className="w-8 h-8 rounded-lg bg-[#d7a217]/20 flex items-center justify-center text-[#d7a217] shadow-inner">
          <History size={16} />
        </div>
        <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#425c5a]'}`}>
          Riwayat Usulan
        </h3>
        <span 
          className="ml-auto text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm"
          style={{ backgroundColor: '#d7a21720', color: '#d7a217', border: '1px solid #d7a21740' }}
        >
          {history.length} Kejadian
        </span>
      </div>
      
      {/* Timeline Content */}
      <div className="relative z-10 p-6 max-h-[400px] overflow-y-auto custom-history-scroll">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 opacity-70 animate-in fade-in duration-700">
            <History size={32} className="mb-3 text-[#d7a217] opacity-50" />
            <p className={`text-xs italic font-medium ${isDarkMode ? 'text-[#cadfdf]' : 'text-[#3c5654]'}`}>
              Belum ada riwayat tercatat.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item, index) => (
              <div key={index} className="flex gap-4 relative group/item animate-in slide-in-from-bottom-2 duration-300">
                
                {/* Connector Line (Glowing on Hover) */}
                {index !== history.length - 1 && (
                  <div 
                    className={`absolute left-[11px] top-8 w-[2px] h-[calc(100%+16px)] transition-all duration-500 ${
                      isDarkMode ? 'bg-[#cadfdf]/20' : 'bg-[#cadfdf]/60'
                    } group-hover/item:bg-[#d7a217] group-hover/item:shadow-[0_0_8px_#d7a217]`}
                  />
                )}
                
                {/* Timeline Dot (Pulsing / Glowing) */}
                <div className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center bg-[#d7a217]/20 shrink-0 mt-1 transition-transform duration-500 group-hover/item:scale-125">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#d7a217] shadow-[0_0_8px_#d7a217]" />
                </div>
                
                {/* Content Card (Parallax Hover) */}
                <div 
                  className={`flex-1 p-4 rounded-xl border transition-all duration-300 transform group-hover/item:-translate-y-1 group-hover/item:shadow-lg ${
                    isDarkMode 
                      ? 'bg-[#3c5654]/60 border-[#cadfdf]/10 group-hover/item:bg-[#3c5654]/80 group-hover/item:border-[#d7a217]/40' 
                      : 'bg-white/80 border-[#cadfdf]/40 group-hover/item:bg-white group-hover/item:border-[#d7a217]/40'
                  }`}
                >
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#425c5a]'}`}>
                    {String(item.action || 'Aksi Sistem')}
                  </p>
                  
                  <div className={`flex items-center gap-1.5 mt-1.5 text-[10px] font-medium ${isDarkMode ? 'text-[#cadfdf]/80' : 'text-[#3c5654]/80'}`}>
                    <span className="font-bold text-[#d7a217]">{String(item.by || 'Sistem')}</span>
                    <span>•</span>
                    <Clock size={10} className="opacity-70" />
                    <span>
                      {item.date 
                        ? `${new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} ${new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                        : 'Waktu tidak diketahui'
                      }
                    </span>
                  </div>
                  
                  {/* Additional details (Terminal aesthetic) */}
                  {item.details && (
                    <div className={`mt-3 p-2.5 rounded-lg border-l-2 border-[#d7a217] text-[10px] italic leading-relaxed ${
                      isDarkMode ? 'bg-black/20 text-[#cadfdf]' : 'bg-[#e2eceb]/50 text-[#3c5654]'
                    }`}>
                      "{item.details}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internal CSS for Animations and Custom Scrollbar */}
      <style jsx>{`
        @keyframes float-history {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: var(--opacity, 0.4); }
          80% { opacity: var(--opacity, 0.4); }
          100% { transform: translateY(-60px) translateX(20px) scale(0.8); opacity: 0; }
        }
        .animate-float-history {
          animation-name: float-history;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        
        /* Custom Scrollbar for ECharts Aesthetic */
        .custom-history-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-history-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-history-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.3);
          border-radius: 10px;
        }
        .custom-history-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.6);
        }
      `}</style>
    </div>
  );
};

export default HistoryTimeline;