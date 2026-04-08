import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addMonths,
  subMonths,
  isToday
} from "date-fns";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  StickyNote,
  Plus,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { GlobalEffects } from "./animations";

interface Memo {
  id: string;
  date: Date;
  content: string;
}

const THEMES: Record<number, { banner: string; label: string }> = {
  0: { banner: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a", label: "Winter Silence" },
  1: { banner: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", label: "Early Bloom" },
  2: { banner: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7", label: "Spring Sakura" },
  3: { banner: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa", label: "Fresh Green" },
  4: { banner: "https://images.unsplash.com/photo-1500382017468-9049fed747ef", label: "Garden Lush" },
  5: { banner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", label: "Summer Shores" },
  6: { banner: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1", label: "Sunray Peak" },
  7: { banner: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", label: "North Woods" },
  8: { banner: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee", label: "Golden Fields" },
  9: { banner: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", label: "Copper Leaves" },
  10: { banner: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e", label: "Misty Eve" },
  11: { banner: "https://images.unsplash.com/photo-1512389142860-9c449e58a543", label: "Starry Snow" },
};

const HOLIDAYS: Record<string, string> = {
  "2026-01-01": "New Year's Day",
  "2026-02-14": "Valentine's Day",
  "2026-10-31": "Halloween",
  "2026-12-25": "Christmas",
};

export default function Calendar() {
  const [viewDate, setViewDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [navDir, setNavDir] = useState(0);

  const theme = THEMES[viewDate.getMonth()];

  useEffect(() => {
    const saved = localStorage.getItem("app_memos");
    if (saved) {
      setMemos(JSON.parse(saved).map((m: any) => ({ ...m, date: new Date(m.date) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("app_memos", JSON.stringify(memos));
  }, [memos]);

  const monthInfo = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(start);
    return {
      start,
      end,
      days: eachDayOfInterval({
        start: startOfWeek(start),
        end: endOfWeek(end),
      })
    };
  }, [viewDate]);

  const handleDaySelect = (d: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(d);
      setRangeEnd(null);
    } else {
      if (d < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(d);
      } else {
        setRangeEnd(d);
      }
    }
  };

  const navMonth = (val: number) => {
    setNavDir(val);
    setViewDate(addMonths(viewDate, val));
  };

  const onSave = () => {
    if (!memoText.trim() || !rangeStart) return;
    const item: Memo = {
      id: Date.now().toString(),
      date: rangeStart,
      content: memoText,
    };
    setMemos([...memos, item]);
    setMemoText("");
    setEditorOpen(false);
  };

  const currentMemos = memos.filter(m => isSameMonth(m.date, viewDate));
  const holidays = Object.entries(HOLIDAYS).filter(([d]) => isSameMonth(new Date(d), viewDate));

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 relative">
      <GlobalEffects month={viewDate.getMonth()} />

      <header className="flex flex-col gap-6 px-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          <span>Notion</span>
          <span className="opacity-20">/</span>
          <span className="text-black dark:text-white">Planning</span>
        </div>

        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-6">
            <div className="text-8xl transition-transform hover:scale-110 cursor-default">
              {viewDate.getMonth() === 11 ? "🎁" : viewDate.getMonth() <= 1 ? "❄️" : viewDate.getMonth() <= 4 ? "🌸" : "☀️"}
            </div>
            <div>
              <h1 className="text-5xl font-black text-black dark:text-white tracking-tight">
                {format(viewDate, "MMMM yyyy")}
              </h1>
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mt-2 tracking-[0.2em] uppercase">
                {theme.label}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="relative h-64 rounded-[40px] overflow-hidden notion-card border-none shadow-2xl">
        <AnimatePresence mode="wait" custom={navDir}>
          <motion.img
            key={viewDate.getMonth()}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            src={theme.banner}
            className="w-full h-full object-cover dark:brightness-[0.4] brightness-90"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="absolute bottom-8 right-8 flex gap-4">
          <button onClick={() => navMonth(-1)} className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/40 transition-all active:scale-95">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => navMonth(1)} className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/40 transition-all active:scale-95">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </section>

      <div className="grid lg:grid-cols-[300px_1fr] gap-12">
        <aside className="space-y-10 px-4">
          <div>
            <h3 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">
              <StickyNote className="w-4 h-4" /> Memos
            </h3>
            <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
              {currentMemos.length === 0 ? (
                <p className="text-xs text-gray-400 font-medium italic">All quiet for now...</p>
              ) : (
                currentMemos.map(m => (
                  <div key={m.id} className="relative pl-4 border-l-2 border-indigo-500/30">
                    <span className="text-[10px] font-black text-gray-400 block mb-1">{format(m.date, "MMM d")}</span>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{m.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">
              <Sparkles className="w-4 h-4 text-amber-500" /> Holidays
            </h3>
            <div className="space-y-4">
              {holidays.map(([d, n]) => (
                <div key={d} className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{n}</span>
                  <span className="text-[10px] font-black text-rose-500/60 uppercase">{format(new Date(d), "MMMM d")}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="notion-card p-10 border-none bg-white dark:bg-white/5">
          <div className="grid grid-cols-7 mb-10 opacity-30">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.4em]">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-4">
            {monthInfo.days.map(day => {
              const active = isSameMonth(day, monthInfo.start);
              const selected = (rangeStart && isSameDay(day, rangeStart)) || (rangeEnd && isSameDay(day, rangeEnd));
              const spanned = rangeStart && rangeEnd && isWithinInterval(day, { start: rangeStart, end: rangeEnd });
              const holiday = HOLIDAYS[format(day, "yyyy-MM-dd")];
              const memoed = memos.some(m => isSameDay(m.date, day));

              return (
                <div key={day.toISOString()} className="h-20 flex items-center justify-center">
                  <button
                    onClick={() => active && handleDaySelect(day)}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative",
                      !active && "opacity-0 cursor-default",
                      active && "hover:bg-gray-100 dark:hover:bg-white/10",
                      selected && "bg-indigo-600 dark:bg-indigo-500 text-white shadow-2xl scale-110 z-10",
                      spanned && !selected && "bg-indigo-50 dark:bg-indigo-500/10",
                      isToday(day) && !selected && "border-2 border-indigo-500/20"
                    )}
                  >
                    <span className={cn(
                      "text-base font-bold",
                      selected ? "text-white" : (isToday(day) ? "text-indigo-600 dark:text-indigo-400" : "text-black dark:text-white")
                    )}>
                      {format(day, "d")}
                    </span>

                    <div className="absolute bottom-1.5 flex gap-1">
                      {holiday && <div className="w-1 h-1 rounded-full bg-rose-400" />}
                      {memoed && <div className="w-1 h-1 rounded-full bg-indigo-400" />}
                    </div>

                    {holiday && active && (
                      <div className="absolute -top-1 right-0 text-[8px] font-black text-rose-500/60 transition-opacity">
                        •
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <footer className="mt-12 pt-10 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {rangeStart ? (
                rangeEnd ? `${format(rangeStart, "MMM d")} - ${format(rangeEnd, "MMM d")}` : format(rangeStart, "MMMM d, yyyy")
              ) : <span className="text-gray-300 dark:text-gray-600">Select a timeframe</span>}
            </div>

            <div className="flex gap-6">
              {(rangeStart || rangeEnd) && (
                <button onClick={() => { setRangeStart(null); setRangeEnd(null); }} className="text-xs font-black text-gray-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">
                  Reset
                </button>
              )}
              {rangeStart && (
                <button
                  onClick={() => setEditorOpen(true)}
                  className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-xl active:scale-95 transition-all"
                >
                  New Memo
                </button>
              )}
            </div>
          </footer>
        </main>
      </div>

      <AnimatePresence>
        {editorOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setEditorOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#1C1C1E] p-10 rounded-[40px] shadow-2xl border border-white/5"
            >
              <h4 className="text-xl font-black mb-8 dark:text-white">Note it down</h4>
              <textarea
                autoFocus
                value={memoText}
                onChange={e => setMemoText(e.target.value)}
                placeholder="What's happening?"
                className="w-full h-40 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl resize-none border-none focus:ring-1 focus:ring-indigo-500 text-base dark:text-white"
              />
              <div className="flex gap-4 mt-10">
                <button onClick={onSave} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20">
                  Save
                </button>
                <button onClick={() => setEditorOpen(false)} className="px-6 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-2xl text-sm font-bold">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
