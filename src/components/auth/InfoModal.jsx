import React from 'react';
import { X, Mail, Phone, Globe, Coffee } from 'lucide-react';

const InfoModal = ({ show, onClose, branding }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#2d231b] rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 border border-[#e6d5bf] dark:border-[#4f3d2f]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#b48c5c] to-[#8b6b4c] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
              {branding.icon}
            </div>
            <div>
              <h3 className="text-lg font-black text-[#362b21] dark:text-[#f0e9db]">
                {branding.name1}<span className="text-[#b48c5c]">{branding.name2}</span>
              </h3>
              <p className="text-xs text-[#6d5340] dark:text-[#e6d5bf]">Versi 1.0.0</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f0e9db] dark:hover:bg-[#362b21] rounded-lg transition-colors">
            <X size={18} className="text-[#8b6b4c]" />
          </button>
        </div>
        
        {/* Body */}
        <div className="space-y-6">
          <div className="p-4 bg-[#faf7f2] dark:bg-[#362b21] rounded-xl border border-[#e6d5bf] dark:border-[#4f3d2f]">
            <p className="text-sm text-[#6d5340] dark:text-[#e6d5bf] font-medium">
              {branding.tagline}
            </p>
            <p className="text-xs text-[#8b6b4c] dark:text-[#b48c5c] mt-2">
              {branding.subTagline}
            </p>
          </div>
          
          <div className="border-t border-[#e6d5bf] dark:border-[#4f3d2f] pt-4">
            <h4 className="text-xs font-bold text-[#362b21] dark:text-[#f0e9db] mb-3 flex items-center gap-2">
              <Coffee size={14} className="text-[#b48c5c]" />
              Informasi Aplikasi
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#faf7f2] dark:bg-[#362b21] rounded-lg">
                <p className="text-[#8b6b4c] dark:text-[#b48c5c] mb-1">Versi</p>
                <p className="font-medium text-[#362b21] dark:text-[#f0e9db]">1.0.0 Stable</p>
              </div>
              <div className="p-3 bg-[#faf7f2] dark:bg-[#362b21] rounded-lg">
                <p className="text-[#8b6b4c] dark:text-[#b48c5c] mb-1">Rilis</p>
                <p className="font-medium text-[#362b21] dark:text-[#f0e9db]">Februari 2026</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#e6d5bf] dark:border-[#4f3d2f] pt-4">
            <h4 className="text-xs font-bold text-[#362b21] dark:text-[#f0e9db] mb-3">Kontak & Pemesanan</h4>
            <div className="space-y-2">
              <a href="mailto:atariacorp@gmail.com" className="flex items-center gap-3 p-3 bg-[#faf7f2] dark:bg-[#362b21] rounded-lg hover:bg-[#e6d5bf] dark:hover:bg-[#4f3d2f] transition-colors group">
                <Mail size={16} className="text-[#b48c5c] group-hover:scale-110 transition-transform" />
                <span className="text-xs text-[#6d5340] dark:text-[#e6d5bf]">atariacorp@gmail.com</span>
              </a>
              <a href="tel:+6281234567890" className="flex items-center gap-3 p-3 bg-[#faf7f2] dark:bg-[#362b21] rounded-lg hover:bg-[#e6d5bf] dark:hover:bg-[#4f3d2f] transition-colors group">
                <Phone size={16} className="text-[#b48c5c] group-hover:scale-110 transition-transform" />
                <span className="text-xs text-[#6d5340] dark:text-[#e6d5bf]">0812-3456-7890</span>
              </a>
              <div className="flex items-center gap-3 p-3 bg-[#faf7f2] dark:bg-[#362b21] rounded-lg">
                <Globe size={16} className="text-[#b48c5c]" />
                <span className="text-xs text-[#6d5340] dark:text-[#e6d5bf]">www.atariacorp.com</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-[#b48c5c] to-[#8b6b4c] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;