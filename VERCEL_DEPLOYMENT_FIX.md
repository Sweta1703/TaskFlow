# Vercel Deployment Fix - TaskFlow

## The Problem
You're getting **405 error** because your frontend is trying to call `/api/auth/register` on the same domain, but **there's no backend there**!

In production, you need to deploy **frontend** and **backend** as **separate projects** on Vercel.

---

## ✅ Solution: Deploy Frontend & Backend Separately

### Step 1: Deploy Backend First

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Click "Add New" → "Project"

2. **Import Your GitHub Repository**
   - Select your `TaskFlow` repository

3. **Configure Backend Deployment**
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

4. **Set Environment Variables** (IMPORTANT!)
   Click "Environment Variables" and add:
   ```
   MONGODB_URI = your-mongodb-atlas-connection-string
   JWT_SECRET = your-super-secret-jwt-key-123
   NODE_ENV = production
   ```

   > **Note**: You MUST use MongoDB Atlas (cloud database), not localhost!
   > Get your connection string from: https://cloud.mongodb.com

5. **Deploy Backend**
   - Click "Deploy"
   - Wait for deployment to finish
   - **Copy the deployed URL** (example: `https://taskflow-backend-abc123.vercel.app`)

---

### Step 2: Deploy Frontend

1. **Go Back to Vercel Dashboard**
   - Click "Add New" → "Project" again
   - Select the SAME `TaskFlow` repository

2. **Configure Frontend Deployment**
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables** (CRITICAL!)
   Add this ONE variable:
   ```
   VITE_API_URL = https://your-backend-url.vercel.app/api
   ```
   
   **Replace** `https://your-backend-url.vercel.app` with your actual backend URL from Step 1!
   
   **Example:**
   ```
   VITE_API_URL = https://taskflow-backend-abc123.vercel.app/api
   ```

4. **Deploy Frontend**
   - Click "Deploy"
   - Wait for deployment to finish

---

### Step 3: Update Backend CORS

Your backend needs to allow requests from your deployed frontend!

**Edit `backend/server.js`:**

```javascript
// Replace this line:
app.use(cors());

// With this:
app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development
    'https://your-frontend-url.vercel.app'  // Production
  ],
  credentials: true
}));
```

**Then:**
1. Commit and push changes to GitHub
2. Vercel will automatically redeploy your backend

---

## Quick Checklist

- [ ] Backend deployed on Vercel
- [ ] MongoDB Atlas connection string added to backend env vars
- [ ] Backend URL copied
- [ ] Frontend deployed on Vercel (separate project)
- [ ] `VITE_API_URL` environment variable set in frontend with backend URL
- [ ] CORS updated in backend with frontend URL
- [ ] Both deployments successful

---

## Testing

1. Visit your **frontend URL**
2. Try to register a new account
3. If it works → ✅ Success!
4. If still errors → Check browser console and Vercel logs

---

## Common Issues

### Issue: Still getting 405 or CORS errors
**Fix**: Make sure you added the frontend URL to CORS in `server.js`

### Issue: MongoDB connection failed
**Fix**: 
- Use MongoDB Atlas, not localhost
- Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas Network Access
- Check connection string format

### Issue: "VITE_API_URL is not defined"
**Fix**: Make sure you added `VITE_API_URL` in Vercel environment variables for the frontend project

---

## Your Deployment URLs

After deployment, you'll have:

**Backend**: `https://taskflow-backend-[random].vercel.app`
**Frontend**: `https://taskflow-[random].vercel.app`

Users will only visit the frontend URL!

---

## Need to Redeploy?

Just push to GitHub and Vercel will automatically redeploy both projects! 🚀
