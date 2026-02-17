# 🚀 Quick Setup - Connect Frontend to Express Backend

## What You Need to Do (3 Steps)

### Step 1: Check Your Express Backend Port

Look at your Express backend `.env` file (in `like-telecom-express/.env`):

```env
PORT=5000
SYSTEM_KEY=your-actual-system-key-here
```

**Remember the PORT number and SYSTEM_KEY!**

### Step 2: Create Frontend Environment File

In your `like-telecom-frontend` folder, create a file named `.env.local`:

**File location:** `like-telecom-frontend/.env.local`

**File contents:**
```env
API_BASE=http://localhost:5000
SYSTEM_KEY=your-actual-system-key-here
```

**Replace `your-actual-system-key-here` with the actual SYSTEM_KEY from your Express backend `.env` file!**

### Step 3: Restart Your Frontend

After creating `.env.local`, restart your Next.js frontend:

```bash
cd like-telecom-frontend
npm run dev
```

## 📍 How It Works (Simple Explanation)

```
┌─────────────────┐         ┌──────────────────┐
│  Next.js        │         │  Express Backend  │
│  Frontend       │────────▶│  (Port 5000)      │
│  (Port 3000)    │         │                   │
└─────────────────┘         └──────────────────┘
      │                              │
      │                              │
      │  API_BASE =                  │
      │  http://localhost:5000        │
      │                              │
      │  Frontend calls:              │
      │  ${API_BASE}/api/v2/products  │
      │                              │
      │  Becomes:                    │
      └──────────────────────────────▶
         http://localhost:5000/api/v2/products
```

## ✅ Verification Checklist

- [ ] Express backend is running (`npm run dev` in `like-telecom-express`)
- [ ] Backend shows: `🚀 Server running on port 5000`
- [ ] Created `.env.local` in `like-telecom-frontend` folder
- [ ] `API_BASE=http://localhost:5000` (no `/api/v2` at the end!)
- [ ] `SYSTEM_KEY` matches the one in backend `.env`
- [ ] Restarted frontend after creating `.env.local`

## 🔍 Test It Works

1. **Test Backend:** Visit http://localhost:5000/health
   - Should show: `{"status":"ok","message":"Server is running"}`

2. **Test Admin Panel:** Visit http://localhost:5000/admin
   - Should show the admin login page

3. **Test Frontend:** Visit http://localhost:3000
   - Should load your homepage
   - Check browser console for any API errors

## ⚠️ Common Mistakes

❌ **Wrong:** `API_BASE=http://localhost:5000/api/v2`
✅ **Correct:** `API_BASE=http://localhost:5000`

❌ **Wrong:** `SYSTEM_KEY=something-different` (doesn't match backend)
✅ **Correct:** `SYSTEM_KEY=exact-same-as-backend`

❌ **Wrong:** Forgot to restart frontend after creating `.env.local`
✅ **Correct:** Always restart after changing environment variables

## 🎯 Example

**Backend `.env` (like-telecom-express/.env):**
```env
PORT=5000
SYSTEM_KEY=my-secret-key-12345
```

**Frontend `.env.local` (like-telecom-frontend/.env.local):**
```env
API_BASE=http://localhost:5000
SYSTEM_KEY=my-secret-key-12345
```

**That's it!** Your frontend will now use your Express backend! 🎉

