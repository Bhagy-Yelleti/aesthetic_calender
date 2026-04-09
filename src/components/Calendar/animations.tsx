import { motion, AnimatePresence } from "motion/react";

// Premium Snowy experience
export const Snow = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-indigo-500/10 dark:bg-white/10 blur-[1px]"
        initial={{
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          left: `${Math.random() * 100}%`,
          top: -20,
          opacity: 0
        }}
        animate={{
          top: "110%",
          left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
          opacity: [0, 0.4, 0.4, 0],
        }}
        transition={{
          duration: 10 + Math.random() * 20,
          repeat: Infinity,
          delay: Math.random() * 15,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

// High-fidelity petals
export const FallingPetals = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        initial={{
          left: `${Math.random() * 100}%`,
          top: -30,
          rotate: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={{
          top: "110%",
          left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
          rotate: 720,
          opacity: [0, 0.5, 0.5, 0],
        }}
        transition={{
          duration: 15 + Math.random() * 15,
          repeat: Infinity,
          delay: Math.random() * 20,
          ease: "easeInOut"
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C12 2 15 10 20 12C15 14 12 22 12 22C12 22 9 14 4 12C9 10 12 2 12 2Z" fill="rgba(255,182,193,0.3)" />
        </svg>
      </motion.div>
    ))}
  </div>
);

// Atmospheric haze
export const WarmBreeze = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-purple-500/5 blur-3xl"
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1],
          x: [-50, 50, -50],
        }}
        transition={{
          duration: 15 + i * 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Rainfall
export const GentleRain = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(60)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-indigo-500/10 dark:bg-white/5"
        initial={{
          left: `${Math.random() * 100}%`,
          top: -50,
          width: 1,
          height: Math.random() * 40 + 20,
        }}
        animate={{
          top: "110%",
        }}
        transition={{
          duration: 0.8 + Math.random() * 0.4,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

// Drifting leaves
export const AutumnLeaves = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        initial={{
          left: `${Math.random() * 100}%`,
          top: -40,
          rotate: Math.random() * 360,
        }}
        animate={{
          top: "110%",
          left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
          rotate: [0, 360, 720],
          opacity: [0, 0.4, 0.4, 0],
        }}
        transition={{
          duration: 20 + Math.random() * 15,
          repeat: Infinity,
          delay: Math.random() * 20,
          ease: "linear"
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C12 2 14 8 20 10C14 12 12 22 12 22C12 22 10 12 4 10C10 8 12 2 12 2Z" fill="rgba(217,119,6,0.2)" />
        </svg>
      </motion.div>
    ))}
  </div>
);

export const GlobalEffects = ({ month }: { month: number }) => {
  // Spring: March, April, May
  if (month >= 2 && month <= 4) return <FallingPetals />;
  // Summer: June, July
  if (month >= 5 && month <= 6) return <WarmBreeze />;
  // Monsoon: August, September
  if (month >= 7 && month <= 8) return <GentleRain />;
  // Autumn: October
  if (month === 9) return <AutumnLeaves />;
  // Winter: Nov, Dec, Jan, Feb
  return <Snow />;
};
