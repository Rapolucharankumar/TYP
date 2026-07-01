# Production Deployment Guide: The Youth Prism

This guide explains how to deploy the decoupled full-stack architecture of **The Youth Prism** in a production environment.

```mermaid
flowchart LR
    Frontend[Next.js Frontend\n(Vercel)] -- Fetch REST API --> Backend[Express API Server\n(Render/Railway)]
    Backend -- pg Client --> Database[(Supabase PostgreSQL)]
```

---

## 1. Backend Server Deployment (Node.js/Express)

The backend Express app resides in the `/backend` subdirectory. We will deploy it to **Railway**.

### Steps:
1. **Prepare Git Repo**: Ensure all files inside the `/backend` folder are committed to your GitHub repository.
2. **Sign Up on Railway**: Go to [railway.app](https://railway.app) and sign in using your GitHub account.
3. **Create a New Project**:
   * Click **New Project** -> **Deploy from GitHub repo**.
   * Select your repository containing the project.
4. **Configure Service Subdirectory (Monorepo)**:
   * Once imported, click on the newly created Service block in Railway.
   * Go to **Settings** -> **General**.
   * Find the **Root Directory** field and change it to `backend`. (This is critical: it tells Railway to run commands inside the `/backend` folder).
5. **Configure Environment Variables**:
   * Go to the **Variables** tab for the service.
   * Click **Add Variable** and input:
     * `DATABASE_URL`: `postgresql://postgres:typ@2005TYPBLOG@db.kermwxiaqyygoinddjkq.supabase.co:5432/postgres` (Your Supabase connection string).
   * (Note: Railway automatically configures and injects the `PORT` environment variable, so you do not need to manually set it).
6. **Expose and Generate Domain**:
   * Go to the **Settings** tab -> **Networking**.
   * Click **Generate Domain**.
   * Railway will generate a public address for your backend (e.g., `https://typ-backend-production.up.railway.app`). Copy this URL.


---

## 2. Frontend Deployment (Next.js Client)

The frontend is a standard Next.js application located in the root directory. You can deploy it directly to **Vercel**.

### Steps:
1. **Sign Up on Vercel**: Go to [vercel.com](https://vercel.com) and link your GitHub account.
2. **Create New Project**: Click **Add New** -> **Project**, then import your GitHub repository.
3. **Configure Project Settings**:
   * **Framework Preset**: `Next.js`
   * **Root Directory**: Leave it as the root directory (`./`).
4. **Configure Environment Variables**:
   Under **Environment Variables**, add:
   * `NEXT_PUBLIC_BACKEND_URL`: `https://typ-production.up.railway.app` (Use the Railway URL you copied in Step 1).
   * `NEXT_PUBLIC_SUPABASE_URL`: `https://kermwxiaqyygoinddjkq.supabase.co` (For frontend authentication).


   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
5. **Deploy**: Click **Deploy**. Vercel will compile the Next.js pages and generate your live URL (e.g. `https://typ-blog.vercel.app`).

---

## 3. Post-Deployment Verification

* Open your phone or laptop and visit your deployed Vercel URL.
* Go to `/admin` and write a new test article or add a contributor.
* Open another device (e.g., your mobile phone) and visit the site.
* Verify that the new contributor or article displays instantly on both devices, confirming that they are sync-communicating via the live Express server database.
