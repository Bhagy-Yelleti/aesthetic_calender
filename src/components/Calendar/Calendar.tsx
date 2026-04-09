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
  isToday,
  isBefore
} from "date-fns";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  StickyNote,
  Calendar as CalendarIcon,
  Trash2,
  X,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { GlobalEffects } from "./animations";
import { MONTHS_THEMES } from "@/src/lib/themes";

interface RangeNote {
  id: string;
  start: Date;
  end: Date;
  content: string;
  category: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [range, setRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<RangeNote[]>([]);
  const [isNoteInputOpen, setIsNoteInputOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [direction, setDirection] = useState(0);

  const currentMonthIdx = currentDate.getMonth();
  const theme = MONTHS_THEMES[currentMonthIdx];

  useEffect(() => {
    const saved = localStorage.getItem("lumina_v3_submission");
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((n: any) => ({
          ...n,
          start: new Date(n.start),
          end: new Date(n.end)
        }));
        setNotes(parsed);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lumina_v3_submission", JSON.stringify(notes));
  }, [notes]);

  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(start);
    return eachDayOfInterval({ start: startOfWeek(start), end: endOfWeek(end) });
  }, [currentDate]);

  const handleDateClick = (date: Date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else {
      if (isBefore(date, range.start)) {
        setRange({ start: date, end: range.start });
      } else {
        setRange({ start: range.start, end: date });
      }
    }
  };

  const navMonth = (offset: number) => {
    setDirection(offset);
    setCurrentDate(addMonths(currentDate, offset));
  };

  const saveNote = () => {
    if (!noteContent.trim() || !range.start || !range.end) return;
    const newNote: RangeNote = {
      id: Math.random().toString(36).substring(7),
      start: range.start,
      end: range.end,
      content: noteContent,
      category: "Focus Area"
    };
    setNotes([...notes, newNote]);
    setNoteContent("");
    setIsNoteInputOpen(false);
  };

  const deleteNote = (id: string) => setNotes(notes.filter(n => n.id !== id));

  const getDayStatus = (day: Date) => {
    const isStart = range.start && isSameDay(day, range.start);
    const isEnd = range.end && isSameDay(day, range.end);

    let isInRange = false;
    if (range.start && range.end) {
      isInRange = isWithinInterval(day, { start: range.start, end: range.end });
    }

    let isPreview = false;
    if (range.start && !range.end && hoverDate) {
      const interval = isBefore(hoverDate, range.start)
        ? { start: hoverDate, end: range.start }
        : { start: range.start, end: hoverDate };
      isPreview = isWithinInterval(day, interval);
    }

    const hasNote = notes.some(n => isWithinInterval(day, { start: n.start, end: n.end }));

    return { isStart, isEnd, isInRange, isPreview, hasNote };
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto min-h-screen flex flex-col lg:flex-row gap-12 px-6 lg:px-12 py-8">
      <GlobalEffects month={currentMonthIdx} />

      {/* Physical Hero Panel */}
      <aside className="lg:w-[420px] flex-shrink-0 flex flex-col gap-8">
        <section className="calendar-card rounded-[48px] overflow-hidden relative group h-[500px] layered-card">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={currentMonthIdx}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "circOut" }}
              src={theme.heroImage}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-12 left-10 right-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl drop-shadow-2xl">{theme.emoji}</span>
              <div className="h-px flex-1 bg-white/20" />
            </div>
            <h3 className="text-white text-4xl font-display font-black tracking-tight leading-[1.1]">
              {theme.quote}
            </h3>
          </div>

          <div className="absolute top-10 right-10 flex gap-4">
            <button onClick={() => navMonth(-1)} className="p-4 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => navMonth(1)} className="p-4 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        <div className="calendar-card p-10 rounded-[40px] flex items-start gap-6 group hover:translate-y-[-4px] transition-all">
          <div style={{ backgroundColor: theme.primary }} className="w-14 h-14 rounded-3xl flex items-center justify-center shadow-xl animate-pulse">
            <Sparkles className="text-white w-7 h-7" />
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-40">Seasonal Engine</h5>
            <p className="text-sm font-bold opacity-70 leading-relaxed">
              Dynamically rendering {theme.name}'s specific metadata and color fields.
            </p>
          </div>
        </div>
      </aside>

      {/* Wall Calendar Main Grid */}
      <main className="flex-1 flex flex-col gap-12">
        <div className="calendar-card rounded-[56px] p-10 lg:p-16 relative overflow-hidden layered-card">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-4 opacity-30">
                <CalendarIcon className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.5em]">Temporal Ledger</span>
              </div>
              <h2 className="text-6xl lg:text-8xl font-display font-black tracking-tighter leading-none">
                {format(currentDate, "MMMM")} <span className="text-stroke font-outline-2 opacity-20">{format(currentDate, "yyyy")}</span>
              </h2>
            </div>

            <div className="flex items-center bg-gray-100 dark:bg-white/5 p-2.5 rounded-[28px] self-start border border-black/5 dark:border-white/5">
              {["MT", "WK", "SY"].map(t => (
                <button key={t} className={cn("px-8 py-3 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all", t === "MT" ? "bg-white dark:bg-white/10 shadow-lg text-indigo-600 dark:text-indigo-400" : "opacity-30")}>
                  {t}
                </button>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-7 mb-10 gap-4 opacity-20">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-[11px] font-black uppercase tracking-[0.4em]">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-4 gap-x-0 relative z-10">
            {days.map((day, i) => {
              const inMonth = isSameMonth(day, currentDate);
              const { isStart, isEnd, isInRange, isPreview, hasNote } = getDayStatus(day);
              const today = isToday(day);

              return (
                <div key={i} className="relative aspect-square px-1 group">
                  {/* Range Highlight Background */}
                  {(isInRange || isPreview) && inMonth && (
                    <motion.div
                      layoutId="range-bg"
                      className={cn(
                        "absolute inset-y-2 inset-x-0 z-0",
                        isInRange ? "bg-indigo-500/10" : "bg-indigo-500/5",
                        isStart && "rounded-l-full",
                        isEnd && "rounded-r-full",
                        !isStart && !isEnd && "rounded-none"
                      )}
                    />
                  )}

                  <motion.button
                    whileHover={{ scale: inMonth ? 1.1 : 1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => inMonth && setHoverDate(day)}
                    onMouseLeave={() => setHoverDate(null)}
                    onClick={() => inMonth && handleDateClick(day)}
                    className={cn(
                      "w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300 relative z-10",
                      !inMonth && "opacity-0 cursor-default",
                      (isStart || isEnd) ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-[0_8px_20px_-4px_rgba(79,70,229,0.4)]" : "text-[var(--app-text)] hover:bg-gray-100 dark:hover:bg-white/5",
                      today && !isStart && !isEnd && "ring-2 ring-indigo-500/30 ring-offset-4 ring-offset-transparent",
                    )}
                  >
                    <span className={cn(
                      "text-xl font-display font-black",
                      (isStart || isEnd) && "text-white"
                    )}>
                      {format(day, "d")}
                    </span>

                    {/* Indicators */}
                    {hasNote && !isStart && !isEnd && (
                      <div className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {range.start && range.end && (
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-12 py-6 rounded-full shadow-3xl flex items-center gap-10 z-[100] border border-white/10"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-1">Duration</span>
                  <div className="flex items-center gap-3 text-base font-black font-display">
                    {format(range.start, "MMM d")} <ArrowRight className="w-4 h-4 opacity-40" /> {format(range.end, "MMM d")}
                  </div>
                </div>
                <div className="h-10 w-px bg-white/20 dark:bg-black/20" />
                <div className="flex gap-6">
                  <button onClick={() => setRange({ start: null, end: null })} className="text-xs font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">Void</button>
                  <button onClick={() => setIsNoteInputOpen(true)} className="px-10 py-3.5 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-[0.4em] hover:scale-105 transition-all">Scribe</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Persistence Section */}
        <section className="grid lg:grid-cols-2 gap-10">
          <div className="calendar-card rounded-[48px] p-12 flex flex-col gap-10 min-h-[450px]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <StickyNote className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-display font-black">Memory Archives</h3>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-black opacity-40 uppercase tracking-widest">{notes.length} Active</div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8">
              {notes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 gap-6">
                  <CalendarIcon className="w-16 h-16 stroke-[1px]" />
                  <p className="text-sm font-bold uppercase tracking-[0.5em]">Tied to temporal grid...</p>
                </div>
              ) : (
                notes.map(note => (
                  <motion.div
                    layout
                    key={note.id}
                    className="p-10 rounded-[40px] bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                          {format(note.start, "MMM d")} <ArrowRight className="w-3 h-3 opacity-30" /> {format(note.end, "MMM d")}
                        </span>
                        <h6 className="text-[10px] font-black opacity-30 uppercase tracking-[0.5em]">{note.category}</h6>
                      </div>
                      <button onClick={() => deleteNote(note.id)} className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-lg font-medium leading-relaxed opacity-80">{note.content}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="calendar-card rounded-[48px] p-12 flex flex-col items-center justify-center text-center gap-10 bg-indigo-600 text-white border-none shadow-indigo-600/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="w-24 h-24 bg-white/20 rounded-[36px] flex items-center justify-center animate-float relative z-10 border border-white/20 shadow-2xl">
              <Sparkles className="w-12 h-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-display font-black mb-4">Submission Context</h3>
              <p className="text-white/70 text-base leading-relaxed max-w-xs font-medium tracking-tight">
                Premium engineering logic applied to temporal mapping and persistence systems.
              </p>
            </div>
            <div className="flex gap-4 relative z-10">
              <div className="px-8 py-3 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.4em]">ST-FINAL-ENGINE</div>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Range Scribe Portal */}
      <AnimatePresence>
        {isNoteInputOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
              onClick={() => setIsNoteInputOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 100, opacity: 0 }}
              className="relative w-full max-w-xl calendar-card rounded-[64px] p-16 lg:p-20 border-none bg-white dark:bg-[#0A0A0B] shadow-4xl"
            >
              <div className="mb-12 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 text-indigo-500 mb-4 font-black text-[11px] uppercase tracking-[0.4em]">
                    <StickyNote className="w-5 h-5" /> Temporal Node Creation
                  </div>
                  <h4 className="text-5xl font-display font-black tracking-tighter leading-none mb-4">
                    Notes for <span className="opacity-40">{format(range.start!, "MMM d")}</span> → <span className="opacity-40">{format(range.end!, "MMM d")}</span>
                  </h4>
                </div>
                <button onClick={() => setIsNoteInputOpen(false)} className="p-4 bg-gray-100 dark:bg-white/5 rounded-3xl hover:bg-rose-500 hover:text-white transition-all">
                  <X className="w-7 h-7" />
                </button>
              </div>

              <textarea
                autoFocus
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Log your seasonal agenda..."
                className="w-full h-56 bg-transparent text-2xl font-medium resize-none border-none focus:ring-0 placeholder:opacity-20 custom-scrollbar mb-12"
              />

              <button
                onClick={saveNote}
                className="w-full py-7 bg-indigo-600 text-white rounded-[32px] text-sm font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Sync with Temporal Grid
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
