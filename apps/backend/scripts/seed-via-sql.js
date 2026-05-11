import bcrypt from 'bcryptjs';

const url = 'https://clrdkfnelmsgpznvjpqt.supabase.co';
// Use ANON_KEY which we know works
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscmRrZm5lbG1zZ3B6bnZqcHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTIzNDUsImV4cCI6MjA5NDA4ODM0NX0.oaop_8vcBsXga7Ov6oNqpRv5qVTB2YWr_H7Zzid4pnA';

const users = [
  { email: 'rafael@fernandes.com', name: 'Rafael Fernandes', password: '12345678' },
  { email: 'erica@fernandes.com', name: 'Érica Fernandes', password: '12345678' },
  { email: 'luan@fernandes.com', name: 'Luan Silva', password: '12345678' },
  { email: 'taiza@fernandes.com', name: 'Taiza Costa', password: '12345678' },
  { email: 'dax@fernandes.com', name: 'Dax Santos', password: '12345678' },
  { email: 'andre@fernandes.com', name: 'André Pereira', password: '12345678' },
  { email: 'juliana@fernandes.com', name: 'Juliana Oliveira', password: '12345678' }
];

console.log('🌱 Inserindo usuários via REST API com ANON_KEY...\n');

let successCount = 0;
let errorCount = 0;

for (const user of users) {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  try {
    const response = await fetch(`${url}/rest/v1/usuarios`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email: user.email,
        nome: user.name,
        senha_hash: hashedPassword
      })
    });

    if (response.ok) {
      console.log(`✅ Usuário criado: ${user.name} (${user.email})`);
      successCount++;
    } else {
      const errorData = await response.text();
      if (errorData.includes('23505')) {
        console.log(`⏭️  Usuário ${user.email} já existe, pulando...`);
      } else {
        console.error(`❌ Erro ao criar ${user.email}:`, errorData);
        errorCount++;
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao criar ${user.email}:`, error.message);
    errorCount++;
  }
}

console.log(`\n✨ População completa! (${successCount} sucesso, ${errorCount} erro)`);
