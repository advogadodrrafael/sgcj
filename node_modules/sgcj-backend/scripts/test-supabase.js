import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  console.log('🔍 Diagnóstico de Conexão Supabase\n');
  console.log('📋 Variáveis de Ambiente Carregadas:');
  console.log('  VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Carregada' : '❌ NÃO Carregada');
  console.log('  SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Carregada' : '❌ NÃO Carregada');

  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('\n❌ Variáveis de ambiente não estão configuradas!');
    process.exit(1);
  }

  console.log('\n🔗 Criando cliente Supabase...');
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
  console.log('✅ Cliente criado com sucesso\n');

  try {
    console.log('📊 Testando consulta simples...');
    const { count, error } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Erro na consulta:', error);
      process.exit(1);
    } else {
      console.log('✅ Consulta bem-sucedida!');
      console.log('   Registros na tabela usuarios:', count);
    }

    console.log('\n✨ Diagnóstico completo - Supabase funcionando corretamente!');
  } catch (err) {
    console.error('❌ Erro durante teste:', err.message);
    process.exit(1);
  }
}

test().finally(() => process.exit(0));
