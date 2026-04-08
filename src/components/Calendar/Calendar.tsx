import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, addMonths, subMonths, isToday } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, StickyNote, Plus, Trash2, Sparkles, Image } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import {
  Snow, FloatingHearts, CherryBlossoms, Butterflies, Dandelions,
  OceanVibes, GoldenHour, CanadianMapleStreet, HarvestSeason,
  Halloween, FirstSnow, ChristmasMagic
} from "./animations";

// Types
interface Note {
  id: string;
  date: Date;
  text: string;
  color: string;
}

interface CalendarProps {
  className?: string;
}

const MONTH_THEMES: Record<number, { image: string; accent: string; bg: string; label: string }> = {
  0: { image: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a", accent: "blue", bg: "bg-blue-50", label: "Frozen Wilderness" },
  1: { image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", accent: "rose", bg: "bg-rose-50", label: "Valentine Bloom" },
  2: { image: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7", accent: "pink", bg: "bg-pink-50", label: "Cherry Blossom Lane" },
  3: { image: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa", accent: "yellow", bg: "bg-yellow-50", label: "Spring Awakening" },
  4: { image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef", accent: "emerald", bg: "bg-emerald-50", label: "Emerald Fields" },
  5: { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", accent: "cyan", bg: "bg-cyan-50", label: "Endless Summer" },
  6: { image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1", accent: "sky", bg: "bg-sky-50", label: "Golden Hour" },
  7: { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", accent: "red", bg: "bg-red-50", label: "Canadian Maple Street" },
  8: { image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee", accent: "amber", bg: "bg-amber-50", label: "Harvest Season" },
  9: { image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", accent: "orange", bg: "bg-orange-50", label: "Autumn Fire" },
  10: { image: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e", accent: "indigo", bg: "bg-indigo-50", label: "First Snowfall" },
  11: { image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543", accent: "violet", bg: "bg-violet-50", label: "Winter Magic" },
};

const NOTE_COLORS = ["bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-pink-100", "bg-purple-100"];

export default function Calendar({ className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [selectedNoteColor, setSelectedNoteColor] = useState(NOTE_COLORS[0]);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  const currentTheme = MONTH_THEMES[currentDate.getMonth()];
  const accentColor = currentTheme.accent;

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("lumina_calendar_notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes).map((n: any) => ({ ...n, date: new Date(n.date) })));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("lumina_calendar_notes", JSON.stringify(notes));
  }, [notes]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = useMemo(() => {
    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
  }, [calendarStart, calendarEnd]);

  const handleDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };
  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };

  const addNote = () => {
    if (!newNoteText.trim() || !startDate) return;
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      date: startDate,
      text: newNoteText,
      color: selectedNoteColor,
    };
    setNotes([...notes, newNote]);
    setNewNoteText("");
    setIsNoteModalOpen(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const HOLIDAYS: Record<string, string> = {
    "2026-01-01": "New Year's Day",
    "2026-02-14": "Valentine's Day",
    "2026-03-17": "St. Patrick's Day",
    "2026-04-05": "Easter Sunday",
    "2026-05-25": "Memorial Day",
    "2026-07-04": "Independence Day",
    "2026-10-31": "Halloween",
    "2026-11-26": "Thanksgiving",
    "2026-12-25": "Christmas Day",
  };

  const selectedDateNotes = notes.filter((n) => startDate && isSameDay(n.date, startDate));
  const currentMonthNotes = notes.filter((n) => isSameMonth(n.date, currentDate));

  const isInRange = (day: Date) => {
    if (!startDate || !endDate) return false;
    return isWithinInterval(day, { start: startDate, end: endDate });
  };

  const isStart = (day: Date) => startDate && isSameDay(day, startDate);
  const isEnd = (day: Date) => endDate && isSameDay(day, endDate);

  const isHoverInRange = (day: Date) => {
    if (!startDate || endDate || !hoveredDate) return false;
    const start = startDate < hoveredDate ? startDate : hoveredDate;
    const end = startDate < hoveredDate ? hoveredDate : startDate;
    return isWithinInterval(day, { start, end });
  };

  const flipVariants = {
    initial: (direction: number) => ({
      rotateX: direction > 0 ? -90 : 90,
      opacity: 0,
      transformOrigin: "top",
    }),
    animate: {
      rotateX: 0,
      opacity: 1,
      transformOrigin: "top",
    },
    exit: (direction: number) => ({
      rotateX: direction > 0 ? 90 : -90,
      opacity: 0,
      transformOrigin: "bottom",
    }),
  };

  return (
    <div className={cn("max-w-6xl mx-auto flex flex-col gap-6", className)}>
      {/* Notion-style Page Header */}
      <div className="flex flex-col gap-4 px-2">
        <div className="flex items-center gap-2 text-sm text-[#787774] dark:text-[#929292]">
          <span className="hover:bg-gray-100 dark:hover:bg-white/5 px-1.5 py-0.5 rounded cursor-pointer transition-colors">Workspace</span>
          <span>/</span>
          <span className="hover:bg-gray-100 dark:hover:bg-white/5 px-1.5 py-0.5 rounded cursor-pointer transition-colors font-medium text-[#37352F] dark:text-[#E1E1E1]">Luminar Calender</span>
        </div>

        <div className="flex items-end gap-4 group">
          <div className="text-7xl hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-2xl cursor-pointer transition-all active:scale-95">
            {currentDate.getMonth() === 11 ? "🎄" :
              currentDate.getMonth() <= 1 ? "❄️" :
                currentDate.getMonth() <= 4 ? "🌸" :
                  currentDate.getMonth() <= 7 ? "☀️" : "🍂"}
          </div>
          <div className="flex flex-col mb-2">
            <h2 className="text-4xl font-bold tracking-tight text-[#37352F] dark:text-[#E1E1E1]">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <p className="text-sm text-[#787774] dark:text-[#929292] font-medium uppercase tracking-widest mt-1">
              {currentTheme.label}
            </p>
          </div>
        </div>
      </div>

      {/* Notion Cover Image & Animations */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden notion-card group">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentDate.getMonth()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={`${currentTheme.image}?auto=format&fit=crop&q=80&w=1200`}
              alt={format(currentDate, "MMMM")}
              className="w-full h-full object-cover brightness-90 dark:brightness-75 group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/40 to-transparent" />

            {/* Seasonal Animations */}
            <div className="absolute inset-0 z-10">
              {(() => {
                const month = currentDate.getMonth();
                if (month === 0) return <Snow key="snow-jan" />;
                if (month === 1) return <><Snow key="snow-feb" /><FloatingHearts key="hearts" /></>;
                if (month === 2) return <CherryBlossoms key="cherry" />;
                if (month === 3) return <Butterflies key="butterflies" />;
                if (month === 4) return <Dandelions key="dandelions" />;
                if (month === 5) return <OceanVibes key="ocean" />;
                if (month === 6) return <GoldenHour key="golden" />;
                if (month === 7) return <CanadianMapleStreet key="maple-street" />;
                if (month === 8) return <HarvestSeason key="harvest" />;
                if (month === 9) return <Halloween key="halloween" />;
                if (month === 10) return <FirstSnow key="firstsnow" />;
                if (month === 11) return <ChristmasMagic key="xmas" />;
                return null;
              })()}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls over image */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-md hover:bg-white dark:hover:bg-black/60 transition-all border border-white/20">
            <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-md hover:bg-white dark:hover:bg-black/60 transition-all border border-white/20">
            <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar: Memos & Holidays */}
        <aside className="lg:w-72 flex flex-col gap-8">
          <div className="notion-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#787774] dark:text-[#929292] uppercase tracking-wider">
              <StickyNote className="w-4 h-4" />
              <span>Memos</span>
            </div>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {currentMonthNotes.length === 0 ? (
                <p className="text-xs text-[#787774] italic">No memos today ✨</p>
              ) : (
                currentMonthNotes.map((note) => (
                  <div key={note.id} className="flex flex-col gap-1 group">
                    <span className="text-[10px] font-bold text-[#787774]">{format(note.date, "MMM d")}</span>
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
                      <p className="text-xs leading-relaxed">{note.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="notion-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#787774] dark:text-[#929292] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Holidays</span>
            </div>
            <div className="flex flex-col gap-3">
              {Object.entries(HOLIDAYS)
                .filter(([date]) => isSameMonth(new Date(date), currentDate))
                .map(([date, name]) => (
                  <div key={date} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span className="text-xs font-medium text-[#37352F] dark:text-[#E1E1E1]">{name}</span>
                    <span className="text-[10px] text-[#787774] ml-auto">{format(new Date(date), "MMM d")}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </aside>

        {/* Main Content: Calendar Grid */}
        <div className="flex-1 notion-card p-8 flex flex-col gap-8 shadow-sm">
          <div className="grid grid-cols-7 border-b border-gray-100 dark:border-white/5 pb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-[#787774] dark:text-[#929292] uppercase tracking-[0.2em]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2">
            {days.map((day) => {
              const isSelected = isStart(day) || isEnd(day);
              const inRange = isInRange(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const hasNote = notes.some((n) => isSameDay(n.date, day));
              const holiday = HOLIDAYS[format(day, "yyyy-MM-dd")];

              return (
                <div key={day.toString()} className="relative aspect-square md:aspect-auto md:h-24">
                  <button
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "w-full h-full flex flex-col items-center justify-start py-3 rounded-lg transition-all duration-200 group relative",
                      !isCurrentMonth && "opacity-20 cursor-default",
                      isCurrentMonth && "hover:bg-[#F1F1F0] dark:hover:bg-white/5",
                      isToday(day) && "before:absolute before:inset-0 before:ring-2 before:ring-indigo-400/30 before:rounded-lg",
                      isSelected && "bg-indigo-600/95 dark:bg-indigo-500/90 text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-600",
                      inRange && !isSelected && "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-none",
                      isStart(day) && endDate && "rounded-r-none",
                      isEnd(day) && startDate && "rounded-l-none"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-semibold z-10",
                      isSelected ? "text-white" : (isToday(day) ? "text-indigo-600 dark:text-indigo-400" : "text-[#37352F] dark:text-[#E1E1E1]")
                    )}>
                      {format(day, "d")}
                    </span>

                    {isCurrentMonth && (
                      <div className="mt-auto flex flex-col items-center gap-1 z-10">
                        {holiday && <div className="w-1 h-1 rounded-full bg-rose-400" />}
                        {hasNote && <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />}
                      </div>
                    )}

                    {/* Notion-style holiday tooltip on hover */}
                    {isCurrentMonth && holiday && (
                      <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          {holiday}
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Selection Actions Panel */}
          <div className="mt-4 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#787774] font-medium tracking-tight">
                {startDate ? (
                  endDate ? `${format(startDate, "MMM d")} — ${format(endDate, "MMM d")}` : format(startDate, "MMMM d, yyyy")
                ) : "Select a date to start planning"}
              </span>
              {startDate && endDate && (
                <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">
                  {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} day journey
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {startDate && (
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Note
                </button>
              )}
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(null); setEndDate(null); }}
                  className="text-xs font-bold text-[#787774] hover:bg-gray-100 dark:hover:bg-white/5 px-4 py-2 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal - Using Notion style */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNoteModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-[#191919] rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-white/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">📝</div>
                <h2 className="text-xl font-bold dark:text-white">Add Memo</h2>
                <div className="ml-auto text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full">
                  {startDate && format(startDate, "MMM d")}
                </div>
              </div>

              <textarea
                autoFocus
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type your notes here..."
                className="w-full h-32 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border-none focus:ring-1 focus:ring-indigo-500 mb-6 text-sm resize-none dark:text-gray-200"
              />

              <div className="flex items-center justify-center gap-3 mb-8">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedNoteColor(color)}
                    className={cn(
                      "w-6 h-6 rounded-md border-2 transition-all active:scale-90",
                      color,
                      selectedNoteColor === color ? "border-gray-900 dark:border-white scale-125 shadow-lg" : "border-transparent"
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addNote}
                  className="flex-1 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all active:scale-95"
                >
                  Save Memo
                </button>
                <button
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-6 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(120, 119, 116, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
