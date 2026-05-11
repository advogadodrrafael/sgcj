# SG Fernandes Advocacia - Sistema de Gestão de Clientes

Sistema personalizado de gestão de clientes e jornada do cliente para o escritório de advocacia SG Fernandes, com suporte para 7 fases de atendimento, sincronização em tempo real e funcionamento offline.

## 🎯 Características Principais

- **7 Fases de Jornada do Cliente**: Captação → Primeiro Contato → Pré-Atendimento → Agendamento → Consulta → Proposta → Execução → Pós-Venda → Fidelização
- **Visualização 360°**: Acompanhe todas as atividades dos colaboradores em tempo real
- **Autenticação por Usuário**: Cada membro da equipe possui seu próprio login
- **Sincronização em Tempo Real**: Atualizações automáticas a cada 1 segundo
- **Funcionamento Offline**: Trabalhe sem internet, sincronize quando a conexão retornar
- **Multi-plataforma**: Desktop (web) e mobile (iOS/Android)
- **Segurança em Nível de Linha**: Cada usuário vê apenas seus próprios dados

## 🏗️ Arquitetura

### Tecnologias Utilizadas

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL + Autenticação)
- JWT para autenticação
- bcryptjs para criptografia de senhas

**Frontend Web:**
- React 18
- Vite (ferramenta de build)
- React Router (navegação)
- Zustand (gerenciamento de estado)
- Tailwind CSS (estilos)
- Dexie (IndexedDB para local storage)
- Axios (requisições HTTP)
- Service Workers (offline)

**Móvel (Optional):**
- React Native
- Expo

## 📁 Estrutura do Projeto

```
sgcj/
├── apps/
│   ├── backend/
│   │   ├── routes/
│   │   │   ├── auth.js          (Autenticação)
│   │   │   ├── clients.js       (Gerenciamento de Clientes)
│   │   │   └── sync.js          (Sincronização)
│   │   ├── middleware/
│   │   │   └── auth.js          (Verificação JWT)
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql
│   │   ├── scripts/
│   │   │   └── seed.js          (População de dados de teste)
│   │   └── server.js            (Servidor principal)
│   │
│   ├── web/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx         (Tela de login)
│   │   │   │   ├── DashboardPage.jsx    (Painel de controle)
│   │   │   │   ├── ClientsPage.jsx      (Lista de clientes)
│   │   │   │   └── ClientDetailPage.jsx (Detalhes do cliente)
│   │   │   ├── stores/
│   │   │   │   ├── auth.js      (Estado de autenticação)
│   │   │   │   └── clients.js   (Estado de clientes)
│   │   │   ├── lib/
│   │   │   │   ├── database.js  (Dexie IndexedDB)
│   │   │   │   ├── sync.js      (Motor de sincronização)
│   │   │   │   └── serviceWorker.js
│   │   │   ├── App.jsx          (Componente principal)
│   │   │   ├── main.jsx         (Ponto de entrada)
│   │   │   └── index.css        (Estilos globais)
│   │   ├── public/
│   │   │   └── sw.js            (Service Worker)
│   │   └── index.html
│   │
│   └── mobile/
│       └── (Aplicativo React Native com Expo)
│
├── .env.example          (Variáveis de ambiente)
├── DEPLOYMENT.md         (Guia de implantação)
└── package.json          (Configuração monorepo)
```

## 🚀 Início Rápido

### Desenvolvimento Local

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Editar .env com suas configurações
   ```

3. **Iniciar backend:**
   ```bash
   cd apps/backend
   npm run dev
   ```

4. **Em outro terminal, iniciar frontend:**
   ```bash
   cd apps/web
   npm run dev
   ```

5. **Acessar a aplicação:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

### Credenciais de Teste

```
Email: rafael@fernandes.com
Senha: 12345678
```

## 📊 7 Fases da Jornada do Cliente

| Fase | Nome | Descrição | SLA |
|------|------|-----------|-----|
| 1 | Captação e Primeiro Contato | Resposta inicial ao cliente | 15 minutos |
| 2 | Pré-Atendimento e Agendamento | Marcar consulta | 24 horas |
| 3 | Consulta/Diagnóstico | Diagnóstico patrimonial | - |
| 4 | Proposta e Fechamento | Proposta estruturada | - |
| 5 | Execução/Entrega | Trabalho jurídico | - |
| 6 | Pós-Venda e Satisfação | Pesquisa de satisfação | 48 horas |
| 7 | Fidelização e Indicação | Contato trimestral | Trimestral |

## 🔄 Sincronização em Tempo Real

O sistema sincroniza dados automaticamente a cada 1 segundo:

1. **Push**: Envia mudanças locais para o servidor
2. **Pull**: Busca novos dados do servidor
3. **Merge**: Atualiza o estado local (IndexedDB + Zustand)

Isso garante que todos os colaboradores vejam as mesmas informações em tempo real.

## 📱 Funcionalidades por Página

### LoginPage (Tela de Login)
- Autenticação por email/senha
- Armazenamento de token JWT
- Redirecionamento automático

### DashboardPage (Painel de Controle)
- 6 KPIs em tempo real
- Total de Clientes
- Novos Leads
- Agendados
- Em Atendimento
- Concluídos
- Taxa de Conversão
- Distribuição por Fase (visual em barras)

### ClientsPage (Lista de Clientes)
- Busca por nome, telefone ou demanda
- Criação de novo cliente
- Grid responsivo com cards
- Status visual de cada cliente

### ClientDetailPage (Detalhes do Cliente)
- Informações do cliente
- 7 Fases clicáveis para progressão
- Histórico de interações (placeholder)
- Avanço de fase com um clique

## 🔐 Segurança

- **JWT**: Tokens com expiração
- **RLS (Row Level Security)**: Cada usuário vê apenas seus dados
- **Senhas**: Criptografadas com bcryptjs
- **CORS**: Restrito a domínios conhecidos

## 🌐 Implantação

Veja [DEPLOYMENT.md](DEPLOYMENT.md) para instruções completas de implantação em:
- **Supabase** (banco de dados)
- **Render/Railway** (backend)
- **Vercel** (frontend)

## 📦 Dependências Principais

```json
{
  "backend": ["express", "supabase-js", "bcryptjs", "jsonwebtoken"],
  "frontend": ["react", "react-router-dom", "zustand", "dexie", "axios", "tailwindcss"],
  "mobile": ["react-native", "expo"]
}
```

## 🛠️ Variáveis de Ambiente

Veja `.env.example` para a lista completa. Principais:

```env
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-secreta
JWT_SECRET=sua-chave-jwt
VITE_API_URL=http://localhost:3000
```

## 📊 Fluxo de Dados

```
Usuário → Frontend (React)
         ↓
         Zustand Store (estado)
         ↓
         IndexedDB (offline)
         ↓
         Service Worker (cache)
         ↓
         API (fetch/pull)
         ↓
Backend (Express) → Supabase (PostgreSQL)
```

## 🔄 Ciclo de Sincronização

```
1 segundo:
├─ Ler mudanças locais (IndexedDB)
├─ Enviar ao backend (POST /api/sync/push)
├─ Receber novas mudanças (GET /api/sync/pull)
├─ Atualizar IndexedDB
├─ Atualizar Zustand
└─ Re-renderizar componentes React
```

## 📝 Scripts Disponíveis

### Backend
```bash
npm run dev      # Desenvolvimento com nodemon
npm run build    # Build para produção
npm run seed     # Popular banco com dados de teste
```

### Frontend
```bash
npm run dev      # Desenvolvimento com Vite
npm run build    # Build de produção
npm run preview  # Pré-visualizar build
```

## 🚨 Troubleshooting

### "Não consigo sincronizar offline"
- Verifique se o Service Worker está registrado
- Abra DevTools → Application → Service Workers
- Verifique localStorage para JWT token

### "Autenticação falha"
- Confirme credenciais de teste
- Verifique JWT_SECRET no backend
- Veja logs do console do navegador

### "Dados não aparecem em tempo real"
- Verifique SYNC_INTERVAL (padrão: 1000ms)
- Veja aba Network → requisições /sync
- Verifique IndexedDB em DevTools

## 📞 Suporte

Para problemas:
1. Verifique a [aba de Troubleshooting](DEPLOYMENT.md#solução-de-problemas) no guia de implantação
2. Revise os logs do console do navegador
3. Teste a API com curl ou Postman
4. Verifique variáveis de ambiente

## 📄 Licença

Privado - Apenas para uso interno de SG Fernandes Advocacia

---

**Desenvolvido com ❤️ para SG Fernandes Advocacia**
