<div align="center">

# Luminar Calendar

**A premium wall calendar built for the Striver Frontend Engineering Challenge.**

Seasonal animations · Date range selection · Persistent notes · Glassmorphism UI

[![Live Demo](https://img.shields.io/badge/Live%20Demo-aesthetic--calender.vercel.app-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://aesthetic-calender.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Bhagy--Yelleti%2Faesthetic__calendar-24292e?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Bhagy-Yelleti/aesthetic_calender)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

</div>

---

## Preview

> **Desktop** — Side-by-side hero panel + calendar grid with range selection

![Desktop Preview](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80)

> **Mobile** — Vertically stacked, touch-optimized layout

![Mobile Preview](https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80)

---

## Live Links

| | Link |
|---|---|
| 🚀 **Live Demo** | [https://aesthetic-calender.vercel.app](https://aesthetic-calender.vercel.app) |
| 💻 **GitHub Repo** | [https://github.com/Bhagy-Yelleti/aesthetic_calender](https://github.com/Bhagy-Yelleti/aesthetic_calender) |

> **One-liner for recruiters:** A full-featured, production-quality calendar app with animated seasonal themes, date range selection, localStorage-backed notes, and a physical wall calendar aesthetic — built with React 19, TypeScript, and Framer Motion.

---

## Features

### 🗓️ Wall Calendar Aesthetic
- Full-bleed seasonal hero image paired with a clean date grid
- Subtle layered paper-card shadow effect (stacked `::before` / `::after` pseudo-elements)
- Physical, tactile feel with soft depth and spacing hierarchy
- Each month has a unique Unsplash photograph and curated color theme

### ✨ Seasonal Animations

Every month renders a unique ambient animation overlay:

| Month | Theme | Effect |
|-------|-------|--------|
| January | Frozen Wilderness | Drifting snowfall |
| February | Valentine Bloom | Floating hearts |
| March | Cherry Blossom | SVG petals drifting down |
| April | Spring Awakening | Colorful butterflies |
| May | Emerald Fields | Dandelion seeds floating up |
| June | Endless Summer | Ocean waves + sunbeams |
| July | Golden Hour | Warm light rays |
| August | Maple Street | Falling maple leaves |
| September | Harvest Season | Amber leaves + wheat |
| October | Autumn Fire | Bats, fog, pumpkin glow |
| November | First Snowfall | Snow + bare tree silhouettes |
| December | Winter Magic | Snow + fairy lights |

### 📅 Premium Date Range Selection
- Click once to set a **start date**, click again to set an **end date**
- Live **hover preview** expands the range before you confirm
- Pill-style markers for start/end dates with a soft filled strip in between
- Today's date highlighted with an accent ring
- Floating action bar appears with **Clear** and **Add Note** options

### 📝 Integrated Notes System
- Notes tied to a **specific date range** (e.g. `Apr 10 → Apr 15`)
- Modal heading displays: **"Notes for Apr 10 → Apr 15"**
- Small indicator dots appear on every date within a note's range
- Notes **persist across sessions** via `localStorage`
- Notes are **fully restored on page refresh**
- Delete notes with the hover trash icon

### 🎨 Premium Micro-interactions
- Hover lift effect (`y: -3`, `scale: 1.06`) on all date cells
- Spring-animated date cell selection (150–180ms)
- Smooth modal entrance with spring physics
- Animated theme toggle (Moon ↔ Sun with rotation)
- Month slide transitions (direction-aware)

### 📱 Responsive Design
- **Desktop:** Side-by-side hero + grid layout maximising screen real estate
- **Mobile:** Fully stacked vertical layout with touch-friendly tap targets
- Notes section remains fully usable on small screens

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript 5.8** | Strict typing throughout |
| **Vite 6** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** (`motion/react`) | All animations & transitions |
| **date-fns** | Date arithmetic |
| **lucide-react** | Icon system |
| **localStorage** | Note persistence |

---

## Getting Started

```bash
git clone https://github.com/Bhagy-Yelleti/aesthetic_calender.git
cd aesthetic_calender
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── components/
│   └── Calendar/
│       ├── Calendar.tsx       # Main calendar — DayCell, NotesPanel, NoteModal
│       └── animations.tsx     # 12 seasonal ambient effects
├── lib/
│   ├── themes.ts              # Month → color + image + quote mapping
│   └── utils.ts               # cn() helper
├── App.tsx                    # Root layout, theme toggle
├── main.tsx
└── index.css                  # Design tokens, card system, animations
```

---

## Deployment

Hosted on **Vercel** with automatic deployments triggered on every push to `master`.

---

<div align="center">

Built with care and precision for the **Striver Frontend Engineering Challenge** · 2026

</div>
