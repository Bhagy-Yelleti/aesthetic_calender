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
  isBefore,
} from "date-fns";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  CalendarDays,
  Trash2,
  X,
  ArrowRight,
  MoveRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { GlobalEffects } from "./animations";
import { MONTHS_THEMES } from "@/src/lib/themes";

/* ─── Types ───────────────────────────────────────────────────── */
interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface RangeNote {
  id: string;
  start: string; // ISO string — safe for JSON
  end: string;
  content: string;
}

/* ─── Constants ───────────────────────────────────────────────── */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const STORAGE_KEY = "luminar_notes_v4";

/* ─── Helpers ─────────────────────────────────────────────────── */
function noteStartDate(n: RangeNote) { return new Date(n.start); }
function noteEndDate(n: RangeNote) { return new Date(n.end); }

/* ─── Sub-components ──────────────────────────────────────────── */

interface DayCellProps {
  day: Date;
  inMonth: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isPreview: boolean;
  hasNote: boolean;
  isToday: boolean;
  isRangeStart: boolean; // first day of week / first of range — for pill rounding
  isRangeEnd: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function DayCell({
  day, inMonth, isStart, isEnd, isInRange, isPreview,
  hasNote, isToday: today, onClick, onMouseEnter, onMouseLeave,
}: DayCellProps) {
  const isMarker = isStart || isEnd;

  return (
    <div className="relative flex items-center justify-center">
      {/* Range / preview strip — rendered behind the button */}
      {(isInRange || isPreview) && inMonth && (
        <div
          className={cn(
            "absolute inset-y-0 left-0 right-0 pointer-events-none",
            isPreview ? "bg-[var(--accent-light)] opacity-60" : "bg-[var(--accent-light)]",
            isStart && "left-1/2 rounded-r-none",
            isEnd && "right-1/2 rounded-l-none",
          )}
        />
      )}

      <motion.button
        type="button"
        aria-label={format(day, "MMMM d, yyyy")}
        aria-pressed={isMarker}
        whileHover={inMonth ? { y: -3, scale: 1.06 } : {}}
        whileTap={inMonth ? { scale: 0.92 } : {}}
        transition={{ duration: 0.15, ease: "easeOut" }}
        onClick={inMonth ? onClick : undefined}
        onMouseEnter={inMonth ? onMouseEnter : undefined}
        onMouseLeave={inMonth ? onMouseLeave : undefined}
        className={cn(
          // base
          "relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex flex-col items-center justify-center",
          "transition-all duration-[180ms] outline-none",
          // not in month
          !inMonth && "opacity-0 pointer-events-none",
          // hover (only for non-markers)
          inMonth && !isMarker && "hover:bg-gray-100 dark:hover:bg-white/8",
          // today ring
          today && !isMarker && "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]",
          // marker — selected start/end
          isMarker && [
            "text-white shadow-[0_4px_16px_rgba(99,102,241,0.45)]",
            "bg-[var(--accent)] scale-105 animate-pop",
          ],
          // focus ring for keyboard navigation
          "focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
        )}
      >
        <span className={cn(
          "text-base font-display font-bold leading-none select-none",
          isMarker ? "text-white" : today ? "text-[var(--accent)] font-black" : "text-[var(--text)]",
        )}>
          {format(day, "d")}
        </span>

        {/* Note indicator dot */}
        {hasNote && !isMarker && (
          <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[var(--accent)]" />
        )}
      </motion.button>
    </div>
  );
}

/* ─── Notes Panel ─────────────────────────────────────────────── */
interface NotesPanelProps {
  notes: RangeNote[];
  range: DateRange;
  onDelete: (id: string) => void;
  onAddNote: () => void;
}

function NotesPanel({ notes, range, onDelete, onAddNote }: NotesPanelProps) {
  const hasRange = range.start && range.end;

  return (
    <div className="card card-layered rounded-[40px] p-8 md:p-10 flex flex-col gap-8 min-h-[360px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <h3 className="font-display font-black text-xl tracking-tight text-[var(--text)]">
            Memory Ledger
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">
          {notes.length} saved
        </span>
      </div>

      {/* Active range context */}
      <AnimatePresence mode="wait">
        {hasRange && (
          <motion.div
            key="range-ctx"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between px-5 py-4 rounded-2xl border border-[var(--border)] bg-[var(--accent-light)]"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-[var(--accent)]">
              <span>{format(range.start!, "MMM d")}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              <span>{format(range.end!, "MMM d, yyyy")}</span>
            </span>
            <button
              onClick={onAddNote}
              className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] hover:underline transition-all"
            >
              + Add
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-5 pr-1">
        <AnimatePresence>
          {notes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-12 gap-4 text-[var(--text-dim)]"
            >
              <CalendarDays className="w-12 h-12 opacity-20 stroke-[1.2]" />
              <p className="text-sm font-semibold opacity-50 leading-snug">
                Select a date range<br />to add your notes
              </p>
            </motion.div>
          ) : (
            notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -8 }}
                transition={{ duration: 0.18 }}
                className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] group hover:border-[var(--accent)] hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="flex items-center gap-2 text-[11px] font-black text-[var(--accent)] uppercase tracking-widest">
                    {format(noteStartDate(note), "MMM d")}
                    <MoveRight className="w-3 h-3 opacity-40" />
                    {format(noteEndDate(note), "MMM d")}
                  </span>
                  <button
                    onClick={() => onDelete(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm font-medium leading-relaxed text-[var(--text)] opacity-80">
                  {note.content}
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Note Creation Modal ─────────────────────────────────────── */
interface NoteModalProps {
  range: DateRange;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}

function NoteModal({ range, value, onChange, onSave, onClose }: NoteModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-2xl"
        onClick={onClose}
        aria-hidden
      />
      {/* Sheet */}
      <motion.div
        initial={{ scale: 0.96, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 60, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.34, 1.2, 0.64, 1] }}
        className="relative w-full max-w-lg card rounded-[48px] p-10 md:p-14 shadow-2xl bg-[var(--surface)]"
        role="dialog"
        aria-modal
        aria-labelledby="modal-title"
      >
        {/* Top row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] mb-3 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              Add Note
            </p>
            <h2 id="modal-title" className="text-3xl md:text-4xl font-display font-black tracking-tight text-[var(--text)] leading-none">
              Notes for{" "}
              <span className="text-[var(--accent)]">
                {format(range.start!, "MMM d")}
              </span>{" "}
              →{" "}
              <span className="text-[var(--accent)]">
                {format(range.end!, "MMM d")}
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Textarea with animated focus ring */}
        <div className="relative mb-8 group">
          <textarea
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="What's on your plate for this period?"
            rows={5}
            className={cn(
              "w-full bg-gray-50 dark:bg-white/5 rounded-2xl px-5 py-4",
              "text-base font-medium text-[var(--text)] placeholder:text-[var(--text-dim)] placeholder:opacity-50",
              "border border-[var(--border)] resize-none outline-none",
              "transition-all duration-200",
              "focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_var(--accent-light)]",
              "scrollbar-thin",
            )}
          />
        </div>

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSave}
          disabled={!value.trim()}
          className={cn(
            "w-full py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-sm text-white",
            "bg-[var(--accent)] shadow-[0_8px_24px_rgba(99,102,241,0.35)]",
            "transition-all duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
          )}
        >
          Save to ledger
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ─── Main Calendar ───────────────────────────────────────────── */
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<RangeNote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftNote, setDraftNote] = useState("");
  const [slideDir, setSlideDir] = useState<number>(0);

  const monthIdx = currentDate.getMonth();
  const theme = MONTHS_THEMES[monthIdx];

  /* Persistence — restore */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw) as RangeNote[]);
    } catch { /* ignore */ }
  }, []);

  /* Persistence — save */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  /* Calendar grid */
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(endOfMonth(monthStart)),
    });
  }, [currentDate]);

  /* Navigation */
  const navigate = useCallback((offset: number) => {
    setSlideDir(offset);
    setCurrentDate((d) => addMonths(d, offset));
  }, []);

  /* Date click — two-tap range selection */
  const handleDayClick = useCallback((day: Date) => {
    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: day, end: null };
      }
      if (isBefore(day, prev.start)) return { start: day, end: prev.start };
      return { start: prev.start, end: day };
    });
  }, []);

  /* Day status */
  const getDayStatus = useCallback(
    (day: Date) => {
      const isStart = range.start ? isSameDay(day, range.start) : false;
      const isEnd = range.end ? isSameDay(day, range.end) : false;

      let isInRange = false;
      if (range.start && range.end) {
        isInRange = isWithinInterval(day, { start: range.start, end: range.end });
      }

      let isPreview = false;
      if (range.start && !range.end && hoverDate) {
        const lo = isBefore(hoverDate, range.start) ? hoverDate : range.start;
        const hi = isBefore(hoverDate, range.start) ? range.start : hoverDate;
        isPreview = isWithinInterval(day, { start: lo, end: hi });
      }

      const hasNote = notes.some((n) =>
        isWithinInterval(day, { start: noteStartDate(n), end: noteEndDate(n) })
      );

      return { isStart, isEnd, isInRange, isPreview, hasNote };
    },
    [range, hoverDate, notes]
  );

  /* Save note */
  const saveNote = useCallback(() => {
    if (!draftNote.trim() || !range.start || !range.end) return;
    const note: RangeNote = {
      id: crypto.randomUUID(),
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      content: draftNote.trim(),
    };
    setNotes((prev) => [note, ...prev]);
    setDraftNote("");
    setIsModalOpen(false);
  }, [draftNote, range]);

  /* Slide variants */
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 40 : -40, opacity: 0 }),
  };

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 flex flex-col lg:flex-row gap-8 xl:gap-12">
      <GlobalEffects month={monthIdx} />

      {/* ── Hero Sidebar ─────────────────────────────────────────── */}
      <aside className="lg:w-[400px] xl:w-[440px] flex-shrink-0 flex flex-col gap-6">
        {/* Photo card */}
        <div className="card card-layered rounded-[40px] overflow-hidden relative h-[440px] md:h-[480px]">
          <AnimatePresence mode="wait" custom={slideDir}>
            <motion.img
              key={monthIdx}
              custom={slideDir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              src={theme.heroImage}
              alt={theme.name}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          {/* Nav buttons */}
          <div className="absolute top-6 right-6 flex gap-3 z-10">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => navigate(dir)}
                aria-label={dir === -1 ? "Previous month" : "Next month"}
                className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 text-white hover:bg-white/25 active:scale-90 transition-all duration-150"
              >
                {dir === -1
                  ? <ChevronLeft className="w-5 h-5" />
                  : <ChevronRight className="w-5 h-5" />
                }
              </button>
            ))}
          </div>

          {/* Quote */}
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl drop-shadow-lg">{theme.emoji}</span>
              <div className="flex-1 h-px bg-white/25" />
            </div>
            <p className="text-white text-2xl md:text-3xl font-display font-black leading-snug tracking-tight drop-shadow-md">
              {theme.quote}
            </p>
          </div>
        </div>

        {/* Theme chip */}
        <div
          className="card rounded-[32px] p-7 flex items-center gap-5"
          style={{ borderColor: theme.primary + "40" }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ backgroundColor: theme.primary }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-dim)] mb-1">
              Active Theme
            </p>
            <p className="text-sm font-bold text-[var(--text)]">
              {theme.name} — {theme.name === "April" || theme.name === "September" ? "warm" : "seasonal"} palette applied
            </p>
          </div>
        </div>
      </aside>

      {/* ── Calendar & Notes ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col gap-8 min-w-0">
        {/* Calendar card */}
        <div className="card card-layered rounded-[48px] p-8 md:p-12 xl:p-14 relative overflow-hidden">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-[var(--text-dim)]">
                <CalendarDays className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  Wall Calendar
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tighter leading-none text-[var(--text)]">
                {format(currentDate, "MMMM")}
                {" "}
                <span className="text-ghost">{format(currentDate, "yyyy")}</span>
              </h2>
            </div>

            {/* View tab strip */}
            <div className="flex items-center p-1.5 gap-1 bg-gray-100 dark:bg-white/5 rounded-2xl self-start border border-[var(--border)]">
              {["Month", "Week"].map((v) => (
                <button
                  key={v}
                  className={cn(
                    "px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200",
                    v === "Month"
                      ? "bg-white dark:bg-white/10 shadow-sm text-[var(--accent)]"
                      : "text-[var(--text-dim)] hover:text-[var(--text)]"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </header>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 mb-6">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-dim)] py-2 opacity-60">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {days.map((day, i) => {
              const inMonth = isSameMonth(day, currentDate);
              const status = getDayStatus(day);

              return (
                <DayCell
                  key={i}
                  day={day}
                  inMonth={inMonth}
                  isRangeStart={status.isStart}
                  isRangeEnd={status.isEnd}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => setHoverDate(day)}
                  onMouseLeave={() => setHoverDate(null)}
                  isToday={isToday(day)}
                  {...status}
                />
              );
            })}
          </div>

          {/* Floating range action bar */}
          <AnimatePresence>
            {range.start && range.end && (
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 rounded-full bg-[var(--text)] text-[var(--bg)] shadow-[0_16px_48px_rgba(0,0,0,0.25)] z-50 whitespace-nowrap"
              >
                <span className="flex items-center gap-2 text-sm font-black">
                  {format(range.start, "MMM d")}
                  <ArrowRight className="w-4 h-4 opacity-50" />
                  {format(range.end, "MMM d")}
                </span>
                <div className="w-px h-6 bg-current opacity-20" />
                <button
                  onClick={() => setRange({ start: null, end: null })}
                  className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Add Note
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Two-column bottom section ───────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-8">
          <NotesPanel
            notes={notes}
            range={range}
            onDelete={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
            onAddNote={() => setIsModalOpen(true)}
          />

          {/* "Submission info" accent card */}
          <div className="card rounded-[40px] p-10 flex flex-col items-center justify-center text-center gap-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="w-20 h-20 rounded-[28px] bg-white/20 border border-white/20 flex items-center justify-center animate-float shadow-2xl relative z-10">
              <Sparkles className="w-10 h-10" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-black mb-3">
                Built to impress
              </h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs font-medium">
                Premium date-range UX, localStorage persistence, and
                physical calendar aesthetics — all in one submission.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center relative z-10">
              {["React 19", "TypeScript", "Framer Motion"].map((tag) => (
                <span key={tag} className="px-4 py-2 bg-white/10 rounded-full border border-white/15 text-[11px] font-black uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Note Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && range.start && range.end && (
          <NoteModal
            range={range}
            value={draftNote}
            onChange={setDraftNote}
            onSave={saveNote}
            onClose={() => { setIsModalOpen(false); setDraftNote(""); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
