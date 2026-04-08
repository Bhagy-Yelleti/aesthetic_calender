# Lumina Calendar

An interactive wall calendar built for the Striver Frontend Engineering Challenge. It combines a physical wall calendar aesthetic with rich seasonal animations, date range selection, and an integrated notes system.

---

## Live Demo

> Deploy link will appear here after Vercel deployment.

---

## Features

### Wall Calendar Aesthetic
The layout mirrors a physical wall calendar — a full-bleed hero image on the left panel paired with the date grid on the right. A spiral binder graphic sits at the top. Each month has its own curated Unsplash photograph and color theme.

### Seasonal Animations (per month)
Every month has a unique, hand-crafted animation overlay on the hero image:

| Month | Scene | Animation |
|-------|-------|-----------|
| January | Frozen Wilderness | Cinematic snowfall with ground glow |
| February | Valentine Bloom | Snow + floating hearts |
| March | Cherry Blossom Lane | SVG petal flowers drifting down |
| April | Spring Awakening | Colorful butterflies with wing-flap physics |
| May | Emerald Fields | Dandelion seeds floating upward |
| June | Endless Summer | Ocean waves + golden sunbeams |
| July | Golden Hour | Warm light rays + glowing orb |
| August | Canadian Maple Street | Lamp-lit street, maple tree silhouettes, vivid falling maple leaves |
| September | Harvest Season | Swaying wheat stalks + amber leaves |
| October | Autumn Fire | Animated bats, fog wisps, pumpkin glow |
| November | First Snowfall | Snow + bare tree silhouettes |
| December | Winter Magic | Snow + twinkling fairy lights + star |

### Date Range Selector
- Click once to set a start date, click again to set an end date
- Live hover preview shows the range before confirming
- Visual states: start (filled), end (filled), in-range (tinted), today (ring)
- Day count shown in the selection info bar

### Integrated Notes
- Add a note to any selected date via the modal
- Choose from 5 pastel sticky-note colors
- Notes persist across sessions via `localStorage`
- Monthly memo panel on the left shows all notes for the current month
- Per-date notes appear below the grid when a date with notes is selected
- Delete notes with the trash icon on hover

### Holiday Markers
US holidays are marked with a red dot on the grid. Hovering reveals the holiday name as a tooltip badge.

### Page-Flip Animation
Navigating between months triggers a 3D `rotateX` flip animation on the calendar grid, giving it a physical page-turn feel.

### Responsive Design
- Desktop: side-by-side hero + grid layout
- Mobile: stacked vertically, fully touch-friendly

---

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Framer Motion (`motion/react`) — all animations
- date-fns — date math
- lucide-react — icons
- localStorage — note persistence

---

## Running Locally

```bash
git clone https://github.com/Bhagy-Yelleti/aesthetic_calender.git
cd aesthetic_calender
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
  components/
    Calendar/
      Calendar.tsx      # Main calendar component
      animations.tsx    # All 12 seasonal animation components
  App.tsx
  main.tsx
  index.css
```

---

## Deployment

Hosted on Vercel with automatic deployments on every push to `main`/`master`.

---

Built with care for the Striver Frontend Engineering Challenge.
