import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, addMonths, subMonths, isToday } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, StickyNote, Plus, Trash2, Sparkles } from "lucide-react";
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
  0:  { image: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a", accent: "blue",    bg: "bg-blue-50",    label: "Frozen Wilderness" },
  1:  { image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7", accent: "rose",    bg: "bg-rose-50",    label: "Valentine Bloom" },
  2:  { image: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7", accent: "pink",    bg: "bg-pink-50",    label: "Cherry Blossom Lane" },
  3:  { image: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa", accent: "yellow",  bg: "bg-yellow-50",  label: "Spring Awakening" },
  4:  { image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef", accent: "emerald", bg: "bg-emerald-50", label: "Emerald Fields" },
  5:  { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", accent: "cyan",    bg: "bg-cyan-50",    label: "Endless Summer" },
  6:  { image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1", accent: "sky",     bg: "bg-sky-50",     label: "Golden Hour" },
  7:  { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", accent: "red",     bg: "bg-red-50",     label: "Canadian Maple Street" },
  8:  { image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee", accent: "amber",   bg: "bg-amber-50",   label: "Harvest Season" },
  9:  { image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", accent: "orange",  bg: "bg-orange-50",  label: "Autumn Fire" },
  10: { image: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e", accent: "indigo",  bg: "bg-indigo-50",  label: "First Snowfall" },
  11: { image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543", accent: "violet",  bg: "bg-violet-50",  label: "Winter Magic" },
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
    <div className={cn("max-w-6xl mx-auto p-4 md:p-8 relative perspective-1000", className)}>
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 mix-blend-multiply" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />
      
      {/* Spiral Binder Visual */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-3 h-10 bg-gradient-to-b from-gray-400 to-gray-200 rounded-full shadow-md border border-gray-300" />
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row min-h-[750px] relative">
        
        {/* Left Section: Hero & Navigation */}
        <div className="lg:w-2/5 relative flex flex-col bg-gray-50 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentDate.getMonth()}
              custom={direction}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 z-0"
            >
              <img
                src={`${currentTheme.image}?auto=format&fit=crop&q=80&w=1000`}
                alt={format(currentDate, "MMMM")}
                className="w-full h-full object-cover brightness-75"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470252649358-96949c751b99?auto=format&fit=crop&q=80&w=1000";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              
              {/* Seasonal Animations */}
              {(() => {
                const month = currentDate.getMonth();
                if (month === 0)  return <Snow key="snow-jan" />;
                if (month === 1)  return <><Snow key="snow-feb" /><FloatingHearts key="hearts" /></>;
                if (month === 2)  return <CherryBlossoms key="cherry" />;
                if (month === 3)  return <Butterflies key="butterflies" />;
                if (month === 4)  return <Dandelions key="dandelions" />;
                if (month === 5)  return <OceanVibes key="ocean" />;
                if (month === 6)  return <GoldenHour key="golden" />;
                if (month === 7)  return <CanadianMapleStreet key="maple-street" />;
                if (month === 8)  return <HarvestSeason key="harvest" />;
                if (month === 9)  return <Halloween key="halloween" />;
                if (month === 10) return <FirstSnow key="firstsnow" />;
                if (month === 11) return <ChristmasMagic key="xmas" />;
                return null;
              })()}
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 p-8 flex flex-col h-full justify-between text-white">
            <div>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                key={`year-${currentDate.getFullYear()}`}
                className="text-xl font-light tracking-widest opacity-80"
              >
                {format(currentDate, "yyyy")}
              </motion.div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                key={`month-${currentDate.getMonth()}`}
                className="text-7xl font-bold mt-2 tracking-tighter"
              >
                {format(currentDate, "MMMM")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                key={`label-${currentDate.getMonth()}`}
                className="text-sm mt-2 tracking-widest uppercase font-light"
              >
                {currentTheme.label}
              </motion.p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={prevMonth}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all border border-white/20 group"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all border border-white/20 group"
                >
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <StickyNote className="w-4 h-4" /> Monthly Memos
                </h3>
                <div className="space-y-3 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                  {currentMonthNotes.length === 0 ? (
                    <p className="text-white/60 text-sm italic">No memos for this month.</p>
                  ) : (
                    currentMonthNotes.map((note) => (
                      <div key={note.id} className="text-sm border-l-2 border-white/40 pl-3 py-1 bg-white/5 rounded-r-lg">
                        <span className="font-medium block text-[10px] opacity-70 uppercase tracking-wider">
                          {format(note.date, "do MMM")}
                        </span>
                        <p className="line-clamp-2 font-light">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Monthly Holidays Section */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Monthly Holidays
                </h3>
                <div className="space-y-3 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                  {Object.entries(HOLIDAYS)
                    .filter(([date]) => isSameMonth(new Date(date), currentDate))
                    .length === 0 ? (
                    <p className="text-white/60 text-sm italic">No holidays this month.</p>
                  ) : (
                    Object.entries(HOLIDAYS)
                      .filter(([date]) => isSameMonth(new Date(date), currentDate))
                      .map(([date, name]) => (
                        <div key={date} className="text-sm border-l-2 border-red-400 pl-3 py-1 bg-red-400/10 rounded-r-lg">
                          <span className="font-medium block text-[10px] text-red-200 uppercase tracking-wider">
                            {format(new Date(date), "do MMM")}
                          </span>
                          <p className="font-light text-white">{name}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Calendar Grid & Interaction */}
        <div className="lg:w-3/5 p-6 md:p-10 bg-white flex flex-col relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentDate.getMonth()}
              custom={direction}
              variants={flipVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex flex-col h-full"
            >
              <div className="grid grid-cols-7 mb-6">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-black text-gray-300 uppercase tracking-widest py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 md:gap-2 flex-grow">
                {days.map((day, idx) => {
                  const isSelected = isStart(day) || isEnd(day);
                  const inRange = isInRange(day);
                  const inHoverRange = isHoverInRange(day);
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const hasNote = notes.some((n) => isSameDay(n.date, day));
                  const holiday = HOLIDAYS[format(day, "yyyy-MM-dd")];

                  return (
                    <motion.button
                      key={day.toString()}
                      whileHover={{ scale: isCurrentMonth ? 1.05 : 1, zIndex: 20 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setHoveredDate(day)}
                      onMouseLeave={() => setHoveredDate(null)}
                      onClick={() => handleDateClick(day)}
                      className={cn(
                        "relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-300 group",
                        !isCurrentMonth && "opacity-10 cursor-default",
                        isCurrentMonth && "hover:bg-gray-50",
                        isToday(day) && `ring-2 ring-${accentColor}-500 ring-offset-2`,
                        isSelected && `bg-${accentColor}-600 text-white shadow-xl shadow-${accentColor}-200 z-10`,
                        holiday && !isSelected && !inRange && "bg-red-50/50 border border-red-100/50",
                        inRange && !isSelected && `bg-${accentColor}-50 text-${accentColor}-600`,
                        inHoverRange && !isSelected && !inRange && `bg-${accentColor}-50/40 text-${accentColor}-400`,
                        isStart(day) && endDate && "rounded-r-none",
                        isEnd(day) && startDate && "rounded-l-none",
                        inRange && !isStart(day) && !isEnd(day) && "rounded-none"
                      )}
                      style={{
                        backgroundColor: isSelected ? undefined : (inRange ? undefined : (inHoverRange ? undefined : undefined)),
                        // Tailwind dynamic classes can be tricky with JIT if not safelisted, 
                        // but since we are using fixed themes, we can use inline styles for safety if needed.
                      }}
                    >
                      <span className={cn("text-lg font-bold", isSelected ? "text-white" : "text-gray-700")}>
                        {format(day, "d")}
                      </span>
                      <div className="flex gap-1 mt-1">
                        {hasNote && !isSelected && (
                          <div className={`w-1.5 h-1.5 rounded-full bg-${accentColor}-400 animate-pulse`} />
                        )}
                        {holiday && !isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm" title={holiday} />
                        )}
                      </div>
                      {holiday && (
                        <div className={cn(
                          "absolute top-1 right-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all duration-300 z-20",
                          isSelected 
                            ? "bg-white/20 text-white opacity-100" 
                            : "bg-red-500 text-white opacity-0 group-hover:opacity-100 shadow-lg scale-90 group-hover:scale-100"
                        )}>
                          {holiday}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Selection Info & Notes */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-4 rounded-2xl transition-colors", `bg-${accentColor}-50`)}>
                      <CalendarIcon className={cn("w-6 h-6", `text-${accentColor}-600`)} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                        {startDate ? (
                          endDate ? (
                            `${format(startDate, "MMM d")} — ${format(endDate, "MMM d")}`
                          ) : (
                            format(startDate, "MMMM d, yyyy")
                          )
                        ) : (
                          "Select a date or range"
                        )}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium">
                        {startDate && endDate 
                          ? `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days in selection`
                          : "Tap to start planning your journey"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {startDate && (
                      <button
                        onClick={() => setIsNoteModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all text-sm font-bold shadow-xl shadow-gray-200 active:scale-95"
                      >
                        <Plus className="w-4 h-4" /> Add Note
                      </button>
                    )}
                    {(startDate || endDate) && (
                      <button
                        onClick={() => {
                          setStartDate(null);
                          setEndDate(null);
                        }}
                        className="px-6 py-3 border-2 border-gray-100 text-gray-400 rounded-xl hover:bg-gray-50 hover:text-gray-600 transition-all text-sm font-bold active:scale-95"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Selected Date Notes List */}
                <AnimatePresence>
                  {startDate && selectedDateNotes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {selectedDateNotes.map((note) => (
                        <motion.div
                          layout
                          key={note.id}
                          className={cn("p-5 rounded-2xl flex justify-between items-start group shadow-sm border border-black/5", note.color)}
                        >
                          <p className="text-sm text-gray-800 leading-relaxed font-medium">{note.text}</p>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNoteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black tracking-tighter">New Note</h2>
                <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", `bg-${accentColor}-100 text-${accentColor}-700`)}>
                  {startDate && format(startDate, "MMM d")}
                </div>
              </div>
              
              <textarea
                autoFocus
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write something memorable..."
                className="w-full h-40 p-6 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-gray-900 mb-8 resize-none text-lg font-medium placeholder:text-gray-300"
              />

              <div className="flex items-center justify-center gap-4 mb-10">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedNoteColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-2xl border-4 transition-all active:scale-90",
                      color,
                      selectedNoteColor === color ? "border-gray-900 scale-110 rotate-3 shadow-lg" : "border-transparent"
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addNote}
                  className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
                >
                  Save Memo
                </button>
                <button
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .perspective-1000 {
          perspective: 1500px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        /* Safelist dynamic colors for Tailwind JIT */
        .bg-indigo-600, .bg-blue-600, .bg-yellow-600, .bg-pink-600, .bg-emerald-600, .bg-cyan-600, .bg-orange-600, .bg-green-600, .bg-amber-600, .bg-stone-600, .bg-slate-600 { display: none; }
        .bg-indigo-50, .bg-blue-50, .bg-yellow-50, .bg-pink-50, .bg-emerald-50, .bg-cyan-50, .bg-orange-50, .bg-green-50, .bg-amber-50, .bg-stone-50, .bg-slate-50 { display: none; }
        .text-indigo-600, .text-blue-600, .text-yellow-600, .text-pink-600, .text-emerald-600, .text-cyan-600, .text-orange-600, .text-green-600, .text-amber-600, .text-stone-600, .text-slate-600 { display: none; }
      `}</style>
    </div>
  );
}
