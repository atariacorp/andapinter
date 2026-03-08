import React, { useState, useEffect } from 'react';
import { 
  Building2, Database, Layers, CalendarDays, Users, 
  Palette, FileSpreadsheet, UserCog, Sparkles
} from 'lucide-react';

// Default colors
const defaultColors = {
  tealDark: '#425c5a',
  tealMedium: '#3c5654',
  tealLight: '#e2eceb',
  tealPale: '#cadfdf',
  gold: '#d7a217'
};

// --- Komponen Partikel Emas Khusus Tabs (VISUAL ENHANCED) ---
const TabParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 15 + 10,
      animDelay: Math.random() * -10,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-t-3xl">
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
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(215, 162, 23, 0.5)`,
          }}
        />
      ))}
    </div>
  );
};

const SettingsTabs = ({ 
  activeTab, 
  onTabChange, 
  isDarkMode = false, 
  colors = defaultColors 
}) => {
  const tabs = [
    { id: 'master-skpd', label: 'INSTANSI', icon: <Building2 size={18} />, desc: 'Master SKPD' },
    { id: 'sub-keg', label: 'SUB KEGIATAN', icon: <Database size={18} />, desc: 'Database Sub Kegiatan' },
    { id: 'tahap', label: 'TAHAP', icon: <Layers size={18} />, desc: 'Tahap Pengajuan' },
    { id: 'tahun', label: 'TAHUN', icon: <CalendarDays size={18} />, desc: 'Tahun Anggaran' },
    { id: 'tapd', label: 'TAPD', icon: <UserCog size={18} />, desc: 'Tim Anggaran' },
    { id: 'users', label: 'USER', icon: <Users size={18} />, desc: 'Manajemen User' },
    { id: 'bank_sro', label: 'BANK SRO', icon: <FileSpreadsheet size={18} />, desc: 'Kode Rekening' },
    { id: 'branding', label: 'KUSTOMISASI', icon: <Palette size={18} />, desc: 'Tampilan Aplikasi' }
  ];

  return (
    <div className="relative w-full mb-8 pt-4 animate-in fade-in duration-500 z-20">
      
      {/* Decorative ambient glow behind tabs */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#d7a217]/5 to-transparent pointer-events-none rounded-t-3xl blur-xl"></div>
      
      <TabParticles />

      {/* Premium Track Line / Base */}
      <div 
        className="absolute bottom-[2px] left-0 w-full h-[3px] rounded-full shadow-[0_0_10px_rgba(215,162,23,0.3)] z-0"
        style={{ 
          background: isDarkMode 
            ? `linear-gradient(90deg, transparent, ${colors.gold}40, ${colors.tealMedium}80, transparent)` 
            : `linear-gradient(90deg, transparent, ${colors.gold}60, ${colors.tealPale}, transparent)`
        }}
      />
      
      {/* Tab Container */}
      <div className="flex overflow-x-auto custom-tab-scroll pb-3 pt-2 px-2 md:px-4 gap-3 md:gap-4 snap-x relative z-10">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-shrink-0 px-6 py-4 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group snap-start overflow-hidden text-left border min-w-[180px] md:min-w-[200px] ${
                isActive 
                  ? 'shadow-[0_15px_30px_-5px_rgba(215,162,23,0.3)] scale-105 -translate-y-2' 
                  : 'hover:-translate-y-1 hover:shadow-lg opacity-80 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: isActive 
                  ? (isDarkMode ? 'rgba(60, 86, 84, 0.9)' : 'rgba(255, 255, 255, 0.95)')
                  : (isDarkMode ? 'rgba(26, 43, 41, 0.5)' : 'rgba(255, 255, 255, 0.5)'),
                borderColor: isActive 
                  ? colors.gold 
                  : (isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.1)'),
                backdropFilter: 'blur(12px)'
              }}
            >
              {/* Shine / Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
              
              {/* Active Ambient Inner Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#d7a217]/10 to-transparent pointer-events-none"></div>
              )}

              <div className="flex items-center gap-4 relative z-10">
                <div 
                  className={`p-3 rounded-xl transition-all duration-500 flex items-center justify-center shadow-inner ${
                    isActive 
                      ? 'scale-110 rotate-3' 
                      : 'group-hover:scale-110 group-hover:-rotate-3'
                  }`}
                  style={{ 
                    backgroundColor: isActive ? `${colors.gold}20` : (isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'),
                    color: isActive ? colors.gold : (isDarkMode ? colors.tealPale : colors.tealMedium),
                    border: `1px solid ${isActive ? `${colors.gold}40` : 'transparent'}`
                  }}
                >
                  {tab.icon}
                </div>
                
                <div className="flex flex-col">
                  <p 
                    className="text-xs md:text-sm font-black uppercase tracking-widest transition-colors duration-300 drop-shadow-sm"
                    style={{ 
                      color: isActive 
                        ? (isDarkMode ? '#ffffff' : colors.tealDark) 
                        : (isDarkMode ? colors.tealLight : colors.tealDark)
                    }}
                  >
                    {tab.label}
                  </p>
                  <p 
                    className="text-[10px] md:text-xs font-semibold mt-0.5 transition-colors duration-300 tracking-wide truncate"
                    style={{ 
                      color: isActive 
                        ? colors.gold 
                        : (isDarkMode ? 'rgba(202,223,223,0.6)' : 'rgba(66,92,90,0.6)')
                    }}
                  >
                    {tab.desc}
                  </p>
                </div>
              </div>

              {/* Active Bottom Highlight Line */}
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r shadow-[0_-2px_10px_rgba(215,162,23,0.8)]"
                  style={{ backgroundImage: `linear-gradient(90deg, ${colors.gold}, #f9d423)` }}
                />
              )}

              {/* Sparkles on Active */}
              {isActive && (
                <Sparkles 
                  size={16} 
                  className="absolute top-3 right-3 animate-pulse"
                  style={{ color: colors.gold }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Internal CSS */}
      <style jsx>{`
        /* Smooth Custom Scrollbar for Tabs */
        .custom-tab-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .custom-tab-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-tab-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, transparent, rgba(215, 162, 23, 0.4), transparent);
          border-radius: 10px;
        }
        .custom-tab-scroll:hover::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, rgba(215, 162, 23, 0.2), rgba(215, 162, 23, 0.8), rgba(215, 162, 23, 0.2));
        }

        /* Animations */
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0; }
          20% { opacity: var(--tw-opacity, 0.8); transform: scale(1.2) rotate(45deg); }
          80% { opacity: var(--tw-opacity, 0.8); transform: scale(0.8) rotate(90deg); }
          100% { transform: translateY(-50px) translateX(50px) scale(1) rotate(180deg); opacity: 0; }
        }
        
        .animate-shimmer { animation: shimmer 2s infinite linear; }
        .animate-float-particle { animation: float-particle linear infinite; }
      `}</style>
    </div>
  );
};

export default SettingsTabs;