import React, { useState, useEffect } from 'react';
import { Database, Edit3, Trash2, Plus, X, CheckCircle, Save } from 'lucide-react';

// --- Komponen Partikel Emas Mengambang (Khusus Panel Ini) ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 15 + 10,
      animDelay: Math.random() * -20,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-2xl">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#d7a217] animate-float-bank"
          style={{
            width: `${p.size}px`, height: `${p.size}px`,
            left: `${p.left}%`, top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.animDuration}s`,
            animationDelay: `${p.animDelay}s`,
            boxShadow: `0 0 ${p.size * 2}px #d7a217`,
          }}
        />
      ))}
    </div>
  );
};

const BankCatatanPanel = ({ 
  bankCatatan, 
  onTambah, 
  onEdit, 
  onHapus, 
  onGunakan,
  isProcessing,
  currentUser,
  isDarkMode,
  colors // Tetap menerima props colors dari parent agar tidak error
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

  // --- Konstanta Desain ---
  const glassInput = isDarkMode
    ? "bg-black/20 border border-[#cadfdf]/20 text-[#e2eceb] focus:ring-2 focus:ring-[#d7a217]/50 rounded-xl outline-none transition-all duration-300 placeholder-[#cadfdf]/40"
    : "bg-white/70 border border-[#cadfdf]/60 text-[#425c5a] focus:ring-2 focus:ring-[#d7a217]/50 rounded-xl outline-none transition-all duration-300 placeholder-[#3c5654]/50";

  return (
    <div 
      className={`relative mb-6 rounded-2xl overflow-hidden backdrop-blur-xl border transition-all duration-500 hover:shadow-xl group/bank ${
        isDarkMode 
          ? 'bg-[#3c5654]/40 border-[#cadfdf]/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]' 
          : 'bg-white/60 border-[#cadfdf]/80 shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Background Aesthetic ECharts (Subtle Grid) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(#d7a217 1px, transparent 1px), linear-gradient(90deg, #d7a217 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      />
      <FloatingGoldParticles />

      {/* Header */}
      <div className={`relative z-10 flex justify-between items-center p-5 border-b backdrop-blur-md transition-colors ${isDarkMode ? 'border-[#cadfdf]/10 bg-[#3c5654]/50' : 'border-[#cadfdf]/50 bg-white/50'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#d7a217]/20 flex items-center justify-center text-[#d7a217] shadow-inner">
            <Database size={16} />
          </div>
          <h5 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#425c5a]'}`}>
            Bank Catatan Analisa
          </h5>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all duration-300 shadow-sm hover:scale-105 ${
            showForm 
              ? 'bg-[#3c5654]/20 text-[#3c5654] border border-[#3c5654]/30 dark:bg-[#cadfdf]/10 dark:text-[#cadfdf] dark:border-[#cadfdf]/20 hover:bg-[#3c5654]/30 dark:hover:bg-[#cadfdf]/20'
              : 'bg-gradient-to-br from-[#d7a217] to-[#c29115] text-white border border-transparent hover:shadow-[0_0_15px_rgba(215,162,23,0.4)]'
          }`}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Batal' : 'Tambah Baru'}
        </button>
      </div>
      
      <div className="relative z-10 p-5">
        {/* Form Tambah */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[500px] opacity-100 mb-5' : 'max-h-0 opacity-0 mb-0'}`}>
          <form onSubmit={handleSubmitTambah} className={`p-5 rounded-2xl border shadow-inner ${isDarkMode ? 'bg-black/20 border-[#cadfdf]/10' : 'bg-white/50 border-[#cadfdf]/40'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Plus size={14} className="text-[#d7a217]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#d7a217]">Buat Template Baru</span>
            </div>
            <div className="grid grid-cols-1 gap-3 mb-4">
              <input
                type="text"
                value={formJudul}
                onChange={(e) => setFormJudul(e.target.value)}
                placeholder="Judul Catatan (Contoh: Pagu Berlebih)"
                className={`${glassInput} p-3.5 text-xs font-semibold`}
                required
              />
              <textarea
                rows="3"
                value={formIsi}
                onChange={(e) => setFormIsi(e.target.value)}
                placeholder="Ketik isi rincian catatan analisa di sini..."
                className={`${glassInput} p-3.5 text-xs resize-y custom-bank-scroll`}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 bg-gradient-to-br from-[#d7a217] to-[#c29115] text-white shadow-lg shadow-[#d7a217]/20 flex items-center gap-2"
              >
                {isProcessing ? 'MENYIMPAN...' : <><Save size={14}/> SIMPAN TEMPLATE</>}
              </button>
            </div>
          </form>
        </div>
        
        {/* Daftar Catatan */}
        <div className="space-y-3 max-h-72 overflow-y-auto custom-bank-scroll pr-1">
          {bankCatatan.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 opacity-70 animate-in fade-in">
              <Database size={28} className="mb-3 text-[#d7a217] opacity-50" />
              <p className={`text-[11px] italic font-medium ${isDarkMode ? 'text-[#cadfdf]' : 'text-[#3c5654]'}`}>
                Belum ada template catatan tersimpan.
              </p>
            </div>
          ) : (
            bankCatatan.map((catatan) => (
              <div 
                key={catatan.id} 
                className={`p-4 rounded-xl border transition-all duration-300 transform group/item hover:-translate-y-0.5 hover:shadow-md animate-in slide-in-from-bottom-2 ${
                  isDarkMode 
                    ? 'bg-[#3c5654]/60 border-[#cadfdf]/10 hover:border-[#d7a217]/40 hover:bg-[#3c5654]/80' 
                    : 'bg-white/80 border-[#cadfdf]/40 hover:border-[#d7a217]/40 hover:bg-white'
                }`}
              >
                
                {/* Mode Edit vs Mode Lihat */}
                {editingId === catatan.id ? (
                  // Mode Edit
                  <form onSubmit={handleSubmitEdit} className="space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      <Edit3 size={12} className="text-[#d7a217]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#d7a217]">Edit Template</span>
                    </div>
                    <input
                      type="text"
                      value={editJudul}
                      onChange={(e) => setEditJudul(e.target.value)}
                      className={`${glassInput} w-full p-3 text-xs font-semibold`}
                      placeholder="Judul Catatan"
                      required
                    />
                    <textarea
                      rows="3"
                      value={editIsi}
                      onChange={(e) => setEditIsi(e.target.value)}
                      className={`${glassInput} w-full p-3 text-xs resize-y custom-bank-scroll`}
                      placeholder="Isi catatan"
                      required
                    />
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditJudul('');
                          setEditIsi('');
                        }}
                        className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-opacity-80 ${isDarkMode ? 'bg-[#425c5a] text-[#cadfdf]' : 'bg-[#e2eceb] text-[#425c5a]'}`}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all hover:scale-105 bg-gradient-to-br from-[#d7a217] to-[#c29115] text-white shadow-md shadow-[#d7a217]/20 flex items-center gap-1.5"
                      >
                        <CheckCircle size={12}/> Simpan
                      </button>
                    </div>
                  </form>
                ) : (
                  // Mode Lihat
                  <div className="relative">
                    <div className="flex justify-between items-start mb-2">
                      <h6 className="font-bold text-xs flex items-center gap-2 text-[#d7a217]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d7a217]"></span>
                        {catatan.judul}
                      </h6>
                      
                      {/* Action Buttons (Fade in on hover) */}
                      <div className="flex gap-1.5 opacity-100 md:opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => {
                            setEditingId(catatan.id);
                            setEditJudul(catatan.judul);
                            setEditIsi(catatan.isi);
                          }}
                          className={`p-1.5 rounded-md transition-all hover:scale-110 hover:bg-[#d7a217]/10 text-[#d7a217]`}
                          title="Edit Catatan"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => onHapus(catatan.id, catatan.judul)}
                          className={`p-1.5 rounded-md transition-all hover:scale-110 hover:bg-rose-500/10 text-rose-500`}
                          title="Hapus Catatan"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className={`text-[11px] mb-4 pl-3 py-1 border-l-2 border-[#d7a217]/50 italic leading-relaxed ${isDarkMode ? 'text-[#cadfdf]/90' : 'text-[#3c5654]/90'}`}>
                      {catatan.isi}
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => onGunakan(catatan.isi)}
                        className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 bg-[#d7a217]/10 text-[#d7a217] border border-[#d7a217]/30 hover:bg-[#d7a217] hover:text-white hover:shadow-[0_0_10px_rgba(215,162,23,0.4)] flex items-center gap-1.5"
                      >
                        <CheckCircle size={12}/> Gunakan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Internal CSS for Animations and Custom Scrollbar */}
      <style jsx>{`
        @keyframes float-bank {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: var(--opacity, 0.4); }
          80% { opacity: var(--opacity, 0.4); }
          100% { transform: translateY(-50px) translateX(20px) scale(0.8); opacity: 0; }
        }
        .animate-float-bank {
          animation-name: float-bank;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        
        /* Custom Scrollbar for ECharts Aesthetic */
        .custom-bank-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-bank-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-bank-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.3);
          border-radius: 10px;
        }
        .custom-bank-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(215, 162, 23, 0.6);
        }
      `}</style>
    </div>
  );
};

export default BankCatatanPanel;