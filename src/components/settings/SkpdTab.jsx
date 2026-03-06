import React, { useState } from 'react';
import { Building2, Upload, Download, Plus } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

const SkpdTab = ({ 
  skpdList, 
  onAdd, 
  onDelete, 
  onImport,
  onDownloadTemplate,
  isProcessing 
}) => {
  const [newSkpd, setNewSkpd] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSkpd.trim()) {
      onAdd(newSkpd.trim());
      setNewSkpd('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Form Tambah */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2">
            <Building2 size={16}/> Input Instansi Baru
          </h2>
          
          <input 
            required 
            value={newSkpd} 
            onChange={e => setNewSkpd(e.target.value)} 
            placeholder="Nama Instansi..." 
            className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold uppercase text-[10px] shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {isProcessing ? 'MENYIMPAN...' : 'Simpan Instansi'}
          </button>
        </form>
        
        {/* Import Section */}
        <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl text-white space-y-4 shadow-xl">
          <h2 className="text-xs font-black uppercase text-blue-400 tracking-widest flex items-center gap-2">
            <Upload size={16}/> Impor Massal Instansi
          </h2>
          
          <button 
            onClick={onDownloadTemplate} 
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 dark:bg-slate-900 rounded-xl text-[10px] font-black border border-slate-700 hover:bg-slate-700 transition-all uppercase italic"
          >
            <span>Unduh Template CSV</span>
            <Download size={14}/>
          </button>
          
          <div className="relative cursor-pointer">
            <input 
              type="file" 
              accept=".csv" 
              onChange={(e) => onImport(e, 'skpd')} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isProcessing}
            />
            <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] font-black uppercase transition-colors">
              <Upload size={16}/> Upload CSV Instansi
            </div>
          </div>
          
          <p className="text-[8px] text-slate-400 italic">
            Format CSV: Nama SKPD (gunakan ; sebagai pemisah)
          </p>
        </div>
      </div>
      
      {/* Right Column - Data Table */}
      <div className="lg:col-span-7">
        <MasterDataTable
          data={skpdList}
          columns={[
            { field: 'nama', render: (item) => <span className="font-bold">{item.nama}</span> }
          ]}
          onDelete={onDelete}
          emptyMessage="Belum ada data SKPD"
        />
      </div>
    </div>
  );
};

export default SkpdTab;