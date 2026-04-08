import { useState, useEffect } from 'react';
import Calendar from "@/src/components/Calendar/Calendar";
import { Moon, Sun, Sparkles } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('luminar-theme') as 'light' | 'dark';
      return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('luminar-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-700 ease-in-out">
      <nav className="max-w-[1400px] mx-auto p-12 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl group-hover:bg-indigo-500/40 transition-all rounded-full" />
            <div className="w-14 h-14 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black relative z-10 shadow-3xl overflow-hidden active:scale-90 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black uppercase tracking-[0.4em] leading-none mb-1">Luminar</h1>
            <p className="text-[10px] font-extrabold opacity-40 uppercase tracking-[0.3em]">Temporal Planner</p>
          </div>
        </div>

        <button
          onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          className="w-14 h-14 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm border border-gray-100 dark:border-white/10"
        >
          {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </button>
      </nav>

      <main className="pb-20">
        <Calendar />
      </main>
    </div>
  );
}
