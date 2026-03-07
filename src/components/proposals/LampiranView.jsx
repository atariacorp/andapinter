import React from 'react';
import { Paperclip, FileText, Download, Eye, FileDigit } from 'lucide-react';

const LampiranView = ({ lampiran, isDarkMode, colors }) => {
  if (!lampiran) return null;

  const getFileIcon = () => {
    if (lampiran.type === 'application/pdf') {
      return <FileText size={24} className="text-[#d7a217]" />;
    } else if (lampiran.type?.startsWith('image/')) {
      return <Eye size={24} className="text-[#d7a217]" />;
    }
    return <FileDigit size={24} className="text-[#d7a217]" />;
  };

  const getFileTypeLabel = () => {
    if (lampiran.type === 'application/pdf') return 'PDF Document';
    if (lampiran.type?.startsWith('image/')) return 'Image File';
    return 'Attachment File';
  };

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:shadow-xl group/lampiran relative overflow-hidden ${
      isDarkMode 
        ? 'bg-[#3c5654]/40 border-[#cadfdf]/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]' 
        : 'bg-white/60 border-[#cadfdf]/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
    }`}>
      
      {/* Background Aesthetic ECharts (Subtle Grid) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      />
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-24 h-24 bg-[#d7a217]/10 rounded-full blur-[40px] pointer-events-none group-hover/lampiran:bg-[#d7a217]/20 transition-colors duration-500"></div>

      <div className="relative z-10">
        <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-[#d7a217]">
          <Paperclip size={14} /> Dokumen Lampiran
        </h4>
        
        <div 
          className={`flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl border transition-all duration-300 transform group-hover/lampiran:-translate-y-1 group-hover/lampiran:shadow-md ${
            isDarkMode 
              ? 'bg-black/20 border-[#cadfdf]/10 group-hover/lampiran:border-[#d7a217]/40' 
              : 'bg-white/80 border-[#cadfdf]/40 group-hover/lampiran:border-[#d7a217]/50'
          }`}
        >
          {/* File Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#d7a217]/10 flex items-center justify-center shadow-inner group-hover/lampiran:scale-105 transition-transform duration-500">
              {getFileIcon()}
            </div>
            <div>
              <p className={`text-sm font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-sm ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#425c5a]'}`}>
                {lampiran.name || 'File Lampiran Tidak Diketahui'}
              </p>
              
              <div className="flex items-center flex-wrap gap-2 mt-1.5">
                <span 
                  className="text-[9px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider shadow-sm"
                  style={{ backgroundColor: '#d7a21720', color: '#d7a217', border: '1px solid #d7a21740' }}
                >
                  {getFileTypeLabel()}
                </span>
                
                <span className={`text-[10px] font-medium flex items-center gap-1 ${isDarkMode ? 'text-[#cadfdf]/70' : 'text-[#3c5654]/70'}`}>
                  <span className="w-1 h-1 rounded-full bg-[#cadfdf] dark:bg-[#3c5654]"></span>
                  {lampiran.size ? `${(lampiran.size / 1024).toFixed(1)} KB` : 'Ukuran tidak diketahui'}
                </span>
                
                {lampiran.uploadedAt && (
                  <span className={`text-[10px] font-medium flex items-center gap-1 ${isDarkMode ? 'text-[#cadfdf]/70' : 'text-[#3c5654]/70'}`}>
                    <span className="w-1 h-1 rounded-full bg-[#cadfdf] dark:bg-[#3c5654]"></span>
                    {new Date(lampiran.uploadedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            {lampiran.type?.startsWith('image/') && (
              <button
                onClick={() => window.open(lampiran.url, '_blank')}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-[#3c5654]/60 text-[#cadfdf] border border-[#cadfdf]/20 hover:bg-[#3c5654]' 
                    : 'bg-[#cadfdf]/30 text-[#425c5a] border border-[#cadfdf]/60 hover:bg-[#cadfdf]/50'
                }`}
              >
                <Eye size={14} /> LIHAT
              </button>
            )}

            <a 
              href={lampiran.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-md shadow-[#d7a217]/20 bg-gradient-to-br from-[#d7a217] to-[#c29115] text-white"
            >
              <Download size={14} /> UNDUH
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LampiranView;