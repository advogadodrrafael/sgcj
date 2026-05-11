# Configuração da Integração WhatsApp

Guia completo para integrar a API do WhatsApp Business ao SGCJ.

## 📋 Pré-Requisitos

- Conta Meta Business (Facebook/Instagram)
- WhatsApp Business Account criado
- Número de telefone verificado
- Acesso a credenciais da API

## 🔧 Passo 1: Obter Credenciais da Meta

### 1.1 Acessar Meta Business Manager
1. Acesse [business.facebook.com](https://business.facebook.com)
2. Faça login com sua conta
3. Vá para **Configurações** → **Contas**

### 1.2 Gerar Token de Acesso
1. Em **Desenvolvedores**, vá para **Meus Apps**
2. Crie um novo app (tipo: Business)
3. Adicione **WhatsApp** como produto
4. Em **Configurações → Tokens de Acesso**, gere seu token permanente
5. **Copie o token** (salve em local seguro)

### 1.3 Obter Phone ID
1. Em **WhatsApp → API Setup**
2. Localize seu **Phone ID** (número entre parênteses)
3. **Copie o Phone ID**

## 🌐 Passo 2: Configurar Webhook

### 2.1 Gerar Token de Verificação
Abra um terminal e execute:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Salve este token como `WHATSAPP_VERIFY_TOKEN`

### 2.2 Configurar URL do Webhook
1. Em **WhatsApp → Configuração de Webhook**
2. Insira **URL do Callback**:
   ```
   https://seu-backend.render.com/api/whatsapp/webhook
   ```
3. Insira o **Token de Verificação** gerado acima
4. Clique em **Verificar e Salvar**

### 2.3 Inscrever-se em Eventos
Meta enviará mensagens para seu webhook. Inscreva-se em:
- `messages`
- `message_status`

## 📝 Passo 3: Variáveis de Ambiente

Crie ou atualize seu arquivo `.env`:

```env
# WhatsApp Configuration
WHATSAPP_API_TOKEN=SEU_TOKEN_AQUI
WHATSAPP_PHONE_ID=SEU_PHONE_ID_AQUI
WHATSAPP_NUMERO_EMPRESA=5521999999999
WHATSAPP_VERIFY_TOKEN=SEU_TOKEN_VERIFICACAO_AQUI
```

**Substitua os valores destacados com suas credenciais.**

## 🚀 Passo 4: Testar a Integração

### 4.1 Iniciar o Backend
```bash
cd apps/backend
npm install
npm run dev
```

### 4.2 Testar com cURL
Meta enviará uma requisição GET para verificar o webhook:

```bash
curl -X GET "http://localhost:3000/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=SEU_TOKEN"
```

Resposta esperada: `test123`

### 4.3 Testar Envio de Mensagem
```bash
curl -X POST "http://localhost:3000/api/whatsapp/enviar" \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversa_id": "uuid-da-conversa",
    "corpo": "Olá! Esta é uma mensagem de teste."
  }'
```

## 🔌 Integração no Frontend

### 5.1 Adicionar Rota ao App
Edite `apps/web/src/App.jsx`:

```jsx
import ChatPage from './pages/ChatPage';

// No router, adicione:
{
  path: '/chat',
  element: <ChatPage />
}
```

### 5.2 Adicionar Link no Menu
Edite a página principal (Dashboard) para incluir link:

```jsx
<Link to="/chat" className="...">
  💬 Mensagens
</Link>
```

## 🔄 Fluxo de Funcionamento

```
Cliente envia mensagem WhatsApp
           ↓
Meta encaminha para webhook (POST)
           ↓
Backend recebe em /api/whatsapp/webhook
           ↓
Sistema procura cliente pelo número
           ↓
Se não existe: cria lead temporário
           ↓
Cria conversa ou atualiza existente
           ↓
Salva mensagem no banco
           ↓
Cria alerta de SLA (15 minutos)
           ↓
Envia notificação ao frontend (WebSocket)
           ↓
Todos os colaboradores veem em tempo real
```

## 📨 Recursos Implementados

✅ **Receber mensagens** - Webhook integrado  
✅ **Enviar mensagens** - API completa  
✅ **Histórico de conversa** - Acesso a todas as mensagens  
✅ **Leads temporários** - Criação automática  
✅ **Editar nome do lead** - Interface no chat  
✅ **Templates rápidos** - 7 templates por fase  
✅ **Indicador de leitura** - Visualizar quando cliente leu  
✅ **Alertas de SLA** - 15 minutos para responder  
✅ **Mídia** - Suporte a imagens e documentos  
✅ **Tempo real** - Sincronização automática  

## 🛠️ Troubleshooting

### Webhook não recebe mensagens
- [ ] Verificar se URL está acessível (teste com curl)
- [ ] Confirmar token de verificação
- [ ] Verificar logs do backend (`npm run dev`)
- [ ] Testar envio de mensagem manualmente

### Erro "Token inválido"
- [ ] Gerar novo token: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Atualizar em Meta Business Manager
- [ ] Atualizar `.env`

### Mensagens não sincronizam
- [ ] Verificar se `SYNC_INTERVAL` está correto (padrão: 1000ms)
- [ ] Verificar conexão com Supabase
- [ ] Ver console do navegador (DevTools → Network)

### Leads temporários não aparecem
- [ ] Confirmar que `eh_lead_temporario = true` no banco
- [ ] Verificar botão "Editar nome" para confirmar criação
- [ ] Verificar logs do backend

## 📞 Números de Teste

Meta fornece números de teste para desenvolvimento:
- **Número teste:** +1 (555) 010-2000
- **Não requer aprovação** durante desenvolvimento

## ✅ Checklist de Deploy

Antes de colocar em produção:

- [ ] Token de acesso está em variável de ambiente (não em código)
- [ ] Webhook URL aponta para seu domínio de produção
- [ ] Certificado SSL está ativo (HTTPS)
- [ ] Número de telefone está verificado
- [ ] App foi enviado para revisão Meta (se necessário)
- [ ] Testes de envio/recebimento funcionam
- [ ] Alertas de SLA estão funcionando
- [ ] Sincronização de conversa está em tempo real

## 🚨 Segurança

**NUNCA:**
- ❌ Commit token de acesso no git
- ❌ Expor Phone ID publicamente
- ❌ Usar token em código frontend
- ❌ Compartilhar credenciais por email

**SEMPRE:**
- ✅ Use variáveis de ambiente
- ✅ Valide webhooks no backend
- ✅ Use HTTPS em produção
- ✅ Monitore logs de segurança

## 📚 Recursos Adicionais

- [Documentação Meta WhatsApp API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Guia de Webhooks](https://developers.facebook.com/docs/whatsapp/webhooks)
- [Best Practices](https://developers.facebook.com/docs/whatsapp/on-premises-api/webhooks/best-practices)

---

**Status:** ✅ Pronto para deploy  
**Última atualização:** Maio 2026
