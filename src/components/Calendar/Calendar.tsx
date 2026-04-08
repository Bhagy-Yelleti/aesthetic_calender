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

interface Note {
  id: string;
  date: Date;
  content: string;
}

const THEME_DATA: Record<number, { pic: string; mood: string }> = {
  0: { pic: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a", mood: "Winter Calm" },
  1: { pic: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", mood: "Springing Up" },
  2: { pic: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7", mood: "Cherry Petals" },
  3: { pic: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa", mood: "Fresh Fields" },
  4: { pic: "https://images.unsplash.com/photo-1500382017468-9049fed747ef", mood: "Garden Walk" },
  5: { pic: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", mood: "Beach Vibes" },
  6: { pic: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1", mood: "Warm Sunset" },
  7: { pic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", mood: "Forest Path" },
  8: { pic: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee", mood: "Golden Hour" },
  9: { pic: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", mood: "Autumn Drift" },
  10: { pic: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e", mood: "Misty Evening" },
  11: { pic: "https://images.unsplash.com/photo-1512389142860-9c449e58a543", mood: "Snowy Night" },
};

const FEAST_DAYS: Record<string, string> = {
  "01-01": "New Year",
  "02-14": "Valentine",
  "10-31": "Halloween",
  "12-25": "Christmas",
};

export default function Calendar() {
  const [viewedDate, setViewedDate] = useState(new Date());
  const [currentSelection, setCurrentSelection] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [memos, setMemos] = useState<Note[]>([]);
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const [activeNoteText, setActiveNoteText] = useState("");

  const currentMonthIdx = viewedDate.getMonth();
  const currentMeta = THEME_DATA[currentMonthIdx];

  useEffect(() => {
    const data = localStorage.getItem("planner_memos");
    if (data) {
      setMemos(JSON.parse(data).map((m: any) => ({ ...m, date: new Date(m.date) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("planner_memos", JSON.stringify(memos));
  }, [memos]);

  const datesToDisplay = useMemo(() => {
    const start = startOfMonth(viewedDate);
    return eachDayOfInterval({
      start: startOfWeek(start),
      end: endOfWeek(endOfMonth(start)),
    });
  }, [viewedDate]);

  const selectDate = (d: Date) => {
    if (!currentSelection.start || (currentSelection.start && currentSelection.end)) {
      setCurrentSelection({ start: d, end: null });
    } else {
      if (d < currentSelection.start) {
        setCurrentSelection({ start: d, end: currentSelection.start });
      } else {
        setCurrentSelection({ start: currentSelection.start, end: d });
      }
    }
  };

  const moveMonth = (val: number) => {
    setViewedDate(addMonths(viewedDate, val));
  };

  const addMemo = () => {
    if (!activeNoteText.trim() || !currentSelection.start) return;
    const newMemo: Note = {
      id: Math.random().toString(36).slice(2, 9),
      date: currentSelection.start,
      content: activeNoteText,
    };
    setMemos(prev => [...prev, newMemo]);
    setActiveNoteText("");
    setIsNoteDrawerOpen(false);
  };

  const getDayStatus = (d: Date) => {
    const active = isSameMonth(d, viewedDate);
    const start = currentSelection.start && isSameDay(d, currentSelection.start);
    const end = currentSelection.end && isSameDay(d, currentSelection.end);
    const inRange = currentSelection.start && currentSelection.end && isWithinInterval(d, { start: currentSelection.start, end: currentSelection.end });
    return { active, start, end, inRange };
  };

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto pb-20 relative">
      <GlobalEffects month={currentMonthIdx} />

      <header className="px-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 text-[10px] font-black opacity-30 uppercase tracking-[0.5em]">
          <span>Archive</span>
          <span>/</span>
          <span>Personal Space</span>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-9xl transition-transform hover:scale-105">
            {currentMonthIdx === 2 || currentMonthIdx === 3 ? "🌸" :
              currentMonthIdx >= 5 && currentMonthIdx <= 7 ? "🌊" :
                currentMonthIdx >= 8 && currentMonthIdx <= 10 ? "🍂" : "❄️"}
          </div>
          <div>
            <h1 className="text-7xl font-black tracking-tighter leading-none mb-3">
              {format(viewedDate, "MMMM yyyy")}
            </h1>
            <p className="text-xl font-bold opacity-40 italic tracking-widest uppercase">
              {currentMeta.mood}
            </p>
          </div>
        </div>
      </header>

      <section className="relative h-72 mx-6 rounded-[60px] overflow-hidden group shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentMonthIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            src={currentMeta.pic}
            className="w-full h-full object-cover grayscale-[30%] dark:grayscale-[50%] brightness-95 dark:brightness-40 group-hover:scale-105 transition-transform duration-[2s]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-10 right-10 flex gap-4">
          <button onClick={() => moveMonth(-1)} className="p-4 rounded-[30px] bg-white/10 backdrop-blur-3xl border border-white/20 hover:bg-white/20 transition-all">
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button onClick={() => moveMonth(1)} className="p-4 rounded-[30px] bg-white/10 backdrop-blur-3xl border border-white/20 hover:bg-white/20 transition-all">
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>
      </section>

      <div className="grid lg:grid-cols-[300px_1fr] gap-20 px-6">
        <aside className="space-y-16">
          <div className="space-y-8">
            <h3 className="text-[10px] font-black opacity-40 uppercase tracking-[0.5em]">Upcoming</h3>
            <div className="space-y-8 max-h-[500px] overflow-y-auto custom-scrollbar pr-6">
              {memos.filter(m => isSameMonth(m.date, viewedDate)).length === 0 ? (
                <p className="text-xs font-bold opacity-20">Blank canvas...</p>
              ) : (
                memos.filter(m => isSameMonth(m.date, viewedDate)).map(m => (
                  <div key={m.id} className="relative group pl-5 border-l-2 border-indigo-500/20">
                    <span className="text-[10px] font-black text-indigo-400 mb-2 block">{format(m.date, "MMM dd")}</span>
                    <p className="text-sm font-medium leading-[1.6] opacity-90">{m.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-[10px] font-black opacity-40 uppercase tracking-[0.5em]">Holidays</h3>
            <div className="space-y-5">
              {Object.entries(FEAST_DAYS).map(([day, name]) => {
                const yr = viewedDate.getFullYear();
                const d = new Date(`${yr}-${day}`);
                if (isSameMonth(d, viewedDate)) {
                  return (
                    <div key={day} className="flex flex-col gap-1">
                      <span className="text-sm font-black">{name}</span>
                      <span className="text-[10px] font-black text-rose-500 opacity-60">{format(d, "MMMM do")}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </aside>

        <main>
          <div className="grid grid-cols-7 mb-16 px-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-[10px] font-black opacity-20 uppercase tracking-[0.6em]">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-10">
            {datesToDisplay.map(day => {
              const { active, start, end, inRange } = getDayStatus(day);
              const isSelected = start || end;
              const feast = FEAST_DAYS[format(day, "MM-dd")];
              const memoCount = memos.filter(m => isSameDay(m.date, day)).length;

              return (
                <div key={day.toISOString()} className="h-16 flex items-center justify-center">
                  <button
                    onClick={() => active && selectDate(day)}
                    className={cn(
                      "w-16 h-16 rounded-[24px] flex flex-col items-center justify-center transition-all duration-400 relative",
                      !active && "opacity-0 cursor-default",
                      active && "hover:bg-gray-100 dark:hover:bg-white/5",
                      isSelected && "bg-black dark:bg-white scale-110 z-10 shadow-3xl",
                      inRange && !isSelected && "bg-gray-50 dark:bg-white/5",
                      isToday(day) && !isSelected && "ring-2 ring-indigo-500/20"
                    )}
                  >
                    <span className={cn(
                      "text-xl font-black",
                      isSelected ? "text-white dark:text-black" : (isToday(day) ? "text-indigo-500" : "")
                    )}>
                      {format(day, "d")}
                    </span>

                    {memoCount > 0 && !isSelected && (
                      <div className="absolute bottom-2.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                    {feast && active && (
                      <div className="absolute top-1 right-2 p-1">
                        <Sparkles className="w-2.5 h-2.5 text-rose-400 opacity-40" />
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <footer className="mt-20 pt-12 border-t border-gray-100 dark:border-white/5 flex items-center justify-between px-4">
            <div className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">
              {currentSelection.start ? (
                currentSelection.end ? `${format(currentSelection.start, "MMM dd")} - ${format(currentSelection.end, "MMM dd")}` : format(currentSelection.start, "MMMM dd, yyyy")
              ) : "Select a date"}
            </div>
            <div className="flex gap-10">
              {currentSelection.start && (
                <button
                  onClick={() => setIsNoteDrawerOpen(true)}
                  className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-[22px] text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                >
                  New Plan
                </button>
              )}
              {currentSelection.start && (
                <button
                  onClick={() => setCurrentSelection({ start: null, end: null })}
                  className="text-[10px] font-black opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
            </div>
          </footer>
        </main>
      </div>

      <AnimatePresence>
        {isNoteDrawerOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
              onClick={() => setIsNoteDrawerOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#111111] p-12 rounded-[60px] shadow-3xl overflow-hidden"
            >
              <h2 className="text-3xl font-black tracking-tighter mb-10">New Memo</h2>
              <textarea
                autoFocus
                value={activeNoteText}
                onChange={e => setActiveNoteText(e.target.value)}
                placeholder="What's the plan?"
                className="w-full h-48 p-8 bg-gray-50 dark:bg-white/5 rounded-[36px] resize-none border-none focus:ring-1 focus:ring-black dark:focus:ring-white text-lg font-medium"
              />
              <div className="flex gap-5 mt-12">
                <button onClick={addMemo} className="flex-1 py-5 bg-black dark:bg-white text-white dark:text-black rounded-[28px] text-sm font-black uppercase tracking-widest">
                  Save
                </button>
                <button onClick={() => setIsNoteDrawerOpen(false)} className="px-8 py-5 bg-gray-100 dark:bg-white/5 opacity-50 rounded-[28px] text-sm font-black uppercase tracking-widest">
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
