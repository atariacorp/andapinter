import React from 'react';
import {
  FileText, Info, Layers, XCircle, MessageSquare,
  CheckCircle, Edit3, Download, Upload, Users,
  BookOpen, AlertTriangle, FileCheck, Clock,
  Database, Calendar, Building2, FileSpreadsheet,
  Printer, Search, Filter, ChevronRight
} from 'lucide-react';

const PanduanView = ({ branding }) => {
  const panduanSections = [
    {
      title: 'ATURAN PMDN 77',
      icon: <Info size={24} />,
      color: 'from-blue-600 to-indigo-600',
      items: [
        {
          number: 1,
          text: 'Rincian SRO: Pastikan setiap pergeseran anggaran mencantumkan kode rekening dan uraian Sub Rincian Objek (SRO) yang valid.',
          highlight: 'Kode rekening harus sesuai dengan format yang ditentukan'
        },
        {
          number: 2,
          text: 'Dokumen Pendukung: Upload file PDF dengan ukuran maksimal 2MB. Dokumen harus jelas dan terbaca.',
          highlight: 'Format: PDF, JPG, PNG. Maksimal 2MB'
        },
        {
          number: 3,
          text: 'Alasan Pergeseran: Uraikan secara detail alasan pemindahan anggaran antar SRO.',
          highlight: 'Alasan harus logis dan dapat dipertanggungjawabkan'
        }
      ]
    },
    {
      title: 'ALUR PENGAJUAN',
      icon: <Layers size={24} />,
      color: 'from-emerald-600 to-teal-600',
      items: [
        {
          number: 1,
          text: 'Buat Usulan: Klik tombol "TAMBAH USULAN" dan isi semua data yang diperlukan.',
          highlight: 'Pastikan semua field terisi lengkap'
        },
        {
          number: 2,
          text: 'Status Pending: Usulan masuk ke antrian verifikasi Operator BKAD.',
          highlight: 'Status akan berubah menjadi "Pending"'
        },
        {
          number: 3,
          text: 'Verifikasi Operator: Operator akan memeriksa kelengkapan dokumen.',
          highlight: 'Operator dapat memberikan catatan jika ada revisi'
        },
        {
          number: 4,
          text: 'Finalisasi Admin: Admin memberikan persetujuan akhir atau penolakan.',
          highlight: 'Jika disetujui, status menjadi "Disetujui"'
        }
      ]
    },
    {
      title: 'CARTA MERESPON REVISI',
      icon: <XCircle size={24} />,
      color: 'from-amber-600 to-orange-600',
      items: [
        {
          number: 1,
          text: 'Jika usulan berstatus "Ditolak", klik ikon pensil (Edit) di baris usulan.',
          highlight: 'Ikon pensil hanya muncul untuk usulan dengan status Ditolak'
        },
        {
          number: 2,
          text: 'Perbaiki data sesuai catatan verifikasi yang diberikan Operator/Admin.',
          highlight: 'Baca catatan dengan seksama'
        },
        {
          number: 3,
          text: 'Setelah diperbaiki, kirim ulang usulan. Status akan kembali menjadi "Pending".',
          highlight: 'Pastikan semua perbaikan sudah dilakukan'
        },
        {
          number: 4,
          text: 'Pantau terus status usulan di halaman Daftar Berkas.',
          highlight: 'Gunakan fitur filter untuk memudahkan pencarian'
        }
      ]
    },
    {
      title: 'PENGGUNAAN RUANG DISKUSI',
      icon: <MessageSquare size={24} />,
      color: 'from-purple-600 to-pink-600',
      items: [
        {
          number: 1,
          text: 'Gunakan ruang diskusi di halaman detail usulan untuk bertanya atau klarifikasi dengan Operator/Admin.',
          highlight: 'Semua pesan tercatat dan dapat dilihat oleh semua pihak'
        },
        {
          number: 2,
          text: 'Semua pesan tersimpan dan bisa dilihat kapan saja oleh semua pihak terkait.',
          highlight: 'Riwayat diskusi tidak akan hilang'
        },
        {
          number: 3,
          text: 'Setelah revisi selesai, beri konfirmasi di ruang diskusi sebelum mengirim ulang.',
          highlight: 'Ini membantu mempercepat proses verifikasi'
        }
      ]
    }
  ];

  const tipsTrik = [
    {
      icon: <Search size={18} />,
      title: 'Pencarian Cepat',
      description: 'Gunakan fitur pencarian untuk menemukan usulan berdasarkan nomor surat atau SKPD'
    },
    {
      icon: <Filter size={18} />,
      title: 'Filter Data',
      description: 'Manfaatkan filter tahun, tahap, dan status untuk menyaring data yang ditampilkan'
    },
    {
      icon: <FileSpreadsheet size={18} />,
      title: 'Ekspor Excel',
      description: 'Ekspor data ke format CSV untuk keperluan pelaporan atau analisis lebih lanjut'
    },
    {
      icon: <Printer size={18} />,
      title: 'Cetak Berita Acara',
      description: 'Setelah disetujui, gunakan tombol cetak untuk menghasilkan Berita Acara resmi'
    },
    {
      icon: <Database size={18} />,
      title: 'Bank Data SRO',
      description: 'Gunakan bank data SRO untuk memilih kode rekening yang sudah terdaftar'
    },
    {
      icon: <Clock size={18} />,
      title: 'Pantau Status',
      description: 'Selalu pantau perubahan status usulan di dashboard dan notifikasi'
    }
  ];

  const faqItems = [
    {
      question: 'Bagaimana cara mendapatkan UID Firebase?',
      answer: 'UID Firebase dapat dilihat di Firebase Console -> Authentication -> Users. Copy UID user yang bersangkutan.'
    },
    {
      question: 'Apa yang harus dilakukan jika lupa password?',
      answer: 'Klik "Lupa Password" di halaman login, masukkan email, dan ikuti instruksi yang dikirim ke email Anda.'
    },
    {
      question: 'Mengapa usulan saya ditolak?',
      answer: 'Cek catatan verifikasi di halaman detail usulan. Biasanya penolakan disebabkan oleh ketidaklengkapan data atau ketidaksesuaian dengan regulasi.'
    },
    {
      question: 'Bagaimana cara mengubah data setelah usulan disetujui?',
      answer: 'Usulan yang sudah disetujui tidak dapat diubah. Hubungi Admin untuk membuat usulan baru atau melakukan revisi melalui mekanisme yang berlaku.'
    },
    {
      question: 'Apakah file lampiran bisa diganti setelah dikirim?',
      answer: 'Ya, selama status masih Pending atau Ditolak, Anda dapat mengedit usulan dan mengganti file lampiran.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
          <BookOpen size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
            PANDUAN SISTEM
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {branding.name1}{branding.name2} - {branding.tagline}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Untuk Pengguna Tingkat SKPD / Instansi
          </p>
        </div>
      </div>

      {/* Grid Panduan Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {panduanSections.map((section, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Header Section */}
            <div className={`bg-gradient-to-r ${section.color} px-6 py-4`}>
              <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                {section.icon}
                {section.title}
              </h2>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-700 border-2 border-current flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5"
                       style={{ color: section.color.split(' ')[1] }}>
                    {item.number}
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.text}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">
                      💡 {item.highlight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tips & Trik */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4">
          <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <CheckCircle size={18} /> TIPS & TRIK UNTUK SKPD
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tipsTrik.map((tip, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl flex items-start gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-black text-xs text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider">
                    {tip.title}
                  </h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
          <h2 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={18} /> FREQUENTLY ASKED QUESTIONS (FAQ)
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {faqItems.map((faq, idx) => (
              <details key={idx} className="group">
                <summary className="flex items-center gap-2 cursor-pointer list-none">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-open:rotate-90 transition-transform">
                    <ChevronRight size={14} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {faq.question}
                  </h3>
                </summary>
                <div className="mt-3 ml-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Kontak Support */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <h3 className="text-lg font-black mb-4 uppercase tracking-widest flex items-center gap-2">
          <Users size={20} /> BUTUH BANTUAN?
        </h3>
        <p className="text-sm opacity-90 mb-6">
          Jika Anda mengalami kendala teknis atau memiliki pertanyaan lebih lanjut, hubungi tim support kami:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase opacity-70 mb-1">Email</p>
            <p className="font-bold">support@{branding.name1.toLowerCase()}{branding.name2.toLowerCase()}.com</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase opacity-70 mb-1">Telepon</p>
            <p className="font-bold">(061) 1234-5678</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase opacity-70 mb-1">WhatsApp</p>
            <p className="font-bold">0812-3456-7890</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 pt-4">
        <p>© 2026 {branding.name1}{branding.name2} - Aplikasi Pendataan Pergeseran Anggaran</p>
        <p className="mt-1">Versi 1.0.0 • Dikembangkan oleh Ataria Corp</p>
      </div>
    </div>
  );
};

export default PanduanView;