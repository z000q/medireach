# Getting MediReach fully live — 100% free

This version costs nothing to run: GitHub Pages (free), Vercel's Hobby plan
(free), and Google's Gemini API free tier (free, no credit card needed).

Total time: about 15 minutes. You'll need a GitHub account and a Google account.

---

## Part 1 — Get a free Gemini API key

1. Go to **aistudio.google.com/apikey** and sign in with a Google account.
2. Click **Create API key**. No credit card, no billing setup required.
3. Copy the key somewhere safe.

The free tier has rate limits (roughly 10-15 messages per minute, a daily
cap) — more than enough for a portfolio demo where a few people try it out.
Google does occasionally change which model names are free; if the chat
ever errors out with something about billing or "model not found," open
`api/chat.js`, check https://ai.google.dev/gemini-api/docs/pricing for the
current free model, and update the `GEMINI_MODEL` line near the top.

---

## Part 2 — Put this project on GitHub

1. Go to **github.com**, log in, and click **New repository**.
   Name it something like `medireach`. Keep it Public. Create it.
2. On the new repo's page, click **Add file → Upload files**.
3. Drag in `index.html`, `README.md`, and the whole `api` folder (with
   `chat.js` inside it).
4. Scroll down and click **Commit changes**.

Your repo should now look like:
```
your-repo/
  index.html
  api/
    chat.js
  README.md
```

---

## Part 3 — Deploy the chat API on Vercel (free)

GitHub Pages can only serve static files, so the API function needs to run
somewhere that can execute code — Vercel's free Hobby plan does this.

1. Go to **vercel.com** and sign up with "Continue with GitHub."
2. Click **Add New → Project**, and import the `medireach` repo.
3. Before deploying, expand **Environment Variables** and add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** *(paste the key from Part 1)*
4. Click **Deploy**. Wait about a minute.
5. Copy the URL Vercel gives you, e.g. `https://medireach-yourname.vercel.app`.

---

## Part 4 — Turn on GitHub Pages and connect it

1. In your GitHub repo: **Settings → Pages**.
2. Under "Build and deployment," set **Source** to "Deploy from a branch,"
   branch `main`, folder `/ (root)`. Save.
3. GitHub gives you a live URL like `https://yourusername.github.io/medireach/`
   (can take a minute or two to activate the first time).
4. Edit `index.html` on GitHub (click the pencil icon), find:
   ```js
   const API_BASE_URL = "✏️ PASTE_YOUR_VERCEL_URL_HERE";
   ```
   and replace it with your real Vercel URL from Part 3:
   ```js
   const API_BASE_URL = "https://medireach-yourname.vercel.app";
   ```
   Commit the change.
5. Give it a minute to redeploy, then visit your live site and test the chat.

---

## If the chat doesn't respond

- Open your browser's dev console (right-click → Inspect → Console) on your
  live site and read the error.
- Check Vercel's **Deployments → Functions → Logs** tab — that's where
  `api/chat.js` reports what went wrong (usually a missing/mistyped
  environment variable, or a model name that's no longer free — see Part 1).
- Make sure `API_BASE_URL` has no trailing slash and starts with `https://`.

## Editing content later

All page text (stats, headings, "Why I built this") lives in `index.html` —
search for `✏️` for the parts you still need to personalize. Every commit to
`index.html` updates your live GitHub Pages site automatically within a
minute or two.
