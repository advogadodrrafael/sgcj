# SGCJ Deployment - Next Steps

## Current Status

✅ **Completed:**
- GitHub repository is public
- Supabase project configured (clrdkfnelmsgpznvjpqt.supabase.co)
- Database migrations executed
- RLS policies fixed in migration (missing INSERT policy added)
- render.yaml configuration created with all backend environment variables
- Frontend configuration ready
- Code pushed to GitHub

⚠️ **Known Issues:**
- SERVICE_ROLE_KEY has JWT ref field typo (clrdkfnelmsgpznvjpqut → clrdkfnelmsgpznvjpqt)
  - Impact: Cannot run `npm run seed` locally
  - Workaround: User creation must be done via Supabase SQL Editor or after migration re-execution
- RLS INSERT policy for usuarios table was missing from migration
  - Status: Added to migration file, but needs execution on live database

## ⚠️ Critical Blockers That Require Manual Intervention

### 1. Execute Updated Migration on Supabase
The migration file (`apps/backend/migrations/001_initial_schema.sql`) now includes a missing INSERT policy for the `usuarios` table:

```sql
CREATE POLICY "Serviço pode criar usuários" ON usuarios
  FOR INSERT WITH CHECK (true);
```

**Action Required:** 
- Login to Supabase Console: https://app.supabase.com
- Navigate to the SQL Editor
- Open file: `apps/backend/migrations/001_initial_schema.sql`
- Find the line "Serviço pode criar usuários" INSERT policy
- Execute just that CREATE POLICY statement

Or execute the entire migration again if you haven't run it yet.

### 2. Fix SERVICE_ROLE_KEY in .env and render.yaml
The current SERVICE_ROLE_KEY in both .env files has an invalid JWT (ref field typo).

**Action Required:**
- Go to Supabase Console
- Settings → API → Copy "service_role secret"
- Update both:
  - `C:\projetos\sgcj\.env`
  - `C:\projetos\sgcj\apps\backend\.env`
  - `C:\projetos\sgcj\render.yaml`
- Replace the SUPABASE_SERVICE_ROLE_KEY value with the correct one from Supabase
- Commit and push changes
- Then proceed with deployment

### 3. Deploy Backend to Render
Once the above are fixed:

**Option A: Web UI (Easiest)**
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect GitHub and select the `sgcj` repository
4. Render will auto-detect `render.yaml` configuration
5. Deploy

**Option B: Render API (If token available)**
```bash
# Requires RENDER_API_KEY environment variable
curl -X POST https://api.render.com/v1/services \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -d @render_service_config.json
```

**Option C: Render CLI (If installed)**
```bash
render deploy
```

## Deployment Order

1. ✅ Fix SERVICE_ROLE_KEY (manual via Supabase)
2. ✅ Execute missing RLS policy (manual via Supabase SQL Editor)
3. ⏳ Deploy backend to Render
4. ⏳ Get Render backend URL (e.g., `https://sgcj-backend.onrender.com`)
5. ⏳ Update `VITE_API_URL` in frontend .env and vercel.json
6. ⏳ Deploy frontend to Vercel
7. ⏳ Create test users in database (after backend is deployed)
8. ⏳ Configure WhatsApp webhook

## Post-Deployment: Seed Database

After the backend is deployed, you can seed test users:

```bash
cd apps/backend

# Once SERVICE_ROLE_KEY is corrected:
npm run seed

# Or manually via Supabase SQL Editor:
INSERT INTO usuarios (email, nome, senha_hash) VALUES
  ('rafael@fernandes.com', 'Rafael Fernandes', '$2a$10$...hashed_password_here...'),
  ('erica@fernandes.com', 'Érica Fernandes', '$2a$10$...hashed_password_here...'),
  ('luan@fernandes.com', 'Luan Silva', '$2a$10$...hashed_password_here...'),
  ('taiza@fernandes.com', 'Taiza Costa', '$2a$10$...hashed_password_here...'),
  ('dax@fernandes.com', 'Dax Santos', '$2a$10$...hashed_password_here...'),
  ('andre@fernandes.com', 'André Pereira', '$2a$10$...hashed_password_here...'),
  ('juliana@fernandes.com', 'Juliana Oliveira', '$2a$10$...hashed_password_here...');
```

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
