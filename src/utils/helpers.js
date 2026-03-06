// Fungsi untuk generate ID unik
export const generateUniqueId = () => {
  // Menggunakan crypto.randomUUID() jika tersedia (modern browser)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback untuk browser lama
  return Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '-' + performance.now();
};

// Format tanggal
export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Format tanggal dan waktu
export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format ukuran file
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Truncate text
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Parse CSV line
export const parseCSVLine = (line, delimiter = ';') => {
  const parts = line.includes(delimiter) ? line.split(delimiter) : line.split(',');
  return parts.map(part => part.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, ''));
};

// Group by array
export const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    const groupKey = currentValue[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentValue);
    return result;
  }, {});
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Sleep function
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Download file
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate tahun (4 digit)
export const isValidYear = (year) => {
  const re = /^\d{4}$/;
  return re.test(year);
};

// Format Rupiah
export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};

// Parse Rupiah string to number
export const parseRupiah = (rupiahString) => {
  if (!rupiahString) return 0;
  return parseInt(rupiahString.replace(/[^0-9]/g, '')) || 0;
};