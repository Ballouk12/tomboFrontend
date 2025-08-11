import { useEffect, useState } from 'react';
import { Switch } from './ui/switch';
import { Sun, Moon } from 'lucide-react';

const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      aria-label="Toggle theme"
      className="flex items-center gap-2 px-2 py-1 rounded focus:outline-none"
      onClick={toggleTheme}
    >
      <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
      {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      <span className="hidden md:inline text-xs">{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}
