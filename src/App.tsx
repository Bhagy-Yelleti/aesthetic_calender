/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Calendar from "@/src/components/Calendar/Calendar";
import { Moon, Sun } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as 'light' | 'dark';
      return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-[#EDEEEE] dark:border-[#2F2F2F]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗓️</span>
          <h1 className="text-sm font-semibold tracking-tight uppercase opacity-60">
            Luminar Calender
          </h1>
        </div>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-400" />}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 md:px-6">
        <Calendar />
      </main>

      <footer className="max-w-7xl mx-auto py-12 px-6 opacity-40 text-xs text-center">
        <p>&copy; {new Date().getFullYear()} Luminar Studio • Notion Inspired Design</p>
      </footer>
    </div>
  );
}
