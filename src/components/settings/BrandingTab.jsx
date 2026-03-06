import React, { useState } from 'react';
import { Palette, Upload, Trash2, Save } from 'lucide-react';

const BrandingTab = ({ 
  branding, 
  brandingForm, 
  setBrandingForm, 
  onSave,
  isProcessing 
}) => {
  const [logoPreview, setLogoPreview] = useState(brandingForm.logoUrl || '');

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        
        <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 mb-6 uppercase flex items-center gap-2 tracking-tighter">
          <Palette size={18} className="text-blue-500"/> Kustomisasi Tampilan Aplikasi
        </h2>
        
        {/* Preview Logo */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              brandingForm.icon || 'A'
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Preview Logo</p>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1">
              {brandingForm.name1}{brandingForm.name2} - {brandingForm.tagline}
            </p>
          </div>
        </div>
        
        {/* Upload Logo */}
        <div className="mb-6 p-4 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-900/10">
          <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-2 block tracking-widest">
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
              <div className="w-full p-3 border border-blue-200 dark:border-blue-800 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span className="truncate">
                  {logoPreview ? 'Logo siap' : 'Pilih file gambar...'}
                </span>
                <Upload size={16} className="text-blue-500" />
              </div>
            </div>
            {logoPreview && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-800"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 italic">
            *Format: JPG, PNG, SVG. Maksimal 500KB.
          </p>
        </div>
        
        {/* Form Input */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              Icon Aplikasi (1-2 Huruf)
            </label>
            <input
              required
              maxLength="2"
              value={brandingForm.icon}
              onChange={e => setBrandingForm({...brandingForm, icon: e.target.value})}
              placeholder="Contoh: A"
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              Nama Aplikasi (Bagian 1)
            </label>
            <input
              required
              value={brandingForm.name1}
              onChange={e => setBrandingForm({...brandingForm, name1: e.target.value})}
              placeholder="Contoh: ANDA"
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none uppercase"
            />
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              Nama Aplikasi (Bagian 2)
            </label>
            <input
              required
              value={brandingForm.name2}
              onChange={e => setBrandingForm({...brandingForm, name2: e.target.value})}
              placeholder="Contoh: PINTER"
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none uppercase"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              Tagline Utama
            </label>
            <input
              required
              value={brandingForm.tagline}
              onChange={e => setBrandingForm({...brandingForm, tagline: e.target.value})}
              placeholder="Contoh: Aplikasi Pendataan..."
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
              Sub-Tagline (Nama Instansi)
            </label>
            <input
              required
              value={brandingForm.subTagline}
              onChange={e => setBrandingForm({...brandingForm, subTagline: e.target.value})}
              placeholder="Contoh: Badan Keuangan Daerah..."
              className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none"
            />
          </div>
          
          <button
            type="submit"
            disabled={isProcessing}
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl transition-all active:scale-95 text-center disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {isProcessing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN BRANDING'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BrandingTab;