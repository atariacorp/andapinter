import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, appId } from '../utils/firebase';

export const useMasterData = (user) => {
  const [skpdList, setSkpdList] = useState([]);
  const [subKegList, setSubKegList] = useState([]);
  const [tahapList, setTahapList] = useState([]);
  const [tapdList, setTapdList] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [bankCatatan, setBankCatatan] = useState([]);
  const [bankSro, setBankSro] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branding, setBranding] = useState({});
  const [brandingForm, setBrandingForm] = useState({});

  useEffect(() => {
    if (!user) return;

    const handlePermissionError = (err) => {
      console.error("Firestore Permission Error:", err);
    };

    // SKPD Listener
    const unsubSkpd = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'skpds'), 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setSkpdList(list.sort((a, b) => String(a.nama || "").localeCompare(String(b.nama || ""))));
      }, 
      handlePermissionError
    );

    // Sub Kegiatan Listener
    const unsubSubKeg = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'sub_kegiatans'), 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setSubKegList(list.sort((a, b) => String(a.nama || "").localeCompare(String(b.nama || ""))));
      }, 
      handlePermissionError
    );

    // Users Listener
    const unsubUsers = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'users'), 
      (snapshot) => {
        setUsersList(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      }, 
      handlePermissionError
    );

    // Tahap Listener
    const unsubTahap = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'tahapan'), 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTahapList(list.sort((a, b) => String(a.nama || "").localeCompare(String(b.nama || ""))));
      }, 
      handlePermissionError
    );

    // TAPD Listener
    const unsubTapd = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'tapd'), 
      (snapshot) => {
        setTapdList(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      }, 
      handlePermissionError
    );

    // Tahun Anggaran Listener
    const unsubTahun = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'tahun_anggaran'), 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTahunList(list.sort((a, b) => String(b.tahun || b.nama || "").localeCompare(String(a.tahun || a.nama || ""))));
      }, 
      handlePermissionError
    );

    // Bank Catatan Listener
    const unsubBankCatatan = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'bank_catatan'), 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBankCatatan(list.sort((a, b) => String(a.judul || "").localeCompare(String(b.judul || ""))));
      }, 
      handlePermissionError
    );

    // Bank SRO Listener
    const unsubBankSro = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'bank_sro'), 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBankSro(list.sort((a, b) => String(a.kode || "").localeCompare(String(b.kode || ""))));
        setLoading(false);
      }, 
      handlePermissionError
    );

    // Branding Listener
    const unsubBranding = onSnapshot(
      doc(db, 'artifacts', appId, 'public', 'data', 'config', 'app_branding'),
      (docSnap) => {
        if (docSnap.exists()) {
          setBranding(docSnap.data());
          setBrandingForm(docSnap.data());
        }
      },
      handlePermissionError
    );

    return () => { 
      unsubSkpd(); 
      unsubSubKeg(); 
      unsubUsers(); 
      unsubTahap(); 
      unsubTapd(); 
      unsubTahun();
      unsubBankCatatan(); 
      unsubBankSro();
      unsubBranding();
    };
  }, [user]);

  // CRUD Operations
  const addSkpd = async (nama) => {
    if (!nama.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'skpds'), { 
      nama: nama.trim(), 
      createdAt: new Date().toISOString() 
    });
  };

  const addSubKeg = async (nama) => {
    if (!nama.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'sub_kegiatans'), { 
      nama: nama.trim(), 
      createdAt: new Date().toISOString() 
    });
  };

  const addTahap = async (nama) => {
    if (!nama.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tahapan'), { 
      nama: nama.trim(), 
      createdAt: new Date().toISOString() 
    });
  };

  const addTahun = async (tahun, createdBy) => {
    if (!tahun.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tahun_anggaran'), { 
      tahun: tahun.trim(),
      nama: tahun.trim(),
      createdAt: new Date().toISOString(),
      createdBy
    });
  };

  const addTapd = async (data) => {
    if (!data.nama.trim() || !data.nip.trim() || !data.jabatan.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tapd'), { 
      ...data, 
      createdAt: new Date().toISOString() 
    });
  };

  const addUser = async (data) => {
    if (!data.nama.trim() || !data.uid.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'users'), { 
      ...data, 
      createdAt: new Date().toISOString() 
    });
  };

  const addBankCatatan = async (judul, isi, createdBy) => {
    if (!judul.trim() || !isi.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'bank_catatan'), {
      judul: judul.trim(),
      isi: isi.trim(),
      createdAt: new Date().toISOString(),
      createdBy
    });
  };

  const addBankSro = async (kode, uraian, createdBy) => {
    if (!kode.trim() || !uraian.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'bank_sro'), {
      kode: kode.trim(),
      uraian: uraian.trim(),
      createdAt: new Date().toISOString(),
      createdBy
    });
  };

  const deleteItem = async (type, id) => {
    if (!user || !id) return;
    
    const collections = {
      SKPD: 'skpds',
      'Sub Kegiatan': 'sub_kegiatans',
      Tahapan: 'tahapan',
      TahunAnggaran: 'tahun_anggaran',
      TAPD: 'tapd',
      User: 'users',
      Catatan: 'bank_catatan',
      SRO: 'bank_sro'
    };

    const colName = collections[type];
    if (colName) {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', colName, String(id)));
    }
  };

  const saveBranding = async (data) => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'app_branding');
    await setDoc(docRef, data);
    setBranding(data);
    setBrandingForm(data);
  };

  const importSroBatch = async (data, batchSize = 250, delay = 800) => {
    const batches = Math.ceil(data.length / batchSize);
    let success = 0;
    const errors = [];

    for (let b = 0; b < batches; b++) {
      const start = b * batchSize;
      const end = Math.min(start + batchSize, data.length);
      const batchData = data.slice(start, end);
      
      try {
        const batch = writeBatch(db);
        batchData.forEach(item => {
          const docRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'bank_sro'));
          batch.set(docRef, item);
        });
        await batch.commit();
        success += batchData.length;
        
        if (b < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (err) {
        errors.push(`Batch ${b+1}: ${err.message}`);
      }
    }

    return { success, errors };
  };

  return {
    // States
    skpdList,
    subKegList,
    tahapList,
    tapdList,
    tahunList,
    usersList,
    bankCatatan,
    bankSro,
    branding,
    brandingForm,
    loading,
    
    // CRUD Operations
    addSkpd,
    addSubKeg,
    addTahap,
    addTahun,
    addTapd,
    addUser,
    addBankCatatan,
    addBankSro,
    deleteItem,
    saveBranding,
    setBrandingForm,
    importSroBatch
  };
};