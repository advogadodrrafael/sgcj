import Dexie from 'dexie';

export const db = new Dexie('SGCJDatabase');

db.version(1).stores({
  users: 'id',
  clients: 'id, office_id, status, assigned_to, created_at',
  stages: 'id, client_id, phase_number',
  interactions: 'id, client_id, created_at',
  contracts: 'id, client_id, status',
  syncQueue: '++id, client_id'
});

// Tipos
export const PHASES = {
  1: 'Captação e Primeiro Contato',
  2: 'Pré-Atendimento e Agendamento',
  3: 'Consulta/Diagnóstico',
  4: 'Proposta e Fechamento',
  5: 'Execução/Entrega',
  6: 'Pós-Venda e Satisfação',
  7: 'Fidelização e Indicação'
};

export const STATUSES = {
  lead_novo: 'Lead Novo',
  em_contato: 'Em Contato',
  agendado: 'Agendado',
  em_atendimento: 'Em Atendimento',
  contrato: 'Contrato',
  concluido: 'Concluído'
};
