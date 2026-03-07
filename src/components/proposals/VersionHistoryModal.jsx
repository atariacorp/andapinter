import React from 'react';
import { History, Clock, User, FileText, X, ChevronRight } from 'lucide-react';

const VersionHistoryModal = ({ show, onClose, proposal, isDarkMode, colors }) => {
  if (!show || !proposal) return null;

  // Gabungkan history dengan versi saat ini
  const allVersions = [
    ...(proposal.history || []).map((h, idx) => ({
      ...h,
      isCurrent: false,
      version: proposal.history.length - idx
    })),
    {
      action: 'Versi Saat Ini',
      by: proposal.updatedBy || proposal.createdBy || 'System',
      date: proposal.updatedAt || proposal.createdAt,
      details: proposal,
      isCurrent: true,
      version: 'Sekarang'
    }
  ].reverse();

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="max-w-2xl w-full rounded-2xl overflow-hidden"
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
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20">
              <History size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Riwayat Versi</h3>
              <p className="text-white/80 text-xs mt-1">
                {proposal.nomorSurat || 'Usulan'} - {proposal.skpd}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="relative">
            {/* Garis vertikal timeline */}
            <div 
              className="absolute left-4 top-0 bottom-0 w-0.5"
              style={{ backgroundColor: colors.tealPale }}
            />

            {/* Daftar versi */}
            <div className="space-y-6">
              {allVersions.map((version, idx) => (
                <div key={idx} className="relative flex gap-4">
                  {/* Dot timeline */}
                  <div 
                    className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      version.isCurrent ? 'animate-pulse' : ''
                    }`}
                    style={{ 
                      backgroundColor: version.isCurrent ? colors.gold : `${colors.tealDark}20`,
                      border: `2px solid ${version.isCurrent ? colors.gold : colors.tealDark}`
                    }}
                  >
                    {version.isCurrent ? (
                      <FileText size={14} className="text-white" />
                    ) : (
                      <span className="text-xs font-bold" style={{ color: colors.tealDark }}>
                        {version.version}
                      </span>
                    )}
                  </div>

                  {/* Konten */}
                  <div className="flex-1 pl-12">
                    <div 
                      className={`p-4 rounded-xl ${
                        version.isCurrent ? 'border-2' : 'border'
                      }`}
                      style={{ 
                        backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                        borderColor: version.isCurrent ? colors.gold : colors.tealPale
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold" style={{ color: version.isCurrent ? colors.gold : colors.tealDark }}>
                          {version.action}
                        </h4>
                        <span 
                          className="text-[9px] px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: version.isCurrent ? `${colors.gold}20` : `${colors.tealDark}20`,
                            color: version.isCurrent ? colors.gold : colors.tealDark
                          }}
                        >
                          {version.isCurrent ? 'Aktif' : `Versi ${version.version}`}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-xs" style={{ color: colors.tealMedium }}>
                          <User size={12} />
                          <span>{version.by}</span>
                          <Clock size={12} className="ml-2" />
                          <span>{formatDate(version.date)}</span>
                        </div>

                        {version.details && !version.isCurrent && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer" style={{ color: colors.gold }}>
                              Lihat detail perubahan
                            </summary>
                            <pre className="mt-2 p-2 rounded text-[9px] overflow-x-auto" style={{ 
                              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(202, 223, 223, 0.3)',
                              color: colors.tealDark
                            }}>
                              {JSON.stringify(version.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-4 border-t flex justify-end"
          style={{ borderColor: colors.tealPale }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
              color: 'white'
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryModal;