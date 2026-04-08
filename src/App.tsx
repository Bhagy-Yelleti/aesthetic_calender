import { useState, useEffect } from 'react';
import Calendar from "@/src/components/Calendar/Calendar";
import { Moon, Sun } from "lucide-react";

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme-mode') as 'light' | 'dark';
      return stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('theme-mode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <div className="min-h-screen transition-colors duration-500 selection:bg-indigo-100">
      <nav className="max-w-7xl mx-auto p-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">L</div>
          <span className="text-xs font-bold uppercase tracking-widest opacity-60">Luminar</span>
        </div>
        <button
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          {mode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </nav>

      <main className="py-12 px-6">
        <Calendar />
      </main>

      <footer className="max-w-7xl mx-auto py-12 px-6 text-center opacity-30 select-none">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Luminar • Crafted with care</p>
      </footer>
    </div>
  );
}
