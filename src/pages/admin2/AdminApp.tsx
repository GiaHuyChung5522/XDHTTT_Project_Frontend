import React from 'react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import koKR from 'antd/locale/ko_KR';
import jaJP from 'antd/locale/ja_JP';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/ko';
import 'dayjs/locale/ja';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { RouterProvider } from './pages/providers';
import { QueryProvider } from './pages/providers';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import AuthProvider from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import NotificationSystem from '../../components/NotificationSystem';
import FloatingContactButtons from '../../components/FloatingContactButtons';
import './App.css';

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const AppContent: React.FC = () => {
  const { language } = useLanguage();
  const { settings, isDark } = useTheme();

  // Set dayjs locale based on language
  React.useEffect(() => {
    const localeMap = {
      vi: 'vi',
      en: 'en',
      zh: 'zh-cn',
      ko: 'ko',
      ja: 'ja',
    };
    dayjs.locale(localeMap[language]);
  }, [language]);

  // Get Ant Design locale
  const getAntdLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'zh': return zhCN;
      case 'ko': return koKR;
      case 'ja': return jaJP;
      default: return viVN;
    }
  };

  // Dynamic theme based on settings
  const customTheme = {
    token: {
      // Primary colors - Clean blue scheme
      colorPrimary: '#3b82f6',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      colorInfo: '#3b82f6',
      
      // Background colors
      colorBgContainer: isDark ? '#1f2937' : '#ffffff',
      colorBgElevated: isDark ? '#374151' : '#ffffff',
      colorBgLayout: isDark ? '#111827' : '#f9fafb',
      
      // Text colors
      colorText: isDark ? '#f9fafb' : '#111827',
      colorTextSecondary: isDark ? '#d1d5db' : '#6b7280',
      colorTextTertiary: isDark ? '#9ca3af' : '#9ca3af',
      colorTextQuaternary: isDark ? '#6b7280' : '#d1d5db',
      
      // Border colors
      colorBorder: isDark ? '#374151' : '#e5e7eb',
      colorBorderSecondary: isDark ? '#4b5563' : '#f3f4f6',
      
      // Border radius - From settings
      borderRadius: settings.borderRadius,
      borderRadiusLG: settings.borderRadius + 2,
      borderRadiusSM: Math.max(settings.borderRadius - 2, 2),
      borderRadiusXS: Math.max(settings.borderRadius - 4, 1),
      
      // Shadows - Subtle and professional
      boxShadow: isDark 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
        : '0 1px 3px rgba(0, 0, 0, 0.1)',
      boxShadowSecondary: isDark 
        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
        : '0 1px 2px rgba(0, 0, 0, 0.05)',
      
      // Typography - From settings
      fontSize: settings.fontSize === 'small' ? 12 : settings.fontSize === 'large' ? 16 : 14,
      fontSizeLG: settings.fontSize === 'small' ? 14 : settings.fontSize === 'large' ? 18 : 16,
      fontSizeSM: settings.fontSize === 'small' ? 10 : settings.fontSize === 'large' ? 14 : 12,
      fontSizeXL: settings.fontSize === 'small' ? 18 : settings.fontSize === 'large' ? 22 : 20,
      lineHeight: 1.5,
      
      // Spacing - Compact mode
      padding: settings.compactMode ? 12 : 16,
      paddingLG: settings.compactMode ? 18 : 24,
      paddingSM: settings.compactMode ? 8 : 12,
      paddingXS: settings.compactMode ? 6 : 8,
      margin: settings.compactMode ? 12 : 16,
      marginLG: settings.compactMode ? 18 : 24,
      marginSM: settings.compactMode ? 8 : 12,
      marginXS: settings.compactMode ? 6 : 8,
    },
    components: {
      Layout: {
        bodyBg: isDark ? '#111827' : '#f9fafb',
        headerBg: isDark ? '#1f2937' : '#ffffff',
        siderBg: isDark ? '#0f172a' : '#374151',
        triggerBg: isDark ? '#0f172a' : '#374151',
        triggerColor: '#ffffff',
      },
      Menu: {
        itemBg: 'transparent',
        itemColor: 'rgba(255, 255, 255, 0.8)',
        itemHoverBg: 'rgba(255, 255, 255, 0.08)',
        itemHoverColor: '#ffffff',
        itemSelectedBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
        itemSelectedColor: '#ffffff',
        subMenuItemBg: 'transparent',
        iconSize: 16,
        fontSize: settings.fontSize === 'small' ? 12 : settings.fontSize === 'large' ? 16 : 14,
        itemBorderRadius: settings.borderRadius,
        itemMarginBlock: settings.compactMode ? 2 : 4,
        itemPaddingInline: settings.compactMode ? 12 : 16,
        itemHeight: settings.compactMode ? 40 : 48,
      },
      Card: {
        borderRadiusLG: settings.borderRadius + 2,
        paddingLG: settings.compactMode ? 16 : 20,
        boxShadowTertiary: isDark 
          ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      Button: {
        borderRadius: settings.borderRadius,
        fontWeight: 500,
      },
      Table: {
        borderRadius: settings.borderRadius,
        headerBg: isDark ? '#374151' : '#f9fafb',
        headerColor: isDark ? '#f9fafb' : '#374151',
        rowHoverBg: isDark ? '#374151' : '#f9fafb',
      },
      Input: {
        borderRadius: settings.borderRadius,
      },
      Select: {
        borderRadius: settings.borderRadius,
      },
      DatePicker: {
        borderRadius: settings.borderRadius,
      },
      Modal: {
        borderRadiusLG: settings.borderRadius + 2,
      },
      Drawer: {
        borderRadiusLG: settings.borderRadius + 2,
      },
      Notification: {
        borderRadiusLG: settings.borderRadius + 2,
      },
      Tag: {
        borderRadiusSM: Math.max(settings.borderRadius - 2, 2),
        fontWeight: 500,
      },
    },
  };

  return (
    <ConfigProvider
      locale={getAntdLocale()}
      theme={customTheme}
    >
      <AuthProvider>
        <CartProvider>
          <QueryProvider>
            <RouterProvider />
            <NotificationSystem />
            <FloatingContactButtons />
          </QueryProvider>
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
