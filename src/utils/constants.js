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

// Palet warna coklat modern
export const COLOR_PALETTE = {
  primary: {
    50: '#faf7f2',
    100: '#f0e9db',
    200: '#e6d5bf',
    300: '#d4b99b',
    400: '#b48c5c',
    500: '#8b6b4c',
    600: '#6d5340',
    700: '#4f3d2f',
    800: '#362b21',
    900: '#1f1812'
  },
  accent: {
    sand: '#d4b99b',
    clay: '#b48c5c',
    earth: '#8b6b4c',
    wood: '#6d5340'
  }
};

// Gradient coklat
export const BROWN_GRADIENTS = {
  primary: 'from-[#b48c5c] to-[#8b6b4c]',
  light: 'from-[#e6d5bf] to-[#d4b99b]',
  dark: 'from-[#6d5340] to-[#4f3d2f]'
};

export const IS_CANVAS = window.location.hostname.includes('scf.usercontent.goog') || 
                         window.location.hostname.includes('canvas') ||
                         window.location.hostname.includes('usercontent.goog') ||
                         window.location.hostname.includes('googleusercontent');