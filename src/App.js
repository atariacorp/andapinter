import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc,
  query,
  writeBatch,
  orderBy,
  limit,
  getDocs 
} from 'firebase/firestore';
// ===== TAMBAHKAN IMPORT STORAGE =====
import { 
  getStorage, 
  ref, 
  uploadBytes,           // <-- TAMBAHKAN INI
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
// ===== AKHIR IMPORT STORAGE =====
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Printer, 
  Search, 
  ArrowLeft, 
  Building2, 
  ChevronRight, 
  Clock,
  Settings, 
  Trash2, 
  X, 
  Upload, 
  Download, 
  UserPlus, 
  Inbox, 
  FileCheck, 
  FileX,
  Info,
  Menu,
  Send,
  Calendar,
  Database,
  Edit3,
  FileSpreadsheet,
  ChevronLeft,
  Link as LinkIcon,
  MessageSquare,
  History,
  Paperclip,
  PieChart,
  BarChart2,
  CalendarDays,
  Moon,
  Sun,
  AlertTriangle,
  Layers,
  Plus,
  Users,
  Lock,
  Mail,
  LogOut,
  Bell,
  Palette,
  BookOpen,
  RefreshCw,  // <-- TAMBAHKAN INI
  Phone,
  Globe
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyCkv4qPS4mcZcg7c14_a5CE9PRr4l7nJrQ",
  authDomain: "siska-pemko-medan.firebaseapp.com",
  projectId: "siska-pemko-medan",
  storageBucket: "siska-pemko-medan.appspot.com",
  messagingSenderId: "918892241989",
  appId: "1:918892241989:web:b203674969f9caa3fa6f2c",
  measurementId: "G-SYCYLPQE48"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'andapinter-bkad-medan'; 

// ===== INISIALISASI STORAGE =====
const storage = getStorage(app);
// ===== AKHIR INISIALISASI STORAGE =====

// ===== DETEKSI ENVIRONMENT =====
const IS_CANVAS = window.location.hostname.includes('scf.usercontent.goog') || 
                  window.location.hostname.includes('canvas');

console.log("📍 Environment:", IS_CANVAS ? "CANVAS" : "PRODUCTION");
// ===== AKHIR DETEKSI =====

// --- Global Helper Components ---
const StatusBadge = ({ status }) => {
  const styles = { 
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50', 
    'Diverifikasi': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50', 
    'Disetujui': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50', 
    'Ditolak Operator': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50',
    'Ditolak Admin': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50',
    'Ditolak': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50' 
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black border uppercase tracking-widest shadow-sm ${styles[String(status)] || styles['Pending']}`}>
      {String(status || "Pending")}
    </span>
  );
};

const StatCard = ({ title, value, icon, color, darkColor, description }) => (
  <div className={`${color} ${darkColor} p-4 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col gap-2 text-left transition-transform hover:scale-[1.03] active:scale-95 duration-200`}>
    <div className="flex justify-between items-start">
      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100/50 dark:border-slate-700">{icon}</div>
      <p className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{String(value)}</p>
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest leading-none">{String(title)}</p>
      <p className="text-[9px] text-slate-500 dark:text-slate-500 font-bold italic mt-1.5 opacity-70">{String(description)}</p>
    </div>
  </div>
);

const NavItem = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm uppercase tracking-tighter ${active ? 'bg-blue-600 text-white shadow-xl translate-x-1' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800 hover:text-slate-200 dark:hover:bg-slate-800/50'}`}>
    {icon} {String(label)}
  </button>
);

const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val || 0));
// ===== FUNGSI HELPER UNTUK GENERATE ID UNIK =====
const generateUniqueId = () => {
  // Menggunakan crypto.randomUUID() jika tersedia (modern browser)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback untuk browser lama
  return Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '-' + performance.now();
};
// ===== AKHIR FUNGSI HELPER =====

const App = () => {
  // --- States ---
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState({ nama: 'Memuat...', level: 'Viewer', skpdId: '' });
  
  // Custom Branding States
  const defaultBranding = {
  name1: 'ANDA',
  name2: 'PINTER',
  tagline: 'Aplikasi Pendataan Pergeseran Anggaran',
  subTagline: 'Badan Keuangan dan Aset Daerah Kota Medan',
  icon: 'A',
  logoUrl: '' // <-- TAMBAHKAN UNTUK LOGO
};
const [branding, setBranding] = useState(defaultBranding);
const [brandingForm, setBrandingForm] = useState(defaultBranding);

  // State tambahan untuk Simulasi UI Login di lingkungan Preview Canvas
  const [isUiAuthenticated, setIsUiAuthenticated] = useState(false);
  const [uiEmail, setUiEmail] = useState('');

  // Login / Register States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false); 

  const [view, setView] = useState('dashboard'); 
  const [settingsTab, setSettingsTab] = useState('master-skpd');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [proposals, setProposals] = useState([]);
  const [skpdList, setSkpdList] = useState([]);
  const [subKegList, setSubKegList] = useState([]);
  const [showSubKegDropdown, setShowSubKegDropdown] = useState(false);
  const [searchSubKeg, setSearchSubKeg] = useState('');
  const [filteredSubKeg, setFilteredSubKeg] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [tahapList, setTahapList] = useState([]);
  const [tapdList, setTapdList] = useState([]); 
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // State interaksi
  const [isProcessing, setIsProcessing] = useState(false);
  const [localCatatan, setLocalCatatan] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '', type: 'SKPD' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedTahap, setSelectedTahap] = useState('Semua');
// ===== TAMBAHKAN STATE UNTUK TAHUN ANGGARAN =====
  const [tahunList, setTahunList] = useState([]);
  const [newTahun, setNewTahun] = useState('');
// ===== AKHIR STATE TAHUN ANGGARAN =====
  const [notifications, setNotifications] = useState([]);
// ===== TAMBAHKAN STATE UNTUK NOTIFIKASI REAL-TIME =====
const [unreadCount, setUnreadCount] = useState(0);
const [showNotificationPanel, setShowNotificationPanel] = useState(false);
const [lastChecked, setLastChecked] = useState(new Date().toISOString());  
  const [loading, setLoading] = useState(true);

  // Bulk Approval State
  const [selectedForBulk, setSelectedForBulk] = useState([]);

  // Chat/Comment State
  const [commentText, setCommentText] = useState('');
  const chatContainerRef = useRef(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form States
  const [newSkpd, setNewSkpd] = useState('');
  const [newSubKeg, setNewSubKeg] = useState('');
  const [newTahap, setNewTahap] = useState('');
  const [newTapd, setNewTapd] = useState({ nip: '', nama: '', jabatan: '' }); 
  const [newUser, setNewUser] = useState({ nama: '', level: 'SKPD', skpdId: '', assignedSkpds: [], uid: '' });
  
  const [proposalForm, setProposalForm] = useState({
  id: null,
  skpd: '',
  skpdId: '',
  tahap: 'Belum Ditentukan',
  nomorSurat: '',
  tanggalSurat: new Date().toISOString().split('T')[0],
  perihal: '',
  subKegiatan: '',
  alasan: '',
  hasilVerifikasi: '',
  lampiran: null,  // <-- GANTI JADI OBJECT
  history: [],
  comments: [],
  rincian: [{ id: generateUniqueId(), kodeRekening: '', uraian: '', paguSebelum: 0, paguSesudah: 0 }]
});

  // ===== TAMBAHKAN STATE UNTUK BANK CATATAN =====
  const [bankCatatan, setBankCatatan] = useState([]);
  const [showBankCatatan, setShowBankCatatan] = useState(false);
  const [editingCatatan, setEditingCatatan] = useState({ id: null, judul: '', isi: '' });
  const [formCatatan, setFormCatatan] = useState({ judul: '', isi: '' });
  // ===== TAMBAHKAN STATE UNTUK BANK SRO =====
  const [bankSro, setBankSro] = useState([]);
  const [showBankSro, setShowBankSro] = useState(false);
  const [filterBankSro, setFilterBankSro] = useState('');
// ===== TAMBAHKAN STATE PAGINATION UNTUK BANK SRO =====
  const [sroCurrentPage, setSroCurrentPage] = useState(1);
  const [sroItemsPerPage, setSroItemsPerPage] = useState(20); // 20 data per halaman
// ===== AKHIR STATE PAGINATION =====
  const [newSro, setNewSro] = useState({ kode: '', uraian: '' });
  const [editingSro, setEditingSro] = useState({ id: null, kode: '', uraian: '' });
  // ===== AKHIR STATE BANK SRO =====
  const [importProgress, setImportProgress] = useState({show:false,current:0,total:0,status:'',successCount:0,errorCount:0,errors:[]});

// ===== STATE UNTUK MODAL INFORMASI APLIKASI =====
const [showInfoModal, setShowInfoModal] = useState(false);
// ===== AKHIR STATE MODAL INFORMASI =====

// ===== STATE UNTUK UPLOAD FILE =====
const [uploadProgress, setUploadProgress] = useState(0);
const [uploadingFile, setUploadingFile] = useState(false);
const [uploadError, setUploadError] = useState(null);
// ===== AKHIR STATE UPLOAD =====

// ===== STATE UNTUK MONITORING STORAGE =====
const [storageStats, setStorageStats] = useState({
  used: '0 MB',
  total: '5 GB',
  percentage: 0,
  files: [],
  folders: {}
});
const [loadingStorage, setLoadingStorage] = useState(false);
// ===== AKHIR STATE STORAGE =====

// ===== STATE UNTUK BACKUP =====
const [backupLoading, setBackupLoading] = useState(false);
// ===== AKHIR STATE BACKUP =====

// ===== STATE UNTUK RESTORE =====
const [restoreLoading, setRestoreLoading] = useState(false);
const [restoreProgress, setRestoreProgress] = useState(0);
const [restoreFile, setRestoreFile] = useState(null);
const [showRestoreModal, setShowRestoreModal] = useState(false);
// ===== AKHIR STATE RESTORE =====

// ===== STATE UNTUK HISTORY LOG =====
const [activityLogs, setActivityLogs] = useState([]);
const [showLogPanel, setShowLogPanel] = useState(false);
const [logFilter, setLogFilter] = useState('semua');
const [logDateRange, setLogDateRange] = useState({ start: '', end: '' });
// ===== AKHIR STATE LOG =====
  // ========== TAMBAHKAN DEBUGGING DI SINI ==========
  useEffect(() => {
  if (selectedProposal?.comments) {
    console.log("📍 Comments data:", selectedProposal.comments);
    setTimeout(() => {
      const chatElements = document.querySelectorAll('.chat-message');
      console.log("📍 Chat elements found:", chatElements.length);
    }, 500);
  }
}, [selectedProposal]);
// ===== FILTER SUB KEGIATAN BERDASARKAN PENCARIAN =====
  useEffect(() => {
  if (searchSubKeg.trim() === '') {
    setFilteredSubKeg([]);
  } else {
    const filtered = subKegList.filter(item => 
      item.nama?.toLowerCase().includes(searchSubKeg.toLowerCase())
    );
    setFilteredSubKeg(filtered.slice(0, 10)); // Batasi 10 hasil
  }
}, [searchSubKeg, subKegList]);
// ===== AKHIR FILTER =====
  // --- 1. PWA & Auth Setup ---
  useEffect(() => {
    const metaTheme = document.createElement('meta');
    metaTheme.name = "theme-color";
    metaTheme.content = isDarkMode ? "#0f172a" : "#ffffff";
    document.head.appendChild(metaTheme);

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthInitialized(true);
    });
    
    return () => unsub();
  }, [isDarkMode]);

 // ===== MINTA IZIN NOTIFIKASI BROWSER =====
  useEffect(() => {
    requestNotificationPermission();
  }, []); // Hanya dijalankan sekali saat komponen mount
  // ===== AKHIR IZIN NOTIFIKASI =====
// --- Map Firebase User to App Profile ---
useEffect(() => {
  if (user) {
    const email = user.email || '';
    if (usersList.length > 0) {
      const matchedProfile = usersList.find(u => u.uid === user.uid || u.nama?.toLowerCase() === email.toLowerCase());
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
    
    // ===== TAMBAHKAN BARIS INI =====
    // Pastikan folder proposals ada (untuk user yang sudah login)
    ensureProposalsFolder();
    // ===== AKHIR PENAMBAHAN =====
  }
}, [user, usersList]);

  // --- 2. Firestore Listeners ---
  useEffect(() => {
    if (!user) return; 

    const handlePermissionError = (err) => {
      console.error("Firestore Permission Error:", err);
      if (err.code === 'permission-denied') {
        setNotifications(prev => {
          if (prev.some(n => n.message.includes("Aturan Firestore"))) return prev;
          return [...prev, { id: Date.now(), message: "AKSES DITOLAK: Buka tab 'Rules' di Firestore Anda dan ubah menjadi 'allow read, write: if true;'", type: 'error' }];
        });
      }
    };

    const unsubBranding = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'config', 'app_branding'), (docSnap) => {
      if (docSnap.exists()) {
        setBranding(docSnap.data());
        setBrandingForm(docSnap.data());
      }
    }, handlePermissionError);

    const unsubSkpd = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'skpds'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSkpdList(list.sort((a, b) => (String(a.nama || "")).localeCompare(String(b.nama || ""))));
    }, handlePermissionError);

    const unsubSubKeg = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'sub_kegiatans'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSubKegList(list.sort((a, b) => (String(a.nama || "")).localeCompare(String(b.nama || ""))));
    }, handlePermissionError);

    const unsubUsers = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'users'), (snapshot) => {
      setUsersList(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    }, handlePermissionError);

    const unsubTahap = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'tahapan'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTahapList(list.sort((a, b) => (String(a.nama || "")).localeCompare(String(b.nama || ""))));
    }, handlePermissionError);

    const unsubTapd = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'tapd'), (snapshot) => {
      setTapdList(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    }, handlePermissionError);

    // ===== TAMBAHKAN LISTENER UNTUK TAHUN ANGGARAN =====
    const unsubTahun = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'tahun_anggaran'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      // Urutkan dari tahun terbaru ke terlama
      setTahunList(list.sort((a, b) => String(b.tahun || b.nama || "").localeCompare(String(a.tahun || a.nama || ""))));
    }, handlePermissionError);
    // ===== AKHIR LISTENER TAHUN ANGGARAN =====

    const unsubProposals = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'proposals'), (snapshot) => {
  const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  setProposals(list);
  setLoading(false);
  
  // ===== CEK PERUBAHAN UNTUK NOTIFIKASI =====
  snapshot.docChanges().forEach(change => {
    // Notifikasi usulan baru
    if (change.type === 'added') {
      const data = change.doc.data();
      const createdAt = data.createdAt || data.tanggalSurat;
      
      if (createdAt && createdAt > lastChecked) {
        addRealTimeNotification({
          type: 'new_proposal',
          title: '📄 Usulan Baru',
          message: `${data.skpd || 'SKPD'} mengirim usulan baru`,
          data: { id: change.doc.id, ...data },
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Notifikasi perubahan status
    if (change.type === 'modified') {
      const oldData = proposals.find(p => p.id === change.doc.id);
      const newData = change.doc.data();
      
      if (oldData && oldData.status !== newData.status) {
        addRealTimeNotification({
          type: 'status_change',
          title: '🔄 Status Berubah',
          message: `Usulan ${newData.nomorSurat || ''} berubah menjadi ${newData.status}`,
          data: { id: change.doc.id, ...newData },
          timestamp: new Date().toISOString()
        });
      }
      
      // Notifikasi komentar baru
      const oldComments = oldData?.comments?.length || 0;
      const newComments = newData?.comments?.length || 0;
      
      if (newComments > oldComments) {
        const lastComment = newData.comments[newData.comments.length - 1];
        addRealTimeNotification({
          type: 'new_comment',
          title: '💬 Komentar Baru',
          message: `${lastComment.sender}: ${lastComment.text.substring(0, 50)}...`,
          data: { id: change.doc.id, ...newData },
          timestamp: new Date().toISOString()
        });
      }
    }
  });
    }, handlePermissionError);

    // ===== TAMBAHKAN LISTENER UNTUK BANK CATATAN =====
    const unsubBankCatatan = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'bank_catatan'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setBankCatatan(list.sort((a, b) => (String(a.judul || "")).localeCompare(String(b.judul || ""))));
    }, handlePermissionError);
    // ===== AKHIR LISTENER BANK CATATAN =====

    // ===== TAMBAHKAN LISTENER UNTUK BANK SRO =====
    const unsubBankSro = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'bank_sro'), (snapshot) => {
  const list = snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  }));
  setBankSro(list.sort((a, b) => (String(a.kode || "")).localeCompare(String(b.kode || ""))));
}, handlePermissionError);

// ===== LISTENER UNTUK ACTIVITY LOGS =====
const unsubLogs = onSnapshot(
  query(
    collection(db, 'artifacts', appId, 'public', 'data', 'activity_logs'),
    orderBy('timestamp', 'desc'),
    limit(100)
  ), 
  (snapshot) => {
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setActivityLogs(list);
  }, 
  handlePermissionError
);
// ===== AKHIR LISTENER LOGS =====

return () => { 
  unsubBranding(); 
  unsubSkpd(); 
  unsubSubKeg(); 
  unsubUsers(); 
  unsubTahap(); 
  unsubTapd(); 
  unsubTahun();
  unsubProposals(); 
  unsubBankCatatan(); 
  unsubBankSro();
  unsubLogs(); // <-- TAMBAHKAN INI
};
  }, [user]);

  // Sinkronisasi data detail jika diubah dari luar / user lain
  useEffect(() => {
    if (selectedProposal && view === 'detail') {
      const updated = proposals.find(p => p.id === selectedProposal.id);
      if (updated) {
        if (JSON.stringify(updated.status) !== JSON.stringify(selectedProposal.status) || 
            JSON.stringify(updated.history) !== JSON.stringify(selectedProposal.history) ||
            JSON.stringify(updated.comments) !== JSON.stringify(selectedProposal.comments) ||
            JSON.stringify(updated.tahap) !== JSON.stringify(selectedProposal.tahap)) {
          setSelectedProposal(updated);
        }
      }
    }
  }, [proposals, view]);

  useEffect(() => {
  if (chatContainerRef.current) {
    // Delay kecil agar DOM selesai render
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  }
}, [selectedProposal?.comments, view, selectedProposal?.id]);

  useEffect(() => {
    setSelectedForBulk([]);
  }, [currentPage, searchTerm, statusFilter, view, selectedYear, selectedTahap]);

  // --- 3. Handlers ---
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message: String(message), type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // ===== FUNGSI UNTUK NOTIFIKASI REAL-TIME =====
const addRealTimeNotification = ({ type, title, message, data, timestamp }) => {
  const id = Date.now() + Math.random();
  
  // Tambahkan ke state notifications
  setNotifications(prev => [{
    id,
    type,
    title,
    message,
    data,
    timestamp,
    read: false
  }, ...prev].slice(0, 50)); // Maksimal 50 notifikasi
  
  // Update unread count
  setUnreadCount(prev => prev + 1);
  
  // Tampilkan pop-up (opsional)
  if (Notification.permission === 'granted') {
    new Notification(title, { body: message });
  }
  
  // Auto-hide setelah 5 detik (untuk yang tampil di layar)
  setTimeout(() => {
    const notifElement = document.getElementById(`notif-${id}`);
    if (notifElement) {
      notifElement.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 300);
    }
  }, 5000);
};

// Minta izin notifikasi browser
const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
};

// Tandai semua notifikasi sebagai sudah dibaca
const markAllAsRead = () => {
  setUnreadCount(0);
  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  setLastChecked(new Date().toISOString());
};

// Hapus notifikasi
const removeRealTimeNotification = (id) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
  // Update unread count jika notifikasi yang dihapus belum dibaca
  const notif = notifications.find(n => n.id === id);
  if (notif && !notif.read) {
    setUnreadCount(prev => Math.max(0, prev - 1));
  }
};
// ===== AKHIR FUNGSI NOTIFIKASI =====
  const handleAuthAction = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    if (isRegisterMode && loginPassword.length < 6) {
       addNotification("Password minimal 6 karakter.", "error");
       return;
    }

    setIsLoggingIn(true);
    
    try {
      if (isRegisterMode) {
  await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
  addNotification("Akun berhasil didaftarkan!", "success");
  await addActivityLog({
    action: 'REGISTER',
    category: 'auth',
    description: `User baru mendaftar dengan email: ${loginEmail}`
  });
} else {
  await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
  addNotification("Berhasil Masuk!", "success");
  await addActivityLog({
    action: 'LOGIN',
    category: 'auth',
    description: `User login: ${loginEmail}`
  });
}
    } catch (err) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        addNotification("Email sudah terdaftar. Silakan pindah ke menu 'Sudah memiliki akun' lalu Login.", "error");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        addNotification("Email atau kata sandi salah.", "error");
      } else if (err.code === 'auth/operation-not-allowed') {
        addNotification("Fitur Login Email belum diaktifkan di Firebase Console!", "error");
      } else {
        addNotification(`Gagal: ${err.message}`, "error");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
  try { 
    await addActivityLog({
      action: 'LOGOUT',
      category: 'auth',
      description: `${currentUserProfile.nama || user.email} logout dari sistem`
    });
    await signOut(auth); 
    setView('dashboard');
    setLoginPassword('');
    addNotification("Anda telah keluar.", "info");
  } catch (e) {
    addNotification("Gagal keluar akun.", "error");
  }
};

  const handleSaveBranding = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'app_branding');
      await setDoc(docRef, brandingForm);
      addNotification("Kustomisasi Tampilan Berhasil Disimpan!", "success");
    } catch (err) {
      addNotification("Gagal memperbarui kustomisasi.", "error");
      console.error(err);
    }
  };

// ===== HANDLER UPLOAD PDF (VERSI BARU DENGAN STORAGE) =====
const handlePdfUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const proposalId = proposalForm.id || 'draft';
  
  const result = await handleFileUploadToStorage(file, proposalId);
  
  if (result) {
    setProposalForm(prev => ({
      ...prev,
      lampiran: result
    }));
  }
  
  e.target.value = null;
};
// ===== AKHIR HANDLER UPLOAD PDF =====

  const handleAddRincian = (e) => {
    e.preventDefault();
    setProposalForm(prev => ({
      ...prev,
      rincian: [...(prev.rincian || []), { id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random(), kodeRekening: '', uraian: '', paguSebelum: 0, paguSesudah: 0 }]
    }));
  };

  const handleRemoveRincian = (id) => {
    setProposalForm(prev => ({
      ...prev,
      rincian: prev.rincian.filter(r => r.id !== id)
    }));
  };

  const handleRincianChange = (id, field, value) => {
    setProposalForm(prev => ({
      ...prev,
      rincian: prev.rincian.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const handleAddSkpd = async (e) => {
    e.preventDefault();
    if (!newSkpd.trim() || !user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'skpds'), { nama: newSkpd.trim(), createdAt: new Date().toISOString() });
      addNotification("SKPD Berhasil ditambahkan", "success");
      setNewSkpd('');
    } catch (err) { addNotification("Izin ditolak", "error"); }
  };

  const handleAddSubKeg = async (e) => {
    e.preventDefault();
    if (!newSubKeg.trim() || !user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'sub_kegiatans'), { nama: newSubKeg.trim(), createdAt: new Date().toISOString() });
      addNotification("Sub Kegiatan Berhasil ditambahkan", "success");
      setNewSubKeg('');
    } catch (err) { addNotification("Izin ditolak", "error"); }
  };

  const handleAddTahap = async (e) => {
    e.preventDefault();
    if (!newTahap.trim() || !user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tahapan'), { nama: newTahap.trim(), createdAt: new Date().toISOString() });
      addNotification("Tahapan Berhasil ditambahkan", "success");
      setNewTahap('');
    } catch (err) { addNotification("Izin ditolak", "error"); }
  };

  // ===== HANDLER UNTUK TAHUN ANGGARAN =====
  const handleAddTahun = async (e) => {
    e.preventDefault();
    if (!newTahun.trim() || !user) {
      addNotification("Tahun anggaran harus diisi", "error");
      return;
    }

    // Validasi format tahun (4 digit)
    const tahunRegex = /^\d{4}$/;
    if (!tahunRegex.test(newTahun.trim())) {
      addNotification("Format tahun tidak valid. Gunakan 4 digit angka (contoh: 2024)", "error");
      return;
    }

    // Cek duplikasi
    const existing = tahunList.find(t => t.tahun === newTahun.trim() || t.nama === newTahun.trim());
    if (existing) {
      addNotification(`Tahun ${newTahun.trim()} sudah ada dalam database`, "error");
      return;
    }

    setIsProcessing(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tahun_anggaran'), { 
        tahun: newTahun.trim(),
        nama: newTahun.trim(),
        createdAt: new Date().toISOString(),
        createdBy: currentUserProfile.nama
      });
      addNotification(`Tahun ${newTahun.trim()} berhasil ditambahkan`, "success");
      setNewTahun('');
    } catch (err) {
      console.error(err);
      addNotification(`Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHapusTahun = async (id, tahun) => {
    if (!user) return;
    
    setDeleteConfirm({
      show: true,
      id: id,
      name: `Tahun ${tahun}`,
      type: 'TahunAnggaran'
    });
  };
  // ===== AKHIR HANDLER TAHUN ANGGARAN =====

  const handleAddTapd = async (e) => {
    e.preventDefault();
    if (!newTapd.nama.trim() || !newTapd.nip.trim() || !newTapd.jabatan.trim() || !user) {
      addNotification("Lengkapi semua isian form TAPD", "error");
      return;
    }
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tapd'), { ...newTapd, createdAt: new Date().toISOString() });
      addNotification("Tim TAPD Berhasil ditambahkan", "success");
      setNewTapd({ nip: '', nama: '', jabatan: '' });
    } catch (err) { addNotification("Izin ditolak", "error"); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.nama.trim() || !newUser.uid.trim() || !user) {
      addNotification("Lengkapi Nama dan UID", "error");
      return;
    }
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'users'), { ...newUser, createdAt: new Date().toISOString() });
      addNotification("User Berhasil Didaftarkan", "success");
      setNewUser({ nama: '', level: 'SKPD', skpdId: '', assignedSkpds: [], uid: '' });
    } catch (err) { addNotification("Izin ditolak", "error"); }
  };

  // ===== HANDLER UNTUK BANK CATATAN =====
  const handleTambahCatatan = async (e) => {
    e.preventDefault();
    if (!user || !formCatatan.judul.trim() || !formCatatan.isi.trim()) {
      addNotification("Judul dan isi catatan harus diisi", "error");
      return;
    }

    setIsProcessing(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'bank_catatan'), {
        judul: formCatatan.judul.trim(),
        isi: formCatatan.isi.trim(),
        createdAt: new Date().toISOString(),
        createdBy: currentUserProfile.nama
      });
      addNotification("Catatan berhasil ditambahkan", "success");
      setFormCatatan({ judul: '', isi: '' });
    } catch (err) {
      console.error(err);
      addNotification(`Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditCatatan = async (e) => {
    e.preventDefault();
    if (!user || !editingCatatan.judul.trim() || !editingCatatan.isi.trim() || !editingCatatan.id) {
      addNotification("Data tidak valid", "error");
      return;
    }

    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'bank_catatan', editingCatatan.id), {
        judul: editingCatatan.judul.trim(),
        isi: editingCatatan.isi.trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: currentUserProfile.nama
      });
      addNotification("Catatan berhasil diperbarui", "success");
      setEditingCatatan({ id: null, judul: '', isi: '' });
    } catch (err) {
      console.error(err);
      addNotification(`Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHapusCatatan = async (id, judul) => {
    if (!user) return;
    
    setDeleteConfirm({
      show: true,
      id: id,
      name: judul,
      type: 'Catatan'
    });
  };

  const handleGunakanCatatan = (isi) => {
    setLocalCatatan(isi);
    setShowBankCatatan(false);
    addNotification("Catatan telah digunakan", "success");
  };
  // ===== AKHIR HANDLER BANK CATATAN =====

  // ===== HANDLER UNTUK BANK SRO =====
  const handleTambahSro = async (e) => {
    e.preventDefault();
    if (!user || !newSro.kode.trim() || !newSro.uraian.trim()) {
      addNotification("Kode rekening dan uraian harus diisi", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'bank_sro'), {
  kode: newSro.kode.trim(),
  uraian: newSro.uraian.trim(),
  createdAt: new Date().toISOString(),
  createdBy: currentUserProfile.nama
});
addNotification("Data SRO berhasil ditambahkan", "success");
await addActivityLog({
  action: 'CREATE',
  category: 'bank_sro',
  description: `${currentUserProfile.nama} menambah data SRO: ${newSro.kode}`,
  dataId: docRef.id,
  newData: newSro
});
      setEditingSro({ id: null, kode: '', uraian: '' });
    } catch (err) {
      console.error(err);
      addNotification(`Gagal: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ===== HANDLER UNTUK HAPUS SEMUA SRO =====
const handleHapusSemuaSro = async () => {
  if (!user) return;
  if (bankSro.length === 0) {
    addNotification("Tidak ada data untuk dihapus", "info");
    return;
  }

  setIsProcessing(true);
  try {
    const BATCH_SIZE = 250; // Hapus per batch
    const totalBatches = Math.ceil(bankSro.length / BATCH_SIZE);
    let deletedCount = 0;

    for (let i = 0; i < totalBatches; i++) {
      const start = i * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, bankSro.length);
      const batchData = bankSro.slice(start, end);
      
      const batch = writeBatch(db);
      batchData.forEach(item => {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'bank_sro', item.id);
        batch.delete(docRef);
      });
      
      await batch.commit();
      deletedCount += batchData.length;
      
      // Update progress
      addNotification(`Progress: ${deletedCount}/${bankSro.length} data dihapus...`, "info");
      
      // Delay antar batch
      if (i < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    addNotification(`✅ ${deletedCount} data SRO berhasil dihapus`, "success");
    setSroCurrentPage(1); // Reset ke halaman 1
    
  } catch (err) {
    console.error("Gagal hapus semua data:", err);
    addNotification(`❌ Gagal: ${err.message}`, "error");
  } finally {
    setIsProcessing(false);
  }
};
// ===== AKHIR HANDLER HAPUS SEMUA SRO =====
const handleHapusSro = async (id, kode) => {
  if (!user) return;
  
  setDeleteConfirm({
    show: true,
    id: id,
    name: `Kode: ${kode}`,
    type: 'SRO'
  });
};

// ===== SOLUSI 1: FUNGSI HANDLE PILIH SRO DENGAN DEBUG =====
const handlePilihSroForIndex = (index, kode, uraian) => {
  console.log("🔍 Mencoba memilih:", { index, kode, uraian });
  console.log("📋 Rincian saat ini:", proposalForm.rincian);
  
  const rincian = [...proposalForm.rincian];
  
  if (index >= 0 && index < rincian.length) {
    rincian[index] = {
      ...rincian[index],
      kodeRekening: kode,
      uraian: uraian
    };
    
    setProposalForm({
      ...proposalForm,
      rincian: rincian
    });
    
    addNotification(`✅ Kode ${kode} diterapkan`, "success");
    return true;
  } else {
    console.error("❌ Index tidak valid:", index, "Panjang rincian:", rincian.length);
    addNotification("❌ Gagal: Index tidak valid", "error");
    return false;
  }
};
// ===== AKHIR FUNGSI =====
  const downloadTemplateSro = () => {
    const content = "KODE REKENING;URAIAN SUB RINCIAN OBJEK\n5.1.02.01.00001;Belanja Alat Tulis Kantor\n5.1.02.01.00002;Belanja Kertas dan Cover\n5.2.02.01.00001;Belanja Makanan dan Minuman Rapat";
    const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_bank_sro.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("Template SRO berhasil diunduh", "success");
  };

  const handleImportSro=(e)=>{const file=e.target.files[0];if(!file)return;if(!file.name.toLowerCase().endsWith('.csv')){addNotification("Hanya file CSV yang didukung","error");e.target.value=null;return;}
setImportProgress({show:true,current:0,total:0,status:'Membaca file...',successCount:0,errorCount:0,errors:[]});
const reader=new FileReader();
reader.onload=async(ev)=>{const text=ev.target.result.replace(/^\uFEFF/,'');const lines=text.split('\n').map(l=>l.trim()).filter(l=>l&&!l.toLowerCase().startsWith('kode'));const total=lines.length;
setImportProgress(p=>({...p,total,status:`Memproses ${total} baris...`}));
const data=[],errors=[];const BATCH=250,DELAY=800,MAX=50;
for(let i=0;i<lines.length;i++){const parts=lines[i].includes(';')?lines[i].split(';'):lines[i].split(',');if(parts.length>=2){let k=parts[0].trim().replace(/^"|"$/g,''),u=parts[1].trim().replace(/^"|"$/g,'');if(!k||!u){errors.push(`Baris ${i+1}: kosong`);continue;}
k=k.replace(/[^\d.]/g,'');if(u.length>500)u=u.substring(0,500)+'...';data.push({kode:k,uraian:u,createdAt:new Date().toISOString(),createdBy:currentUserProfile?.nama||'System'});}else errors.push(`Baris ${i+1}: format`);}
if(!data.length){setImportProgress(p=>({...p,show:false}));addNotification(`Data kosong. ${errors.length} error`,"error");e.target.value=null;return;}
const batches=Math.ceil(data.length/BATCH);let success=0,failed=0;
for(let b=0;b<batches;b++){const start=b*BATCH,end=Math.min(start+BATCH,data.length),batchData=data.slice(start,end);
try{const batch=writeBatch(db);batchData.forEach(item=>{batch.set(doc(collection(db,'artifacts',appId,'public','data','bank_sro')),item);});await batch.commit();success+=batchData.length;
setImportProgress(p=>({...p,current:success,successCount:success,status:`Batch ${b+1}/${batches} (${Math.round((b+1)/batches*100)}%)`}));
if(b<batches-1)await new Promise(r=>setTimeout(r,DELAY));}catch(err){failed++;errors.push(`Batch ${b+1}: ${err.message}`);
if(batchData.length>50){for(let s=0;s<batchData.length;s+=50){const sub=batchData.slice(s,Math.min(s+50,batchData.length));try{const sb=writeBatch(db);sub.forEach(item=>{sb.set(doc(collection(db,'artifacts',appId,'public','data','bank_sro')),item);});await sb.commit();success+=sub.length;await new Promise(r=>setTimeout(r,300));}catch(e){errors.push(`Data ${start+s+1}-${start+Math.min(s+50,batchData.length)} gagal`);}}}
if(errors.length>MAX)break;}}
setImportProgress(p=>({...p,show:false}));addNotification(`Import: ${success}/${data.length} berhasil. ${errors.length} error`, success>0?'success':'error');

if (success > 0) {
  await addActivityLog({
    action: 'IMPORT',
    category: 'bank_sro',
    description: `${currentUserProfile?.nama || 'System'} mengimport ${success} data SRO dari file`,
    newData: { count: success, fileName: file.name }
  });
}console.error(errors);e.target.value=null;};
reader.onerror=()=>{setImportProgress(p=>({...p,show:false}));addNotification("Gagal baca file","error");e.target.value=null;};
reader.readAsText(file,'UTF-8');};
  // ===== AKHIR HANDLER BANK SRO =====

   // ===== FUNGSI LOGGER UNTUK MENCATAT AKTIVITAS =====
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
    
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'activity_logs'), logData);
    console.log("📝 Log added:", logData); // DEBUG
  } catch (err) {
    console.error("Gagal mencatat log:", err);
  }
};
// ===== AKHIR FUNGSI LOGGER ===== 

// ===== HANDLER UPLOAD FILE KE STORAGE DENGAN PROGRESS =====
const handleFileUploadToStorage = async (file, proposalId = null) => {
  if (!user) {
    addNotification("Anda harus login", "error");
    return null;
  }

  // Jika di Canvas, simulasi upload sukses
  if (IS_CANVAS) {
    console.log("📌 Mode Canvas: Simulasi upload", file.name);
    addNotification("Mode Demo: File tidak benar-benar diupload", "info");
    
    // Return data dummy
    return {
      url: "#",
      path: "demo/path",
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      fullPath: "demo/fullpath"
    };
  }

  // ===== VALIDASI UKURAN FILE =====
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  let fileToUpload = file;
  
  // Jika file terlalu besar, coba kompres (khusus gambar)
  if (file.size > MAX_SIZE) {
    addNotification(`File terlalu besar (${(file.size/1024/1024).toFixed(2)}MB). Mencoba kompres...`, "info");
    
    if (file.type.startsWith('image/')) {
      // Kompres gambar
      fileToUpload = await compressImage(file, 2);
      if (fileToUpload.size > MAX_SIZE) {
        addNotification(`File masih terlalu besar (${(fileToUpload.size/1024/1024).toFixed(2)}MB) setelah kompres. Maksimal 2MB.`, "error");
        return null;
      }
    } else {
      // File bukan gambar (PDF dll), tidak bisa dikompres
      addNotification(`File ${file.type} maksimal 2MB. Upload dibatalkan.`, "error");
      return null;
    }
  }
  
  // ===== CEK KONEKSI (TAPI JANGAN BLOKIR) =====
  try {
    await checkFirebaseConnection();
  } catch (connError) {
    console.warn("Koneksi lambat, tetap coba upload:", connError);
  }
  
  setUploadingFile(true);
  setUploadProgress(0);
  setUploadError(null);
  
  addNotification("Mengupload file...", "info");

  try {
    // Buat nama file unik dengan timestamp
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${timestamp}_${randomString}_${safeFileName}`;
    
    // Tentukan path: proposals/[tahun]/[bulan]/[id_proposal]/
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const filePath = `proposals/${year}/${month}/${proposalId || 'draft'}/${fileName}`;
    
    // Buat reference di Storage
    const storageRef = ref(storage, filePath);
    
    // Upload dengan progress tracking
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);
    
    // Return promise
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          
          // Handle specific error codes
          if (error.code === 'storage/unauthorized') {
            setUploadError("Tidak punya izin upload. Periksa rules Storage.");
          } else if (error.code === 'storage/canceled') {
            setUploadError("Upload dibatalkan");
          } else if (error.message.includes('network')) {
            setUploadError("Koneksi internet terputus. Coba lagi.");
          } else {
            setUploadError(error.message);
          }
          
          setUploadingFile(false);
          addNotification(`Gagal upload: ${setUploadError}`, "error");
          reject(error);
        },
        async () => {
          // Upload selesai
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          setUploadingFile(false);
          setUploadProgress(100);
          addNotification("File berhasil diupload!", "success");
          
          setTimeout(() => setUploadProgress(0), 2000);
          
          const result = {
            url: downloadUrl,
            path: filePath,
            name: file.name,
            size: fileToUpload.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            fullPath: uploadTask.snapshot.ref.fullPath
          };
          
          resolve(result);
        }
      );
    });
  } catch (error) {
    console.error("Upload error:", error);
    setUploadError(error.message);
    setUploadingFile(false);
    addNotification(`Gagal upload: ${error.message}`, "error");
    return null;
  }
};
// ===== AKHIR HANDLER UPLOAD =====

// ===== FUNGSI CEK STORAGE (VERSI DATA ASLI) =====
const checkStorageUsage = async () => {
  if (!user) return;
  
  setLoadingStorage(true);
  
  try {
    // Cek koneksi terlebih dahulu dengan toleransi yang lebih baik
    let isConnected = false;
    try {
      isConnected = await checkFirebaseConnection();
    } catch (connError) {
      console.warn("Error saat cek koneksi:", connError);
    }
    
    if (!isConnected) {
      // Jangan throw error, coba tetap lanjut dengan timeout yang lebih panjang
      addNotification("Koneksi lambat, mencoba memuat data...", "warning");
    }
    
    // Buat promise dengan timeout yang lebih panjang
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Storage request timeout")), 30000); // 30 detik timeout
    });
    
    const storagePromise = (async () => {
      // Pastikan folder proposals ada
      try {
        await ensureProposalsFolder();
      } catch (e) {
        console.warn("Gagal memastikan folder proposals:", e);
      }
      
      const storageRef = ref(storage, 'proposals');
      const result = await listAll(storageRef);
      
      let totalSize = 0;
      let fileCount = 0;
      let folders = {};
      
      const processFolder = async (folderRef) => {
        const list = await listAll(folderRef);
        
        for (const item of list.items) {
          try {
            const metadata = await getMetadata(item);
            totalSize += metadata.size;
            fileCount++;
            
            const pathParts = item.fullPath.split('/');
            if (pathParts.length >= 3) {
              const year = pathParts[1];
              const month = pathParts[2];
              
              if (!folders[year]) folders[year] = {};
              if (!folders[year][month]) folders[year][month] = 0;
              folders[year][month] += metadata.size;
            }
          } catch (itemError) {
            console.warn("Gagal baca metadata file:", item.fullPath, itemError);
          }
        }
        
        for (const subFolder of list.prefixes) {
          await processFolder(subFolder);
        }
      };
      
      await processFolder(storageRef);
      
      const totalMB = totalSize / (1024 * 1024);
      const totalGB = totalSize / (1024 * 1024 * 1024);
      
      let used = '';
      if (totalGB >= 1) {
        used = `${totalGB.toFixed(2)} GB`;
      } else {
        used = `${totalMB.toFixed(2)} MB`;
      }
      
      // Hitung persentase dari kuota (misal 5GB)
      const maxStorage = 5 * 1024 * 1024 * 1024; // 5GB dalam bytes
      const percentage = (totalSize / maxStorage) * 100;
      
      return {
        used,
        total: '5 GB',
        percentage: Math.min(percentage, 100),
        files: fileCount,
        folders
      };
    })();
    
    // Race antara storage promise dan timeout
    const result = await Promise.race([storagePromise, timeoutPromise]).catch(error => {
      console.warn("Storage promise error:", error);
      return null;
    });
    
    if (result) {
      setStorageStats(result);
      addNotification("Data storage berhasil dimuat", "success");
    } else {
      setStorageStats({
        used: '0 MB',
        total: '5 GB',
        percentage: 0,
        files: 0,
        folders: {}
      });
      addNotification("Gagal memuat data storage", "warning");
    }
    
  } catch (error) {
    console.error("Error checking storage:", error);
    
    // Beri notifikasi yang user-friendly
    if (error.message === "Storage request timeout") {
      addNotification("Storage timeout - mungkin koneksi lambat", "warning");
    } else if (error.code === 'storage/retry-limit-exceeded' || error.message.includes('retry-limit')) {
      addNotification("Koneksi ke storage terputus, coba lagi nanti", "warning");
    } else if (error.message.includes("Tidak dapat terhubung")) {
      addNotification(error.message, "error");
    } else {
      addNotification(`Gagal membaca storage: ${error.message}`, "error");
    }
    
    // Set data kosong sebagai fallback
    setStorageStats({
      used: '0 MB',
      total: '5 GB',
      percentage: 0,
      files: 0,
      folders: {}
    });
    
  } finally {
    setLoadingStorage(false);
  }
};
// ===== AKHIR FUNGSI CEK STORAGE =====

// ===== FUNGSI CEK KONEKSI FIREBASE =====
const checkFirebaseConnection = async () => {
  try {
    // Coba list dulu tanpa upload file test
    const testRef = ref(storage, 'proposals');
    
    // Coba list file di folder proposals
    const result = await listAll(testRef).catch(error => {
      console.warn("List all error:", error);
      return null;
    });
    
    if (IS_CANVAS) {
    console.log("📌 Mode Canvas: Bypass storage check");
    return true;
  }
    
    // Jika list gagal, coba metode alternatif
    console.warn("ListAll gagal, coba buat folder test...");
    return true; // Anggap sukses dulu, biarkan upload yang menentukan
    
  } catch (error) {
    console.error("❌ Firebase connection failed:", error);
    // Jangan blokir upload, tetap return true agar proses lanjut
    return true;
  }
};
// ===== AKHIR FUNGSI CEK KONEKSI =====

// ===== FUNGSI KOMPRES GAMBAR OTOMATIS =====
const compressImage = async (file, maxSizeMB = 2) => {
  return new Promise((resolve, reject) => {
    // Jika bukan gambar atau ukuran sudah kecil, return file asli
    if (!file.type.startsWith('image/') || file.size <= maxSizeMB * 1024 * 1024) {
      resolve(file);
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Hitung skala kompresi
        const maxDimension = 1200;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Konversi ke blob dengan kualitas 0.7 (70%)
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          console.log(`📦 Kompresi: ${(file.size/1024/1024).toFixed(2)}MB → ${(compressedFile.size/1024/1024).toFixed(2)}MB`);
          resolve(compressedFile);
        }, file.type, 0.7);
      };
    };
    reader.onerror = reject;
  });
};
// ===== AKHIR FUNGSI KOMPRES =====

// ===== FUNGSI BACKUP SEMUA FILE =====
const backupAllFiles = async () => {
  if (!user) return;
  
  // ===== CEK KONEKSI FIREBASE =====
  const isConnected = await checkFirebaseConnection();
  if (!isConnected) {
    addNotification("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.", "error");
    return;
  }
  // ===== AKHIR CEK KONEKSI =====
  
  if (!window.confirm('Proses backup akan mendownload semua file. Lanjutkan?')) return;
  
  setBackupLoading(true);
  addNotification("Menyiapkan file backup...", "info");
  
  try {
    // List semua file
    const storageRef = ref(storage, 'proposals');
    const allFiles = [];
    
    const collectFiles = async (folderRef) => {
      const list = await listAll(folderRef);
      
      for (const item of list.items) {
        const url = await getDownloadURL(item);
        const metadata = await getMetadata(item);
        allFiles.push({
          name: item.name,
          path: item.fullPath,
          url,
          size: metadata.size,
          time: metadata.timeCreated
        });
      }
      
      for (const subFolder of list.prefixes) {
        await collectFiles(subFolder);
      }
    };
    
    await collectFiles(storageRef);
    
    // Buat file JSON daftar file
    const fileList = {
      generatedAt: new Date().toISOString(),
      totalFiles: allFiles.length,
      totalSize: allFiles.reduce((sum, f) => sum + f.size, 0),
      files: allFiles
    };
    
    const blob = new Blob([JSON.stringify(fileList, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-filelist-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    
    addNotification(`Daftar ${allFiles.length} file siap.`, "success");
    
  } catch (error) {
    console.error("Backup error:", error);
    addNotification(`Gagal backup: ${error.message}`, "error");
  } finally {
    setBackupLoading(false);
  }
};
// ===== AKHIR FUNGSI BACKUP =====

// ===== FUNGSI PREVIEW FILE BACKUP =====
const handleRestoreFileSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  if (!file.name.endsWith('.json')) {
    addNotification("Hanya file JSON yang diperbolehkan", "error");
    e.target.value = null;
    return;
  }
  
  setRestoreFile(file);
  
  // Baca file untuk preview
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const backupData = JSON.parse(ev.target.result);
      if (!backupData.files || !Array.isArray(backupData.files)) {
        addNotification("Format file backup tidak valid", "error");
        setRestoreFile(null);
        return;
      }
      
      // Tampilkan modal preview
      setShowRestoreModal(true);
      
      // Simpan data backup di sessionStorage untuk digunakan nanti
      sessionStorage.setItem('restoreBackupData', ev.target.result);
      
      addNotification(`File backup berisi ${backupData.files.length} file`, "success");
    } catch (error) {
      console.error("Error parsing backup file:", error);
      addNotification("Gagal membaca file backup", "error");
      setRestoreFile(null);
    }
  };
  reader.readAsText(file);
  
  e.target.value = null;
};

// ===== FUNGSI PROSES RESTORE =====
const processRestore = async () => {
  if (!user || !restoreFile) return;
  
  const confirmMessage = "Proses restore akan mengupload ulang semua file ke storage. File dengan nama yang sama akan ditimpa. Lanjutkan?";
  if (!window.confirm(confirmMessage)) return;
  
  setRestoreLoading(true);
  setRestoreProgress(0);
  
  try {
    // Baca file backup
    const backupDataStr = sessionStorage.getItem('restoreBackupData');
    if (!backupDataStr) {
      addNotification("Data backup tidak ditemukan", "error");
      return;
    }
    
    const backupData = JSON.parse(backupDataStr);
    const files = backupData.files;
    const totalFiles = files.length;
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    addNotification(`Memulai restore ${totalFiles} file...`, "info");
    
    // Proses per batch (10 file per batch agar tidak overload)
    const BATCH_SIZE = 10;
    const DELAY_MS = 1000; // Delay 1 detik antar batch
    
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const batchPromises = [];
      
      for (const fileInfo of batch) {
        // Cek apakah file sudah ada di storage
        try {
          const fileRef = ref(storage, fileInfo.path);
          
          // Coba download dulu untuk cek keberadaan
          try {
            await getDownloadURL(fileRef);
            // File sudah ada, tanya user
            if (window.confirm(`File ${fileInfo.name} sudah ada. Timpa?`)) {
              // Lanjutkan upload (akan ditimpa)
            } else {
              skippedCount++;
              continue;
            }
          } catch (notFound) {
            // File belum ada, lanjutkan
          }
          
          // Download file dari URL backup (asumsi URL masih valid)
          const response = await fetch(fileInfo.url);
          const blob = await response.blob();
          
          // Upload ke storage
          const uploadPromise = uploadBytes(fileRef, blob);
          batchPromises.push(uploadPromise);
          
        } catch (fileError) {
          console.error("Error processing file:", fileInfo.name, fileError);
          errorCount++;
        }
      }
      
      // Jalankan batch
      await Promise.all(batchPromises);
      successCount += batchPromises.length;
      
      // Update progress
      const progress = Math.min(((i + BATCH_SIZE) / totalFiles) * 100, 100);
      setRestoreProgress(progress);
      
      addNotification(`Progress: ${Math.round(progress)}% (${successCount}/${totalFiles})`, "info");
      
      // Delay antar batch
      if (i + BATCH_SIZE < files.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    }
    
    addNotification(`Restore selesai: ${successCount} sukses, ${errorCount} gagal, ${skippedCount} dilewati`, "success");
    
    // Refresh data storage
    await checkStorageUsage();
    
  } catch (error) {
    console.error("Restore error:", error);
    addNotification(`Gagal restore: ${error.message}`, "error");
  } finally {
    setRestoreLoading(false);
    setRestoreProgress(0);
    setShowRestoreModal(false);
    setRestoreFile(null);
    sessionStorage.removeItem('restoreBackupData');
  }
};
// ===== AKHIR FUNGSI RESTORE =====

// ===== FUNGSI UNTUK MEMASTIKAN FOLDER PROPOSALS ADA =====
const ensureProposalsFolder = async () => {
  try {
    // Coba buat file .keep di folder proposals
    const proposalsRef = ref(storage, 'proposals/.keep');
    const blob = new Blob([''], { type: 'text/plain' });
    await uploadBytes(proposalsRef, blob);
    
    // Langsung hapus file .keep-nya
    try {
      await deleteObject(proposalsRef);
    } catch (cleanError) {
      console.warn("Gagal hapus file .keep:", cleanError);
    }
    
    console.log("✅ Folder proposals dipastikan ada");
    return true;
  } catch (error) {
    console.warn("Gagal membuat folder proposals:", error);
    return false;
  }
};
// ===== AKHIR FUNGSI =====

// ===== FUNGSI CLEANUP ORPHAN FILES (placeholder) =====
const cleanupOrphanFiles = () => {
  addNotification("Fitur dalam pengembangan", "info");
};
// ===== AKHIR FUNGSI CLEANUP =====

  const executeDelete = async () => {
    const currentId = deleteConfirm.id;
    const currentType = deleteConfirm.type;
    
    if (!currentId) {
       addNotification("ID tidak valid untuk dihapus", "error");
       return;
    }
    setIsProcessing(true);
    try {
      if (currentType === 'Usulan') {
  await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', String(currentId)));
  addNotification(`Usulan berhasil dihapus`, 'success');
  await addActivityLog({
    action: 'DELETE',
    category: 'proposal',
    description: `${currentUserProfile.nama} menghapus usulan: ${deleteConfirm.name}`,
    dataId: currentId
  });
} else if (currentType === 'Catatan') {
  await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'bank_catatan', String(currentId)));
  addNotification(`Catatan berhasil dihapus`, 'success');
  await addActivityLog({
    action: 'DELETE',
    category: 'bank_catatan',
    description: `${currentUserProfile.nama} menghapus catatan: ${deleteConfirm.name}`,
    dataId: currentId
  });
} else if (currentType === 'TahunAnggaran') {
  await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tahun_anggaran', String(currentId)));
  addNotification(`Tahun anggaran berhasil dihapus`, 'success');
  await addActivityLog({
    action: 'DELETE',
    category: 'master',
    description: `${currentUserProfile.nama} menghapus tahun anggaran: ${deleteConfirm.name}`,
    dataId: currentId
  });
} else if (currentType === 'SRO') {
  await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'bank_sro', String(currentId)));
  addNotification(`Data SRO berhasil dihapus`, 'success');
  await addActivityLog({
    action: 'DELETE',
    category: 'bank_sro',
    description: `${currentUserProfile.nama} menghapus data SRO: ${deleteConfirm.name}`,
    dataId: currentId
  });
}
      // ===== TAMBAHKAN UNTUK HAPUS SEMUA SRO =====
else if (currentType === 'AllSRO') {
  await handleHapusSemuaSro();
  setDeleteConfirm({ show: false, id: null, name: '', type: 'SKPD' });
  return; // Penting: return karena sudah handle sendiri
}
// ===== AKHIR PENAMBAHAN =====
      // ===== AKHIR PENAMBAHAN =====
      else {
         const colMap = { 'SKPD': 'skpds', 'User': 'users', 'Sub Kegiatan': 'sub_kegiatans', 'Tahapan': 'tahapan', 'TAPD': 'tapd' };
         const colName = colMap[currentType];
         if (colName) {
            await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', colName, String(currentId)));
            addNotification(`${currentType} berhasil dihapus`, 'success');
         }
      }
      setDeleteConfirm({ show: false, id: null, name: '', type: 'SKPD' });
    } catch (err) { 
      console.error(err);
      addNotification(`Gagal menghapus data: ${err.message}`, "error"); 
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = (type) => {
    const content = type === 'skpd' ? "Nama SKPD\nDinas Kesehatan Kota Medan\nDinas Pendidikan\nBKAD Medan" : "Nama Sub Kegiatan\nPenatausahaan Keuangan\nPengadaan Alat Tulis";
    const uri = "data:text/csv;charset=utf-8," + encodeURIComponent(content);
    const link = document.createElement("a");
    link.href = uri; link.download = `template_${type}.csv`; link.click();
  };

  const handleFileUpload = async (e, type) => {
  const file = e.target.files[0];
  if (!file) return;
  
  setIsProcessing(true);
  
  const reader = new FileReader();
  reader.onload = async (ev) => {
    const text = ev.target.result.replace(/^\uFEFF/, '');
    const lines = text.split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.toLowerCase().startsWith('nama'));
    
    const colName = type === 'skpd' ? 'skpds' : 'sub_kegiatans';
    const col = collection(db, 'artifacts', appId, 'public', 'data', colName);
    
    // Ambil data existing untuk cek duplikasi
    const snapshot = await getDocs(col);
    const existingNames = new Set(
      snapshot.docs.map(doc => doc.data().nama?.toLowerCase().trim())
    );
    
    let successCount = 0;
    let duplicateCount = 0;
    
    for (const line of lines) {
      // Pisahkan berdasarkan titik koma atau koma
      const parts = line.includes(';') ? line.split(';') : line.split(',');
      if (parts.length >= 2) {
        const nama = parts[0].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        
        // CEK DUPLIKASI
        if (!existingNames.has(nama.toLowerCase())) {
          await addDoc(col, { 
            nama, 
            createdAt: new Date().toISOString() 
          });
          successCount++;
          existingNames.add(nama.toLowerCase()); // Tambahkan ke Set agar tidak duplikasi dalam 1 file
        } else {
          duplicateCount++;
        }
      }
    }
    
    addNotification(
      `Import ${type}: ${successCount} baru, ${duplicateCount} duplikat (dilewati)`, 
      successCount > 0 ? 'success' : 'info'
    );
    setIsProcessing(false);
  };
  
  reader.onerror = () => {
    addNotification("Gagal membaca file", "error");
    setIsProcessing(false);
  };
  
  reader.readAsText(file, 'UTF-8');
  e.target.value = null;
};

  const handleSaveProposal = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsProcessing(true);

    const totalPaguSebelum = (proposalForm.rincian || []).reduce((sum, item) => sum + Number(item.paguSebelum || 0), 0);
    const totalPaguSesudah = (proposalForm.rincian || []).reduce((sum, item) => sum + Number(item.paguSesudah || 0), 0);
    const totalSelisih = totalPaguSesudah - totalPaguSebelum;

    const isSkpdRole = currentUserProfile.level === 'SKPD';
    const finalSkpdId = isSkpdRole ? currentUserProfile.skpdId : proposalForm.skpdId;
    const finalSkpdName = isSkpdRole ? currentUserProfile.nama : (skpdList.find(s => s.id === proposalForm.skpdId)?.nama || proposalForm.skpd);

    const historyEntry = {
      action: isEditing ? 'Usulan Diperbarui' : 'Usulan Dibuat',
      by: String(currentUserProfile.nama),
      date: new Date().toISOString()
    };

    const { id, history, comments, ...cleanForm } = proposalForm;

    const dataToSave = {
      ...cleanForm,
      skpd: String(finalSkpdName),
      skpdId: String(finalSkpdId),
      paguSebelum: totalPaguSebelum,
      paguSesudah: totalPaguSesudah,
      selisih: totalSelisih,
      updatedAt: new Date().toISOString(),
      updatedBy: String(currentUserProfile.nama)
    };

    if (isSkpdRole && isEditing && selectedProposal) {
        dataToSave.tahap = selectedProposal.tahap;
    }

    try {
      if (isEditing && proposalForm.id) {
  await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', String(proposalForm.id)), updatedData);
  addNotification("Usulan berhasil diperbarui", "success");
  await addActivityLog({
    action: 'UPDATE',
    category: 'proposal',
    description: `${currentUserProfile.nama} memperbarui usulan: ${proposalForm.nomorSurat}`,
    dataId: proposalForm.id,
    oldData: existingData,
    newData: updatedData
  });
} else {
  const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'proposals'), dataToSave);
  addNotification("Usulan berhasil dikirim", "success");
  await addActivityLog({
    action: 'CREATE',
    category: 'proposal',
    description: `${currentUserProfile.nama} membuat usulan baru: ${dataToSave.nomorSurat}`,
    dataId: docRef.id,
    newData: dataToSave
  });
}
      setView('list'); setIsEditing(false); resetForm();
    } catch (err) { 
      console.error(err);
      addNotification(`Izin ditolak: ${err.message}`, "error"); 
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => setProposalForm({ id: null, skpd: '', skpdId: '', tahap: 'Belum Ditentukan', nomorSurat: '', tanggalSurat: new Date().toISOString().split('T')[0], perihal: '', subKegiatan: '', paguSebelum: 0, paguSesudah: 0, alasan: '', hasilVerifikasi: '', lampiranUrl: '', history: [], comments: [], rincian: [{ id: Date.now(), kodeRekening: '', uraian: '', paguSebelum: 0, paguSesudah: 0 }] });

  const handleFinalize = async (status) => {
    if (!selectedProposal || !selectedProposal.id) {
      addNotification("Data usulan tidak valid", "error");
      return;
    }
    
    const latestProposal = proposals.find(p => p.id === selectedProposal.id);
    if (!latestProposal) {
      addNotification("Data usulan tidak ditemukan di database", "error");
      return;
    }

    setIsProcessing(true);
    
    const historyEntry = {
      action: `Status diubah: ${status}`,
      by: String(currentUserProfile?.nama || "Sistem"),
      date: new Date().toISOString()
    };
    
    const newHistory = [...(latestProposal.history || []), historyEntry];

    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'proposals', String(latestProposal.id));
      await updateDoc(docRef, { 
  status: status, 
  finalizedAt: new Date().toISOString(), 
  finalizedBy: String(currentUserProfile?.nama || "Sistem"),
  history: newHistory
});

let actionText = status;
if (status === 'Diverifikasi') actionText = 'Diverifikasi';
if (status === 'Disetujui') actionText = 'Disetujui';
if (status.includes('Ditolak')) actionText = 'Ditolak';

addNotification(`✓ Berkas ${actionText}`, 'success');

await addActivityLog({
  action: 'UPDATE_STATUS',
  category: 'proposal',
  description: `${currentUserProfile?.nama || 'Sistem'} mengubah status usulan ${latestProposal.nomorSurat} menjadi ${status}`,
  dataId: latestProposal.id,
  oldData: { status: latestProposal.status },
  newData: { status }
});
    } catch (err) { 
      console.error("Kesalahan Finalisasi:", err);
      addNotification(`✗ Gagal: ${err.message}`, "error"); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkFinalize = async (status) => {
    if (selectedForBulk.length === 0) return;
    setIsProcessing(true);
    
    try {
      await Promise.all(selectedForBulk.map(async (id) => {
        const proposal = proposals.find(p => p.id === id);
        const oldHistory = proposal ? (proposal.history || []) : [];
        
        const historyEntry = {
          action: `Status diubah massal: ${status}`,
          by: String(currentUserProfile?.nama || "Sistem"),
          date: new Date().toISOString()
        };

        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', String(id)), { 
          status: status, 
          finalizedAt: new Date().toISOString(), 
          finalizedBy: String(currentUserProfile?.nama || "Sistem"),
          history: [...oldHistory, historyEntry]
        });
      }));

      addNotification(`✓ ${selectedForBulk.length} berkas sukses diproses`, 'success');
      setSelectedForBulk([]); 
    } catch (err) {
      console.error(err);
      addNotification("Gagal memproses persetujuan massal", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddComment = async (e) => {
  e.preventDefault();
  if (!commentText.trim() || !selectedProposal) return;
  
  const newComment = {
    text: commentText.trim(),
    sender: String(currentUserProfile.nama),
    role: String(currentUserProfile.level),
    timestamp: new Date().toISOString()
  };

  const updatedComments = [...(selectedProposal.comments || []), newComment];
  
  try {
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', String(selectedProposal.id)), { 
      comments: updatedComments 
    });
    setCommentText('');
    addNotification("Pesan terkirim", "success");
  } catch (err) {
    console.error(err);
    addNotification("Gagal mengirim pesan", "error");
  }
};

  const filteredProposals = useMemo(() => {
    return proposals.filter(p => {
      const searchMatch = (String(p.skpd || "")).toLowerCase().includes(searchTerm.toLowerCase()) || (String(p.nomorSurat || "")).toLowerCase().includes(searchTerm.toLowerCase());
      
      let statusMatch = statusFilter === 'Semua' || p.status === statusFilter;
      if (statusFilter === 'Ditolak' && String(p.status).includes('Ditolak')) {
          statusMatch = true;
      }

      const yearMatch = selectedYear === 'Semua' || (p.tanggalSurat && p.tanggalSurat.startsWith(selectedYear)) || (!p.tanggalSurat && p.createdAt && p.createdAt.startsWith(selectedYear));
      const tahapMatch = selectedTahap === 'Semua' || p.tahap === selectedTahap;
      
      let authMatch = false;
      if (currentUserProfile.level === 'Admin' || currentUserProfile.level === 'TAPD') authMatch = true;
      if (currentUserProfile.level === 'SKPD') authMatch = p.skpdId === currentUserProfile.skpdId;
      if (currentUserProfile.level === 'Operator BKAD') authMatch = currentUserProfile.assignedSkpds?.includes(p.skpdId) || true; 
      
      return searchMatch && statusMatch && yearMatch && tahapMatch && authMatch;
    });
  }, [proposals, currentUserProfile, searchTerm, statusFilter, selectedYear, selectedTahap]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProposals.slice(start, start + itemsPerPage);
  }, [filteredProposals, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);

  const handleExportCSV = () => {
    const headers = ["Tahap", "Tanggal Surat", "No. Surat", "SKPD", "Sub Kegiatan", "Kode Rekening", "Sub Rincian Objek", "Pagu Semula", "Pagu Sesudah", "Pagu Akhir (Selisih)", "Status", "Catatan Admin"];
    const rows = [];
    
    filteredProposals.forEach(p => {
      const rincianList = p.rincian && p.rincian.length > 0 ? p.rincian : [{ kodeRekening: '-', uraian: String(p.subKegiatan || ''), paguSebelum: p.paguSebelum, paguSesudah: p.paguSesudah }];
      
      const catatanAdmin = p.hasilVerifikasi || '';
      
      rincianList.forEach((r, index) => {
          const catatanUntukBarisIni = catatanAdmin; 
          
          rows.push([
            `"${String(p.tahap || 'Belum Ditentukan')}"`,
            `"${String(p.tanggalSurat || '')}"`,
            `"${String(p.nomorSurat || '')}"`,
            `"${String(p.skpd || '')}"`,
            `"${String(p.subKegiatan || '')}"`,
            `"${String(r.kodeRekening || '')}"`,
            `"${String(r.uraian || '')}"`,
            r.paguSebelum,
            r.paguSesudah,
            Number(r.paguSesudah || 0) - Number(r.paguSebelum || 0),
            `"${String(p.status || '')}"`,
            `"${String(catatanUntukBarisIni).replace(/"/g, '""')}"` 
          ]);
      });
    });

    const csvContent = "\uFEFF" + headers.join(";") + "\n" + rows.map(r => r.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `rekap_usulan_${selectedYear}_${selectedTahap.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("Data Excel Berhasil Diekspor dengan Catatan Admin", "success");
  };

  const handleEditClick = (p) => {
    const rincian = p.rincian && p.rincian.length > 0 ? p.rincian : [{ id: Date.now(), kodeRekening: '-', uraian: String(p.subKegiatan || ''), paguSebelum: p.paguSebelum || 0, paguSesudah: p.paguSesudah || 0 }];
    setSelectedProposal(p); 
    setProposalForm({ ...p, rincian });
    setIsEditing(true);
    setView('add-proposal');
  };

  const chartData = useMemo(() => {
    const total = filteredProposals.length;
    const pending = filteredProposals.filter(p => p.status === 'Pending').length;
    const diverifikasi = filteredProposals.filter(p => p.status === 'Diverifikasi').length;
    const inProcess = pending + diverifikasi;
    const approved = filteredProposals.filter(p => p.status === 'Disetujui').length;
    const rejected = filteredProposals.filter(p => String(p.status).includes('Ditolak')).length;

    const skpdCounts = {};
    filteredProposals.forEach(p => {
      skpdCounts[p.skpd] = (skpdCounts[p.skpd] || 0) + 1;
    });
    const topSkpds = Object.entries(skpdCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);
    const maxSkpdCount = topSkpds.length > 0 ? topSkpds[0][1] : 1;

    return { total, pending: inProcess, approved, rejected, topSkpds, maxSkpdCount };
  }, [filteredProposals]);

  const formTotalSebelum = (proposalForm.rincian || []).reduce((sum, item) => sum + Number(item.paguSebelum || 0), 0);
  const formTotalSesudah = (proposalForm.rincian || []).reduce((sum, item) => sum + Number(item.paguSesudah || 0), 0);
  const formTotalSelisih = formTotalSesudah - formTotalSebelum;
  // ===== FILTER & PAGINATION UNTUK BANK SRO =====
  const filteredBankSro = useMemo(() => {
  return bankSro.filter(item => 
    (item.kode?.toLowerCase() || '').includes(filterBankSro.toLowerCase()) ||
    (item.uraian?.toLowerCase() || '').includes(filterBankSro.toLowerCase())
  );
}, [bankSro, filterBankSro]);

const paginatedBankSro = useMemo(() => {
  const start = (sroCurrentPage - 1) * sroItemsPerPage;
  return filteredBankSro.slice(start, start + sroItemsPerPage);
}, [filteredBankSro, sroCurrentPage, sroItemsPerPage]);

const totalSroPages = Math.ceil(filteredBankSro.length / sroItemsPerPage);

// Reset ke halaman 1 ketika filter berubah
useEffect(() => {
  setSroCurrentPage(1);
}, [filterBankSro]);
// ===== AKHIR FILTER & PAGINATION =====

  // --- RENDER LAYOUTS ---
  
  if (!authInitialized) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 ${isDarkMode ? 'dark' : ''}`}>
        <div className="text-center animate-pulse">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-xl shadow-blue-500/30">{branding.icon}</div>
           <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat {branding.name1}{branding.name2}...</p>
        </div>
      </div>
    );
  }

  // --- 4. RENDER LOGIN SCREEN ---
  if (!user) {
    return (
      <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
        
        {/* POP-UP ALERTS Khusus Login */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-2 w-full max-w-sm pointer-events-none">
          {notifications.map(n => (
            <div key={n.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl border animate-in slide-in-from-top-4 fade-in backdrop-blur-md w-full ${n.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-rose-600 text-white border-rose-500'}`}>
              {n.type === 'success' ? <CheckCircle size={20} className="flex-shrink-0" /> : <AlertTriangle size={20} className="flex-shrink-0" />}
              <p className="text-xs font-black tracking-tighter uppercase text-white leading-tight">{String(n.message || "")}</p>
              <button onClick={() => removeNotification(n.id)} className="ml-auto opacity-60 hover:opacity-100 text-white"><X size={16}/></button>
            </div>
          ))}
        </div>

        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700/50 p-8 animate-in zoom-in-95 relative overflow-hidden text-left">
          {/* Ornamen Desain */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/5 rounded-bl-full -z-10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-tr-full -z-10 blur-2xl"></div>

          <div className="text-center mb-10">
  {/* Logo dengan gambar atau icon */}
  {branding.logoUrl ? (
    <img 
      src={branding.logoUrl} 
      alt={`${branding.name1}${branding.name2} Logo`}
      className="w-24 h-24 mx-auto mb-6 object-contain"
    />
  ) : (
    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-4xl mx-auto mb-6 shadow-xl shadow-blue-500/30 transform -rotate-6 uppercase">
      {branding.icon}
    </div>
  )}
  
  <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight italic uppercase">
    {branding.name1}<span className="text-blue-600 dark:text-blue-400">{branding.name2}</span>
  </h1>
  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
    {isRegisterMode ? 'Pendaftaran Akun Baru' : branding.tagline}
  </p>
  <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1">
    {branding.subTagline}
  </p>
</div>

          <form onSubmit={handleAuthAction} className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Email Pengguna</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input required type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="nama@email.com" className="w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Kata Sandi {isRegisterMode && '(Min. 6 Karakter)'}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input required type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" minLength={isRegisterMode ? 6 : 1} className="w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" />
              </div>
            </div>

            <button type="submit" disabled={isLoggingIn} className={`w-full ${isRegisterMode ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'} text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2`}>
              {isLoggingIn ? 'Memproses...' : (isRegisterMode ? 'Daftar Sistem' : 'Masuk Sistem')} {isRegisterMode ? <CheckCircle size={16}/> : <ChevronRight size={16}/>}
            </button>
          </form>

          {/* ===== INFORMASI APLIKASI DENGAN MODAL ===== */}
<div className="mt-6 text-center">
  <button 
    type="button" 
    onClick={() => setShowInfoModal(true)} 
    className="text-[9px] font-medium text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors border-t border-slate-200 dark:border-slate-700 pt-4 w-full"
  >
    © 2026 Ataria Corp • {branding.name1}{branding.name2} v1.0 • Tentang Aplikasi
  </button>
</div>

{/* ===== MODAL INFORMASI APLIKASI ===== */}
{showInfoModal && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={() => setShowInfoModal(false)}>
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 border border-slate-100 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
      
      {/* Header Modal */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
            {branding.icon}
          </div>
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase">
            {branding.name1}<span className="text-blue-600 dark:text-blue-400">{branding.name2}</span>
          </h3>
        </div>
        <button onClick={() => setShowInfoModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X size={18} className="text-slate-500 dark:text-slate-400" />
        </button>
      </div>
      
      {/* Body Modal */}
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
            {branding.tagline}
          </p>
          <p className="text-[9px] text-blue-600 dark:text-blue-400 mt-1">
            {branding.subTagline}
          </p>
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
          <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-2">
            📋 Informasi Aplikasi
          </p>
          <table className="w-full text-[9px]">
  <tbody>
    <tr>
      <td className="py-1 text-slate-500 dark:text-slate-400 w-24">Versi</td>
      <td className="py-1 text-slate-700 dark:text-slate-300 font-medium">1.0.0 (Stable)</td>
    </tr>
    <tr>
      <td className="py-1 text-slate-500 dark:text-slate-400">Rilis</td>
      <td className="py-1 text-slate-700 dark:text-slate-300 font-medium">Februari 2026</td>
    </tr>
    <tr>
      <td className="py-1 text-slate-500 dark:text-slate-400">Developer</td>
      <td className="py-1 text-slate-700 dark:text-slate-300 font-medium">Ataria Corp</td>
    </tr>
    <tr>
      <td className="py-1 text-slate-500 dark:text-slate-400">Copyright</td>
      <td className="py-1 text-slate-700 dark:text-slate-300 font-medium">© 2026 Ataria Corp</td>
    </tr>
  </tbody>
</table>
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
          <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-2">
            📞 Kontak & Pemesanan
          </p>
          <div className="space-y-2">
            <a href="mailto:atariacorp@gmail.com" className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <Mail size={14} className="text-blue-500" />
              <span className="text-[9px] text-slate-600 dark:text-slate-400">atariacorp@gmail.com</span>
            </a>
            <a href="tel:+6281234567890" className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <Phone size={14} className="text-green-500" />
              <span className="text-[9px] text-slate-600 dark:text-slate-400">0812-3456-7890</span>
            </a>
            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <Globe size={14} className="text-purple-500" />
              <span className="text-[9px] text-slate-600 dark:text-slate-400">www.atariacorp.com</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 text-center">
          <p className="text-[8px] text-slate-400 dark:text-slate-500">
            Aplikasi Pendataan Pergeseran Anggaran untuk<br />
            Badan Keuangan dan Aset Daerah Kota Medan
          </p>
          <p className="text-[7px] text-slate-300 dark:text-slate-600 mt-2">
            Dikembangkan dengan React & Firebase oleh Ataria Corp
          </p>
        </div>
      </div>
      
      {/* Footer Modal */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowInfoModal(false)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}

          <button onClick={() => setIsDarkMode(!isDarkMode)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN APP (jika User berhasil login) ---
  return (
    <div className={`${isDarkMode ? 'dark' : ''} print:bg-white`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex print:block print:overflow-visible font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
        
        {/* 1. PRINT AREA */}
        {selectedProposal && (
          <div id="print-area" className="hidden print:block bg-white p-8 w-full text-slate-900 font-serif leading-relaxed">
            <div className="flex items-center gap-6 border-b-4 border-double border-slate-900 pb-4 mb-8 text-center">
              <div className="w-20 h-20 bg-slate-100 flex items-center justify-center font-bold text-3xl border uppercase">{branding.icon}</div>
              <div className="flex-grow">
                <h1 className="text-xl font-bold uppercase">{branding.subTagline}</h1>
                <h2 className="text-lg font-extrabold uppercase">{branding.tagline}</h2>
                <p className="text-[10px]">{branding.name1}{branding.name2}</p>
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="font-bold underline uppercase">Berita Acara Verifikasi Pergeseran</h3>
              <p className="text-xs uppercase font-bold mt-1">TAHAP: {String(selectedProposal.tahap || "Belum Ditentukan")}</p>
            </div>
            <div className="text-xs space-y-2 mb-6 text-left">
              <p><strong>SKPD:</strong> {String(selectedProposal.skpd || "")}</p>
              <p><strong>Nomor Surat:</strong> {String(selectedProposal.nomorSurat || "")}</p>
              <p><strong>Sub Kegiatan:</strong> {String(selectedProposal.subKegiatan || "")}</p>
            </div>
            <table className="w-full border border-slate-900 text-[10px] text-left">
              <thead><tr className="bg-slate-50"><th className="border p-2">Kode Rekening</th><th className="border p-2">Uraian Sub Rincian Objek</th><th className="border p-2 text-right">Pagu Semula</th><th className="border p-2 text-right">Sesudah</th><th className="border p-2 text-right">Selisih</th></tr></thead>
              <tbody>
                {(selectedProposal.rincian && selectedProposal.rincian.length > 0 ? selectedProposal.rincian : [{ kodeRekening: '-', uraian: String(selectedProposal.subKegiatan || ""), paguSebelum: selectedProposal.paguSebelum, paguSesudah: selectedProposal.paguSesudah }]).map((r, i) => (
                  <tr key={i}>
                    <td className="border p-2">{String(r.kodeRekening || "")}</td>
                    <td className="border p-2 font-bold">{String(r.uraian || "")}</td>
                    <td className="border p-2 text-right">{formatIDR(r.paguSebelum)}</td>
                    <td className="border p-2 text-right">{formatIDR(r.paguSesudah)}</td>
                    <td className="border p-2 text-right font-bold">{formatIDR(Number(r.paguSesudah||0)-Number(r.paguSebelum||0))}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-black">
                    <td colSpan="2" className="border p-2 text-right uppercase">Total Sub Kegiatan</td>
                    <td className="border p-2 text-right">{formatIDR(selectedProposal.paguSebelum)}</td>
                    <td className="border p-2 text-right">{formatIDR(selectedProposal.paguSesudah)}</td>
                    <td className="border p-2 text-right">{formatIDR(Number(selectedProposal.paguSesudah||0)-Number(selectedProposal.paguSebelum||0))}</td>
                </tr>
              </tbody>
            </table>
            <div className="p-4 border border-slate-900 bg-slate-50 mt-6 text-xs italic text-left">
              <p><strong>Catatan Verifikasi:</strong><br/>{String(selectedProposal.hasilVerifikasi || "Telah divalidasi sesuai regulasi.")}</p>
            </div>
            
            {/* Tanda Tangan Tim TAPD Dinamis */}
            <div className="mt-12">
              <p className="text-xs font-bold text-center mb-8">TIM ANGGARAN PEMERINTAH DAERAH (TAPD)</p>
              <div className="grid grid-cols-2 gap-y-12 gap-x-8 text-center text-[10px]">
                {tapdList.length > 0 ? (
                  tapdList.map((t, index) => (
                    <div key={t.id}>
                      <p className="font-bold">{String(t.jabatan || "")}</p>
                      <div className="h-16"></div>
                      <p className="font-bold underline uppercase">{String(t.nama || "")}</p>
                      <p>NIP. {String(t.nip || "")}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div><p>Disetujui Oleh,</p><div className="h-20"></div><p className="font-bold underline uppercase">{String(selectedProposal.finalizedBy || currentUserProfile.nama)}</p></div>
                    <div><p>Medan, {new Date().toLocaleDateString('id-ID')}</p><p>Kepala Bidang Terkait,</p><div className="h-20"></div><p className="font-bold underline uppercase">NAMA PEJABAT</p></div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. MODAL CONFIRMATION */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 print:hidden">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 mx-auto"><Trash2 size={24}/></div>
              <h3 className="text-lg font-bold text-center mb-2 dark:text-slate-100">Hapus {String(deleteConfirm.type || "Data")}?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 italic leading-relaxed">"{String(deleteConfirm.name || "")}" akan dihapus permanen dari sistem {branding.name1}{branding.name2}.</p>
              <div className="flex gap-3">
                <button disabled={isProcessing} onClick={() => setDeleteConfirm({show:false, id:null, name:'', type:'SKPD'})} className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-colors disabled:opacity-50">Batal</button>
                <button disabled={isProcessing} onClick={executeDelete} className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-600/20 transition-colors disabled:opacity-50">
                  {isProcessing ? 'MENGHAPUS...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. SIDEBAR */}
        {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm print:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
        <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 flex flex-col z-50 transition-transform lg:static lg:translate-x-0 border-r border-slate-800 dark:border-slate-800/50 print:hidden ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
  <div className="flex items-center gap-3">
    {/* Logo dengan gambar atau icon */}
    {branding.logoUrl ? (
      <img 
        src={branding.logoUrl} 
        alt={`${branding.name1}${branding.name2} Logo`}
        className="w-9 h-9 object-contain rounded-xl"
      />
    ) : (
      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30 uppercase">
        {branding.icon}
      </div>
    )}
    
    <span className="text-xl font-black tracking-tight text-white italic uppercase">
      {branding.name1}<span className="text-blue-500">{branding.name2}</span>
    </span>
  </div>
  <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
    <X size={20}/>
  </button>
</div>
          <nav className="p-4 space-y-2 flex-grow overflow-y-auto scrollbar-hide">
            <NavItem active={view === 'dashboard'} icon={<LayoutDashboard size={18}/>} label="Dashboard" onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} />
            <NavItem active={view === 'list' || view === 'detail' || view === 'add-proposal'} icon={<FileText size={18}/>} label="Daftar Berkas" onClick={() => { setView('list'); setIsMobileMenuOpen(false); }} />
            <NavItem active={view === 'panduan'} icon={<BookOpen size={18}/>} label="Panduan Sistem" onClick={() => { setView('panduan'); setIsMobileMenuOpen(false); }} />
            
            {/* ===== MENU STORAGE MANAGEMENT ===== */}
            {currentUserProfile.level === 'Admin' && (
              <NavItem active={view === 'storage'} icon={<Database size={18}/>} label="Manajemen Storage" onClick={() => { 
                setView('storage'); 
                checkStorageUsage(); 
                setIsMobileMenuOpen(false); 
              }} />
            )}
            {/* ===== AKHIR MENU STORAGE ===== */}
            
{/* ===== MENU HISTORY LOG ===== */}
{currentUserProfile.level === 'Admin' && (
  <NavItem active={view === 'logs'} icon={<History size={18}/>} label="History Log" onClick={() => { setView('logs'); setIsMobileMenuOpen(false); }} />
)}
{/* ===== AKHIR MENU LOG ===== */}
          </nav>
          <div className="p-4 border-t border-slate-800 space-y-3">
            {currentUserProfile.level === 'Admin' && <NavItem active={view === 'settings'} icon={<Settings size={18}/>} label="Pengaturan Master" onClick={() => { setView('settings'); setIsMobileMenuOpen(false); }} />}
            
            {/* ===== TOMBOL NOTIFIKASI ===== */}
<button 
  onClick={() => setShowNotificationPanel(!showNotificationPanel)}
  className="w-full flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-bold text-xs uppercase tracking-widest relative"
>
  <div className="flex items-center gap-2">
    <Bell size={16} className="text-yellow-400" />
    <span>Notifikasi</span>
  </div>
  {unreadCount > 0 && (
    <span className="bg-rose-500 text-white text-[8px] rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  )}
</button>
{/* ===== AKHIR TOMBOL NOTIFIKASI ===== */}

            {/* Dark Mode Toggle */}
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-bold text-xs uppercase tracking-widest">
              {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-blue-400" />}
              {isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            </button>

            <div className="p-4 bg-slate-800/40 dark:bg-slate-900/50 rounded-2xl text-left border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3 text-white">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black shadow-inner uppercase">{String(currentUserProfile.nama || "User").charAt(0)}</div>
                <div className="overflow-hidden"><p className="text-[10px] font-black truncate leading-none mb-1">{String(currentUserProfile.nama || "User")}</p><p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">{String(currentUserProfile.level || "Viewer")}</p></div>
              </div>

              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors font-bold text-[10px] uppercase tracking-widest">
                 <LogOut size={14}/> Keluar Akun
              </button>

              {/* ===== PANEL NOTIFIKASI ===== */}
{showNotificationPanel && (
  <div className="absolute left-64 top-auto bottom-20 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
    <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center">
      <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
        <Bell size={14} /> NOTIFIKASI
      </h3>
      <div className="flex gap-2">
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-[8px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
          >
            Tandai Dibaca
          </button>
        )}
        <button onClick={() => setShowNotificationPanel(false)} className="text-white/70 hover:text-white">
          <X size={14} />
        </button>
      </div>
    </div>
    
    <div className="max-h-96 overflow-y-auto">
      {notifications.length > 0 ? (
        notifications.map((notif, idx) => (
          <div
            key={notif.id}
            id={`notif-${notif.id}`}
            className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer ${
              notif.read ? 'opacity-60' : 'bg-blue-50/30 dark:bg-blue-900/10'
            }`}
            onClick={() => {
              // Aksi saat notifikasi diklik
              if (notif.data?.id) {
                const proposal = proposals.find(p => p.id === notif.data.id);
                if (proposal) {
                  setSelectedProposal(proposal);
                  setLocalCatatan(proposal.hasilVerifikasi || '');
                  setView('detail');
                  setShowNotificationPanel(false);
                  
                  // Tandai sebagai dibaca
                  setNotifications(prev => prev.map(n => 
                    n.id === notif.id ? { ...n, read: true } : n
                  ));
                  setUnreadCount(prev => Math.max(0, prev - 1));
                }
              }
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase">
                {notif.title}
              </span>
              <span className="text-[8px] text-slate-400">
                {new Date(notif.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 mb-2">
              {notif.message}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-[8px] text-slate-400">
                {new Date(notif.timestamp).toLocaleDateString('id-ID')}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeRealTimeNotification(notif.id);
                }}
                className="text-slate-400 hover:text-rose-600"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-slate-400 italic text-xs">
          <Bell size={24} className="mx-auto mb-2 opacity-30" />
          <p>Belum ada notifikasi</p>
        </div>
      )}
    </div>
    
    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-between text-[8px] text-slate-400">
      <span>{notifications.length} notifikasi</span>
      {notifications.length > 0 && (
        <button 
          onClick={() => setNotifications([])}
          className="text-rose-600 hover:text-rose-700"
        >
          Hapus Semua
        </button>
      )}
    </div>
  </div>
)}
{/* ===== AKHIR PANEL NOTIFIKASI ===== */}

            </div>
          </div>
        </aside>

        <div className="flex-grow flex flex-col min-w-0 print:hidden overflow-hidden transition-colors duration-300">
          {/* MOBILE HEADER */}
          <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 lg:hidden px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm print:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"><Menu size={24}/></button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-black text-[10px] uppercase">{branding.icon}</div>
              <span className="text-sm font-black text-slate-800 dark:text-slate-100 italic uppercase">{branding.name1}<span className="text-blue-500">{branding.name2}</span></span>
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-600 dark:text-slate-300">
              {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>
          </header>

          <main className="flex-grow p-6 lg:p-8 overflow-y-auto scrollbar-hide text-left print:hidden">
            
            {/* VIEW: DASHBOARD */}
            {view === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in">
                <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Monitoring Berkas</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Dashboard Utama {branding.tagline}</p>
                  </div>
                  {/* Filters: Year & Tahap */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                      <Layers size={18} className="text-blue-500 ml-2" />
                      <select value={selectedTahap} onChange={e => setSelectedTahap(e.target.value)} className="bg-transparent text-sm font-bold text-blue-600 dark:text-blue-400 outline-none cursor-pointer pr-2">
                        <option value="Semua">Semua Tahap</option>
                        {tahapList && tahapList.length > 0 ? (
                          tahapList.map(t => (
                            <option key={t.id} value={t.nama}>
                              {String(t.nama || t.id || "Tanpa Nama")}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>-- Belum ada data tahap --</option>
                        )}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
  <CalendarDays size={18} className="text-slate-400 ml-2" />
  <select value={selectedYear} onChange={e => {setSelectedYear(e.target.value); setCurrentPage(1);}} className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 shadow-sm outline-none transition-colors">
  <option value="Semua">Semua Tahun</option>
  {tahunList && tahunList.length > 0 ? (
    tahunList.map(t => (
      <option key={t.id} value={t.tahun || t.nama}>
        {t.tahun || t.nama}
      </option>
    ))
  ) : (
    // Fallback jika data tahun kosong
    <>
      <option value="2024">2024</option>
      <option value="2025">2025</option>
      <option value="2026">2026</option>
    </>
  )}
</select>
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard title="Masuk" value={chartData.total} icon={<Inbox size={18} className="text-blue-600 dark:text-blue-400"/>} color="bg-blue-50" darkColor="dark:bg-blue-900/20" description={`Filter Aktif`} />
                  <StatCard title="Proses" value={chartData.pending} icon={<Clock size={18} className="text-amber-600 dark:text-amber-400"/>} color="bg-amber-50" darkColor="dark:bg-amber-900/20" description="Sedang Berjalan" />
                  <StatCard title="Disetujui" value={chartData.approved} icon={<FileCheck size={18} className="text-emerald-600 dark:text-emerald-400"/>} color="bg-emerald-50" darkColor="dark:bg-emerald-900/20" description="Selesai Final" />
                  <StatCard title="Ditolak" value={chartData.rejected} icon={<FileX size={18} className="text-rose-600 dark:text-rose-400"/>} color="bg-rose-50" darkColor="dark:bg-rose-900/20" description="Perlu Perbaikan" />
                </div>

                {/* ADVANCED ANALYTICS CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  
                  {/* Chart 1: Status Distribution */}
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2"><PieChart size={18} className="text-blue-600 dark:text-blue-400"/> Distribusi Status Berkas</h3>
                    <div className="flex-grow flex items-center justify-center gap-8">
                      {chartData.total === 0 ? (
                        <p className="text-slate-400 italic text-sm">Data tidak tersedia untuk filter ini.</p>
                      ) : (
                        <>
                          <div className="relative w-40 h-40 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                              <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke={isDarkMode ? "#334155" : "#f1f5f9"} strokeWidth="4"></circle>
                              <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray={`${(chartData.approved/chartData.total)*100} ${100 - (chartData.approved/chartData.total)*100}`} strokeDashoffset="100"></circle>
                              <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f43f5e" strokeWidth="4" strokeDasharray={`${(chartData.rejected/chartData.total)*100} ${100 - (chartData.rejected/chartData.total)*100}`} strokeDashoffset={`${100 - ((chartData.approved/chartData.total)*100)}`}></circle>
                              <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${(chartData.pending/chartData.total)*100} ${100 - (chartData.pending/chartData.total)*100}`} strokeDashoffset={`${100 - ((chartData.approved/chartData.total)*100) - ((chartData.rejected/chartData.total)*100)}`}></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{chartData.total}</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase">Total</span>
                            </div>
                          </div>
                          <div className="space-y-3 w-full">
                            <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="font-bold text-slate-700 dark:text-slate-300">Disetujui Final</span></div><span className="font-black dark:text-slate-100">{((chartData.approved/chartData.total)*100).toFixed(0)}%</span></div>
                            <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="font-bold text-slate-700 dark:text-slate-300">Ditolak (Butuh Perbaikan)</span></div><span className="font-black dark:text-slate-100">{((chartData.rejected/chartData.total)*100).toFixed(0)}%</span></div>
                            <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="font-bold text-slate-700 dark:text-slate-300">Berjalan (Pending/Verif)</span></div><span className="font-black dark:text-slate-100">{((chartData.pending/chartData.total)*100).toFixed(0)}%</span></div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Chart 2: Top SKPDs */}
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><BarChart2 size={18} className="text-blue-600 dark:text-blue-400"/> 5 Instansi Teraktif Mengusulkan</h3>
                    <div className="flex-grow flex flex-col justify-center space-y-4">
                      {chartData.topSkpds.length === 0 ? (
                        <p className="text-slate-400 italic text-sm text-center">Data tidak tersedia untuk filter ini.</p>
                      ) : (
                        chartData.topSkpds.map(([name, count], index) => (
                          <div key={index} className="w-full">
                            <div className="flex justify-between items-end mb-1">
                              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-3/4">{String(name || "")}</span>
                              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">{String(count || "0")} Usulan</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                              <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(count / chartData.maxSkpdCount) * 100}%` }}></div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* VIEW: LIST USULAN */}
            {view === 'list' && (
              <div className="space-y-6 animate-in fade-in h-full flex flex-col text-left">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div><h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Daftar Usulan Pergeseran</h2><p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest italic">Akses: {currentUserProfile.level}</p></div>
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    
                    {/* BULK ACTION BUTTONS */}
                    {selectedForBulk.length > 0 && ['Admin', 'Operator BKAD'].includes(currentUserProfile.level) && (
                      <div className="flex gap-2 mr-2 border-r pr-4 border-slate-200 dark:border-slate-700 items-center">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-300 mr-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{selectedForBulk.length} Terpilih</span>
                        {currentUserProfile.level === 'Operator BKAD' && (
                           <>
                             <button disabled={isProcessing} onClick={() => handleBulkFinalize('Diverifikasi')} className="px-3 py-2 bg-blue-600 text-white rounded-lg font-black text-[10px] shadow-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"><CheckCircle size={14}/> VERIFIKASI</button>
                             <button disabled={isProcessing} onClick={() => handleBulkFinalize('Ditolak Operator')} className="px-3 py-2 bg-rose-600 text-white rounded-lg font-black text-[10px] shadow-sm hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"><XCircle size={14}/> TOLAK</button>
                           </>
                        )}
                        {currentUserProfile.level === 'Admin' && (
                           <>
                             <button disabled={isProcessing} onClick={() => handleBulkFinalize('Disetujui')} className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-black text-[10px] shadow-sm hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"><CheckCircle size={14}/> SETUJUI FINAL</button>
                             <button disabled={isProcessing} onClick={() => handleBulkFinalize('Ditolak Admin')} className="px-3 py-2 bg-rose-600 text-white rounded-lg font-black text-[10px] shadow-sm hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"><XCircle size={14}/> TOLAK</button>
                           </>
                        )}
                      </div>
                    )}

                    {/* Filter Tahap di List View */}
                    <select value={selectedTahap} onChange={e => {setSelectedTahap(e.target.value); setCurrentPage(1);}} className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-bold text-blue-600 dark:text-blue-400 shadow-sm outline-none transition-colors">
                      <option value="Semua">Semua Tahap</option>
                      {tahapList && tahapList.length > 0 ? (
                        tahapList.map(t => (
                          <option key={t.id} value={t.nama}>{String(t.nama || "")}</option>
                        ))
                      ) : null}
                    </select>

                    {/* Filter Tahun di List View */}
                    <select value={selectedYear} onChange={e => {setSelectedYear(e.target.value); setCurrentPage(1);}} className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 shadow-sm outline-none transition-colors">
                      <option value="Semua">Semua Tahun</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>

                    <div className="relative group flex-grow md:w-48"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Cari..." className="pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs w-full outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm transition-colors" onChange={(e)=>{setSearchTerm(e.target.value); setCurrentPage(1);}} /></div>
                    <select value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 shadow-sm outline-none transition-colors">
                        <option value="Semua">Semua Status</option>
                        <option value="Pending">Pending (Verifikasi)</option>
                        <option value="Diverifikasi">Diverifikasi (Setuju Admin)</option>
                        <option value="Disetujui">Disetujui Final</option>
                        <option value="Ditolak">Ditolak (SKPD Perbaiki)</option>
                    </select>
                    <button onClick={handleExportCSV} className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400" title="Ekspor Excel"><FileSpreadsheet size={18}/> EXCEL</button>
                    {['SKPD', 'Admin', 'Operator BKAD'].includes(currentUserProfile.level) && <button onClick={() => { resetForm(); setIsEditing(false); setView('add-proposal'); }} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs shadow-lg hover:bg-blue-700 active:scale-95 transition-all">TAMBAH USULAN</button>}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-colors">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[1200px]">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                        <tr>
                          {['Admin', 'Operator BKAD'].includes(currentUserProfile.level) && (
                            <th className="p-3 w-10 text-center">
                              <input 
                                type="checkbox" 
                                checked={currentData.length > 0 && selectedForBulk.length === currentData.length}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedForBulk(currentData.map(p => p.id));
                                  else setSelectedForBulk([]);
                                }}
                                className="rounded text-blue-600 focus:ring-blue-50 cursor-pointer bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                              />
                            </th>
                          )}
                          <th className="p-3">Tanggal</th>
                          <th className="p-3">No. Surat</th>
                          <th className="p-3 w-48">SKPD</th>
                          <th className="p-3 w-40">Sub Kegiatan</th>
                          <th className="p-3">Kode Rekening</th>
                          <th className="p-3 w-40">Sub Rincian Objek</th>
                          <th className="p-3 text-right">Pagu Semula</th>
                          <th className="p-3 text-right">Pagu Sesudah</th>
                          <th className="p-3 text-right">Pagu Akhir (Selisih)</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-center">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium text-slate-700 dark:text-slate-300">
                        {currentData.map(p => {
                          const rincianList = p.rincian && p.rincian.length > 0 ? p.rincian : [{ id: p.id+'-r', kodeRekening: '-', uraian: String(p.subKegiatan || '-'), paguSebelum: p.paguSebelum || 0, paguSesudah: p.paguSesudah || 0 }];
                          
                          // Rules untuk menampilkan tombol edit:
                          const canEdit = currentUserProfile.level === 'Admin' || (currentUserProfile.level === 'SKPD' && (String(p.status).includes('Ditolak') || p.status === 'Pending'));

                          return rincianList.map((r, index) => (
                            <tr key={`${p.id}-${r.id || index}`} className={`transition-colors ${selectedForBulk.includes(p.id) ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'}`}>
                              {index === 0 && ['Admin', 'Operator BKAD'].includes(currentUserProfile.level) && (
                                <td rowSpan={rincianList.length} className="p-3 text-center border-b border-slate-100 dark:border-slate-700/50 align-top">
                                  <input 
                                    type="checkbox"
                                    checked={selectedForBulk.includes(p.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedForBulk(prev => [...prev, p.id]);
                                      else setSelectedForBulk(prev => prev.filter(id => id !== p.id));
                                    }}
                                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                                  />
                                </td>
                              )}
                              
                              {index === 0 && <td rowSpan={rincianList.length} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-xs whitespace-nowrap">{String(p.tanggalSurat || '-')}</td>}
                              
                              {index === 0 && <td rowSpan={rincianList.length} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-xs font-black text-blue-600 dark:text-blue-400 whitespace-normal break-words">
                                {String(p.nomorSurat || "N/A")}
                                <span className="block mt-1.5 text-[9px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded w-max font-bold border border-blue-200 dark:border-blue-800 uppercase tracking-tighter">[{String(p.tahap || 'Belum Ditentukan')}]</span>
                              </td>}
                              
                              {index === 0 && <td rowSpan={rincianList.length} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-xs font-bold whitespace-normal break-words leading-relaxed">{String(p.skpd || "Dinas")}</td>}
                              {index === 0 && <td rowSpan={rincianList.length} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-xs whitespace-normal break-words leading-relaxed">{String(p.subKegiatan || "-")}</td>}

                              {/* Rincian SRO Columns */}
                              <td className="p-3 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">{String(r.kodeRekening || '-')}</td>
                              <td className="p-3 text-xs font-bold border-b border-slate-100 dark:border-slate-700/50 whitespace-normal break-words leading-relaxed">{String(r.uraian || '-')}</td>
                              <td className="p-3 text-right text-xs border-b border-slate-100 dark:border-slate-700/50">{formatIDR(r.paguSebelum)}</td>
                              <td className="p-3 text-right text-xs font-bold text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-700/50">{formatIDR(r.paguSesudah)}</td>
                              <td className="p-3 text-right text-xs font-black border-b border-slate-100 dark:border-slate-700/50">{formatIDR(Number(r.paguSesudah||0)-Number(r.paguSebelum||0))}</td>

                              {index === 0 && <td rowSpan={rincianList.length} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-center"><StatusBadge status={p.status}/></td>}
                              {index === 0 && (
                                <td rowSpan={rincianList.length} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-center">
                                  <div className="flex items-center justify-center gap-2 flex-wrap max-w-[120px] mx-auto">
                                    <button onClick={(e)=>{
                                        e.stopPropagation();
                                        setSelectedProposal(p); 
                                        setLocalCatatan(p.hasilVerifikasi || '');
                                        setView('detail');
                                    }} className="px-3 py-1.5 bg-slate-700 text-white text-[9px] font-black rounded-lg shadow-sm hover:bg-slate-800 transition-all w-full">DETAIL</button>
                                    
                                    <div className="flex justify-center gap-1.5 w-full mt-1">
                                        {canEdit && <button onClick={(e)=>{ e.stopPropagation(); handleEditClick(p); }} className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 rounded-lg transition-all" title="Perbaiki Berkas"><Edit3 size={14}/></button>}
                                        
                                        {(currentUserProfile.level === 'Admin' || (currentUserProfile.level === 'SKPD' && p.status !== 'Disetujui')) && (
                                            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({show: true, id: p.id, name: p.nomorSurat || 'Usulan ini', type: 'Usulan'}); }} className="p-1.5 text-rose-600 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 rounded-lg transition-all" title="Hapus Usulan"><Trash2 size={14}/></button>
                                        )}
                                        
                                        {p.status === 'Disetujui' && (
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProposal(p);
                                                setView('detail');
                                                addNotification("Menyiapkan dokumen...", "info");
                                                setTimeout(() => {
                                                    try { window.print(); } 
                                                    catch (ex) { addNotification("Gunakan Ctrl+P (Windows) / Cmd+P (Mac) untuk mencetak.", "info"); }
                                                }, 800);
                                            }} className="p-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 rounded-lg transition-all" title="Cetak Berita Acara"><Printer size={14}/></button>
                                        )}
                                    </div>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ));
                        })}
                        {currentData.length === 0 && <tr><td colSpan={['Admin', 'Operator BKAD'].includes(currentUserProfile.level) ? 12 : 11} className="p-20 text-center text-slate-400 italic font-bold uppercase tracking-widest opacity-50">Data Kosong.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs transition-colors">
                    <div className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400">Baris: 
                      <select value={itemsPerPage} onChange={e => {setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1);}} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded p-1 outline-none text-blue-600 dark:text-blue-400 font-black tracking-tighter">{[10,30,50,100].map(v=><option key={v} value={v}>{String(v)}</option>)}</select>
                    </div>
                    <div className="flex items-center gap-2">
                      <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)} className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm disabled:opacity-30 text-slate-600 dark:text-slate-300"><ChevronLeft size={14}/></button>
                      <span className="font-black text-slate-600 dark:text-slate-300 tracking-tighter">Hal {currentPage} / {totalPages || 1}</span>
                      <button disabled={currentPage===totalPages || totalPages===0} onClick={()=>setCurrentPage(p=>p+1)} className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm disabled:opacity-30 text-slate-600 dark:text-slate-300"><ChevronRight size={14}/></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: ADD / EDIT FORM */}
            {view === 'add-proposal' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 pb-20">
                <div className="flex items-center gap-3">
                  <button onClick={() => { setView('list'); setIsEditing(false); resetForm(); }} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm text-slate-600 dark:text-slate-300"><ArrowLeft size={18}/></button>
                  <div><h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{isEditing ? 'Perbarui Usulan' : 'Tambah Usulan Baru'}</h2><p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">{String(currentUserProfile.nama || "")}</p></div>
                </div>
                
                <div className={`grid grid-cols-1 ${isEditing && selectedProposal ? 'xl:grid-cols-3' : ''} gap-6`}>
                  {/* Left Column (Form) */}
                  <div className={`${isEditing && selectedProposal ? 'xl:col-span-2' : ''} space-y-6`}>
                      {/* PMDN 77 Warning Banner */}
                      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3">
                          <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                              <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">Peringatan Regulasi</h4>
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 leading-relaxed">
                                  Pastikan seluruh rincian SRO (Sub Rincian Objek) yang ditambahkan sesuai dengan peraturan yang berlaku di institusi.
                              </p>
                          </div>
                      </div>

                      <form onSubmit={handleSaveProposal} className="space-y-6">
                        {/* Bagian 1: Header Surat */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
                          <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2 tracking-widest italic"><Calendar size={14}/> INFORMASI SURAT & DOKUMEN</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Tahap Pergeseran</label>
                              {currentUserProfile.level === 'SKPD' ? (
                                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 italic">
                                  Akan ditentukan oleh Admin
                                  </div>
                              ) : (
                                  <select required value={proposalForm.tahap} onChange={e => setProposalForm({...proposalForm, tahap: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-black focus:ring-2 focus:ring-blue-500 outline-none uppercase tracking-widest">
                                  <option value="Belum Ditentukan">-- Pilih Tahap --</option>
                                  {tahapList && tahapList.length > 0 ? (
                                    tahapList.map(t => <option key={t.id} value={t.nama}>{String(t.nama || "")}</option>)
                                  ) : null}
                                  </select>
                              )}
                              </div>

                              <div>
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Instansi Pengusul</label>
                              {currentUserProfile.level === 'SKPD' ? (
                                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 italic flex items-center gap-2 shadow-inner"><Building2 size={16}/> {String(currentUserProfile.nama || "")}</div>
                              ) : (
                                  <select required value={proposalForm.skpdId} onChange={e => setProposalForm({...proposalForm, skpdId: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 outline-none">
                                  <option value="">Pilih Instansi...</option>
                                  {skpdList.map(s => <option key={s.id} value={s.id}>{String(s.nama || "")}</option>)}
                                  </select>
                              )}
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Nomor Surat Usulan</label><input required value={proposalForm.nomorSurat} onChange={e=>setProposalForm({...proposalForm, nomorSurat: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="900/..." /></div>
                            <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Tanggal</label><input required type="date" value={proposalForm.tanggalSurat} onChange={e=>setProposalForm({...proposalForm, tanggalSurat: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none" /></div>
                          </div>
                          
                          <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Sub Kegiatan</label>
                            
                            {/* Input Pencarian */}
                            <div className="relative">
                              <input
                                type="text"
                                value={searchSubKeg}
                                onChange={(e) => {
                                  setSearchSubKeg(e.target.value);
                                  setShowSubKegDropdown(true);
                                }}
                                onFocus={() => setShowSubKegDropdown(true)}
                                placeholder="Ketik untuk mencari sub kegiatan..."
                                className="w-full p-3 pl-10 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                            
                            {/* Nilai yang dipilih (ditampilkan sebagai teks) */}
                            {proposalForm.subKegiatan && (
                              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-700 dark:text-blue-300 flex items-center justify-between">
                                <span className="font-medium">Dipilih: {proposalForm.subKegiatan}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProposalForm({...proposalForm, subKegiatan: ''});
                                    setSearchSubKeg('');
                                  }}
                                  className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                            
                            {/* Dropdown Hasil Pencarian */}
                            {showSubKegDropdown && filteredSubKeg.length > 0 && (
                              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                {filteredSubKeg.map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
                                    onClick={() => {
                                      setProposalForm({...proposalForm, subKegiatan: item.nama});
                                      setSearchSubKeg('');
                                      setShowSubKegDropdown(false);
                                    }}
                                  >
                                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                      {item.nama}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* Dropdown semua sub kegiatan (jika pencarian kosong) */}
                            {showSubKegDropdown && searchSubKeg === '' && subKegList.length > 0 && (
                              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                <div className="p-2 text-[9px] text-slate-400 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                  ✏️ Ketik untuk mencari...
                                </div>
                                {subKegList.slice(0, 10).map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
                                    onClick={() => {
                                      setProposalForm({...proposalForm, subKegiatan: item.nama});
                                      setShowSubKegDropdown(false);
                                    }}
                                  >
                                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                      {item.nama}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* Klik di luar untuk menutup dropdown */}
                            {showSubKegDropdown && (
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setShowSubKegDropdown(false)}
                              />
                            )}
                          </div>

                          <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Perihal Pergeseran</label><textarea required rows="2" value={proposalForm.perihal} onChange={e=>setProposalForm({...proposalForm, perihal: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 font-medium outline-none" /></div>

                          {/* Bagian Upload File Baru */}
                          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                            <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2 tracking-widest italic mb-4">
                              <Upload size={14}/> DOKUMEN PENDUKUNG
                            </h3>
                            
                            <div className="space-y-4">
                              {/* Upload Area */}
                              <div className="relative">
                                <input 
                                  type="file" 
                                  accept=".pdf,.jpg,.jpeg,.png" 
                                  onChange={handlePdfUpload} 
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                  title="Klik untuk upload file"
                                  disabled={uploadingFile}
                                />
                                
                                <div className={`w-full p-4 border-2 border-dashed rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 outline-none flex flex-col items-center justify-center transition-colors ${
                                  proposalForm.lampiran 
                                    ? 'border-green-300 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' 
                                    : 'border-blue-300 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-500'
                                }`}>
                                  
                                  {uploadingFile ? (
                                    // Progress Upload
                                    <div className="w-full text-center">
                                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                        Mengupload... {Math.round(uploadProgress)}%
                                      </p>
                                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                          style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  ) : proposalForm.lampiran ? (
                                    // File sudah terupload
                                    <div className="w-full text-center">
                                      <FileCheck size={32} className="mx-auto mb-2 text-green-500" />
                                      <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-1 truncate max-w-full">
                                        {proposalForm.lampiran.name}
                                      </p>
                                      <p className="text-[9px] text-slate-500 dark:text-slate-400 mb-3">
                                        {(proposalForm.lampiran.size / 1024).toFixed(1)} KB • 
                                        {new Date(proposalForm.lampiran.uploadedAt).toLocaleDateString('id-ID')}
                                      </p>
                                      <div className="flex gap-2 justify-center">
                                        <a 
                                          href={proposalForm.lampiran.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase flex items-center gap-1"
                                        >
                                          <Download size={12} /> LIHAT
                                        </a>
                                        <button
                                          type="button"
                                          onClick={() => setProposalForm({...proposalForm, lampiran: null})}
                                          className="px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-[9px] font-black uppercase flex items-center gap-1"
                                        >
                                          <Trash2 size={12} /> HAPUS
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    // Belum ada file
                                    <>
                                      <Upload size={32} className="mx-auto mb-2 text-blue-400" />
                                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        Pilih File PDF / Gambar
                                      </p>
                                      <p className="text-[9px] text-slate-400 dark:text-slate-500">
                                        Maksimal 2MB • Format: PDF, JPG, PNG
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>

                              {uploadError && (
                                <div className="p-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-[9px] text-rose-600 dark:text-rose-400">
                                  Error: {uploadError}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bagian 2: Formulir Rincian SRO Dinamis */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
                          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
                              <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2 tracking-widest italic"><Database size={14}/> RINCIAN PERGESERAN S.R.O</h3>
                              <button type="button" onClick={handleAddRincian} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-200 transition-colors">
                                  <Plus size={14}/> Tambah Rincian
                              </button>
                          </div>

                          {/* Header Tabel Visual */}
                          <div className="hidden md:grid grid-cols-12 gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">
                              <div className="col-span-3">Kode Rekening</div>
                              <div className="col-span-3">Uraian Sub Rincian Objek</div>
                              <div className="col-span-2 text-right">Pagu Semula</div>
                              <div className="col-span-2 text-right">Pagu Sesudah</div>
                              <div className="col-span-2 text-center">Aksi</div>
                          </div>

                          {/* Mapping List SRO */}
                          <div className="space-y-4 md:space-y-2">
                              {(proposalForm.rincian || []).map((item, index) => (
                                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-slate-50 dark:bg-slate-900/50 p-4 md:p-2 rounded-xl border border-slate-100 dark:border-slate-700 items-center">
                                      <div className="md:col-span-3">
                                          <label className="md:hidden text-[10px] font-bold text-slate-400 mb-1 block">Kode Rekening</label>
                                          <input required placeholder="Contoh: 5.1.02.xx" value={item.kodeRekening} onChange={(e) => handleRincianChange(item.id, 'kodeRekening', e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500" />
                                      </div>
                                      <div className="md:col-span-3">
                                          <label className="md:hidden text-[10px] font-bold text-slate-400 mb-1 block">Uraian SRO</label>
                                          <input required placeholder="Nama Sub Rincian Objek..." value={item.uraian} onChange={(e) => handleRincianChange(item.id, 'uraian', e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500" />
                                      </div>
                                      <div className="md:col-span-2">
                                          <label className="md:hidden text-[10px] font-bold text-slate-400 mb-1 block">Pagu Semula</label>
                                          <input required type="number" placeholder="0" value={item.paguSebelum} onChange={(e) => handleRincianChange(item.id, 'paguSebelum', parseFloat(e.target.value || 0))} className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none text-right focus:ring-1 focus:ring-emerald-500" />
                                      </div>
                                      <div className="md:col-span-2">
                                          <label className="md:hidden text-[10px] font-bold text-slate-400 mb-1 block">Pagu Sesudah</label>
                                          <input required type="number" placeholder="0" value={item.paguSesudah} onChange={(e) => handleRincianChange(item.id, 'paguSesudah', parseFloat(e.target.value || 0))} className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-800 font-bold text-blue-600 dark:text-blue-400 outline-none text-right focus:ring-1 focus:ring-emerald-500" />
                                      </div>
                                      <div className="md:col-span-2 flex justify-center gap-2 mt-2 md:mt-0">
  {/* ===== TOMBOL BANK DATA DENGAN DEBUG ===== */}
  <button 
    type="button" 
    onClick={() => { 
      console.log("📌 Menyimpan index:", index); // DEBUG
      setShowBankSro(true); 
      sessionStorage.setItem('editingSroIndex', index); 
    }} 
    className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors" 
    title="Pilih dari Bank Data"
  >
    <Database size={16} />
  </button>
  {/* ===== AKHIR TOMBOL BANK DATA ===== */}
  
  <button type="button" onClick={() => handleRemoveRincian(item.id)} disabled={(proposalForm.rincian || []).length === 1} className="p-2 text-slate-400 hover:text-rose-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg disabled:opacity-30 transition-colors" title="Hapus Rincian">
    <Trash2 size={16} />
  </button>
</div>
                                  </div>
                              ))}
                          </div>

                          {/* Ringkasan Kalkulasi Pagu */}
                          <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 p-4 rounded-xl mt-6">
                              <div className="flex justify-between items-center text-sm mb-2">
                                  <span className="font-bold text-slate-600 dark:text-slate-400">Total Pagu Semula</span>
                                  <span className="font-black text-slate-800 dark:text-slate-200">{formatIDR(formTotalSebelum)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm mb-4 border-b border-emerald-200 dark:border-emerald-800/50 pb-4">
                                  <span className="font-bold text-blue-600 dark:text-blue-400">Total Pagu Sesudah</span>
                                  <span className="font-black text-blue-700 dark:text-blue-300">{formatIDR(formTotalSesudah)}</span>
                              </div>
                              <div className="flex justify-between items-center text-lg">
                                  <span className="font-black uppercase tracking-tighter text-slate-700 dark:text-slate-300">Total Selisih</span>
                                  <span className={`font-black ${formTotalSelisih > 0 ? 'text-emerald-600 dark:text-emerald-400' : formTotalSelisih < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                      {formatIDR(formTotalSelisih)}
                                  </span>
                              </div>
                          </div>

                          <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block mb-1">Alasan Pergeseran SRO</label><textarea required rows="2" value={proposalForm.alasan} onChange={e=>setProposalForm({...proposalForm, alasan: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none" placeholder="Uraikan alasan memindahkan rincian tersebut..." /></div>
                          
                          {currentUserProfile.level !== 'SKPD' && (
                            <div className="pt-2 border-t dark:border-slate-700 mt-4 text-left">
                              <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase block mb-1 tracking-widest">Catatan Admin</label>
                              <textarea rows="3" value={proposalForm.hasilVerifikasi || ''} onChange={e=>setProposalForm({...proposalForm, hasilVerifikasi: e.target.value})} className="w-full p-3 border border-blue-200 dark:border-blue-900 rounded-xl text-sm bg-blue-50/50 dark:bg-blue-900/20 text-slate-800 dark:text-slate-100 outline-none font-medium shadow-inner" />
                            </div>
                          )}
                          
                          <button disabled={isProcessing} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
                              {isProcessing ? 'MENYIMPAN...' : <><Send size={18} /> {isEditing ? 'PERBARUI USULAN' : 'KIRIM USULAN'}</>}
                          </button>
                        </div>
                      </form>
                  </div>
                  
                  {/* Right Column (Chat & History - Hanya Tampil Saat Mode Edit) */}
                  {isEditing && selectedProposal && (
                    <div className="space-y-6">
                      {/* FITUR: Ruang Diskusi */}
<div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[350px] transition-colors">
  <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl flex items-center gap-2">
    <MessageSquare size={16} className="text-blue-600 dark:text-blue-400"/>
    <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Ruang Diskusi</h3>
    <span className="ml-auto text-[8px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
      {selectedProposal.comments?.length || 0} pesan
    </span>
  </div>
  
  <div 
  className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/20 scrollbar-thin" 
  ref={chatContainerRef}
  style={{ minHeight: '250px', border: '1px solid red' }} // TAMBAHKAN BORDER SEMENTARA UNTUK DEBUG
>
    {!selectedProposal.comments || selectedProposal.comments.length === 0 ? (
      <div className="h-full flex items-center justify-center text-xs text-slate-400 italic font-medium">
        <div className="text-center">
          <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
          <p>Belum ada diskusi</p>
        </div>
      </div>
    ) : (
      <>
        {/* DEBUG: Tampilkan jumlah comments */}
        <div className="text-[8px] text-slate-400 bg-slate-100 dark:bg-slate-800 p-1 rounded mb-2">
          Debug: {selectedProposal.comments.length} comments
        </div>
        
        {selectedProposal.comments && selectedProposal.comments.length > 0 ? (
  <div className="space-y-3">
    {selectedProposal.comments.map((c, i) => {
      console.log("📝 Rendering comment:", c);
      const isMe = c.sender === currentUserProfile.nama;
      
      return (
        <div key={i} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: isMe ? 'flex-end' : 'flex-start',
          marginBottom: '12px'
        }}>
          <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '2px' }}>
            {c.sender} • {new Date(c.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
          </div>
          <div style={{
            padding: '8px 12px',
            borderRadius: '12px',
            maxWidth: '85%',
            fontSize: '11px',
            backgroundColor: isMe ? '#2563eb' : '#ffffff',
            color: isMe ? '#ffffff' : '#1e293b',
            border: isMe ? 'none' : '1px solid #e2e8f0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            {c.text}
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
      Belum ada diskusi
    </p>
  </div>
)}
      </>
    )}
  </div>
  
  {/* Form Input Chat */}
  {currentUserProfile.level !== 'TAPD' && (
    <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl">
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input 
          type="text" 
          value={commentText} 
          onChange={(e) => setCommentText(e.target.value)} 
          placeholder="Tulis pesan..." 
          className="flex-grow p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
        />
        <button 
          type="submit" 
          disabled={!commentText.trim()} 
          className="p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  )}
</div>

                      {/* FITUR: Riwayat Status */}
                      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
                        <div className="flex items-center gap-2 mb-6">
                          <History size={16} className="text-slate-400 dark:text-slate-500"/>
                          <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Riwayat Usulan</h3>
                        </div>
                        <div className="space-y-4">
                          {(selectedProposal.history || []).length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Belum ada riwayat.</p>
                          ) : (
                            (selectedProposal.history || []).map((h, i) => (
                              <div key={i} className="flex gap-4 relative">
                                {i !== (selectedProposal.history.length - 1) && <div className="absolute left-[7px] top-6 w-0.5 h-full bg-slate-200 dark:bg-slate-700"></div>}
                                <div className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 flex-shrink-0 mt-0.5 z-10"></div>
                                <div className="pb-4">
                                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{String(h.action)}</p>
                                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1">{String(h.by)} • {new Date(h.date).toLocaleDateString('id-ID', {day:'numeric', month:'short'})} {new Date(h.date).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

             {/* ===== MODAL BANK SRO ===== */}
            {showBankSro && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={() => setShowBankSro(false)}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
                  
                  {/* Header Modal */}
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-purple-600 to-purple-700">
                    <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                      <Database size={18} /> BANK DATA KODE REKENING
                    </h3>
                    <button onClick={() => setShowBankSro(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                  
                  {/* Search di Modal */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={filterBankSro}
                        onChange={(e) => setFilterBankSro(e.target.value)}
                        placeholder="Cari kode rekening atau uraian..."
                        className="pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-full outline-none bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>
                  
                  {/* Daftar SRO */}
                  <div className="flex-grow overflow-y-auto p-4">
  <div className="grid grid-cols-1 gap-2">
    {filteredBankSro.length > 0 ? (
      filteredBankSro.map((item, idx) => (
        <button
          key={item.id || idx}
          onClick={() => {
            const index = parseInt(sessionStorage.getItem('editingSroIndex') || '0');
            console.log("🔍 Item diklik:", { 
              id: item.id, 
              kode: item.kode, 
              uraian: item.uraian,
              targetIndex: index 
            });
            
            const berhasil = handlePilihSroForIndex(index, item.kode, item.uraian);
            
            if (berhasil) {
              setShowBankSro(false);
              setFilterBankSro('');
            }
          }}
          className="p-4 text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
        >
          <div className="font-mono text-sm font-bold text-purple-700 dark:text-purple-400 mb-1">
            {item.kode}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {item.uraian}
          </div>
        </button>
      ))
    ) : (
      <div className="text-center py-10 text-slate-400 italic">
        Tidak ada data SRO
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Footer Modal */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
                    <button
                      onClick={() => setShowBankSro(false)}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-black text-[10px] uppercase"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* ===== AKHIR MODAL BANK SRO ===== */}

            {/* VIEW: DETAIL VERIFIKASI (WITH CHAT & TRACKING) */}
            {view === 'detail' && selectedProposal && (
              <div className="space-y-6 animate-in slide-in-from-right-4 pb-20">
                 <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setView('list')} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300"><ArrowLeft size={18}/></button>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Detail Berkas #{String(selectedProposal.nomorSurat || "")}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{String(selectedProposal.skpd || "")} • <span className="text-blue-500 dark:text-blue-400">{String(selectedProposal.tahap || "Belum Ditentukan")}</span></p>
                      </div>
                    </div>
                    <div className="ml-auto flex gap-2 w-full md:w-auto">
                      
                      {/* ACTION BUTTONS */}
                      {currentUserProfile.level === 'Operator BKAD' && (
                        <>
                          <button 
                            disabled={isProcessing} 
                            onClick={() => handleFinalize('Diverifikasi')} 
                            className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-lg transition-all active:scale-95 text-center disabled:opacity-50"
                          >
                            {isProcessing ? 'PROSES...' : 'VERIFIKASI BERKAS'}
                          </button>
                          <button 
                            disabled={isProcessing} 
                            onClick={() => handleFinalize('Ditolak Operator')} 
                            className="flex-1 md:flex-none px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs shadow-lg transition-all active:scale-95 text-center disabled:opacity-50"
                          >
                            {isProcessing ? 'PROSES...' : 'TOLAK (KEMBALIKAN)'}
                          </button>
                        </>
                      )}

                      {currentUserProfile.level === 'Admin' && (
                        <>
                          <button 
                            disabled={isProcessing} 
                            onClick={() => handleFinalize('Disetujui')} 
                            className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-lg transition-all active:scale-95 text-center disabled:opacity-50"
                          >
                            {isProcessing ? 'PROSES...' : 'SETUJUI FINAL'}
                          </button>
                          <button 
                            disabled={isProcessing} 
                            onClick={() => handleFinalize('Ditolak Admin')} 
                            className="flex-1 md:flex-none px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs shadow-lg transition-all active:scale-95 text-center disabled:opacity-50"
                          >
                            {isProcessing ? 'PROSES...' : 'TOLAK'}
                          </button>
                        </>
                      )}

                      <button onClick={() => {
                          addNotification("Menyiapkan dokumen...", "info");
                          setTimeout(() => {
                              try { window.print(); } 
                              catch (e) { addNotification("Gunakan Ctrl+P (Windows) / Cmd+P (Mac) untuk mencetak.", "info"); }
                          }, 500);
                      }} className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-black text-xs shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors">
                          <Printer size={18} /> CETAK BA
                      </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* LEFT COLUMN: Data Berkas */}
                    <div className="xl:col-span-2 space-y-6">
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-2 gap-6 relative overflow-hidden transition-colors">
                        
                        <div><h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Tgl Surat</h4><p className="font-bold text-sm text-slate-800 dark:text-slate-200">{String(selectedProposal.tanggalSurat || "")}</p></div>
                        <div className="mt-10 md:mt-0"><h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Status Terkini</h4><StatusBadge status={selectedProposal.status}/></div>
                        <div className="col-span-full pt-4 border-t border-slate-100 dark:border-slate-700"><h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">Perihal</h4><p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic border-l-4 border-blue-500 pl-4">{String(selectedProposal.perihal || "")}</p></div>
                        <div className="col-span-full pt-4 border-t border-slate-100 dark:border-slate-700"><h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">Sub Kegiatan Utama</h4><p className="text-sm font-bold text-slate-800 dark:text-slate-200">{String(selectedProposal.subKegiatan || "N/A")}</p></div>
                        
                        {/* FITUR BARU: PENENTUAN TAHAP DI DETAIL VIEW */}
                        <div className="col-span-full pt-4 border-t border-slate-100 dark:border-slate-700">
                          <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">Penentuan Tahap (Admin/Operator)</h4>
                          {['Admin', 'Operator BKAD'].includes(currentUserProfile.level) ? (
                            <select 
                              value={selectedProposal.tahap || 'Belum Ditentukan'} 
                              onChange={(e) => {
                                const newTahap = e.target.value;
                                setSelectedProposal(prev => ({...prev, tahap: newTahap}));
                                updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', selectedProposal.id), { tahap: newTahap })
                                  .then(() => addNotification(`Berhasil menandai ke: ${newTahap}`, "success"))
                                  .catch((err) => addNotification(`Gagal menyimpan tahap: ${err.message}`, "error"));
                              }}
                              className="w-full md:w-1/2 p-3 border border-blue-200 dark:border-blue-800 rounded-xl text-sm bg-blue-50/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-black focus:ring-2 focus:ring-blue-500 outline-none uppercase tracking-widest cursor-pointer shadow-inner transition-colors"
                            >
                              <option value="Belum Ditentukan">-- PILIH TAHAP PERGESERAN --</option>
                              {tahapList && tahapList.length > 0 ? (
                                tahapList.map(t => <option key={t.id} value={t.nama}>{String(t.nama || "")}</option>)
                              ) : null}
                            </select>
                          ) : (
                            <div className="w-full md:w-1/2 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                              {String(selectedProposal.tahap || "Belum Ditentukan")}
                            </div>
                          )}
                          {['Admin', 'Operator BKAD'].includes(currentUserProfile.level) && (
                              <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 italic font-medium">Hanya Admin & Operator yang dapat melihat dan mengubah pilihan ini.</p>
                          )}
                        </div>
                        {/* END FITUR BARU */}

                        <div className="col-span-full pt-4 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase italic">Catatan Verifikasi (Admin Bidang Perencanaan Anggaran)</h4>
                            {!['SKPD', 'TAPD'].includes(currentUserProfile.level) && (
                              <button
                                onClick={() => setShowBankCatatan(!showBankCatatan)}
                                className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-purple-200 dark:border-purple-800"
                              >
                                <Database size={14} />
                                {showBankCatatan ? 'Tutup Bank Catatan' : 'Buka Bank Catatan'}
                              </button>
                            )}
                          </div>
                          
                          {['SKPD', 'TAPD'].includes(currentUserProfile.level) ? (
                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 font-medium italic text-xs leading-relaxed">{String(selectedProposal.hasilVerifikasi || "Sedang dalam proses pemeriksaan...")}</div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              
                              {/* ===== BANK CATATAN (DITAMPILKAN KETIKA DIBUKA) ===== */}
                              {showBankCatatan && (
                                <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-xl">
                                  <h5 className="text-[10px] font-black text-purple-700 dark:text-purple-400 uppercase mb-3 flex items-center gap-2">
                                    <Database size={14} /> BANK CATATAN ANALISA
                                  </h5>
                                  
                                  {/* Form Tambah Catatan Baru */}
                                  <form onSubmit={handleTambahCatatan} className="mb-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                      <input
                                        type="text"
                                        value={formCatatan.judul}
                                        onChange={(e) => setFormCatatan({...formCatatan, judul: e.target.value})}
                                        placeholder="Judul Catatan"
                                        className="md:col-span-1 p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                                      />
                                      <textarea
                                        rows="2"
                                        value={formCatatan.isi}
                                        onChange={(e) => setFormCatatan({...formCatatan, isi: e.target.value})}
                                        placeholder="Isi Catatan..."
                                        className="md:col-span-2 p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                                      />
                                    </div>
                                    <button
                                      type="submit"
                                      disabled={isProcessing}
                                      className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                                    >
                                      {isProcessing ? 'MENYIMPAN...' : 'TAMBAH KE BANK CATATAN'}
                                    </button>
                                  </form>
                                  
                                  {/* Daftar Catatan Tersimpan */}
                                  <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                                    {bankCatatan.length === 0 ? (
                                      <p className="text-center text-slate-400 italic text-[10px] py-4">Belum ada catatan tersimpan</p>
                                    ) : (
                                      bankCatatan.map((catatan) => (
                                        <div key={catatan.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 transition-all">
                                          
                                          {/* Mode Edit vs Mode Lihat */}
                                          {editingCatatan.id === catatan.id ? (
                                            // Mode Edit
                                            <div className="space-y-2">
                                              <input
                                                type="text"
                                                value={editingCatatan.judul}
                                                onChange={(e) => setEditingCatatan({...editingCatatan, judul: e.target.value})}
                                                className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg"
                                                placeholder="Judul"
                                              />
                                              <textarea
                                                rows="2"
                                                value={editingCatatan.isi}
                                                onChange={(e) => setEditingCatatan({...editingCatatan, isi: e.target.value})}
                                                className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg"
                                                placeholder="Isi catatan"
                                              />
                                              <div className="flex gap-2 justify-end">
                                                <button
                                                  onClick={() => setEditingCatatan({ id: null, judul: '', isi: '' })}
                                                  className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[9px] font-black"
                                                >
                                                  Batal
                                                </button>
                                                <button
                                                  onClick={handleEditCatatan}
                                                  disabled={isProcessing}
                                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-black"
                                                >
                                                  Simpan
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            // Mode Lihat
                                            <>
                                              <div className="flex justify-between items-start mb-2">
                                                <h6 className="font-black text-xs text-purple-700 dark:text-purple-400">
                                                  {catatan.judul}
                                                </h6>
                                                <div className="flex gap-1">
                                                  <button
                                                    onClick={() => setEditingCatatan({
                                                      id: catatan.id,
                                                      judul: catatan.judul,
                                                      isi: catatan.isi
                                                    })}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded"
                                                    title="Edit Catatan"
                                                  >
                                                    <Edit3 size={12} />
                                                  </button>
                                                  <button
                                                    onClick={() => handleHapusCatatan(catatan.id, catatan.judul)}
                                                    className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded"
                                                    title="Hapus Catatan"
                                                  >
                                                    <Trash2 size={12} />
                                                  </button>
                                                </div>
                                              </div>
                                              <p className="text-[10px] text-slate-600 dark:text-slate-400 mb-2 italic border-l-2 border-purple-300 pl-2">
                                                {catatan.isi}
                                              </p>
                                              <div className="flex justify-end">
                                                <button
                                                  onClick={() => handleGunakanCatatan(catatan.isi)}
                                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[8px] font-black uppercase tracking-wider"
                                                >
                                                  Gunakan Catatan
                                                </button>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              )}
                              {/* ===== AKHIR BANK CATATAN ===== */}
                              
                               <textarea rows="4" value={localCatatan} onChange={e => setLocalCatatan(e.target.value)} placeholder="Masukkan catatan analisa teknis untuk SKPD..." className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                               <button disabled={isProcessing} onClick={() => {
                                 if(selectedProposal?.id) {
                                    setIsProcessing(true);
                                    updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'proposals', selectedProposal.id), { hasilVerifikasi: localCatatan })
                                    .then(() => {
                                        addNotification("Catatan berhasil disimpan!", "success");
                                        setSelectedProposal(prev => ({...prev, hasilVerifikasi: localCatatan}));
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        addNotification(`Gagal menyimpan catatan: ${err.message}`, "error");
                                    })
                                    .finally(() => setIsProcessing(false));
                                 }
                               }} className="self-end px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg font-black text-[10px] uppercase shadow-sm transition-colors border border-blue-200 dark:border-blue-800 disabled:opacity-50">
                                 {isProcessing ? 'Menyimpan...' : 'Simpan Catatan'}
                               </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tabel Rincian SRO saat Detail */}
                      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                          <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Tabel Rincian Objek & Sub Rincian Objek (SRO)</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                                    <tr>
                                        <th className="p-3 border-b dark:border-slate-700">Kode Rekening</th>
                                        <th className="p-3 border-b dark:border-slate-700">Uraian</th>
                                        <th className="p-3 border-b dark:border-slate-700 text-right">Semula</th>
                                        <th className="p-3 border-b dark:border-slate-700 text-right">Menjadi</th>
                                        <th className="p-3 border-b dark:border-slate-700 text-right">Selisih</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {(selectedProposal.rincian && selectedProposal.rincian.length > 0 ? selectedProposal.rincian : [{ kodeRekening: '-', uraian: String(selectedProposal.subKegiatan || ""), paguSebelum: selectedProposal.paguSebelum, paguSesudah: selectedProposal.paguSesudah }]).map((r, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                                            <td className="p-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">{String(r.kodeRekening || "")}</td>
                                            <td className="p-3 font-bold text-slate-700 dark:text-slate-200">{String(r.uraian || "")}</td>
                                            <td className="p-3 text-right">{formatIDR(r.paguSebelum)}</td>
                                            <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">{formatIDR(r.paguSesudah)}</td>
                                            <td className={`p-3 text-right font-black ${(Number(r.paguSesudah||0)-Number(r.paguSebelum||0)) > 0 ? 'text-emerald-500' : (Number(r.paguSesudah||0)-Number(r.paguSebelum||0)) < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                                                {formatIDR(Number(r.paguSesudah||0)-Number(r.paguSebelum||0))}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-50 dark:bg-slate-900/50 font-black">
                                        <td colSpan="2" className="p-4 text-right uppercase tracking-widest text-slate-700 dark:text-slate-300">Total Akumulasi</td>
                                        <td className="p-4 text-right text-slate-800 dark:text-slate-200">{formatIDR(selectedProposal.paguSebelum)}</td>
                                        <td className="p-4 text-right text-blue-600 dark:text-blue-400">{formatIDR(selectedProposal.paguSesudah)}</td>
                                        <td className="p-4 text-right text-emerald-600 dark:text-emerald-400">{formatIDR(Number(selectedProposal.paguSesudah||0) - Number(selectedProposal.paguSebelum||0))}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Chat & History */}
                    <div className="space-y-6">
                      {/* FITUR: Ruang Diskusi */}
                      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[350px] transition-colors">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl flex items-center gap-2">
                          <MessageSquare size={16} className="text-blue-600 dark:text-blue-400"/>
                          <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Ruang Diskusi</h3>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/20 scrollbar-thin" ref={chatContainerRef}>
                          {(selectedProposal.comments || []).length === 0 ? (
                            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic font-medium">Belum ada diskusi untuk usulan ini.</div>
                          ) : (
                            (selectedProposal.comments || []).map((c, i) => {
                              const isMe = c.sender === currentUserProfile.nama;
                              return (
                                <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-1">{String(c.sender)} • {new Date(c.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
                                  <div className={`p-3 rounded-xl max-w-[85%] text-xs font-medium leading-relaxed shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-tl-sm'}`}>
                                    {String(c.text)}
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>
                        {currentUserProfile.level !== 'TAPD' && (
                          <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl">
                            <form onSubmit={handleAddComment} className="flex gap-2">
                              <input type="text" value={commentText} onChange={(e)=>setCommentText(e.target.value)} placeholder="Tulis pesan..." className="flex-grow p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                              <button type="submit" disabled={!commentText.trim()} className="p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors"><Send size={14}/></button>
                            </form>
                          </div>
                        )}
                      </div>

                      {/* FITUR: Riwayat Status (Tracking Timeline) */}
                      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
                        <div className="flex items-center gap-2 mb-6">
                          <History size={16} className="text-slate-400 dark:text-slate-500"/>
                          <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Riwayat Usulan</h3>
                        </div>
                        <div className="space-y-4">
                          {(selectedProposal.history || []).length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Belum ada riwayat.</p>
                          ) : (
                            (selectedProposal.history || []).map((h, i) => (
                              <div key={i} className="flex gap-4 relative">
                                {i !== (selectedProposal.history.length - 1) && <div className="absolute left-[7px] top-6 w-0.5 h-full bg-slate-200 dark:bg-slate-700"></div>}
                                <div className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 flex-shrink-0 mt-0.5 z-10"></div>
                                <div className="pb-4">
                                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{String(h.action)}</p>
                                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1">{String(h.by)} • {new Date(h.date).toLocaleDateString('id-ID', {day:'numeric', month:'short'})} {new Date(h.date).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                 </div>
              </div>
            )}

            {/* VIEW: PANDUAN SISTEM */}
            {view === 'panduan' && (
              <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto pb-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
                      PANDUAN SISTEM
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Untuk Pengguna Tingkat SKPD / Instansi
                    </p>
                  </div>
                </div>

                {/* Grid Panduan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card 1: Aturan PMDN 77 */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                      <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <Info size={18} /> ATURAN PMDN 77
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-sm flex-shrink-0 mt-0.5">1</div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="font-black text-slate-900 dark:text-slate-100">Rincian SRO:</span> Pastikan setiap pergeseran anggaran mencantumkan kode rekening dan uraian Sub Rincian Objek (SRO) yang valid.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-sm flex-shrink-0 mt-0.5">2</div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="font-black text-slate-900 dark:text-slate-100">Dokumen Pendukung:</span> Upload file PDF dengan ukuran maksimal 750KB. Dokumen harus jelas dan terbaca.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-sm flex-shrink-0 mt-0.5">3</div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="font-black text-slate-900 dark:text-slate-100">Alasan Pergeseran:</span> Uraikan secara detail alasan pemindahan anggaran antar SRO.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Alur Pengajuan */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                      <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <Layers size={18} /> ALUR PENGAJUAN
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-sm flex-shrink-0 mt-0.5">1</div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="font-black text-slate-900 dark:text-slate-100">Buat Usulan:</span> Klik tombol "TAMBAH USULAN" dan isi semua data yang diperlukan.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-sm flex-shrink-0 mt-0.5">2</div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="font-black text-slate-900 dark:text-slate-100">Status Pending:</span> Usulan masuk ke antrian verifikasi Operator BKAD.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-sm flex-shrink-0 mt-0.5">3</div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="font-black text-slate-900 dark:text-slate-100">Verifikasi Operator:</span> Operator akan memeriksa kelengkapan dokumen.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-sm flex-shrink-0 mt-0.5">4</div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="font-black text-slate-900 dark:text-slate-100">Finalisasi Admin:</span> Admin memberikan persetujuan akhir atau penolakan.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Cara Merespon Revisi */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all md:col-span-2">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                      <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <XCircle size={18} /> CARA MERESPON REVISI / PENOLAKAN
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black text-sm flex-shrink-0 mt-0.5">!</div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              Jika usulan berstatus <span className="font-black text-rose-600">Ditolak</span>, klik ikon pensil (<Edit3 size={14} className="inline" />) di baris usulan.
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black text-sm flex-shrink-0 mt-0.5">2</div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              Perbaiki data sesuai catatan verifikasi yang diberikan Operator/Admin.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black text-sm flex-shrink-0 mt-0.5">3</div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              Setelah diperbaiki, kirim ulang usulan. Status akan kembali menjadi <span className="font-black text-amber-600">Pending</span>.
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black text-sm flex-shrink-0 mt-0.5">4</div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              Pantau terus status usulan di halaman Daftar Berkas.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Penggunaan Ruang Diskusi */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all md:col-span-2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                      <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare size={18} /> PENGGUNAAN RUANG DISKUSI
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                          <div className="w-8 h-8 bg-purple-200 dark:bg-purple-800 rounded-lg flex items-center justify-center text-purple-700 dark:text-purple-300 mb-3">
                            <MessageSquare size={16} />
                          </div>
                          <h3 className="font-black text-sm text-purple-800 dark:text-purple-300 mb-2">Tanya Jawab</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Gunakan ruang diskusi di halaman detail usulan untuk bertanya atau klarifikasi dengan Operator/Admin.
                          </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                          <div className="w-8 h-8 bg-purple-200 dark:bg-purple-800 rounded-lg flex items-center justify-center text-purple-700 dark:text-purple-300 mb-3">
                            <History size={16} />
                          </div>
                          <h3 className="font-black text-sm text-purple-800 dark:text-purple-300 mb-2">Riwayat Pesan</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Semua pesan tersimpan dan bisa dilihat kapan saja oleh semua pihak terkait.
                          </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                          <div className="w-8 h-8 bg-purple-200 dark:bg-purple-800 rounded-lg flex items-center justify-center text-purple-700 dark:text-purple-300 mb-3">
                            <CheckCircle size={16} />
                          </div>
                          <h3 className="font-black text-sm text-purple-800 dark:text-purple-300 mb-2">Konfirmasi</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Setelah revisi selesai, beri konfirmasi di ruang diskusi sebelum mengirim ulang.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: Tips & Trik */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all md:col-span-2">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4">
                      <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle size={18} /> TIPS & TRIK UNTUK SKPD
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                          <li>Selalu cek <span className="font-black text-blue-600">status</span> usulan secara berkala</li>
                          <li>Baca <span className="font-black text-blue-600">catatan verifikasi</span> sebelum merevisi</li>
                          <li>Gunakan format penomoran surat yang konsisten</li>
                        </ul>
                        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                          <li>Pastikan file PDF tidak rusak sebelum upload</li>
                          <li>Simpan <span className="font-black text-blue-600">nomor usulan</span> untuk referensi</li>
                          <li>Hubungi operator jika ada kendala teknis</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
            {/* ===== AKHIR PENAMBAHAN ===== */}

                        {/* VIEW: HISTORY LOG */}
            {view === 'logs' && currentUserProfile.level === 'Admin' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">History Log Aktivitas</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Catatan semua aktivitas dalam sistem</p>
                  </div>
                  
                  {/* Filter */}
                  <div className="flex flex-wrap gap-2">
                    <select 
                      value={logFilter}
                      onChange={(e) => setLogFilter(e.target.value)}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300"
                    >
                      <option value="semua">Semua Kategori</option>
                      <option value="auth">Auth</option>
                      <option value="proposal">Usulan</option>
                      <option value="master">Master Data</option>
                      <option value="bank_sro">Bank SRO</option>
                      <option value="bank_catatan">Bank Catatan</option>
                    </select>
                    
                    <input
                      type="date"
                      value={logDateRange.start}
                      onChange={(e) => setLogDateRange({...logDateRange, start: e.target.value})}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="date"
                      value={logDateRange.end}
                      onChange={(e) => setLogDateRange({...logDateRange, end: e.target.value})}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                    />
                    
                    <button
                      onClick={() => {
                        setLogFilter('semua');
                        setLogDateRange({ start: '', end: '' });
                      }}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                
                {/* Tabel Log */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <tr className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          <th className="p-4">Waktu</th>
                          <th className="p-4">User</th>
                          <th className="p-4">Level</th>
                          <th className="p-4">Kategori</th>
                          <th className="p-4">Aksi</th>
                          <th className="p-4">Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {activityLogs
                          .filter(log => {
                            if (logFilter !== 'semua' && log.category !== logFilter) return false;
                            if (logDateRange.start && log.timestamp < logDateRange.start) return false;
                            if (logDateRange.end && log.timestamp > logDateRange.end + 'T23:59:59') return false;
                            return true;
                          })
                          .map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-xs">
                              <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleString('id-ID')}
                              </td>
                              <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                                {log.userName}
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  log.userLevel === 'Admin' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                                  log.userLevel === 'Operator BKAD' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                  log.userLevel === 'SKPD' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                  {log.userLevel}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  log.category === 'auth' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                  log.category === 'proposal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                  log.category === 'bank_sro' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                  log.category === 'bank_catatan' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' :
                                  log.category === 'master' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                  {log.category}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                                  log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                  log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                  log.action === 'DELETE' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                                  log.action === 'UPDATE_STATUS' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                  log.action === 'LOGIN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                  log.action === 'LOGOUT' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                  log.action === 'IMPORT' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                  log.action === 'REGISTER' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="p-4 text-slate-600 dark:text-slate-400">
                                {log.description}
                              </td>
                            </tr>
                          ))}
                          
                        {activityLogs.length === 0 && (
                          <tr>
                            <td colSpan="6" className="p-10 text-center">
                              <History size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                              <p className="text-slate-400 dark:text-slate-500 italic">Belum ada log aktivitas</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Info jumlah log */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>Total log: {activityLogs.length} (menampilkan 100 terbaru)</span>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* ===== AKHIR VIEW HISTORY LOG ===== */}

 {/* ===== VIEW MANAJEMEN STORAGE ===== */}
            {view === 'storage' && currentUserProfile.level === 'Admin' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Manajemen Storage</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor dan backup file penyimpanan</p>
                  </div>
                  <button
                    onClick={checkStorageUsage}
                    disabled={loadingStorage}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase shadow-lg flex items-center gap-2"
                  >
                    <RefreshCw size={14} className={loadingStorage ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>
                
                {/* Statistik Storage */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Database size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Total Storage</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{storageStats.used}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">Terpakai</span>
                        <span className="text-blue-600">{storageStats.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            storageStats.percentage > 90 ? 'bg-rose-500' : 
                            storageStats.percentage > 70 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${storageStats.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-2">
                        Kuota: {storageStats.total} • {storageStats.files || 0} file
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm md:col-span-2">
                    <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 mb-4 uppercase flex items-center gap-2">
                      <Download size={16} /> Backup ke Server Lokal
                    </h3>
                    <div className="space-y-4">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Download semua file untuk backup ke server lokal. File akan di-download dalam format JSON.
                      </p>
                                            <div className="flex gap-3 flex-wrap">
                        {/* Tombol Backup */}
                        <button
                          onClick={backupAllFiles}
                          disabled={backupLoading}
                          className="flex-1 min-w-[150px] px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2"
                        >
                          {backupLoading ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              MEMBACKUP...
                            </>
                          ) : (
                            <>
                              <Download size={14} />
                              BACKUP
                            </>
                          )}
                        </button>
                        
                        {/* ===== TOMBOL UPLOAD RESTORE ===== */}
                        <div className="relative flex-1 min-w-[150px]">
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleRestoreFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={restoreLoading}
                          />
                          <div className={`w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                            restoreLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}>
                            <Upload size={14} />
                            RESTORE
                          </div>
                        </div>
                        {/* ===== AKHIR TOMBOL RESTORE ===== */}
                        
                        <button
                          onClick={() => {
                            if (window.confirm('Hapus semua file yang tidak terhubung dengan usulan?')) {
                              cleanupOrphanFiles();
                            }
                          }}
                          className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs uppercase shadow-lg"
                        >
                          Bersihkan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                                      {/* ===== MODAL PREVIEW RESTORE ===== */}
                      {showRestoreModal && restoreFile && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={() => setShowRestoreModal(false)}>
                          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
                            
                            {/* Header */}
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600">
                              <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <Upload size={18} /> PREVIEW RESTORE
                              </h3>
                            </div>
                            
                            {/* Body */}
                            <div className="flex-grow overflow-y-auto p-6">
                              {restoreLoading ? (
                                <div className="text-center py-8">
                                  <RefreshCw size={32} className="animate-spin mx-auto mb-3 text-blue-500" />
                                  <p className="text-slate-600 dark:text-slate-400">Memproses restore...</p>
                                  <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                    <div 
                                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                      style={{ width: `${restoreProgress}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-2">{Math.round(restoreProgress)}%</p>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                                    File backup: <span className="font-bold">{restoreFile.name}</span>
                                  </p>
                                  
                                  {/* Preview data */}
                                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl mb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Informasi Backup</p>
                                    <div className="space-y-1 text-xs">
                                      <p><span className="font-medium">Nama File:</span> {restoreFile.name}</p>
                                      <p><span className="font-medium">Ukuran:</span> {(restoreFile.size / 1024).toFixed(2)} KB</p>
                                      {/* Data lain akan diisi setelah file dibaca */}
                                    </div>
                                  </div>
                                  
                                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                                    <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                                      <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                                      <span>
                                        <strong>Perhatian:</strong> Proses restore akan mengupload ulang semua file ke storage.
                                        File dengan nama yang sama akan ditimpa. Pastikan Anda memiliki koneksi internet yang stabil.
                                      </span>
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* Footer */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                              <button
                                onClick={() => {
                                  setShowRestoreModal(false);
                                  setRestoreFile(null);
                                  sessionStorage.removeItem('restoreBackupData');
                                }}
                                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase"
                              >
                                Batal
                              </button>
                              <button
                                onClick={processRestore}
                                disabled={restoreLoading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase flex items-center gap-2"
                              >
                                {restoreLoading ? (
                                  <>
                                    <RefreshCw size={14} className="animate-spin" />
                                    MEMULAI...
                                  </>
                                ) : (
                                  'MULAI RESTORE'
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* ===== AKHIR MODAL RESTORE ===== */}

                {/* Detail per Tahun */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                      Detail Penggunaan per Tahun
                    </h3>
                  </div>
                  <div className="p-4">
                    {loadingStorage ? (
                      <div className="text-center py-8">
                        <RefreshCw size={32} className="animate-spin mx-auto mb-3 text-blue-500" />
                        <p className="text-slate-400 italic">Memuat data storage...</p>
                      </div>
                    ) : Object.keys(storageStats.folders).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(storageStats.folders)
                          .sort((a, b) => b[0].localeCompare(a[0]))
                          .map(([year, months]) => {
                            const yearTotal = Object.values(months).reduce((a, b) => a + b, 0);
                            const yearTotalMB = yearTotal / (1024 * 1024);
                            
                            return (
                              <div key={year} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">{year}</h4>
                                  <span className="text-xs font-bold text-blue-600">
                                    {yearTotalMB.toFixed(2)} MB
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {Object.entries(months)
                                    .sort((a, b) => b[0].localeCompare(a[0]))
                                    .map(([month, size]) => {
                                      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
                                      const monthName = monthNames[parseInt(month) - 1] || month;
                                      const monthMB = size / (1024 * 1024);
                                      
                                      return (
                                        <div key={`${year}-${month}`} className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                                          <p className="text-[9px] font-bold text-slate-500">{monthName}</p>
                                          <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                                            {monthMB.toFixed(2)} MB
                                          </p>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <p className="text-center text-slate-400 italic py-8">
                        Belum ada data storage. Klik Refresh untuk memuat.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* ===== AKHIR VIEW MANAJEMEN STORAGE ===== */}

            {/* VIEW: SETTINGS */}
            {view === 'settings' && currentUserProfile.level === 'Admin' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 pb-20">
                <header><h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Pengaturan Master</h1><p className="text-slate-500 dark:text-slate-400 text-sm">Kelola instansi, sub kegiatan, tahap, dan user sistem</p></header>
                <div className="flex border-b border-slate-200 dark:border-slate-700 gap-8 mb-6 overflow-x-auto scrollbar-hide">
                  <button onClick={()=>setSettingsTab('master-skpd')} className={`pb-4 text-[10px] font-black relative whitespace-nowrap uppercase tracking-widest ${settingsTab==='master-skpd'?'text-blue-600 dark:text-blue-400':'text-slate-400'}`}>DATABASE INSTANSI {settingsTab==='master-skpd' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />}</button>
                  <button onClick={()=>setSettingsTab('sub-keg')} className={`pb-4 text-[10px] font-black relative whitespace-nowrap uppercase tracking-widest ${settingsTab==='sub-keg'?'text-blue-600 dark:text-blue-400':'text-slate-400'}`}>DATABASE SUB KEG {settingsTab==='sub-keg' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />}</button>
                  <button onClick={()=>setSettingsTab('tahap')} className={`pb-4 text-[10px] font-black relative whitespace-nowrap uppercase tracking-widest ${settingsTab==='tahap'?'text-blue-600 dark:text-blue-400':'text-slate-400'}`}>TAHAP PENGAJUAN {settingsTab==='tahap' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />}</button>
                  <button onClick={()=>setSettingsTab('tapd')} className={`pb-4 text-[10px] font-black relative whitespace-nowrap uppercase tracking-widest ${settingsTab==='tapd'?'text-blue-600 dark:text-blue-400':'text-slate-400'}`}>TAPD {settingsTab==='tapd' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />}</button>
                  <button onClick={()=>setSettingsTab('users')} className={`pb-4 text-[10px] font-black relative whitespace-nowrap uppercase tracking-widest ${settingsTab==='users'?'text-blue-600 dark:text-blue-400':'text-slate-400'}`}>MANAJEMEN USER {settingsTab==='users' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />}</button>
                  <button onClick={()=>setSettingsTab('tahun')} className={`pb-4 text-[10px] font-black relative whitespace-nowrap uppercase tracking-widest ${settingsTab==='tahun'?'text-blue-600 dark:text-blue-400':'text-slate-400'}`}>
                  <CalendarDays size={14} className="inline mr-1 -mt-0.5"/>TAHUN ANGGARAN {settingsTab==='tahun' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />}
                  </button>
                  {/* ===== TAMBAHKAN TAB BANK SRO ===== */}
                  <button onClick={()=>setSettingsTab('bank_sro')} className={`pb-4 text-[10px] font-black relative whitespace-nowrap uppercase tracking-widest ${settingsTab==='bank_sro'?'text-blue-600 dark:text-blue-400':'text-slate-400'}`}>
                  <Database size={14} className="inline mr-1 -mt-0.5"/>BANK SRO {settingsTab==='bank_sro' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />}
                  </button>
                  {/* ===== AKHIR TAB BANK SRO ===== */}
                  
                  <button onClick={()=>setSettingsTab('branding')} className={`pb-4 text-[10px] font-black relative whitespace-nowrap uppercase tracking-widest ${settingsTab==='branding'?'text-blue-600 dark:text-blue-400':'text-slate-400'}`}><Palette size={14} className="inline mr-1 -mt-0.5"/>KUSTOMISASI {settingsTab==='branding' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />}</button>
                </div>
                
                {/* TAB KUSTOMISASI APLIKASI (BRANDING) */}
                {settingsTab === 'branding' && (
  <div className="space-y-6 animate-in fade-in">
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6">
      <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 mb-6 uppercase flex items-center gap-2 tracking-tighter">
        <Palette size={18} className="text-blue-500"/> Kustomisasi Tampilan Aplikasi
      </h2>
      
      {/* ===== PREVIEW LOGO ===== */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
          {brandingForm.logoUrl ? (
            <img src={brandingForm.logoUrl} alt="Preview" className="w-full h-full object-contain rounded-xl" />
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
      
      {/* ===== UPLOAD LOGO ===== */}
      <div className="mb-6 p-4 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-900/10">
        <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-2 block tracking-widest">
          Upload Logo Aplikasi
        </label>
        <div className="flex gap-2 items-center">
          <div className="relative flex-grow">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setBrandingForm({...brandingForm, logoUrl: ev.target.result});
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full p-3 border border-blue-200 dark:border-blue-800 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="truncate">
                {brandingForm.logoUrl ? 'Logo siap' : 'Pilih file gambar...'}
              </span>
              <Upload size={16} className="text-blue-500" />
            </div>
          </div>
          {brandingForm.logoUrl && (
            <button
              type="button"
              onClick={() => setBrandingForm({...brandingForm, logoUrl: ''})}
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
      
      {/* ===== FORM INPUT YANG ASLI (JANGAN DIHAPUS) ===== */}
      <form onSubmit={handleSaveBranding} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
            Icon Aplikasi (1-2 Huruf)
          </label>
          <input
            required
            maxLength="2"
            value={brandingForm.icon}
            onChange={e=>setBrandingForm({...brandingForm, icon:e.target.value})}
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
            onChange={e=>setBrandingForm({...brandingForm, name1:e.target.value})}
            placeholder="Contoh: ANDA"
            className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none uppercase"
          />
        </div>
        
        <div>
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
            Nama Aplikasi (Bagian 2 / Warna Kontras)
          </label>
          <input
            required
            value={brandingForm.name2}
            onChange={e=>setBrandingForm({...brandingForm, name2:e.target.value})}
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
            onChange={e=>setBrandingForm({...brandingForm, tagline:e.target.value})}
            placeholder="Contoh: Aplikasi Pendataan..."
            className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">
            Sub-Tagline (Nama Instansi / Deskripsi)
          </label>
          <input
            required
            value={brandingForm.subTagline}
            onChange={e=>setBrandingForm({...brandingForm, subTagline:e.target.value})}
            placeholder="Contoh: Badan Keuangan Daerah..."
            className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none"
          />
        </div>
        
        <button
          type="submit"
          className="md:col-span-2 bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:bg-blue-700 active:scale-95 transition-all text-center"
        >
          SIMPAN PERUBAHAN BRANDING
        </button>
      </form>
    </div>
  </div>
)}

                {/* TAB DATABASE SKPD */}
                {settingsTab === 'master-skpd' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 space-y-4">
                      <form onSubmit={handleAddSkpd} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"><h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2"><Building2 size={16}/> Input Instansi</h2><input required value={newSkpd} onChange={e=>setNewSkpd(e.target.value)} placeholder="Nama Instansi..." className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"/><button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold uppercase text-[10px] shadow-lg transition-all active:scale-95">Simpan Instansi</button></form>
                      <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl text-white space-y-4 shadow-xl">
                         <h2 className="text-xs font-black uppercase text-blue-400 tracking-widest flex items-center gap-2"><Upload size={16}/> Impor Massal Instansi</h2>
                         <button onClick={()=>downloadTemplate('skpd')} className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 dark:bg-slate-900 rounded-xl text-[10px] font-black border border-slate-700 hover:bg-slate-700 transition-all uppercase italic"><span>Unduh Template CSV</span><Download size={14}/></button>
                         <div className="relative cursor-pointer"><input type="file" accept=".csv" onChange={(e)=>handleFileUpload(e,'skpd')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/><div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase"><Upload size={16}/> Upload CSV Instansi</div></div>
                      </div>
                    </div>
                    <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[600px] flex flex-col overflow-hidden">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400">Metadata Instansi <span className="bg-blue-600 text-white px-3 py-1 rounded-full">{skpdList.length}</span></div>
                      <div className="overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-2 scrollbar-hide">
                        {skpdList.map(s => (<div key={s.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-bold flex justify-between items-center group hover:border-blue-200 dark:hover:border-blue-600 shadow-sm transition-all text-slate-700 dark:text-slate-200"><span>{String(s.nama || "")}</span><button onClick={()=>setDeleteConfirm({show:true, id:s.id, name:s.nama, type:'SKPD'})} className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 p-1"><Trash2 size={14}/></button></div>))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB DATABASE SUB KEG */}
                {settingsTab === 'sub-keg' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 space-y-4">
                      <form onSubmit={handleAddSubKeg} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"><h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2 tracking-tighter"><Database size={16}/> Input Sub Kegiatan</h2><input required value={newSubKeg} onChange={e=>setNewSubKeg(e.target.value)} placeholder="Nama Sub Kegiatan..." className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"/><button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold uppercase text-[10px] active:scale-95 transition-all">Simpan Sub Keg</button></form>
                      <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl text-white space-y-4 shadow-xl">
                         <h2 className="text-xs font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2"><Upload size={16}/> Impor Masal Sub Keg</h2>
                         <button onClick={()=>downloadTemplate('sub_keg')} className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 dark:bg-slate-900 rounded-xl text-[10px] font-black border border-slate-700 hover:bg-slate-700 transition-all uppercase italic"><span>Template CSV Sub Keg</span><Download size={14}/></button>
                         <div className="relative group cursor-pointer"><input type="file" accept=".csv" onChange={(e)=>handleFileUpload(e,'sub_keg')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/><div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 rounded-xl text-[10px] font-black uppercase"><Upload size={16}/> Upload CSV Sub Keg</div></div>
                      </div>
                    </div>
                    <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[600px] flex flex-col overflow-hidden">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400">Database Sub Kegiatan <span className="bg-emerald-600 text-white px-3 py-1 rounded-full">{subKegList.length}</span></div>
                      <div className="overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-2 scrollbar-hide">
                        {subKegList.map(s => (<div key={s.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-bold flex justify-between items-center group hover:border-emerald-200 dark:hover:border-emerald-600 shadow-sm transition-all text-slate-700 dark:text-slate-200"><span>{String(s.nama || "")}</span><button onClick={()=>setDeleteConfirm({show:true, id:s.id, name:s.nama, type:'Sub Kegiatan'})} className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 p-1"><Trash2 size={14}/></button></div>))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB TAHAP PERGESERAN */}
                {settingsTab === 'tahap' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 space-y-4">
                      <form onSubmit={handleAddTahap} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"><h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2"><Layers size={16}/> Input Tahap Baru</h2><input required value={newTahap} onChange={e=>setNewTahap(e.target.value)} placeholder="Contoh: Pergeseran III" className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"/><button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold uppercase text-[10px] shadow-lg transition-all active:scale-95">Tambah Tahap</button></form>
                      
                      {/* Tombol Buat Tahap Default (Aman jika data kosong) */}
                      {tahapList.length === 0 && (
                          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 shadow-sm">
                              <p className="text-xs text-amber-700 dark:text-amber-400 font-bold mb-3">Database tahap Anda masih kosong! Anda dapat menambahkannya satu persatu di atas, atau klik tombol di bawah untuk membuat tahap default secara otomatis.</p>
                              <button onClick={seedTahapData} disabled={isProcessing} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-md transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
                                  {isProcessing ? 'MEMPROSES...' : <><Database size={14}/> GENERATE TAHAP OTOMATIS</>}
                              </button>
                          </div>
                      )}
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-700 dark:text-blue-300 text-xs italic">
                        Tahapan ini akan muncul pada opsi filter dan form verifikasi Admin/Operator. SKPD tidak dapat memilih tahap ini secara mandiri.
                      </div>
                    </div>
                    <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[600px] flex flex-col overflow-hidden">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400">Daftar Tahapan Aktif <span className="bg-blue-600 text-white px-3 py-1 rounded-full">{tahapList.length}</span></div>
                      <div className="overflow-y-auto p-4 flex flex-col gap-2 scrollbar-hide">
                        {tahapList.map(t => (<div key={t.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-black flex justify-between items-center group hover:border-blue-200 dark:hover:border-blue-600 shadow-sm transition-all text-slate-700 dark:text-slate-200 uppercase tracking-widest"><span>{String(t.nama || "")}</span><button onClick={()=>setDeleteConfirm({show:true, id:t.id, name:t.nama, type:'Tahapan'})} className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 p-1"><Trash2 size={16}/></button></div>))}
                        {tahapList.length === 0 && <p className="text-center text-slate-400 italic text-sm mt-10">Belum ada tahap yang ditambahkan.</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== TAB TAHUN ANGGARAN ===== */}
                {settingsTab === 'tahun' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 space-y-4">
                      <form onSubmit={handleAddTahun} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                        <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2">
                          <CalendarDays size={16} className="text-blue-500"/> Input Tahun Anggaran Baru
                        </h2>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">
                            Tahun (4 digit)
                          </label>
                          <input 
                            required 
                            type="number" 
                            min="2000" 
                            max="2100" 
                            value={newTahun} 
                            onChange={e => setNewTahun(e.target.value)} 
                            placeholder="Contoh: 2024" 
                            className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={isProcessing}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold uppercase text-[10px] shadow-lg transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isProcessing ? 'MENAMBAH...' : 'TAMBAH TAHUN ANGGARAN'}
                        </button>
                      </form>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-700 dark:text-blue-300 text-xs italic">
                        <CalendarDays size={14} className="inline mr-1" />
                        Tahun anggaran yang ditambahkan akan muncul di dropdown filter pada halaman Dashboard dan Daftar Berkas.
                      </div>

                      {/* Tombol Generate Tahun Default (Opsional) */}
                      {tahunList.length === 0 && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 shadow-sm">
                          <p className="text-xs text-amber-700 dark:text-amber-400 font-bold mb-3">
                            Database tahun masih kosong! Klik tombol di bawah untuk membuat tahun default (2024-2026).
                          </p>
                          <button 
                            onClick={async () => {
                              if (!user) return;
                              setIsProcessing(true);
                              try {
                                const tahunDefault = ['2024', '2025', '2026'];
                                for (const thn of tahunDefault) {
                                  await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tahun_anggaran'), { 
                                    tahun: thn,
                                    nama: thn,
                                    createdAt: new Date().toISOString(),
                                    createdBy: currentUserProfile.nama
                                  });
                                }
                                addNotification("Tahun default berhasil ditambahkan", "success");
                              } catch (err) {
                                console.error(err);
                                addNotification(`Gagal: ${err.message}`, "error");
                              } finally {
                                setIsProcessing(false);
                              }
                            }} 
                            disabled={isProcessing} 
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-md transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
                          >
                            {isProcessing ? 'MEMPROSES...' : <><CalendarDays size={14}/> GENERATE TAHUN DEFAULT</>}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[600px] flex flex-col overflow-hidden">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
                        Daftar Tahun Anggaran Aktif 
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full">{tahunList.length}</span>
                      </div>
                      <div className="overflow-y-auto p-4 flex flex-col gap-2 scrollbar-hide">
                        {tahunList.length > 0 ? (
                          tahunList.map(t => (
                            <div key={t.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-black flex justify-between items-center group hover:border-blue-200 dark:hover:border-blue-600 shadow-sm transition-all text-slate-700 dark:text-slate-200">
                              <span className="flex items-center gap-2">
                                <CalendarDays size={16} className="text-blue-500" />
                                {t.tahun || t.nama}
                              </span>
                              <button 
                                onClick={() => handleHapusTahun(t.id, t.tahun || t.nama)} 
                                className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                                title="Hapus Tahun"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-slate-400 italic text-sm mt-10">
                            Belum ada tahun anggaran yang ditambahkan.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* ===== AKHIR TAB TAHUN ANGGARAN ===== */}

                  {/* ===== TAB BANK SRO ===== */}
                {settingsTab === 'bank_sro' && (
                  <div className="space-y-6 animate-in fade-in">
                    {/* Header dengan tombol download template */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2 tracking-tighter">
                          <Database size={18} className="text-blue-500"/> BANK DATA KODE REKENING & SRO
                        </h2>
                        <div className="flex gap-2">
                          <button onClick={downloadTemplateSro} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 flex items-center gap-2"><Download size={14}/>TEMPLATE</button>
                          <div className="relative group"><input type="file" accept=".csv" onChange={handleImportSro} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/><div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"><Upload size={14}/>IMPORT CSV</div><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">⚡ 250 data/batch, 0.8s delay</div></div>
                        </div>
                      </div>
                      
                      {/* Informasi Format CSV */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium flex items-start gap-2">
                          <Info size={16} className="flex-shrink-0 mt-0.5" />
                          <span><strong>Format CSV:</strong> Gunakan titik koma (;) sebagai pemisah. Kolom 1: KODE REKENING, Kolom 2: URAIAN</span>
                        </p>
                      </div>
                    </div>

                    {/* ===== PROGRESS BAR IMPORT ===== */}
                    {importProgress.show && <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 shadow-sm mb-6 animate-pulse">
                      <div className="flex justify-between items-center mb-3"><h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Database size={16}/>PROGRESS</h3><span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{importProgress.current}/{importProgress.total}</span></div>
                      <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden mb-3"><div className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white" style={{width:`${importProgress.total>0?(importProgress.current/importProgress.total)*100:0}%`}}>{importProgress.total>0&&importProgress.current>0&&`${Math.round((importProgress.current/importProgress.total)*100)}%`}</div></div>
                      <p className="text-xs text-slate-600 flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>{importProgress.status}</p>
                      <div className="mt-3 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg"><p>✅ {importProgress.successCount||0} berhasil • ❌ {importProgress.errorCount||0} gagal</p></div>
                    </div>}
                    {/* ===== AKHIR PROGRESS BAR ===== */}

                    {/* Form Tambah SRO Manual */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6">
                      <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-widest flex items-center gap-2"><Plus size={16} className="text-emerald-500" /> TAMBAH DATA SRO MANUAL</h3>
                      <form onSubmit={handleTambahSro} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">Kode Rekening <span className="text-rose-500">*</span></label><input required value={newSro.kode} onChange={(e) => setNewSro({...newSro, kode: e.target.value})} placeholder="Contoh: 5.1.02.01.00001" className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-mono outline-none focus:ring-2 focus:ring-blue-500" /></div>
                        <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">Uraian Sub Rincian Objek <span className="text-rose-500">*</span></label><input required value={newSro.uraian} onChange={(e) => setNewSro({...newSro, uraian: e.target.value})} placeholder="Contoh: Belanja Alat Tulis Kantor" className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" /></div>
                        <button type="submit" disabled={isProcessing} className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">{isProcessing ? 'MENYIMPAN...' : <><Plus size={16} /> TAMBAH DATA SRO</>}</button>
                      </form>
                    </div>

                    {/* Search Filter */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6">
                      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" value={filterBankSro} onChange={(e) => setFilterBankSro(e.target.value)} placeholder="Cari berdasarkan kode rekening atau uraian..." className="pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-full outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" /></div>
                    </div>

                    {/* ===== TABEL BANK SRO DENGAN PAGINATION ===== */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col mb-10">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-4">
                          <span>📋 Daftar Kode Rekening & SRO</span>
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px]">{filteredBankSro.length} Data (Ditampilkan {paginatedBankSro.length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* ===== TOMBOL HAPUS SEMUA DATA ===== */}
    {bankSro.length > 0 && (
      <button
        onClick={() => {
          setDeleteConfirm({
            show: true,
            id: 'all',
            name: 'SEMUA DATA SRO',
            type: 'AllSRO'
          });
        }}
        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm mr-2"
        title="Hapus Semua Data SRO"
      >
        <Trash2 size={14} />
        HAPUS SEMUA ({bankSro.length})
      </button>
    )}
    {/* ===== AKHIR TOMBOL HAPUS SEMUA ===== */}
                          
                          <span className="text-[9px]">Tampil:</span>
                          <select value={sroItemsPerPage} onChange={(e) => { setSroItemsPerPage(parseInt(e.target.value)); setSroCurrentPage(1); }} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded p-1 text-[10px] outline-none text-blue-600 dark:text-blue-400 font-black">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                            <tr><th className="p-4">Kode Rekening</th><th className="p-4">Uraian SRO</th><th className="p-4 text-center" style={{ width: '100px' }}>Aksi</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {paginatedBankSro.length > 0 ? paginatedBankSro.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                                {editingSro.id === item.id ? (
                                  <>
                                    <td className="p-4"><input type="text" value={editingSro.kode} onChange={(e) => setEditingSro({...editingSro, kode: e.target.value})} className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg font-mono" placeholder="Kode" /></td>
                                    <td className="p-4"><input type="text" value={editingSro.uraian} onChange={(e) => setEditingSro({...editingSro, uraian: e.target.value})} className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg" placeholder="Uraian" /></td>
                                    <td className="p-4 text-center"><div className="flex justify-center gap-2"><button onClick={() => setEditingSro({ id: null, kode: '', uraian: '' })} className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"><X size={14} /></button><button onClick={handleEditSro} disabled={isProcessing} className="p-1.5 bg-emerald-600 text-white rounded-lg"><CheckCircle size={14} /></button></div></td>
                                  </>
                                ) : (
                                  <>
                                    <td className="p-4 font-mono text-sm text-slate-800 dark:text-slate-200">{item.kode}</td>
                                    <td className="p-4 text-sm text-slate-700 dark:text-slate-300">{item.uraian}</td>
                                    <td className="p-4 text-center"><div className="flex justify-center gap-2"><button onClick={() => setEditingSro({ id: item.id, kode: item.kode, uraian: item.uraian })} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg"><Edit3 size={14} /></button><button onClick={() => handleHapusSro(item.id, item.kode)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg"><Trash2 size={14} /></button></div></td>
                                  </>
                                )}
                              </tr>
                            )) : (
                              <tr><td colSpan="3" className="p-10 text-center"><Database size={40} className="text-slate-300 mx-auto mb-2"/><p className="text-slate-400 italic">{filterBankSro ? 'Tidak ada data yang cocok' : 'Belum ada data SRO'}</p></td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {filteredBankSro.length > 0 && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                          <span className="text-xs text-slate-500">Halaman {sroCurrentPage} dari {totalSroPages}</span>
                          <div className="flex gap-2">
                            <button disabled={sroCurrentPage === 1} onClick={() => setSroCurrentPage(p => p - 1)} className="p-2 bg-white dark:bg-slate-700 border rounded disabled:opacity-30"><ChevronLeft size={14} /></button>
                            <button disabled={sroCurrentPage === totalSroPages} onClick={() => setSroCurrentPage(p => p + 1)} className="p-2 bg-white dark:bg-slate-700 border rounded disabled:opacity-30"><ChevronRight size={14} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* ===== AKHIR TABEL BANK SRO DENGAN PAGINATION ===== */}

                  </div>
                )}      {/* <-- TUTUP KONDISI settingsTab === 'bank_sro' */}
                {/* ===== AKHIR TAB BANK SRO ===== */}

                {/* TAB TIM TAPD */}
                {settingsTab === 'tapd' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 space-y-4">
                      <form onSubmit={handleAddTapd} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                        <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2 mb-2"><Users size={16} className="text-blue-500"/> Input Anggota TAPD</h2>
                        <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">NIP / ID</label><input required value={newTapd.nip} onChange={e=>setNewTapd({...newTapd, nip: e.target.value})} placeholder="Contoh: 198001012005011001" className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                        <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">Nama Lengkap</label><input required value={newTapd.nama} onChange={e=>setNewTapd({...newTapd, nama: e.target.value})} placeholder="Nama Pejabat beserta Gelar..." className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                        <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">Jabatan</label><input required value={newTapd.jabatan} onChange={e=>setNewTapd({...newTapd, jabatan: e.target.value})} placeholder="Contoh: KEPALA DINAS" className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"/></div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold uppercase text-[10px] shadow-lg transition-all active:scale-95">Tambah Tim</button>
                      </form>
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs italic">
                        Nama-nama ini akan secara otomatis muncul sebagai kolom tanda tangan verifikator pada form cetak Berita Acara (PDF) berkas.
                      </div>
                    </div>
                    <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[600px] flex flex-col overflow-hidden">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400">Susunan TAPD <span className="bg-blue-600 text-white px-3 py-1 rounded-full">{tapdList.length}</span></div>
                      <div className="overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
                        {tapdList.map(t => (
                          <div key={t.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex justify-between items-start group hover:border-blue-200 dark:hover:border-blue-600 shadow-sm transition-all">
                            <div>
                                <p className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase">{String(t.nama)}</p>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">NIP: {String(t.nip)}</p>
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded inline-block">{String(t.jabatan)}</p>
                            </div>
                            <button onClick={()=>setDeleteConfirm({show:true, id:t.id, name:t.nama, type:'TAPD'})} className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 p-1"><Trash2 size={16}/></button>
                          </div>
                        ))}
                        {tapdList.length === 0 && <p className="text-center text-slate-400 italic text-sm mt-10">Belum ada tim yang didaftarkan.</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB MANAJEMEN USER */}
                {settingsTab === 'users' && (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6">
                      <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 mb-6 uppercase flex items-center gap-2 tracking-tighter"><UserPlus size={18} className="text-blue-500"/> Registrasi User Baru</h2>
                      <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">Nama User / Email</label><input required value={newUser.nama} onChange={e=>setNewUser({...newUser, nama:e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-500" /></div>
                        <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">UID Firebase</label><input required value={newUser.uid} onChange={e=>setNewUser({...newUser, uid:e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none" /></div>
                        <div><label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">Level</label><select value={newUser.level} onChange={e=>setNewUser({...newUser, level:e.target.value, skpdId:'', assignedSkpds:[]})} className="w-full p-3 border rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 font-bold outline-none"><option value="SKPD">SKPD / Instansi</option><option value="Operator BKAD">OPERATOR</option><option value="Admin">ADMIN</option><option value="TAPD">VIEWER / VERIFIKATOR</option></select></div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block tracking-widest">Scope</label>
                          {newUser.level === 'SKPD' ? (
                            <select value={newUser.skpdId} onChange={e=>setNewUser({...newUser, skpdId: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-slate-200 dark:border-slate-700 font-bold outline-none"><option value="">Pilih Instansi...</option>{skpdList.map(s => <option key={s.id} value={s.id}>{String(s.nama)}</option>)}</select>
                          ) : newUser.level === 'Operator BKAD' ? (
                            <div className="relative group cursor-pointer"><button type="button" className="w-full p-3 border rounded-xl text-sm bg-white dark:bg-slate-900 flex justify-between items-center text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-bold shadow-sm">{newUser.assignedSkpds?.length || 0} Pilih <ChevronRight size={14} className="rotate-90 text-slate-400"/></button>
                            <div className="absolute top-full left-0 w-64 max-h-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl z-50 hidden group-focus-within:block overflow-y-auto p-4 scrollbar-hide">
                              <button type="button" onClick={()=>{ if(newUser.assignedSkpds.length===skpdList.length) setNewUser({...newUser, assignedSkpds:[]}); else setNewUser({...newUser, assignedSkpds:skpdList.map(x=>x.id)}); }} className="w-full text-left p-2 text-[10px] font-black text-blue-600 dark:text-blue-400 mb-2 border-b dark:border-slate-700 uppercase tracking-tighter">Pilih Semua Instansi</button>
                              {skpdList.map(s => (<label key={s.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-[10px] font-bold cursor-pointer transition-colors text-slate-600 dark:text-slate-300 uppercase tracking-tighter"><input type="checkbox" checked={newUser.assignedSkpds?.includes(s.id)} onChange={()=>{ const curr = newUser.assignedSkpds; if(curr.includes(s.id)) setNewUser({...newUser, assignedSkpds: curr.filter(x=>x!==s.id)}); else setNewUser({...newUser, assignedSkpds:[...curr, s.id]}); }} className="rounded text-blue-600 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" /><span>{String(s.nama)}</span></label>))}
                            </div></div>
                          ) : newUser.level === 'TAPD' ? (
                            <div className="p-3 bg-slate-100 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 rounded-xl text-[10px] font-black text-center border uppercase border-slate-200 dark:border-slate-700 italic tracking-widest">Akses Global (Viewer)</div>
                          ) : (
                            <div className="p-3 bg-slate-100 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 rounded-xl text-[10px] font-black text-center border uppercase border-slate-200 dark:border-slate-700 italic tracking-widest">Akses Admin (Global)</div>
                          )}
                        </div>
                        <button type="submit" className="md:col-span-4 bg-emerald-600 text-white p-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:bg-emerald-700 active:scale-95 transition-all text-center">SIMPAN USER KE FIREBASE</button>
                      </form>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-grow mb-10">
                      <table className="w-full text-left text-sm"><thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest"><tr><th className="p-4">Nama User / Email</th><th className="p-4 text-center">Akses</th><th className="p-4 text-center">Scope</th><th className="p-4 text-center">Action</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {usersList.map(u => (<tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"><td className="p-4 font-black text-slate-800 dark:text-slate-200">{String(u.nama || "User")}</td><td className="p-4 text-center"><span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${u.level === 'Admin' ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50' : u.level === 'TAPD' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50' : u.level === 'Operator BKAD' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50'}`}>{String(u.level || "")}</span></td><td className="p-4 text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center uppercase tracking-tighter">{u.level === 'Admin' ? 'Global Admin' : u.level === 'TAPD' ? 'Viewer Global' : u.level === 'SKPD' ? (skpdList.find(s=>s.id===u.skpdId)?.nama || "N/A") : `${u.assignedSkpds?.length || 0} Instansi`}</td><td className="p-4 text-center"><button onClick={()=>setDeleteConfirm({show:true, id:u.id, name:u.nama, type:'User'})} className="text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 transition-all p-1"><Trash2 size={16}/></button></td></tr>))}
                      </tbody></table>
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>

        {/* 5. POP-UP ALERTS (Notifications) */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-2 max-w-[calc(100vw-3rem)] pointer-events-none">
          {notifications.map(n => (
            <div key={n.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl border animate-in slide-in-from-top-full fade-in backdrop-blur-md ${n.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-rose-600 text-white border-rose-500'}`}>
              {n.type === 'success' ? <CheckCircle size={20} className="flex-shrink-0" /> : <AlertTriangle size={20} className="flex-shrink-0" />}
              <p className="text-xs font-black truncate tracking-tighter uppercase text-white">{String(n.message || "")}</p>
              <button onClick={() => removeNotification(n.id)} className="ml-2 opacity-60 hover:opacity-100 text-white"><X size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;