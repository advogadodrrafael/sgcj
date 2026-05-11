import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  try {
    console.log('🌱 Iniciando população do banco de dados...');

    const users = [
      { email: 'rafael@fernandes.com', name: 'Rafael Fernandes', password: '12345678' },
      { email: 'erica@fernandes.com', name: 'Érica Fernandes', password: '12345678' },
      { email: 'luan@fernandes.com', name: 'Luan Silva', password: '12345678' },
      { email: 'taiza@fernandes.com', name: 'Taiza Costa', password: '12345678' },
      { email: 'dax@fernandes.com', name: 'Dax Santos', password: '12345678' },
      { email: 'andre@fernandes.com', name: 'André Pereira', password: '12345678' },
      { email: 'juliana@fernandes.com', name: 'Juliana Oliveira', password: '12345678' }
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const { data, error } = await supabase
        .from('usuarios')
        .insert({
          email: user.email,
          nome: user.name,
          senha_hash: hashedPassword
        })
        .select();

      if (error) {
        if (error.code === '23505') {
          console.log(`⏭️  Usuário ${user.email} já existe, pulando...`);
        } else {
          console.error(`❌ Erro ao criar usuário ${user.email}:`, error.message);
        }
      } else {
        console.log(`✅ Usuário criado: ${user.name} (${user.email})`);
      }
    }

    console.log('✨ População concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Falha na população:', error.message);
    process.exit(1);
  }
}

seed();
