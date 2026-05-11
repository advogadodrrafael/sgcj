import express from 'express';
import { supabase } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Sincronizar mudanças locais para nuvem
router.post('/push', authenticateToken, async (req, res) => {
  try {
    const { changes } = req.body; // Array com as mudanças locais

    const results = {};

    for (const change of changes) {
      const { type, table, data, id } = change;

      try {
        if (type === 'create') {
          const { data: created, error } = await supabase
            .from(table)
            .insert([data])
            .select();
          if (error) throw error;
          results[id] = { success: true, data: created[0] };
        } else if (type === 'update') {
          const { data: updated, error } = await supabase
            .from(table)
            .update(data)
            .eq('id', id)
            .select();
          if (error) throw error;
          results[id] = { success: true, data: updated[0] };
        } else if (type === 'delete') {
          const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);
          if (error) throw error;
          results[id] = { success: true };
        }
      } catch (error) {
        results[id] = { success: false, error: error.message };
      }
    }

    res.json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Puxar mudanças da nuvem para local
router.post('/pull', authenticateToken, async (req, res) => {
  try {
    const { lastSync } = req.body;

    const [clients, stages, interactions, contracts] = await Promise.all([
      supabase.from('clients').select('*').eq('office_id', req.user.office_id).gt('updated_at', lastSync),
      supabase.from('stages').select('*').eq('office_id', req.user.office_id).gt('updated_at', lastSync),
      supabase.from('interactions').select('*').eq('office_id', req.user.office_id).gt('updated_at', lastSync),
      supabase.from('contracts').select('*').eq('office_id', req.user.office_id).gt('updated_at', lastSync)
    ]);

    res.json({
      clients: clients.data || [],
      stages: stages.data || [],
      interactions: interactions.data || [],
      contracts: contracts.data || [],
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
