// Test with render.yaml credentials
const url = 'https://clrdkfnelmsgpznvjpqt.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscmRrZm5lbG1zZ3B6bnZqcHF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMjM0NSwiZXhwIjoyMDk0MDg4MzQ1fQ.pQ2BZRSqCNCaYEtPwvc31cTOrrpDNKZouL2RE-5Rmjw';

console.log('🔌 Testando credenciais de render.yaml...\n');

try {
  const response = await fetch(`${url}/rest/v1/usuarios?select=*&limit=1`, {
    method: 'GET',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('📊 Status:', response.status);

  const data = await response.text();

  if (response.ok) {
    console.log('✅ Credenciais de render.yaml funcionam!');
    try {
      const json = JSON.parse(data);
      console.log('   Registros na tabela:', json.length);
    } catch (e) {
      console.log('   Resposta:', data.substring(0, 200));
    }
  } else {
    console.log('❌ Credenciais de render.yaml também retornam erro:');
    console.log(data);
  }
} catch (error) {
  console.error('❌ Erro:', error.message);
}
