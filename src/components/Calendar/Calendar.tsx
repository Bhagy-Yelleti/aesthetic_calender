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
  isToday
} from "date-fns";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { GlobalEffects } from "./animations";

interface PlannerNote {
  id: string;
  date: Date;
  content: string;
}

const SEASONS: Record<number, { img: string; title: string }> = {
  0: { img: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a", title: "Winter Silence" },
  1: { img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", title: "Early Bloom" },
  2: { img: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7", title: "Spring Sakura" },
  3: { img: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa", title: "Fresh Fields" },
  4: { img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef", title: "Garden Walk" },
  5: { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", title: "Summer Shores" },
  6: { img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1", title: "Warm Sunset" },
  7: { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", title: "Forest Path" },
  8: { img: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee", title: "Golden Hour" },
  9: { img: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", title: "Autumn Drift" },
  10: { img: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e", title: "Misty Evening" },
  11: { img: "https://images.unsplash.com/photo-1512389142860-9c449e58a543", title: "Snowy Night" },
};

const FEASTS: Record<string, string> = {
  "01-01": "New Year",
  "02-14": "Valentine",
  "10-31": "Halloween",
  "12-25": "Christmas",
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selection, setSelection] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [allNotes, setAllNotes] = useState<PlannerNote[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorText, setEditorText] = useState("");

  const currentMonthIdx = currentDate.getMonth();
  const meta = SEASONS[currentMonthIdx];

  useEffect(() => {
    const saved = localStorage.getItem("luminar_planner_v2");
    if (saved) {
      setAllNotes(JSON.parse(saved).map((n: any) => ({ ...n, date: new Date(n.date) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("luminar_planner_v2", JSON.stringify(allNotes));
  }, [allNotes]);

  const gridDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(start);
    return eachDayOfInterval({
      start: startOfWeek(start),
      end: endOfWeek(end),
    });
  }, [currentDate]);

  const onDayClick = (day: Date) => {
    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: day, end: null });
    } else {
      if (day < selection.start) {
        setSelection({ start: day, end: selection.start });
      } else {
        setSelection({ start: selection.start, end: day });
      }
    }
  };

  const navMonth = (offset: number) => {
    setCurrentDate(addMonths(currentDate, offset));
  };

  const onSave = () => {
    if (!editorText.trim() || !selection.start) return;
    const note: PlannerNote = {
      id: Math.random().toString(36).slice(7),
      date: selection.start,
      content: editorText,
    };
    setAllNotes(prev => [...prev, note]);
    setEditorText("");
    setEditorOpen(false);
  };

  const monthNotes = allNotes.filter(n => isSameMonth(n.date, currentDate));

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto px-6 relative z-10">
      <GlobalEffects month={currentMonthIdx} />

      <header className="flex flex-col gap-8">
        <div className="flex items-center gap-3 text-[10px] font-extrabold opacity-30 uppercase tracking-[0.4em]">
          <span>Project</span>
          <span>/</span>
          <span>Workspace</span>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-9xl transition-all duration-700">
            {currentMonthIdx === 2 || currentMonthIdx === 3 ? "💮" :
              currentMonthIdx >= 5 && currentMonthIdx <= 7 ? "🌊" :
                currentMonthIdx >= 8 && currentMonthIdx <= 10 ? "🍁" : "❅"}
          </div>
          <div>
            <h1 className="text-7xl font-black text-[var(--app-text)] tracking-tighter mb-4 leading-none">
              {format(currentDate, "MMMM yyyy")}
            </h1>
            <p className="text-xl font-bold opacity-40 uppercase tracking-[0.3em] font-sans">
              {meta.title}
            </p>
          </div>
        </div>
      </header>

      <section className="relative h-80 rounded-[50px] overflow-hidden shadow-2xl bg-gray-100 dark:bg-white/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentMonthIdx}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            src={meta.img}
            className="w-full h-full object-cover dark:brightness-[0.4] brightness-90 transition-all duration-1000"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="absolute bottom-8 right-8 flex gap-4">
          <button onClick={() => navMonth(-1)} className="p-4 rounded-[28px] bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/30 transition-all active:scale-90">
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button onClick={() => navMonth(1)} className="p-4 rounded-[28px] bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/30 transition-all active:scale-90">
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>
      </section>

      <div className="grid lg:grid-cols-[280px_1fr] gap-20">
        <aside className="space-y-16">
          <div className="space-y-8">
            <h4 className="text-[10px] font-black opacity-30 uppercase tracking-[0.6em]">Recent</h4>
            <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
              {monthNotes.length === 0 ? (
                <p className="text-xs font-bold opacity-20">Nothing planned.</p>
              ) : (
                monthNotes.map(n => (
                  <div key={n.id} className="relative group pl-5 border-l-2 border-indigo-500/30 hover:border-indigo-500 transition-colors">
                    <span className="text-[10px] font-black text-indigo-500 mb-2 block">{format(n.date, "MMM dd")}</span>
                    <p className="text-sm font-medium opacity-80 leading-relaxed text-[var(--app-text)]">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black opacity-30 uppercase tracking-[0.6em]">Festivals</h4>
            <div className="space-y-5">
              {Object.entries(FEASTS).map(([m_d, title]) => {
                const yr = currentDate.getFullYear();
                const d = new Date(`${yr}-${m_d}`);
                if (isSameMonth(d, currentDate)) {
                  return (
                    <div key={m_d} className="flex flex-col gap-1">
                      <span className="text-sm font-black text-[var(--app-text)]">{title}</span>
                      <span className="text-[10px] font-black text-rose-400 opacity-60 uppercase">{format(d, "MMMM do")}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </aside>

        <main className="flex flex-col">
          <div className="grid grid-cols-7 mb-12 opacity-30">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-[var(--app-text)]">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-8">
            {gridDays.map(day => {
              const active = isSameMonth(day, currentDate);
              const start = selection.start && isSameDay(day, selection.start);
              const end = selection.end && isSameDay(day, selection.end);
              const grouped = selection.start && selection.end && isWithinInterval(day, { start: selection.start, end: selection.end });
              const today = isToday(day);
              const noted = allNotes.some(n => isSameDay(n.date, day));

              return (
                <div key={day.toISOString()} className="h-16 flex items-center justify-center">
                  <button
                    onClick={() => active && onDayClick(day)}
                    className={cn(
                      "w-14 h-14 rounded-[22px] flex flex-col items-center justify-center transition-all duration-300 relative",
                      !active && "opacity-0 cursor-default",
                      active && "hover:bg-gray-100 dark:hover:bg-white/5",
                      (start || end) && "bg-black dark:bg-white text-white dark:text-black scale-110 z-10 shadow-2xl",
                      grouped && !(start || end) && "bg-gray-100 dark:bg-white/10",
                      today && !(start || end) && "border-2 border-indigo-400/30"
                    )}
                  >
                    <span className={cn(
                      "text-xl font-black",
                      (start || end) ? "text-white dark:text-black" : (today ? "text-indigo-500" : "text-[var(--app-text)]")
                    )}>
                      {format(day, "d")}
                    </span>

                    {noted && !(start || end) && (
                      <div className="absolute bottom-2.5 w-1 h-1 rounded-full bg-indigo-500" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <footer className="mt-16 pt-12 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] text-[var(--app-text)]">
              {selection.start ? (
                selection.end ? `${format(selection.start, "MMM dd")} - ${format(selection.end, "MMM dd")}` : format(selection.start, "MMMM dd, yyyy")
              ) : "Select date"}
            </div>

            <div className="flex gap-10">
              {selection.start && (
                <button
                  onClick={() => setEditorOpen(true)}
                  className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-[24px] text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                >
                  Write
                </button>
              )}
              {selection.start && (
                <button
                  onClick={() => setSelection({ start: null, end: null })}
                  className="text-[10px] font-black opacity-30 hover:opacity-100 transition-opacity uppercase tracking-widest text-[var(--app-text)]"
                >
                  Reset
                </button>
              )}
            </div>
          </footer>
        </main>
      </div>

      <AnimatePresence>
        {editorOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
              onClick={() => setEditorOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0A0A0A] p-12 rounded-[60px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/5"
            >
              <h2 className="text-3xl font-black mb-10 text-[var(--app-text)] tracking-tighter">Plan</h2>
              <textarea
                autoFocus
                value={editorText}
                onChange={e => setEditorText(e.target.value)}
                placeholder="..."
                className="w-full h-48 p-8 bg-gray-50 dark:bg-white/5 rounded-[36px] resize-none border-none focus:ring-1 focus:ring-black dark:focus:ring-white text-lg font-bold text-[var(--app-text)]"
              />
              <div className="flex gap-4 mt-12">
                <button onClick={onSave} className="flex-1 py-5 bg-black dark:bg-white text-white dark:text-black rounded-[28px] text-xs font-black uppercase tracking-widest">
                  Save
                </button>
                <button onClick={() => setEditorOpen(false)} className="px-8 py-5 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-[28px] text-xs font-black uppercase tracking-widest">
                  Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
