import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'vi' | 'en' | 'zh' | 'ko' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: Array<{ code: Language; name: string; flag: string }>;
}

// Translations object
const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Thống kê',
    'nav.categories': 'Danh mục',
    'nav.brands': 'Thương hiệu',
    'nav.products': 'Sản phẩm',
    'nav.orders': 'Đơn hàng',
    'nav.customers': 'Khách hàng',
    'nav.posts': 'Bài viết',
    'nav.topics': 'Chủ đề',
    'nav.messages': 'Tin nhắn',
    'nav.notifications': 'Thông báo',
    'nav.settings': 'Cài đặt',
    'nav.profile': 'Thông tin cá nhân',
    
    // Login
    'login.title': '7N Fashion Admin',
    'login.subtitle': 'Đăng nhập vào hệ thống quản trị',
    'login.email': 'Email',
    'login.password': 'Mật khẩu',
    'login.button': 'Đăng nhập',
    'login.loading': 'Đang đăng nhập...',
    'login.demo.title': 'Thông tin đăng nhập demo:',
    'login.demo.email': 'Email:',
    'login.demo.password': 'Mật khẩu:',
    'login.success': 'Đăng nhập thành công!',
    'login.error': 'Đăng nhập thất bại',
    'login.validation.email.required': 'Vui lòng nhập email!',
    'login.validation.email.invalid': 'Email không hợp lệ!',
    'login.validation.password.required': 'Vui lòng nhập mật khẩu!',
    'login.validation.password.min': 'Mật khẩu phải có ít nhất 6 ký tự!',
    
    // Common
    'common.copyright': '© 2024 7N Fashion. Tất cả quyền được bảo lưu.',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.edit': 'Sửa',
    'common.delete': 'Xóa',
    'common.add': 'Thêm',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.export': 'Xuất',
    'common.import': 'Nhập',
    'common.loading': 'Đang tải...',
    'common.success': 'Thành công!',
    'common.error': 'Có lỗi xảy ra!',
    
    // Header
    'header.logout': 'Đăng xuất',
    'header.profile': 'Thông tin cá nhân',
    'header.settings': 'Cài đặt',
    'header.darkMode': 'Chế độ tối',
    'header.lightMode': 'Chế độ sáng',
    
    // Settings
    'settings.theme': 'Giao diện',
    'settings.language': 'Ngôn ngữ',
    'settings.fontSize': 'Cỡ chữ',
    'settings.animation': 'Hiệu ứng',
    'settings.compact': 'Chế độ thu gọn',
    'settings.highContrast': 'Độ tương phản cao',
    'settings.borderRadius': 'Bo góc',
  },
  
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytics',
    'nav.categories': 'Categories',
    'nav.brands': 'Brands',
    'nav.products': 'Products',
    'nav.orders': 'Orders',
    'nav.customers': 'Customers',
    'nav.posts': 'Posts',
    'nav.topics': 'Topics',
    'nav.messages': 'Messages',
    'nav.notifications': 'Notifications',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    
    // Login
    'login.title': '7N Fashion Admin',
    'login.subtitle': 'Sign in to admin dashboard',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Sign In',
    'login.loading': 'Signing in...',
    'login.demo.title': 'Demo credentials:',
    'login.demo.email': 'Email:',
    'login.demo.password': 'Password:',
    'login.success': 'Login successful!',
    'login.error': 'Login failed',
    'login.validation.email.required': 'Please enter email!',
    'login.validation.email.invalid': 'Invalid email!',
    'login.validation.password.required': 'Please enter password!',
    'login.validation.password.min': 'Password must be at least 6 characters!',
    
    // Common
    'common.copyright': '© 2024 7N Fashion. All rights reserved.',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.loading': 'Loading...',
    'common.success': 'Success!',
    'common.error': 'An error occurred!',
    
    // Header
    'header.logout': 'Logout',
    'header.profile': 'Profile',
    'header.settings': 'Settings',
    'header.darkMode': 'Dark Mode',
    'header.lightMode': 'Light Mode',
    
    // Settings
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.fontSize': 'Font Size',
    'settings.animation': 'Animation',
    'settings.compact': 'Compact Mode',
    'settings.highContrast': 'High Contrast',
    'settings.borderRadius': 'Border Radius',
  },
  
  zh: {
    // Navigation
    'nav.dashboard': '仪表板',
    'nav.analytics': '分析',
    'nav.categories': '分类',
    'nav.brands': '品牌',
    'nav.products': '产品',
    'nav.orders': '订单',
    'nav.customers': '客户',
    'nav.posts': '文章',
    'nav.topics': '主题',
    'nav.messages': '消息',
    'nav.notifications': '通知',
    'nav.settings': '设置',
    'nav.profile': '个人资料',
    
    // Login
    'login.title': '7N时尚管理',
    'login.subtitle': '登录管理系统',
    'login.email': '邮箱',
    'login.password': '密码',
    'login.button': '登录',
    'login.loading': '登录中...',
    'login.demo.title': '演示账户信息：',
    'login.demo.email': '邮箱：',
    'login.demo.password': '密码：',
    'login.success': '登录成功！',
    'login.error': '登录失败',
    'login.validation.email.required': '请输入邮箱！',
    'login.validation.email.invalid': '邮箱格式无效！',
    'login.validation.password.required': '请输入密码！',
    'login.validation.password.min': '密码至少需要6个字符！',
    
    // Common
    'common.copyright': '© 2024 7N时尚。保留所有权利。',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.add': '添加',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.export': '导出',
    'common.import': '导入',
    'common.loading': '加载中...',
    'common.success': '成功！',
    'common.error': '发生错误！',
    
    // Header
    'header.logout': '退出',
    'header.profile': '个人资料',
    'header.settings': '设置',
    'header.darkMode': '深色模式',
    'header.lightMode': '浅色模式',
    
    // Settings
    'settings.theme': '主题',
    'settings.language': '语言',
    'settings.fontSize': '字体大小',
    'settings.animation': '动画',
    'settings.compact': '紧凑模式',
    'settings.highContrast': '高对比度',
    'settings.borderRadius': '圆角',
  },
  
  ko: {
    // Navigation
    'nav.dashboard': '대시보드',
    'nav.analytics': '분석',
    'nav.categories': '카테고리',
    'nav.brands': '브랜드',
    'nav.products': '제품',
    'nav.orders': '주문',
    'nav.customers': '고객',
    'nav.posts': '게시물',
    'nav.topics': '주제',
    'nav.messages': '메시지',
    'nav.notifications': '알림',
    'nav.settings': '설정',
    'nav.profile': '프로필',
    
    // Login
    'login.title': '7N 패션 관리자',
    'login.subtitle': '관리 시스템에 로그인',
    'login.email': '이메일',
    'login.password': '비밀번호',
    'login.button': '로그인',
    'login.loading': '로그인 중...',
    'login.demo.title': '데모 계정 정보:',
    'login.demo.email': '이메일:',
    'login.demo.password': '비밀번호:',
    'login.success': '로그인 성공!',
    'login.error': '로그인 실패',
    'login.validation.email.required': '이메일을 입력하세요!',
    'login.validation.email.invalid': '유효하지 않은 이메일!',
    'login.validation.password.required': '비밀번호를 입력하세요!',
    'login.validation.password.min': '비밀번호는 최소 6자 이상이어야 합니다!',
    
    // Common
    'common.copyright': '© 2024 7N 패션. 모든 권리 보유.',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.edit': '편집',
    'common.delete': '삭제',
    'common.add': '추가',
    'common.search': '검색',
    'common.filter': '필터',
    'common.export': '내보내기',
    'common.import': '가져오기',
    'common.loading': '로딩 중...',
    'common.success': '성공!',
    'common.error': '오류가 발생했습니다!',
    
    // Header
    'header.logout': '로그아웃',
    'header.profile': '프로필',
    'header.settings': '설정',
    'header.darkMode': '다크 모드',
    'header.lightMode': '라이트 모드',
    
    // Settings
    'settings.theme': '테마',
    'settings.language': '언어',
    'settings.fontSize': '글꼴 크기',
    'settings.animation': '애니메이션',
    'settings.compact': '간소 모드',
    'settings.highContrast': '고대비',
    'settings.borderRadius': '모서리 둥글기',
  },
  
  ja: {
    // Navigation
    'nav.dashboard': 'ダッシュボード',
    'nav.analytics': '分析',
    'nav.categories': 'カテゴリ',
    'nav.brands': 'ブランド',
    'nav.products': '商品',
    'nav.orders': '注文',
    'nav.customers': '顧客',
    'nav.posts': '投稿',
    'nav.topics': 'トピック',
    'nav.messages': 'メッセージ',
    'nav.notifications': '通知',
    'nav.settings': '設定',
    'nav.profile': 'プロフィール',
    
    // Login
    'login.title': '7Nファッション管理',
    'login.subtitle': '管理システムにログイン',
    'login.email': 'メール',
    'login.password': 'パスワード',
    'login.button': 'ログイン',
    'login.loading': 'ログイン中...',
    'login.demo.title': 'デモアカウント情報：',
    'login.demo.email': 'メール：',
    'login.demo.password': 'パスワード：',
    'login.success': 'ログイン成功！',
    'login.error': 'ログイン失敗',
    'login.validation.email.required': 'メールを入力してください！',
    'login.validation.email.invalid': '無効なメール！',
    'login.validation.password.required': 'パスワードを入力してください！',
    'login.validation.password.min': 'パスワードは最低6文字必要です！',
    
    // Common
    'common.copyright': '© 2024 7Nファッション。全著作権所有。',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.edit': '編集',
    'common.delete': '削除',
    'common.add': '追加',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.export': 'エクスポート',
    'common.import': 'インポート',
    'common.loading': '読み込み中...',
    'common.success': '成功！',
    'common.error': 'エラーが発生しました！',
    
    // Header
    'header.logout': 'ログアウト',
    'header.profile': 'プロフィール',
    'header.settings': '設定',
    'header.darkMode': 'ダークモード',
    'header.lightMode': 'ライトモード',
    
    // Settings
    'settings.theme': 'テーマ',
    'settings.language': '言語',
    'settings.fontSize': 'フォントサイズ',
    'settings.animation': 'アニメーション',
    'settings.compact': 'コンパクトモード',
    'settings.highContrast': 'ハイコントラスト',
    'settings.borderRadius': '角の丸み',
  },
};

const languages = [
  { code: 'vi' as Language, name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
  { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
  { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 