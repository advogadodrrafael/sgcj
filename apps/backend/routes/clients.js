import express from 'express';
import { supabase } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET todos os clientes do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        stages(*),
        interactions(*),
        contracts(*)
      `)
      .eq('office_id', req.user.office_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET cliente específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        stages(*),
        interactions(*),
        contracts(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE novo cliente
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, channel, demand } = req.body;

    const { data, error } = await supabase
      .from('clients')
      .insert([{
        name,
        phone,
        email,
        channel,
        demand,
        office_id: req.user.office_id,
        status: 'lead_novo',
        assigned_to: req.user.id,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE cliente
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
