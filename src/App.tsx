import { useState, useEffect } from "react";
import { Moon, Sun, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Calendar from "@/src/components/Calendar/Calendar";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("luminar-theme") as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("luminar-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-[100] flex items-center justify-between px-6 md:px-12 py-5 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-5">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-12 h-12 rounded-2xl bg-[var(--text)] flex items-center justify-center text-[var(--bg)] shadow-lg cursor-pointer"
          >
            <LayoutGrid className="w-6 h-6" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display font-black text-lg uppercase tracking-[0.5em] leading-none text-[var(--text)]">
                Luminar
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-[var(--accent-light)] text-[var(--accent)] text-[9px] font-black uppercase tracking-widest border border-[var(--accent)]/20">
                Final
              </span>
            </div>
            <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.4em] mt-1">
              Temporal Engineering
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {["Architecture", "Interactions", "Stack"].map((label) => (
              <button
                key={label}
                className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors duration-150"
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-md transition-all duration-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {theme === "light"
                  ? <Moon className="w-5 h-5 text-[var(--text)]" />
                  : <Sun className="w-5 h-5 text-[var(--text)]" />
                }
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Main */}
      <main>
        <Calendar />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[var(--border)] py-10 px-6 text-center">
        <p className="text-[11px] font-bold text-[var(--text-dim)] uppercase tracking-[0.6em]">
          Striver Frontend Challenge · 2026 · Luminar Calendar
        </p>
      </footer>
    </div>
  );
}
