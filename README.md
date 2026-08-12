# Burton's Reliable — Premium HVAC Platform

A production-grade rebuild of **burtonsreliablellc.com** for Burton's Reliable Heating and
Air Conditioning LLC (Baton Rouge, LA): cinematic WebGL marketing site + online booking +
AI chat with human handoff + full admin console.

## Stack

- **React 19 + TypeScript + Vite** — SPA with route-level code splitting
- **Three.js + React Three Fiber + Drei** — procedural 3D HVAC hero & interactive system explorer
- **GSAP + ScrollTrigger, Framer Motion** — intro timelines, scroll scenes, micro-interactions
- **Tailwind CSS v4** — design system (deep royal blue / electric blue / navy / controlled red)
- **Supabase** — Postgres, Auth, Realtime, RLS (schema in `supabase/migrations/001_init.sql`)
- **Zustand, Recharts, Lucide** — state, admin analytics, icons

## Run it

```bash
npm install
npm run dev
```

Without Supabase env vars the app runs in **demo mode**: all data (bookings, leads, chat,
knowledge base, notifications, CMS content) is stored in `localStorage` with cross-tab
"realtime", so every feature is testable locally. Admin login in demo mode: any email +
password `demo`.

## Go to production

1. Create a Supabase project, run `supabase/migrations/001_init.sql`.
2. `cp .env.example .env` and fill in `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
3. Create admin users in Supabase Auth, then insert matching rows in `public.users`
   with a role (`SUPER_ADMIN` / `ADMIN` / `STAFF`).
4. Replace the placeholder review cards in `src/components/home/ReviewsSection.tsx`
   with verified customer reviews.
5. Drop the official logo into `public/` and swap the SVG mark in
   `src/components/layout/Logo.tsx` if desired.
6. Harden: move anonymous chat reads behind a per-conversation token via an Edge
   Function and add rate limiting (see notes at the bottom of the SQL migration).
   Configure email/SMS notifications (e.g. Supabase Edge Function + Twilio/Resend)
   on `bookings` inserts and status changes.

## Structure

```
src/
  components/   layout (nav/footer), home sections, three (WebGL), booking, chat, ui
  pages/        public pages + pages/admin (SaaS console)
  lib/          constants (verified business facts), db (Supabase ⇄ local adapter),
                auth, chatbot brain, SEO/schema helpers
  data/         services & FAQ content
supabase/       SQL schema with RLS + realtime
```

## Content policy

Business facts (phone, address, hours, 13+ years, free estimates) come from the existing
site/public listings — see `src/lib/constants.ts`. No pricing, licenses, certifications,
financing terms, technicians or reviews are invented; the chatbot refuses to guess and
offers human handoff instead.
