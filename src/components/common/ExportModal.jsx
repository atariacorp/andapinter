import React, { useState } from 'react';
import { 
  FileText, FileSpreadsheet, Download, X, Calendar,
  Filter, CheckCircle, AlertCircle
} from 'lucide-react';

const ExportModal = ({ 
  show, 
  onClose, 
  onExport,
  isDarkMode,
  colors,
  totalData 
}) => {
  const [exportType, setExportType] = useState('excel');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!show) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({
        type: exportType,
        dateRange,
        includeDetails
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="max-w-md w-full rounded-2xl overflow-hidden"
        style={{ 
          backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${colors.tealPale}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-6 border-b flex justify-between items-center"
          style={{ 
            borderColor: colors.tealPale,
            background: `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`
          }}
        >
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Download size={20} />
            Export Data
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Info Total Data */}
          <div 
            className="p-4 rounded-xl flex items-center gap-3"
            style={{ 
              backgroundColor: `${colors.gold}10`,
              border: `1px solid ${colors.gold}30`
            }}
          >
            <FileText size={20} style={{ color: colors.gold }} />
            <div>
              <p className="text-sm font-bold" style={{ color: colors.tealDark }}>
                Total Data: {totalData} usulan
              </p>
              <p className="text-xs" style={{ color: colors.tealMedium }}>
                Data akan diekspor sesuai filter yang diterapkan
              </p>
            </div>
          </div>

          {/* Pilih Format Export */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1" style={{ color: colors.tealDark }}>
              <FileText size={14} style={{ color: colors.gold }} />
              Format File
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportType('excel')}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105 ${
                  exportType === 'excel' ? 'ring-2' : ''
                }`}
                style={{ 
                  backgroundColor: exportType === 'excel' 
                    ? `${colors.gold}20`
                    : isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                  border: `1px solid ${exportType === 'excel' ? colors.gold : colors.tealPale}`,
                  ringColor: colors.gold
                }}
              >
                <FileSpreadsheet size={24} style={{ color: exportType === 'excel' ? colors.gold : colors.tealMedium }} />
                <span className="text-xs font-bold" style={{ color: exportType === 'excel' ? colors.gold : colors.tealDark }}>
                  Excel (CSV)
                </span>
              </button>
              
              <button
                onClick={() => setExportType('pdf')}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105 ${
                  exportType === 'pdf' ? 'ring-2' : ''
                }`}
                style={{ 
                  backgroundColor: exportType === 'pdf' 
                    ? `${colors.gold}20`
                    : isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                  border: `1px solid ${exportType === 'pdf' ? colors.gold : colors.tealPale}`,
                  ringColor: colors.gold
                }}
              >
                <FileText size={24} style={{ color: exportType === 'pdf' ? colors.gold : colors.tealMedium }} />
                <span className="text-xs font-bold" style={{ color: exportType === 'pdf' ? colors.gold : colors.tealDark }}>
                  PDF (Dokumen)
                </span>
              </button>
            </div>
          </div>

          {/* Filter Tanggal (Opsional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1" style={{ color: colors.tealDark }}>
              <Calendar size={14} style={{ color: colors.gold }} />
              Filter Tanggal (Opsional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="p-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                  border: `1px solid ${colors.tealPale}`,
                  color: colors.tealDark,
                  focusRing: colors.gold
                }}
                placeholder="Dari Tanggal"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="p-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                  border: `1px solid ${colors.tealPale}`,
                  color: colors.tealDark,
                  focusRing: colors.gold
                }}
                placeholder="Sampai Tanggal"
              />
            </div>
          </div>

          {/* Opsi Detail */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeDetails"
              checked={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: colors.gold }}
            />
            <label htmlFor="includeDetails" className="text-sm" style={{ color: colors.tealDark }}>
              Sertakan detail rincian SRO
            </label>
          </div>

          {/* Peringatan */}
          <div 
            className="p-3 rounded-xl flex items-start gap-2 text-xs"
            style={{ 
              backgroundColor: '#ef444410',
              border: '1px solid #ef444430'
            }}
          >
            <AlertCircle size={14} className="text-[#ef4444] shrink-0 mt-0.5" />
            <span style={{ color: '#ef4444' }}>
              Pastikan data yang akan diekspor sudah sesuai. Proses export mungkin memakan waktu beberapa saat.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-4 border-t flex justify-end gap-3"
          style={{ borderColor: colors.tealPale }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105"
            style={{ 
              backgroundColor: isDarkMode ? colors.tealMedium : colors.tealPale,
              color: isDarkMode ? colors.tealLight : colors.tealDark
            }}
          >
            Batal
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
              color: 'white'
            }}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                MEMPROSES...
              </>
            ) : (
              <>
                <Download size={14} />
                EXPORT {exportType === 'excel' ? 'EXCEL' : 'PDF'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;