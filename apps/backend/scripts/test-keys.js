const url = 'https://clrdkfnelmsgpznvjpqt.supabase.co';

// Hardcoded keys from render.yaml
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscmRrZm5lbG1zZ3B6bnZqcHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTIzNDUsImV4cCI6MjA5NDA4ODM0NX0.oaop_8vcBsXga7Ov6oNqpRv5qVTB2YWr_H7Zzid4pnA';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscmRrZm5lbG1zZ3B6bnZqcHV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMjM0NSwiZXhwIjoyMDk0MDg4MzQ1fQ.pQ2BZRSqCNCaYEtPwvc31cTOrrpDNKZouL2RE-5Rmjw';

console.log('🔑 Testando Chaves Individuais\n');

async function testKey(name, key) {
  try {
    const response = await fetch(`${url}/rest/v1/usuarios?select=*&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`${name}: ${response.status === 200 ? '✅ Válida' : '❌ Inválida'} (Status: ${response.status})`);

    if (response.status !== 200) {
      const data = await response.text();
      const json = JSON.parse(data);
      console.log(`  → ${json.message}`);
    }
  } catch (error) {
    console.error(`${name}: ❌ Erro -`, error.message);
  }
}

await testKey('ANON_KEY', anonKey);
await testKey('SERVICE_ROLE_KEY', serviceKey);
