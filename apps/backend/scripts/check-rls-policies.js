const url = 'https://clrdkfnelmsgpznvjpqt.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscmRrZm5lbG1zZ3B6bnZqcHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTIzNDUsImV4cCI6MjA5NDA4ODM0NX0.oaop_8vcBsXga7Ov6oNqpRv5qVTB2YWr_H7Zzid4pnA';

console.log('🔍 Checking RLS Policies on Usuarios Table...\n');

async function checkPolicies() {
  try {
    const response = await fetch(`${url}/rest/v1/usuarios?select=*&limit=0`, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📋 SELECT on usuarios: ${response.status === 200 ? '✅ Allowed' : '❌ Denied'} (Status: ${response.status})`);

    // Try to insert
    const insertResponse = await fetch(`${url}/rest/v1/usuarios`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        nome: 'Test User',
        senha_hash: '$2a$10$test'
      })
    });

    console.log(`📋 INSERT on usuarios: ${insertResponse.status === 201 ? '✅ Allowed' : '❌ Denied'} (Status: ${insertResponse.status})`);

    if (insertResponse.status !== 201) {
      const errorData = await insertResponse.text();
      try {
        const errorJson = JSON.parse(errorData);
        console.log(`   Reason: ${errorJson.message || errorJson.code || errorData}`);
      } catch (e) {
        console.log(`   Response: ${errorData.substring(0, 200)}`);
      }
    } else {
      // Clean up test insert
      await fetch(`${url}/rest/v1/usuarios?email=eq.test@example.com`, {
        method: 'DELETE',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`
        }
      });
      console.log('   ✓ (Test insert cleaned up)');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

await checkPolicies();
