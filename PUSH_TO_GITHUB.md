# How to Push Updates to GitHub and Redeploy on Vercel

## Quick Commands

```bash
# Navigate to your project folder
cd TaskFlow

# Check what changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Fix backend Vercel routing configuration"

# Push to GitHub
git push origin main
```

## What Happens After Push

1. **Vercel Auto-Deploys** - Both frontend and backend will automatically redeploy
2. Wait 1-2 minutes for deployment to complete
3. Check Vercel dashboard for deployment status

## If Auto-Deploy Doesn't Work

### Manually Redeploy in Vercel:

1. Go to Vercel Dashboard
2. Select your **backend** project
3. Go to **Deployments** tab
4. Click the 3 dots (•••) on latest deployment
5. Click **"Redeploy"**

Repeat for frontend project if needed.

---

## After This Fix

Your backend will now work correctly on Vercel! The routes will be found and registration should work.

## Test Your Deployment

1. Visit your frontend URL: `https://task-flow-5euo.vercel.app`
2. Try to register a new account
3. It should work! ✅

---

**Files I fixed:**
- ✅ Created `backend/vercel.json` for proper routing
- ✅ Updated `backend/server.js` to export app for serverless

Push these changes and you're done! 🚀
