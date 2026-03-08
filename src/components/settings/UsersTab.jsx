import React, { useState, useEffect } from 'react';
import { 
  UserPlus, ChevronRight, Trash2, Shield, UserCog, 
  User, Mail, Key, Users, Edit3, X, CheckCircle,
  AlertCircle
} from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

// --- Komponen Partikel Emas Mengambang (VISUAL ENHANCED) ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 1.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 25 + 15,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-[#f9d423] to-[#d7a217] animate-float-particle mix-blend-screen"
          style={{
            width: `${p.size}px`, height: `${p.size}px`,
            left: `${p.left}%`, top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.animDuration}s`,
            animationDelay: `${p.animDelay}s`,
            boxShadow: `0 0 ${p.size * 4}px ${p.size * 1.5}px rgba(215, 162, 23, 0.4)`,
          }}
        />
      ))}
    </div>
  );
};

const UsersTab = ({ 
  usersList, 
  skpdList, 
  onAdd, 
  onDelete, 
  onEdit,  // <-- TAMBAHKAN PROPS EDIT
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

  const [editingUser, setEditingUser] = useState(null); // State untuk user yang sedang diedit
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSkpdDropdown, setShowSkpdDropdown] = useState(false);
  const [showEditSkpdDropdown, setShowEditSkpdDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUser.nama.trim() || !newUser.uid.trim()) {
      alert("Lengkapi Nama dan UID");
      return;
    }
    onAdd(newUser);
    setNewUser({ nama: '', level: 'SKPD', skpdId: '', assignedSkpds: [], uid: '' });
  };

  const handleEditClick = (user) => {
    setEditingUser({
      ...user,
      assignedSkpds: user.assignedSkpds || []
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser.nama.trim() || !editingUser.uid.trim()) {
      alert("Lengkapi Nama dan UID");
      return;
    }
    onEdit(editingUser.id, editingUser);
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleLevelChange = (level, isEdit = false) => {
    if (isEdit) {
      setEditingUser({ 
        ...editingUser, 
        level, 
        skpdId: '', 
        assignedSkpds: [] 
      });
    } else {
      setNewUser({ 
        ...newUser, 
        level, 
        skpdId: '', 
        assignedSkpds: [] 
      });
    }
  };

  const toggleSkpdSelection = (skpdId, isEdit = false) => {
    if (isEdit) {
      const current = editingUser.assignedSkpds || [];
      if (current.includes(skpdId)) {
        setEditingUser({ ...editingUser, assignedSkpds: current.filter(id => id !== skpdId) });
      } else {
        setEditingUser({ ...editingUser, assignedSkpds: [...current, skpdId] });
      }
    } else {
      const current = newUser.assignedSkpds || [];
      if (current.includes(skpdId)) {
        setNewUser({ ...newUser, assignedSkpds: current.filter(id => id !== skpdId) });
      } else {
        setNewUser({ ...newUser, assignedSkpds: [...current, skpdId] });
      }
    }
  };

  const selectAllSkpd = (isEdit = false) => {
    if (isEdit) {
      if (editingUser.assignedSkpds?.length === skpdList.length) {
        setEditingUser({ ...editingUser, assignedSkpds: [] });
      } else {
        setEditingUser({ ...editingUser, assignedSkpds: skpdList.map(s => s.id) });
      }
    } else {
      if (newUser.assignedSkpds.length === skpdList.length) {
        setNewUser({ ...newUser, assignedSkpds: [] });
      } else {
        setNewUser({ ...newUser, assignedSkpds: skpdList.map(s => s.id) });
      }
    }
  };

  const getLevelBadgeStyle = (level) => {
    switch(level) {
      case 'Super Admin':
        return { bg: `rgba(215, 162, 23, 0.15)`, text: colors.gold, border: `rgba(215, 162, 23, 0.4)` };
      case 'Admin':
        return { bg: `rgba(215, 162, 23, 0.15)`, text: colors.gold, border: `rgba(215, 162, 23, 0.4)` };
      case 'Kepala Sub Bidang':
        return { bg: `rgba(66, 92, 90, 0.15)`, text: colors.tealDark, border: `rgba(66, 92, 90, 0.4)` };
      case 'Operator BKAD':
        return { bg: `rgba(60, 86, 84, 0.15)`, text: colors.tealMedium, border: `rgba(60, 86, 84, 0.4)` };
      case 'SKPD':
        return { bg: `rgba(59, 130, 246, 0.1)`, text: '#3b82f6', border: `rgba(59, 130, 246, 0.3)` };
      default:
        return { bg: `rgba(202, 223, 223, 0.15)`, text: colors.tealDark, border: `rgba(202, 223, 223, 0.4)` };
    }
  };

  // --- Advanced Glassmorphism Styles ---
  const glassCard = `backdrop-blur-2xl border transition-all duration-700 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_40px_-10px_rgba(215,162,23,0.25)] relative overflow-hidden group p-6 md:p-8 rounded-3xl ${
    isDarkMode 
      ? 'bg-gradient-to-br from-[#3c5654]/40 to-[#2a3f3d]/60 border-[#cadfdf]/10' 
      : 'bg-gradient-to-br from-white/70 to-white/40 border-white/60'
  }`;

  const glassInput = `w-full p-4 rounded-xl text-sm md:text-base outline-none transition-all duration-500 focus:ring-2 focus:ring-[#d7a217]/50 focus:shadow-[0_0_20px_rgba(215,162,23,0.2)] appearance-none ${
    isDarkMode 
      ? 'bg-[#1e2e2d]/50 border-[#cadfdf]/20 text-[#e2eceb] focus:bg-[#1e2e2d]/80 placeholder-[#cadfdf]/40' 
      : 'bg-white/50 border-white/80 text-[#425c5a] focus:bg-white/90 placeholder-[#3c5654]/50'
  }`;

  return (
    <div className="relative animate-in fade-in duration-500">
      
      {/* Background Decorative Ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-3xl">
        <div className="absolute top-[10%] right-[5%] w-64 h-64 bg-[#d7a217] blur-[100px] opacity-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-[#425c5a] blur-[120px] opacity-10 animate-pulse-slow"></div>
      </div>
      
      <FloatingGoldParticles />

      <div className="space-y-8 relative z-10">
        
        {/* Form Tambah User */}
        <div className={`${glassCard} animate-slide-up-fade`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#d7a217]/20 to-transparent border border-[#d7a217]/30 shadow-[inset_0_0_15px_rgba(215,162,23,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <UserPlus size={24} style={{ color: colors.gold }} className="drop-shadow-md" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Registrasi Akses Baru
              </h2>
              <p className="text-xs md:text-sm font-semibold mt-1 opacity-70" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Konfigurasi otorisasi dan pemetaan akses sistem.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            
            {/* Nama User */}
            <div className="space-y-2 relative group/input">
              <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-1 opacity-80" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <User size={14} style={{ color: colors.gold }} />
                Nama / Email
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                <input 
                  required 
                  value={newUser.nama} 
                  onChange={e => setNewUser({...newUser, nama: e.target.value})} 
                  className={`${glassInput} relative z-10`}
                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                  placeholder="Ketik Identitas User..."
                />
              </div>
            </div>
            
            {/* UID Firebase */}
            <div className="space-y-2 relative group/input">
              <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-1 opacity-80" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <Key size={14} style={{ color: colors.gold }} />
                UID Auth
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                <input 
                  required 
                  value={newUser.uid} 
                  onChange={e => setNewUser({...newUser, uid: e.target.value})} 
                  className={`${glassInput} relative z-10`}
                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                  placeholder="UID Unik Firebase..."
                />
              </div>
            </div>
            
            {/* Level */}
            <div className="space-y-2 relative group/input">
              <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-1 opacity-80" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <Shield size={14} style={{ color: colors.gold }} />
                Tingkat Akses
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                <select 
                  value={newUser.level} 
                  onChange={e => handleLevelChange(e.target.value)} 
                  className={`${glassInput} relative z-10 font-bold`}
                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                >
                  <option value="SKPD">SKPD / Instansi</option>
                  <option value="Operator BKAD">OPERATOR BKAD</option>
                  <option value="Kepala Sub Bidang">KEPALA SUB BIDANG</option>
                  <option value="Admin">ADMIN KONTROL</option>
                  <option value="Super Admin">SUPER ADMIN</option>
                  <option value="TAPD">VIEWER / TAPD</option>
                </select>
              </div>
            </div>
            
            {/* Scope */}
            <div className="space-y-2 relative group/input">
              <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-1 opacity-80" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                <UserCog size={14} style={{ color: colors.gold }} />
                Ruang Lingkup
              </label>
              
              {newUser.level === 'SKPD' ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                  <select 
                    value={newUser.skpdId} 
                    onChange={e => setNewUser({...newUser, skpdId: e.target.value})} 
                    className={`${glassInput} relative z-10 font-bold`}
                    style={{ borderWidth: '1px', borderStyle: 'solid' }}
                  >
                    <option value="">Pilih Pemetaan Instansi...</option>
                    {skpdList.map(s => (
                      <option key={s.id} value={s.id}>{String(s.nama)}</option>
                    ))}
                  </select>
                </div>
              ) : newUser.level === 'Operator BKAD' ? (
                <div className="relative z-20">
                  <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                  <button 
                    type="button" 
                    onClick={() => setShowSkpdDropdown(!showSkpdDropdown)}
                    className={`${glassInput} flex justify-between items-center relative z-10 font-bold`}
                    style={{ borderWidth: '1px', borderStyle: 'solid' }}
                  >
                    <span className={newUser.assignedSkpds?.length > 0 ? `text-[${colors.gold}]` : ''}>
                      {newUser.assignedSkpds?.length || 0} Domain Terpilih
                    </span>
                    <ChevronRight size={18} style={{ color: colors.gold }} className={`transition-transform duration-300 ${showSkpdDropdown ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {showSkpdDropdown && (
                    <div 
                      className="absolute z-50 mt-3 w-[150%] md:w-full right-0 md:left-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-72 overflow-y-auto custom-scrollbar border animate-in fade-in slide-in-from-top-2 duration-300"
                      style={{ 
                        backgroundColor: isDarkMode ? 'rgba(30, 46, 45, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                        border: `1px solid ${colors.gold}40`,
                        backdropFilter: 'blur(20px)'
                      }}
                    >
                      <button 
                        type="button" 
                        onClick={() => selectAllSkpd(false)} 
                        className="w-full text-left p-4 text-xs font-black uppercase tracking-widest border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors sticky top-0 z-10 backdrop-blur-md"
                        style={{ 
                          borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.1)',
                          color: colors.gold
                        }}
                      >
                        {newUser.assignedSkpds.length === skpdList.length ? 'Bersihkan Seleksi' : 'Pilih Semua Domain'}
                      </button>
                      
                      <div className="p-2 space-y-1">
                        {skpdList.map(s => (
                          <label key={s.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group/chk"
                            style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
                          >
                            <div className="relative flex items-center justify-center mt-0.5">
                              <input 
                                type="checkbox" 
                                checked={newUser.assignedSkpds?.includes(s.id)} 
                                onChange={() => toggleSkpdSelection(s.id, false)} 
                                className="peer w-4 h-4 rounded cursor-pointer appearance-none border border-[#d7a217] checked:bg-[#d7a217] transition-all"
                              />
                              <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                            <span className="text-sm font-semibold leading-tight group-hover/chk:text-[#d7a217] transition-colors">{String(s.nama)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : newUser.level === 'TAPD' ? (
                <div 
                  className={`${glassInput} text-center font-black uppercase tracking-widest opacity-80`}
                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                >
                  Akses Bebas (Read-Only)
                </div>
              ) : (
                <div 
                  className={`${glassInput} text-center font-black uppercase tracking-widest opacity-80`}
                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                >
                  Super Akses Global
                </div>
              )}
            </div>
            
            {/* Submit Button - Full Width */}
            <div className="md:col-span-2 lg:col-span-4 mt-2">
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_25px_-5px_rgba(215,162,23,0.4)] transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(215,162,23,0.6)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-[length:200%_auto] hover:bg-[position:right_center]"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.gold} 0%, #e6b32a 50%, #b8860b 100%)`,
                  color: 'white'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer pointer-events-none"></div>
                <UserPlus size={20} className="drop-shadow-md transition-transform group-hover/btn:scale-110 duration-500" />
                <span className="relative z-10 drop-shadow-md">
                  {isProcessing ? 'MENYINKRONKAN OTORISASI...' : 'TERBITKAN AKSES BARU'}
                </span>
              </button>
            </div>
          </form>
        </div>
        
        {/* Tabel Users */}
        <div 
          className="backdrop-blur-2xl rounded-3xl border flex flex-col overflow-hidden transition-all duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative z-0 animate-slide-up-fade animation-delay-200"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(26, 43, 41, 0.6)' : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)'
          }}
        >
          {/* Header Table */}
          <div 
            className="p-6 md:p-8 border-b flex justify-between items-center backdrop-blur-md relative z-10 shadow-sm"
            style={{ 
              borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)',
              backgroundColor: isDarkMode ? 'rgba(20, 30, 29, 0.4)' : 'rgba(240, 245, 245, 0.6)'
            }}
          >
            <span className="font-black text-sm md:text-base uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 shadow-inner border border-black/5 dark:border-white/10">
                <Users size={18} style={{ color: colors.gold }} />
              </div>
              Direktori Pengguna
            </span>
            <span 
              className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-inner border"
              style={{ 
                backgroundColor: `${colors.gold}15`,
                color: colors.gold,
                borderColor: `${colors.gold}30`
              }}
            >
              {usersList.length} Akun Aktif
            </span>
          </div>

          <div className="overflow-x-auto relative z-10 custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="text-xs font-black uppercase tracking-widest bg-black/5 dark:bg-black/20" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                  {/* Penyesuaian Lebar Kolom */}
                  <th className="p-5 pl-8 whitespace-nowrap w-[25%]">Identitas / Email</th>
                  <th className="p-5 whitespace-nowrap w-[20%]">Sistem UID</th>
                  <th className="p-5 text-center whitespace-nowrap w-[15%]">Tingkat Otorisasi</th>
                  <th className="p-5 whitespace-nowrap w-[30%]">Area Resolusi</th>
                  <th className="p-5 text-center whitespace-nowrap pr-8 w-[10%]">Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y transition-colors duration-500" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.05)' : 'rgba(202,223,223,0.3)' }}>
                {usersList.length > 0 ? (
                  usersList.map((u, idx) => {
                    const badgeStyle = getLevelBadgeStyle(u.level);
                    return (
                      <tr 
                        key={u.id || idx} 
                        className={`transition-all duration-500 hover:bg-gradient-to-r hover:from-transparent ${isDarkMode ? 'hover:via-white/5' : 'hover:via-[#d7a217]/5'} hover:to-transparent group relative`}
                      >
                        {/* Highlight border on hover */}
                        <td className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d7a217] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></td>

                        <td className="p-5 pl-8 align-middle">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d7a217]/20 to-transparent border border-[#d7a217]/30 shadow-inner flex items-center justify-center text-[#d7a217] shrink-0 group-hover:scale-110 transition-transform duration-300">
                              {u.nama?.charAt(0).toUpperCase() || <User size={18} />}
                            </div>
                            <div className="flex flex-col min-w-0"> {/* Mencegah text overflow */}
                              <span className="font-black text-sm md:text-base drop-shadow-sm truncate" style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }} title={u.nama || 'Unnamed User'}>
                                {u.nama || 'Unnamed User'}
                              </span>
                              <span className="text-[10px] font-bold mt-0.5 opacity-60 flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>
                                <Mail size={10} className="shrink-0" /> <span className="truncate">Akun Terverifikasi</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <code className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono font-bold tracking-wider shadow-inner block w-full truncate text-center" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }} title={u.uid || 'N/A'}>
                            {u.uid || 'N/A'}
                          </code>
                        </td>
                        <td className="p-5 text-center align-middle">
                          <div className="inline-flex relative group/badge">
                            <div className="absolute inset-0 blur-md opacity-40 rounded-xl" style={{ backgroundColor: badgeStyle.text }}></div>
                            <span 
                              className="relative px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-sm transition-transform duration-300 group-hover/badge:scale-105 block w-max mx-auto"
                              style={{ 
                                backgroundColor: badgeStyle.bg,
                                color: badgeStyle.text,
                                border: `1px solid ${badgeStyle.border}`
                              }}
                            >
                              {u.level || 'VIEWER'}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <p className="text-sm font-bold leading-relaxed w-full truncate" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                            {u.level === 'Super Admin' ? 'Super Admin (Akses Penuh)' : 
                             u.level === 'Admin' ? 'Admin Kontrol Sistem' : 
                             u.level === 'Kepala Sub Bidang' ? 'Otoritas Persetujuan Final' :
                             u.level === 'Operator BKAD' ? <span className="text-[#d7a217]">{u.assignedSkpds?.length || 0} Domain Terhubung</span> : 
                             u.level === 'SKPD' ? (skpdList.find(s => s.id === u.skpdId)?.nama || "Domain Tidak Diketahui") : 
                             'Monitoring Global'}
                          </p>
                        </td>
                        <td className="p-5 pr-8 text-center align-middle">
                          <div className="flex items-center justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                            <button 
                              onClick={() => handleEditClick(u)} 
                              className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(215,162,23,0.3)] border bg-black/5 dark:bg-white/5 shrink-0"
                              style={{ borderColor: `${colors.gold}40` }}
                              title="Edit Konfigurasi"
                            >
                              <Edit3 size={16} className="text-[#d7a217]" />
                            </button>
                            
                            <button 
                              onClick={() => onDelete(u)} 
                              className="p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(225,29,72,0.3)] border bg-black/5 dark:bg-white/5 group/del shrink-0"
                              style={{ borderColor: 'rgba(225, 29, 72, 0.3)' }}
                              title="Cabut Akses"
                            >
                              <Trash2 size={16} className="text-rose-500 group-hover/del:animate-pulse" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-24 text-center">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <div className="absolute inset-0 bg-[#d7a217] blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
                        <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-[#d7a217]/10 to-transparent border border-[#d7a217]/30 backdrop-blur-md shadow-inner">
                          <Users size={48} className="text-[#d7a217]" />
                        </div>
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-[0.2em] mb-2" style={{ color: colors.gold }}>Direktori Kosong</h4>
                      <p className="text-base font-medium opacity-70" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                        Belum ada matriks pengguna yang dikonfigurasi dalam sistem.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL EDIT USER - Premium Glassmorphism */}
      {showEditModal && editingUser && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="max-w-4xl w-full rounded-3xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] border animate-in zoom-in-95 duration-300 relative"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(20, 30, 29, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: `${colors.gold}40`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Ambient Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#d7a217] blur-[100px] opacity-20 pointer-events-none"></div>

            {/* Header Modal */}
            <div 
              className="p-6 md:p-8 border-b flex justify-between items-center relative z-10 shadow-md"
              style={{ 
                background: `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/10 shadow-inner border border-white/20">
                  <UserCog size={24} className="text-[#d7a217]" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-widest drop-shadow-md">Re-Konfigurasi Akses</h3>
                  <p className="text-[10px] md:text-xs text-white/70 font-bold uppercase tracking-widest mt-1">Sistem Otorisasi User</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-3 rounded-xl bg-white/10 hover:bg-rose-500 hover:text-white transition-all duration-300 text-white/70 group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar relative z-10">
              <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                
                {/* Kolom Kiri: Identitas */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-dashed" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.2)' : 'rgba(66,92,90,0.2)' }}>
                    <User size={18} style={{ color: colors.gold }} />
                    <h4 className="font-black uppercase tracking-widest text-sm" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>Data Identitas</h4>
                  </div>

                  <div className="space-y-2 relative group/edit-input">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      Nama / Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/edit-input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                      <input 
                        required 
                        value={editingUser.nama} 
                        onChange={e => setEditingUser({...editingUser, nama: e.target.value})} 
                        className={`${glassInput} relative z-10`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 relative group/edit-input">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1 flex justify-between items-center" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      <span>UID Sistem</span>
                      <span className="text-[9px] px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded border border-rose-500/20">Kritikal</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/edit-input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                      <input 
                        required 
                        value={editingUser.uid} 
                        onChange={e => setEditingUser({...editingUser, uid: e.target.value})} 
                        className={`${glassInput} relative z-10 font-mono`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Otorisasi */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-dashed" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.2)' : 'rgba(66,92,90,0.2)' }}>
                    <Shield size={18} style={{ color: colors.gold }} />
                    <h4 className="font-black uppercase tracking-widest text-sm" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>Otorisasi & Lingkup</h4>
                  </div>

                  <div className="space-y-2 relative group/edit-input">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      Tingkat Akses
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/edit-input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                      <select 
                        value={editingUser.level} 
                        onChange={e => handleLevelChange(e.target.value, true)} 
                        className={`${glassInput} relative z-10 font-bold appearance-none`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      >
                        <option value="SKPD">SKPD / Instansi</option>
                        <option value="Operator BKAD">OPERATOR BKAD</option>
                        <option value="Kepala Sub Bidang">KEPALA SUB BIDANG</option>
                        <option value="Admin">ADMIN KONTROL</option>
                        <option value="Super Admin">SUPER ADMIN</option>
                        <option value="TAPD">VIEWER / TAPD</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2 relative group/edit-input">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      Ruang Lingkup
                    </label>
                    
                    {editingUser.level === 'SKPD' ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/edit-input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                        <select 
                          value={editingUser.skpdId || ''} 
                          onChange={e => setEditingUser({...editingUser, skpdId: e.target.value})} 
                          className={`${glassInput} relative z-10 font-bold appearance-none`}
                          style={{ borderWidth: '1px', borderStyle: 'solid' }}
                        >
                          <option value="">Pilih Pemetaan Instansi...</option>
                          {skpdList.map(s => (
                            <option key={s.id} value={s.id}>{String(s.nama)}</option>
                          ))}
                        </select>
                      </div>
                    ) : editingUser.level === 'Operator BKAD' ? (
                      <div className="relative z-20">
                        <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/edit-input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                        <button 
                          type="button" 
                          onClick={() => setShowEditSkpdDropdown(!showEditSkpdDropdown)}
                          className={`${glassInput} flex justify-between items-center relative z-10 font-bold`}
                          style={{ borderWidth: '1px', borderStyle: 'solid' }}
                        >
                          <span className={editingUser.assignedSkpds?.length > 0 ? `text-[${colors.gold}]` : ''}>
                            {editingUser.assignedSkpds?.length || 0} Domain Terpilih
                          </span>
                          <ChevronRight size={18} style={{ color: colors.gold }} className={`transition-transform duration-300 ${showEditSkpdDropdown ? 'rotate-90' : ''}`} />
                        </button>
                        
                        {showEditSkpdDropdown && (
                          <div 
                            className="absolute z-50 mt-3 w-[150%] right-0 md:left-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-64 overflow-y-auto custom-scrollbar border animate-in fade-in slide-in-from-top-2 duration-300"
                            style={{ 
                              backgroundColor: isDarkMode ? 'rgba(30, 46, 45, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                              border: `1px solid ${colors.gold}40`,
                              backdropFilter: 'blur(20px)'
                            }}
                          >
                            <button 
                              type="button" 
                              onClick={() => selectAllSkpd(true)} 
                              className="w-full text-left p-4 text-xs font-black uppercase tracking-widest border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors sticky top-0 z-10 backdrop-blur-md"
                              style={{ 
                                borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.1)',
                                color: colors.gold
                              }}
                            >
                              {editingUser.assignedSkpds?.length === skpdList.length ? 'Bersihkan Seleksi' : 'Pilih Semua Domain'}
                            </button>
                            
                            <div className="p-2 space-y-1">
                              {skpdList.map(s => (
                                <label key={s.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group/chk"
                                  style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}
                                >
                                  <div className="relative flex items-center justify-center mt-0.5">
                                    <input 
                                      type="checkbox" 
                                      checked={editingUser.assignedSkpds?.includes(s.id)} 
                                      onChange={() => toggleSkpdSelection(s.id, true)} 
                                      className="peer w-4 h-4 rounded cursor-pointer appearance-none border border-[#d7a217] checked:bg-[#d7a217] transition-all"
                                    />
                                    <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                  </div>
                                  <span className="text-sm font-semibold leading-tight group-hover/chk:text-[#d7a217] transition-colors">{String(s.nama)}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : editingUser.level === 'TAPD' ? (
                      <div 
                        className={`${glassInput} text-center font-black uppercase tracking-widest opacity-80`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      >
                        Akses Bebas (Read-Only)
                      </div>
                    ) : (
                      <div 
                        className={`${glassInput} text-center font-black uppercase tracking-widest opacity-80`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      >
                        Super Akses Global
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Modal Actions */}
                <div className="col-span-full mt-6 pt-6 border-t flex flex-col-reverse sm:flex-row justify-end gap-4" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)' }}>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] border shadow-sm"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'white',
                      borderColor: isDarkMode ? 'transparent' : colors.tealPale,
                      color: isDarkMode ? colors.tealLight : colors.tealDark
                    }}
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-[0.15em] shadow-[0_10px_25px_-5px_rgba(215,162,23,0.4)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(215,162,23,0.6)] disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group/btns bg-[length:200%_auto] hover:bg-[position:right_center]"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.gold} 0%, #e6b32a 50%, #b8860b 100%)`,
                      color: 'white'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btns:animate-shimmer pointer-events-none"></div>
                    {isProcessing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin drop-shadow-md" />
                        MEMPROSES...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} className="drop-shadow-md group-hover/btns:scale-110 transition-transform" />
                        TERAPKAN PERUBAHAN
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; margin: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.4); border-radius: 10px; transition: all 0.3s; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.8); }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0; }
          20% { opacity: var(--tw-opacity, 0.8); transform: scale(1.2) rotate(45deg); }
          80% { opacity: var(--tw-opacity, 0.8); transform: scale(0.8) rotate(90deg); }
          100% { transform: translateY(-120vh) translateX(100px) scale(1) rotate(180deg); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-shimmer { animation: shimmer 2.5s infinite linear; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        .animate-slide-up-fade { animation: slide-up-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
};

export default UsersTab;