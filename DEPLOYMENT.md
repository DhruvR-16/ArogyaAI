# Deployment Guide

This guide will help you deploy the ArogyaAI application to Render (backend) and Vercel (frontend).

## Backend Deployment (Render)

### Step 1: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `arogyaai-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `auth`

### Step 2: Set Environment Variables in Render

In the Render dashboard, go to your service → Environment tab and add:

```
DATABASE_URL=your_supabase_postgres_connection_string
JWT_SECRET=your_strong_random_jwt_secret_key
ALLOWED_ORIGINS=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5050
```

**Important Notes:**
- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `JWT_SECRET`: Generate a strong random string (e.g., use `openssl rand -base64 32`)
- `ALLOWED_ORIGINS`: Set this to your Vercel frontend URL (you'll update this after deploying frontend)
- Render will automatically assign a URL like `https://your-backend.onrender.com`

### Step 3: Get Your Backend URL

After deployment, Render will provide a URL like:
```
https://your-backend.onrender.com
```

Save this URL - you'll need it for the frontend deployment.

---

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables in Vercel

In the Vercel dashboard, go to your project → Settings → Environment Variables and add:

```
VITE_API_URL=https://your-backend.onrender.com
```

Replace `https://your-backend.onrender.com` with your actual Render backend URL.

### Step 3: Update Backend CORS

After deploying the frontend, Vercel will provide a URL like:
```
https://your-app.vercel.app
```

Go back to Render dashboard and update the `ALLOWED_ORIGINS` environment variable:
```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

Then restart your Render service for the changes to take effect.

---

## Local Development Setup

### Backend (.env file in `auth/` directory)

Create a `.env` file in the `auth/` directory:

```env
DATABASE_URL=your_supabase_postgres_connection_string
JWT_SECRET=your_jwt_secret_key_here
PORT=5050
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
NODE_ENV=development
```

### Frontend (.env file in `frontend/` directory)

Create a `.env` file in the `frontend/` directory:

```env
# Leave empty for localhost, or set to your Render backend URL for testing
VITE_API_URL=
```

---

## Testing the Deployment

1. **Test Backend**: Visit `https://your-backend.onrender.com` - you should see "ArogyaAI API is running..."
2. **Test Frontend**: Visit `https://your-app.vercel.app` - the app should load
3. **Test Authentication**: Try signing up/logging in to verify the connection works
4. **Check Browser Console**: Look for any CORS errors or API connection issues

---

## Troubleshooting

### CORS Errors
- Make sure `ALLOWED_ORIGINS` in Render includes your exact Vercel URL (with `https://`)
- Restart the Render service after updating environment variables
- Check that the frontend is using the correct `VITE_API_URL`

### API Connection Issues
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that the backend URL is accessible (visit it in a browser)
- Ensure the backend service is running (not sleeping) on Render

### Database Connection Issues
- Verify `DATABASE_URL` is correct in Render
- Check Supabase connection settings and firewall rules
- Ensure SSL is enabled in the connection string

---

## Notes

- Render free tier services may "sleep" after inactivity. Consider upgrading for production use.
- Vercel automatically handles HTTPS and CDN distribution.
- All API calls from the frontend will use the `VITE_API_URL` environment variable.
- The backend CORS configuration allows the Vercel domain specified in `ALLOWED_ORIGINS`.

