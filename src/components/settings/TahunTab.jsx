import React, { useState } from 'react';
import { CalendarDays, Plus, AlertCircle } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

const TahunTab = ({ 
  tahunList, 
  onAdd, 
  onDelete, 
  onGenerateDefault,
  isProcessing 
}) => {
  const [newTahun, setNewTahun] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTahun.trim()) return;

    // Validasi format tahun (4 digit)
    const tahunRegex = /^\d{4}$/;
    if (!tahunRegex.test(newTahun.trim())) {
      alert("Format tahun tidak valid. Gunakan 4 digit angka (contoh: 2024)");
      return;
    }

    // Cek duplikasi
    const existing = tahunList.find(t => t.tahun === newTahun.trim() || t.nama === newTahun.trim());
    if (existing) {
      alert(`Tahun ${newTahun.trim()} sudah ada dalam database`);
      return;
    }

    onAdd(newTahun.trim());
    setNewTahun('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Form Tambah */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2">
            <CalendarDays size={16} className="text-blue-500"/> Input Tahun Anggaran Baru
          </h2>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">
              Tahun (4 digit)
            </label>
            <input 
              required 
              type="number" 
              min="2000" 
              max="2100" 
              value={newTahun} 
              onChange={e => setNewTahun(e.target.value)} 
              placeholder="Contoh: 2024" 
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold uppercase text-[10px] shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {isProcessing ? 'MENAMBAH...' : 'TAMBAH TAHUN ANGGARAN'}
          </button>
        </form>
        
        {/* Info Section */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-700 dark:text-blue-300 text-xs italic">
          <CalendarDays size={14} className="inline mr-1" />
          Tahun anggaran yang ditambahkan akan muncul di dropdown filter pada halaman Dashboard dan Daftar Berkas.
        </div>

        {/* Generate Default */}
        {tahunList.length === 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 shadow-sm">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-bold mb-3">
              Database tahun masih kosong! Klik tombol di bawah untuk membuat tahun default (2024-2026).
            </p>
            <button 
              onClick={onGenerateDefault} 
              disabled={isProcessing} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-md transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              <CalendarDays size={14}/>
              {isProcessing ? 'MEMPROSES...' : 'GENERATE TAHUN DEFAULT'}
            </button>
          </div>
        )}
      </div>

      {/* Right Column - Data Table */}
      <div className="lg:col-span-7">
        <MasterDataTable
          data={tahunList}
          columns={[
            { 
              field: 'tahun', 
              render: (item) => (
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-blue-500" />
                  {item.tahun || item.nama}
                </span>
              )
            }
          ]}
          onDelete={onDelete}
          emptyMessage="Belum ada data Tahun Anggaran"
        />
      </div>
    </div>
  );
};

export default TahunTab;