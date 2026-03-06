import React, { useState } from 'react';
import { Database, Upload, Download, Plus } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

const SubKegTab = ({ 
  subKegList, 
  onAdd, 
  onDelete, 
  onImport,
  onDownloadTemplate,
  isProcessing 
}) => {
  const [newSubKeg, setNewSubKeg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSubKeg.trim()) {
      onAdd(newSubKeg.trim());
      setNewSubKeg('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Form Tambah */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2 tracking-tighter">
            <Database size={16}/> Input Sub Kegiatan Baru
          </h2>
          
          <input 
            required 
            value={newSubKeg} 
            onChange={e => setNewSubKeg(e.target.value)} 
            placeholder="Nama Sub Kegiatan..." 
            className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold uppercase text-[10px] shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            {isProcessing ? 'MENYIMPAN...' : 'Simpan Sub Kegiatan'}
          </button>
        </form>
        
        {/* Import Section */}
        <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl text-white space-y-4 shadow-xl">
          <h2 className="text-xs font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
            <Upload size={16}/> Impor Massal Sub Kegiatan
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
              onChange={(e) => onImport(e, 'sub_keg')} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isProcessing}
            />
            <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-[10px] font-black uppercase transition-colors">
              <Upload size={16}/> Upload CSV Sub Kegiatan
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Data Table */}
      <div className="lg:col-span-7">
        <MasterDataTable
          data={subKegList}
          columns={[
            { field: 'nama', render: (item) => <span className="font-bold">{item.nama}</span> }
          ]}
          onDelete={onDelete}
          emptyMessage="Belum ada data Sub Kegiatan"
        />
      </div>
    </div>
  );
};

export default SubKegTab;