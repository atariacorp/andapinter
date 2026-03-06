import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useMasterData } from './hooks/useMasterData';
import { useProposals } from './hooks/useProposals';
import { BrandingProvider, useBranding } from './context/BrandingContext';
import LoginScreen from './components/auth/LoginScreen';
import MainLayout from './components/layout/MainLayout';
import DeleteConfirmModal from './components/common/DeleteConfirmModal';
import { IS_CANVAS, storage } from './utils';

const AppContent = () => {
  const { user, authInitialized, login, logout, loading: authLoading } = useAuth();
  const { branding } = useBranding();
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '', type: 'SKPD' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState({ 
    nama: 'Memuat...', 
    level: 'Viewer', 
    skpdId: '' 
  });

  // ===== TAMBAHKAN STATE UNTUK ACTIVITY LOGS =====
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  // ===== AKHIR TAMBAHAN =====
  
  // ===== FUNGSI UNTUK ACTIVITY LOGS =====
const addActivityLog = async ({ action, category, description, dataId = null, oldData = null, newData = null }) => {
  if (!user) return;
  
  try {
    const logData = {
      action,
      category,
      description,
      userId: user.uid,
      userName: currentUserProfile.nama || user.email || 'Unknown',
      userLevel: currentUserProfile.level || 'Viewer',
      timestamp: new Date().toISOString(),
      dataId,
      oldData: oldData ? JSON.stringify(oldData) : null,
      newData: newData ? JSON.stringify(newData) : null
    };
    
    // Simulasi dulu tanpa Firestore
    console.log('📝 Activity Log:', logData);
    
    // Tambahkan ke state lokal
    setActivityLogs(prev => [logData, ...prev].slice(0, 100)); // Simpan 100 log terbaru
    
    // Nanti bisa ditambahkan ke Firestore
    // await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'activity_logs'), logData);
    
  } catch (err) {
    console.error("Gagal mencatat log:", err);
  }
};

const refreshLogs = async () => {
  setLoadingLogs(true);
  try {
    // Simulasi refresh
    console.log('Refreshing logs...');
    // Nanti bisa diisi dengan fetch dari Firestore
    setLoadingLogs(false);
  } catch (err) {
    console.error('Error refreshing logs:', err);
    setLoadingLogs(false);
  }
};
// ===== AKHIR FUNGSI LOGS =====

  // Load master data
  const masterData = useMasterData(user);
  
  // Load proposals
  const proposals = useProposals(user, currentUserProfile);

  // Theme effect
  useEffect(() => {
    const metaTheme = document.createElement('meta');
    metaTheme.name = "theme-color";
    metaTheme.content = isDarkMode ? "#0f172a" : "#ffffff";
    document.head.appendChild(metaTheme);
    return () => metaTheme.remove();
  }, [isDarkMode]);

  // Map Firebase user to profile
  useEffect(() => {
    if (user) {
      const email = user.email || '';
      if (masterData.usersList.length > 0) {
        const matchedProfile = masterData.usersList.find(u => 
          u.uid === user.uid || u.nama?.toLowerCase() === email.toLowerCase()
        );
        
        if (matchedProfile) {
          setCurrentUserProfile({...matchedProfile, skpdId: matchedProfile.skpdId || ''});
        } else if (email === 'asthar.pramana@gmail.com') {
          setCurrentUserProfile({ nama: 'Asthar P. (Admin Utama)', level: 'Admin', skpdId: '' });
        } else {
          setCurrentUserProfile({ nama: email.split('@')[0] || 'Guest', level: 'Viewer', skpdId: '' });
        }
      } else if (email === 'asthar.pramana@gmail.com') {
        setCurrentUserProfile({ nama: 'Asthar P. (Admin Utama)', level: 'Admin', skpdId: '' });
      } else {
        setCurrentUserProfile({ nama: email.split('@')[0] || 'Guest', level: 'Viewer', skpdId: '' });
      }
    }
  }, [user, masterData.usersList]);

  // Notification functions
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message: String(message), type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogin = async (email, password, isRegister) => {
    try {
      if (isRegister) {
        // await register(email, password); // Anda perlu menambahkan fungsi register di useAuth
        addNotification("Akun berhasil didaftarkan!", "success");
      } else {
        await login(email, password);
        addNotification("Berhasil Masuk!", "success");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        addNotification("Email sudah terdaftar.", "error");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        addNotification("Email atau kata sandi salah.", "error");
      } else if (err.code === 'auth/operation-not-allowed') {
        addNotification("Fitur Login Email belum diaktifkan di Firebase Console!", "error");
      } else {
        addNotification(`Gagal: ${err.message}`, "error");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      addNotification("Anda telah keluar.", "info");
    } catch (e) {
      addNotification("Gagal keluar akun.", "error");
    }
  };

  const executeDelete = async () => {
    const { id, type, name } = deleteConfirm;
    if (!id) return;

    setIsProcessing(true);
    try {
      if (type === 'Usulan') {
        await proposals.deleteProposal(id);
        addNotification(`Usulan berhasil dihapus`, 'success');
      } else {
        await masterData.deleteItem(type, id);
        addNotification(`${type} berhasil dihapus`, 'success');
      }
      setDeleteConfirm({ show: false, id: null, name: '', type: 'SKPD' });
    } catch (err) {
      console.error(err);
      addNotification(`Gagal menghapus data: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!authInitialized) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 ${isDarkMode ? 'dark' : ''}`}>
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-xl shadow-blue-500/30">
            {branding.icon}
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
            Memuat {branding.name1}{branding.name2}...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        isLoggingIn={authLoading}
        notifications={notifications}
        removeNotification={removeNotification}
        branding={branding}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    );
  }

  // ===== FUNGSI STORAGE =====
const checkStorageUsage = async () => {
  // Implementasi check storage
  console.log('Checking storage usage...');
  // Sementara return dummy dulu
  return {
    used: '0 MB',
    total: '5 GB',
    percentage: 0,
    files: 0,
    folders: {}
  };
};

const backupAllFiles = async () => {
  console.log('Backing up files...');
  addNotification('Fitur backup dalam pengembangan', 'info');
};

const restoreFromBackup = async (file, onProgress) => {
  console.log('Restoring from backup...', file);
  addNotification('Fitur restore dalam pengembangan', 'info');
};

const cleanupOrphanFiles = async () => {
  console.log('Cleaning up orphan files...');
  addNotification('Fitur cleanup dalam pengembangan', 'info');
};

// Kirim ke MainLayout

  return (
    <div className={`${isDarkMode ? 'dark' : ''} print:bg-white`}>
      <MainLayout
        user={user}
        branding={branding}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onLogout={handleLogout}
        notifications={notifications}
        removeNotification={removeNotification}
        addNotification={addNotification}
        setDeleteConfirm={setDeleteConfirm}
        currentUserProfile={currentUserProfile}
        masterData={masterData}
        proposals={proposals}
        storage={storage}
        checkStorageUsage={checkStorageUsage}
        backupAllFiles={backupAllFiles}
        restoreFromBackup={restoreFromBackup}
        cleanupOrphanFiles={cleanupOrphanFiles}
      />

      <DeleteConfirmModal
        show={deleteConfirm.show}
        name={deleteConfirm.name}
        type={deleteConfirm.type}
        isProcessing={isProcessing}
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm({ show: false, id: null, name: '', type: 'SKPD' })}
      />
    </div>
  );
};

const App = () => {
  const { user } = useAuth();
  
  return (
    <BrandingProvider user={user}>
      <AppContent />
    </BrandingProvider>
  );
};

export default App;