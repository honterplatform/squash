# Squash Tracker

Round-robin squash tournament tracker. Vanilla-JS frontend (`index.html`) + tiny Node/Express backend (`server.js`) that mirrors the full app state to MongoDB so it syncs across devices. If no database is configured, the frontend falls back to `localStorage` (per-device only).

## Local development

```
npm install
npm start            # localStorage-only mode
```

To run against a local MongoDB:

```
MONGO_URL="mongodb://localhost:27017" npm start
```

Open http://localhost:3000.

## Deploy on Railway

1. Push to GitHub.
2. Railway → **New Project → Deploy from GitHub repo** → pick this repo. Railway will run `npm install` and `npm start` (which boots `server.js`).
3. Add MongoDB: in the same Railway project, **+ New → Database → Add MongoDB** (or use the MongoDB template). Railway creates a service that exposes a connection string as `MONGO_URL`.
4. Link the web service to the DB: open the web service → **Variables → Add Reference → MongoDB → MONGO_URL**. (Or copy the connection string and add `MONGO_URL` as a plain env var.) Railway will redeploy.
5. Open the public domain. The frontend will hit `/api/state` and sync to/from MongoDB automatically.

## Sync model

- One MongoDB document under `_id: 'global'` holds the entire app state (current tournament + history).
- The frontend saves on every mutation (debounced ~400 ms) and re-fetches when the tab regains focus, so any device picks up changes from the others.
- No auth: anyone with the Railway URL can view/edit the data.
