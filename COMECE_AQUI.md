# 🎯 COMECE AQUI - Sistema SGCJ Pronto para Deploy

## ✅ O QUE JÁ ESTÁ FEITO:

- ✅ Código completo (backend + frontend + WhatsApp)
- ✅ Dependências npm instaladas (backend e frontend)
- ✅ Arquivo `.env` criado e esperando credenciais
- ✅ Banco de dados SQL migration pronto
- ✅ Scripts de deployment documentados

## 🔑 VOCÊ PRECISA FAZER (O Essencial):

### 1. Criar Conta Supabase e Copiar 3 Credenciais
**Tempo: 5 minutos**

```
1. Acesse: https://supabase.com/dashboard
2. Clique "New Project" → sgcj-production
3. Vá em Settings → API
4. Copie estas 3 linhas para o .env:
   - VITE_SUPABASE_URL = Project URL
   - VITE_SUPABASE_ANON_KEY = Anon Key
   - SUPABASE_SERVICE_ROLE_KEY = Service Role Secret Key
```

### 2. Executar SQL Migration no Supabase
**Tempo: 2 minutos**

```
1. No Supabase, clique "SQL Editor"
2. Abra arquivo: apps/backend/migrations/001_initial_schema.sql
3. Copie todo o conteúdo SQL
4. Cole no Supabase e clique "Run"
```

### 3. Gerar JWT Secret
**Tempo: 1 minuto**

Copie e cole no PowerShell:
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))
```

Cole o resultado em `JWT_SECRET` no `.env`

### 4. Criar Credenciais WhatsApp
**Tempo: 10 minutos**

```
1. Acesse: https://business.facebook.com
2. Vá em "My Apps" → "Create App" → Business
3. Adicione produto "WhatsApp"
4. Em "API Setup", copie: WHATSAPP_PHONE_ID
5. Em "Tokens", gere e copie: WHATSAPP_API_TOKEN
6. Gere token aleatório para WHATSAPP_VERIFY_TOKEN (use o comando acima)
```

### 5. Criar Contas (Gratuitas)
**Tempo: 2 minutos**

Você vai precisar destas contas para deploy:
- GitHub: https://github.com (coloque seu código lá)
- Render: https://render.com (para backend)
- Vercel: https://vercel.com (para frontend)

---

## 📄 Arquivo .env pronto em:
```
C:\projetos\sgcj\.env
```

**Abra e preencha os campos vazios com as credenciais acima.**

---

## 🚀 Depois de preencher o .env:

### Criar usuários de teste:
```powershell
cd C:\projetos\sgcj\apps\backend
npm run seed
```

Isso cria 7 usuários para testar:
```
rafael@fernandes.com        Senha: 12345678
erica@fernandes.com         Senha: 12345678
luan@fernandes.com          Senha: 12345678
taiza@fernandes.com         Senha: 12345678
dax@fernandes.com           Senha: 12345678
andre@fernandes.com         Senha: 12345678
juliana@fernandes.com       Senha: 12345678
```

### Deploy Backend (Render):
```
1. Vá em https://render.com
2. Clique "New Web Service"
3. Conecte seu repositório GitHub
4. Name: sgcj-backend
5. Runtime: Node
6. Build: npm install
7. Start: npm start
8. Add Environment Variables (copie tudo do .env)
9. Deploy
```

Copie a URL do Render (ex: https://sgcj-backend.onrender.com)

### Deploy Frontend (Vercel):
```
1. Vá em https://vercel.com
2. Clique "Add New..." → "Project"
3. Importe seu repositório GitHub
4. Project name: sgcj
5. Framework: Vite
6. Environment Variables:
   - VITE_API_URL = URL do Render backend
   - VITE_SUPABASE_URL = Do .env
   - VITE_SUPABASE_ANON_KEY = Do .env
7. Deploy
```

---

## 📊 Arquivos Importantes:

| Arquivo | Descrição |
|---------|-----------|
| `.env` | Suas credenciais (preencha isso!) |
| `GUIA_RAPIDO.md` | Guia detalhado em 5 passos |
| `WHATSAPP_SETUP.md` | Como configurar WhatsApp |
| `apps/backend/migrations/001_initial_schema.sql` | SQL para criar banco |
| `apps/backend/scripts/seed.js` | Script para criar usuários de teste |

---

## ⏱️ Tempo Total: ~30 minutos

**Comece agora! Abra o `.env` e preencha com as credenciais** 🚀

Dúvidas? Veja `GUIA_RAPIDO.md` para instruções detalhadas.
