import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function checkGoogleLogin() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🔍 Verificando configuração do Google OAuth\n');

  // Buscar usuário
  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Erro ao listar usuários:', error);
    return;
  }

  const user = users.find(u => u.email === 'danieldpaula98@gmail.com');

  if (!user) {
    console.error('❌ Usuário não encontrado!');
    return;
  }

  console.log('👤 Usuário encontrado:');
  console.log('   Email:', user.email);
  console.log('   ID:', user.id);
  console.log('   Provider:', user.app_metadata?.provider);
  console.log('   Providers disponíveis:', user.app_metadata?.providers);
  console.log();

  console.log('🔗 Identidades vinculadas:');
  if (user.identities && user.identities.length > 0) {
    user.identities.forEach((identity: any) => {
      console.log(`   - ${identity.provider} (${identity.identity_data?.email || 'sem email'})`);
    });
  } else {
    console.log('   ⚠️ Nenhuma identidade vinculada');
  }
  console.log();

  console.log('📋 DIAGNÓSTICO:');
  console.log();

  const hasEmailProvider = user.identities?.some((i: any) => i.provider === 'email');
  const hasGoogleProvider = user.identities?.some((i: any) => i.provider === 'google');

  if (hasEmailProvider && !hasGoogleProvider) {
    console.log('⚠️ PROBLEMA IDENTIFICADO:');
    console.log('   O usuário foi criado com provider "email"');
    console.log('   Google OAuth está tentando criar um novo usuário');
    console.log('   Supabase não permite mesmo email com providers diferentes');
    console.log();
    console.log('💡 SOLUÇÕES:');
    console.log();
    console.log('1️⃣  OPÇÃO 1 - Adicionar Google ao usuário existente:');
    console.log('   • Deletar usuário atual');
    console.log('   • Criar nova conta via Google OAuth');
    console.log('   • Isso criará o usuário com provider "google"');
    console.log();
    console.log('2️⃣  OPÇÃO 2 - Usar apenas email/senha:');
    console.log('   • Continuar usando login tradicional');
    console.log('   • Remover botão de Google da interface');
    console.log();
    console.log('3️⃣  OPÇÃO 3 - Habilitar account linking no Supabase:');
    console.log('   • Dashboard → Authentication → Providers');
    console.log('   • Habilitar "Allow multiple accounts with same email"');
    console.log('   • ⚠️ Não recomendado por segurança');
  } else if (hasGoogleProvider) {
    console.log('✅ Usuário tem Google OAuth configurado');
    console.log('   Login pelo Google deve funcionar normalmente');
  }

  console.log();
  console.log('🔧 Para deletar e recriar:');
  console.log(`   npx tsx scripts/delete-and-recreate-user.ts`);
}

checkGoogleLogin().catch(console.error);
