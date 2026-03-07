import React, { useState, useEffect } from 'react';
import { Palette, Upload, Trash2, Save, Sparkles, Calendar, Clock } from 'lucide-react';

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
      <div className={glassCard}>
        
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${colors.gold}20` }}>
            <Palette size={20} style={{ color: colors.gold }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Kustomisasi Tampilan Aplikasi
            </h2>
            <p className="text-xs mt-1" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
              Sesuaikan tampilan aplikasi dengan identitas instansi Anda
            </p>
          </div>
        </div>
        
        {/* Preview Logo - VERTIKAL DENGAN CSS INLINE */}
<div 
  className="mb-6 p-6 rounded-xl"
  style={{ 
    backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(202, 223, 223, 0.3)',
    border: `1px solid ${colors.tealPale}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }}
>
  {/* Logo Container */}
  <div style={{ 
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '16px'
  }}>
    <div 
      style={{ 
        width: '128px',
        height: '128px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {logoPreview ? (
        <img 
          src={logoPreview} 
          alt="Preview" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      ) : (
        <>
          <Sparkles size={24} style={{ position: 'absolute', top: '8px', right: '8px', color: 'rgba(255,255,255,0.5)' }} />
          <span style={{ fontSize: '48px', fontWeight: 900, color: 'white' }}>
            {brandingForm.icon || 'A'}
          </span>
        </>
      )}
    </div>
  </div>
  
  {/* Teks */}
  <div>
    <p style={{ fontSize: '14px', fontWeight: 'bold', color: colors.gold, marginBottom: '4px' }}>
      Preview Logo
    </p>
    <p style={{ fontSize: '14px', color: isDarkMode ? colors.tealLight : colors.tealMedium }}>
      {brandingForm.name1}{brandingForm.name2} - {brandingForm.tagline}
    </p>
  </div>
</div>
        
        {/* Upload Logo */}
        <div className="mb-6 p-4 rounded-xl" style={{ 
          backgroundColor: `${colors.gold}10`,
          border: `1px dashed ${colors.gold}`
        }}>
          <label className="text-xs font-bold uppercase mb-2 block" style={{ color: colors.gold }}>
            Upload Logo Aplikasi
          </label>
          <div className="flex gap-2 items-center">
            <div className="relative flex-grow">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isProcessing}
              />
              <div 
                className={`w-full p-3 rounded-xl text-sm flex items-center justify-between ${glassInput}`}
                style={{ borderStyle: 'solid' }}
              >
                <span className="truncate">
                  {logoPreview ? 'Logo siap' : 'Pilih file gambar...'}
                </span>
                <Upload size={16} style={{ color: colors.gold }} />
              </div>
            </div>
            {logoPreview && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="p-3 rounded-xl transition-all hover:scale-110"
                style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <p className="text-[9px] mt-1.5 italic" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
            *Format: JPG, PNG, SVG. Maksimal 500KB.
          </p>
        </div>
        
        {/* Form Input */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Icon */}
          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Icon Aplikasi
            </label>
            <input
              required
              maxLength="2"
              value={brandingForm.icon || ''}
              onChange={e => setBrandingForm({...brandingForm, icon: e.target.value})}
              placeholder="Contoh: A"
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            />
          </div>
          
          {/* Name 1 */}
          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Nama Aplikasi (Bagian 1)
            </label>
            <input
              required
              value={brandingForm.name1 || ''}
              onChange={e => setBrandingForm({...brandingForm, name1: e.target.value})}
              placeholder="Contoh: ANDA"
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            />
          </div>
          
          {/* Name 2 */}
          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Nama Aplikasi (Bagian 2)
            </label>
            <input
              required
              value={brandingForm.name2 || ''}
              onChange={e => setBrandingForm({...brandingForm, name2: e.target.value})}
              placeholder="Contoh: PINTER"
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            />
          </div>
          
          {/* Tagline */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Tagline Utama
            </label>
            <input
              required
              value={brandingForm.tagline || ''}
              onChange={e => setBrandingForm({...brandingForm, tagline: e.target.value})}
              placeholder="Contoh: Aplikasi Pendataan..."
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            />
          </div>
          
          {/* Sub Tagline */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-medium" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
              Sub-Tagline (Nama Instansi)
            </label>
            <input
              required
              value={brandingForm.subTagline || ''}
              onChange={e => setBrandingForm({...brandingForm, subTagline: e.target.value})}
              placeholder="Contoh: Badan Keuangan Daerah..."
              className={glassInput}
              style={{ borderWidth: '1px', borderStyle: 'solid' }}
            />
          </div>

          {/* ===== FITUR BARU: PENGATURAN DEADLINE ===== */}
          <div className="md:col-span-2 pt-4 border-t border-[#cadfdf] dark:border-[#cadfdf]/20">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: colors.gold }}>
              <Calendar size={18} />
              Pengaturan Deadline Usulan
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Durasi Deadline */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  <Clock size={14} style={{ color: colors.gold }} />
                  Durasi Deadline (hari)
                </label>
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
                  placeholder="Contoh: 7"
                  className={glassInput}
                  style={{ borderWidth: '1px', borderStyle: 'solid' }}
                />
                <p className="text-[9px] italic mt-1" style={{ color: isDarkMode ? colors.tealPale : colors.tealMedium }}>
                  * Jumlah hari sejak tanggal surat hingga deadline
                </p>
              </div>

              {/* Warna Deadline Mendesak */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  <Palette size={14} style={{ color: colors.gold }} />
                  Warna Deadline Mendesak (≤2 hari)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={brandingForm.urgentColor || '#ef4444'}
                    onChange={e => setBrandingForm({...brandingForm, urgentColor: e.target.value})}
                    className="w-12 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandingForm.urgentColor || '#ef4444'}
                    onChange={e => setBrandingForm({...brandingForm, urgentColor: e.target.value})}
                    className={`${glassInput} flex-1`}
                    style={{ borderWidth: '1px', borderStyle: 'solid' }}
                    placeholder="#ef4444"
                  />
                </div>
              </div>

              {/* Warna Deadline Mendekati */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  <Palette size={14} style={{ color: colors.gold }} />
                  Warna Deadline Mendekati (3-5 hari)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={brandingForm.warningColor || '#d7a217'}
                    onChange={e => setBrandingForm({...brandingForm, warningColor: e.target.value})}
                    className="w-12 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandingForm.warningColor || '#d7a217'}
                    onChange={e => setBrandingForm({...brandingForm, warningColor: e.target.value})}
                    className={`${glassInput} flex-1`}
                    style={{ borderWidth: '1px', borderStyle: 'solid' }}
                    placeholder="#d7a217"
                  />
                </div>
              </div>

              {/* Warna Deadline Aman */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-1" style={{ color: isDarkMode ? colors.tealLight : colors.tealDark }}>
                  <Palette size={14} style={{ color: colors.gold }} />
                  Warna Deadline Aman (5 hari)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={brandingForm.safeColor || '#10b981'}
                    onChange={e => setBrandingForm({...brandingForm, safeColor: e.target.value})}
                    className="w-12 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandingForm.safeColor || '#10b981'}
                    onChange={e => setBrandingForm({...brandingForm, safeColor: e.target.value})}
                    className={`${glassInput} flex-1`}
                    style={{ borderWidth: '1px', borderStyle: 'solid' }}
                    placeholder="#10b981"
                  />
                </div>
              </div>
            </div>

            {/* Preview Warna Deadline */}
            <div className="md:col-span-2 mt-4 p-3 rounded-xl" style={{ 
              backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.2)' : 'rgba(202, 223, 223, 0.3)',
              border: `1px solid ${colors.tealPale}`
            }}>
              <p className="text-xs font-bold mb-2" style={{ color: colors.gold }}>Preview Warna Deadline:</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brandingForm.urgentColor || '#ef4444' }}></div>
                  <span className="text-xs" style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>Mendesak (≤2 hr)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brandingForm.warningColor || '#d7a217' }}></div>
                  <span className="text-xs" style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>Mendekati (3-5 hr)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brandingForm.safeColor || '#10b981' }}></div>
                  <span className="text-xs" style={{ color: isDarkMode ? colors.tealLight : colors.tealMedium }}>Aman (5 hr)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.tealDark} 100%)`,
                color: 'white'
              }}
            >
              {isProcessing ? (
                <><span className="animate-spin">⟳</span> MENYIMPAN...</>
              ) : (
                <><Save size={16} /> SIMPAN PERUBAHAN</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandingTab;