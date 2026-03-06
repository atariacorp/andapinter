import React, { useState } from 'react';
import { UserPlus, ChevronRight, Trash2 } from 'lucide-react';

const UsersTab = ({ 
  usersList, 
  skpdList, 
  onAdd, 
  onDelete, 
  isProcessing 
}) => {
  const [newUser, setNewUser] = useState({ 
    nama: '', 
    level: 'SKPD', 
    skpdId: '', 
    assignedSkpds: [], 
    uid: '' 
  });

  const [showSkpdDropdown, setShowSkpdDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUser.nama.trim() || !newUser.uid.trim()) {
      alert("Lengkapi Nama dan UID");
      return;
    }
    onAdd(newUser);
    setNewUser({ nama: '', level: 'SKPD', skpdId: '', assignedSkpds: [], uid: '' });
  };

  const handleLevelChange = (level) => {
    setNewUser({ 
      ...newUser, 
      level, 
      skpdId: '', 
      assignedSkpds: [] 
    });
  };

  const toggleSkpdSelection = (skpdId) => {
    const current = newUser.assignedSkpds || [];
    if (current.includes(skpdId)) {
      setNewUser({ ...newUser, assignedSkpds: current.filter(id => id !== skpdId) });
    } else {
      setNewUser({ ...newUser, assignedSkpds: [...current, skpdId] });
    }
  };

  const selectAllSkpd = () => {
    if (newUser.assignedSkpds.length === skpdList.length) {
      setNewUser({ ...newUser, assignedSkpds: [] });
    } else {
      setNewUser({ ...newUser, assignedSkpds: skpdList.map(s => s.id) });
    }
  };

  const getLevelBadgeClass = (level) => {
    switch(level) {
      case 'Admin': return 'bg-rose-100 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50';
      case 'TAPD': return 'bg-purple-100 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50';
      case 'Operator BKAD': return 'bg-amber-100 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50';
      default: return 'bg-blue-100 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Form Tambah User */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6">
        <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 mb-6 uppercase flex items-center gap-2 tracking-tighter">
          <UserPlus size={18} className="text-blue-500"/> Registrasi User Baru
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Nama User */}
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              Nama User / Email
            </label>
            <input 
              required 
              value={newUser.nama} 
              onChange={e => setNewUser({...newUser, nama: e.target.value})} 
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          {/* UID Firebase */}
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              UID Firebase
            </label>
            <input 
              required 
              value={newUser.uid} 
              onChange={e => setNewUser({...newUser, uid: e.target.value})} 
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none" 
              placeholder="Dapat dari Firebase Console"
            />
          </div>
          
          {/* Level */}
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              Level Akses
            </label>
            <select 
              value={newUser.level} 
              onChange={e => handleLevelChange(e.target.value)} 
              className="w-full p-3 border rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none"
            >
              <option value="SKPD">SKPD / Instansi</option>
              <option value="Operator BKAD">OPERATOR BKAD</option>
              <option value="Admin">ADMIN</option>
              <option value="TAPD">VIEWER / VERIFIKATOR</option>
            </select>
          </div>
          
          {/* Scope */}
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              Scope Akses
            </label>
            
            {newUser.level === 'SKPD' ? (
              <select 
                value={newUser.skpdId} 
                onChange={e => setNewUser({...newUser, skpdId: e.target.value})} 
                className="w-full p-3 border rounded-xl text-sm bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-slate-200 dark:border-slate-700 font-bold outline-none"
              >
                <option value="">Pilih Instansi...</option>
                {skpdList.map(s => (
                  <option key={s.id} value={s.id}>{String(s.nama)}</option>
                ))}
              </select>
            ) : newUser.level === 'Operator BKAD' ? (
              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => setShowSkpdDropdown(!showSkpdDropdown)}
                  className="w-full p-3 border rounded-xl text-sm bg-white dark:bg-slate-900 flex justify-between items-center text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-bold shadow-sm"
                >
                  {newUser.assignedSkpds?.length || 0} Instansi Terpilih
                  <ChevronRight size={14} className={`transition-transform ${showSkpdDropdown ? 'rotate-90' : ''}`}/>
                </button>
                
                {showSkpdDropdown && (
                  <div className="absolute top-full left-0 w-64 max-h-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl z-50 overflow-y-auto p-4">
                    <button 
                      type="button" 
                      onClick={selectAllSkpd} 
                      className="w-full text-left p-2 text-[10px] font-black text-blue-600 dark:text-blue-400 mb-2 border-b dark:border-slate-700 uppercase tracking-tighter"
                    >
                      {newUser.assignedSkpds.length === skpdList.length ? 'Hapus Semua' : 'Pilih Semua Instansi'}
                    </button>
                    
                    {skpdList.map(s => (
                      <label key={s.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-[10px] font-bold cursor-pointer transition-colors text-slate-600 dark:text-slate-300 uppercase tracking-tighter">
                        <input 
                          type="checkbox" 
                          checked={newUser.assignedSkpds?.includes(s.id)} 
                          onChange={() => toggleSkpdSelection(s.id)} 
                          className="rounded text-blue-600 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                        />
                        <span>{String(s.nama)}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ) : newUser.level === 'TAPD' ? (
              <div className="p-3 bg-slate-100 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 rounded-xl text-[10px] font-black text-center border uppercase border-slate-200 dark:border-slate-700 italic tracking-widest">
                Akses Global (Viewer)
              </div>
            ) : (
              <div className="p-3 bg-slate-100 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 rounded-xl text-[10px] font-black text-center border uppercase border-slate-200 dark:border-slate-700 italic tracking-widest">
                Akses Admin (Global)
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isProcessing}
            className="md:col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl transition-all active:scale-95 text-center disabled:opacity-50"
          >
            {isProcessing ? 'MENYIMPAN...' : 'SIMPAN USER KE FIREBASE'}
          </button>
        </form>
      </div>
      
      {/* Tabel Users */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-grow mb-10">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
            <tr>
              <th className="p-4">Nama User / Email</th>
              <th className="p-4 text-center">Akses</th>
              <th className="p-4 text-center">Scope</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {usersList.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                <td className="p-4 font-black text-slate-800 dark:text-slate-200">
                  {String(u.nama || "User")}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${getLevelBadgeClass(u.level)}`}>
                    {String(u.level || "")}
                  </span>
                </td>
                <td className="p-4 text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center uppercase tracking-tighter">
                  {u.level === 'Admin' ? 'Global Admin' : 
                   u.level === 'TAPD' ? 'Viewer Global' : 
                   u.level === 'SKPD' ? (skpdList.find(s => s.id === u.skpdId)?.nama || "N/A") : 
                   `${u.assignedSkpds?.length || 0} Instansi`}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => onDelete(u)} 
                    className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 transition-all p-1"
                  >
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
            
            {usersList.length === 0 && (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-400 italic">
                  Belum ada data user
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab;