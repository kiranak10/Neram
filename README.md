# Neram
A Kerala ambience/music website with an admin login and persistent song library.

## Run locally
1. Install Node.js 18+.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables (recommended).
5. Run `npm start`.
6. Open http://localhost:3000

The demo defaults are `admin@neram.local` / `change-me`; change them before deployment.

## Deploy
Use any Node.js host that provides persistent disk/storage, or replace `uploads/` and `songs.json` with S3/Supabase/Firebase storage/database for production. HTTPS is strongly recommended.

Only upload music you have permission to host and stream.
