# Give Hub

A community donation exchange platform: people list items they no longer need, and others in the community request them.

**Stack:** React, TypeScript, Tailwind CSS, Firebase (authentication), Supabase (Postgres database and image storage).

## Features
- Email sign up and sign in (Firebase Auth)
- Post items with category, condition, pickup area and a photo (Supabase Storage)
- Browse, search and filter by category
- Request an item (marks it as claimed); owners can relist or remove their items

## Setup
1. `npm install`
2. Create a Firebase project, enable Email/Password sign-in, and copy the web app config.
3. Create a Supabase project and run `supabase.sql` in the SQL editor.
4. Copy `.env.example` to `.env` and fill in the keys.
5. `npm run dev`

## Notes
Firebase handles login while Supabase stores data, so the demo Supabase policies allow anonymous access. Before real use, verify the Firebase ID token in a Supabase Edge Function and tighten the policies.
