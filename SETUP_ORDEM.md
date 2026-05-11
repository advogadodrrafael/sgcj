# 📋 Ordem Correta de Setup - SGCJ

## ⚠️ IMPORTANTE: Faça em ORDEM!

O deploy só funciona se você seguir estes passos na sequência correta.

---

## PASSO 1: Criar Banco de Dados no Supabase (3 minutos)

### 1.1: Acessar Supabase
Acesse: https://supabase.com/dashboard

### 1.2: Criar Novo Projeto
```
1. Clique em "New Project"
2. Nome: sgcj-production
3. Password: (gere uma senha forte)
4. Aguarde o projeto ser criado (2-3 minutos)
```

### 1.3: Executar Migração SQL
```
1. No Supabase, clique em "SQL Editor"
2. Clique em "New Query"
3. Abra o arquivo: apps/backend/migrations/001_initial_schema.sql
4. Copie TODO o conteúdo SQL
5. Cole no editor do Supabase
6. Clique em "Run"
7. Aguarde completar (deve criar 9 tabelas)
```

### 1.4: Copiar Credenciais do Supabase
```
1. Vá em "Settings" → "API"
2. Copie:
   - Project URL → VITE_SUPABASE_URL
   - Anon Key → VITE_SUPABASE_ANON_KEY  
   - Service Role Key → SUPABASE_SERVICE_ROLE_KEY
3. Atualize o arquivo: C:\projetos\sgcj\.env
4. Atualize também: C:\projetos\sgcj\apps\backend\.env
```

✅ QUANDO TERMINAR: Avance para PASSO 2

---

## PASSO 2: Criar Usuários de Teste (1 minuto)

Após atualizar o `.env` com as credenciais do Supabase:

```powershell
cd C:\projetos\sgcj\apps\backend
npm run seed
```

Você deve ver:
```
✅ Usuário criado: Rafael Fernandes (rafael@fernandes.com)
✅ Usuário criado: Érica Fernandes (erica@fernandes.com)
... (7 usuários totais)
✨ População concluída!
```

✅ QUANDO TERMINAR: Avance para PASSO 3

---

## PASSO 3: Deploy Backend no Render (5 minutos)

Acesse: https://render.com/dashboard

```
1. Clique em "New +" → "Web Service"
2. Clique em "Build and deploy from a Git repository"
3. Clique em "Connect GitHub" (se necessário)
   └─ Autorize o Render
   └─ Procure por "sgcj"
   └─ Clique em "Select Repository"

4. Preencha:
   ├─ Name: sgcj-backend
   ├─ Environment: Node
   ├─ Branch: main
   ├─ Build Command: cd apps/backend && npm install
   ├─ Start Command: cd apps/backend && npm start
   └─ Clique em "Create Web Service"

5. Aguarde o deploy (2-3 minutos)

6. Quando terminar, você receberá uma URL como:
   https://sgcj-backend.onrender.com
```

✅ COPIE A URL E SALVE EM UM LUGAR SEGURO!

Você vai precisar dessa URL no próximo passo.

✅ QUANDO TERMINAR: Avance para PASSO 4

---

## PASSO 4: Deploy Frontend no Vercel (5 minutos)

### 4.1: Atualizar VITE_API_URL
```
Abra: C:\projetos\sgcj\.env

Mude:
VITE_API_URL=

Para:
VITE_API_URL=https://sua-url-do-render.onrender.com
```

### 4.2: Deploy no Vercel
Acesse: https://vercel.com

```
1. Clique em "Add New..." → "Project"
2. Clique em "Import Git Repository"
3. Procure e selecione: advogadodrrafael/sgcj
4. Clique em "Select"

5. Configuração:
   ├─ Framework: Vite
   ├─ Root Directory: ./apps/web
   └─ Clique em "Continue"

6. Environment Variables:
   ├─ VITE_API_URL=https://seu-render-url.onrender.com
   ├─ VITE_SUPABASE_URL=https://clrdkfnelmsgpznvjpqt.supabase.co
   ├─ VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   └─ Clique em "Deploy"

7. Aguarde 3-5 minutos para o deploy completar
```

✅ VOCÊ RECEBERÁ UMA URL COMO: https://sgcj-vercel.vercel.app

✅ QUANDO TERMINAR: Avance para PASSO 5

---

## PASSO 5: Testar Sistema (2 minutos)

### 5.1: Abrir Aplicação
Acesse a URL do Vercel que você recebeu:
```
https://seu-app.vercel.app
```

### 5.2: Login com Usuário de Teste
```
Email:    rafael@fernandes.com
Senha:    12345678
```

### 5.3: Testar Funcionalidades
- [ ] Login/Logout
- [ ] Dashboard carregou?
- [ ] Criar novo cliente
- [ ] Editar cliente
- [ ] Mover cliente entre fases
- [ ] Sincroniza offline/online?

✅ SE TUDO FUNCIONOU: Sistema está PRONTO! 🎉

---

## 📱 Testar no Celular

1. Abra a URL do frontend em um navegador mobile
2. Clique em "Install" ou "Adicionar à Tela"
3. Funciona como app nativo!

---

## ⏱️ Tempo Total: ~20 minutos

- Supabase: 5 minutos
- Seed: 1 minuto
- Render: 5 minutos
- Vercel: 5 minutos
- Testes: 3-4 minutos

---

## 🆘 Se der erro:

### Erro: "Invalid API Key" no seed
→ Você não executou a migração SQL no Supabase
→ Vá para o PASSO 1.3 novamente

### Erro: Build falhou no Render
→ Clique em "Manual Deploy" para tentar novamente
→ Verifique os logs: Settings → Build & Deploy

### Erro: Deploy falhou no Vercel
→ Verifique se todas as Environment Variables estão preenchidas
→ Clique em "Deployments" → "Redeploy"

---

## ✅ Checklist Final

- [ ] Supabase project criado
- [ ] Migração SQL executada
- [ ] .env atualizado com credenciais do Supabase
- [ ] Usuários de teste criados (npm run seed)
- [ ] Backend deployed no Render
- [ ] VITE_API_URL atualizado no .env
- [ ] Frontend deployed no Vercel
- [ ] Conseguiu fazer login na aplicação
- [ ] Testou as funcionalidades básicas

**Parabéns! Seu sistema SGCJ está ONLINE! 🚀**
