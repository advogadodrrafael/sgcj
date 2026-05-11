import axios from 'axios';
import { db } from './database.js';
import { useClientsStore } from '../stores/clients.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SYNC_INTERVAL = import.meta.env.VITE_SYNC_INTERVAL || 1000; // 1 segundo

let syncInterval = null;
let isOnline = navigator.onLine;

// Monitorar conexão
window.addEventListener('online', () => {
  isOnline = true;
  console.log('✅ Voltou online - sincronizando...');
  performSync();
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('🔴 Perdeu internet - modo offline ativado');
});

export async function initializeSync(token) {
  // Fazer sync imediato
  await performSync(token);

  // Sync automático a cada 1 segundo
  if (syncInterval) clearInterval(syncInterval);

  syncInterval = setInterval(() => {
    if (isOnline) {
      performSync(token);
    }
  }, SYNC_INTERVAL);
}

export async function performSync(token) {
  if (!isOnline || !token) return;

  try {
    const store = useClientsStore.getState();
    const changes = store.pendingChanges;

    // Se tem mudanças, enviar para nuvem
    if (changes.length > 0) {
      console.log(`📤 Sincronizando ${changes.length} mudanças...`);

      const response = await axios.post(`${API_URL}/api/sync/push`, { changes }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Marcar como sincronizadas
      for (const [changeId, result] of Object.entries(response.data)) {
        if (result.success) {
          await db.clients.where('id').equals(changeId).modify({ _synced: true });
        }
      }

      // Limpar mudanças pendentes sincronizadas
      store.syncPending(token);
    }

    // Puxar mudanças da nuvem
    const lastSync = localStorage.getItem('lastSync') || new Date(0).toISOString();
    const { data } = await axios.post(`${API_URL}/api/sync/pull`, { lastSync }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Atualizar banco local com mudanças da nuvem
    if (data.clients?.length > 0) {
      await db.clients.bulkPut(data.clients);
    }

    // Atualizar lastSync
    localStorage.setItem('lastSync', data.syncedAt);

    // Recarregar clientes
    await store.loadClients();

  } catch (error) {
    console.error('❌ Erro ao sincronizar:', error.message);
    // Não fazer nada - dados já estão no IndexedDB
  }
}

export function stopSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}
