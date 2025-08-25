import React from 'react';
import { QueryProvider } from './providers';
import { RouterProvider } from './providers';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <QueryProvider>
          <RouterProvider />
        </QueryProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
