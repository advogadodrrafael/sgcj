import express from 'express';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_NUMERO_EMPRESA = process.env.WHATSAPP_NUMERO_EMPRESA;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

// Webhook para receber mensagens do WhatsApp
router.post('/webhook', async (req, res) => {
  try {
    const { entry } = req.body;

    if (!entry) return res.status(200).json({ status: 'ok' });

    entry.forEach(async (item) => {
      const changes = item.changes[0];
      const value = changes.value;

      if (value.messages) {
        for (const message of value.messages) {
          const numeroCliente = message.from;
          const corpo = message.text?.body || '';
          const midia = message.image || message.document;

          // Encontrar ou criar cliente
          let cliente = await encontrarOuCriarCliente(numeroCliente, corpo);

          // Encontrar conversa
          let conversa = await encontrarConversa(cliente.id, numeroCliente);
          if (!conversa) {
            conversa = await criarConversa(cliente.id, numeroCliente);
          }

          // Salvar mensagem
          await salvarMensagem(conversa.id, corpo, midia, 'cliente');

          // Atualizar conversa
          await supabase
            .from('conversas_whatsapp')
            .update({
              ultima_mensagem: corpo,
              ultima_mensagem_em: new Date().toISOString(),
              atualizado_em: new Date().toISOString()
            })
            .eq('id', conversa.id);

          // Criar alerta de SLA (15 minutos)
          const tempoLimite = new Date(Date.now() + 15 * 60 * 1000);
          await supabase
            .from('alertas_sla')
            .insert({
              conversa_id: conversa.id,
              tempo_limite_em: tempoLimite.toISOString()
            });

          // Emitir evento para WebSocket (tempo real)
          // Implementar com Socket.io se necessário
        }
      }

      // Confirmação de leitura
      if (value.statuses) {
        for (const status of value.statuses) {
          if (status.status === 'read') {
            await supabase
              .from('mensagens_whatsapp')
              .update({ lido_em: new Date().toISOString() })
              .eq('id', status.id);
          }
        }
      }
    });

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ erro: 'Erro ao processar mensagem' });
  }
});

// Verificação do webhook (Meta valida)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).json({ erro: 'Token inválido' });
  }
});

// Enviar mensagem
router.post('/enviar', authenticateToken, async (req, res) => {
  try {
    const { conversa_id, corpo, url_midia, tipo_midia } = req.body;
    const usuario_id = req.user.id;

    // Obter informações da conversa
    const { data: conversa } = await supabase
      .from('conversas_whatsapp')
      .select('numero_whatsapp_cliente, numero_whatsapp_empresa')
      .eq('id', conversa_id)
      .single();

    if (!conversa) {
      return res.status(404).json({ erro: 'Conversa não encontrada' });
    }

    // Enviar para WhatsApp API
    let payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: conversa.numero_whatsapp_cliente,
      type: 'text',
      text: { body: corpo }
    };

    // Se houver mídia
    if (url_midia && tipo_midia) {
      payload.type = tipo_midia === 'imagem' ? 'image' : 'document';
      payload[tipo_midia === 'imagem' ? 'image' : 'document'] = {
        link: url_midia
      };
    }

    const response = await axios.post(
      `https://graph.instagram.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const messageId = response.data.messages[0].id;

    // Salvar mensagem no banco
    await salvarMensagem(conversa_id, corpo, null, 'empresa', messageId, usuario_id);

    // Atualizar conversa
    await supabase
      .from('conversas_whatsapp')
      .update({
        ultima_mensagem: corpo,
        ultima_mensagem_em: new Date().toISOString(),
        lido_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      })
      .eq('id', conversa_id);

    res.status(200).json({
      sucesso: true,
      messageId
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ erro: 'Erro ao enviar mensagem' });
  }
});

// Listar conversas
router.get('/conversas', authenticateToken, async (req, res) => {
  try {
    const { data: conversas } = await supabase
      .from('conversas_whatsapp')
      .select(`
        id,
        cliente_id,
        numero_whatsapp_cliente,
        ultima_mensagem,
        ultima_mensagem_em,
        lido_em,
        clientes(id, nome, numero_whatsapp, eh_lead_temporario)
      `)
      .order('ultima_mensagem_em', { ascending: false });

    res.status(200).json(conversas);
  } catch (error) {
    console.error('Erro ao listar conversas:', error);
    res.status(500).json({ erro: 'Erro ao listar conversas' });
  }
});

// Obter histórico de conversa
router.get('/conversas/:id/mensagens', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: mensagens } = await supabase
      .from('mensagens_whatsapp')
      .select(`
        id,
        conversa_id,
        corpo,
        tipo_midia,
        url_midia,
        enviado_por,
        lido_em,
        criado_em,
        usuarios(nome)
      `)
      .eq('conversa_id', id)
      .order('criado_em', { ascending: true });

    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    res.status(500).json({ erro: 'Erro ao obter histórico' });
  }
});

// Obter templates de mensagem por fase
router.get('/templates/:fase_id', async (req, res) => {
  try {
    const { fase_id } = req.params;

    const { data: templates } = await supabase
      .from('templates_mensagem')
      .select('*')
      .eq('fase_id', fase_id)
      .eq('ativo', true);

    res.status(200).json(templates);
  } catch (error) {
    console.error('Erro ao obter templates:', error);
    res.status(500).json({ erro: 'Erro ao obter templates' });
  }
});

// Atualizar nome do lead temporário
router.put('/clientes/:cliente_id/editar-nome', authenticateToken, async (req, res) => {
  try {
    const { cliente_id } = req.params;
    const { nome } = req.body;

    const { data, error } = await supabase
      .from('clientes')
      .update({
        nome,
        eh_lead_temporario: false,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', cliente_id)
      .select();

    if (error) {
      return res.status(400).json({ erro: error.message });
    }

    res.status(200).json({
      sucesso: true,
      cliente: data[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
});

// Funções auxiliares
async function encontrarOuCriarCliente(numeroWhatsapp, corpo) {
  // Procurar cliente existente
  const { data: existente } = await supabase
    .from('clientes')
    .select('*')
    .eq('numero_whatsapp', numeroWhatsapp)
    .single();

  if (existente) return existente;

  // Criar novo cliente temporário
  const { data: novo } = await supabase
    .from('clientes')
    .insert({
      usuario_id: '00000000-0000-0000-0000-000000000001', // Sistema
      nome: `Lead - ${numeroWhatsapp}`,
      telefone: numeroWhatsapp,
      numero_whatsapp: numeroWhatsapp,
      status: 'lead_novo',
      eh_lead_temporario: true,
      demanda: corpo.substring(0, 100),
      canal: 'whatsapp'
    })
    .select()
    .single();

  return novo;
}

async function encontrarConversa(cliente_id, numeroWhatsapp) {
  const { data } = await supabase
    .from('conversas_whatsapp')
    .select('*')
    .eq('cliente_id', cliente_id)
    .eq('numero_whatsapp_cliente', numeroWhatsapp)
    .single();

  return data;
}

async function criarConversa(cliente_id, numeroWhatsapp) {
  const { data } = await supabase
    .from('conversas_whatsapp')
    .insert({
      cliente_id,
      numero_whatsapp_cliente: numeroWhatsapp,
      numero_whatsapp_empresa: WHATSAPP_NUMERO_EMPRESA
    })
    .select()
    .single();

  return data;
}

async function salvarMensagem(
  conversa_id,
  corpo,
  midia,
  enviado_por,
  messageId = null,
  usuario_id = null
) {
  const { data } = await supabase
    .from('mensagens_whatsapp')
    .insert({
      conversa_id,
      corpo,
      tipo_midia: midia?.type,
      url_midia: midia?.link,
      enviado_por,
      usuario_id: usuario_id || null
    })
    .select()
    .single();

  return data;
}

export default router;
