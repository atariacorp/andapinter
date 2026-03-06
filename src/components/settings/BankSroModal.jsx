import React, { useState, useEffect } from 'react';
import { Search, Database, X } from 'lucide-react';

const BankSroModal = ({ 
  show, 
  onClose, 
  bankSro, 
  onSelect, 
  filterText,
  onFilterChange 
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-purple-600 to-purple-700">
          <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <Database size={18} /> BANK DATA KODE REKENING
          </h3>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        
        {/* Search di Modal */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={localFilter}
              onChange={(e) => setLocalFilter(e.target.value)}
              placeholder="Cari kode rekening atau uraian..."
              className="pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-full outline-none bg-white dark:bg-slate-800"
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
                  className="p-4 text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                >
                  <div className="font-mono text-sm font-bold text-purple-700 dark:text-purple-400 mb-1">
                    {item.kode}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {item.uraian}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic">
                {localFilter ? 'Tidak ada data yang cocok' : 'Tidak ada data SRO'}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Modal dengan Pagination */}
        {filteredData.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Menampilkan {start + 1}-{Math.min(start + itemsPerPage, filteredData.length)} dari {filteredData.length} data
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white dark:bg-slate-700 border rounded-lg disabled:opacity-30 text-xs"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-xs">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white dark:bg-slate-700 border rounded-lg disabled:opacity-30 text-xs"
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