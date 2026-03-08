import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, AlertCircle, Zap } from 'lucide-react';
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

const TahunTab = ({ 
  tahunList, 
  onAdd, 
  onDelete, 
  onGenerateDefault,
  isProcessing,
  isDarkMode,
  colors 
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
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-[#d7a217] blur-[100px] opacity-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[#425c5a] blur-[120px] opacity-10 animate-pulse-slow"></div>
      </div>
      
      <FloatingGoldParticles />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
        
        {/* Left Column - Forms */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8 animate-slide-up-fade">
          
          {/* Form Tambah Manual */}
          <div className={glassCard}>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#d7a217]/20 to-transparent border border-[#d7a217]/30 shadow-[inset_0_0_15px_rgba(215,162,23,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <CalendarDays size={24} style={{ color: colors.gold }} className="drop-shadow-md" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                Tambah Tahun Anggaran
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="relative group/input">
                <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                <input 
                  required 
                  type="number" 
                  min="2000" 
                  max="2100" 
                  value={newTahun} 
                  onChange={e => setNewTahun(e.target.value)} 
                  placeholder="Contoh: 2024" 
                  className={`${glassInput} relative z-10`}
                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-[0.15em] shadow-[0_10px_25px_-5px_rgba(215,162,23,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(215,162,23,0.6)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-[length:200%_auto] hover:bg-[position:right_center]"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.gold} 0%, #e6b32a 50%, #b8860b 100%)`,
                  color: 'white'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
                <Plus size={18} className="drop-shadow-md transition-transform group-hover/btn:rotate-90 duration-500" />
                <span className="relative z-10 drop-shadow-md">
                  {isProcessing ? 'MENYIMPAN DATA...' : 'TAMBAH TAHUN'}
                </span>
              </button>
            </form>
          </div>
          
          {/* Generate Default */}
          {(!tahunList || tahunList.length === 0) && (
            <div className={`${glassCard} animate-slide-up-fade animation-delay-100`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#d7a217]/20 to-transparent border border-[#d7a217]/30 shadow-[inset_0_0_15px_rgba(215,162,23,0.2)] shrink-0">
                  <AlertCircle size={24} style={{ color: colors.gold }} className="animate-pulse drop-shadow-md" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-black mb-2 uppercase tracking-widest" style={{ color: colors.gold }}>
                    Database Tahun Kosong
                  </p>
                  <p className="text-sm font-medium mb-5 leading-relaxed" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark, opacity: 0.8 }}>
                    Sistem mendeteksi belum ada master data tahun. Klik tombol di bawah untuk membuat struktur periode default (2024-2026) secara otomatis.
                  </p>
                  <button 
                    onClick={onGenerateDefault} 
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-500 hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group/gen"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.tealDark} 0%, ${colors.tealMedium} 100%)`,
                      color: 'white'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/gen:animate-shimmer"></div>
                    <Zap size={16} className="drop-shadow-md group-hover/gen:scale-110 group-hover/gen:text-[#d7a217] transition-all" />
                    <span className="relative z-10">GENERATE TAHUN DEFAULT</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Info Panel */}
          <div 
            className="p-5 md:p-6 rounded-3xl border border-dashed relative overflow-hidden group animate-slide-up-fade animation-delay-200"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
              borderColor: isDarkMode ? 'rgba(215, 162, 23, 0.3)' : 'rgba(215, 162, 23, 0.4)',
              color: isDarkMode ? colors.tealPale : colors.tealMedium
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d7a217]/5 to-transparent pointer-events-none"></div>
            <div className="flex items-start gap-3 relative z-10">
              <CalendarDays size={18} className="shrink-0 mt-0.5" style={{ color: colors.gold }} />
              <p className="text-xs md:text-sm font-semibold leading-relaxed tracking-wide">
                Tahun anggaran yang terdaftar akan muncul pada <strong style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>dropdown filter pencarian</strong> di halaman Dashboard dan Daftar Berkas sebagai referensi analitik temporal.
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Data Table */}
        <div className="lg:col-span-7 flex flex-col h-full animate-slide-up-fade animation-delay-300">
          <div className="relative flex-1 h-full min-h-[500px] rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
               style={{ 
                 backgroundColor: isDarkMode ? 'rgba(26, 43, 41, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                 border: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.2)'}`,
                 backdropFilter: 'blur(20px)'
               }}>
            
            {/* Pendelegasian style ke MasterDataTable via parent wrapper */}
            <div className="h-full [&>div]:h-full [&>div]:border-none [&>div]:bg-transparent [&>div]:shadow-none">
              <MasterDataTable
                data={tahunList}
                columns={[
                  { 
                    field: 'tahun', 
                    render: (item) => (
                      <div className="flex items-center gap-3 py-1">
                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm">
                          <CalendarDays size={16} style={{ color: colors.gold }} />
                        </div>
                        <span className="font-black uppercase tracking-widest text-sm" style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}>
                          {item.tahun || item.nama}
                        </span>
                      </div>
                    )
                  }
                ]}
                onDelete={onDelete}
                emptyMessage="Belum ada data master Tahun Anggaran yang terdaftar."
                isDarkMode={isDarkMode}
                colors={colors}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.3); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(215, 162, 23, 0.6); }

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
        .animation-delay-300 { animation-delay: 300ms; }
      `}</style>
    </div>
  );
};

export default TahunTab;