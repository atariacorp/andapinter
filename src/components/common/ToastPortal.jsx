import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastPortal = ({ notifications, removeNotification, isDarkMode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Buat elemen toast-root jika belum ada
    if (!document.getElementById('toast-root')) {
      const el = document.createElement('div');
      el.id = 'toast-root';
      document.body.appendChild(el);
    }
    
    return () => setMounted(false);
  }, []);

  if (!mounted || !notifications || notifications.length === 0) return null;

  const toastRoot = document.getElementById('toast-root');

  return ReactDOM.createPortal(
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%) !important',
        zIndex: '999999 !important',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
        pointerEvents: 'none',
        maxWidth: '500px',
        width: 'calc(100% - 40px)',
        margin: '0 auto'
      }}
    >
      {notifications.map((notif, index) => {
        let Icon = Info;
        let bgColor = isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)';
        let borderColor = isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)';
        let iconColor = isDarkMode ? '#60a5fa' : '#2563eb';

        if (notif.type === 'success') {
          Icon = CheckCircle;
          bgColor = isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)';
          borderColor = isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)';
          iconColor = isDarkMode ? '#34d399' : '#059669';
        } else if (notif.type === 'error') {
          Icon = AlertCircle;
          bgColor = isDarkMode ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.1)';
          borderColor = isDarkMode ? 'rgba(244, 63, 94, 0.3)' : 'rgba(244, 63, 94, 0.2)';
          iconColor = isDarkMode ? '#f87171' : '#dc2626';
        }

        return (
          <div
            key={notif.id}
            style={{
              pointerEvents: 'auto',
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              padding: '16px 20px',
              borderRadius: '16px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              animation: 'slideInFromTop 0.3s ease-out forwards',
              transform: 'translateY(-100%)',
              opacity: 0
            }}
            onAnimationEnd={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.opacity = '1';
            }}
          >
            <div style={{ color: iconColor, marginTop: '2px' }}>
              <Icon size={22} />
            </div>
            <p style={{
              flex: 1,
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '1.5',
              color: isDarkMode ? '#fff' : '#1e293b',
              margin: 0
            }}>
              {notif.message}
            </p>
            <button
              onClick={() => removeNotification(notif.id)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px',
                borderRadius: '6px',
                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                e.currentTarget.style.color = isDarkMode ? '#fff' : '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>,
    toastRoot
  );
};

export default ToastPortal;