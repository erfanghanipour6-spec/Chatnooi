// ============================================
// تنظیمات اولیه و متغیرهای سراسری
// ============================================

const CONFIG = {
    MAX_MESSAGES: 500,
    TYPING_TIMEOUT: 2000,
    INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 دقیقه
    MAX_MESSAGE_LENGTH: 1000,
    SPAM_LIMIT: 5, // تعداد پیام در 10 ثانیه
    SPAM_WINDOW: 10000,
    ADMIN_USERNAME: 'Admin',
    ADMIN_PASSWORD: 'Mhm MN'
};

let currentUser = null;
let users = [];
let messages = [];
let bannedUsers = [];
let settings = {};
let typingUsers = {};
let messageCounts = {};
let lastActivityTime = Date.now();
let inactivityTimer = null;
let currentLanguage = 'fa';
let unreadCount = 0;

// ============================================
// ترجمه‌ها (پشتیبانی از ۱۲ زبان)
// ============================================

const translations = {
    fa: {
        title: '💬 چت‌روم حرفه‌ای',
        loginPlaceholder: 'نام کاربری خود را وارد کنید',
        passwordPlaceholder: 'رمز عبور (فقط برای ادمین)',
        loginBtn: 'ورود به چت',
        online: 'آنلاین',
        users: 'کاربران آنلاین',
        typeMessage: 'پیام خود را بنویسید...',
        adminPanel: '🔧 پنل ادمین',
        userManagement: 'مدیریت کاربران',
        messageManagement: 'مدیریت پیام‌ها',
        clearAllMessages: '🗑️ پاک کردن تمام پیام‌ها',
        sendSystemMessage: '📢 ارسال پیام سیستمی',
        stats: 'آمار',
        ban: 'بن',
        unban: 'آن‌بن',
        copy: 'کپی',
        delete: 'حذف',
        edit: 'ویرایش',
        loginError: 'خطا در ورود',
        userBanned: 'شما بن شده‌اید',
        usernameTaken: 'این نام کاربری قبلاً استفاده شده',
        invalidUsername: 'نام کاربری نامعتبر است',
        emptyMessage: 'پیام خالی است',
        messageTooLong: 'پیام طولانی است',
        spamWarning: 'لطفاً کمی صبر کنید',
        systemMessage: 'پیام سیستمی',
        joined: 'وارد چت شد',
        left: 'چت را ترک کرد',
        banned: 'بن شد',
        unbanned: 'آن‌بن شد',
        allMessagesCleared: 'تمام پیام‌ها پاک شد',
        adminLogin: 'ورود به عنوان ادمین'
    },
    en: {
        title: '💬 Professional ChatRoom',
        loginPlaceholder: 'Enter your username',
        passwordPlaceholder: 'Password (for admin only)',
        loginBtn: 'Login to Chat',
        online: 'online',
        users: 'Online Users',
        typeMessage: 'Type your message...',
        adminPanel: '🔧 Admin Panel',
        userManagement: 'User Management',
        messageManagement: 'Message Management',
        clearAllMessages: '🗑️ Clear All Messages',
        sendSystemMessage: '📢 Send System Message',
        stats: 'Statistics',
        ban: 'Ban',
        unban: 'Unban',
        copy: 'Copy',
        delete: 'Delete',
        edit: 'Edit',
        loginError: 'Login Error',
        userBanned: 'You are banned',
        usernameTaken: 'Username already taken',
        invalidUsername: 'Invalid username',
        emptyMessage: 'Message is empty',
        messageTooLong: 'Message is too long',
        spamWarning: 'Please wait a moment',
        systemMessage: 'System Message',
        joined: 'joined the chat',
        left: 'left the chat',
        banned: 'was banned',
        unbanned: 'was unbanned',
        allMessagesCleared: 'All messages cleared',
        adminLogin: 'Admin login'
    },
    tr: {
        title: '💬 Profesyonel Sohbet Odası',
        loginPlaceholder: 'Kullanıcı adınızı girin',
        passwordPlaceholder: 'Şifre (sadece admin için)',
        loginBtn: 'Sohbete Giriş',
        online: 'çevrimiçi',
        users: 'Çevrimiçi Kullanıcılar',
        typeMessage: 'Mesajınızı yazın...',
        adminPanel: '🔧 Admin Paneli',
        userManagement: 'Kullanıcı Yönetimi',
        messageManagement: 'Mesaj Yönetimi',
        clearAllMessages: '🗑️ Tüm Mesajları Temizle',
        sendSystemMessage: '📢 Sistem Mesajı Gönder',
        stats: 'İstatistikler',
        ban: 'Yasakla',
        unban: 'Yasağı Kaldır',
        copy: 'Kopyala',
        delete: 'Sil',
        edit: 'Düzenle',
        loginError: 'Giriş Hatası',
        userBanned: 'Yasaklandınız',
        usernameTaken: 'Kullanıcı adı zaten alınmış',
        invalidUsername: 'Geçersiz kullanıcı adı',
        emptyMessage: 'Mesaj boş',
        messageTooLong: 'Mesaj çok uzun',
        spamWarning: 'Lütfen biraz bekleyin',
        systemMessage: 'Sistem Mesajı',
        joined: 'sohbete katıldı',
        left: 'sohbetten ayrıldı',
        banned: 'yasaklandı',
        unbanned: 'yasağı kaldırıldı',
        allMessagesCleared: 'Tüm mesajlar temizlendi',
        adminLogin: 'Admin girişi'
    },
    ar: {
        title: '💬 غرفة محادثة احترافية',
        loginPlaceholder: 'أدخل اسم المستخدم',
        passwordPlaceholder: 'كلمة المرور (للمدير فقط)',
        loginBtn: 'دخول إلى الدردشة',
        online: 'متصل',
        users: 'المستخدمون المتصلون',
        typeMessage: 'اكتب رسالتك...',
        adminPanel: '🔧 لوحة المدير',
        userManagement: 'إدارة المستخدمين',
        messageManagement: 'إدارة الرسائل',
        clearAllMessages: '🗑️ مسح جميع الرسائل',
        sendSystemMessage: '📢 إرسال رسالة نظام',
        stats: 'إحصائيات',
        ban: 'حظر',
        unban: 'إلغاء الحظر',
        copy: 'نسخ',
        delete: 'حذف',
        edit: 'تعديل',
        loginError: 'خطأ في تسجيل الدخول',
        userBanned: 'لقد تم حظرك',
        usernameTaken: 'اسم المستخدم مستخدم بالفعل',
        invalidUsername: 'اسم مستخدم غير صالح',
        emptyMessage: 'الرسالة فارغة',
        messageTooLong: 'الرسالة طويلة جداً',
        spamWarning: 'يرجى الانتظار لحظة',
        systemMessage: 'رسالة نظام',
        joined: 'انضم إلى الدردشة',
        left: 'غادر الدردشة',
        banned: 'تم حظره',
        unbanned: 'تم إلغاء حظره',
        allMessagesCleared: 'تم مسح جميع الرسائل',
        adminLogin: 'تسجيل الدخول كمدير'
    },
    ru: {
        title: '💬