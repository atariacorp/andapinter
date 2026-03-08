import React, { useState, useEffect } from 'react';
import { Palette, Upload, Trash2, Save, Sparkles, Calendar, Clock,
  FileText, RefreshCw } from 'lucide-react';

// --- Komponen Partikel Emas Mengambang (VISUAL ENHANCED) ---
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

const BrandingTab = ({ 
  branding, 
  brandingForm, 
  setBrandingForm, 
  onSave,
  isProcessing,
  isDarkMode,
  colors 
}) => {
  const [logoPreview, setLogoPreview] = useState(brandingForm.logoUrl || '');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Efek parallax ringan
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

  // Sinkronisasi logo preview dengan brandingForm
  useEffect(() => {
    setLogoPreview(brandingForm.logoUrl || '');
  }, [brandingForm.logoUrl]);

  // Set default values untuk field baru
  useEffect(() => {
    const updates = {};
    if (!brandingForm.deadlineDays && brandingForm.deadlineDays !== 0) updates.deadlineDays = 7;
    if (!brandingForm.urgentColor) updates.urgentColor = '#ef4444';
    if (!brandingForm.warningColor) updates.warningColor = '#d7a217';
    if (!brandingForm.safeColor) updates.safeColor = '#10b981';
    
    if (Object.keys(updates).length > 0) {
      setBrandingForm(prev => ({ ...prev, ...updates }));
    }
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (maks 500KB)
      if (file.size > 500 * 1024) {
        alert('Ukuran file maksimal 500KB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoPreview(ev.target.result);
        setBrandingForm({...brandingForm, logoUrl: ev.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
    setBrandingForm({...brandingForm, logoUrl: ''});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(brandingForm);
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
    <div className="relative animate-in fade-in duration-500 pb-12">
      
      {/* Background Decorative Ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-3xl">
        <div 
          className="absolute top-[10%] right-[5%] w-80 h-80 bg-[#d7a217] blur-[120px] opacity-10 transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(${mousePos.x * -1}px, ${mousePos.y * -1}px, 0)` }}
        ></div>
        <div 
          className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-[#425c5a] blur-[140px] opacity-10 transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px, 0)` }}
        ></div>
      </div>
      
      <FloatingGoldParticles />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        <div className={`${glassCard} animate-slide-up-fade`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
          
          {/* Header with icon */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 relative z-10 border-b pb-6" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.1)' }}>
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#d7a217]/20 to-transparent border border-[#d7a217]/30 shadow-[inset_0_0_15px_rgba(215,162,23,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Palette size={28} style={{ color: colors.gold }} className="drop-shadow-md" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest drop-shadow-sm" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  Konfigurasi Sistem Utama
                </h2>
                <p className="text-sm md:text-base font-semibold mt-1 opacity-70" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  Sesuaikan identitas, tampilan, dan parameter global aplikasi Anda.
                </p>
              </div>
            </div>
            
            {/* Global Save Button (Top) */}
            <button 
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full md:w-auto px-8 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_25px_-5px_rgba(215,162,23,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(215,162,23,0.6)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group/btntop bg-[length:200%_auto] hover:bg-[position:right_center]"
              style={{ 
                background: `linear-gradient(135deg, ${colors.gold} 0%, #e6b32a 50%, #b8860b 100%)`,
                color: 'white'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btntop:animate-shimmer pointer-events-none"></div>
              {isProcessing ? (
                <><RefreshCw size={18} className="animate-spin drop-shadow-md" /> MENYIMPAN...</>
              ) : (
                <><Save size={18} className="drop-shadow-md transition-transform group-hover/btntop:scale-110 duration-500" /> SIMPAN SEMUA</>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
            
            {/* Kiri: Logo & Preview */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Preview Logo Premium Container */}
              <div 
                className="p-8 rounded-3xl relative overflow-hidden group/preview flex flex-col items-center justify-center text-center transition-all duration-500 hover:shadow-lg"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                  border: `1px solid ${isDarkMode ? 'rgba(202,223,223,0.1)' : 'rgba(66,92,90,0.1)'}`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d7a217]/5 to-transparent pointer-events-none"></div>
                
                {/* Logo Container with Glow */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-[#d7a217] blur-2xl opacity-20 group-hover/preview:opacity-40 transition-opacity duration-500 rounded-full animate-pulse-slow"></div>
                  <div 
                    className="relative w-36 h-36 rounded-3xl flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.3)] overflow-hidden transition-transform duration-500 group-hover/preview:scale-105 border border-[#d7a217]/30"
                    style={{ background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)` }}
                  >
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain bg-white/10 backdrop-blur-sm p-2" 
                      />
                    ) : (
                      <>
                        <Sparkles size={28} className="absolute top-3 right-3 opacity-50 animate-pulse" color="white" />
                        <span className="text-6xl font-black text-white drop-shadow-md">
                          {brandingForm.icon || 'EB'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Live Preview Text */}
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: colors.gold }}>
                    Live Preview
                  </p>
                  <h3 className="text-xl font-black truncate max-w-full drop-shadow-sm" style={{ color: isDarkMode ? '#ffffff' : colors.tealDark }}>
                    {brandingForm.name1 || 'E'}{brandingForm.name2 || 'BUDGETING'}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70 truncate max-w-full" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                    {brandingForm.tagline || 'Sistem Manajemen'}
                  </p>
                </div>
              </div>
              
              {/* Upload Logo Control */}
              <div 
                className="p-6 rounded-2xl border border-dashed relative overflow-hidden group/upload" 
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(215,162,23,0.05)' : 'rgba(215,162,23,0.02)',
                  borderColor: 'rgba(215,162,23,0.4)'
                }}
              >
                <div className="absolute inset-0 bg-[#d7a217] blur-3xl opacity-0 group-hover/upload:opacity-10 transition-opacity duration-500"></div>
                <label className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10" style={{ color: colors.gold }}>
                  <Upload size={14} /> Ganti Logo Identitas
                </label>
                
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center relative z-10">
                  <div className="relative flex-grow">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={isProcessing}
                    />
                    <div 
                      className={`w-full p-4 rounded-xl text-sm font-bold flex items-center justify-between border cursor-pointer transition-all duration-300 group-hover/upload:border-[#d7a217] ${
                        isDarkMode ? 'bg-black/30 border-[#cadfdf]/20 text-[#cadfdf]' : 'bg-white/80 border-[#cadfdf] text-[#425c5a]'
                      }`}
                    >
                      <span className="truncate pr-4 opacity-80">
                        {logoPreview ? 'Gambar Logo Dimuat' : 'Pilih file (JPG/PNG/SVG)'}
                      </span>
                      <div className="p-1.5 rounded-md bg-[#d7a217]/10">
                        <Upload size={16} style={{ color: colors.gold }} />
                      </div>
                    </div>
                  </div>
                  
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="p-4 rounded-xl transition-all duration-300 hover:scale-105 border shrink-0 flex items-center justify-center group/del"
                      style={{ 
                        backgroundColor: 'rgba(225, 29, 72, 0.1)', 
                        borderColor: 'rgba(225, 29, 72, 0.2)',
                        color: '#f43f5e' 
                      }}
                      title="Hapus Logo"
                    >
                      <Trash2 size={18} className="group-hover/del:animate-pulse" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] mt-3 font-medium opacity-60 relative z-10" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                  * Resolusi disarankan 1:1 (Square). Maksimal 500KB.
                </p>
              </div>
            </div>
            
            {/* Kanan: Form Input Text */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Seksi Tipografi & Nama */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-dashed" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.2)' : 'rgba(66,92,90,0.2)' }}>
                  <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 shadow-inner">
                    <FileText size={18} style={{ color: colors.gold }} />
                  </div>
                  <h4 className="font-black uppercase tracking-widest text-sm" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>Nomenklatur Sistem</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Icon */}
                  <div className="space-y-2 relative group/input sm:col-span-1">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      Inisial (Ikon)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                      <input
                        required
                        maxLength="2"
                        value={brandingForm.icon || ''}
                        onChange={e => setBrandingForm({...brandingForm, icon: e.target.value})}
                        placeholder="Ex: EB"
                        className={`${glassInput} font-black text-center tracking-widest relative z-10`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      />
                    </div>
                  </div>
                  
                  {/* Name 1 */}
                  <div className="space-y-2 relative group/input sm:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      Nama Utama (Bagian 1)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                      <input
                        required
                        value={brandingForm.name1 || ''}
                        onChange={e => setBrandingForm({...brandingForm, name1: e.target.value})}
                        placeholder="Contoh: E-"
                        className={`${glassInput} font-bold relative z-10`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      />
                    </div>
                  </div>
                  
                  {/* Name 2 */}
                  <div className="space-y-2 relative group/input sm:col-span-3">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      Nama Utama (Bagian 2 - Highlight Warna)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                      <input
                        required
                        value={brandingForm.name2 || ''}
                        onChange={e => setBrandingForm({...brandingForm, name2: e.target.value})}
                        placeholder="Contoh: BUDGETING"
                        className={`${glassInput} font-bold text-[#d7a217] relative z-10`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      />
                    </div>
                  </div>
                  
                  {/* Tagline */}
                  <div className="space-y-2 relative group/input sm:col-span-3">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      Slogan / Deskripsi Singkat
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                      <input
                        required
                        value={brandingForm.tagline || ''}
                        onChange={e => setBrandingForm({...brandingForm, tagline: e.target.value})}
                        placeholder="Contoh: Sistem Manajemen Anggaran Digital"
                        className={`${glassInput} font-medium relative z-10`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      />
                    </div>
                  </div>
                  
                  {/* Sub Tagline */}
                  <div className="space-y-2 relative group/input sm:col-span-3">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      Sub-Tagline / Identitas Daerah (Cetak Laporan)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                      <input
                        required
                        value={brandingForm.subTagline || ''}
                        onChange={e => setBrandingForm({...brandingForm, subTagline: e.target.value})}
                        placeholder="Contoh: Pemerintah Kota / Kabupaten..."
                        className={`${glassInput} font-medium relative z-10`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seksi Fitur Deadline ECharts Aesthetic */}
              <div className="space-y-6 pt-6 border-t border-dashed" style={{ borderColor: isDarkMode ? 'rgba(202,223,223,0.2)' : 'rgba(66,92,90,0.2)' }}>
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#d7a217]/10 shadow-inner">
                      <Calendar size={18} style={{ color: colors.gold }} />
                    </div>
                    <h4 className="font-black uppercase tracking-widest text-sm" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>Algoritma Timeline & Indikator Visual</h4>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Durasi Deadline */}
                  <div className="space-y-3 relative group/input md:col-span-2 lg:col-span-1">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1 flex items-center gap-2" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      <Clock size={14} style={{ color: colors.gold }} />
                      Range Jatuh Tempo (Hari)
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-0 bg-[#d7a217] blur-md opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-500 rounded-xl"></div>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={brandingForm.deadlineDays ?? 7}
                        onChange={e => {
                          const value = e.target.value === '' ? 7 : parseInt(e.target.value);
                          if (!isNaN(value)) {
                            const clampedValue = Math.min(90, Math.max(1, value));
                            setBrandingForm({...brandingForm, deadlineDays: clampedValue});
                          }
                        }}
                        className={`${glassInput} font-black text-lg text-center relative z-10 pr-12`}
                        style={{ borderWidth: '1px', borderStyle: 'solid' }}
                      />
                      <span className="absolute right-6 font-bold opacity-50 z-10 pointer-events-none" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>Hari</span>
                    </div>
                    <p className="text-[10px] font-bold opacity-60 ml-1 leading-relaxed" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                      * Digunakan oleh sistem untuk menghitung sisa waktu sejak dokumen diusulkan hingga status menjadi <em>Urgent</em>.
                    </p>
                  </div>

                  {/* UI Preview Warna Status ECharts Style */}
                  <div className="md:col-span-2 lg:col-span-1 space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest opacity-80 ml-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                      Pemetaan Indikator Visual (Hex)
                    </label>
                    
                    <div className="space-y-3">
                      {/* Urgent */}
                      <div className="flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10">
                        <div className="relative w-12 h-10 shrink-0">
                          <input
                            type="color"
                            value={brandingForm.urgentColor || '#ef4444'}
                            onChange={e => setBrandingForm({...brandingForm, urgentColor: e.target.value})}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="w-full h-full rounded-lg shadow-inner flex items-center justify-center" style={{ backgroundColor: brandingForm.urgentColor || '#ef4444' }}>
                            <Palette size={14} color="rgba(255,255,255,0.7)" />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={brandingForm.urgentColor || '#ef4444'}
                          onChange={e => setBrandingForm({...brandingForm, urgentColor: e.target.value})}
                          className={`${glassInput} flex-1 font-mono text-xs font-bold uppercase`}
                          style={{ borderWidth: '1px', borderStyle: 'solid', padding: '0.75rem 1rem' }}
                        />
                        <div className="w-[120px] shrink-0 hidden sm:flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ backgroundColor: brandingForm.urgentColor || '#ef4444', color: brandingForm.urgentColor || '#ef4444' }}></div>
                           <span className="text-[10px] font-bold uppercase" style={{ color: brandingForm.urgentColor || '#ef4444' }}>Kritis (≤2 Hari)</span>
                        </div>
                      </div>

                      {/* Warning */}
                      <div className="flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10">
                        <div className="relative w-12 h-10 shrink-0">
                          <input
                            type="color"
                            value={brandingForm.warningColor || '#d7a217'}
                            onChange={e => setBrandingForm({...brandingForm, warningColor: e.target.value})}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="w-full h-full rounded-lg shadow-inner flex items-center justify-center" style={{ backgroundColor: brandingForm.warningColor || '#d7a217' }}>
                            <Palette size={14} color="rgba(255,255,255,0.7)" />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={brandingForm.warningColor || '#d7a217'}
                          onChange={e => setBrandingForm({...brandingForm, warningColor: e.target.value})}
                          className={`${glassInput} flex-1 font-mono text-xs font-bold uppercase`}
                          style={{ borderWidth: '1px', borderStyle: 'solid', padding: '0.75rem 1rem' }}
                        />
                        <div className="w-[120px] shrink-0 hidden sm:flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: brandingForm.warningColor || '#d7a217', color: brandingForm.warningColor || '#d7a217' }}></div>
                           <span className="text-[10px] font-bold uppercase" style={{ color: brandingForm.warningColor || '#d7a217' }}>Siaga (3-5 Hari)</span>
                        </div>
                      </div>

                      {/* Safe */}
                      <div className="flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10">
                        <div className="relative w-12 h-10 shrink-0">
                          <input
                            type="color"
                            value={brandingForm.safeColor || '#10b981'}
                            onChange={e => setBrandingForm({...brandingForm, safeColor: e.target.value})}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="w-full h-full rounded-lg shadow-inner flex items-center justify-center" style={{ backgroundColor: brandingForm.safeColor || '#10b981' }}>
                            <Palette size={14} color="rgba(255,255,255,0.7)" />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={brandingForm.safeColor || '#10b981'}
                          onChange={e => setBrandingForm({...brandingForm, safeColor: e.target.value})}
                          className={`${glassInput} flex-1 font-mono text-xs font-bold uppercase`}
                          style={{ borderWidth: '1px', borderStyle: 'solid', padding: '0.75rem 1rem' }}
                        />
                        <div className="w-[120px] shrink-0 hidden sm:flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: brandingForm.safeColor || '#10b981', color: brandingForm.safeColor || '#10b981' }}></div>
                           <span className="text-[10px] font-bold uppercase" style={{ color: brandingForm.safeColor || '#10b981' }}>Aman ({'>'}5 Hari)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default BrandingTab;