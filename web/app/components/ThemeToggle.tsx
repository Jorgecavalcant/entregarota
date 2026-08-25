'use client';

import { useEffect, useState } from 'react';
import { applyTheme, getTheme, toggleTheme, type Theme } from '@/lib/theme';

export default function ThemeToggle() {
  const [theme, setLocalTheme] = useState<Theme>('dark');

  useEffect(() => {
    applyTheme();
    setLocalTheme(getTheme());
  }, []);

  const handleClick = () => {
    setLocalTheme(toggleTheme());
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={theme === 'light'}
      className="btn btn-ghost theme-toggle"
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 50,
        minHeight: 44,
        minWidth: 44,
      }}
    >
      {theme === 'dark' ? 'Claro' : 'Escuro'}
    </button>
  );
}
