-- Tabela de Usuários
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  canal VARCHAR(50),
  demanda TEXT,
  status VARCHAR(50) DEFAULT 'lead_novo',
  numero_whatsapp VARCHAR(20),
  eh_lead_temporario BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Fases (7 fases da jornada)
CREATE TABLE fases (
  id SERIAL PRIMARY KEY,
  numero_fase INTEGER NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  sla VARCHAR(100)
);

-- Tabela de Interações
CREATE TABLE interacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  fase_id INTEGER REFERENCES fases(id),
  notas TEXT,
  tipo_interacao VARCHAR(50),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Contratos
CREATE TABLE contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  valor DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pendente',
  assinado_em TIMESTAMP,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Conversas WhatsApp
CREATE TABLE conversas_whatsapp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  numero_whatsapp_cliente VARCHAR(20) NOT NULL,
  numero_whatsapp_empresa VARCHAR(20) NOT NULL,
  ultima_mensagem TEXT,
  ultima_mensagem_em TIMESTAMP,
  lido_em TIMESTAMP,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Mensagens WhatsApp
CREATE TABLE mensagens_whatsapp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id UUID NOT NULL REFERENCES conversas_whatsapp(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id),
  corpo TEXT NOT NULL,
  tipo_midia VARCHAR(50),
  url_midia TEXT,
  enviado_por VARCHAR(50) NOT NULL,
  lido_em TIMESTAMP,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Templates de Mensagem por Fase
CREATE TABLE templates_mensagem (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fase_id INTEGER NOT NULL REFERENCES fases(id),
  titulo VARCHAR(255) NOT NULL,
  corpo TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Alertas de SLA
CREATE TABLE alertas_sla (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id UUID NOT NULL REFERENCES conversas_whatsapp(id) ON DELETE CASCADE,
  tempo_limite_em TIMESTAMP NOT NULL,
  alertado BOOLEAN DEFAULT false,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir as 7 fases
INSERT INTO fases (numero_fase, nome, descricao, sla) VALUES
(1, 'Captação e Primeiro Contato', 'Resposta em até 15 minutos', '15 minutos'),
(2, 'Pré-Atendimento e Agendamento', 'Agendar em até 24h', '24 horas'),
(3, 'Consulta/Diagnóstico', 'Diagnóstico patrimonial', ''),
(4, 'Proposta e Fechamento', 'Proposta estruturada', ''),
(5, 'Execução/Entrega', 'Trabalho jurídico', ''),
(6, 'Pós-Venda e Satisfação', 'Pesquisa de satisfação <48h', '48 horas'),
(7, 'Fidelização e Indicação', 'Contato trimestral', 'Trimestral');

-- Criar índices para melhor desempenho de consultas
CREATE INDEX idx_clientes_usuario_id ON clientes(usuario_id);
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_clientes_numero_whatsapp ON clientes(numero_whatsapp);
CREATE INDEX idx_interacoes_cliente_id ON interacoes(cliente_id);
CREATE INDEX idx_interacoes_usuario_id ON interacoes(usuario_id);
CREATE INDEX idx_contratos_cliente_id ON contratos(cliente_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_conversas_whatsapp_cliente_id ON conversas_whatsapp(cliente_id);
CREATE INDEX idx_conversas_whatsapp_numero ON conversas_whatsapp(numero_whatsapp_cliente);
CREATE INDEX idx_mensagens_whatsapp_conversa_id ON mensagens_whatsapp(conversa_id);
CREATE INDEX idx_mensagens_whatsapp_usuario_id ON mensagens_whatsapp(usuario_id);
CREATE INDEX idx_templates_mensagem_fase_id ON templates_mensagem(fase_id);
CREATE INDEX idx_alertas_sla_conversa_id ON alertas_sla(conversa_id);

-- Ativar Segurança em Nível de Linha (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversas_whatsapp ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_whatsapp ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates_mensagem ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_sla ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Usuários podem visualizar a si mesmos" ON usuarios
  FOR SELECT USING (id = auth.uid());

-- Usuários podem ver apenas clientes que possuem
CREATE POLICY "Usuários podem visualizar seus próprios clientes" ON clientes
  FOR SELECT USING (usuario_id = auth.uid());

CREATE POLICY "Usuários podem inserir seus próprios clientes" ON clientes
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Usuários podem atualizar seus próprios clientes" ON clientes
  FOR UPDATE USING (usuario_id = auth.uid());

CREATE POLICY "Usuários podem deletar seus próprios clientes" ON clientes
  FOR DELETE USING (usuario_id = auth.uid());

-- Usuários podem ver interações de seus clientes
CREATE POLICY "Usuários podem visualizar interações de seus próprios clientes" ON interacoes
  FOR SELECT USING (
    cliente_id IN (
      SELECT id FROM clientes WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem inserir interações de seus próprios clientes" ON interacoes
  FOR INSERT WITH CHECK (
    cliente_id IN (
      SELECT id FROM clientes WHERE usuario_id = auth.uid()
    )
  );

-- Usuários podem ver contratos de seus clientes
CREATE POLICY "Usuários podem visualizar contratos de seus próprios clientes" ON contratos
  FOR SELECT USING (
    cliente_id IN (
      SELECT id FROM clientes WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem inserir contratos de seus próprios clientes" ON contratos
  FOR INSERT WITH CHECK (
    cliente_id IN (
      SELECT id FROM clientes WHERE usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem atualizar contratos de seus próprios clientes" ON contratos
  FOR UPDATE USING (
    cliente_id IN (
      SELECT id FROM clientes WHERE usuario_id = auth.uid()
    )
  );

-- Todos podem visualizar fases
CREATE POLICY "Fases são publicamente legíveis" ON fases
  FOR SELECT USING (true);

-- Políticas RLS para Conversas WhatsApp (todos os colaboradores veem todas)
CREATE POLICY "Todos podem visualizar conversas" ON conversas_whatsapp
  FOR SELECT USING (true);

CREATE POLICY "Todos podem inserir conversas" ON conversas_whatsapp
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Todos podem atualizar conversas" ON conversas_whatsapp
  FOR UPDATE USING (true);

-- Políticas RLS para Mensagens WhatsApp (todos os colaboradores veem todas)
CREATE POLICY "Todos podem visualizar mensagens" ON mensagens_whatsapp
  FOR SELECT USING (true);

CREATE POLICY "Todos podem inserir mensagens" ON mensagens_whatsapp
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Todos podem atualizar mensagens" ON mensagens_whatsapp
  FOR UPDATE USING (true);

-- Políticas RLS para Templates (todos podem ler, admin pode gerenciar)
CREATE POLICY "Templates são públicos para leitura" ON templates_mensagem
  FOR SELECT USING (true);

CREATE POLICY "Todos podem inserir templates" ON templates_mensagem
  FOR INSERT WITH CHECK (ativo = true);

-- Políticas RLS para Alertas de SLA
CREATE POLICY "Todos podem visualizar alertas" ON alertas_sla
  FOR SELECT USING (true);

CREATE POLICY "Todos podem inserir alertas" ON alertas_sla
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Todos podem atualizar alertas" ON alertas_sla
  FOR UPDATE USING (true);

-- Inserir templates de mensagens padrão por fase
INSERT INTO templates_mensagem (fase_id, titulo, corpo) VALUES
(1, 'Primeiro contato', 'Olá! 👋 Bem-vindo à SG Fernandes Advocacia. Agradecemos seu contato. Um de nossos especialistas responderá em breve. 🙏'),
(2, 'Agendamento de consulta', 'Gostaria de agendar uma consulta com nossos especialistas? Qual dia e horário preferem? 📅'),
(3, 'Confirmação de consulta', 'Sua consulta está confirmada! Data e horário: [DATA]. Aguardamos você. 😊'),
(4, 'Apresentação de proposta', 'Análise realizada! Estamos preparando uma proposta personalizada para sua situação. Enviaremos em breve. 📋'),
(5, 'Proposta enviada', 'Proposta anexada! Temos opções adequadas ao seu orçamento. Pode revisar sem compromisso. 📎'),
(6, 'Trabalho em andamento', 'Seu processo está em andamento. Atualizações em breve! 🔄'),
(7, 'Satisfação do cliente', 'Como foi nossa atendimento? Sua opinião é importante! 😊 (responda com 😊😐😔)');
