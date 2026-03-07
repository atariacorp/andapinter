import React from 'react';
import { Upload, FileCheck, Trash2, Download, X } from 'lucide-react';

const FileUploader = ({ 
  file, 
  onUpload, 
  onRemove,
  uploading,
  uploadProgress,
  error,
  disabled,
  isDarkMode,
  colors
}) => {
  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="relative">
        <input 
          type="file" 
          accept=".pdf,.jpg,.jpeg,.png" 
          onChange={onUpload} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          title="Klik untuk upload file"
          disabled={uploading || disabled}
        />
        
        <div 
          className={`w-full p-4 border-2 border-dashed rounded-xl outline-none flex flex-col items-center justify-center transition-all ${
            file ? 'border-opacity-50' : 'hover:border-opacity-70'
          }`}
          style={{ 
            borderColor: file ? colors.gold : colors.tealPale,
            backgroundColor: file 
              ? `${colors.gold}10` 
              : (isDarkMode ? 'rgba(60, 86, 84, 0.2)' : 'rgba(255, 255, 255, 0.5)')
          }}
        >

          {uploading ? (
            // Progress Upload
            <div className="w-full text-center">
              <div 
                className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2"
                style={{ borderColor: colors.gold }}
              ></div>
              <p className="text-xs font-medium mb-2" style={{ color: colors.tealMedium }}>
                Mengupload... {Math.round(uploadProgress)}%
              </p>
              <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: colors.tealPale }}>
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${uploadProgress}%`,
                    backgroundColor: colors.gold
                  }}
                ></div>
              </div>
            </div>
          ) : file ? (
            // File sudah terupload
            <div className="w-full text-center">
              {/* Indikator Jenis File */}
              <div className="flex items-center justify-between w-full mb-3">
                <span 
                  className="text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-wider"
                  style={{ 
                    backgroundColor: `${colors.gold}20`,
                    color: colors.gold,
                    border: `1px solid ${colors.gold}40`
                  }}
                >
                  {file.type === 'application/pdf' ? '📄 PDF' : 
                   file.type?.startsWith('image/') ? '🖼️ GAMBAR' : 
                   '📎 FILE'}
                </span>
                <span className="text-[8px]" style={{ color: colors.tealMedium }}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              
              <FileCheck size={32} className="mx-auto mb-2" style={{ color: colors.gold }} />
              <p className="text-xs font-bold mb-1 truncate max-w-full" style={{ color: colors.tealDark }}>
                {file.name}
              </p>
              <p className="text-[9px] mb-3" style={{ color: colors.tealMedium }}>
                {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'Baru saja'}
              </p>
              <div className="flex gap-2 justify-center">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: `${colors.tealDark}20`,
                    color: colors.tealDark
                  }}
                >
                  <Download size={12} /> LIHAT
                </a>
                <button
                  type="button"
                  onClick={onRemove}
                  className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: `${colors.gold}20`,
                    color: colors.gold
                  }}
                >
                  <Trash2 size={12} /> HAPUS
                </button>
              </div>
            </div>
          ) : (
            // Belum ada file
            <>
              <Upload size={32} className="mx-auto mb-2" style={{ color: colors.gold }} />
              <p className="text-xs font-bold mb-1" style={{ color: colors.tealDark }}>
                Pilih File PDF / Gambar
              </p>
              <p className="text-[9px]" style={{ color: colors.tealMedium }}>
                Maksimal 2MB • Format: PDF, JPG, PNG
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="p-2 rounded-lg text-[9px]"
          style={{ 
            backgroundColor: '#ef444420',
            border: '1px solid #ef444440',
            color: '#b91c1c'
          }}
        >
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;