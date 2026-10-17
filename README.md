# Tiramisu — Make New Friends

![Tiramisu Logo](./favicon.png)


Tiramisu is a warm, playful social discovery app built around one idea: making a new friend should feel easy, low-pressure, and a little joyful.

The product blends nearby discovery, soft social prompts, and lightweight messaging to help people find common ground without the awkwardness of a cold introduction.

Live demo: https://tiramisu-make-new-friends.vercel.app/

## Why this project exists

Many social apps focus on speed, scale, or performance, but not on emotional ease. Tiramisu explores a more human approach to connection: friendly discovery, low-stakes interaction, and a design that feels welcoming from the first tap.

It is built around the idea that small moments of joy can make conversation feel natural.

## Key features

- Nearby social discovery with a map-based experience
- Search and interest filters to find people with similar energy
- Profile cards with personality, interests, and ice-breaker prompts
- Messaging flow designed for easy, low-pressure conversation
- Joy Room with playful “Would You Rather” prompts
- Privacy-conscious approximate location model instead of exact personal pins
- Responsive interface designed for quick exploration on mobile and desktop
- Supabase-ready architecture for auth and future real data persistence

## Product experience

### Discover
Users can browse nearby people, explore shared interests, and get a quick sense of compatibility without forcing a formal introduction.

### Joy Room
The app includes fun, lightweight prompts that make it easier to start talking without a heavy social setup.

### Messages
The messaging experience is intentionally calm and approachable, with a playful tone that encourages meaningful but low-pressure conversation.

### Privacy-first design
Location is approximate and intentionally non-invasive, helping the experience feel social without becoming too personal or exposed.

## Tech stack

- React + TypeScript
- Vite
- Supabase-ready auth and database structure
- Custom responsive UI and themed design system

## Run locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Supabase setup

1. Create or open a Supabase project.
2. Add your project URL and anon key to a local environment file:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-browser-safe-publishable-or-anon-key
```

3. Add your local and production app URLs to the Supabase authentication redirect settings.
4. Run the database schema in [`supabase/schema.sql`](./supabase/schema.sql).

This project is designed to handle missing environment configuration gracefully and display a clear demo state instead of pretending auth is active.

## Demo status

This is a polished front-end experience with a backend-ready foundation. Several pieces are intentionally demo-mode until real data flows are connected.

Examples:

- Discovery profiles are rendered from demo content
- Messaging threads are local browser examples
- Voice and transcription flows are planned integration points
- Supabase auth and data structure are prepared for real implementation

## Feature status

| Area | Status |
| --- | --- |
| Login and signup | Ready when Supabase is configured |
| Session persistence | Ready with Supabase auth |
| Protected routes | Included |
| Discover map | Demo-playable |
| Search and interest filtering | Working locally |
| Joy Room | Fully playable |
| Messaging UI | Demo-ready |
| Supabase schema and RLS | Included |
| Voice / transcription | Planned integration |

## Project structure

- `src/App.tsx` — app routing and auth-aware screen flow
- `src/components/` — shell, navigation, map, cards, and shared UI
- `src/pages/` — discover, messages, joy, auth, and profile screens
- `src/data/demo.ts` — demo profiles, prompts, and conversation content
- `src/lib/` — Supabase and auth helpers
- `src/styles/` — theme and global styling
- `supabase/schema.sql` — database schema and permissions

## Deployment

Build for deployment with:
### Vercel

Import the GitHub repository into Vercel and use these settings (they are also committed in `vercel.json`):

- **Framework Preset:** Vite
- **Install Command:** `npm ci`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Root Directory:** `.`

Add these Environment Variables for **Production**, **Preview**, and **Development**:

```text
VITE_SUPABASE_URL=https://wnwuxsnokhyuitvynvqq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-browser-safe-publishable-key
```

Do not add `Tiramisu_SUPABASE_SECRET_KEY`, `Tiramisu_SUPABASE_JWT_SECRET`, either Postgres URL, the database password, or any service-role/secret key to a Vercel frontend environment. Vercel rebuilds the frontend when these variables change, so redeploy after saving them.

In Supabase **Authentication → URL Configuration**, set the **Site URL** to your production Vercel domain and add these redirect URLs:

```text
https://your-project.vercel.app/**
https://your-custom-domain.example/**
http://localhost:3000/**
```

The committed Vercel rewrite keeps client-side routes working when a user refreshes `/login`, `/discover`, `/messages`, `/joy`, or `/profile`.

### Other static hosts

For a static deployment, build with:

```bash
npm run build
```

Then publish the generated `dist/` folder to a static host such as Vercel, Netlify, or Cloudflare Pages. Make sure Supabase environment variables are configured in the deployment environment.

## Final note

Tiramisu is a product-first social prototype focused on reducing social friction and making new connections feel more approachable, friendly, and human.

It is designed to feel memorable from the first screen while still being a clean foundation for a real-world social app.
