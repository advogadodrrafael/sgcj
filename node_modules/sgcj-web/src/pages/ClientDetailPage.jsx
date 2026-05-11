import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientsStore } from '../stores/clients.js';
import { ChevronLeft } from 'lucide-react';

const PHASES = [
  { id: 1, name: 'Captação e Primeiro Contato', description: 'Resposta em até 15 minutos' },
  { id: 2, name: 'Pré-Atendimento e Agendamento', description: 'Agendar em até 24h' },
  { id: 3, name: 'Consulta/Diagnóstico', description: 'Diagnóstico patrimonial' },
  { id: 4, name: 'Proposta e Fechamento', description: 'Proposta estruturada' },
  { id: 5, name: 'Execução/Entrega', description: 'Trabalho jurídico' },
  { id: 6, name: 'Pós-Venda e Satisfação', description: 'Pesquisa de satisfação <48h' },
  { id: 7, name: 'Fidelização e Indicação', description: 'Contato trimestral' }
];

const STATUS_MAP = {
  lead_novo: 1,
  em_contato: 2,
  agendado: 3,
  em_atendimento: 4,
  contrato: 5,
  concluido: 6
};

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clients = useClientsStore((state) => state.clients);
  const updateClient = useClientsStore((state) => state.updateClient);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const foundClient = clients.find((c) => c.id === id);
    setClient(foundClient);
  }, [id, clients]);

  if (!client) {
    return <div className="p-8">Carregando...</div>;
  }

  const currentPhase = STATUS_MAP[client.status] || 1;

  async function updatePhase(newPhase) {
    const statusMap = {
      1: 'lead_novo',
      2: 'em_contato',
      3: 'agendado',
      4: 'em_atendimento',
      5: 'contrato',
      6: 'concluido'
    };
    await updateClient(id, { status: statusMap[newPhase] });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/clients')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">📱 {client.phone}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Client Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Informações do Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 text-sm">Nome</label>
              <p className="text-gray-900 font-semibold">{client.name}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Telefone</label>
              <p className="text-gray-900 font-semibold">{client.phone}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Email</label>
              <p className="text-gray-900 font-semibold">{client.email || '-'}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Canal de Origem</label>
              <p className="text-gray-900 font-semibold capitalize">{client.channel}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-gray-600 text-sm">Demanda</label>
              <p className="text-gray-900 font-semibold">{client.demand}</p>
            </div>
          </div>
        </div>

        {/* Jornada do Cliente - 7 Fases */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Jornada do Cliente - 7 Fases</h2>
          <div className="space-y-4">
            {PHASES.map((phase) => (
              <div
                key={phase.id}
                className={`border-l-4 p-4 rounded cursor-pointer transition ${
                  currentPhase >= phase.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
                onClick={() => updatePhase(phase.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    currentPhase >= phase.id ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {phase.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{phase.name}</h3>
                    <p className="text-gray-600 text-sm">{phase.description}</p>
                  </div>
                  {currentPhase === phase.id && (
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded">
                      Atual
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de Interações */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Histórico de Interações</h2>
          <p className="text-gray-600 text-center py-8">Nenhuma interação registrada ainda</p>
        </div>
      </div>
    </div>
  );
}
