import React from 'react';
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

const SettingsTabs = ({ 
  activeTab, 
  onTabChange, 
  isDarkMode = false, 
  colors = defaultColors 
}) => {
  const tabs = [
    { id: 'master-skpd', label: 'INSTANSI', icon: <Building2 size={16} />, desc: 'Master SKPD' },
    { id: 'sub-keg', label: 'SUB KEGIATAN', icon: <Database size={16} />, desc: 'Database Sub Kegiatan' },
    { id: 'tahap', label: 'TAHAP', icon: <Layers size={16} />, desc: 'Tahap Pengajuan' },
    { id: 'tahun', label: 'TAHUN', icon: <CalendarDays size={16} />, desc: 'Tahun Anggaran' },
    { id: 'tapd', label: 'TAPD', icon: <UserCog size={16} />, desc: 'Tim Anggaran' },
    { id: 'users', label: 'USER', icon: <Users size={16} />, desc: 'Manajemen User' },
    { id: 'bank_sro', label: 'BANK SRO', icon: <FileSpreadsheet size={16} />, desc: 'Kode Rekening' },
    { id: 'branding', label: 'KUSTOMISASI', icon: <Palette size={16} />, desc: 'Tampilan Aplikasi' }
  ];

  return (
    <div className="relative">
      {/* Decorative line */}
      <div 
        className="absolute bottom-0 left-0 w-full h-px"
        style={{ backgroundColor: isDarkMode ? `${colors.gold}20` : colors.tealPale }}
      />
      
      <div className="flex overflow-x-auto scrollbar-hide pb-2 gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-shrink-0 px-5 py-3 rounded-t-2xl transition-all duration-300 group ${
              activeTab === tab.id 
                ? 'shadow-lg scale-105' 
                : 'hover:translate-y-[-2px]'
            }`}
            style={{ 
              backgroundColor: activeTab === tab.id 
                ? isDarkMode ? `${colors.tealMedium}` : 'white'
                : 'transparent',
              borderBottom: activeTab === tab.id 
                ? `3px solid ${colors.gold}`
                : '3px solid transparent'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className={`transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'scale-110' 
                    : 'group-hover:scale-110'
                }`}
                style={{ 
                  color: activeTab === tab.id 
                    ? colors.gold 
                    : isDarkMode ? colors.tealLight : colors.tealDark
                }}
              >
                {tab.icon}
              </div>
              <div className="text-left">
                <p 
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ 
                    color: activeTab === tab.id 
                      ? colors.tealDark 
                      : isDarkMode ? colors.tealLight : colors.tealDark
                  }}
                >
                  {tab.label}
                </p>
                <p 
                  className="text-[8px] font-medium mt-0.5"
                  style={{ 
                    color: activeTab === tab.id 
                      ? colors.tealMedium 
                      : isDarkMode ? `${colors.tealLight}80` : `${colors.tealMedium}80`
                  }}
                >
                  {tab.desc}
                </p>
              </div>
              {activeTab === tab.id && (
                <Sparkles 
                  size={12} 
                  className="absolute top-2 right-2 animate-pulse"
                  style={{ color: colors.gold }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsTabs;