# Vercel Deployment & Database Migration Guide

This guide walks you through deploying **RE Manager OS** to Vercel using a serverless cloud database (**Turso**) and cloud-based file storage (**Vercel Blob**).

---

## Prerequisites

1. A **GitHub** account.
2. A **Vercel** account.
3. A **Turso** account (for serverless SQLite hosting). Sign up for free at [turso.tech](https://turso.tech).

---

## Step 1: Create a Turso Database

Turso is a serverless database engine built on **LibSQL** (a fork of SQLite). It is 100% compatible with SQLite schemas and designed for Edge and Serverless computing.

1. **Install the Turso CLI** on your local machine (or use the Turso web dashboard):
   ```bash
   # On macOS/Linux/WSL:
   curl -sSf https://get.turso.tech/install.sh | sh
   ```
2. **Authenticate the CLI**:
   ```bash
   turso auth login
   ```
3. **Create a new database**:
   ```bash
   turso db create re-manager-db
   ```
4. **Retrieve the Database URL**:
   ```bash
   turso db show re-manager-db --url
   # Example output: libsql://re-manager-db-username.turso.io
   ```
5. **Generate an Auth Token**:
   ```bash
   turso db tokens create re-manager-db
   # Save this token securely. It acts as the password for the database.
   ```

---

## Step 2: Push Database Schema to Turso

Deploying to production requires applying your Drizzle schema/tables to the new Turso database. You can do this by executing `db:push` locally with the Turso credentials.

Run the following command in the root of your project directory:

```bash
DATABASE_URL="libsql://your-db-url.turso.io" DATABASE_AUTH_TOKEN="your-token" npm run db:push
```

This will run Drizzle Kit's push utility, which automatically connects to Turso and constructs the tables (`users`, `organizations`, `properties`, etc.) as defined in `src/lib/db/schema.ts`.

---

## Step 3: Set Up Vercel Blob Storage

Because Vercel serverless functions are ephemeral, storing uploaded documents (such as PDFs for Gemini AI analysis) on the local filesystem (`public/uploads`) will not persist. 

The application has been refactored to automatically use **Vercel Blob** when a connection token is present:

1. Import your project into Vercel.
2. Go to your project page on the Vercel Dashboard.
3. Click on the **Storage** tab.
4. Select **Connect Database** -> **Create New** -> **Blob**.
5. Follow the prompts to provision the Blob store.
6. Once connected, Vercel will automatically inject the `BLOB_READ_WRITE_TOKEN` environment variable into your project settings. The app will immediately start routing all new document uploads to Vercel Blob!

---

## Step 4: Configure Vercel Environment Variables

In your Vercel project settings, navigate to **Settings** -> **Environment Variables** and add the following keys:

### Database (Turso)
- `DATABASE_URL`: `libsql://your-db-url.turso.io` (from Step 1)
- `DATABASE_AUTH_TOKEN`: `your-auth-token` (from Step 1)

### Firebase Configuration
These values should match the ones in your `.env.local` file:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### AI & Session
- `GEMINI_API_KEY`: Your Google AI Studio/Gemini API Key (needed for PDF analysis).
- `JWT_SECRET`: A secure random secret key (e.g., generated with `openssl rand -base64 32`) to sign user session cookies.

---

## Step 5: Deploy

Once the environment variables and storage integrations are configured, click **Deploy** on Vercel.

Your site will build and run on Vercel's global edge network, using Turso for persistent state and Vercel Blob for document uploads!
