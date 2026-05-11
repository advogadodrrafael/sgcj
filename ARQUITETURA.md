# Arquitetura do Sistema - SG Fernandes Advocacia

## Visão Geral

Sistema de gestão de clientes baseado na nuvem com suporte para funcionamento offline, sincronização em tempo real (1 segundo) e visualização 360° das atividades de todos os colaboradores.

## Componentes Principais

### 1. Supabase (Backend-as-a-Service)

**Responsabilidade:** Armazenar dados e fornecer autenticação

**Tabelas:**
- `usuarios`: Dados de login dos colaboradores
- `clientes`: Informações dos clientes (nome, telefone, email, canal, demanda)
- `fases`: 7 fases predefinidas da jornada
- `interacoes`: Registro de contatos com clientes
- `contratos`: Informações de contratos e valores

**Segurança:**
- RLS (Row Level Security) ativado em todas as tabelas
- Cada usuário vê apenas seus próprios dados
- JWT para autenticação de requisições

**Índices:**
```sql
usuario_id, status, cliente_id, email
```

### 2. Backend Express (API REST)

**Localização:** `apps/backend/server.js`

**Responsabilidade:** Orquestrar dados entre frontend e Supabase

**Rotas Principais:**

#### Autenticação (`routes/auth.js`)
- `POST /api/auth/login`: Autentica com email/senha, retorna JWT
- `POST /api/auth/register`: Cria novo usuário

#### Clientes (`routes/clients.js`)
- `GET /api/clientes`: Lista todos os clientes do usuário
- `GET /api/clientes/:id`: Detalhes de um cliente específico
- `POST /api/clientes`: Cria novo cliente
- `PUT /api/clientes/:id`: Atualiza cliente

#### Sincronização (`routes/sync.js`)
- `POST /api/sync/push`: Recebe mudanças locais e salva no banco
- `GET /api/sync/pull`: Retorna mudanças desde lastSync timestamp

**Middleware:**
- `authenticateToken`: Verifica JWT em headers Authorization
- CORS: Controla origem das requisições
- Error handling: Centraliza tratamento de erros

### 3. Frontend React (Web)

**Framework:** React 18 + Vite

**Estrutura de Pastas:**
```
src/
├── pages/           (Componentes de página)
├── stores/          (Zustand - gerenciamento de estado)
├── lib/             (Utilitários - sync, database, serviceWorker)
├── index.css        (Tailwind + estilos globais)
├── App.jsx          (Router principal)
└── main.jsx         (Ponto de entrada)
```

**Stack Tecnológico:**
- **Roteamento:** React Router v6
- **Estado:** Zustand (stores/auth.js, stores/clients.js)
- **Dados locais:** Dexie (IndexedDB)
- **HTTP:** Axios
- **Estilos:** Tailwind CSS
- **Ícones:** Lucide React
- **Datas:** date-fns
- **Offline:** Service Worker

### 4. Sincronização (Motor de Tempo Real)

**Localização:** `src/lib/sync.js`

**Como Funciona:**

```javascript
// A cada 1 segundo:
1. Ler mudanças locais do IndexedDB (pendingChanges array)
2. Fazer POST /api/sync/push com mudanças
3. Fazer GET /api/sync/pull com timestamp da última sincronização
4. Atualizar IndexedDB com novos dados
5. Atualizar Zustand store
6. React re-renderiza componentes automaticamente
```

**Fluxo de Dados:**

```
Ação do Usuário
      ↓
Zustand Store atualiza
      ↓
IndexedDB persiste
      ↓
Cada 1s: sync.js executa:
  - Push: envia pendingChanges
  - Pull: busca atualizações
  - Merge: combina dados
      ↓
Zustand re-dispara
      ↓
React re-renderiza
```

**Tratamento de Conflitos:**
- Last-write-wins (timestamp mais recente vence)
- Operações são idempotentes (seguro reenviar)

### 5. Armazenamento Local (IndexedDB)

**Localização:** `src/lib/database.js`

**Schemas:**
```javascript
usuarios: { keyPath: 'id', indexes: ['email'] }
clientes: { keyPath: 'id', indexes: ['usuario_id', 'status'] }
fases: { keyPath: 'id' }
interacoes: { keyPath: 'id', indexes: ['cliente_id'] }
contratos: { keyPath: 'id', indexes: ['cliente_id'] }
pendingChanges: { keyPath: 'id' } // Fila de sincronização
```

**Vantagens:**
- Funciona sem internet
- Acesso rápido aos dados
- Persiste entre sessões
- Sincroniza automaticamente

### 6. Service Worker (Offline Capabilities)

**Localização:** `public/sw.js`

**Estratégia:** Network-first com fallback para cache

```
1. Tenta fazer requisição de rede
2. Se bem-sucedida (status 200), salva no cache
3. Se falhar, retorna do cache
4. Se não estiver em cache, retorna erro
```

**URLs em Cache:**
- `/` (index.html)
- `/index.html`
- `/manifest.json`
- Assets estáticos (JS, CSS)

### 7. Gerenciamento de Estado (Zustand)

**Auth Store (`stores/auth.js`):**
```javascript
{
  user: { id, email, name },
  token: "jwt-token",
  setAuth: (user, token) => {},
  logout: () => {},
  restoreSession: () => {}
}
```

**Clients Store (`stores/clients.js`):**
```javascript
{
  clients: [{ id, nome, telefone, email, canal, demanda, status }],
  pendingChanges: [{ type, entity, data, timestamp }],
  loadClients: () => {},
  addClient: (data) => {},
  updateClient: (id, data) => {}
}
```

## Fluxo de Operações

### Criar Novo Cliente

```
1. Usuário preenche formulário em ClientsPage
2. handleAddClient chama addClient(formData)
3. addClient:
   - Gera ID local: client_${timestamp}
   - Insere em Dexie
   - Adiciona a pendingChanges com type: 'create'
   - Atualiza Zustand
4. React re-renderiza ClientsPage
5. A cada 1s, sync.js envia push:
   - POST /api/sync/push com { type: 'create', entity: 'clientes', data: {...} }
6. Backend insere em Supabase
7. Backend retorna ID real do banco
8. Frontend atualiza IndexedDB com ID real
9. Todos os usuários fazem pull e recebem novo cliente
```

### Avançar Fase de Cliente

```
1. Usuário clica em fase em ClientDetailPage
2. updatePhase(novaFase) é chamado
3. updateClient(id, { status: statusMap[novaFase] })
4. Zustand marca _synced: false
5. Adiciona a pendingChanges com type: 'update'
6. Re-renderiza componente mostrando nova fase
7. sync.js envia push na próxima iteração
8. Backend atualiza updated_at timestamp
9. Todos os usuários puxam e veem mudança
```

## Segurança

### Camada 1: Autenticação
- Email/senha com bcryptjs (10 rounds)
- JWT assinado com JWT_SECRET
- Token armazenado em localStorage

### Camada 2: Autorização
- Middleware authenticateToken valida JWT
- RLS do Supabase valida permissões no banco
- Queries filtram por usuario_id automaticamente

### Camada 3: CORS
- Apenas domínios conhecidos podem fazer requisições
- Credenciais incluídas em requisições autenticadas

### Variáveis Sensíveis
```
SUPABASE_SERVICE_ROLE_KEY  - NUNCA no cliente
JWT_SECRET                  - NUNCA compartilhado
VITE_SUPABASE_ANON_KEY     - OK no cliente (público)
```

## Escalabilidade

### Horizontal Scaling
- Stateless backend pode ser replicado
- Supabase gerencia replicação de dados
- Service estático (frontend) em CDN (Vercel)

### Otimizações de Banco
```sql
-- Índices para queries frequentes
CREATE INDEX idx_clientes_usuario_id ON clientes(usuario_id);
CREATE INDEX idx_clientes_status ON clientes(status);
```

### Caching
- Service Worker: assets estáticos
- IndexedDB: dados da API
- Navegador: headers Cache-Control

## Recuperação de Erros

### Reconexão Automática
```javascript
// Monitora mudanças de conexão
window.addEventListener('online', () => performSync())
window.addEventListener('offline', () => console.log('offline'))
```

### Retry Logic
- Operações falhas ficam em pendingChanges
- Tentam novamente na próxima sincronização
- Sem limite máximo de retentativas

### Conflitos
- Last-write-wins baseado em timestamp
- Não há perda de dados, apenas resolução automática

## Performance

### Métricas
- TTI (Time to Interactive): ~2s com cache
- FCP (First Contentful Paint): ~1s
- Sync interval: 1000ms (configurável)

### Otimizações Ativas
- Code splitting com React Router
- Tree-shaking com Vite
- Tailwind CSS purged
- Imagens otimizadas
- Gzip compression no backend

## Monitoramento e Logs

### O que Monitorar
```
Backend:
- Tempo de resposta de /api/sync/push
- Número de erros de RLS
- Taxa de sincronização bem-sucedidas

Frontend:
- Erros de rede no console
- Taxa de falhas de sincronização
- Tamanho do IndexedDB

Supabase:
- Query performance
- Armazenamento utilizado
- Requisições por minuto
```

## Roadmap Futuro

- [ ] Notificações em tempo real (Supabase Realtime)
- [ ] Chat entre colaboradores
- [ ] Documentos anexados aos clientes
- [ ] Relatórios analíticos
- [ ] App móvel nativo (iOS/Android)
- [ ] Integração com WhatsApp API
- [ ] Automação de email
- [ ] Backups automáticos
- [ ] Auditoria de ações dos usuários

## Conclusão

O sistema foi arquitetado para ser:
- **Resiliente:** Funciona offline, sincroniza quando conectado
- **Real-time:** Todas as mudanças sincronizadas em 1 segundo
- **Seguro:** Múltiplas camadas de autenticação e autorização
- **Escalável:** Pode crescer para mais usuários e dados
- **Observável:** Logs e métricas em todos os níveis

A jornada do cliente com 7 fases garante que nenhuma oportunidade seja perdida.
