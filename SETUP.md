# YOOM (Zoom Clone) — Full Setup Guide

This document explains everything needed to run the YOOM video-calling app on a
fresh laptop in VS Code, from installing tools to signing in and using the app.

The app is built with **Next.js 14**, **Clerk** (authentication), **Stream**
(video/audio), and **Groq** (the AI Chat assistant).

---

## 1. Prerequisites — install these first

Install the following on the new laptop before doing anything else.

| Tool | Version | Where to get it |
|------|---------|-----------------|
| **Node.js** | 18.18 or newer (20+ recommended) | https://nodejs.org (download the LTS installer) |
| **npm** | comes bundled with Node.js | — |
| **Git** | any recent version | https://git-scm.com/downloads |
| **VS Code** | latest | https://code.visualstudio.com |

### Verify the installs
Open a terminal (PowerShell on Windows) and run:

```powershell
node --version
npm --version
git --version
```

Each should print a version number. If `node` isn't recognized, close and
reopen the terminal, or restart the laptop after installing Node.

### Recommended VS Code extensions
- **ESLint**
- **Tailwind CSS IntelliSense**
- **Prettier – Code formatter**

---

## 2. Get the project onto the laptop

Choose **one** of the two options.

### Option A — Copy the project folder
Copy the entire `zoom-clone-main` folder (via USB drive, cloud, etc.) to the
new laptop. **Do not copy** the `node_modules` or `.next` folders — they are
large and will be recreated. If they came along, delete them after copying.

> Tip: Avoid putting the project inside a synced folder like OneDrive or
> Google Drive. Cloud sync fights with Next.js and makes the app slow and
> occasionally corrupts the build cache. A plain folder such as `C:\dev\yoom`
> works best.

### Option B — Clone from Git (if the project is in a repository)
```powershell
git clone <your-repository-url>
cd zoom-clone-main
```

---

## 3. Open the project in VS Code

1. Launch VS Code.
2. **File → Open Folder…**
3. Select the `zoom-clone-main` folder.
4. Open the integrated terminal: **Terminal → New Terminal** (or press
   `` Ctrl + ` ``). It opens inside the project folder automatically.

---

## 4. Install dependencies

In the VS Code terminal, run:

```powershell
npm install
```

This downloads all packages listed in `package.json` into a new `node_modules`
folder. It can take a few minutes. On Windows you may see a few `npm warn`
messages — those are harmless as long as it finishes with something like
`added N packages`.

---

## 5. Create the environment file (`.env`)

The app needs API keys to work. These are stored in a file named `.env` in the
project root. This file is **not** included in the project for security, so you
must create it.

1. In the project root, create a new file named exactly `.env`
   (there is a template file `.env.example` you can copy).
2. Paste the following into it and fill in the real values (see Section 6 for
   how to get each key):

```env
# ---- Clerk (Authentication) ----
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/home
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/home

# ---- Stream (Video / Audio) ----
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key

# ---- App ----
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ---- AI Chat (Groq) ----
GROQ_API_KEY=your_groq_api_key
```

> If you already have the `.env` values from the original laptop, you can just
> copy that same `.env` file over and skip Section 6.

---

## 6. Get the API keys (free accounts)

You need three sets of keys. All three services have free tiers.

### 6.1 Clerk (login / authentication)
1. Go to https://dashboard.clerk.com and sign up.
2. Create an application (choose **Consumer**). Enable **Email** and **Google**
   sign-in options.
3. In the sidebar open **API Keys** and copy:
   - **Publishable key** (`pk_test_...`) → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** (`sk_test_...`) → `CLERK_SECRET_KEY`
4. Recommended: enable **Google** under
   **Configure → SSO / Social connections**. Google sign-in is the most
   reliable during development because it doesn't rely on email delivery.

### 6.2 Stream (video and audio calls)
1. Go to https://dashboard.getstream.io and sign up.
2. Create an app (product: **Video & Audio**).
3. From the app dashboard copy:
   - **API Key** → `NEXT_PUBLIC_STREAM_API_KEY`
   - **API Secret** → `STREAM_SECRET_KEY`

### 6.3 Groq (the AI Chat assistant)
1. Go to https://console.groq.com/keys and sign in.
2. Click **Create API Key** and copy the value (starts with `gsk_...`).
3. Put it in `GROQ_API_KEY`.

---

## 7. Run the app

In the VS Code terminal:

```powershell
npm run dev
```

Wait until you see:

```
✓ Ready in ...
- Local:  http://localhost:3000
```

Then open **http://localhost:3000** in a browser (Ctrl+Click the link in the
terminal).

To stop the server, click in the terminal and press **Ctrl + C**.

---

## 8. Using the app

1. **http://localhost:3000** opens the **landing page**.
2. Click **Get Started** (or **Sign In**).
3. Sign in — the easiest option is **Continue with Google**.
4. After signing in you land on the **dashboard** at `/home`, where you can:
   - Start an instant meeting (**New Meeting**)
   - **Join** a meeting by link
   - **Schedule** a meeting
   - View **Recordings**
   - Use your **Personal Room**
   - Chat with the **AI Chat** assistant
5. Your **profile** appears at the bottom of the left sidebar. Click the avatar
   to manage your account or sign out.

---

## 9. Routes reference

| URL | Page | Access |
|-----|------|--------|
| `/` | Landing page | Public |
| `/sign-in`, `/sign-up` | Authentication | Public |
| `/home` | Dashboard | Signed-in only |
| `/upcoming`, `/previous`, `/recordings` | Meeting lists | Signed-in only |
| `/personal-room` | Personal meeting room | Signed-in only |
| `/ai-chat` | AI assistant | Signed-in only |
| `/meeting/[id]` | A live meeting | Signed-in only |

Visiting a signed-in page while logged out redirects to the landing page.

---

## 10. Common commands

| Command | What it does |
|---------|--------------|
| `npm install` | Install dependencies (run once after copying/cloning) |
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Create a production build (also checks for errors) |
| `npm start` | Run the production build (after `npm run build`) |
| `npm run lint` | Check code style |

---

## 11. Troubleshooting

**"Port 3000 is in use, trying 3001 instead."**
An old dev server is still running. Either use the new port it prints, or stop
the old one. On Windows, free port 3000 with:
```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

**The app is slow or shows a spinner / blank screen / 404 for chunks.**
The build cache is corrupted (common on OneDrive). Stop the server and clear it:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```
The first visit to each page compiles on demand and is slow; it's fast after
that. Best long-term fix: keep the project off OneDrive.

**"Publishable key not valid" error.**
The Clerk keys in `.env` are missing or wrong. Re-copy them from the Clerk
dashboard, then restart the server (`Ctrl + C`, then `npm run dev`).
Remember: changes to `.env` only take effect after restarting the server.

**Sign-up says "Authentication unsuccessful due to failed security validations"
or "Communication locked".**
Use **Continue with Google** instead of email/password. Google sign-in doesn't
depend on Clerk sending emails, so it avoids both problems.

**AI Chat replies with an error.**
Check that `GROQ_API_KEY` is set correctly in `.env` and restart the server.
Groq free-tier keys occasionally hit rate limits — wait a few seconds and
resend.

**Meeting invite links don't work for other people.**
`NEXT_PUBLIC_BASE_URL=http://localhost:3000` only works on your own machine.
For others to join, deploy the app (e.g. Vercel) or use a tunnel like ngrok,
then set `NEXT_PUBLIC_BASE_URL` to that public URL and restart.

---

## 12. Quick start (summary)

```powershell
# 1. Open the project folder in VS Code, then in the terminal:
npm install

# 2. Create a .env file and fill in the keys (see Sections 5 & 6)

# 3. Start the app
npm run dev

# 4. Open http://localhost:3000 and sign in with Google
```

That's it — you're running YOOM.
