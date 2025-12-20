import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function deleteAndRecreate() {
  if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não configurada!');
    console.log('📝 Adicione no .env.local a service role key do Supabase');
    rl.close();
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('⚠️  ATENÇÃO: Este script vai DELETAR o usuário atual\n');
  console.log('📋 Usuário a ser deletado: danieldpaula98@gmail.com');
  console.log('🔄 Após deletar, você precisará criar a conta via Google OAuth\n');

  const confirm = await question('Digite "CONFIRMAR" para prosseguir: ');

  if (confirm !== 'CONFIRMAR') {
    console.log('❌ Operação cancelada');
    rl.close();
    return;
  }

  console.log('\n🔍 Buscando usuário...\n');

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Erro ao listar usuários:', listError);
    rl.close();
    return;
  }

  const user = users.find(u => u.email === 'danieldpaula98@gmail.com');

  if (!user) {
    console.error('❌ Usuário não encontrado!');
    rl.close();
    return;
  }

  console.log('✅ Usuário encontrado:');
  console.log('   ID:', user.id);
  console.log('   Email:', user.email);
  console.log();

  // Deletar dados relacionados
  console.log('🗑️  Deletando dados relacionados...\n');

  // Deletar assinatura
  const { error: subError } = await supabase
    .from('user_subscriptions')
    .delete()
    .eq('user_id', user.id);

  if (subError) {
    console.warn('⚠️  Erro ao deletar assinatura:', subError.message);
  } else {
    console.log('✅ Assinatura deletada');
  }

  // Deletar stats
  const { error: statsError } = await supabase
    .from('reading_stats')
    .delete()
    .eq('user_id', user.id);

  if (statsError) {
    console.warn('⚠️  Erro ao deletar stats:', statsError.message);
  } else {
    console.log('✅ Stats deletadas');
  }

  // Deletar perfil
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id);

  if (profileError) {
    console.warn('⚠️  Erro ao deletar perfil:', profileError.message);
  } else {
    console.log('✅ Perfil deletado');
  }

  // Deletar usuário do auth
  console.log('\n🗑️  Deletando usuário do sistema de autenticação...');

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error('❌ Erro ao deletar usuário:', deleteError);
    rl.close();
    return;
  }

  console.log('✅ Usuário deletado com sucesso!\n');
  console.log('═══════════════════════════════════════════');
  console.log('🎯 PRÓXIMOS PASSOS:');
  console.log('═══════════════════════════════════════════');
  console.log();
  console.log('1️⃣  Acesse: https://biblia-interativa-wine.vercel.app/auth/login');
  console.log('2️⃣  Clique em "Continuar com Google"');
  console.log('3️⃣  Faça login com: danieldpaula98@gmail.com');
  console.log('4️⃣  Você será redirecionado para /inicio automaticamente');
  console.log();
  console.log('✅ A conta será recriada automaticamente via Google OAuth');
  console.log('✅ Perfil, stats e assinatura gratuita serão criados automaticamente');
  console.log();

  rl.close();
}

deleteAndRecreate().catch((error) => {
  console.error('❌ Erro:', error);
  rl.close();
});
