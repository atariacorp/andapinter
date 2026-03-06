import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ show, name, type, isProcessing, onConfirm, onCancel }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 print:hidden">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 border border-slate-100 dark:border-slate-700">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 mx-auto">
          <Trash2 size={24}/>
        </div>
        <h3 className="text-lg font-bold text-center mb-2 dark:text-slate-100">
          Hapus {String(type || "Data")}?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 italic leading-relaxed">
          "{String(name || "")}" akan dihapus permanen dari sistem.
        </p>
        <div className="flex gap-3">
          <button 
            disabled={isProcessing} 
            onClick={onCancel} 
            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            disabled={isProcessing} 
            onClick={onConfirm} 
            className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-600/20 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'MENGHAPUS...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;