import { create } from 'zustand';
import { db } from '../lib/database.js';

export const useClientsStore = create((set) => ({
  clients: [],
  loading: false,
  error: null,
  lastSync: null,
  pendingChanges: [],

  // Carregar clientes do banco local
  loadClients: async () => {
    set({ loading: true });
    try {
      const clients = await db.clients.toArray();
      set({ clients, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Adicionar novo cliente
  addClient: async (clientData) => {
    const newClient = {
      ...clientData,
      id: `client_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _synced: false
    };

    try {
      await db.clients.add(newClient);
      set((state) => ({
        clients: [...state.clients, newClient],
        pendingChanges: [
          ...state.pendingChanges,
          { type: 'create', table: 'clients', data: newClient, id: newClient.id }
        ]
      }));
      return newClient;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Atualizar cliente
  updateClient: async (id, updates) => {
    try {
      const updated_at = new Date().toISOString();
      await db.clients.update(id, { ...updates, updated_at, _synced: false });
      set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates, updated_at } : c)),
        pendingChanges: [
          ...state.pendingChanges,
          { type: 'update', table: 'clients', data: updates, id }
        ]
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Sincronizar pendências
  syncPending: async (token) => {
    set((state) => ({ pendingChanges: [] })); // Limpar after sync
  }
}));
