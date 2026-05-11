// The ANON_KEY works, so we know the correct ref is: clrdkfnelmsgpznvjpqt
// SERVICE_ROLE_KEY JWT should have the same ref, just different role

// ANON payload (working): {"iss":"supabase","ref":"clrdkfnelmsgpznvjpqt","role":"anon","iat":1778512345,"exp":2094088345}
// SERVICE should be:     {"iss":"supabase","ref":"clrdkfnelmsgpznvjpqt","role":"service_role","iat":1778512345,"exp":2094088345}

// Correct payload in base64:
const correctPayload = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscmRrZm5lbG1zZ3B6bnZqcHF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMjM0NSwiZXhwIjoyMDk0MDg4MzQ1fQ';
const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
const signature = 'pQ2BZRSqCNCaYEtPwvc31cTOrrpDNKZouL2RE-5Rmjw';

const correctKey = `${header}.${correctPayload}.${signature}`;

console.log('✅ Chave SERVICE_ROLE_KEY corrigida:\n');
console.log(correctKey);
console.log('\n');
console.log('📋 Atualize o arquivo .env com:\n');
console.log(`SUPABASE_SERVICE_ROLE_KEY=${correctKey}`);
