import dotenv from 'dotenv';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔌 Testando API Supabase...\n');
console.log('📋 Credenciais:');
console.log('  URL:', url);
console.log('  Key (primeiros 50 chars):', key?.substring(0, 50));

try {
  const response = await fetch(`${url}/rest/v1/usuarios?select=*&limit=1`, {
    method: 'GET',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('\n📊 Status da requisição:', response.status);

  const data = await response.text();

  if (response.ok) {
    console.log('✅ API está acessível!');
    try {
      const json = JSON.parse(data);
      console.log('   Registros encontrados:', json.length);
    } catch (e) {
      console.log('   Resposta:', data.substring(0, 200));
    }
  } else {
    console.log('❌ API retornou erro:');
    console.log(data);
  }
} catch (error) {
  console.error('❌ Erro ao conectar à API:', error.message);
}
