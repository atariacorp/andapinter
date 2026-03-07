import React, { useState, useEffect } from 'react';
import {
  FileText, Info, Layers, XCircle, MessageSquare,
  CheckCircle, Edit3, Download, Upload, Users,
  BookOpen, AlertTriangle, FileCheck, Clock,
  Database, Calendar, Building2, FileSpreadsheet,
  Printer, Search, Filter, ChevronRight, Sparkles,
  LifeBuoy, Mail, Phone, Smartphone,
  BarChart2, TrendingUp, DollarSign, Activity, History, Bell  // <-- TAMBAHKAN IMPORT INI
} from 'lucide-react';

// --- Komponen Partikel Emas Mengambang ---
const FloatingGoldParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles on mount to avoid hydration mismatch
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDuration: Math.random() * 15 + 15, // 15-30s
      animationDelay: Math.random() * -20, // Start at different times
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 mix-blend-screen dark:mix-blend-color-dodge">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#d7a217] animate-float-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.animationDelay}s`,
            boxShadow: `0 0 ${p.size * 2}px #d7a217`,
          }}
        />
      ))}
    </div>
  );
};

const PanduanView = ({ branding = { name1: 'SIM', name2: 'ONALISA', tagline: 'Sistem Monitoring Analisa Anggaran' } }) => {
  
  // --- Data Konten ---
  const panduanSections = [
    {
      title: 'ATURAN PMDN 77',
      icon: <Info size={22} />,
      items: [
        { number: 1, text: 'Rincian SRO: Pastikan setiap pergeseran anggaran mencantumkan kode rekening dan uraian Sub Rincian Objek (SRO) yang valid.', highlight: 'Kode rekening harus sesuai dengan format yang ditentukan' },
        { number: 2, text: 'Dokumen Pendukung: Upload file PDF dengan ukuran maksimal 2MB. Dokumen harus jelas dan terbaca.', highlight: 'Format: PDF, JPG, PNG. Maksimal 2MB' },
        { number: 3, text: 'Alasan Pergeseran: Uraikan secara detail alasan pemindahan anggaran antar SRO.', highlight: 'Alasan harus logis dan dapat dipertanggungjawabkan' }
      ]
    },
    {
      title: 'ALUR PENGAJUAN',
      icon: <Layers size={22} />,
      items: [
        { number: 1, text: 'Buat Usulan: Klik tombol "TAMBAH USULAN" dan isi semua data yang diperlukan.', highlight: 'Pastikan semua field terisi lengkap' },
        { number: 2, text: 'Status Pending: Usulan masuk ke antrian verifikasi Operator BKAD.', highlight: 'Status akan berubah menjadi "Pending"' },
        { number: 3, text: 'Verifikasi Operator: Operator akan memeriksa kelengkapan dokumen.', highlight: 'Operator dapat memberikan catatan jika ada revisi' },
        { number: 4, text: 'Finalisasi Admin: Admin memberikan persetujuan akhir atau penolakan.', highlight: 'Jika disetujui, status menjadi "Disetujui"' }
      ]
    },
    {
      title: 'MERESPON REVISI',
      icon: <XCircle size={22} />,
      items: [
        { number: 1, text: 'Jika usulan berstatus "Ditolak", klik ikon pensil (Edit) di baris usulan.', highlight: 'Ikon pensil hanya muncul untuk status Ditolak' },
        { number: 2, text: 'Perbaiki data sesuai catatan verifikasi yang diberikan Operator/Admin.', highlight: 'Baca catatan dengan seksama' },
        { number: 3, text: 'Setelah diperbaiki, kirim ulang usulan. Status akan kembali menjadi "Pending".', highlight: 'Pastikan semua perbaikan sudah dilakukan' },
        { number: 4, text: 'Pantau terus status usulan di halaman Daftar Berkas.', highlight: 'Gunakan fitur filter untuk memudahkan pencarian' }
      ]
    },
    {
      title: 'RUANG DISKUSI',
      icon: <MessageSquare size={22} />,
      items: [
        { number: 1, text: 'Gunakan ruang diskusi di halaman detail usulan untuk bertanya atau klarifikasi.', highlight: 'Terbuka untuk Operator dan Admin' },
        { number: 2, text: 'Semua pesan tersimpan dan bisa dilihat kapan saja oleh semua pihak terkait.', highlight: 'Riwayat diskusi tidak akan hilang' },
        { number: 3, text: 'Setelah revisi selesai, beri konfirmasi di ruang diskusi sebelum mengirim ulang.', highlight: 'Membantu mempercepat proses verifikasi' }
      ]
    },
    // ===== SECTION BARU: FITUR DASHBOARD ANALISIS =====
    {
      title: 'FITUR DASHBOARD ANALISIS',
      icon: <BarChart2 size={22} />,
      items: [
        { 
          number: 1, 
          text: 'Grafik Tren Bulanan: Menampilkan visualisasi data usulan 6 bulan terakhir dengan pembagian status Disetujui (hijau), Berjalan (emas), dan Ditolak (merah).', 
          highlight: 'Data real-time berdasarkan filter tahun yang dipilih' 
        },
        { 
          number: 2, 
          text: 'Ringkasan Anggaran: Menampilkan total pagu diajukan, disetujui, persentase, dan sisa anggaran dalam bentuk progress circle.', 
          highlight: 'Memudahkan monitoring realisasi anggaran' 
        },
        { 
          number: 3, 
          text: 'Aktivitas Terbaru: Menampilkan 5 aktivitas terbaru di sistem beserta waktu relatif (baru saja, X menit lalu, dll).', 
          highlight: 'Klik untuk langsung menuju detail usulan' 
        },
        { 
          number: 4, 
          text: 'Kalender Deadline: Menampilkan deadline usulan dalam bentuk kalender interaktif dengan kode warna (merah: mendesak, emas: mendekati deadline).', 
          highlight: 'Lihat usulan per tanggal dengan mengklik tanggal' 
        },
        { 
          number: 5, 
          text: 'Export Laporan: Fitur export data ke format Excel (CSV) dengan opsi filter tanggal dan detail rincian SRO.', 
          highlight: 'Akses melalui tombol "Export Laporan" di Quick Actions Panel' 
        },
        { 
          number: 6, 
          text: 'Notifikasi Real-time: Sistem notifikasi dengan suara, browser push, dan filter berdasarkan jenis (semua, belum dibaca, sukses, peringatan, error).', 
          highlight: 'Ikon lonceng akan menampilkan jumlah notifikasi belum dibaca' 
        },
        { 
          number: 7, 
          text: 'History Versi Usulan: Melihat seluruh riwayat perubahan usulan dari waktu ke waktu, termasuk siapa yang mengubah dan kapan.', 
          highlight: 'Akses melalui tombol "RIWAYAT" di halaman detail usulan' 
        }
      ]
    }
  ];

  const tipsTrik = [
    { icon: <Search size={20} />, title: 'Pencarian Cepat', description: 'Gunakan pencarian untuk menemukan usulan berdasarkan nomor surat.' },
    { icon: <Filter size={20} />, title: 'Filter Data', description: 'Manfaatkan filter tahun, tahap, dan status untuk menyaring data.' },
    { icon: <FileSpreadsheet size={20} />, title: 'Ekspor Excel', description: 'Ekspor data ke CSV untuk keperluan pelaporan atau analisis lanjut.' },
    { icon: <Printer size={20} />, title: 'Cetak Berita Acara', description: 'Setelah disetujui, cetak untuk menghasilkan Berita Acara resmi.' },
    { icon: <Database size={20} />, title: 'Bank Data SRO', description: 'Gunakan bank data SRO untuk memilih kode rekening terdaftar.' },
    { icon: <Clock size={20} />, title: 'Pantau Status', description: 'Selalu pantau perubahan status usulan di dashboard utama.' }
  ];

  const faqItems = [
    { question: 'Bagaimana cara mendapatkan UID Firebase?', answer: 'UID Firebase dapat dilihat di Firebase Console -> Authentication -> Users. Copy UID user yang bersangkutan.' },
    { question: 'Apa yang harus dilakukan jika lupa password?', answer: 'Klik "Lupa Password" di halaman login, masukkan email, dan ikuti instruksi yang dikirim.' },
    { question: 'Mengapa usulan saya ditolak?', answer: 'Cek catatan verifikasi di halaman detail usulan. Biasanya penolakan karena data tidak lengkap.' },
    { question: 'Bisakah mengubah data usulan yang disetujui?', answer: 'Usulan disetujui tidak dapat diubah. Hubungi Admin untuk membuat revisi resmi.' },
    { question: 'Apakah lampiran bisa diganti setelah dikirim?', answer: 'Ya, selama status masih Pending atau Ditolak, Anda dapat mengedit usulan.' },
    { question: 'Apa itu notifikasi real-time?', answer: 'Sistem akan memberitahu Anda secara langsung melalui suara dan pop-up browser ketika ada usulan baru, perubahan status, atau komentar baru.' },
    { question: 'Bagaimana cara melihat history versi usulan?', answer: 'Buka halaman detail usulan, lalu klik tombol "RIWAYAT" di samping tombol CETAK BA untuk melihat seluruh riwayat perubahan.' },
    { question: 'Bagaimana cara mengatur durasi deadline?', answer: 'Admin dapat mengatur durasi deadline (dalam hari) dan warna-warna deadline di menu Pengaturan Master → Tab Kustomisasi. Durasi default adalah 7 hari.' }
  ];

  // --- Konstanta Desain ---
  const glassCardClasses = "bg-white/60 dark:bg-[#3c5654]/40 backdrop-blur-xl border border-[#cadfdf]/80 dark:border-[#cadfdf]/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgba(215,162,23,0.15)] dark:hover:shadow-[0_8px_30px_rgba(215,162,23,0.15)] relative z-10";
  const goldTextAccent = "text-[#d7a217]";
  const goldBgAccent = "bg-[#d7a217]";

  return (
    <div className="min-h-screen bg-[#e2eceb] dark:bg-[#425c5a] text-[#3c5654] dark:text-[#e2eceb] transition-colors duration-500 font-sans relative overflow-x-hidden">
      
      {/* Background Effect & Particles */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#d7a217]/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-[#3c5654]/20 dark:bg-[#e2eceb]/5 rounded-full blur-[100px]"></div>
      </div>
      <FloatingGoldParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-12 animate-in fade-in duration-700">
        
        {/* Header Parallax Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-3xl bg-gradient-to-br from-white/80 to-[#cadfdf]/50 dark:from-[#3c5654]/80 dark:to-[#425c5a]/80 backdrop-blur-md border border-white/50 dark:border-[#cadfdf]/20 shadow-xl group transform transition-transform duration-700 hover:scale-[1.01]">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden bg-gradient-to-br from-[#425c5a] to-[#3c5654] dark:from-[#cadfdf]/10 dark:to-[#cadfdf]/5 border border-[#d7a217]/30`}>
            <div className="absolute inset-0 bg-[#d7a217]/20 blur-md group-hover:bg-[#d7a217]/40 transition-colors duration-500"></div>
            <BookOpen size={36} className="text-[#d7a217] relative z-10" />
          </div>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d7a217]/10 border border-[#d7a217]/30 mb-3">
              <Sparkles size={14} className={goldTextAccent} />
              <span className="text-xs font-bold uppercase tracking-widest text-[#d7a217]">Pusat Informasi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-[#425c5a] dark:text-white drop-shadow-sm">
              PANDUAN SISTEM
            </h1>
            <p className="text-lg font-medium opacity-80">
              {branding.name1}<span className={goldTextAccent}>{branding.name2}</span> — {branding.tagline}
            </p>
          </div>
        </div>

        {/* Grid Panduan Utama (Glassmorphism & Hover Parallax) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {panduanSections.map((section, idx) => (
            <div key={idx} className={`${glassCardClasses} group hover:-translate-y-2`}>
              {/* Header Card */}
              <div className="px-6 py-5 border-b border-[#cadfdf]/50 dark:border-[#cadfdf]/10 bg-white/40 dark:bg-black/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d7a217]/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-3 text-[#425c5a] dark:text-[#cadfdf]">
                  <span className={`p-2 rounded-lg bg-[#425c5a] dark:bg-[#cadfdf]/10 text-[#d7a217] shadow-sm`}>
                    {section.icon}
                  </span>
                  {section.title}
                </h2>
              </div>
              
              {/* List Content */}
              <div className="p-6 space-y-5">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 rounded-xl bg-[#e2eceb] dark:bg-[#425c5a] border border-[#cadfdf] dark:border-[#cadfdf]/30 flex items-center justify-center text-sm font-black flex-shrink-0 text-[#3c5654] dark:text-white group-hover/item:border-[#d7a217] group-hover/item:text-[#d7a217] transition-colors duration-300 shadow-sm">
                      {item.number}
                    </div>
                    <div>
                      <p className="text-[15px] font-medium leading-relaxed text-[#3c5654] dark:text-[#e2eceb]">
                        {item.text}
                      </p>
                      <p className="text-xs font-semibold mt-1.5 flex items-center gap-1.5 text-[#d7a217] opacity-80 group-hover/item:opacity-100 transition-opacity">
                        <CheckCircle size={12} /> {item.highlight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tips & Trik (Apache ECharts Aesthetic - Data Points Look) */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="h-px bg-gradient-to-r from-transparent via-[#d7a217]/50 to-transparent flex-1"></div>
            <h2 className="font-black text-lg uppercase tracking-widest text-[#425c5a] dark:text-white flex items-center gap-2">
              <Sparkles className={goldTextAccent} size={20} /> Tips & Trik Analis
            </h2>
            <div className="h-px bg-gradient-to-r from-[#d7a217]/50 via-transparent to-transparent flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tipsTrik.map((tip, idx) => (
              <div key={idx} className="bg-white/50 dark:bg-[#3c5654]/30 backdrop-blur-md border border-[#cadfdf] dark:border-[#cadfdf]/10 p-5 rounded-2xl flex flex-col gap-3 hover:bg-white/80 dark:hover:bg-[#3c5654]/60 hover:border-[#d7a217]/50 transition-all duration-300 group cursor-default shadow-sm hover:shadow-[0_4px_20px_rgba(215,162,23,0.1)]">
                <div className="w-10 h-10 rounded-full bg-[#425c5a] dark:bg-[#425c5a]/80 flex items-center justify-center text-[#d7a217] group-hover:scale-110 group-hover:bg-[#d7a217] group-hover:text-white transition-all duration-500 shadow-inner">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#425c5a] dark:text-white mb-1 tracking-wide">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-[#3c5654]/80 dark:text-[#cadfdf]/80 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section (Smooth Details) */}
        <div className={`${glassCardClasses} mt-12`}>
          <div className="px-8 py-6 border-b border-[#cadfdf]/50 dark:border-[#cadfdf]/10 bg-gradient-to-r from-[#425c5a] to-[#3c5654] text-white">
            <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-3">
              <MessageSquare size={18} className={goldTextAccent} /> FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>
          
          <div className="p-4 sm:p-8 space-y-3">
            {faqItems.map((faq, idx) => (
              <details key={idx} className="group rounded-xl border border-[#cadfdf]/50 dark:border-[#cadfdf]/10 bg-white/50 dark:bg-black/20 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer outline-none hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                  <h3 className="font-bold text-sm text-[#425c5a] dark:text-[#e2eceb] pr-4">
                    {faq.question}
                  </h3>
                  <div className="w-6 h-6 rounded-full bg-[#e2eceb] dark:bg-[#425c5a] flex items-center justify-center text-[#d7a217] group-open:rotate-90 transition-transform duration-300 flex-shrink-0 shadow-sm border border-[#cadfdf]/50 dark:border-transparent">
                    <ChevronRight size={14} />
                  </div>
                </summary>
                <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 duration-300 ease-in-out">
                  <div className="p-4 bg-[#e2eceb]/50 dark:bg-[#425c5a]/40 rounded-xl border-l-2 border-[#d7a217]">
                    <p className="text-sm text-[#3c5654] dark:text-[#cadfdf] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Support Section (Premium Call-to-Action) */}
        <div className="relative mt-12 rounded-3xl overflow-hidden bg-gradient-to-br from-[#425c5a] to-[#3c5654] border border-[#d7a217]/30 shadow-2xl group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute right-0 top-0 w-[40%] h-[200%] bg-gradient-to-l from-[#d7a217]/10 to-transparent transform rotate-12 translate-x-10 -translate-y-20 pointer-events-none"></div>
          
          <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left text-white max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4 backdrop-blur-sm">
                <LifeBuoy size={14} className={goldTextAccent} />
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">Dukungan Teknis</span>
              </div>
              <h3 className="text-3xl font-black mb-3 text-white">
                Butuh Bantuan Lebih Lanjut?
              </h3>
              <p className="text-[#cadfdf] text-sm leading-relaxed">
                Tim support ahli kami siap membantu Anda menyelesaikan kendala teknis atau mendiskusikan fitur analitik sistem secara mendalam.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto min-w-[280px]">
              <a href="mailto:support@simonalisa.com" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-4 rounded-2xl transition-all duration-300 group/btn hover:border-[#d7a217]/50">
                <div className="w-10 h-10 rounded-full bg-[#d7a217] flex items-center justify-center text-[#425c5a] shadow-[0_0_15px_rgba(215,162,23,0.4)] group-hover/btn:scale-110 transition-transform">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#cadfdf] tracking-widest mb-0.5">Kirim Email</p>
                  <p className="text-sm font-bold text-white">support@simonalisa.com</p>
                </div>
              </a>
              <div className="flex gap-3">
                <a href="tel:06112345678" className="flex-1 flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl transition-colors">
                  <Phone size={16} className={goldTextAccent} />
                  <span className="text-sm font-semibold text-white">(061) 1234-5678</span>
                </a>
                <a href="#" className="flex-1 flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl transition-colors">
                  <Smartphone size={16} className={goldTextAccent} />
                  <span className="text-sm font-semibold text-white">0852-3485-9011</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-[#d7a217] to-transparent mx-auto mb-4 opacity-50"></div>
          <p className="text-[11px] font-semibold tracking-wider text-[#3c5654] dark:text-[#cadfdf]/50 uppercase">
            © {new Date().getFullYear()} {branding.name1}{branding.name2} • Hak Cipta Dilindungi
          </p>
          <p className="text-[10px] text-[#425c5a]/60 dark:text-[#cadfdf]/30 mt-1">
            Versi 4.0.0 • Dikembangkan dengan <span className={goldTextAccent}>♥</span> oleh Ataria Corp
          </p>
        </div>

      </div>

      {/* Global Style overrides untuk animasi partikel & details */}
      <style jsx>{`
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: var(--opacity, 0.4); }
          90% { opacity: var(--opacity, 0.4); }
          100% { transform: translateY(-100vh) translateX(50px) rotate(360deg); opacity: 0; }
        }
        .animate-float-particle {
          animation-name: float-particle;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        details > summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PanduanView;