import express from 'express';
import { supabase } from '../server.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário no Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Verificar senha
    const passwordMatch = await bcryptjs.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register (apenas admin pode)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    const passwordHash = await bcryptjs.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password_hash: passwordHash, role }])
      .select();

    if (error) throw error;
    res.json({ user: data[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
