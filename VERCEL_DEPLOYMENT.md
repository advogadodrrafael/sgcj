# SGCJ Vercel Deployment Guide

## Structure
- **Frontend**: React Vite app in `apps/web`
- **Backend**: Vercel API Routes in `/api` directory
- Both deployed together to a single Vercel project

## API Routes Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/clients` - List all clients
- `GET /api/clients/[id]` - Get specific client
- `POST /api/clients` - Create new client
- `PUT /api/clients/[id]` - Update client
- `POST /api/sync/push` - Push local changes
- `POST /api/sync/pull` - Pull cloud changes
- `GET /api/health` - Health check

## Deployment Steps

### 1. Connect Repository to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select GitHub repository: `advogadodrrafael/sgcj`
4. Click "Import"

### 2. Configure Environment Variables
In Vercel project settings, add these environment variables:
- `VITE_SUPABASE_URL=https://clrdkfnelmsgpznvjpqt.supabase.co`
- `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscmRrZm5lbG1zZ3B6bnZqcHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTIzNDUsImV4cCI6MjA5NDA4ODM0NX0.oaop_8vcBsXga7Ov6oNqpRv5qVTB2YWr_H7Zzid4pnA`
- `VITE_API_URL=/api` (relative path - API is on same domain)
- `JWT_SECRET=YTYxOTExYWEtZTNhNi00MzQ0LWJmOTYtOGM4Njc0OTllY2Y4`
- `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscmRrZm5lbG1zZ3B6bnZqcHF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMjM0NSwiZXhwIjoyMDk0MDg4MzQ1fQ.pQ2BZRSqCNCaYEtPwvc31cTOrrpDNKZouL2RE-5Rmjw`

### 3. Review Build Settings
- **Build Command**: `cd apps/web && npm install && npm run build`
- **Output Directory**: `apps/web/dist`
- **Install Command**: (let Vercel auto-detect)

The `vercel.json` file handles this configuration automatically.

### 4. Deploy
1. Click "Deploy"
2. Wait for build to complete (typically 2-5 minutes)
3. Once complete, Vercel provides deployment URL (e.g., `https://sgcj.vercel.app`)

### 5. Post-Deployment Verification

Test the following endpoints:
```bash
# Health check
curl https://sgcj.vercel.app/api/health

# Login (with test user credentials)
curl -X POST https://sgcj.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rafael@fernandes.com","password":"12345678"}'

# Get clients list (requires JWT token from login)
curl -H "Authorization: Bearer <token>" \
  https://sgcj.vercel.app/api/clients
```

## Test Users (Already Seeded)
All users have password: `12345678`
1. rafael@fernandes.com
2. erica@fernandes.com
3. luan@fernandes.com
4. taiza@fernandes.com
5. dax@fernandes.com
6. andre@fernandes.com
7. juliana@fernandes.com

## Frontend Configuration
The frontend automatically uses `/api` as the base URL for all API calls. The `apps/web/.env` can be left as-is or updated:
```
VITE_API_URL=/api
```

## Troubleshooting

### API Routes Not Working
- Check that `/api` directory exists at project root
- Verify all environment variables are set in Vercel dashboard
- Check Vercel Function logs in the deployment details

### CORS Issues
- API routes are on the same domain, so no CORS issues expected
- If issues occur, check browser console for actual error

### Authentication Failures
- Verify `JWT_SECRET` matches between frontend login and backend API routes
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct in environment variables

## Rollback
To revert to a previous deployment, use Vercel dashboard's deployment history.
