import React, { useState } from 'react';
import { Database, Edit3, Trash2, Plus, X, CheckCircle } from 'lucide-react';

const BankCatatanPanel = ({ 
  bankCatatan, 
  onTambah, 
  onEdit, 
  onHapus, 
  onGunakan,
  isProcessing,
  currentUser
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formJudul, setFormJudul] = useState('');
  const [formIsi, setFormIsi] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editJudul, setEditJudul] = useState('');
  const [editIsi, setEditIsi] = useState('');

  const handleSubmitTambah = (e) => {
    e.preventDefault();
    if (formJudul.trim() && formIsi.trim()) {
      onTambah(formJudul.trim(), formIsi.trim());
      setFormJudul('');
      setFormIsi('');
      setShowForm(false);
    }
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (editingId && editJudul.trim() && editIsi.trim()) {
      onEdit(editingId, editJudul.trim(), editIsi.trim());
      setEditingId(null);
      setEditJudul('');
      setEditIsi('');
    }
  };

  return (
    <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-xl">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-[10px] font-black text-purple-700 dark:text-purple-400 uppercase flex items-center gap-2">
          <Database size={14} /> BANK CATATAN ANALISA
        </h5>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded text-[8px] font-black uppercase flex items-center gap-1"
        >
          {showForm ? <X size={12} /> : <Plus size={12} />}
          {showForm ? 'Tutup' : 'Tambah'}
        </button>
      </div>
      
      {/* Form Tambah */}
      {showForm && (
        <form onSubmit={handleSubmitTambah} className="mb-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="grid grid-cols-1 gap-2 mb-2">
            <input
              type="text"
              value={formJudul}
              onChange={(e) => setFormJudul(e.target.value)}
              placeholder="Judul Catatan"
              className="p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
              required
            />
            <textarea
              rows="2"
              value={formIsi}
              onChange={(e) => setFormIsi(e.target.value)}
              placeholder="Isi Catatan..."
              className="p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'MENYIMPAN...' : 'TAMBAH KE BANK CATATAN'}
          </button>
        </form>
      )}
      
      {/* Daftar Catatan */}
      <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
        {bankCatatan.length === 0 ? (
          <p className="text-center text-slate-400 italic text-[10px] py-4">
            Belum ada catatan tersimpan
          </p>
        ) : (
          bankCatatan.map((catatan) => (
            <div 
              key={catatan.id} 
              className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 transition-all"
            >
              
              {/* Mode Edit vs Mode Lihat */}
              {editingId === catatan.id ? (
                // Mode Edit
                <form onSubmit={handleSubmitEdit} className="space-y-2">
                  <input
                    type="text"
                    value={editJudul}
                    onChange={(e) => setEditJudul(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg"
                    placeholder="Judul"
                    required
                  />
                  <textarea
                    rows="2"
                    value={editIsi}
                    onChange={(e) => setEditIsi(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg"
                    placeholder="Isi catatan"
                    required
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditJudul('');
                        setEditIsi('');
                      }}
                      className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[9px] font-black"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-black"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              ) : (
                // Mode Lihat
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-black text-xs text-purple-700 dark:text-purple-400">
                      {catatan.judul}
                    </h6>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingId(catatan.id);
                          setEditJudul(catatan.judul);
                          setEditIsi(catatan.isi);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded"
                        title="Edit Catatan"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => onHapus(catatan.id, catatan.judul)}
                        className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded"
                        title="Hapus Catatan"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mb-2 italic border-l-2 border-purple-300 pl-2">
                    {catatan.isi}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => onGunakan(catatan.isi)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[8px] font-black uppercase tracking-wider"
                    >
                      Gunakan Catatan
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BankCatatanPanel;