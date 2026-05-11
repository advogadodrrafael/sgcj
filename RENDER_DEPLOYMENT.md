# 🚀 Deploy Backend no Render

## Status
✅ Repositório GitHub é público
⏳ Pronto para conectar ao Render

## Passo 1: Criar Web Service no Render

1. Acesse: https://render.com/dashboard
2. Clique em **"New +"** → **"Web Service"**
3. Clique em **"Build and deploy from a Git repository"**
4. Clique em **"Connect GitHub"** (se ainda não conectado)
   - Autorize o Render a acessar seus repositórios
   - Procure por: `sgcj`
   - Clique em **"Select Repository"**

## Passo 2: Configurar Serviço Web

Preencha os campos com:

```
Name:                      sgcj-backend
Environment:               Node
Branch:                    main
Build Command:             cd apps/backend && npm install
Start Command:             cd apps/backend && npm start
```

## Passo 3: Configurar Variáveis de Ambiente

Clique em **"Advanced"** e depois **"Add Environment Variable"** para cada linha:

```
VITE_SUPABASE_URL=https://clrdkfnelmsgpznvjpqt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscmRrZm5lbG1zZ3B6bnZqcHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTIzNDUsImV4cCI6MjA5NDA4ODM0NX0.oaop_8vcBsXga7Ov6oNqpRv5qVTB2YWr_H7Zzid4pnA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscmRrZm5lbG1zZ3B6bnZqcHV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMjM0NSwiZXhwIjoyMDk0MDg4MzQ1fQ.pQ2BZRSqCNCaYEtPwvc31cTOrrpDNKZouL2RE-5Rmjw
API_PORT=3000
NODE_ENV=production
JWT_SECRET=YTYxOTExYWEtZTNhNi00MzQ0LWJmOTYtOGM4Njc0OTllY2Y4
SYNC_INTERVAL=2000
WHATSAPP_API_TOKEN=temp_token_awaiting_activation
WHATSAPP_PHONE_ID=1343627187530079
WHATSAPP_NUMERO_EMPRESA=5521999999999
WHATSAPP_VERIFY_TOKEN=MDRkYjI5NWQtMWRlOC00ZWVjLTk0NmQtYzE5MjIwMDI4MzNj
```

## Passo 4: Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (vai levar ~2-3 minutos)
3. Quando concluir, você verá uma URL como:
   ```
   https://sgcj-backend.onrender.com
   ```

## Passo 5: Salvar URL do Backend

Copie a URL que você recebeu (ex: `https://sgcj-backend.onrender.com`)

Você vai precisar dessa URL para:
1. Atualizar `VITE_API_URL` no `.env`
2. Deploy do frontend no Vercel

---

## ⚠️ Importante

- O Render pode levará 30-60 segundos para iniciar a primeira vez
- Clique no link da aplicação para verificar se está online
- Se falhar, clique em "Manual Deploy" para tentar novamente

## Próximos Passos

Depois do deploy no Render:
1. ✅ Render backend deploy completo
2. ⏳ Vercel frontend deploy
3. ⏳ Configuração WhatsApp
4. ⏳ Testes com usuários de teste
