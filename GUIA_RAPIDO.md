# 🚀 GUIA RÁPIDO - Deploy em 5 Passos

## ✅ O que já está pronto:
- ✅ Código backend e frontend completos
- ✅ Banco de dados schema (SQL migration)
- ✅ Arquivo `.env` criado e esperando credenciais
- ✅ Dependências npm prontas para instalar

## 📋 Você precisa fazer 5 coisas simples:

### 1️⃣ Criar Projeto Supabase (5 minutos)
```
Visite: https://supabase.com/dashboard
1. Clique em "New Project"
2. Nome: sgcj-production
3. Crie a conta (gratuita)
4. Vá em Settings → API
5. Copie:
   - Project URL (cole em VITE_SUPABASE_URL)
   - Anon Key (cole em VITE_SUPABASE_ANON_KEY)
   - Service Role Key (cole em SUPABASE_SERVICE_ROLE_KEY)
```

### 2️⃣ Executar SQL Migration (2 minutos)
```
No Supabase:
1. Clique em "SQL Editor"
2. Clique em "New Query"
3. Abra arquivo: apps/backend/migrations/001_initial_schema.sql
4. Copie TODO o conteúdo e cole no editor
5. Clique em "Run" (botão azul)
```

### 3️⃣ Gerar JWT Secret (1 minuto)
```
No PowerShell, execute:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([Guid]::NewGuid().ToString()))

Cole o resultado em: JWT_SECRET no .env
```

### 4️⃣ Obter Credenciais WhatsApp (10 minutos)
```
Visite: https://business.facebook.com
1. Vá em "My Apps" → Crie novo app
2. Escolha "Business"
3. Adicione produto "WhatsApp"
4. Em API Setup, copie Phone ID
5. Em Token Access, gere token permanente
6. Crie verify token aleatório:
```
PowerShell:
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString())) | Out-String
```
Cole em WHATSAPP_VERIFY_TOKEN

```

### 5️⃣ Fazer Login no GitHub/Render/Vercel (3 minutos)
```
Contas necessárias (todas gratuitas):
- GitHub: https://github.com
- Render: https://render.com
- Vercel: https://vercel.com

Você vai:
1. Fazer push do código para GitHub
2. Conectar Render ao GitHub (deploy backend)
3. Conectar Vercel ao GitHub (deploy frontend)
```

---

## 🔧 Depois que preencher o `.env`:

### Instalar dependências:
```powershell
cd C:\projetos\sgcj
npm install
cd apps/backend
npm install
cd ..\web
npm install
cd ..\..
```

### Criar usuários de teste:
```powershell
cd C:\projetos\sgcj\apps\backend
npm run seed
```

### Deploy Backend (Render):
```
1. https://render.com → New Web Service
2. Conectar ao repositório GitHub
3. Branch: main
4. Build: npm install
5. Start: npm start
6. Environment variables: Copiar tudo do .env
7. Deploy
```

### Deploy Frontend (Vercel):
```
1. https://vercel.com → Import Project
2. Selecionar repositório GitHub
3. Framework: Vite
4. Environment: VITE_API_URL=https://seu-render-url.onrender.com
5. Deploy
```

---

## 📝 Usuários de Teste (após seed):
```
rafael@fernandes.com        | 12345678
erica@fernandes.com         | 12345678
luan@fernandes.com          | 12345678
taiza@fernandes.com         | 12345678
dax@fernandes.com           | 12345678
andre@fernandes.com         | 12345678
juliana@fernandes.com       | 12345678
```

---

## ⏱️ Tempo Total Estimado: ~30 minutos

**Você consegue?** Comece pelo passo 1 (Supabase) e me diga quando tiver as credenciais! 🚀
