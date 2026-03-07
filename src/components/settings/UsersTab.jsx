import React, { useState } from 'react';
import { UserPlus, ChevronRight, Trash2, Shield, UserCog, User, Mail, Key } from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

const UsersTab = ({ 
  usersList, 
  skpdList, 
  onAdd, 
  onDelete, 
  isProcessing,
  isDarkMode,
  colors 
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

  const getLevelBadgeStyle = (level) => {
    switch(level) {
      case 'Admin':
        return { bg: `${colors.gold}30`, text: colors.gold, border: `${colors.gold}50` };
      case 'Operator BKAD':
        return { bg: `${colors.tealDark}30`, text: colors.tealDark, border: `${colors.tealDark}50` };
      case 'SKPD':
        return { bg: `${colors.tealMedium}30`, text: colors.tealMedium, border: `${colors.tealMedium}50` };
      default:
        return { bg: `${colors.tealPale}30`, text: colors.tealDark, border: colors.tealPale };
    }
  };

  // Glass card style
  const glassCard = `backdrop-blur-md rounded-2xl border transition-all hover:shadow-xl p-6 ${
    isDarkMode 
      ? 'bg-[#3c5654]/30 border-[#d7a217]/20' 
      : 'bg-white/70 border-[#cadfdf]'
  }`;

  const glassInput = `w-full p-3 rounded-xl text-sm outline-none transition-all focus:ring-2 ${
    isDarkMode 
      ? 'bg-[#3c5654]/30 border-[#d7a217]/30 text-[#e2eceb] focus:ring-[#d7a217]/50' 
      : 'bg-white/70 border-[#cadfdf] text-[#425c5a] focus:ring-[#d7a217]/50'
  }`;

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Form Tambah User */}
      <div className={glassCard}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${colors.gold}20` }}>
            <UserPlus size={20} style={{ color: colors.gold }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Registrasi User Baru
            </h2>
            <p className="text-xs mt-1" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
              Tambahkan user baru ke sistem dengan level akses yang sesuai
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Nama User */}
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <User size={12} style={{ color: colors.gold }} />
              Nama Lengkap / Email
            </label>
            <input 
              required 
              value={newUser.nama} 
              onChange={e => setNewUser({...newUser, nama: e.target.value})} 
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
              placeholder="Contoh: John Doe"
            />
          </div>
          
          {/* UID Firebase */}
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <Key size={12} style={{ color: colors.gold }} />
              UID Firebase
            </label>
            <input 
              required 
              value={newUser.uid} 
              onChange={e => setNewUser({...newUser, uid: e.target.value})} 
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
              placeholder="Dapat dari Firebase Console"
            />
          </div>
          
          {/* Level */}
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <Shield size={12} style={{ color: colors.gold }} />
              Level Akses
            </label>
            <select 
              value={newUser.level} 
              onChange={e => handleLevelChange(e.target.value)} 
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            >
              <option value="SKPD">SKPD / Instansi</option>
              <option value="Operator BKAD">OPERATOR BKAD</option>
              <option value="Admin">ADMIN</option>
              <option value="TAPD">VIEWER / TAPD</option>
            </select>
          </div>
          
          {/* Scope */}
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <UserCog size={12} style={{ color: colors.gold }} />
              Scope Akses
            </label>
            
            {newUser.level === 'SKPD' ? (
              <select 
                value={newUser.skpdId} 
                onChange={e => setNewUser({...newUser, skpdId: e.target.value})} 
                className={glassInput}
                style={{ borderWidth: '1px', borderStyle: 'solid' }}
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
                  className={`${glassInput} flex justify-between items-center`}
                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                >
                  <span>{newUser.assignedSkpds?.length || 0} Instansi Terpilih</span>
                  <ChevronRight size={14} style={{ color: colors.gold }} className={`transition-transform ${showSkpdDropdown ? 'rotate-90' : ''}`} />
                </button>
                
                {showSkpdDropdown && (
                  <div 
                    className="absolute z-50 mt-2 w-full rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.95)' : 'white',
                      border: `1px solid ${colors.tealPale}`,
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <button 
                      type="button" 
                      onClick={selectAllSkpd} 
                      className="w-full text-left p-3 text-xs font-bold border-b"
                      style={{ 
                        borderColor: colors.tealPale,
                        color: colors.gold
                      }}
                    >
                      {newUser.assignedSkpds.length === skpdList.length ? 'Hapus Semua' : 'Pilih Semua Instansi'}
                    </button>
                    
                    {skpdList.map(s => (
                      <label key={s.id} className="flex items-center gap-2 p-3 hover:bg-opacity-50 text-xs cursor-pointer transition-colors"
                        style={{ 
                          borderBottom: `1px solid ${colors.tealPale}`,
                          color: isDarkMode ? colors.tealLight : colors.tealDark
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={newUser.assignedSkpds?.includes(s.id)} 
                          onChange={() => toggleSkpdSelection(s.id)} 
                          className="rounded"
                          style={{ accentColor: colors.gold }}
                        />
                        <span>{String(s.nama)}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ) : newUser.level === 'TAPD' ? (
              <div 
                className={`${glassInput} text-center`}
                style={{ borderWidth: '1px', borderStyle: 'solid' }}
              >
                Akses Global (Viewer)
              </div>
            ) : (
              <div 
                className={`${glassInput} text-center`}
                style={{ borderWidth: '1px', borderStyle: 'solid' }}
              >
                Akses Admin (Global)
              </div>
            )}
          </div>
          
          {/* Submit Button - Full Width */}
          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
                color: 'white'
              }}
            >
              <UserPlus size={16} />
              {isProcessing ? 'MENYIMPAN...' : 'DAFTARKAN USER'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Tabel Users */}
      <div 
        className="backdrop-blur-md rounded-2xl border overflow-hidden transition-all hover:shadow-xl"
        style={{ 
          backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
          borderColor: isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.tealMedium }}>
                <th className="p-4">Nama User</th>
                <th className="p-4">UID</th>
                <th className="p-4 text-center">Level</th>
                <th className="p-4">Scope</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: colors.tealPale }}>
              {usersList.map(u => {
                const badgeStyle = getLevelBadgeStyle(u.level);
                return (
                  <tr key={u.id} className="transition-colors hover:bg-opacity-50">
                    <td className="p-4 font-medium" style={{ color: colors.tealDark }}>
                      <div className="flex items-center gap-2">
                        <Mail size={12} style={{ color: colors.gold }} />
                        {u.nama || 'User'}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono" style={{ color: colors.tealMedium }}>
                      {u.uid || '-'}
                    </td>
                    <td className="p-4 text-center">
                      <span 
                        className="px-2 py-1 rounded-lg text-[9px] font-bold uppercase"
                        style={{ 
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.text,
                          border: `1px solid ${badgeStyle.border}`
                        }}
                      >
                        {u.level || 'Viewer'}
                      </span>
                    </td>
                    <td className="p-4 text-xs" style={{ color: colors.tealMedium }}>
                      {u.level === 'Admin' ? 'Global Admin' : 
                       u.level === 'TAPD' ? 'Viewer Global' : 
                       u.level === 'SKPD' ? (skpdList.find(s => s.id === u.skpdId)?.nama || "N/A") : 
                       `${u.assignedSkpds?.length || 0} Instansi`}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onDelete(u)} 
                        className="p-2 rounded-lg transition-all hover:scale-110"
                        style={{ 
                          backgroundColor: `${colors.tealDark}20`,
                          color: colors.tealDark
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {usersList.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <Users size={40} className="mx-auto mb-3 opacity-30" style={{ color: colors.tealMedium }} />
                    <p className="text-sm italic" style={{ color: colors.tealMedium }}>
                      Belum ada data user
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;