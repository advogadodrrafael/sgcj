# SGCJ Deployment - Next Steps

## Current Status

✅ **Completed:**
- GitHub repository is public
- Supabase project configured (clrdkfnelmsgpznvjpqt.supabase.co)
- Database migrations executed with correct RLS policies
- SERVICE_ROLE_KEY verified and working
- All 7 test users successfully seeded via `npm run seed`
- render.yaml configuration created with all backend environment variables
- Backend code fixed and ready for deployment
- Frontend configuration ready with .env file created
- Code pushed to GitHub with all fixes
- **Backend running locally with full authentication working**

✅ **Backend Verified & Tested:**
- Server.js fixed to use correct VITE_SUPABASE_URL variable ✓
- Auth routes fixed to query correct 'usuarios' table ✓
- Password column corrected (senha_hash) ✓
- User fields corrected (nome instead of name) ✓
- Health endpoint operational ✓
- **All test users can authenticate with valid JWT tokens** ✓
- **Wrong passwords correctly rejected** ✓
- **Frontend .env created with Supabase keys and local API URL** ✓

⏳ **Next Steps (Require Manual Intervention):**
1. Deploy backend to Render (requires Render web UI access)
2. Obtain Render backend URL
3. Update VITE_API_URL in frontend
4. Deploy frontend to Vercel

## ⚠️ Manual Steps Required for Deployment

### 1. Deploy Backend to Render

**Using Web UI (Recommended):**
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Select "GitHub" and authorize
4. Select the `sgcj` repository
5. Render will auto-detect the `render.yaml` configuration
6. Review the settings (should show all env vars from render.yaml)
7. Click "Deploy"
8. Wait for deployment to complete (typically 2-5 minutes)
9. Once deployed, copy your backend URL (e.g., `https://sgcj-backend.onrender.com`)

**render.yaml is already configured with:**
- Service name: `sgcj-backend`
- Build command: `cd apps/backend && npm install`
- Start command: `cd apps/backend && npm start`
- All environment variables pre-configured
- Port: 3000

## Deployment Order

1. ✅ Supabase project configured and operational
2. ✅ Database migrations executed with all RLS policies
3. ✅ SERVICE_ROLE_KEY fixed and verified working
4. ✅ All 7 test users seeded and available
5. ✅ Backend code fixed and ready
6. ⏳ **Deploy backend to Render** (manual via web UI)
7. ⏳ Obtain Render backend URL (e.g., `https://sgcj-backend.onrender.com`)
8. ⏳ Update `VITE_API_URL` in frontend configuration
9. ⏳ Deploy frontend to Vercel (manual via web UI)
10. ⏳ Configure WhatsApp webhook in Meta Business Manager

## Database Status: Test Users Already Seeded ✅

The following test users are already created and available for authentication:
1. rafael@fernandes.com (Rafael Fernandes) - password: 12345678
2. erica@fernandes.com (Érica Fernandes) - password: 12345678
3. luan@fernandes.com (Luan Silva) - password: 12345678
4. taiza@fernandes.com (Taiza Costa) - password: 12345678
5. dax@fernandes.com (Dax Santos) - password: 12345678
6. andre@fernandes.com (André Pereira) - password: 12345678
7. juliana@fernandes.com (Juliana Oliveira) - password: 12345678

All users were created via `npm run seed` and are ready for testing authentication immediately after backend deployment.

## Environment Variables Checklist

### Render Backend
- ✅ VITE_SUPABASE_URL=https://clrdkfnelmsgpznvjpqt.supabase.co
- ⚠️ SUPABASE_SERVICE_ROLE_KEY=**[NEEDS CORRECTION]**
- ✅ API_PORT=3000
- ✅ NODE_ENV=production
- ✅ JWT_SECRET=YTYxOTExYWEtZTNhNi00MzQ0LWJmOTYtOGM4Njc0OTllY2Y4
- ✅ SYNC_INTERVAL=2000
- ✅ WHATSAPP_*=configured

### Vercel Frontend
- ✅ VITE_SUPABASE_URL=https://clrdkfnelmsgpznvjpqt.supabase.co
- ✅ VITE_SUPABASE_ANON_KEY=**[configured]**
- ⏳ VITE_API_URL=**[will be set after backend deployment]**

## GitHub Repository

📍 Repository: https://github.com/advogadodrrafael/sgcj

Latest commit includes:
- Fixed RLS migration
- render.yaml with complete configuration
- Diagnostic scripts for debugging

## Reference Files

- Deployment Guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Migration File: [apps/backend/migrations/001_initial_schema.sql](apps/backend/migrations/001_initial_schema.sql)
- Render Config: [render.yaml](render.yaml)
- Backend .env: [apps/backend/.env](apps/backend/.env)

## Next Command After Manual Steps

Once SERVICE_ROLE_KEY is fixed and RLS policy is executed:

```bash
# Verify connectivity
cd apps/backend
node scripts/test-keys.js

# Seed database
npm run seed

# Or wait for backend to be deployed on Render
```
