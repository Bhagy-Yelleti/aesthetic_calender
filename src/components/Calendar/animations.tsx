import { motion } from "motion/react";

// ─── JANUARY / FEBRUARY / NOVEMBER: Cinematic Snow ───────────────────────────
export const Snow = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {[...Array(60)].map((_, i) => {
      const size = Math.random() * 4 + 2;
      const startX = Math.random() * 120 - 10;
      const drift = Math.random() * 60 - 30;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ width: size, height: size, left: `${startX}%`, top: -20, opacity: 0 }}
          animate={{
            top: ["0%", "110%"],
            left: [`${startX}%`, `${startX + drift}%`],
            opacity: [0, 0.9, 0.9, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear",
          }}
        />
      );
    })}
    {/* Ground accumulation glow */}
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/30 to-transparent"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </div>
);

// ─── FEBRUARY: Floating Hearts ────────────────────────────────────────────────
export const FloatingHearts = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-rose-400/70"
        style={{ left: `${Math.random() * 90}%`, bottom: -30, fontSize: `${Math.random() * 20 + 12}px` }}
        animate={{
          y: [0, -(Math.random() * 300 + 200)],
          x: [0, Math.random() * 60 - 30],
          opacity: [0, 0.8, 0.8, 0],
          scale: [0.5, 1, 0.8],
          rotate: [0, Math.random() * 30 - 15],
        }}
        transition={{ duration: 5 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 6 }}
      >
        ♥
      </motion.div>
    ))}
  </div>
);

// ─── MARCH: Cherry Blossoms with petals ──────────────────────────────────────
export const CherryBlossoms = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {[...Array(25)].map((_, i) => {
      const startX = Math.random() * 100;
      return (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${startX}%`,
            top: -20,
            width: Math.random() * 10 + 6,
            height: Math.random() * 10 + 6,
          }}
          animate={{
            top: ["0%", "110%"],
            left: [`${startX}%`, `${startX + Math.random() * 30 - 15}%`],
            rotate: [0, 720],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 6 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 10 }}
        >
          <svg viewBox="0 0 20 20" fill="none">
            <ellipse cx="10" cy="10" rx="8" ry="5" fill="rgba(255,182,193,0.8)" transform={`rotate(${i * 72} 10 10)`} />
            <ellipse cx="10" cy="10" rx="8" ry="5" fill="rgba(255,192,203,0.6)" transform={`rotate(${i * 72 + 36} 10 10)`} />
            <circle cx="10" cy="10" r="2" fill="rgba(255,220,230,0.9)" />
          </svg>
        </motion.div>
      );
    })}
    {/* Pink atmospheric glow */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-b from-pink-200/10 to-transparent"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
  </div>
);

// ─── APRIL: Butterflies with wing flap ───────────────────────────────────────
export const Butterflies = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {[...Array(8)].map((_, i) => {
      const colors = ["#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#10b981"];
      const color = colors[i % colors.length];
      const startY = Math.random() * 70 + 10;
      return (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: -60, top: `${startY}%` }}
          animate={{
            left: ["−60px", "110%"],
            top: [`${startY}%`, `${startY + Math.sin(i) * 20}%`, `${startY - 10}%`, `${startY + 5}%`],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, delay: i * 2 }}
        >
          <motion.svg width="32" height="24" viewBox="0 0 32 24">
            <motion.ellipse cx="8" cy="12" rx="8" ry="10" fill={color} fillOpacity="0.7"
              animate={{ scaleX: [1, 0.1, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{ transformOrigin: "16px 12px" }}
            />
            <motion.ellipse cx="24" cy="12" rx="8" ry="10" fill={color} fillOpacity="0.7"
              animate={{ scaleX: [1, 0.1, 1] }}
              transition={{ duration: 0.3, repeat: Infinity, delay: 0.05 }}
              style={{ transformOrigin: "16px 12px" }}
            />
            <ellipse cx="8" cy="14" rx="5" ry="6" fill={color} fillOpacity="0.5"
            />
            <ellipse cx="24" cy="14" rx="5" ry="6" fill={color} fillOpacity="0.5" />
            <line x1="16" y1="4" x2="16" y2="20" stroke="#333" strokeWidth="1.5" />
          </motion.svg>
        </motion.div>
      );
    })}
  </div>
);

// ─── MAY: Dandelion seeds floating up ────────────────────────────────────────
export const Dandelions = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{ left: `${Math.random() * 100}%`, bottom: -10 }}
        animate={{
          y: [0, -(Math.random() * 400 + 200)],
          x: [0, Math.random() * 80 - 40],
          opacity: [0, 0.9, 0.9, 0],
          rotate: [0, Math.random() * 360],
        }}
        transition={{ duration: 6 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 8 }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="1.5" fill="white" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line key={angle} x1="7" y1="7"
              x2={7 + 5 * Math.cos((angle * Math.PI) / 180)}
              y2={7 + 5 * Math.sin((angle * Math.PI) / 180)}
              stroke="white" strokeWidth="0.8" opacity="0.8"
            />
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse key={`tip-${angle}`}
              cx={7 + 5.5 * Math.cos((angle * Math.PI) / 180)}
              cy={7 + 5.5 * Math.sin((angle * Math.PI) / 180)}
              rx="1" ry="1.5"
              fill="white" opacity="0.9"
              transform={`rotate(${angle} ${7 + 5.5 * Math.cos((angle * Math.PI) / 180)} ${7 + 5.5 * Math.sin((angle * Math.PI) / 180)})`}
            />
          ))}
        </svg>
      </motion.div>
    ))}
  </div>
);

// ─── JUNE: Ocean waves + sunbeams ────────────────────────────────────────────
export const OceanVibes = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {/* Sunbeams from top */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={`beam-${i}`}
        className="absolute top-0 w-1 bg-gradient-to-b from-yellow-200/40 to-transparent"
        style={{ left: `${10 + i * 15}%`, height: "60%", transformOrigin: "top" }}
        animate={{ opacity: [0, 0.4, 0], scaleX: [1, 2, 1], rotate: [i * 5 - 10, i * 5, i * 5 - 10] }}
        transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
      />
    ))}
    {/* Wave lines at bottom */}
    {[0, 1, 2].map((i) => (
      <motion.div
        key={`wave-${i}`}
        className="absolute bottom-0 left-0 right-0"
        style={{ bottom: i * 12 }}
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100%" height="20" viewBox="0 0 400 20" preserveAspectRatio="none">
          <path d="M0 10 Q50 0 100 10 Q150 20 200 10 Q250 0 300 10 Q350 20 400 10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        </svg>
      </motion.div>
    ))}
  </div>
);

// ─── JULY: Golden hour light rays ────────────────────────────────────────────
export const GoldenHour = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          top: 0,
          left: `${20 + i * 8}%`,
          width: `${Math.random() * 40 + 20}px`,
          height: "100%",
          background: "linear-gradient(to bottom, rgba(255,200,50,0.15), transparent)",
          transformOrigin: "top center",
          transform: `rotate(${i * 3 - 10}deg)`,
        }}
        animate={{ opacity: [0, 0.6, 0.2, 0.6, 0], scaleX: [1, 1.5, 1] }}
        transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: i * 0.6 }}
      />
    ))}
    {/* Warm glow orb */}
    <motion.div
      className="absolute top-10 right-10 w-32 h-32 rounded-full"
      style={{ background: "radial-gradient(circle, rgba(255,200,50,0.3) 0%, transparent 70%)" }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </div>
);

// ─── AUGUST: Canadian Maple Street — trees + falling leaves ──────────────────
const MAPLE_LEAF_PATH = "M12 2 C12 2 10 6 8 7 C6 8 2 7 2 7 C2 7 4 10 4 12 C4 14 2 17 2 17 C2 17 6 16 8 17 C9 17.5 10 20 10 20 L12 22 L14 20 C14 20 15 17.5 16 17 C18 16 22 17 22 17 C22 17 20 14 20 12 C20 10 22 7 22 7 C22 7 18 8 16 7 C14 6 12 2 12 2Z";

export const CanadianMapleStreet = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {/* Street lamp posts */}
    {[15, 50, 85].map((x, i) => (
      <motion.div
        key={`lamp-${i}`}
        className="absolute bottom-0"
        style={{ left: `${x}%` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.3 }}
      >
        {/* Lamp glow */}
        <motion.div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,220,100,0.5) 0%, transparent 70%)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        />
        <div className="w-1.5 bg-gradient-to-b from-gray-400 to-gray-600 rounded-t-sm" style={{ height: 60 }} />
        <div className="w-6 h-2 bg-gray-500 rounded-sm -mt-1 -ml-2" />
      </motion.div>
    ))}

    {/* Maple trees silhouette */}
    {[5, 30, 65, 90].map((x, i) => (
      <motion.div
        key={`tree-${i}`}
        className="absolute bottom-0"
        style={{ left: `${x}%` }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
      >
        {/* Trunk */}
        <div className="w-3 bg-gradient-to-b from-amber-900 to-amber-950 mx-auto" style={{ height: 50 }} />
        {/* Canopy layers */}
        {[0, 1, 2].map((layer) => (
          <motion.div
            key={layer}
            className="absolute"
            style={{
              bottom: 40 + layer * 20,
              left: `${-30 - layer * 10}px`,
              width: `${60 + layer * 20}px`,
              height: `${40 + layer * 10}px`,
            }}
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 3 + layer, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 80 50" width="100%" height="100%">
              <ellipse cx="40" cy="30" rx="38" ry="28"
                fill={`rgba(${180 - layer * 20}, ${50 + layer * 10}, ${10}, ${0.85 - layer * 0.1})`}
              />
              {/* Leaf texture dots */}
              {[...Array(8)].map((_, j) => (
                <circle key={j} cx={10 + j * 9} cy={20 + (j % 3) * 8} r="3"
                  fill={`rgba(${200 - layer * 15}, ${70 + j * 5}, 15, 0.6)`}
                />
              ))}
            </svg>
          </motion.div>
        ))}
      </motion.div>
    ))}

    {/* Falling maple leaves — large, vivid, realistic */}
    {[...Array(20)].map((_, i) => {
      const startX = Math.random() * 100;
      const leafColors = ["#c0392b", "#e74c3c", "#d35400", "#e67e22", "#922b21", "#cb4335"];
      const color = leafColors[i % leafColors.length];
      const size = Math.random() * 16 + 12;
      return (
        <motion.div
          key={`leaf-${i}`}
          className="absolute"
          style={{ left: `${startX}%`, top: -30, width: size, height: size }}
          animate={{
            top: ["0%", "105%"],
            left: [`${startX}%`, `${startX + Math.sin(i) * 25 + Math.random() * 20 - 10}%`],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [0, 1, 1, 0.8, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path d={MAPLE_LEAF_PATH} fill={color} />
            <path d="M12 22 L12 14" stroke={color} strokeWidth="1.5" opacity="0.6" />
          </svg>
        </motion.div>
      );
    })}

    {/* Ground leaf pile shimmer */}
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-6"
      style={{ background: "linear-gradient(to top, rgba(180,60,20,0.25), transparent)" }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </div>
);

// ─── SEPTEMBER: Harvest — wheat field shimmer + warm leaves ──────────────────
export const HarvestSeason = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {/* Wheat stalks swaying */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={`wheat-${i}`}
        className="absolute bottom-0"
        style={{ left: `${i * 9}%`, transformOrigin: "bottom center" }}
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
      >
        <div className="w-0.5 bg-amber-400/60" style={{ height: 40 + Math.random() * 20 }} />
        <div className="w-2 h-4 bg-amber-300/70 rounded-t-full -mt-1 -ml-0.5" />
      </motion.div>
    ))}
    {/* Falling amber leaves */}
    {[...Array(15)].map((_, i) => {
      const startX = Math.random() * 100;
      return (
        <motion.div
          key={`aleaf-${i}`}
          className="absolute"
          style={{ left: `${startX}%`, top: -20, width: 14, height: 14 }}
          animate={{
            top: ["0%", "110%"],
            left: [`${startX}%`, `${startX + Math.random() * 30 - 15}%`],
            rotate: [0, 540],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 5 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 7 }}
        >
          <svg viewBox="0 0 14 14">
            <ellipse cx="7" cy="7" rx="6" ry="4" fill="rgba(217,119,6,0.75)" transform="rotate(45 7 7)" />
            <line x1="7" y1="2" x2="7" y2="12" stroke="rgba(180,83,9,0.5)" strokeWidth="0.8" />
          </svg>
        </motion.div>
      );
    })}
  </div>
);

// ─── OCTOBER: Halloween — bats + fog + pumpkin glow ──────────────────────────
export const Halloween = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {/* Bats */}
    {[...Array(6)].map((_, i) => {
      const startY = Math.random() * 60 + 5;
      return (
        <motion.div
          key={`bat-${i}`}
          className="absolute"
          style={{ right: -40, top: `${startY}%` }}
          animate={{
            right: ["-40px", "110%"],
            top: [`${startY}%`, `${startY + Math.sin(i * 2) * 15}%`, `${startY - 8}%`],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 8 + Math.random() * 6, repeat: Infinity, delay: i * 2.5 }}
        >
          <motion.svg width="28" height="16" viewBox="0 0 28 16">
            <motion.path d="M14 8 Q7 0 0 4 Q5 8 7 12 Q10 8 14 8Z" fill="rgba(30,10,50,0.85)"
              animate={{ d: ["M14 8 Q7 0 0 4 Q5 8 7 12 Q10 8 14 8Z", "M14 8 Q7 4 0 4 Q5 6 7 10 Q10 8 14 8Z"] }}
              transition={{ duration: 0.25, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.path d="M14 8 Q21 0 28 4 Q23 8 21 12 Q18 8 14 8Z" fill="rgba(30,10,50,0.85)"
              animate={{ d: ["M14 8 Q21 0 28 4 Q23 8 21 12 Q18 8 14 8Z", "M14 8 Q21 4 28 4 Q23 6 21 10 Q18 8 14 8Z"] }}
              transition={{ duration: 0.25, repeat: Infinity, repeatType: "reverse", delay: 0.05 }}
            />
            <circle cx="14" cy="8" r="2" fill="rgba(50,20,70,0.9)" />
          </motion.svg>
        </motion.div>
      );
    })}
    {/* Fog wisps */}
    {[0, 1, 2].map((i) => (
      <motion.div
        key={`fog-${i}`}
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 30 + i * 15, bottom: i * 10 }}
        animate={{ x: [0, 20, -10, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full" style={{ background: `linear-gradient(to top, rgba(100,50,150,${0.15 - i * 0.03}), transparent)` }} />
      </motion.div>
    ))}
    {/* Pumpkin glow at bottom */}
    <motion.div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-10 rounded-full"
      style={{ background: "radial-gradient(ellipse, rgba(255,120,0,0.35) 0%, transparent 70%)" }}
      animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </div>
);

// ─── NOVEMBER: First Snow + bare trees ───────────────────────────────────────
export const FirstSnow = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    <Snow />
    {/* Bare tree silhouettes */}
    {[10, 80].map((x, i) => (
      <motion.div
        key={`btree-${i}`}
        className="absolute bottom-0"
        style={{ left: `${x}%` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5 }}
      >
        <svg width="60" height="120" viewBox="0 0 60 120">
          <line x1="30" y1="120" x2="30" y2="40" stroke="#4a3728" strokeWidth="4" />
          <line x1="30" y1="80" x2="5" y2="50" stroke="#4a3728" strokeWidth="2.5" />
          <line x1="30" y1="70" x2="55" y2="45" stroke="#4a3728" strokeWidth="2.5" />
          <line x1="30" y1="60" x2="10" y2="30" stroke="#4a3728" strokeWidth="2" />
          <line x1="30" y1="55" x2="50" y2="25" stroke="#4a3728" strokeWidth="2" />
          <line x1="30" y1="45" x2="20" y2="15" stroke="#4a3728" strokeWidth="1.5" />
          <line x1="30" y1="40" x2="40" y2="10" stroke="#4a3728" strokeWidth="1.5" />
        </svg>
      </motion.div>
    ))}
  </div>
);

// ─── DECEMBER: Christmas — snowflakes + twinkling lights ─────────────────────
export const ChristmasMagic = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    <Snow />
    {/* Twinkling fairy lights string */}
    {[...Array(16)].map((_, i) => (
      <motion.div
        key={`light-${i}`}
        className="absolute w-2.5 h-2.5 rounded-full"
        style={{
          left: `${5 + i * 6}%`,
          top: `${8 + Math.sin(i * 0.8) * 6}%`,
          background: ["#ff4444", "#44ff44", "#4444ff", "#ffff44", "#ff44ff"][i % 5],
          boxShadow: `0 0 8px 3px ${["rgba(255,68,68,0.6)", "rgba(68,255,68,0.6)", "rgba(68,68,255,0.6)", "rgba(255,255,68,0.6)", "rgba(255,68,255,0.6)"][i % 5]}`,
        }}
        animate={{ opacity: [1, 0.1, 1], scale: [1, 0.6, 1] }}
        transition={{ duration: 0.8 + Math.random() * 1.5, repeat: Infinity, delay: Math.random() * 2 }}
      />
    ))}
    {/* Light string wire */}
    <svg className="absolute top-0 left-0 w-full" height="60" style={{ opacity: 0.3 }}>
      <path d={`M 0 ${20} ${[...Array(16)].map((_, i) => `Q ${5 + i * 6}% ${8 + Math.sin(i * 0.8) * 6}% ${5 + (i + 0.5) * 6}% 20`).join(" ")}`}
        fill="none" stroke="#888" strokeWidth="1" />
    </svg>
    {/* Star at top */}
    <motion.div
      className="absolute top-4 left-1/2 -translate-x-1/2 text-yellow-300 text-3xl"
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      ★
    </motion.div>
  </div>
);
