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
    const { changes } = req.body;

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
    const status = error.status || 400;
    const message = error.message || error;
    res.status(status).json({ error: message });
  }
}
