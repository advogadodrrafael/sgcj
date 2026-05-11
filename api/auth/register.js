import { createClient } from '@supabase/supabase-js';
import bcryptjs from 'bcryptjs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password, role = 'user' } = req.body;
    const passwordHash = await bcryptjs.hash(password, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nome: name, email, senha_hash: passwordHash }])
      .select();

    if (error) throw error;
    res.json({ user: data[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
