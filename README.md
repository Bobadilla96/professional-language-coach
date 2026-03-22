# 01-tech-english-coach

Next.js app focused on practical technical English for software developers.

## Features implemented
- Landing page (`/`) with product overview, language selector and personalized learning path setup.
- Auth flow on Supabase Auth with graceful fallback to local demo mode when Supabase env vars are missing.
- Route protection for `/dashboard`, `/lessons`, `/practice`, `/progress`, `/writing-lab` and `/conversation`.
- Dashboard with global metrics and topic progress.
- Lessons module with list, filters, and dynamic lesson detail route.
- Conversational module (`/conversation`) with:
  - scenario-based role play
  - AI coach response and improved sentence
  - voice synthesis via Microsoft VibeVoice realtime websocket server
- Practice module with 4 exercise types:
  - multiple choice
  - fill in the blank
  - sentence correction
  - scenario selection
- Writing Lab with rule-based correction engine and professional rewrite.
- AI lesson assistant per lesson using free model router (`openrouter/free`) through `/api/ai/lesson-assistant`.
- Progress module with charts, mastered topics, lesson attempts, and common errors.
- Cloud sync to Supabase for:
  - user profile
  - learning preferences
  - user progress snapshot (`jsonb`)
- Zustand local persistence kept as offline/cache layer.
- Light/Dark mode with persistent preference.

## Routes
- `/`
- `/login`
- `/register`
- `/dashboard`
- `/lessons`
- `/lessons/[lessonId]`
- `/practice`
- `/conversation`
- `/progress`
- `/writing-lab`
- `/courses`
- `/courses/[courseId]`
- `/bbc`
- `/bbc/[unitNumber]`

## Tech stack
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Zustand
- React Hook Form + Zod
- Recharts
- Supabase Auth + Postgres + RLS

## Supabase integration
The project uses the SSR pattern with:
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/proxy.ts`
- `proxy.ts`

### Tables in Supabase
Schema file:
- `supabase/schema.sql`

Tables created:
- `public.profiles`
- `public.learning_preferences`
- `public.user_progress`

Security:
- RLS enabled on all tables
- policies restricted to `auth.uid()`
- trigger `handle_new_user()` creates/updates `profiles` from `auth.users`

## Environment variables
Copy `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_DB_HOST=
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=
OPENROUTER_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
VIBEVOICE_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_VIBEVOICE_BASE_URL=http://127.0.0.1:8000
```

Notes:
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the main key used by the app.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` is also accepted for compatibility with alternate Supabase snippets.
- If Supabase env vars are missing, auth falls back to local demo mode.

## AI setup (free API)
This project uses OpenRouter free router (`openrouter/free`) for lesson Q&A.

```bash
OPENROUTER_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Without `OPENROUTER_API_KEY`, the app still works but AI assistant returns a configuration message.

## VibeVoice setup (conversation voice module)
This project integrates with Microsoft `VibeVoice` realtime demo server.

1. In another terminal, run VibeVoice web demo (GPU recommended):
```bash
cd <path-to-VibeVoice>
python demo/vibevoice_realtime_demo.py --port 8000
```
2. Configure:
```bash
VIBEVOICE_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_VIBEVOICE_BASE_URL=http://127.0.0.1:8000
```
3. Open `/conversation` and select voice preset.

If VibeVoice server is down, conversation text coach still works and UI will show a guided voice error.

## Local content
Private local learning materials are expected under:
- `cursos/`
- `clases/`
- `clases-descargadas/`

Important:
- those folders are intentionally gitignored
- BBC PDF/audio integration works only when the local archives exist on the machine
- this keeps the repository lightweight and avoids publishing copyrighted/private course assets

## Deployment note
This project is not a good candidate for GitHub Pages because it relies on:
- Next.js App Router server features
- API routes under `src/app/api/*`
- Supabase SSR auth/session handling
- local archive streaming for BBC assets

For a real public deployment, use a server-capable platform such as Vercel.

## Demo login
Only available when Supabase env vars are not configured:
- Email: `demo@coach.dev`
- Password: `demo123`

## Validation
Validated locally with:
- `npm run lint`
- `npm run test`
- `npm run build`

## Scripts
```bash
npm run dev
npm run lint
npm run build
npm run start
npm run test
```
