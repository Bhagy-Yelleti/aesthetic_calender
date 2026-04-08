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
  color: string;
}

const THEMES: Record<number, { banner: string; label: string; primary: string }> = {
  0: { banner: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a", label: "Winter Silence", primary: "blue" },
  1: { banner: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", label: "Early Bloom", primary: "rose" },
  2: { banner: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7", label: "Spring Sakura", primary: "pink" },
  3: { banner: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa", label: "Fresh Green", primary: "yellow" },
  4: { banner: "https://images.unsplash.com/photo-1500382017468-9049fed747ef", label: "Garden Lush", primary: "emerald" },
  5: { banner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", label: "Summer Shores", primary: "cyan" },
  6: { banner: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1", label: "Sunray Peak", primary: "sky" },
  7: { banner: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", label: "North Woods", primary: "red" },
  8: { banner: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee", label: "Golden Fields", primary: "amber" },
  9: { banner: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", label: "Copper Leaves", primary: "orange" },
  10: { banner: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e", label: "Misty Eve", primary: "indigo" },
  11: { banner: "https://images.unsplash.com/photo-1512389142860-9c449e58a543", label: "Starry Snow", primary: "violet" },
};

const COLORS = ["bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-pink-100", "bg-purple-100"];

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
  const [memoColor, setMemoColor] = useState(COLORS[0]);
  const [navDir, setNavDir] = useState(0);

  const theme = THEMES[viewDate.getMonth()];

  useEffect(() => {
    const saved = localStorage.getItem("calendar_memos");
    if (saved) {
      setMemos(JSON.parse(saved).map((m: any) => ({ ...m, date: new Date(m.date) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar_memos", JSON.stringify(memos));
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

  const onDateSelect = (d: Date) => {
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

  const changeMonth = (val: number) => {
    setNavDir(val);
    setViewDate(addMonths(viewDate, val));
  };

  const saveMemo = () => {
    if (!memoText.trim() || !rangeStart) return;
    const item: Memo = {
      id: Math.random().toString(36).substring(7),
      date: rangeStart,
      content: memoText,
      color: memoColor,
    };
    setMemos([...memos, item]);
    setMemoText("");
    setEditorOpen(false);
  };

  const monthMemos = memos.filter(m => isSameMonth(m.date, viewDate));
  const activeHolidays = Object.entries(HOLIDAYS).filter(([d]) => isSameMonth(new Date(d), viewDate));

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
      <GlobalEffects month={viewDate.getMonth()} />

      <header className="px-2 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
          <span>Personal</span>
          <span className="opacity-30">/</span>
          <span className="text-gray-900 dark:text-gray-100">Luminar Plan</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-6xl select-none">
            {viewDate.getMonth() === 11 ? "🎁" : viewDate.getMonth() <= 1 ? "🏔️" : viewDate.getMonth() <= 4 ? "🌱" : "🌊"}
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-none">
              {format(viewDate, "MMMM yyyy")}
            </h1>
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest">
              {theme.label}
            </p>
          </div>
        </div>
      </header>

      <section className="relative h-56 rounded-3xl overflow-hidden notion-card border-none shadow-xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={viewDate.getMonth()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={theme.banner}
            className="w-full h-full object-cover grayscale-[20%] dark:grayscale-[40%] brightness-90 dark:brightness-50"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-6 right-6 flex gap-3">
          <button onClick={() => changeMonth(-1)} className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={() => changeMonth(1)} className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </section>

      <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-10">
        <aside className="flex flex-col gap-8">
          <div className="notion-card p-6 border-none bg-gray-50/50 dark:bg-white/5">
            <h3 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
              <StickyNote className="w-3.5 h-3.5" /> Recent Memos
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {monthMemos.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Clear skies...</p>
              ) : (
                monthMemos.map(m => (
                  <div key={m.id} className="group">
                    <p className="text-[10px] font-bold text-gray-400 mb-1">{format(m.date, "MMM d")}</p>
                    <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 group-hover:border-indigo-200 dark:group-hover:border-indigo-900 transition-all">
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{m.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="notion-card p-6 border-none bg-gray-50/50 dark:bg-white/5">
            <h3 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Holidays
            </h3>
            <div className="space-y-3">
              {activeHolidays.map(([d, n]) => (
                <div key={d} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{n}</span>
                  <span className="text-[10px] text-gray-400">{format(new Date(d), "MMM d")}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="notion-card p-8 border-none bg-white dark:bg-white/5 shadow-sm">
          <div className="grid grid-cols-7 mb-6 opacity-40">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {monthInfo.days.map(day => {
              const active = isSameMonth(day, monthInfo.start);
              const selected = (rangeStart && isSameDay(day, rangeStart)) || (rangeEnd && isSameDay(day, rangeEnd));
              const spanned = rangeStart && rangeEnd && isWithinInterval(day, { start: rangeStart, end: rangeEnd });
              const holiday = HOLIDAYS[format(day, "yyyy-MM-dd")];
              const memoed = memos.some(m => isSameDay(m.date, day));

              return (
                <div key={day.toISOString()} className="h-20 lg:h-28 border-[0.5px] border-gray-50 dark:border-white/5">
                  <button
                    onClick={() => active && onDateSelect(day)}
                    className={cn(
                      "w-full h-full flex flex-col p-3 transition-all relative group",
                      !active && "opacity-10 cursor-default",
                      active && "hover:bg-gray-50 dark:hover:bg-white/5",
                      selected && "bg-indigo-600 dark:bg-indigo-500 shadow-xl z-20",
                      spanned && !selected && "bg-indigo-50 dark:bg-indigo-500/10",
                      isToday(day) && !selected && "ring-1 ring-inset ring-indigo-500/50"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-bold transition-colors",
                      selected ? "text-white" : (active ? "text-gray-900 dark:text-gray-100" : "text-gray-400"),
                      isToday(day) && !selected && "text-indigo-600 dark:text-indigo-400 font-black"
                    )}>
                      {format(day, "d")}
                    </span>

                    <div className="mt-auto flex gap-1">
                      {holiday && <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                      {memoed && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />}
                    </div>

                    {holiday && active && (
                      <div className="absolute top-2 right-2 text-[8px] font-bold text-rose-500/40 opacity-0 group-hover:opacity-100 uppercase transition-opacity">
                        {holiday}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <footer className="mt-10 pt-8 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
            <div className="text-xs font-medium text-gray-500">
              {rangeStart ? (
                rangeEnd ? `${format(rangeStart, "MMM d")} - ${format(rangeEnd, "MMM d")}` : format(rangeStart, "MMMM d, yyyy")
              ) : "Select a date to start"}
            </div>

            <div className="flex gap-4">
              {(rangeStart || rangeEnd) && (
                <button onClick={() => { setRangeStart(null); setRangeEnd(null); }} className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
                  Clear
                </button>
              )}
              {rangeStart && (
                <button
                  onClick={() => setEditorOpen(true)}
                  className="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Create Memo
                </button>
              )}
            </div>
          </footer>
        </main>
      </div>

      <AnimatePresence>
        {editorOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setEditorOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#1C1C1E] p-8 rounded-[32px] shadow-2xl border border-white/10"
            >
              <h4 className="text-lg font-bold mb-6 dark:text-white">New Memo</h4>
              <textarea
                autoFocus
                value={memoText}
                onChange={e => setMemoText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-32 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl resize-none border-none focus:ring-1 focus:ring-indigo-500 text-sm dark:text-white"
              />
              <div className="flex gap-3 mt-8">
                <button onClick={saveMemo} className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold">
                  Save
                </button>
                <button onClick={() => setEditorOpen(false)} className="px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-2xl text-sm font-bold">
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
