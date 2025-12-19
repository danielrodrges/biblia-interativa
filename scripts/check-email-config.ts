import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkEmailConfig() {
  console.log('🔍 Verificando configuração de email do Supabase\n');

  // Tentar criar usuário de teste
  const testEmail = `test_${Date.now()}@gmail.com`;
  
  console.log('1️⃣ Tentando criar usuário:', testEmail);
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'test123456',
    options: {
      data: {
        full_name: 'Test User',
      },
      emailRedirectTo: 'http://localhost:3000/auth/callback',
    },
  });

  if (error) {
    console.error('❌ Erro:', error.message);
    return;
  }

  console.log('\n2️⃣ Resultado do signup:');
  console.log('User ID:', data.user?.id);
  console.log('Email:', data.user?.email);
  console.log('Email confirmado?', data.user?.email_confirmed_at ? 'SIM ✅' : 'NÃO ❌');
  console.log('Tem sessão?', data.session ? 'SIM ✅ (auto-confirmado)' : 'NÃO ❌ (precisa confirmar email)');
  console.log('Identidades:', data.user?.identities?.length || 0);

  if (!data.session && !data.user?.email_confirmed_at) {
    console.log('\n⚠️  ATENÇÃO:');
    console.log('O usuário foi criado mas não tem sessão.');
    console.log('Isso significa que a CONFIRMAÇÃO DE EMAIL está ATIVADA.');
    console.log('Um email DEVERIA ter sido enviado para:', testEmail);
    console.log('\n🔍 Verifique no Supabase:');
    console.log('1. Logs → Auth Logs (procure por este usuário)');
    console.log('2. Authentication → Users (veja se o usuário foi criado)');
    console.log('3. Authentication → Providers → Email (veja se "Confirm email" está ativo)');
  } else {
    console.log('\n✅ Confirmação de email está DESATIVADA.');
    console.log('Usuário é criado e logado automaticamente.');
  }

  // Verificar se o usuário aparece na lista
  console.log('\n3️⃣ Aguardando 2 segundos...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n4️⃣ Verificando se usuário foi criado no banco:');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user!.id)
    .single();

  if (profileError) {
    console.log('❌ Perfil não encontrado:', profileError.message);
    console.log('Isso é NORMAL se a confirmação de email está ativada.');
    console.log('O perfil só será criado APÓS o usuário confirmar o email.');
  } else {
    console.log('✅ Perfil encontrado:', profile);
  }

  console.log('\n5️⃣ CONCLUSÃO:');
  console.log('Se você NÃO recebeu o email, pode ser:');
  console.log('- Rate limit atingido (4 emails/hora no free tier)');
  console.log('- Email indo para spam');
  console.log('- SMTP do Supabase não configurado ou com problemas');
  console.log('\n📋 AÇÃO RECOMENDADA:');
  console.log('1. Espere 1 hora se testou muitas vezes');
  console.log('2. Verifique spam/lixo eletrônico');
  console.log('3. Configure SMTP próprio no Supabase');
  console.log('4. OU desative "Confirm email" para testes');
}

checkEmailConfig();
