# Sātva Yoga — Editorial Studio Website

A full-stack editorial website for **Sātva Yoga**, a yoga studio based in Dahisar, Mumbai. Built with React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion, and GSAP. Includes a public-facing marketing site, a class booking system, and a protected admin panel.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Pages & Routes](#pages--routes)
6. [Authentication & Roles](#authentication--roles)
7. [Accessing the Admin Panel](#accessing-the-admin-panel)
8. [Booking System](#booking-system)
9. [Design System & Tokens](#design-system--tokens)
10. [Animation Architecture](#animation-architecture)
11. [Component Reference](#component-reference)
12. [Development Notes](#development-notes)

---

## Project Overview

Sātva Yoga is an editorial-aesthetic studio site with a warm sand/cream/olive/charcoal palette, serif-italic accent typography, and thoughtful micro-animations. The project has two distinct surfaces:

- **Public site** — Home, About, Services, Contact, and a full weekly class schedule with live booking.
- **Admin panel** — A protected dashboard for studio staff to manage class slots, bookings, and client messages.

Authentication is simulated via `sessionStorage` (no backend required). Swap in a real API and JWT flow when deploying to production.

---

## Tech Stack

| Category | Library | Version |
|---|---|---|
| UI framework | React | 19 |
| Language | TypeScript | 5.7 |
| Build tool | Vite | 8 |
| Styling | Tailwind CSS v4 | 4.x |
| Animation | Framer Motion | 13 |
| Animation | GSAP + ScrollTrigger | 3.15 |
| Smooth scroll | Lenis | 1.3 |
| 3D orb | React Three Fiber + Drei | 9.x / 10.x |
| Particles | tsParticles (slim) | 4.x |
| Routing | React Router DOM | 7 |
| Text splitting | Splitting.js | 1.x |
| Formatting | oxfmt | 0.2 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) — or npm / yarn

### Install & run

```bash
# Install dependencies
pnpm install

# Start the dev server (hot reload on port 5173 or $PORT)
pnpm dev

# Production build
pnpm build

# Preview the production build locally
pnpm preview
```

The Vite dev server binds to `0.0.0.0` so it is accessible inside containers and remote previews.

---

## Project Structure

```
src/
├── App.tsx                  # Router, app shell, Lenis setup
├── main.tsx                 # React root mount, global patches
├── index.css                # Tailwind v4 import, @theme tokens, global styles
│
├── components/              # Reusable UI & section components
│   ├── Hero.tsx             # Full-screen hero with parallax + R3F orb
│   ├── HeroScene.tsx        # Three.js floating orb (R3F Canvas)
│   ├── ParticlesDust.tsx    # tsParticles ambient dust layer
│   ├── SplitHeadline.tsx    # Splitting.js character-reveal headline
│   ├── Navbar.tsx           # Responsive nav with Framer layoutId pill
│   ├── BodyBenefits.tsx     # Scroll-revealed anatomy hotspots on photo
│   ├── ClassSchedule.tsx    # Marquee class schedule strip
│   ├── FeaturedClass.tsx    # Feature card with hover reveal
│   ├── InstructorCarousel.tsx # Horizontal instructor scroll carousel
│   ├── MeetUjwala.tsx       # Founder spotlight section
│   ├── OurValues.tsx        # Values grid with icons
│   ├── HolisticApproach.tsx # Three-column approach section
│   ├── AboutCTA.tsx         # Mid-page about call-to-action
│   ├── ClosingCTA.tsx       # Footer call-to-action
│   ├── ServicesClosingCTA.tsx
│   ├── ServicesPricing.tsx  # Membership plan cards
│   ├── Testimonials.tsx     # Testimonial cards
│   ├── TrustBadges.tsx      # Studio stats / trust indicators
│   └── ProtectedRoute.tsx   # Auth guard for admin routes
│
├── hooks/
│   ├── useMagneticCursor.ts # No-op stubs (cursor removed, hooks kept for API stability)
│   └── useReducedMotion.ts  # Respects prefers-reduced-motion
│
└── pages/
    ├── Home.tsx             # Landing page (assembles section components)
    ├── About.tsx            # About page
    ├── Services.tsx         # Services & pricing page
    ├── Contact.tsx          # Contact form
    ├── Booking.tsx          # Weekly class grid + booking modal + My Bookings
    │
    ├── auth/
    │   ├── AuthLayout.tsx   # Shared auth shell (centered card)
    │   ├── Login.tsx        # Login form — sets sessionStorage role
    │   └── Signup.tsx       # Signup form
    │
    └── admin/
        ├── AdminLayout.tsx  # Sidebar + topbar shell for all admin routes
        ├── Dashboard.tsx    # Stat cards (count-up) + today's schedule
        ├── ClassSlots.tsx   # Slot table with add/edit/delete panel
        ├── Bookings.tsx     # Bookings table with status filters
        └── Messages.tsx     # Client inbox with slide-in message panel
```

---

## Pages & Routes

| Path | Component | Auth required | Notes |
|---|---|---|---|
| `/` | `Home` | No | Full landing page |
| `/about` | `About` | No | |
| `/services` | `Services` | No | Pricing included |
| `/contact` | `Contact` | No | |
| `/booking` | `Booking` | No | Login unlocks "My Bookings" section |
| `/login` | `Login` | No | Redirects to `/admin` or `/booking` on success |
| `/signup` | `Signup` | No | |
| `/admin` | `Dashboard` | **Admin** | Redirects to `/login` if not admin |
| `/admin/slots` | `ClassSlots` | **Admin** | |
| `/admin/bookings` | `Bookings` | **Admin** | |
| `/admin/messages` | `Messages` | **Admin** | |

---

## Authentication & Roles

Authentication is **simulated** — there is no backend. It uses `sessionStorage` to store a role string. This lets the site work as a fully functional prototype without any server.

### How it works

On a successful login (`/login`), the app checks the submitted email:

```ts
const isAdmin = email.toLowerCase().includes('admin')
sessionStorage.setItem('sativa_role', isAdmin ? 'admin' : 'client')
```

- Email **contains "admin"** → role set to `'admin'`
- Any other email → role set to `'client'`

The role string persists for the browser tab session. Closing the tab clears it (you will need to log in again).

### Role capabilities

| Feature | Guest (not logged in) | Client (logged in) | Admin |
|---|---|---|---|
| Browse schedule | ✓ | ✓ | ✓ |
| Book a class (guest mode) | ✓ | — | — |
| Book a class (account mode) | — | ✓ | ✓ |
| "My Upcoming Bookings" section | — | ✓ | ✓ |
| Cancel a booking | — | ✓ | ✓ |
| Access `/admin/*` routes | — | — | ✓ |

---

## Accessing the Admin Panel

### Step-by-step

1. Navigate to **`/login`** (or click "Log In" in the nav).
2. Enter **any email that contains the word `admin`**, for example:
   - `admin@satva.com`
   - `ujwala-admin@studio.in`
   - `test.admin@example.com`
3. Enter **any password** (8+ characters — the password is not validated against a real database).
4. Click **Log In**.
5. You will be redirected automatically to **`/admin`** — the studio dashboard.

> **Why any password?** The login is a prototype with stubbed authentication. In production, replace the `handleSubmit` logic in `src/pages/auth/Login.tsx` with a real API call.

### Admin panel features

#### Dashboard (`/admin`)
- Four **count-up stat cards**: Today's Bookings, Week's Bookings, Unread Messages, Active Slots.
- **Today's Schedule** — a timeline list of classes with capacity bars. The currently-running class is highlighted with an olive left-border stripe; past classes are dimmed.

#### Class Slots (`/admin/slots`)
- Table of all class slots with day, time, class type, instructor, capacity, and an **active toggle**.
- **Add Slot** — opens a right slide-in panel form to create a new slot (class type, day, start/end time, capacity).
- **Edit** — re-opens the panel pre-filled with that slot's data.
- **Delete** — triggers a scale-spring confirmation modal before removing.

#### Bookings (`/admin/bookings`)
- Full booking table with client name, phone, class, date, time, and a colour-coded status pill.
- **Filter tabs** — All / Confirmed / Attended / Cancelled.
- **Search** — live filter by client name or class type.
- **Status changer** — three-dot menu on each row to change status (Confirmed → Attended → Cancelled) with a crossfade colour animation.

#### Messages (`/admin/messages`)
- Inbox list showing client name, contact, message preview, date, and an unread dot badge.
- Click a message to open it in a right slide-in panel.
- **Mark as Read** — clears the unread badge and dims the row.
- **Reply** — opens the client's phone or email in the OS default app.

### Logging out

Currently there is no explicit logout button (prototype scope). To log out:
- Close the browser tab (sessionStorage is cleared), or
- Open DevTools → Application → Session Storage → delete the `sativa_role` key.

---

## Booking System

The booking page (`/booking`) is a fully interactive scheduling UI.

### Weekly grid

- **Day columns** Mon–Sun, **time rows** 07:00–20:00, with slot cards absolutely positioned by time.
- **Prev / Next week** navigation shifts the grid one week at a time.
- Slot cards are colour-coded by category: Yoga (olive), Aerobics (warm brown), Zumba (amber).
- Full classes are greyed out and unclickable.

### Booking modal

Clicking an available slot opens a modal with:

- Class description and category badge.
- Instructor mini-profile (initials avatar, credentials chips, bio).
- 2×2 detail grid: date, time, studio location, spots remaining.
- **Participant stepper** (1–4, capped by spots left).
- **Account / Guest toggle**:
  - *Account mode* — shows the logged-in user's name and phone (auto-filled).
  - *Guest mode* — inline Name + Phone fields.
- **Book Now** button — three-state animation: idle → spinning loader → SVG checkmark draw.
- After 1.5 s on the success state the modal closes and a toast confirmation appears.

### URL query param filter

Linking to `/booking?type=power-yoga` (or any class slug) auto-selects the matching filter tab on load:

| Param value | Filter tab selected |
|---|---|
| `yoga`, `power-yoga`, `steam-yoga`, `candle-yoga`, `pregnancy-yoga`, `posture-correction` | Yoga |
| `aerobics` | Aerobics |
| `zumba` | Zumba |
| Anything else / omitted | All |

### My Upcoming Bookings

Visible only when logged in (any role). Shows confirmed bookings sorted by date. Each card has:
- Category colour stripe, class name, date/time, instructor, participant count.
- **Cancel** button → opens a Framer Motion confirm dialog with a cancellation policy note.
- On confirm, the booking is marked cancelled and animates out of the list.

---

## Design System & Tokens

Custom colour tokens are defined in `src/index.css` inside a Tailwind v4 `@theme` block:

```css
@theme {
  --color-sand:    #f7f2ea;   /* page background */
  --color-cream:   #ede7da;   /* section background, alternate */
  --color-charcoal: #26211c;  /* primary text, buttons */
  --color-olive:   #6b7a53;   /* accent / yoga category */
  --color-taupe:   #9a8a76;   /* secondary text, labels */
  --font-sans:     'DM Sans', sans-serif;
  --font-serif:    'Lora', Georgia, serif;
}
```

### Typography convention

- **Body / UI** → `DM Sans` (variable weight, 300–600)
- **Headings / accent words** → `Lora` italic (`fontFamily: 'var(--font-serif)', fontStyle: 'italic'`)
- **Eyebrow labels** → `text-xs uppercase tracking-[0.22em]` in taupe

### Category colour palette (inline, not tokenised)

| Category | Background | Border | Text |
|---|---|---|---|
| Yoga | `rgba(107,122,83,0.13)` | `rgba(107,122,83,0.4)` | `#3a5726` |
| Aerobics | `rgba(138,100,68,0.12)` | `rgba(138,100,68,0.38)` | `#5a3d20` |
| Zumba | `rgba(172,134,54,0.12)` | `rgba(172,134,54,0.36)` | `#7a5814` |

---

## Animation Architecture

### Framer Motion

- **Page transitions** — `AnimatePresence mode="wait"` wraps all routes in `App.tsx`; each page fades in/out.
- **`layoutId` sliding pills** — active nav item, filter tabs, and mode toggles use a shared `layoutId` spring so the highlight slides smoothly between options.
- **Modal entry** — mobile: `y: '100%' → 0` (bottom sheet). Desktop: `scale: 0.91 → 1` (scale-in).
- **List items** — `AnimatePresence` with `layout` prop for smooth height collapse on removal.
- **SVG checkmark** — `pathLength: 0 → 1` draw animation on booking success.

### GSAP + ScrollTrigger

- **Count-up stat cards** — `gsap.to(obj, { val: target })` with `onUpdate` driving React state.
- **Parallax hero image** — `yPercent: 18` scrubbed via ScrollTrigger.
- **BodyBenefits hotspots** — each dot has a ScrollTrigger that fires `once: true` at a staggered scroll offset (10%, 38%, 66% through the section), revealing dots top-to-bottom.
- **Lenis smooth scroll** — synced with `gsap.ticker` so ScrollTrigger positions are accurate.

### Reduced motion

Every animated component reads `useReducedMotion()` (wraps `window.matchMedia('(prefers-reduced-motion: reduce)')`). When true, all enter animations and scroll reveals are skipped; content is shown immediately.

---

## Component Reference

### `ProtectedRoute`

```tsx
<ProtectedRoute role="admin">
  <AdminLayout />
</ProtectedRoute>
```

Reads `sessionStorage.getItem('sativa_role')`. If the stored value does not match the required `role` prop, redirects to `/login` preserving the intended destination in `location.state`.

### `useReducedMotion`

```ts
const reduced = useReducedMotion()
// Returns true if the OS has prefers-reduced-motion: reduce
```

### `useMagneticButton`

```ts
const btnRef = useMagneticButton()
// Returns a RefObject<HTMLButtonElement>
// (magnetic pull effect removed; hook kept for API stability)
```

---

## Development Notes

### Stub APIs

All data fetching is simulated with `setTimeout` delays. To connect a real backend, replace these functions in `src/pages/Booking.tsx`:

```ts
async function fetchSlots(weekStart: Date): Promise<Slot[]> { … }
async function submitBooking(payload: unknown): Promise<void> { … }
async function cancelBooking(bookingId: string): Promise<void> { … }
```

And in the admin pages, replace the `INITIAL_*` arrays with real API calls.

### Adding a real auth layer

1. Replace the `handleSubmit` stub in `src/pages/auth/Login.tsx` with a `fetch('/api/login', …)` call.
2. Store the JWT / session token in `httpOnly` cookies (not sessionStorage) for production.
3. Update `ProtectedRoute` to validate the token server-side rather than checking a sessionStorage string.

### THREE.Clock deprecation warning

`@react-three/fiber` 9.x uses `THREE.Clock` internally, which was deprecated in Three.js r176. A warning suppressor is patched in `src/main.tsx` until R3F ships an update using `THREE.Timer`:

```ts
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return
  _warn(...args)
}
```

### Code formatting

```bash
pnpm format   # runs oxfmt over all TypeScript/TSX files
```

oxfmt enforces double quotes for strings containing apostrophes. Single-quoted strings with unescaped apostrophes will break the TypeScript build — always use `"We're here"` or `{'We\'re here'}`.
