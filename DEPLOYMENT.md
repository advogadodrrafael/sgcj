# Guia de Implantação - SG Fernandes Advocacia

## Início Rápido

Este guia cobre a implantação completa do sistema SG Fernandes em Supabase, backend e frontend.

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase (a versão gratuita funciona)
- Conta Vercel (para implantação do frontend)
- Conta Render ou Railway (para implantação do backend)

## Etapa 1: Configuração do Supabase

### Criar um Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Novo Projeto"
3. Preencha os detalhes do projeto:
   - Nome do projeto: `sgcj-fernandes`
   - Senha do banco de dados: Crie uma senha forte
   - Região: Escolha a mais próxima de sua localização
4. Aguarde a inicialização do projeto (2-3 minutos)

### Executar Migração do Banco de Dados

1. Abra o Editor SQL do Supabase
2. Crie uma nova consulta
3. Copie o conteúdo de `apps/backend/migrations/001_initial_schema.sql`
4. Execute a consulta
5. Verifique se as tabelas foram criadas (usuários, clientes, fases, interações, contratos)

### Obter Chaves de API

1. Vá para Configurações do Projeto → API
2. Copie:
   - `URL do Projeto` → `VITE_SUPABASE_URL`
   - `chave pública anon` → `VITE_SUPABASE_ANON_KEY`
   - `chave de função de serviço` → `SUPABASE_SERVICE_ROLE_KEY` (mantenha secreto!)

### Semear Usuários de Teste

```bash
# A partir da raiz do projeto
cd apps/backend
npm run seed
```

Isso cria usuários de teste:
- rafael@fernandes.com | 12345678
- erica@fernandes.com | 12345678
- luan@fernandes.com | 12345678
- taiza@fernandes.com | 12345678
- dax@fernandes.com | 12345678
- andre@fernandes.com | 12345678
- juliana@fernandes.com | 12345678

## Etapa 2: Implantação do Backend (Render)

### Opção A: Implantar no Render

1. Envie o código para GitHub
2. Acesse [render.com](https://render.com)
3. Crie um novo "Serviço Web"
4. Conecte o repositório GitHub
5. Defina a configuração:
   - **Comando de Construção**: `cd apps/backend && npm install`
   - **Comando de Inicialização**: `node server.js`
   - **Variáveis de Ambiente**:
     ```
     VITE_SUPABASE_URL=<sua-url-supabase>
     SUPABASE_SERVICE_ROLE_KEY=<sua-chave-de-funcao-de-servico>
     JWT_SECRET=<gere-uma-chave-secreta>
     NODE_ENV=production
     API_PORT=3000
     ```
6. Implante
7. Anote a URL implantada (ex: `https://sgcj-backend.onrender.com`)

### Opção B: Implantar no Railway

1. Acesse [railway.app](https://railway.app)
2. Crie um novo projeto
3. Conecte GitHub
4. Selecione `apps/backend` como diretório raiz
5. Defina as variáveis de ambiente (iguais às acima)
6. Implante
7. Anote a URL implantada

## Etapa 3: Implantação do Frontend (Vercel)

### Implantar no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Importe o projeto do GitHub
3. Defina a configuração:
   - **Framework**: Vite
   - **Diretório Raiz**: `apps/web`
   - **Comando de Construção**: `npm run build`
   - **Diretório de Saída**: `dist`
   - **Variáveis de Ambiente**:
     ```
     VITE_SUPABASE_URL=<sua-url-supabase>
     VITE_SUPABASE_ANON_KEY=<sua-chave-anon>
     VITE_API_URL=<url-do-backend> (ex: https://sgcj-backend.onrender.com)
     ```
4. Implante
5. Obtenha a URL do Vercel
6. Atualize o CORS do backend para permitir o domínio do Vercel

### Atualizar CORS do Backend

Em `apps/backend/server.js`, atualize a configuração CORS:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://sgcj-fernandes.vercel.app', // Sua URL do Vercel
    'http://localhost:3000'
  ],
  credentials: true
};
```

## Etapa 4: Aplicativo Móvel (Opcional - React Native)

```bash
cd apps/mobile
npm install
npx expo start
```

### Construir para iOS
```bash
eas build --platform ios
```

### Construir para Android
```bash
eas build --platform android
```

## Etapa 5: Pós-Implantação

### Testar o Sistema

1. Visite `https://sgcj-fernandes.vercel.app`
2. Faça login com: `rafael@fernandes.com` / `12345678`
3. Crie um cliente de teste
4. Teste a progressão de fases
5. Verifique atualizações em tempo real
6. Teste o modo offline (abra DevTools → Rede → Offline)

### Monitorar Logs

- **Backend (Render)**: Painel → Aba de Logs
- **Frontend (Vercel)**: Implantações → Ver Logs de Função
- **Banco de Dados (Supabase)**: Editor SQL ou Monitor de Banco de Dados

## Referência de Variáveis de Ambiente

| Variável | Backend | Frontend | Móvel | Propósito |
|----------|---------|----------|-------|-----------|
| `VITE_SUPABASE_URL` | ✓ | ✓ | ✓ | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | ✗ | ✓ | ✓ | Chave de API pública |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | ✗ | ✗ | Chave de admin privada (SEGREDO) |
| `JWT_SECRET` | ✓ | ✗ | ✗ | Chave de assinatura de token (SEGREDO) |
| `VITE_API_URL` | ✗ | ✓ | ✓ | URL base da API do backend |
| `NODE_ENV` | ✓ | ✓ | ✓ | Ambiente (desenvolvimento/produção) |
| `API_PORT` | ✓ | ✗ | ✗ | Porta do servidor backend |
| `SYNC_INTERVAL` | ✓ | ✓ | ✓ | Intervalo de sincronização em tempo real (ms) |

## Solução de Problemas

### Erros de CORS
- Atualize a configuração CORS do backend com sua URL frontend
- Verifique a variável de ambiente API_URL no frontend

### Falha de Autenticação
- Verifique se JWT_SECRET está definido no backend
- Verifique se SUPABASE_SERVICE_ROLE_KEY está correto
- Garanta que a tabela de usuários tenha dados de teste

### Modo Offline Não Funciona
- Verifique se o Service Worker está registrado no DevTools do navegador
- Verifique se o banco de dados Dexie foi inicializado
- Verifique o armazenamento do navegador em DevTools → Aplicativo

### Atualizações em Tempo Real Não Funcionam
- Verifique se SYNC_INTERVAL está definido (padrão: 1000ms)
- Verifique a aba de rede do navegador para requisições /sync/pull e /sync/push
- Verifique se o token é válido em localStorage

## Dimensionamento e Otimização

### Índices de Banco de Dados
- Já criados na migração para: user_id, status, client_id, email
- Monitore o desempenho de consultas nas métricas do Supabase

### Estratégia de Cache
- Service Worker armazena em cache ativos estáticos
- IndexedDB armazena em cache respostas de API
- Considere adicionar Redis para cache do backend, se necessário

### Teste de Carga
- Use ferramentas como k6 ou Artillery para teste de estresse
- Monitore tempos de resposta e taxas de erro
- Dimensione a instância do Render/Railway, se necessário

## Lista de Verificação de Segurança

- [ ] JWT_SECRET é forte e único
- [ ] SUPABASE_SERVICE_ROLE_KEY é mantido secreto (nunca no cliente)
- [ ] CORS é restrito a domínios conhecidos
- [ ] As políticas RLS estão ativadas em todas as tabelas
- [ ] Os backups do banco de dados estão configurados
- [ ] HTTPS é aplicado em todas as URLs
- [ ] A limitação de taxa de API está configurada (se usar Render/Railway)
- [ ] Os logs sensíveis não são expostos

## Suporte

Para problemas:
1. Verifique o console do navegador para erros
2. Revise os logs do backend (Render/Railway)
3. Verifique todas as variáveis de ambiente
4. Verifique o status do projeto Supabase
5. Teste endpoints de API com curl ou Postman
