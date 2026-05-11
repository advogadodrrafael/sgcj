# ✅ Checklist de Deployment - SGCJ

## Fase 1: Preparação (CONCLUÍDA)
- ✅ Código backend e frontend completos
- ✅ Banco de dados SQL migration pronto
- ✅ Arquivo .env configurado
- ✅ Repositório GitHub é PUBLIC
- ✅ Dependências npm instaladas

---

## Fase 2: Deploy Backend - Render (EM PROGRESSO)

### 2.1: Criar Web Service no Render
**Acesse**: https://render.com/dashboard

**Passo a Passo**:
```
1. Clique em "New +" → "Web Service"
2. "Build and deploy from a Git repository"
3. Clique em "Connect GitHub" (se necessário)
   └─ Autorize o Render
   └─ Selecione: advogadodrrafael/sgcj
4. Configure:
   ├─ Name: sgcj-backend
   ├─ Environment: Node
   ├─ Branch: main
   ├─ Build Command: cd apps/backend && npm install
   └─ Start Command: cd apps/backend && npm start
```

### 2.2: Adicionar Variáveis de Ambiente
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

### 2.3: Iniciar Deploy
- [ ] Clique em "Create Web Service"
- [ ] Aguarde 2-3 minutos para o deploy completar
- [ ] Você receberá uma URL como: `https://sgcj-backend.onrender.com`

### 2.4: Obter URL do Backend
```
COPIE A URL AQUI: _________________________________
```

---

## Fase 3: Deploy Frontend - Vercel (PRÓXIMO)

### 3.1: Preparar VITE_API_URL
```
Abra: C:\projetos\sgcj\.env

Mude a linha:
VITE_API_URL=

Para:
VITE_API_URL=https://sua-url-do-render.onrender.com
```

### 3.2: Deploy no Vercel
**Acesse**: https://vercel.com

```
1. Clique em "Add New..." → "Project"
2. "Import Git Repository"
3. Selecione: advogadodrrafael/sgcj
4. Framework: Vite
5. Root Directory: ./apps/web
6. Environment Variables:
   ├─ VITE_API_URL=https://seu-render-url.onrender.com
   ├─ VITE_SUPABASE_URL=https://clrdkfnelmsgpznvjpqt.supabase.co
   └─ VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
7. Clique em "Deploy"
```

### 3.3: Obter URL do Frontend
```
COPIE A URL AQUI: _________________________________
```

---

## Fase 4: Configuração WhatsApp (PRÓXIMO)

### 4.1: Configurar Webhook no Meta Business Manager
```
1. Acesse: https://business.facebook.com
2. Vá em: My Apps → Seu App WhatsApp
3. Em "Webhooks", configure:
   ├─ Webhook URL: https://seu-render-url.onrender.com/api/whatsapp/webhook
   ├─ Verify Token: MDRkYjI5NWQtMWRlOC00ZWVjLTk0NmQtYzE5MjIwMDI4MzNj
   └─ Subscribe to: messages, message_template_status_update
```

---

## Fase 5: Testes (PRÓXIMO)

### 5.1: Testar com Usuários de Teste
```
Acesse: https://seu-vercel-url.vercel.app

Login com:
┌─ Email:    rafael@fernandes.com
│  Senha:    12345678
├─ Email:    erica@fernandes.com
│  Senha:    12345678
├─ Email:    luan@fernandes.com
│  Senha:    12345678
└─ ... (7 usuários totais)
```

### 5.2: Funcionalidades para Testar
- [ ] Login/Logout
- [ ] Criar novo cliente
- [ ] Editar cliente
- [ ] Mover cliente entre fases
- [ ] Enviar mensagem WhatsApp
- [ ] Sincronização offline/online
- [ ] Responsivo no celular

---

## 📞 Suporte

Se encontrar erros:
1. Verifique os logs do Render: https://render.com/dashboard
2. Verifique os logs do Vercel: https://vercel.com/dashboard
3. Confirme todas as variáveis de ambiente

---

## Tempo Estimado
- Render Deploy: 2-3 minutos
- Vercel Deploy: 3-5 minutos
- WhatsApp Config: 2 minutos
- **Total: ~10-15 minutos**

**Status**: Aguardando seu input para continuar com Fase 2! 🚀
