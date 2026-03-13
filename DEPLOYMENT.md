## Deployment Guide

This project has:

- **Frontend**: React (Vite) app in the `client` folder
- **Backend**: Node/Express API in the `server` folder
- **Database**: MongoDB (to be hosted on MongoDB Atlas)

You will:

1. Set up **MongoDB Atlas** and get a connection string.
2. Deploy the **backend API** to **Render**.
3. Deploy the **frontend** to **Vercel**.
4. Configure **CORS** and environment variables so everything talks to each other.

---

## 1. Environment variables overview

You will need these environment variables in different places:

- **Backend / Render**
  - `MONGO_URI` – MongoDB Atlas connection string.
  - `PORT` – optional; Render usually sets its own, but you can keep using `process.env.PORT || 5000` in code.
  - `JWT_SECRET` – secret key for signing JWTs (can be any long random string).
  - `FRONTEND_URL` – URL of your deployed frontend (e.g. `https://your-app.vercel.app`).

- **Frontend / Vercel (Vite)**  
  - `VITE_API_BASE_URL` – base URL of your backend API on Render (e.g. `https://your-backend.onrender.com`).

Locally, you can still use:

- Backend: `MONGO_URI=mongodb://localhost:27017/...` or your local Atlas URL.
- Frontend: `VITE_API_BASE_URL=http://localhost:5000`.

---

## 2. Confirm CORS configuration (already added)

In `server/server.js` the CORS middleware is configured like this:

```js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
```

This means:

- In development it allows requests from `http://localhost:5173`.
- In production, you just set **`FRONTEND_URL` in Render** (for example, `https://your-frontend.vercel.app`) and you do **not** need to change the code.

On Render you will set `FRONTEND_URL` in the environment variable settings (see section 4).

---

## 3. Set up MongoDB Atlas

1. Go to MongoDB Atlas and create an account (free tier is fine).
2. Create a **Project** and then a **Cluster** (Free tier / M0).
3. In **Database Access**:
   - Create a new database user with a strong username/password.
4. In **Network Access**:
   - Add IP address **`0.0.0.0/0`** (for simplicity during development).  
     - Later, you can lock this down to Render/Vercel IPs if you want.
5. In **Database > Connect**:
   - Choose **Connect your application**.
   - Copy the **connection string**, it will look like:
     - `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority`
6. Replace `<username>`, `<password>`, and `<dbname>` as needed.
7. Save this string somewhere safe – you will use it as `MONGO_URI` on Render.

---

## 4. Deploy backend to Render

### 4.1 Prepare the repo

Your backend lives in the `server` folder with `server.js` as the entry point and `package.json` already defining:

- `"start": "node server.js"`

Make sure all your latest backend changes are committed and pushed to GitHub.

### 4.2 Create a new Web Service on Render

1. Go to Render and log in (GitHub login is easiest).
2. Click **New** → **Web Service**.
3. Choose **“Build and deploy from a Git repository”** and select your project repo.
4. In the **Root Directory** field, set it to `server` so Render knows to use that folder.
5. Set:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

Render will automatically detect the `PORT` environment variable and your code already uses `process.env.PORT || 5000`, which is fine.

### 4.3 Configure backend environment variables on Render

In the newly created service, go to **Settings → Environment** (or **Environment Variables**) and add:

- `MONGO_URI` = *your Atlas connection string*
- `JWT_SECRET` = *a long random string (e.g. from an online generator)*
- `FRONTEND_URL` = *your Vercel URL, e.g. `https://your-app.vercel.app`*  
  - If you don’t know this yet, you can deploy the frontend first and come back to add/update this value.

Click **Save** and then **Deploy** or **Restart** the service so the new env vars take effect.

### 4.4 Get the backend URL

After Render finishes deploying:

1. Open the service page.
2. At the top you’ll see something like `https://your-backend.onrender.com`.
3. This is your **backend base URL**.
4. Test quickly:
   - Open `https://your-backend.onrender.com/` in the browser.
   - You should see the JSON message from your root route.

You will use this Render URL as `VITE_API_BASE_URL` in Vercel.

---

## 5. Update frontend API base URL for deployment

In `client/src/services/api.js` the base URL is currently:

```js
const API_BASE_URL = 'http://localhost:5000';
```

To make this work for both local development and production (without changing code each time), update it to use a Vite environment variable:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

Then:

- **Locally**: create `client/.env` with:

  ```env
  VITE_API_BASE_URL=http://localhost:5000
  ```

- **On Vercel**: you’ll set `VITE_API_BASE_URL` to your Render backend URL (see section 6).

---

## 6. Deploy frontend to Vercel

### 6.1 Connect the GitHub repo

1. Go to Vercel and log in (GitHub login is easiest).
2. Click **Add New… → Project**.
3. Import your GitHub repository that contains this project.

### 6.2 Configure project settings

When Vercel asks for configuration:

- **Framework Preset**: Select **Vite** (if it doesn’t auto-detect).
- **Root Directory**: set to `client` (because your frontend lives there).
- **Build Command**: `npm run build` (from `client/package.json`).
- **Output Directory**: `dist`.

### 6.3 Set frontend environment variables (Vercel)

In the same setup screen (or later under **Settings → Environment Variables**):

- Add:

  - `VITE_API_BASE_URL` = `https://your-backend.onrender.com`

Click **Deploy**.

### 6.4 Get the frontend URL

Once the deployment completes:

1. Vercel will give you a URL like `https://your-app.vercel.app`.
2. This is the URL you should use as:
   - The URL you share with users.
   - The value of `FRONTEND_URL` in Render.

If you change this URL later (e.g. add a custom domain), just update `FRONTEND_URL` in Render’s environment variables – no code change or Git push needed.

---

## 7. Final CORS and communication check

1. **Backend (Render)**:
   - `FRONTEND_URL` is set to your Vercel URL.
   - CORS middleware in `server.js` uses `process.env.FRONTEND_URL` or `http://localhost:5173`.
2. **Frontend (Vercel)**:
   - `VITE_API_BASE_URL` is set to your Render backend URL.
3. **Local development**:
   - Backend: run `npm run dev` in `server` (if you want nodemon) or `npm start`.
   - Frontend: run `npm run dev` in `client`.
   - `FRONTEND_URL` is not needed locally; the fallback `http://localhost:5173` handles dev.

If you ever hit CORS errors in the browser console:

- Make sure the Render `FRONTEND_URL` exactly matches the origin shown in the browser (`https://...vercel.app`), including **https** and without a trailing slash.
- Confirm you are calling the correct backend URL from the frontend (`VITE_API_BASE_URL`).

---

## 8. Quick checklist

- [ ] MongoDB Atlas cluster created and `MONGO_URI` connection string working.
- [ ] Backend deployed to Render from the `server` directory.
- [ ] Render environment variables: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` set.
- [ ] Frontend `API_BASE_URL` logic in `client/src/services/api.js` uses `import.meta.env.VITE_API_BASE_URL`.
- [ ] Vercel project created from the same GitHub repo with root directory `client`.
- [ ] Vercel environment variable `VITE_API_BASE_URL` points to the Render backend URL.
- [ ] Visiting the Vercel URL loads the app and all API calls succeed without CORS errors.

