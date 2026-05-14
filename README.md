# Squash Tracker

Single-page round-robin squash tournament tracker. One self-contained `index.html` — vanilla JS, no build step. State persists in `localStorage`.

## Local
Just open `index.html` in any modern browser.

## Deploy on Railway
Railway auto-detects this as a Node project and runs `npm start`, which serves the static file with [`serve`](https://www.npmjs.com/package/serve) on the port Railway provides via `$PORT`.

Steps:
1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo → pick this repo**.
3. After the first deploy, open **Settings → Networking → Generate Domain** to get a public URL.
4. Open the URL on your phone.
