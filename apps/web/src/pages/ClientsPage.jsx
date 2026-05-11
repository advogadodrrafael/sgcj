import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientsStore } from '../stores/clients.js';
import { Plus, Search } from 'lucide-react';

const PHASES = {
  lead_novo: '📥 Lead Novo',
  em_contato: '📞 Em Contato',
  agendado: '📅 Agendado',
  em_atendimento: '👨‍⚖️ Em Atendimento',
  contrato: '✍️ Contrato',
  concluido: '✅ Concluído'
};

export default function ClientsPage() {
  const navigate = useNavigate();
  const clients = useClientsStore((state) => state.clients);
  const addClient = useClientsStore((state) => state.addClient);
  const loadClients = useClientsStore((state) => state.loadClients);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', channel: '', demand: '' });

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.demand?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAddClient(e) {
    e.preventDefault();
    try {
      await addClient(formData);
      setFormData({ name: '', phone: '', email: '', channel: '', demand: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <Plus size={20} /> Novo Cliente
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Formulário de Novo Cliente */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Cliente</h2>
            <form onSubmit={handleAddClient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Telefone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                required
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o canal</option>
                <option value="instagram">Instagram</option>
                <option value="google">Google</option>
                <option value="indicacao">Indicação</option>
                <option value="presencial">Presencial</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
              <textarea
                placeholder="Demanda/Descrição do caso"
                required
                value={formData.demand}
                onChange={(e) => setFormData({ ...formData, demand: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                rows="3"
              />
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex-1"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou demanda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => navigate(`/clients/${client.id}`)}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {PHASES[client.status] || client.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">📱 {client.phone}</p>
              <p className="text-gray-700 text-sm mb-3">{client.demand}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>📍 {client.channel}</span>
                <span>{new Date(client.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
