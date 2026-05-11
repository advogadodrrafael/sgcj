import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth.js';
import { useClientsStore } from '../stores/clients.js';
import { BarChart3, Users, TrendingUp, Clock } from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const clients = useClientsStore((state) => state.clients);
  const loadClients = useClientsStore((state) => state.loadClients);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    // Atualizar stats a cada 1 segundo
    const interval = setInterval(() => {
      const newStats = {
        totalClients: clients.length,
        newLeads: clients.filter((c) => c.status === 'lead_novo').length,
        scheduled: clients.filter((c) => c.status === 'agendado').length,
        inProgress: clients.filter((c) => c.status === 'em_atendimento').length,
        closed: clients.filter((c) => c.status === 'concluido').length,
        conversionRate: clients.length > 0
          ? ((clients.filter((c) => c.status === 'concluido').length / clients.length) * 100).toFixed(1)
          : 0
      };
      setStats(newStats);
    }, 1000);

    return () => clearInterval(interval);
  }, [clients]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SG Fernandes Advocacia</h1>
            <p className="text-gray-600">Bem-vindo, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard icon={Users} label="Total de Clientes" value={stats.totalClients || 0} />
          <StatCard icon={Clock} label="Novos Leads" value={stats.newLeads || 0} color="blue" />
          <StatCard icon={TrendingUp} label="Agendados" value={stats.scheduled || 0} color="green" />
          <StatCard icon={BarChart3} label="Em Atendimento" value={stats.inProgress || 0} color="orange" />
          <StatCard icon={TrendingUp} label="Concluídos" value={stats.closed || 0} color="purple" />
          <StatCard icon={TrendingUp} label="Taxa Conversão" value={`${stats.conversionRate}%`} color="indigo" />
        </div>

        {/* Clientes por Fase */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Clientes por Fase</h2>
          <div className="space-y-4">
            {[
              { phase: 'Captação', key: 'lead_novo', color: 'blue' },
              { phase: 'Pré-Atendimento', key: 'em_contato', color: 'cyan' },
              { phase: 'Agendado', key: 'agendado', color: 'green' },
              { phase: 'Consulta', key: 'em_atendimento', color: 'orange' },
              { phase: 'Fechado', key: 'contrato', color: 'indigo' },
              { phase: 'Concluído', key: 'concluido', color: 'purple' }
            ].map((item) => {
              const count = clients.filter((c) => c.status === item.key).length;
              return (
                <div key={item.key} className="flex items-center">
                  <div className={`bg-${item.color}-500 h-2 rounded-full transition-all`} style={{width: `${(count / Math.max(stats.totalClients, 1)) * 100}%`}}></div>
                  <span className="ml-4 text-gray-700 font-semibold min-w-[150px]">{item.phase}</span>
                  <span className="text-gray-900 font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = 'gray' }) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className={`${colorClasses[color]} w-10 h-10 rounded-lg flex items-center justify-center mb-2`}>
        <Icon size={20} />
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
