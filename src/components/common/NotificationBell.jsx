import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, CheckCheck, Volume2, VolumeX, X, 
  FileText, CheckCircle, XCircle, Clock, Info
} from 'lucide-react';
import notificationService from '../../services/NotificationService';

const NotificationBell = ({ isDarkMode, colors }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Subscribe ke notification service
    const unsubscribe = notificationService.addListener((updated) => {
      setNotifications(updated);
    });

    // Request browser notification permission
    notificationService.requestBrowserPermission();

    // Click outside handler
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getFilteredNotifications = () => {
    return notificationService.getFilteredNotifications(filter);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success':
        return <CheckCircle size={16} className="text-[#10b981]" />;
      case 'error':
        return <XCircle size={16} className="text-[#ef4444]" />;
      case 'warning':
        return <AlertCircle size={16} className="text-[#d7a217]" />;
      case 'info':
        return <Info size={16} className="text-[#3c5654]" />;
      default:
        return <FileText size={16} className="text-[#3c5654]" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return past.toLocaleDateString('id-ID');
  };

  const unreadCount = notificationService.getUnreadCount();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg transition-all hover:scale-110"
        style={{ 
          backgroundColor: showDropdown ? `${colors.gold}20` : 'transparent',
          color: colors.gold
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse"
            style={{ 
              backgroundColor: '#ef4444',
              color: 'white'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Notifikasi */}
      {showDropdown && (
        <div 
          className="absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl overflow-hidden z-50"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.95)' : 'white',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${colors.tealPale}`
          }}
        >
          {/* Header */}
          <div 
            className="p-4 border-b flex justify-between items-center"
            style={{ borderColor: colors.tealPale }}
          >
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: colors.tealDark }}>
              <Bell size={16} style={{ color: colors.gold }} />
              Notifikasi
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(notificationService.toggleSound())}
                className="p-1.5 rounded-lg transition-all hover:scale-110"
                style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
                title={soundEnabled ? 'Matikan suara' : 'Hidupkan suara'}
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={() => notificationService.markAllAsRead()}
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
                  title="Tandai semua sebagai dibaca"
                >
                  <CheckCheck size={14} />
                </button>
              )}
              <button
                onClick={() => setShowDropdown(false)}
                className="p-1.5 rounded-lg hover:bg-opacity-20"
                style={{ color: colors.tealMedium }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="p-3 border-b flex gap-2" style={{ borderColor: colors.tealPale }}>
            {['all', 'unread', 'success', 'warning', 'error'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all ${
                  filter === f ? 'ring-2' : ''
                }`}
                style={{ 
                  backgroundColor: filter === f ? `${colors.gold}20` : 'transparent',
                  color: filter === f ? colors.gold : colors.tealMedium,
                  ringColor: colors.gold
                }}
              >
                {f === 'all' ? 'Semua' : 
                 f === 'unread' ? 'Belum dibaca' : 
                 f === 'success' ? 'Sukses' : 
                 f === 'warning' ? 'Peringatan' : 'Error'}
              </button>
            ))}
          </div>

          {/* Daftar Notifikasi */}
          <div className="max-h-96 overflow-y-auto">
            {getFilteredNotifications().length > 0 ? (
              getFilteredNotifications().map((n) => (
                <div
                  key={n.id}
                  className={`p-4 border-b cursor-pointer transition-all hover:bg-opacity-50 ${
                    n.read ? 'opacity-60' : ''
                  }`}
                  style={{ borderColor: colors.tealPale }}
                  onClick={() => {
                    notificationService.markAsRead(n.id);
                    if (n.onClick) n.onClick();
                  }}
                >
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-1">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold mb-1" style={{ color: colors.tealDark }}>
                        {n.title}
                      </p>
                      <p className="text-xs mb-2" style={{ color: colors.tealMedium }}>
                        {n.message}
                      </p>
                      <div className="flex justify-between items-center text-[9px]">
                        <span style={{ color: colors.tealMedium }}>
                          {getTimeAgo(n.timestamp)}
                        </span>
                        {!n.read && (
                          <span 
                            className="px-2 py-0.5 rounded-full text-[8px] font-bold"
                            style={{ 
                              backgroundColor: colors.gold,
                              color: 'white'
                            }}
                          >
                            BARU
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto mb-2 opacity-30" style={{ color: colors.tealMedium }} />
                <p className="text-sm italic" style={{ color: colors.tealMedium }}>
                  Tidak ada notifikasi
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div 
              className="p-3 border-t flex justify-between"
              style={{ borderColor: colors.tealPale }}
            >
              <button
                onClick={() => notificationService.clearAll()}
                className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                style={{ 
                  backgroundColor: isDarkMode ? colors.tealMedium : colors.tealPale,
                  color: isDarkMode ? colors.tealLight : colors.tealDark
                }}
              >
                Hapus Semua
              </button>
              <span className="text-xs px-3 py-1.5" style={{ color: colors.tealMedium }}>
                {notifications.length} notifikasi
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;