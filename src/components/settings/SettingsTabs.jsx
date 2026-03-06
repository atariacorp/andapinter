import React from 'react';
import { 
  Building2, Database, Layers, CalendarDays, Users, 
  Palette, FileSpreadsheet, UserCog, Settings 
} from 'lucide-react';

const SettingsTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'master-skpd', label: 'DATABASE INSTANSI', icon: <Building2 size={14} /> },
    { id: 'sub-keg', label: 'DATABASE SUB KEG', icon: <Database size={14} /> },
    { id: 'tahap', label: 'TAHAP PENGAJUAN', icon: <Layers size={14} /> },
    { id: 'tahun', label: 'TAHUN ANGGARAN', icon: <CalendarDays size={14} /> },
    { id: 'tapd', label: 'TAPD', icon: <UserCog size={14} /> },
    { id: 'users', label: 'MANAJEMEN USER', icon: <Users size={14} /> },
    { id: 'bank_sro', label: 'BANK SRO', icon: <FileSpreadsheet size={14} /> },
    { id: 'branding', label: 'KUSTOMISASI', icon: <Palette size={14} /> }
  ];

  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700 gap-8 mb-6 overflow-x-auto scrollbar-hide">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-4 text-[10px] font-black relative whitespace-nowrap uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
            activeTab === tab.id 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          {tab.icon}
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabs;