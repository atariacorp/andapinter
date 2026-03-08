import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, UserCog, Briefcase, Hash, Trash2,
  Edit3, Check, X, GripVertical, ArrowUp, ArrowDown
} from 'lucide-react';
import MasterDataTable from '../common/MasterDataTable';

// --- Komponen Partikel Emas Mengambang ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 1.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 25 + 15,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.4 + 0.1,
      blur: Math.random() * 2,
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
            filter: `blur(${p.blur}px)`,
            animationDuration: `${p.animDuration}s`,
            animationDelay: `${p.animDelay}s`,
            boxShadow: `0 0 ${p.size * 4}px ${p.size * 1.5}px rgba(215, 162, 23, 0.4)`,
          }}
        />
      ))}
    </div>
  );
};

const TapdTab = ({ 
  tapdList, 
  onAdd, 
  onEdit,      // <-- TAMBAHKAN PROPS EDIT
  onDelete, 
  onReorder,   // <-- TAMBAHKAN PROPS REORDER
  isProcessing,
  isDarkMode,
  colors 
}) => {
  const [newTapd, setNewTapd] = useState({ nip: '', nama: '', jabatan: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nip: '', nama: '', jabatan: '' });
  const [localTapdList, setLocalTapdList] = useState(tapdList);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  // State untuk efek paralaks mouse
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sinkronisasi local list dengan props
  useEffect(() => {
    setLocalTapdList(tapdList);
  }, [tapdList]);

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

  // Handler Edit
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditForm({
      nip: item.nip,
      nama: item.nama,
      jabatan: item.jabatan
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ nip: '', nama: '', jabatan: '' });
  };

  const handleEditSave = (id) => {
    if (!editForm.nama.trim() || !editForm.nip.trim() || !editForm.jabatan.trim()) {
      alert("Lengkapi semua field");
      return;
    }
    onEdit(id, editForm);
    setEditingId(null);
    setEditForm({ nip: '', nama: '', jabatan: '' });
  };

  // Handler Drag & Drop
  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragEnter = (index) => {
    setDragOverItem(index);
  };

  const handleDragEnd = () => {
    if (draggedItem !== null && dragOverItem !== null && draggedItem !== dragOverItem) {
      const newList = [...localTapdList];
      const draggedItemContent = newList[draggedItem];
      
      // Hapus item yang di-drag
      newList.splice(draggedItem, 1);
      // Masukkan di posisi baru
      newList.splice(dragOverItem, 0, draggedItemContent);
      
      setLocalTapdList(newList);
      
      // Panggil callback reorder ke parent
      if (onReorder) {
        onReorder(newList);
      }
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // Handler Pindah Manual (Tombol Atas/Bawah)
  const handleMoveUp = (index) => {
    if (index === 0) return;
    
    const newList = [...localTapdList];
    const temp = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = temp;
    
    setLocalTapdList(newList);
    
    if (onReorder) {
      onReorder(newList);
    }
  };

  const handleMoveDown = (index) => {
    if (index === localTapdList.length - 1) return;
    
    const newList = [...localTapdList];
    const temp = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = temp;
    
    setLocalTapdList(newList);
    
    if (onReorder) {
      onReorder(newList);
    }
  };

  // --- Advanced Glassmorphism Styles ---
  const glassCard = `backdrop-blur-2xl border transition-all duration-700 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_40px_-10px_rgba(215,162,23,0.25)] relative overflow-hidden group p-6 md:p-8 rounded-3xl ${
    isDarkMode 
      ? 'bg-gradient-to-br from-[#3c5654]/40 to-[#2a3f3d]/60 border-[#cadfdf]/10' 
      : 'bg-gradient-to-br from-white/70 to-white/40 border-white/60'
  }`;

  const glassInput = `w-full px-5 py-3.5 rounded-xl text-sm md:text-base outline-none transition-all duration-500 focus:ring-2 focus:ring-[#d7a217]/50 focus:shadow-[0_0_20px_rgba(215,162,23,0.2)] appearance-none ${
    isDarkMode 
      ? 'bg-[#1e2e2d]/50 border-[#cadfdf]/20 text-[#e2eceb] focus:bg-[#1e2e2d]/80 placeholder-[#cadfdf]/40' 
      : 'bg-white/50 border-white/80 text-[#425c5a] focus:bg-white/90 placeholder-[#3c5654]/50'
  }`;

  return (
    <div className="relative animate-in fade-in duration-500 pb-12">
      
      {/* Background Decorative Ambient with Parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-3xl">
        <div 
          className="absolute -top-[10%] right-[5%] w-80 h-80 bg-[#d7a217] blur-[120px] opacity-10 transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(${mousePos.x * -1}px, ${mousePos.y * -1}px, 0)` }}
        ></div>
        <div 
          className="absolute bottom-[20%] -left-[5%] w-96 h-96 bg-[#425c5a] blur-[140px] opacity-10 transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px, 0)` }}
        ></div>
      </div>
      
      {/* Grid Pattern with Depth */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(10deg) scale(1.1)',
          transformOrigin: 'top center'
        }}
      />
      
      <FloatingGoldParticles />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10 flex-col-reverse lg:flex-row">
        
        {/* KOLOM KIRI - Data Table (Daftar Anggota) */}
        <div className="lg:col-span-7 flex flex-col h-full animate-slide-up-fade animation-delay-200 order-2 lg:order-1">
          <div 
            className="backdrop-blur-3xl rounded-3xl border h-[680px] flex flex-col overflow-hidden transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(26, 43, 41, 0.7)' : 'rgba(255, 255, 255, 0.85)',
              borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)'
            }}
          >
            {/* Header Table Premium */}
            <div 
              className="p-6 md:p-8 border-b flex justify-between items-center backdrop-blur-md relative z-20 shadow-sm"
              style={{ 
                borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)',
                backgroundColor: isDarkMode ? 'rgba(20, 30, 29, 0.6)' : 'rgba(240, 245, 245, 0.8)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-inner">
                  <Users size={20} style={{ color: colors.gold }} />
                </div>
                <span className="font-black text-base md:text-lg uppercase tracking-[0.2em] bg-clip-text text-transparent drop-shadow-sm" style={{ backgroundImage: isDarkMode ? `linear-gradient(to right, ${colors.tealLight}, #ffffff)` : `linear-gradient(to right, ${colors.tealDark}, ${colors.tealMedium})` }}>
                  Daftar Anggota TAPD
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden md:flex text-[10px] font-black uppercase tracking-widest opacity-60 items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                  <GripVertical size={14} /> Drag to reorder
                </span>
                <span 
                  className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-inner border backdrop-blur-sm transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: `${colors.gold}15`,
                    color: colors.gold,
                    borderColor: `${colors.gold}30`
                  }}
                >
                  {localTapdList.length} Terdaftar
                </span>
              </div>
            </div>
            
            {/* Content Table dengan Drag & Drop & Inline Edit */}
            <div className="overflow-y-auto p-4 md:p-6 grid grid-cols-1 gap-4 custom-scrollbar flex-1 relative z-10 bg-black/5 dark:bg-black/20">
              {localTapdList.length > 0 ? (
                localTapdList.map((item, index) => {
                  const isDragging = draggedItem === index;
                  const isDragOver = dragOverItem === index && draggedItem !== index;
                  const isEditing = editingId === item.id;

                  return (
                    <div 
                      key={item.id || index} 
                      draggable={!isEditing}
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      className={`p-4 md:p-5 rounded-2xl flex justify-between items-center group/item transition-all duration-300 relative overflow-hidden ${
                        isDragging 
                          ? 'opacity-80 scale-105 shadow-[0_30px_60px_-15px_rgba(215,162,23,0.4)] z-50 ring-2 ring-[#d7a217]' 
                          : isDragOver 
                            ? 'border-2 border-dashed border-[#d7a217] scale-[1.02] shadow-[0_0_30px_rgba(215,162,23,0.15)] translate-y-2' 
                            : 'hover:scale-[1.01] hover:shadow-md'
                      }`}
                      style={{ 
                        backgroundColor: isEditing ? (isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)') : isDragOver ? 'rgba(215, 162, 23, 0.05)' : (isDarkMode ? 'rgba(40, 58, 56, 0.8)' : 'rgba(255, 255, 255, 0.9)'),
                        border: isEditing ? `1px solid ${colors.gold}` : isDragOver 
                          ? `2px dashed ${colors.gold}`
                          : `1px solid ${isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.15)'}`,
                        cursor: isEditing ? 'default' : (isDragging ? 'grabbing' : 'grab')
                      }}
                    >
                      {/* Highlight Bar & Inner Shine */}
                      {!isEditing && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#d7a217] to-[#b8860b] scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-center"></div>}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full group-hover/item:animate-shimmer pointer-events-none"></div>

                      <div className="flex-1 flex items-start sm:items-center gap-3 md:gap-4 relative z-10 w-full">
                        
                        {/* Drag & Drop Grip Handle */}
                        <div 
                          className={`cursor-grab active:cursor-grabbing p-1.5 transition-all opacity-30 hover:opacity-100 hover:bg-[#d7a217]/10 rounded-lg hidden sm:block ${isEditing ? 'invisible' : ''}`}
                          style={{ color: colors.gold }}
                          title="Tahan dan geser untuk merubah urutan"
                        >
                          <GripVertical size={18} className={isDragging ? "animate-pulse" : ""} />
                        </div>

                        {/* Nomor Urut (ECharts Style) */}
                        <div className="w-8 h-8 rounded-lg flex flex-col items-center justify-center font-black opacity-60 border border-dashed shrink-0" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark, borderColor: isDarkMode ? 'rgba(202,223,223,0.3)' : 'rgba(66,92,90,0.3)', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)' }}>
                          <span className="text-[9px] leading-none">NO</span>
                          <span className="text-sm leading-none">{index + 1}</span>
                        </div>
                        
                        {/* Initial Avatar */}
                        <div 
                          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-lg md:text-xl font-black shadow-inner border shrink-0 transition-transform duration-500 group-hover/item:scale-110 group-hover/item:rotate-3"
                          style={{ 
                            backgroundColor: `${colors.gold}15`, 
                            color: colors.gold,
                            borderColor: `${colors.gold}30`
                          }}
                        >
                          {item.nama?.charAt(0).toUpperCase() || 'T'}
                        </div>
                        
                        {/* Data Text / Inline Edit Area */}
                        <div className="flex flex-col gap-1 min-w-0 py-0.5 flex-1 pr-2">
                          {isEditing ? (
                            <>
                              <input 
                                type="text" 
                                value={editForm.nama} 
                                onChange={(e) => setEditForm({...editForm, nama: e.target.value})} 
                                className="w-full bg-transparent border-b border-dashed border-[#d7a217]/50 focus:border-[#d7a217] outline-none font-bold text-sm md:text-base pb-1 transition-colors"
                                style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}
                                placeholder="Nama Lengkap"
                                autoFocus
                              />
                              <input 
                                type="text" 
                                value={editForm.jabatan} 
                                onChange={(e) => setEditForm({...editForm, jabatan: e.target.value})} 
                                className="w-full bg-transparent border-b border-dashed border-[#d7a217]/50 focus:border-[#d7a217] outline-none text-[10px] md:text-xs font-bold uppercase tracking-widest pb-1 transition-colors"
                                style={{ color: colors.gold }}
                                placeholder="Jabatan"
                              />
                              <div className="flex items-center mt-1">
                                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md border shadow-sm backdrop-blur-sm flex items-center gap-1.5 w-full max-w-xs transition-colors focus-within:border-[#d7a217]" style={{ 
                                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(66,92,90,0.05)',
                                  borderColor: isDarkMode ? 'rgba(202,223,223,0.3)' : 'rgba(66,92,90,0.3)'
                                }}>
                                  <Hash size={10} style={{ color: colors.gold }} className="opacity-70 shrink-0" />
                                  <input 
                                    type="text" 
                                    value={editForm.nip} 
                                    onChange={(e) => setEditForm({...editForm, nip: e.target.value})} 
                                    className="bg-transparent outline-none w-full font-mono text-[10px] placeholder-opacity-50"
                                    style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}
                                    placeholder="NIP / ID"
                                  />
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="font-bold text-sm md:text-base truncate drop-shadow-sm transition-colors duration-300" style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}>
                                {item.nama}
                              </p>
                              <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider truncate" style={{ color: colors.gold }}>
                                {item.jabatan}
                              </p>
                              <div className="flex items-center mt-1">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded border shadow-sm backdrop-blur-sm flex items-center gap-1 opacity-90" style={{ 
                                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(66,92,90,0.05)',
                                  color: isDarkMode ? colors.tealPale : colors.tealMedium,
                                  borderColor: isDarkMode ? 'rgba(202,223,223,0.2)' : 'rgba(66,92,90,0.2)'
                                }}>
                                  <Hash size={10} className="opacity-50" />
                                  {item.nip}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Tombol Aksi (Kanan) */}
                      <div className="shrink-0 flex items-center gap-2 relative z-10 ml-2">
                        {isEditing ? (
                          // TOMBOL SAVE & CANCEL
                          <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                            <button 
                              onClick={handleEditCancel} 
                              className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] border"
                              style={{ 
                                backgroundColor: 'rgba(225, 29, 72, 0.1)', 
                                color: '#f43f5e',
                                borderColor: 'rgba(225, 29, 72, 0.3)'
                              }}
                              title="Batal"
                            >
                              <X size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditSave(item.id)} 
                              disabled={isProcessing}
                              className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(215,162,23,0.5)] border disabled:opacity-50"
                              style={{ 
                                background: `linear-gradient(135deg, ${colors.gold} 0%, #b8860b 100%)`, 
                                color: 'white',
                                borderColor: 'transparent'
                              }}
                              title="Simpan"
                            >
                              <Check size={16} className="drop-shadow-md" />
                            </button>
                          </div>
                        ) : (
                          // TOMBOL UP/DOWN, EDIT & DELETE
                          <>
                            <div className="hidden lg:flex flex-col gap-1 mr-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={() => handleMoveUp(index)}
                                disabled={index === 0}
                                className="p-1 rounded transition-all hover:bg-[#d7a217]/20 hover:shadow-md disabled:opacity-20 disabled:hover:bg-transparent border border-transparent hover:border-[#d7a217]/30"
                                title="Naikkan Urutan"
                              >
                                <ArrowUp size={12} style={{ color: colors.gold }} />
                              </button>
                              <button
                                onClick={() => handleMoveDown(index)}
                                disabled={index === localTapdList.length - 1}
                                className="p-1 rounded transition-all hover:bg-[#d7a217]/20 hover:shadow-md disabled:opacity-20 disabled:hover:bg-transparent border border-transparent hover:border-[#d7a217]/30"
                                title="Turunkan Urutan"
                              >
                                <ArrowDown size={12} style={{ color: colors.gold }} />
                              </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 opacity-100 lg:opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform lg:translate-x-4 group-hover/item:translate-x-0">
                              <button 
                                onClick={() => handleEditClick(item)} 
                                className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(215,162,23,0.4)] border bg-white/50 dark:bg-black/20 backdrop-blur-md"
                                style={{ 
                                  color: colors.gold,
                                  borderColor: `${colors.gold}40`
                                }}
                                title="Edit Anggota"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => onDelete(item)} 
                                className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(225,29,72,0.4)] border bg-white/50 dark:bg-black/20 backdrop-blur-md group/del"
                                style={{ 
                                  color: '#f43f5e',
                                  borderColor: 'rgba(225, 29, 72, 0.3)'
                                }}
                                title="Hapus Anggota"
                              >
                                <Trash2 size={16} className="group-hover/del:animate-pulse" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-60 animate-in fade-in duration-500 py-12">
                  <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 bg-[#d7a217] blur-3xl opacity-20 rounded-full animate-pulse-slow"></div>
                    <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-[#d7a217]/10 to-transparent border border-[#d7a217]/30 backdrop-blur-md shadow-inner">
                      <Users size={48} style={{ color: colors.gold }} />
                    </div>
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-[0.2em] mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#d7a217] to-[#b8860b]">
                    Data TAPD Kosong
                  </h4>
                  <p className="text-sm md:text-base font-bold tracking-wide text-center max-w-md leading-relaxed" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                    Belum ada anggota Tim Anggaran Pemerintah Daerah yang terdaftar di sistem e-budgeting.
                  </p>
                </div>
              )}
            </div>
            
            {/* Footer Table Info */}
            {localTapdList.length > 0 && (
              <div className="p-4 border-t text-center text-[10px] font-bold uppercase tracking-widest opacity-60 backdrop-blur-md" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)', color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Urutan daftar ini merepresentasikan urutan pada dokumen Berita Acara (BA).
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN - Form Tambah */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8 animate-slide-up-fade animation-delay-100 order-1 lg:order-2">
          
          {/* Form Tambah TAPD */}
          <div className={glassCard}>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10 border-b pb-6" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.1)' }}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#d7a217]/20 to-transparent border border-[#d7a217]/30 shadow-[inset_0_0_15px_rgba(215,162,23,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <UserCog size={28} style={{ color: colors.gold }} className="drop-shadow-md" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-widest" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  Pendaftaran TAPD
                </h3>
                <p className="text-xs font-bold mt-1 opacity-60 uppercase tracking-wider" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>Entri Data Tim Anggaran</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              {/* NIP */}
              <div className="space-y-2 relative group/input">
                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-1 opacity-80" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  <Hash size={16} style={{ color: colors.gold }} />
                  NIP / ID Pegawai
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl pointer-events-none"></div>
                  <input 
                    required 
                    value={newTapd.nip} 
                    onChange={e => handleChange('nip', e.target.value)} 
                    placeholder="Contoh: 198001012005011001" 
                    className={`${glassInput} relative z-10 font-mono tracking-wider`}
                    style={{ borderWidth: '1px', borderStyle: 'solid' }}
                  />
                </div>
              </div>
              
              {/* Nama Lengkap */}
              <div className="space-y-2 relative group/input">
                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-1 opacity-80" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  <Users size={16} style={{ color: colors.gold }} />
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl pointer-events-none"></div>
                  <input 
                    required 
                    value={newTapd.nama} 
                    onChange={e => handleChange('nama', e.target.value)} 
                    placeholder="Nama Pejabat beserta Gelar..." 
                    className={`${glassInput} relative z-10 font-bold`}
                    style={{ borderWidth: '1px', borderStyle: 'solid' }}
                  />
                </div>
              </div>
              
              {/* Jabatan */}
              <div className="space-y-2 relative group/input">
                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-1 opacity-80" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  <Briefcase size={16} style={{ color: colors.gold }} />
                  Posisi / Jabatan
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl pointer-events-none"></div>
                  <input 
                    required 
                    value={newTapd.jabatan} 
                    onChange={e => handleChange('jabatan', e.target.value)} 
                    placeholder="Contoh: KEPALA DINAS" 
                    className={`${glassInput} relative z-10 font-bold`}
                    style={{ borderWidth: '1px', borderStyle: 'solid' }}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full mt-6 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(215,162,23,0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_rgba(215,162,23,0.7)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-[length:200%_auto] hover:bg-[position:right_center]"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.gold} 0%, #e6b32a 50%, #b8860b 100%)`,
                  color: 'white',
                  border: 'none'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer pointer-events-none"></div>
                <Plus size={20} className="drop-shadow-md transition-transform group-hover/btn:rotate-90 duration-500" />
                <span className="relative z-10 drop-shadow-md">
                  {isProcessing ? 'MENYIMPAN DATA...' : 'DAFTARKAN ANGGOTA TAPD'}
                </span>
              </button>
            </form>
          </div>
          
          {/* Informasi */}
          <div 
            className="p-6 md:p-8 rounded-3xl border border-dashed relative overflow-hidden group animate-slide-up-fade animation-delay-100 shadow-sm"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
              borderColor: isDarkMode ? 'rgba(215, 162, 23, 0.3)' : 'rgba(215, 162, 23, 0.5)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d7a217]/5 to-transparent pointer-events-none"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 rounded-2xl bg-[#d7a217]/10 shadow-[inset_0_0_10px_rgba(215,162,23,0.1)] shrink-0 border border-[#d7a217]/20 group-hover:scale-110 transition-transform duration-500">
                <Briefcase size={24} style={{ color: colors.gold }} />
              </div>
              <div>
                <p className="text-sm md:text-base font-black mb-2 uppercase tracking-widest" style={{ color: colors.gold }}>Informasi Struktur TAPD</p>
                <p className="text-xs md:text-sm font-semibold leading-relaxed tracking-wide" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                  Nama yang terdaftar pada sistem akan otomatis direferensikan untuk <strong style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>kolom tanda tangan verifikator</strong> pada pembuatan dokumen Berita Acara (BA) cetak. 
                </p>
                <div className="mt-4 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-3">
                  <GripVertical size={18} style={{ color: colors.gold }} className="shrink-0 animate-pulse-slow" /> 
                  <span className="text-xs font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                    Tahan dan geser (drag & drop) ikon daftar di samping untuk mengatur urutan Tanda Tangan.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; margin: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, transparent, rgba(215, 162, 23, 0.4), transparent); border-radius: 10px; transition: all 0.3s; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #d7a217, #b8860b); box-shadow: 0 0 10px rgba(215, 162, 23, 0.5); }

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

export default TapdTab;