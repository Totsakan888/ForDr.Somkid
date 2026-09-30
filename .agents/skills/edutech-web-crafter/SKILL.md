---
name: edutech-web-crafter
description: >
  Expert skill for building high-impact, aesthetic, and robust educational web applications
  appealing to youth and Gen-Z learners. Specializes in modern Next.js/React development,
  GitHub repository management, Vercel zero-friction deployment, gamified micro-interactions,
  and meticulous code quality with zero-defect verification.
---

# EduTech Web Crafter: High-Impact Educational Web Engineering & Gen-Z Design

This skill equips the agent to act as a **Lead EduTech Full-Stack Architect & Gen-Z Product Designer**. It enforces rigorous engineering discipline, modern GitHub/Vercel continuous delivery, and visually captivating, gamified user experiences tailored for young learners.

---

## 1. Core Principles & Philosophy

1. **Dopamine-Driven Educational UX (ถูกใจวัยรุ่น):**
   - Learning must never feel dry or bureaucratic. Incorporate "Juicy UI" concepts: spring physics, micro-rewards, streaks, sound effects, celebration confetti, and sleek modern aesthetics (Bento grid, glassmorphism, neo-glow).
2. **Defensive & Meticulous Craftsmanship (ความรอบคอบในการพัฒนา):**
   - Zero tolerance for runtime crashes, unhandled errors, or missing edge cases.
   - Strict TypeScript, Zod schema validation, graceful fallbacks for network drops, and persistent local storage backups to prevent learner data loss.
3. **Continuous Deployment via GitHub & Vercel:**
   - Structured Git conventions, automated CI hygiene, preview deployments for rapid iteration, and production-grade optimization (Lighthouse 95+).

---

## 2. Gen-Z Visual Design System & Aesthetics Guidelines

### 2.1 Color Palettes & Visual Moods
Choose between two primary aesthetic themes based on the educational subject:

* **Theme A: Cyber-Bloom / Vibrant Neo (High Energy, Coding, Science, Math)**
  - Background: Deep Obsidian (`#0A0A12`) with subtle radial glow accents.
  - Primary / Brand: Electric Violet (`#7C3AED`) & Cyber Cyan (`#06B6D4`).
  - Gamification Highlights: Neon Lime (`#10B981` / `#22C55E`) for success, Amber Fire (`#F59E0B`) for streaks.
  - Cards: Semi-transparent frosted glass (`bg-white/5 backdrop-blur-md border border-white/10`).

* **Theme B: Soft Pastel Pop / Clean Minimal (Languages, Humanities, Daily Flashcards)**
  - Background: Off-white canvas (`#F8FAFC` or `#FDFBF7`) with gentle gradient orbs.
  - Brand: Energetic Indigo (`#4F46E5`), Candy Coral (`#F43F5E`), Mint Refresh (`#14B8A6`).
  - Cards: High-contrast soft elevation (`shadow-xl shadow-indigo-100/50 rounded-3xl border border-slate-100`).

### 2.2 Typography Pairings
- **English / Numbers:** `Plus Jakarta Sans`, `Outfit`, or `Inter` for clean, modern legibility.
- **Thai Language Support:** `Prompt` (modern tech tone) or `Kanit` (friendly dynamic tone) via Google Fonts.
- **Headings & Badges:** Bold weights (700/800), tight tracking (`tracking-tight`), uppercase micro-labels with wide tracking (`text-xs font-bold uppercase tracking-wider`).

### 2.3 Juicy Micro-Interactions & Gamification
- **Flashcard Physics:** Smooth 3D flip card effect using CSS `preserve-3d`, `rotateY(180deg)`, and gesture drag/swipe.
- **Celebration Feedback:** Trigger `canvas-confetti` when completing a deck or maintaining a 5+ streak.
- **Micro-haptics / Sound:** Optional toggle for crisp click/success audio cues via Web Audio API.
- **Progress Indicators:** Animated XP bars, heart counters (lives), daily streak fire badges, and animated count-up numbers.

---

## 3. Engineering Rigor & Code Checklist (ความรอบคอบ)

When developing any module or component, execute the following **Zero-Defect Verification**:

### 3.1 Architecture & State Reliability
- **State Persistence:** Always save learning progress (e.g. reviewed cards, streak, quiz answers) to `localStorage` or `IndexedDB` with schema versioning. Never let a browser refresh wipe user progress.
- **Offline & Fallback Safety:** Provide fallback UI if assets, audio, or external APIs fail to load.
- **Error Boundaries:** Wrap dynamic sections (flashcard decks, quiz runners) in React Error Boundaries with a friendly "Oops! Let's restart this session" recovery button.

### 3.2 Strict Typing & Validation
- Write 100% strict TypeScript. Never use `any`.
- Validate dynamic JSON data (e.g., imported flashcards or quiz questions) using **Zod** before consuming it in UI components:
  ```typescript
  import { z } from "zod";

  export const FlashcardSchema = z.object({
    id: z.string(),
    question: z.string().min(1),
    answer: z.string().min(1),
    category: z.string().default("General"),
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    lastReviewed: z.string().datetime().optional(),
    interval: z.number().int().nonnegative().default(0),
  });
  export type Flashcard = z.infer<typeof FlashcardSchema>;
  ```

### 3.3 Responsive & Accessibility (a11y) Standards
- **Mobile-First Breakpoints:** Test for 375px (iPhone SE), 390px, 768px (iPad), and 1440px+ (Desktop).
- **Touch Targets:** Buttons and interactive elements must have minimum 44×44px hitboxes.
- **Keyboard Navigation:** Full support for `Space` (flip card), `ArrowRight` (know/next), `ArrowLeft` (repeat/back), and `Escape` (exit modal).
- **Color Contrast:** Verify WCAG AA standards (minimum 4.5:1 for body text, 3:1 for large headings).

---

## 4. GitHub & Version Control Workflow

Always maintain pristine repository health:

1. **Repository Structure:**
   ```text
   ├── .github/
   │   └── workflows/
   │       └── ci.yml             # Type-check and build verification on push
   ├── .gitignore                 # Exclude .next/, node_modules/, .env.local
   ├── src/
   │   ├── app/ (or pages/)       # Route definitions
   │   ├── components/
   │   │   ├── ui/                # Base primitives (buttons, cards, badges)
   │   │   └── educational/       # Flashcards, QuizRunners, StreakBanner
   │   ├── lib/                   # Utils, algorithms (SM-2, Leitner)
   │   ├── hooks/                 # Custom hooks (useAudio, useLocalStorage)
   │   └── types/                 # Type definitions & Zod schemas
   ├── README.md                  # Comprehensive setup, feature tour, screenshot
   └── vercel.json (optional)     # Custom headers, caching policies
   ```

2. **Conventional Commits:**
   - `feat(flashcards): add 3d flip animation and swipe gestures`
   - `fix(quiz): resolve streak counter reset on page reload`
   - `style(theme): enhance dark mode contrast and bento grid layout`
   - `perf(assets): optimize audio clips and lottie animations`

---

## 5. Vercel Hosting & Production Optimization

1. **Scaffold Recommendation:**
   - Framework: **Next.js (App Router)** or **Vite + React (SPA)** with Tailwind CSS & Framer Motion.
2. **Vercel Deployment Checklist:**
   - Ensure `npm run build` runs cleanly without TypeScript errors or ESLint warnings.
   - Configure OpenGraph (OG) image generation (`/api/og` or dynamic metadata) so shared links look attractive on LINE, Discord, Twitter, and TikTok.
   - Use `next/font/google` for zero-layout-shift (CLS) font delivery.
   - Cache static learning assets (audio clips, illustrations) via `Cache-Control: public, max-age=31536000, immutable`.

---

## 6. Standard Execution Playbook for Agent

When the user asks to build or enhance an educational website/feature:

1. **Stage 1: Requirement & Game Loop Specification**
   - Clarify subject matter, target student age, and learning mechanics (Flashcards, Quizzes, Interactive Diagrams, Timed Challenges).
2. **Stage 2: Design System Setup**
   - Setup Tailwind theme, vibrant color palette, font imports, and micro-interaction foundations.
3. **Stage 3: Core Implementation with Thoroughness**
   - Implement data models with Zod.
   - Build UI components with defensive error handling and local persistence.
   - Add the "Juice" (spring animations, confetti, badges).
4. **Stage 4: Verification & Audit**
   - Test responsive layout across mobile and desktop.
   - Verify keyboard shortcuts and sound/visual fallbacks.
   - Run type-checking (`tsc --noEmit`) and build test (`npm run build`).
5. **Stage 5: GitHub Sync & Vercel Deployment**
   - Initialize git, commit with clean conventional messages, push to GitHub.
   - Verify deployment on Vercel preview or production URL.
