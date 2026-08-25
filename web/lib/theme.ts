export type Theme = 'light' | 'dark';

const KEY = 'er_theme';

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = window.localStorage.getItem(KEY);
    return isTheme(stored) ? stored : 'dark';
  } catch {
    return 'dark';
  }
}

export function setTheme(t: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, t);
  } catch {
    // ignora falha de storage (modo privado, etc.)
  }
  document.documentElement.dataset.theme = t;
  document.documentElement.style.colorScheme = t;
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function applyTheme(): void {
  setTheme(getTheme());
}
