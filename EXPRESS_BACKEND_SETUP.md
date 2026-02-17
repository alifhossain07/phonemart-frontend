# Express Backend Setup Guide

## 🎯 Simple Explanation

Your **Express backend** is a separate server that runs on port **5000** (or whatever you set in the backend `.env`).

Your **Next.js frontend** needs to know where to find this backend server.

## 📋 Step-by-Step Setup

### 1. Start Your Express Backend

First, make sure your Express backend is running:

```bash
cd like-telecom-express
npm install
npm run dev
```

The backend should start on: `http://localhost:5000`

### 2. Configure Frontend Environment Variables

Create a file called `.env.local` in your `like-telecom-frontend` folder:

```env
API_BASE=http://localhost:5000
SYSTEM_KEY=your-system-key-here
```

**Important:** 
- `API_BASE` should be just `http://localhost:5000` (without `/api/v2`)
- `SYSTEM_KEY` must match the `SYSTEM_KEY` in your Express backend `.env` file

### 3. How It Works

When your frontend makes an API call:

```
Frontend code: `${API_BASE}/api/v2/products/featured`
```

It becomes:

```
http://localhost:5000/api/v2/products/featured
```

The frontend automatically adds `/api/v2/` to the path, so you only need to provide the base URL.

### 4. Verify Your Backend is Running

Check if your Express backend is running by visiting:
- **Backend Health Check:** http://localhost:5000/health
- **Admin Panel:** http://localhost:5000/admin

### 5. Restart Your Frontend

After creating/updating `.env.local`, restart your Next.js frontend:

```bash
cd like-telecom-frontend
npm run dev
```

## 🔍 Troubleshooting

### Frontend can't connect to backend?

1. **Check if backend is running:**
   ```bash
   # In like-telecom-express folder
   npm run dev
   ```
   You should see: `🚀 Server running on port 5000`

2. **Check your .env.local file:**
   - Make sure `API_BASE=http://localhost:5000` (no trailing slash)
   - Make sure `SYSTEM_KEY` matches your backend

3. **Check backend port:**
   - If your backend runs on a different port (check `PORT` in backend `.env`), update `API_BASE` accordingly
   - Example: If backend runs on port 3001, use `API_BASE=http://localhost:3001`

### API returns 401 Unauthorized?

- Make sure `SYSTEM_KEY` in frontend `.env.local` matches `SYSTEM_KEY` in backend `.env`

### API returns 404 Not Found?

- Make sure your Express backend is running
- Check that the route exists in the Express backend
- Verify the URL format: `http://localhost:5000/api/v2/...`

## 📝 Example Configuration

**Express Backend `.env` (like-telecom-express/.env):**
```env
PORT=5000
SYSTEM_KEY=my-secret-key-12345
MONGODB_URI=your-mongodb-connection-string
DB_NAME=practicum_db
JWT_SECRET=your-jwt-secret
```

**Frontend `.env.local` (like-telecom-frontend/.env.local):**
```env
API_BASE=http://localhost:5000
SYSTEM_KEY=my-secret-key-12345
```

**Note:** The `SYSTEM_KEY` must be **exactly the same** in both files!

## 🚀 Production Setup

For production, update your `.env.local`:

```env
API_BASE=https://your-backend-domain.com
SYSTEM_KEY=your-production-system-key
```

Make sure to:
1. Use HTTPS in production
2. Use a strong, unique `SYSTEM_KEY`
3. Never commit `.env.local` to git (it should be in `.gitignore`)

