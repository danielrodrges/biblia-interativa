import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function testFullLoginFlow() {
  console.log('🧪 TESTANDO FLUXO COMPLETO DE LOGIN\n');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Criar usuário de teste
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  console.log('1️⃣ Criando usuário de teste...');
  console.log('   Email:', testEmail);

  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Usuário Teste',
      },
    },
  });

  if (signupError) {
    console.error('❌ Erro ao criar usuário:', signupError);
    return;
  }

  console.log('✅ Usuário criado:', signupData.user?.id);
  console.log('   Tem sessão:', !!signupData.session);
  console.log('   Email confirmado:', signupData.user?.email_confirmed_at ? 'Sim' : 'Não');
  console.log();

  // Tentar fazer login
  console.log('2️⃣ Fazendo login...');

  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (loginError) {
    console.error('❌ Erro ao fazer login:', loginError);
    return;
  }

  console.log('✅ Login bem-sucedido!');
  console.log('   User ID:', loginData.user?.id);
  console.log('   Tem sessão:', !!loginData.session);
  console.log('   Session token:', loginData.session?.access_token?.substring(0, 20) + '...');
  console.log();

  // Verificar sessão
  console.log('3️⃣ Verificando sessão persistida...');

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('❌ Erro ao obter sessão:', sessionError);
    return;
  }

  if (session) {
    console.log('✅ Sessão encontrada!');
    console.log('   User ID:', session.user?.id);
    console.log('   Expira em:', new Date(session.expires_at! * 1000).toLocaleString('pt-BR'));
  } else {
    console.log('❌ Sessão NÃO encontrada!');
  }
  console.log();

  // Verificar perfil
  console.log('4️⃣ Verificando dados do usuário...');

  const userId = loginData.user?.id;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: stats } = await supabase
    .from('reading_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  console.log('   Perfil:', profile ? '✅ Existe' : '❌ Não existe');
  console.log('   Stats:', stats ? '✅ Existem' : '❌ Não existem');
  console.log('   Assinatura:', subscription ? `✅ ${subscription.plan_type}` : '❌ Não existe');
  console.log();

  // Limpar usuário de teste
  console.log('5️⃣ Limpando usuário de teste...');
  await supabase.auth.signOut();
  console.log('✅ Logout realizado');
  console.log();

  console.log('═══════════════════════════════════════════');
  console.log('📋 DIAGNÓSTICO:');
  console.log('═══════════════════════════════════════════');

  if (signupData.session && loginData.session && session) {
    console.log('✅ TUDO OK! Fluxo de autenticação funcionando perfeitamente');
    console.log('   • Signup cria sessão');
    console.log('   • Login cria sessão');
    console.log('   • Sessão persiste');
  } else {
    console.log('❌ PROBLEMA ENCONTRADO:');
    if (!signupData.session) console.log('   • Signup não cria sessão (confirmação de email necessária?)');
    if (!loginData.session) console.log('   • Login não cria sessão');
    if (!session) console.log('   • Sessão não persiste');
  }
}

testFullLoginFlow().catch(console.error);
