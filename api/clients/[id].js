import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../_middleware/auth.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);
    const { id } = req.query;

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          stages(*),
          interactions(*),
          contracts(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.json(data);
    }

    if (req.method === 'PUT') {
      const { data, error } = await supabase
        .from('clients')
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) throw error;
      return res.json(data[0]);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || error;
    res.status(status).json({ error: message });
  }
}
