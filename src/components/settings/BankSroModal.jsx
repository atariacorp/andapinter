import React, { useState, useEffect } from 'react';
import { Search, Database, X } from 'lucide-react';

const BankSroModal = ({ 
  show, 
  onClose, 
  bankSro, 
  onSelect, 
  filterText,
  onFilterChange,
  isDarkMode,
  colors
}) => {
  const [localFilter, setLocalFilter] = useState(filterText || '');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter data
  const filteredData = bankSro.filter(item => 
    (item.kode?.toLowerCase() || '').includes(localFilter.toLowerCase()) ||
    (item.uraian?.toLowerCase() || '').includes(localFilter.toLowerCase())
  );

  // Pagination
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset ke halaman 1 ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [localFilter]);

  // Update parent filter ketika local filter berubah
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(localFilter);
    }
  }, [localFilter, onFilterChange]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${colors.tealPale}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div 
          className="p-6 border-b flex justify-between items-center"
          style={{ 
            borderColor: colors.tealPale,
            background: `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`
          }}
        >
          <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <Database size={18} /> BANK DATA KODE REKENING
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg transition-colors hover:bg-white/20"
            style={{ color: 'white' }}
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Search di Modal */}
        <div className="p-4 border-b" style={{ borderColor: colors.tealPale }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.gold }} />
            <input
              type="text"
              value={localFilter}
              onChange={(e) => setLocalFilter(e.target.value)}
              placeholder="Cari kode rekening atau uraian..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                border: `1px solid ${colors.tealPale}`,
                color: colors.tealDark,
                focusRing: colors.gold
              }}
              autoFocus
            />
          </div>
        </div>
        
        {/* Daftar SRO */}
        <div className="flex-grow overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-2">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.kode, item.uraian);
                    onClose();
                  }}
                  className="p-4 text-left rounded-xl transition-all hover:scale-[1.02] group"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                    border: `1px solid ${colors.tealPale}`,
                  }}
                >
                  <div className="font-mono text-sm font-bold mb-1" style={{ color: colors.gold }}>
                    {item.kode}
                  </div>
                  <div className="text-xs" style={{ color: colors.tealDark }}>
                    {item.uraian}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-10 italic" style={{ color: colors.tealMedium }}>
                {localFilter ? 'Tidak ada data yang cocok' : 'Tidak ada data SRO'}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Modal dengan Pagination */}
        {filteredData.length > 0 && (
          <div className="p-4 border-t flex justify-between items-center" style={{ borderColor: colors.tealPale }}>
            <span className="text-xs" style={{ color: colors.tealMedium }}>
              Menampilkan {start + 1}-{Math.min(start + itemsPerPage, filteredData.length)} dari {filteredData.length} data
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg text-xs transition-all disabled:opacity-30"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                  border: `1px solid ${colors.tealPale}`,
                  color: colors.tealDark
                }}
              >
                Prev
              </button>
              <span className="px-3 py-1 text-xs" style={{ color: colors.tealDark }}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg text-xs transition-all disabled:opacity-30"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                  border: `1px solid ${colors.tealPale}`,
                  color: colors.tealDark
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankSroModal;