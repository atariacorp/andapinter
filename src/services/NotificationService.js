class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
    this.soundEnabled = true;
    this.browserNotificationsEnabled = false;
    this.audio = null;
    
    // Inisialisasi audio
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/notification-sound.mp3'); // Tambahkan file sound
      this.audio.volume = 0.5;
    }
  }

  // Request izin notifikasi browser
  async requestBrowserPermission() {
    if (!('Notification' in window)) {
      console.log('Browser tidak mendukung notifikasi');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.browserNotificationsEnabled = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.browserNotificationsEnabled = permission === 'granted';
      return this.browserNotificationsEnabled;
    }

    return false;
  }

  // Tambah listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Notifikasi ke semua listener
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.notifications));
  }

  // Tambah notifikasi
  addNotification(notification) {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    this.notifications = [newNotification, ...this.notifications].slice(0, 50);
    this.notifyListeners();

    // Browser notification
    if (this.browserNotificationsEnabled && notification.title) {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png',
        badge: '/logo192.png'
      });
    }

    // Sound alert
    if (this.soundEnabled && this.audio) {
      this.audio.play().catch(e => console.log('Audio play failed:', e));
    }

    return newNotification.id;
  }

  // Tandai sebagai dibaca
  markAsRead(id) {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notifyListeners();
  }

  // Tandai semua sebagai dibaca
  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.notifyListeners();
  }

  // Hapus notifikasi
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Hapus semua notifikasi
  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  // Toggle sound
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  // Get notifications
  getNotifications() {
    return this.notifications;
  }

  // Filter notifications
  getFilteredNotifications(filter = 'all') {
    if (filter === 'all') return this.notifications;
    if (filter === 'unread') return this.notifications.filter(n => !n.read);
    return this.notifications.filter(n => n.type === filter);
  }
}

// Singleton instance
const notificationService = new NotificationService();
export default notificationService;