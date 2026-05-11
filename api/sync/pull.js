import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../_middleware/auth.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = verifyToken(req);
    const { lastSync } = req.body;

    const [clients, stages, interactions, contracts] = await Promise.all([
      supabase.from('clients').select('*').eq('office_id', user.office_id).gt('updated_at', lastSync),
      supabase.from('stages').select('*').eq('office_id', user.office_id).gt('updated_at', lastSync),
      supabase.from('interactions').select('*').eq('office_id', user.office_id).gt('updated_at', lastSync),
      supabase.from('contracts').select('*').eq('office_id', user.office_id).gt('updated_at', lastSync)
    ]);

    res.json({
      clients: clients.data || [],
      stages: stages.data || [],
      interactions: interactions.data || [],
      contracts: contracts.data || [],
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || error;
    res.status(status).json({ error: message });
  }
}
