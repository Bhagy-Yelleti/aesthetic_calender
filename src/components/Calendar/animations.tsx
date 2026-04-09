import { motion } from "motion/react";

/* ─── Snow (Nov, Dec, Jan, Feb) ───────────────────────────────── */
export function Snow() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {Array.from({ length: 30 }, (_, i) => {
        const size = Math.random() * 4 + 2;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20 dark:bg-white/10"
            style={{ width: size, height: size, left: `${Math.random() * 100}%`, top: -20 }}
            animate={{
              top: "110%",
              left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 16,
              repeat: Infinity,
              delay: Math.random() * 12,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── Petals (Mar, Apr, May) ──────────────────────────────────── */
export function FallingPetals() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {Array.from({ length: 16 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ left: `${Math.random() * 100}%`, top: -30, rotate: Math.random() * 360 }}
          animate={{
            top: "110%",
            left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            rotate: 720,
            opacity: [0, 0.5, 0.5, 0],
          }}
          transition={{ duration: 14 + Math.random() * 14, repeat: Infinity, delay: Math.random() * 18, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M10 1C10 1 13 8 18 10C13 12 10 19 10 19C10 19 7 12 2 10C7 8 10 1 10 1Z" fill="rgba(255,182,193,0.35)" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Warm Haze (Jun, Jul) ────────────────────────────────────── */
export function WarmBreeze() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-rose-500/5 blur-3xl"
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.15, 1], x: [-40, 40, -40] }}
          transition={{ duration: 14 + i * 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Rain (Aug, Sep) ─────────────────────────────────────────── */
export function GentleRain() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {Array.from({ length: 50 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute bg-sky-400/10 dark:bg-white/5"
          style={{ left: `${Math.random() * 100}%`, top: -50, width: 1, height: Math.random() * 40 + 15 }}
          animate={{ top: "110%" }}
          transition={{ duration: 0.7 + Math.random() * 0.5, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* ─── Autumn Leaves (Oct) ─────────────────────────────────────── */
export function AutumnLeaves() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ left: `${Math.random() * 100}%`, top: -40, rotate: Math.random() * 180 }}
          animate={{
            top: "110%",
            left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            rotate: [0, 360, 720],
            opacity: [0, 0.45, 0.45, 0],
          }}
          transition={{ duration: 18 + Math.random() * 14, repeat: Infinity, delay: Math.random() * 18, ease: "linear" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2C12 2 14 8 20 10C14 12 12 22 12 22C12 22 10 12 4 10C10 8 12 2 12 2Z" fill="rgba(217,119,6,0.25)" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Selector ────────────────────────────────────────────────── */
export function GlobalEffects({ month }: { month: number }) {
  if (month >= 2 && month <= 4) return <FallingPetals />;
  if (month >= 5 && month <= 6) return <WarmBreeze />;
  if (month >= 7 && month <= 8) return <GentleRain />;
  if (month === 9) return <AutumnLeaves />;
  return <Snow />;
}
