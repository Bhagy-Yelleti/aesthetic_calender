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
  X
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
    const saved = localStorage.getItem("lumina_v3_notes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((n: any) => ({
          ...n,
          start: new Date(n.start),
          end: new Date(n.end)
        }));
        setNotes(parsed);
      } catch (e) {
        console.error("Failed to load notes", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lumina_v3_notes", JSON.stringify(notes));
  }, [notes]);

  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(start);
    const calendarStart = startOfWeek(start);
    const calendarEnd = endOfWeek(end);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
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
      category: "Personal"
    };
    setNotes([...notes, newNote]);
    setNoteContent("");
    setIsNoteInputOpen(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const getDayStatus = (day: Date) => {
    const isStart = range.start && isSameDay(day, range.start);
    const isEnd = range.end && isSameDay(day, range.end);

    let isSelectedRange = false;
    if (range.start && range.end) {
      isSelectedRange = isWithinInterval(day, { start: range.start, end: range.end });
    }

    let isPreviewRange = false;
    if (range.start && !range.end && hoverDate) {
      const interval = isBefore(hoverDate, range.start)
        ? { start: hoverDate, end: range.start }
        : { start: range.start, end: hoverDate };
      isPreviewRange = isWithinInterval(day, interval);
    }

    const hasNote = notes.some(n => isWithinInterval(day, { start: n.start, end: n.end }));

    return { isStart, isEnd, isSelectedRange, isPreviewRange, hasNote };
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 1.05
    })
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto min-h-[800px] flex flex-col lg:flex-row gap-8 px-4 lg:px-8 py-4">
      <GlobalEffects month={currentMonthIdx} />

      <aside className="lg:w-[400px] flex-shrink-0 flex flex-col gap-6">
        <section className="glass-morphism rounded-[40px] overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[450px] relative group border-none">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={currentMonthIdx}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src={theme.heroImage}
              className="w-full h-full object-cover brightness-[0.8] dark:brightness-[0.5] transition-all duration-700 group-hover:scale-105"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-3">
            <motion.span
              key={theme.emoji}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="text-4xl w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20"
            >
              {theme.emoji}
            </motion.span>
            <h3 className="text-white text-3xl font-display font-black tracking-tight leading-tight">
              {theme.quote}
            </h3>
          </div>

          <div className="absolute top-8 right-8 flex gap-3">
            <button onClick={() => navMonth(-1)} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => navMonth(1)} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        <div style={{ backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }} className="p-8 rounded-[32px] border flex items-start gap-5 group transition-all hover:bg-opacity-20 translate-y-0 hover:-translate-y-1">
          <div style={{ backgroundColor: theme.primary }} className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 block mb-1">Theme Insight</span>
            <p className="text-sm font-bold opacity-80 leading-relaxed">
              Applying {theme.name}'s palette across your planner interface.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-8">
        <div className="glass-morphism rounded-[48px] p-8 lg:p-12 relative overflow-hidden">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CalendarIcon className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Temporal Interface</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-display font-black tracking-tighter" style={{ color: "var(--app-text)" }}>
                {format(currentDate, "MMMM")} <span className="opacity-10 text-stroke font-outline-2">{format(currentDate, "yyyy")}</span>
              </h2>
            </div>

            <div className="flex items-center bg-gray-100/50 dark:bg-white/5 p-2 rounded-3xl self-start">
              {["M", "W", "S"].map(tab => (
                <button key={tab} className={cn("px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", tab === "M" ? "bg-white dark:bg-white/10 shadow-sm" : "opacity-30")}>
                  {tab}
                </button>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-7 mb-8 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-20 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-3 gap-x-1 lg:gap-x-4">
            {days.map((day, i) => {
              const inMonth = isSameMonth(day, currentDate);
              const { isStart, isEnd, isSelectedRange, isPreviewRange, hasNote } = getDayStatus(day);
              const today = isToday(day);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <div key={i} className="relative aspect-square">
                  <motion.button
                    whileHover={{ scale: inMonth ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => inMonth && setHoverDate(day)}
                    onMouseLeave={() => setHoverDate(null)}
                    onClick={() => inMonth && handleDateClick(day)}
                    className={cn(
                      "w-full h-full rounded-[24px] flex flex-col items-center justify-center transition-all duration-300 relative group",
                      !inMonth && "opacity-0 cursor-default",
                      inMonth && "hover:bg-gray-100 dark:hover:bg-white/5",
                      (isSelectedRange || isPreviewRange) && "bg-indigo-50 dark:bg-indigo-500/10",
                      isStart && "bg-indigo-600 dark:bg-indigo-500 text-white rounded-[24px] scale-105 z-10 shadow-xl",
                      isEnd && "bg-indigo-600 dark:bg-indigo-500 text-white rounded-[24px] scale-105 z-10 shadow-xl",
                      today && !isStart && !isEnd && "ring-2 ring-indigo-500/30 ring-offset-4 ring-offset-transparent",
                      isWeekend && inMonth && !isStart && !isEnd && !isSelectedRange && "opacity-40"
                    )}
                  >
                    <span className={cn(
                      "text-lg lg:text-xl font-display font-bold leading-none",
                      (isStart || isEnd) ? "text-white" : (today ? "text-indigo-600 dark:text-indigo-400" : "")
                    )}>
                      {format(day, "d")}
                    </span>

                    <div className="mt-1 flex gap-0.5">
                      {hasNote && !isStart && !isEnd && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                      )}
                    </div>

                    {isPreviewRange && !isStart && !isSelectedRange && (
                      <div className="absolute inset-0 bg-indigo-500/5 rounded-[24px]" />
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {range.start && range.end && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-[32px] shadow-3xl flex items-center gap-8 z-[60] backdrop-blur-xl"
              >
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Selected Range</span>
                  <span className="text-sm font-bold font-display">
                    {format(range.start, "MMM d")} — {format(range.end, "MMM d")}
                  </span>
                </div>
                <div className="h-8 w-px bg-white/20 dark:bg-black/20" />
                <div className="flex gap-4">
                  <button onClick={() => setRange({ start: null, end: null })} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100">Reset</button>
                  <button onClick={() => setIsNoteInputOpen(true)} className="px-6 py-2.5 bg-white dark:bg-black text-black dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Add Note</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="glass-morphism rounded-[40px] p-10 flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <StickyNote className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xl font-display font-black tracking-tight">Focus Notes</h3>
              </div>
              <span className="bg-indigo-500/10 text-indigo-500 text-[10px] px-3 py-1 rounded-full font-black uppercase">
                {notes.length} Total
              </span>
            </div>

            <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-20 text-center gap-4">
                  <CalendarIcon className="w-12 h-12 stroke-[1px]" />
                  <p className="text-sm font-bold lowercase tracking-wider italic">No temporal markers found...</p>
                </div>
              ) : (
                notes.map(note => (
                  <motion.div
                    layout
                    key={note.id}
                    className="p-8 rounded-[32px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 relative group hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                          {format(note.start, "MMM d")} - {format(note.end, "MMM d")}
                        </span>
                        <span className="text-xs opacity-40 font-bold uppercase tracking-widest">{note.category}</span>
                      </div>
                      <button onClick={() => deleteNote(note.id)} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-base font-medium leading-relaxed opacity-80">{note.content}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="glass-morphism rounded-[40px] p-10 flex flex-col items-center justify-center text-center gap-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-indigo-500/20">
            <div className="w-20 h-20 bg-white/20 rounded-[28px] flex items-center justify-center animate-float">
              <Sparkles className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-black mb-3">Planner Assistant</h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs font-medium">
                Select a duration on your temporal grid to attach context-rich nodes and seasonal priorities.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-5 py-2.5 bg-white/10 rounded-2xl border border-white/20 text-[10px] font-black uppercase tracking-widest">Premium Logic</div>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isNoteInputOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
              onClick={() => setIsNoteInputOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="relative w-full max-w-lg glass-morphism rounded-[56px] p-12 lg:p-16 border-none bg-white dark:bg-[#020617] shadow-3xl overflow-hidden"
            >
              <div className="mb-12 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 text-indigo-500 mb-3 font-black text-[10px] uppercase tracking-[0.4em]">
                    <StickyNote className="w-4 h-4" /> Creation Portal
                  </div>
                  <h4 className="text-4xl font-display font-black tracking-tight leading-none mb-4">
                    Notes for <span className="opacity-40">{format(range.start!, "MMM d")}</span> - <span className="opacity-40">{format(range.end!, "MMM d")}</span>
                  </h4>
                </div>
                <button onClick={() => setIsNoteInputOpen(false)} className="p-3 bg-gray-100 dark:bg-white/10 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <textarea
                autoFocus
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Transcribe your seasonal intent..."
                className="w-full h-48 bg-transparent text-xl font-medium resize-none border-none focus:ring-0 placeholder:opacity-20 custom-scrollbar mb-12"
              />

              <div className="flex items-center gap-4">
                <button
                  onClick={saveNote}
                  className="flex-1 py-6 bg-indigo-600 text-white rounded-[32px] text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Seal Temporal Node
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
