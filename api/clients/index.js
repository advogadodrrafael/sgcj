import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../_middleware/auth.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          stages(*),
          interactions(*),
          contracts(*)
        `)
        .eq('office_id', user.office_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json(data);
    }

    if (req.method === 'POST') {
      const { name, phone, email, channel, demand } = req.body;

      const { data, error } = await supabase
        .from('clients')
        .insert([{
          name,
          phone,
          email,
          channel,
          demand,
          office_id: user.office_id,
          status: 'lead_novo',
          assigned_to: user.id,
          created_at: new Date().toISOString()
        }])
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
