import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('🔍 Diagnóstico do Supabase\n');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NÃO CONFIGURADA');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ ERRO: Variáveis de ambiente não configuradas!');
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
  console.log('1️⃣ Testando conexão com Supabase...');
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('❌ Erro ao conectar:', error.message);
      console.error('Detalhes:', error);
    } else {
      console.log('✅ Conexão OK\n');
    }
  } catch (e: any) {
    console.error('❌ Erro de conexão:', e.message);
  }

  console.log('2️⃣ Verificando tabelas...');
  const tables = ['profiles', 'reading_stats', 'reading_preferences'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(0);
      if (error) {
        console.log(`❌ Tabela '${table}': ${error.message}`);
      } else {
        console.log(`✅ Tabela '${table}' existe`);
      }
    } catch (e: any) {
      console.log(`❌ Tabela '${table}': ${e.message}`);
    }
  }

  console.log('\n3️⃣ Testando signup (simulado)...');
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test_' + Date.now() + '@example.com',
      password: 'test123456',
      options: {
        data: {
          full_name: 'Test User',
        },
      },
    });
    
    if (error) {
      console.error('❌ Erro no signup:', error.message);
      console.error('Código:', error.status);
      console.error('Detalhes:', error);
    } else {
      console.log('✅ Signup funcionou!');
      console.log('User ID:', data.user?.id);
      
      if (data.user) {
        // Tentar criar perfil manualmente
        console.log('\n4️⃣ Tentando criar perfil manualmente...');
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: 'Test User',
        });
        
        if (profileError) {
          console.error('❌ Erro ao criar perfil:', profileError.message);
          console.error('Código:', profileError.code);
          console.error('Detalhes:', profileError.details);
          console.error('Hint:', profileError.hint);
        } else {
          console.log('✅ Perfil criado com sucesso!');
        }

        // Tentar criar stats
        console.log('\n5️⃣ Tentando criar reading_stats...');
        const { error: statsError } = await supabase.from('reading_stats').insert({
          user_id: data.user.id,
        });
        
        if (statsError) {
          console.error('❌ Erro ao criar stats:', statsError.message);
          console.error('Código:', statsError.code);
          console.error('Detalhes:', statsError.details);
        } else {
          console.log('✅ Stats criadas com sucesso!');
        }
      }
    }
  } catch (e: any) {
    console.error('❌ Erro geral:', e.message);
  }

  console.log('\n✅ Diagnóstico completo!\n');
}

diagnose();
