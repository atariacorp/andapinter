export const STATUS_STYLES = {
  'Pending': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50',
  'Diverifikasi': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
  'Disetujui': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
  'Ditolak Operator': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50',
  'Ditolak Admin': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50',
  'Ditolak': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50'
};

export const USER_LEVELS = {
  ADMIN: 'Admin',
  OPERATOR: 'Operator BKAD',
  SKPD: 'SKPD',
  TAPD: 'TAPD',
  VIEWER: 'Viewer'
};

export const DEFAULT_BRANDING = {
  name1: 'ANDA',
  name2: 'PINTER',
  tagline: 'Aplikasi Pendataan Pergeseran Anggaran',
  subTagline: 'Badan Keuangan dan Aset Daerah Kota Medan',
  icon: 'A',
  logoUrl: ''
};

export const IS_CANVAS = window.location.hostname.includes('scf.usercontent.goog') || 
                         window.location.hostname.includes('canvas') ||
                         window.location.hostname.includes('usercontent.goog') ||
                         window.location.hostname.includes('googleusercontent');