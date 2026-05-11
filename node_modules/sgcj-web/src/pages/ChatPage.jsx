import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/auth';
import { MessageCircle, Send, Paperclip, AlertCircle, Edit2, Check } from 'lucide-react';
import axios from 'axios';

export default function ChatPage() {
  const { token } = useAuthStore();
  const [conversas, setConversas] = useState([]);
  const [conversa_selecionada, setConversaSelecionada] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [corpo_mensagem, setCorpoMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [mostrando_templates, setMostrandoTemplates] = useState(false);
  const [editando_nome, setEditandoNome] = useState(false);
  const [novo_nome, setNovoNome] = useState('');
  const [sla_alerta, setSLAAlerta] = useState(false);
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Carregar conversas
  useEffect(() => {
    carregarConversas();
    const intervalo = setInterval(carregarConversas, 3000);
    return () => clearInterval(intervalo);
  }, []);

  // Carregar mensagens quando conversa muda
  useEffect(() => {
    if (conversa_selecionada) {
      carregarMensagens();
      carregarTemplates(conversa_selecionada.clientes?.status);
      const intervalo = setInterval(carregarMensagens, 2000);
      return () => clearInterval(intervalo);
    }
  }, [conversa_selecionada]);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  // Verificar SLA (15 minutos)
  useEffect(() => {
    if (conversa_selecionada?.ultima_mensagem_em) {
      const agora = new Date();
      const ultimaMensagem = new Date(conversa_selecionada.ultima_mensagem_em);
      const diferenca = (agora - ultimaMensagem) / 1000 / 60; // minutos

      if (diferenca > 15 && !conversa_selecionada.lido_em) {
        setSLAAlerta(true);
      }
    }
  }, [conversa_selecionada]);

  async function carregarConversas() {
    try {
      const response = await axios.get(`${API_URL}/api/whatsapp/conversas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversas(response.data);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  }

  async function carregarMensagens() {
    try {
      const response = await axios.get(
        `${API_URL}/api/whatsapp/conversas/${conversa_selecionada.id}/mensagens`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensagens(response.data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  }

  async function carregarTemplates(status) {
    try {
      // Mapear status para fase_id
      const faseMap = {
        'lead_novo': 1,
        'agendado': 2,
        'em_consulta': 3,
        'em_proposta': 4,
        'em_execucao': 5,
        'em_pos_venda': 6,
        'fidelizacao': 7
      };

      const fase_id = faseMap[status] || 1;

      const response = await axios.get(
        `${API_URL}/api/whatsapp/templates/${fase_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTemplates(response.data);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    }
  }

  async function enviarMensagem(e) {
    e.preventDefault();
    if (!corpo_mensagem.trim()) return;

    try {
      setCarregando(true);
      await axios.post(
        `${API_URL}/api/whatsapp/enviar`,
        {
          conversa_id: conversa_selecionada.id,
          corpo: corpo_mensagem
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCorpoMensagem('');
      setSLAAlerta(false);
      await carregarMensagens();
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert('Erro ao enviar mensagem');
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarNome() {
    if (!novo_nome.trim()) return;

    try {
      await axios.put(
        `${API_URL}/api/whatsapp/clientes/${conversa_selecionada.cliente_id}/editar-nome`,
        { nome: novo_nome },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditandoNome(false);
      setNovoNome('');
      await carregarConversas();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar nome');
    }
  }

  function enviarTemplate(template) {
    setCorpoMensagem(template.corpo);
    setMostrandoTemplates(false);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Lista de Conversas */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle size={24} className="text-blue-600" />
            Conversas
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {conversas.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setConversaSelecionada(conv);
                setSLAAlerta(false);
              }}
              className={`w-full p-4 text-left hover:bg-blue-50 transition-colors ${
                conversa_selecionada?.id === conv.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {conv.clientes?.nome}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {conv.numero_whatsapp_cliente}
                  </p>
                  {conv.clientes?.eh_lead_temporario && (
                    <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      Lead Temporário
                    </span>
                  )}
                </div>
                {!conv.lido_em && (
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2 truncate">
                {conv.ultima_mensagem}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(conv.ultima_mensagem_em).toLocaleTimeString('pt-BR')}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Área de Chat */}
      {conversa_selecionada ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div>
              {editando_nome ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novo_nome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Digite o nome"
                    autoFocus
                  />
                  <button
                    onClick={atualizarNome}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {conversa_selecionada.clientes?.nome}
                  </h3>
                  {conversa_selecionada.clientes?.eh_lead_temporario && (
                    <button
                      onClick={() => {
                        setEditandoNome(true);
                        setNovoNome(conversa_selecionada.clientes?.nome);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-600">
                {conversa_selecionada.numero_whatsapp_cliente}
              </p>
            </div>

            {sla_alerta && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">SLA vencido! Responder agora</span>
              </div>
            )}
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.enviado_por === 'empresa' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.enviado_por === 'empresa'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.corpo}</p>
                  {msg.url_midia && (
                    <div className="mt-2">
                      {msg.tipo_midia === 'imagem' ? (
                        <img
                          src={msg.url_midia}
                          alt="Mídia"
                          className="max-w-xs rounded"
                        />
                      ) : (
                        <a
                          href={msg.url_midia}
                          className="text-sm underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📎 {msg.tipo_midia}
                        </a>
                      )}
                    </div>
                  )}
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(msg.criado_em).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {msg.lido_em && msg.enviado_por === 'empresa' && (
                    <p className="text-xs opacity-60">✓✓ Lido</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Templates */}
          {mostrando_templates && templates.length > 0 && (
            <div className="border-t border-gray-200 bg-white p-4 max-h-40 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-700 mb-2">Templates rápidos:</p>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => enviarTemplate(template)}
                    className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-800"
                  >
                    <p className="font-medium">{template.titulo}</p>
                    <p className="text-xs text-gray-600 truncate">{template.corpo}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <form onSubmit={enviarMensagem} className="flex gap-2">
              <button
                type="button"
                onClick={() => setMostrandoTemplates(!mostrando_templates)}
                className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg"
                title="Templates"
              >
                <Paperclip size={20} />
              </button>

              <input
                type="text"
                value={corpo_mensagem}
                onChange={(e) => setCorpoMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={carregando}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
            <p>Selecione uma conversa para começar</p>
          </div>
        </div>
      )}
    </div>
  );
}
