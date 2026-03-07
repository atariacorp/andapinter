import React from 'react';
import { X, Mail, Phone, Globe, Sparkles, Github, Twitter } from 'lucide-react';

const InfoModal = ({ show, onClose, branding }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="glass-card max-w-md w-full p-6 rounded-2xl animate-in zoom-in-95"
        style={{
          background: 'rgba(226, 236, 235, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(215, 162, 23, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg relative"
              style={{ background: 'linear-gradient(135deg, #425c5a 0%, #3c5654 100%)' }}
            >
              <Sparkles size={16} className="absolute top-1 right-1 text-white/50" style={{ color: '#d7a217' }} />
              <span>{branding.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: '#425c5a' }}>
                {branding.name1}
                <span style={{ color: '#d7a217' }}>{branding.name2}</span>
              </h3>
              <p className="text-xs" style={{ color: '#3c5654' }}>Version 1.0.0</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-[#cadfdf] dark:hover:bg-[#3c5654] rounded-lg transition-colors"
          >
            <X size={18} style={{ color: '#425c5a' }} />
          </button>
        </div>
        
        {/* Body */}
        <div className="space-y-6">
          <div 
            className="p-4 backdrop-blur-sm rounded-xl border"
            style={{ 
              background: 'rgba(202, 223, 223, 0.3)',
              borderColor: 'rgba(215, 162, 23, 0.2)'
            }}
          >
            <p className="text-sm font-medium" style={{ color: '#425c5a' }}>
              {branding.tagline}
            </p>
            <p className="text-xs mt-2" style={{ color: '#3c5654' }}>
              {branding.subTagline}
            </p>
          </div>
          
          <div className="border-t pt-4" style={{ borderColor: '#cadfdf' }}>
            <h4 className="text-xs font-semibold mb-3" style={{ color: '#425c5a' }}>
              Application Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div 
                className="p-3 backdrop-blur-sm rounded-lg"
                style={{ background: 'rgba(202, 223, 223, 0.3)' }}
              >
                <p className="text-xs mb-1" style={{ color: '#3c5654' }}>Version</p>
                <p className="font-medium" style={{ color: '#425c5a' }}>1.0.0 Stable</p>
              </div>
              <div 
                className="p-3 backdrop-blur-sm rounded-lg"
                style={{ background: 'rgba(202, 223, 223, 0.3)' }}
              >
                <p className="text-xs mb-1" style={{ color: '#3c5654' }}>Release</p>
                <p className="font-medium" style={{ color: '#425c5a' }}>March 2026</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4" style={{ borderColor: '#cadfdf' }}>
            <h4 className="text-xs font-semibold mb-3" style={{ color: '#425c5a' }}>Contact</h4>
            <div className="space-y-2">
              <a 
                href="mailto:atariacorp@gmail.com" 
                className="flex items-center gap-3 p-3 backdrop-blur-sm rounded-lg transition-all group"
                style={{ 
                  background: 'rgba(202, 223, 223, 0.3)',
                  border: '1px solid rgba(215, 162, 23, 0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(202, 223, 223, 0.6)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(202, 223, 223, 0.3)'}
              >
                <Mail size={16} className="group-hover:scale-110 transition-transform" style={{ color: '#d7a217' }} />
                <span className="text-sm" style={{ color: '#425c5a' }}>atariacorp@gmail.com</span>
              </a>
              
              <a 
                href="tel:+6281234567890" 
                className="flex items-center gap-3 p-3 backdrop-blur-sm rounded-lg transition-all group"
                style={{ 
                  background: 'rgba(202, 223, 223, 0.3)',
                  border: '1px solid rgba(215, 162, 23, 0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(202, 223, 223, 0.6)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(202, 223, 223, 0.3)'}
              >
                <Phone size={16} className="group-hover:scale-110 transition-transform" style={{ color: '#d7a217' }} />
                <span className="text-sm" style={{ color: '#425c5a' }}>+62 812-3456-7890</span>
              </a>
              
              <div 
                className="flex items-center gap-3 p-3 backdrop-blur-sm rounded-lg"
                style={{ 
                  background: 'rgba(202, 223, 223, 0.3)',
                  border: '1px solid rgba(215, 162, 23, 0.1)'
                }}
              >
                <Globe size={16} style={{ color: '#d7a217' }} />
                <span className="text-sm" style={{ color: '#425c5a' }}>www.atariacorp.com</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 pt-2">
            <Github 
              size={18} 
              className="cursor-pointer transition-colors hover:scale-110"
              style={{ color: '#3c5654' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d7a217'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#3c5654'}
            />
            <Twitter 
              size={18} 
              className="cursor-pointer transition-colors hover:scale-110"
              style={{ color: '#3c5654' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d7a217'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#3c5654'}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #d7a217 0%, #b8860b 100%)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;