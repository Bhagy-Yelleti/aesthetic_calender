import { useState, useEffect } from 'react';
import Calendar from "@/src/components/Calendar/Calendar";
import { Moon, Sun, Sparkles } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app-theme') as 'light' | 'dark';
      return stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen transition-all duration-500 ease-in-out">
      <nav className="max-w-[1400px] mx-auto p-10 flex justify-between items-center bg-transparent relative z-50">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black relative z-10 shadow-2xl">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-[0.3em] leading-tight">Luminar</span>
            <span className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">Planner</span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm border border-gray-100 dark:border-white/5"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </nav>

      <main className="relative">
        <div className="max-w-[1400px] mx-auto py-10">
          <Calendar />
        </div>
      </main>

      <footer className="py-20 text-center select-none">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">Luminar Calendar • Eternal Design</p>
      </footer>
    </div>
  );
}
