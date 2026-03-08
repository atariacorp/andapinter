import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, CheckCheck, Volume2, VolumeX, X, 
  FileText, CheckCircle, XCircle, Clock, Info, AlertCircle
} from 'lucide-react';
import notificationService from '../../services/NotificationService';

// Default colors jika props tidak dikirim
const defaultColors = {
  tealDark: '#425c5a',
  tealMedium: '#3c5654',
  tealLight: '#e2eceb',
  tealPale: '#cadfdf',
  gold: '#d7a217'
};

const NotificationBell = ({ isDarkMode, colors = defaultColors }) => {
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

      {/* Dropdown Notifikasi (sama seperti sebelumnya) */}
      {showDropdown && (
        <div 
          className="absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl overflow-hidden z-50"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.95)' : 'white',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${colors.tealPale}`
          }}
        >
          {/* ... konten dropdown notifikasi (sama seperti kode sebelumnya) ... */}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;