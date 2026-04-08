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
  addDays,
  isToday
} from "date-fns";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { GlobalEffects } from "./animations";

interface UserMemo {
  id: string;
  date: Date;
  text: string;
}

const MONTH_METADATA: Record<number, { cover: string; quote: string }> = {
  0: { cover: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a", quote: "Winter Silence" },
  1: { cover: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", quote: "Early Bloom" },
  2: { cover: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7", quote: "Spring Sakura" },
  3: { cover: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa", quote: "Fresh Green" },
  4: { cover: "https://images.unsplash.com/photo-1500382017468-9049fed747ef", quote: "Garden Lush" },
  5: { cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", quote: "Summer Shores" },
  6: { cover: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1", quote: "Sunray Peak" },
  7: { cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", quote: "North Woods" },
  8: { cover: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee", quote: "Golden Fields" },
  9: { cover: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", quote: "Copper Leaves" },
  10: { cover: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e", quote: "Misty Eve" },
  11: { cover: "https://images.unsplash.com/photo-1512389142860-9c449e58a543", quote: "Starry Snow" },
};

const IMPORTANT_DATES: Record<string, string> = {
  "01-01": "New Year's",
  "02-14": "Valentine's",
  "10-31": "Halloween",
  "12-25": "Christmas",
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selection, setSelection] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [userMemos, setUserMemos] = useState<UserMemo[]>([]);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [activeMemoText, setActiveMemoText] = useState("");

  const activeMonthIndex = currentDate.getMonth();
  const activeMeta = MONTH_METADATA[activeMonthIndex];

  useEffect(() => {
    const data = localStorage.getItem("calendar_data");
    if (data) {
      setUserMemos(JSON.parse(data).map((item: any) => ({ ...item, date: new Date(item.date) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar_data", JSON.stringify(userMemos));
  }, [userMemos]);

  const daysToRender = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(monthEnd),
    });
  }, [currentDate]);

  const handleDateInteraction = (d: Date) => {
    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: d, end: null });
    } else {
      if (d < selection.start) {
        setSelection({ start: d, end: selection.start });
      } else {
        setSelection({ start: selection.start, end: d });
      }
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(addMonths(currentDate, direction));
  };

  const saveMemo = () => {
    if (!activeMemoText.trim() || !selection.start) return;
    const memo: UserMemo = {
      id: Math.random().toString(36).slice(2),
      date: selection.start,
      text: activeMemoText,
    };
    setUserMemos(prev => [...prev, memo]);
    setActiveMemoText("");
    setIsEditorVisible(false);
  };

  const currentMonthMemos = userMemos.filter(m => isSameMonth(m.date, currentDate));

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-12 select-none">
      <GlobalEffects month={activeMonthIndex} />

      {/* Header Section */}
      <header className="px-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">
          <span>Notion</span>
          <span className="opacity-30">/</span>
          <span className="text-black dark:text-white">Planning</span>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-9xl">
            {activeMonthIndex === 11 ? "🎁" : activeMonthIndex <= 1 ? "❄️" : activeMonthIndex <= 4 ? "🌸" : "⛱️"}
          </div>
          <div className="flex flex-col">
            <h1 className="text-6xl font-black text-black dark:text-white tracking-tighter">
              {format(currentDate, "MMMM yyyy")}
            </h1>
            <p className="text-lg font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest italic opacity-60">
              "{activeMeta.quote}"
            </p>
          </div>
        </div>
      </header>

      {/* Banner Section */}
      <section className="relative h-72 mx-6 rounded-[50px] overflow-hidden shadow-2xl bg-gray-100 dark:bg-white/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeMonthIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            src={activeMeta.cover}
            className="w-full h-full object-cover dark:brightness-[0.45] brightness-[0.85]"
          />
        </AnimatePresence>
        <div className="absolute bottom-8 right-8 flex gap-4">
          <button onClick={() => navigateMonth(-1)} className="p-4 rounded-[24px] bg-white/20 backdrop-blur-2xl border border-white/30 hover:bg-white/40 transition-all">
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button onClick={() => navigateMonth(1)} className="p-4 rounded-[24px] bg-white/20 backdrop-blur-2xl border border-white/30 hover:bg-white/40 transition-all">
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>
      </section>

      {/* Main Grid & Side Panels */}
      <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-16 px-6">
        <aside className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Memos</h3>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4">
              {currentMonthMemos.length === 0 ? (
                <p className="text-xs text-gray-400 font-bold opacity-30">No plans yet...</p>
              ) : (
                currentMonthMemos.map(m => (
                  <div key={m.id} className="group">
                    <span className="text-[10px] font-black text-indigo-500 mb-2 block">{format(m.date, "MMM dd")}</span>
                    <p className="text-sm text-black dark:text-white leading-relaxed font-medium">{m.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Holidays</h3>
            <div className="space-y-4">
              {Object.entries(IMPORTANT_DATES).map(([key, value]) => {
                const year = currentDate.getFullYear();
                const d = new Date(`${year}-${key}`);
                if (isSameMonth(d, currentDate)) {
                  return (
                    <div key={key} className="flex flex-col gap-1">
                      <span className="text-sm font-black text-black dark:text-white">{value}</span>
                      <span className="text-[10px] font-black text-rose-500 opacity-60 uppercase">{format(d, "MMMM do")}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-7 mb-12">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.5em]">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-6">
            {daysToRender.map(day => {
              const belongsToMonth = isSameMonth(day, currentDate);
              const isStartOfRange = selection.start && isSameDay(day, selection.start);
              const isEndOfRange = selection.end && isSameDay(day, selection.end);
              const isCurrentRange = selection.start && selection.end && isWithinInterval(day, { start: selection.start, end: selection.end });
              const isTodayDate = isToday(day);
              const hasMemo = userMemos.some(m => isSameDay(m.date, day));

              return (
                <div key={day.toISOString()} className="h-20 flex items-center justify-center">
                  <button
                    onClick={() => belongsToMonth && handleDateInteraction(day)}
                    className={cn(
                      "w-14 h-14 rounded-[20px] flex flex-col items-center justify-center transition-all duration-300 relative",
                      !belongsToMonth && "opacity-0 cursor-default",
                      belongsToMonth && "hover:bg-gray-100 dark:hover:bg-white/10",
                      (isStartOfRange || isEndOfRange) && "bg-black dark:bg-white text-white dark:text-black scale-110 z-10 shadow-xl",
                      isCurrentRange && !(isStartOfRange || isEndOfRange) && "bg-gray-100 dark:bg-white/10",
                      isTodayDate && !(isStartOfRange || isEndOfRange) && "border-2 border-indigo-500/30"
                    )}
                  >
                    <span className={cn(
                      "text-lg font-black",
                      (isStartOfRange || isEndOfRange)
                        ? (isStartOfRange || isEndOfRange) && selection.start && selection.end ? "text-white dark:text-black" : "text-white dark:text-black"
                        : (isTodayDate ? "text-indigo-600 dark:text-indigo-400" : "text-black dark:text-white")
                    )}>
                      {format(day, "d")}
                    </span>

                    {hasMemo && !isStartOfRange && !isEndOfRange && (
                      <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-10">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
              {selection.start ? (
                selection.end ? `${format(selection.start, "MMM dd")} - ${format(selection.end, "MMM dd")}` : format(selection.start, "MMMM dd, yyyy")
              ) : "Select a time"}
            </div>

            <div className="flex gap-8">
              {selection.start && (
                <button
                  onClick={() => setIsEditorVisible(true)}
                  className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Write Memo
                </button>
              )}
              {selection.start && (
                <button
                  onClick={() => setSelection({ start: null, end: null })}
                  className="text-[10px] font-black text-gray-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isEditorVisible && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xl"
              onClick={() => setIsEditorVisible(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#121212] p-12 rounded-[50px] shadow-2xl"
            >
              <h4 className="text-2xl font-black mb-10 dark:text-white">New Memo</h4>
              <textarea
                autoFocus
                value={activeMemoText}
                onChange={e => setActiveMemoText(e.target.value)}
                placeholder="Details..."
                className="w-full h-48 p-8 bg-gray-50 dark:bg-white/5 rounded-[30px] resize-none border-none focus:ring-1 focus:ring-black dark:focus:ring-white text-base dark:text-white font-medium"
              />
              <div className="flex gap-4 mt-12">
                <button onClick={saveMemo} className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black rounded-[24px] text-xs font-black uppercase tracking-widest">
                  Save
                </button>
                <button onClick={() => setIsEditorVisible(false)} className="px-6 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-[24px] text-xs font-black uppercase tracking-widest">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
