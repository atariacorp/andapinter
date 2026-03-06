import React from 'react';
import { Paperclip, FileText, Download, Eye } from 'lucide-react';

const LampiranView = ({ lampiran }) => {
  if (!lampiran) return null;

  const getFileIcon = () => {
    if (lampiran.type === 'application/pdf') {
      return <FileText size={24} className="text-red-500" />;
    } else if (lampiran.type?.startsWith('image/')) {
      return <Eye size={24} className="text-green-500" />;
    }
    return <Paperclip size={24} className="text-blue-500" />;
  };

  const getFileTypeLabel = () => {
    if (lampiran.type === 'application/pdf') return 'PDF';
    if (lampiran.type?.startsWith('image/')) return 'GAMBAR';
    return 'FILE';
  };

  return (
    <div className="col-span-full pt-4 border-t border-slate-100 dark:border-slate-700">
      <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">
        <Paperclip size={14} className="inline mr-1" /> DOKUMEN LAMPIRAN
      </h4>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between flex-wrap gap-3">
          
          {/* File Info */}
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lampiran.name || 'File Lampiran'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${
                  lampiran.type === 'application/pdf' 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                    : lampiran.type?.startsWith('image/')
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {getFileTypeLabel()}
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">
                  {lampiran.size ? `${(lampiran.size / 1024).toFixed(1)} KB` : 'Ukuran tidak diketahui'}
                </span>
                {lampiran.uploadedAt && (
                  <span className="text-[9px] text-slate-500 dark:text-slate-400">
                    • {new Date(lampiran.uploadedAt).toLocaleDateString('id-ID')}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <a 
              href={lampiran.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-colors"
            >
              <Download size={14} /> BUKA LAMPIRAN
            </a>
            
            {lampiran.type?.startsWith('image/') && (
              <button
                onClick={() => {
                  // Bisa ditambahkan fungsi untuk preview modal
                  window.open(lampiran.url, '_blank');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-colors"
              >
                <Eye size={14} /> PREVIEW
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LampiranView;