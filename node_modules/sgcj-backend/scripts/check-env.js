import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
console.log('📁 Arquivo .env localizado em:', envPath);
console.log('✅ Arquivo existe:', fs.existsSync(envPath) ? 'Sim' : 'Não');

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n🔑 Credenciais Carregadas:');
console.log('  URL:', url);
console.log('  URL é válida (começa com https://):', url?.startsWith('https://') ? '✅ Sim' : '❌ Não');
console.log('  Key (primeiros 50 chars):', key?.substring(0, 50) + '...');
console.log('  Key length:', key?.length);
console.log('  Key é JWT (começa com eyJ):', key?.startsWith('eyJ') ? '✅ Sim' : '❌ Não');
