import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

const TapdTab = ({ 
  tapdList, 
  onAdd, 
  onDelete, 
  isProcessing 
}) => {
  const [newTapd, setNewTapd] = useState({ nip: '', nama: '', jabatan: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTapd.nama.trim() || !newTapd.nip.trim() || !newTapd.jabatan.trim()) {
      alert("Lengkapi semua isian form TAPD");
      return;
    }
    onAdd(newTapd);
    setNewTapd({ nip: '', nama: '', jabatan: '' });
  };

  const handleChange = (field, value) => {
    setNewTapd(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Form Tambah */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-500"/> Input Anggota TAPD
          </h2>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">
              NIP / ID
            </label>
            <input 
              required 
              value={newTapd.nip} 
              onChange={e => handleChange('nip', e.target.value)} 
              placeholder="Contoh: 198001012005011001" 
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">
              Nama Lengkap
            </label>
            <input 
              required 
              value={newTapd.nama} 
              onChange={e => handleChange('nama', e.target.value)} 
              placeholder="Nama Pejabat beserta Gelar..." 
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">
              Jabatan
            </label>
            <input 
              required 
              value={newTapd.jabatan} 
              onChange={e => handleChange('jabatan', e.target.value)} 
              placeholder="Contoh: KEPALA DINAS" 
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold uppercase text-[10px] shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {isProcessing ? 'MENYIMPAN...' : 'Tambah Anggota TAPD'}
          </button>
        </form>
        
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs italic">
          Nama-nama ini akan secara otomatis muncul sebagai kolom tanda tangan verifikator pada form cetak Berita Acara (PDF) berkas.
        </div>
      </div>
      
      {/* Right Column - Data Table */}
      <div className="lg:col-span-7">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[600px] flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
            Susunan TAPD
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full">{tapdList.length}</span>
          </div>
          
          <div className="overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
            {tapdList.length > 0 ? (
              tapdList.map(t => (
                <div key={t.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex justify-between items-start group hover:border-blue-200 dark:hover:border-blue-600 shadow-sm transition-all">
                  <div>
                    <p className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase">{String(t.nama)}</p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">NIP: {String(t.nip)}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded inline-block">
                      {String(t.jabatan)}
                    </p>
                  </div>
                  <button 
                    onClick={() => onDelete(t)} 
                    className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 italic text-sm mt-10">
                Belum ada data TAPD
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapdTab;