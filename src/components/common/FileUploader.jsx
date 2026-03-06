import React from 'react';
import { Upload, FileCheck, Trash2, Download, X } from 'lucide-react';

const FileUploader = ({ 
  file, 
  onUpload, 
  onRemove,
  uploading,
  uploadProgress,
  error,
  disabled 
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
        
        <div className={`w-full p-4 border-2 border-dashed rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 outline-none flex flex-col items-center justify-center transition-colors ${
          file 
            ? 'border-green-300 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' 
            : 'border-blue-300 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-500'
        }`}>

          {uploading ? (
            // Progress Upload
            <div className="w-full text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                Mengupload... {Math.round(uploadProgress)}%
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : file ? (
            // File sudah terupload
            <div className="w-full text-center">
              {/* Indikator Jenis File */}
              <div className="flex items-center justify-between w-full mb-3">
                <span className={`text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                  file.type === 'application/pdf' 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' 
                    : file.type?.startsWith('image/')
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                }`}>
                  {file.type === 'application/pdf' ? '📄 PDF' : 
                   file.type?.startsWith('image/') ? '🖼️ GAMBAR' : 
                   '📎 FILE'}
                </span>
                <span className="text-[8px] text-slate-400 dark:text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              
              <FileCheck size={32} className="mx-auto mb-2 text-green-500" />
              <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-1 truncate max-w-full">
                {file.name}
              </p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mb-3">
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
                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  <Download size={12} /> LIHAT
                </a>
                <button
                  type="button"
                  onClick={onRemove}
                  className="px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 hover:bg-rose-200 dark:hover:bg-rose-800 transition-colors"
                >
                  <Trash2 size={12} /> HAPUS
                </button>
              </div>
            </div>
          ) : (
            // Belum ada file
            <>
              <Upload size={32} className="mx-auto mb-2 text-blue-400" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Pilih File PDF / Gambar
              </p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500">
                Maksimal 2MB • Format: PDF, JPG, PNG
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-[9px] text-rose-600 dark:text-rose-400">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;