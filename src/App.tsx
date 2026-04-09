import { useState, useEffect } from 'react';
import Calendar from "@/src/components/Calendar/Calendar";
import { Moon, Sun, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('luminar-v3-theme') as 'light' | 'dark';
      return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('luminar-v3-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-1000 ease-in-out selection:bg-indigo-500/20">
      <nav className="p-8 lg:p-12 flex justify-between items-center relative z-[100] max-w-[1500px] mx-auto">
        <div className="flex items-center gap-6 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/40 blur-2xl group-hover:blur-3xl transition-all opacity-40 group-hover:opacity-60" />
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-16 h-16 rounded-[28px] bg-black dark:bg-white flex items-center justify-center text-white dark:text-black relative z-10 shadow-2xl transition-all"
            >
              <LayoutGrid className="w-8 h-8" />
            </motion.div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-black uppercase tracking-[0.5em] leading-none mb-1">Luminar</h1>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em]">Temporal Ecosystem v3</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-10">
            {["Archive", "Analytics", "Network"].map(item => (
              <button key={item} className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity">
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="w-16 h-16 rounded-[28px] bg-white dark:bg-white/5 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm border border-black/5 dark:border-white/10"
          >
            <AnimatePresence mode="wait">
              {theme === 'light' ? (
                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <Moon className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <Sun className="w-6 h-6 outline-none" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <main className="relative z-10 pb-20">
        <Calendar />
      </main>

      <footer className="p-12 lg:p-20 text-center border-t border-black/5 dark:border-white/5">
        <div className="flex flex-col gap-4 opacity-20">
          <p className="text-[10px] font-black uppercase tracking-[0.6em]">Premium Engineering Submission • 2026</p>
        </div>
      </footer>
    </div>
  );
}
