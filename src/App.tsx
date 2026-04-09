import { useState, useEffect } from 'react';
import Calendar from "@/src/components/Calendar/Calendar";
import { Moon, Sun, LayoutGrid, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumina-st-theme') as 'light' | 'dark';
      return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lumina-st-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-1000 ease-in-out selection:bg-indigo-500/20 pb-10">
      <nav className="p-10 lg:p-14 flex justify-between items-center relative z-[100] max-w-[1600px] mx-auto">
        <div className="flex items-center gap-8 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/30 blur-3xl group-hover:blur-[40px] transition-all opacity-40 group-hover:opacity-70" />
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              className="w-20 h-20 rounded-[32px] bg-black dark:bg-white flex items-center justify-center text-white dark:text-black relative z-10 shadow-3xl transition-all"
            >
              <LayoutGrid className="w-10 h-10" />
            </motion.div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-black uppercase tracking-[0.6em] leading-none">Luminar</h1>
              <div className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">Final</div>
            </div>
            <p className="text-[11px] font-black opacity-30 uppercase tracking-[0.4em] mt-2">Temporal Engineering Submission</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden xl:flex gap-12">
            {["Architecture", "Performance", "Interactions"].map(item => (
              <button key={item} className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100" />
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="w-20 h-20 rounded-[32px] bg-white dark:bg-white/5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-2xl border border-black/[0.03] dark:border-white/[0.05]"
          >
            <AnimatePresence mode="wait">
              {theme === 'light' ? (
                <motion.div key="moon" initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }}>
                  <Moon className="w-7 h-7" />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }}>
                  <Sun className="w-7 h-7" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        <Calendar />
      </main>

      <footer className="mt-20 py-20 px-10 text-center border-t border-black/[0.03] dark:border-white/[0.05]">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4 opacity-20">
            <Sparkles className="w-5 h-5" />
            <p className="text-[11px] font-black uppercase tracking-[0.8em]">Striver Challenge Final Engineering Unit • 2026</p>
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold opacity-30 lowercase tracking-widest italic flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-current" />
            optimized for high-density displays & fluid motion
          </p>
        </div>
      </footer>
    </div>
  );
}
