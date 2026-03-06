import React, { useState } from 'react';
import { Layers, Plus, AlertCircle } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

const TahapTab = ({ 
  tahapList, 
  onAdd, 
  onDelete, 
  onGenerateDefault,
  isProcessing 
}) => {
  const [newTahap, setNewTahap] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTahap.trim()) {
      onAdd(newTahap.trim());
      setNewTahap('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Form Tambah */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2">
            <Layers size={16}/> Input Tahap Baru
          </h2>
          
          <input 
            required 
            value={newTahap} 
            onChange={e => setNewTahap(e.target.value)} 
            placeholder="Contoh: Pergeseran III" 
            className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold uppercase text-[10px] shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {isProcessing ? 'MENYIMPAN...' : 'Tambah Tahap'}
          </button>
        </form>
        
        {/* Generate Default Section */}
        {tahapList.length === 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 shadow-sm">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                Database tahap masih kosong!
              </p>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-300 mb-3">
              Anda dapat menambahkannya satu persatu di atas, atau klik tombol di bawah untuk membuat tahap default secara otomatis.
            </p>
            <button 
              onClick={onGenerateDefault} 
              disabled={isProcessing} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-md transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              <Layers size={14}/>
              {isProcessing ? 'MEMPROSES...' : 'GENERATE TAHAP OTOMATIS'}
            </button>
          </div>
        )}
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-700 dark:text-blue-300 text-xs italic">
          Tahapan ini akan muncul pada opsi filter dan form verifikasi Admin/Operator. SKPD tidak dapat memilih tahap ini secara mandiri.
        </div>
      </div>
      
      {/* Right Column - Data Table */}
      <div className="lg:col-span-7">
        <MasterDataTable
          data={tahapList}
          columns={[
            { field: 'nama', render: (item) => (
              <span className="font-black uppercase tracking-widest">{item.nama}</span>
            )}
          ]}
          onDelete={onDelete}
          emptyMessage="Belum ada data Tahap"
        />
      </div>
    </div>
  );
};

export default TahapTab;