import { motion } from "motion/react";

// Snowy days
export const Snow = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(30)].map((_, i) => {
      const size = Math.random() * 3 + 1;
      const startX = Math.random() * 100;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/40"
          style={{ width: size, height: size, left: `${startX}%`, top: -10 }}
          animate={{
            top: ["-5%", "105%"],
            left: [`${startX}%`, `${startX + (Math.random() * 10 - 5)}%`],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
        />
      );
    })}
  </div>
);

// Spring petals
export const FallingPetals = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(15)].map((_, i) => {
      const startX = Math.random() * 100;
      return (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${startX}%`,
            top: -20,
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
          }}
          animate={{
            top: ["0%", "110%"],
            left: [`${startX}%`, `${startX + Math.random() * 20 - 10}%`],
            rotate: [0, 360],
            opacity: [0, 0.3, 0.3, 0],
          }}
          transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 10 }}
        >
          <svg viewBox="0 0 20 20" fill="none">
            <ellipse cx="10" cy="10" rx="8" ry="4" fill="rgba(255,182,193,0.4)" transform="rotate(45 10 10)" />
          </svg>
        </motion.div>
      );
    })}
  </div>
);

// Summer heat/wind haze
export const WarmBreeze = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute inset-0 bg-yellow-400/5"
        animate={{
          opacity: [0, 0.05, 0],
          x: [-20, 20, -20],
        }}
        transition={{
          duration: 5 + i,
          repeat: Infinity,
          delay: i * 2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Rain for the monsoon season
export const GentleRain = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(40)].map((_, i) => {
      const startX = Math.random() * 100;
      return (
        <motion.div
          key={i}
          className="absolute bg-blue-400/20"
          style={{
            left: `${startX}%`,
            top: -20,
            width: 1,
            height: 15,
            transform: "rotate(15deg)",
          }}
          animate={{
            top: ["-5%", "105%"],
            opacity: [0, 0.3, 0.3, 0],
          }}
          transition={{
            duration: 1 + Math.random() * 1,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        />
      );
    })}
  </div>
);

// Autumn leaves
export const AutumnLeaves = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(12)].map((_, i) => {
      const startX = Math.random() * 100;
      const colors = ["rgba(217,119,6,0.3)", "rgba(180,83,9,0.3)", "rgba(153,61,0,0.3)"];
      return (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${startX}%`,
            top: -20,
            width: 12,
            height: 12,
          }}
          animate={{
            top: ["0%", "110%"],
            left: [`${startX}%`, `${startX + Math.random() * 30 - 15}%`],
            rotate: [0, 720],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 10 }}
        >
          <svg viewBox="0 0 20 20">
            <path d="M10 2 Q15 10 10 18 Q5 10 10 2" fill={colors[i % 3]} />
          </svg>
        </motion.div>
      );
    })}
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
