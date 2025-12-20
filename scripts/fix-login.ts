#!/usr/bin/env tsx

/**
 * Script para diagnosticar e corrigir problemas de login
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não configurada!');
  console.error('Configure no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function diagnoseAndFix() {
  console.log('🔍 Diagnosticando problema de login...\n');

  try {
    // 1. Listar todos os usuários
    console.log('📋 Buscando usuários...');
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError);
      return;
    }

    console.log(`✅ Encontrados ${users.length} usuário(s)\n`);

    // 2. Mostrar detalhes de cada usuário
    for (const user of users) {
      console.log('═══════════════════════════════════════════');
      console.log('👤 Usuário:', user.email);
      console.log('   ID:', user.id);
      console.log('   Provider:', user.app_metadata?.provider || 'N/A');
      console.log('   Confirmado:', user.confirmed_at ? '✅ Sim' : '❌ Não');
      console.log('   Email verificado:', user.email_confirmed_at ? '✅ Sim' : '❌ Não');
      console.log('   Criado em:', new Date(user.created_at!).toLocaleString('pt-BR'));
      console.log('   Último login:', user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'Nunca');
      console.log('═══════════════════════════════════════════\n');

      // 3. Verificar se tem perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.log('   ⚠️ Erro ao buscar perfil:', profileError.message);
      } else if (!profile) {
        console.log('   ⚠️ PERFIL NÃO EXISTE - Criando...');
        
        // Criar perfil
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
          });

        if (createError) {
          console.log('   ❌ Erro ao criar perfil:', createError.message);
        } else {
          console.log('   ✅ Perfil criado com sucesso!');
        }
      } else {
        console.log('   ✅ Perfil existe:', profile.full_name);
      }

      // 4. Verificar reading_stats
      const { data: stats, error: statsError } = await supabase
        .from('reading_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.log('   ⚠️ Erro ao buscar stats:', statsError.message);
      } else if (!stats) {
        console.log('   ⚠️ STATS NÃO EXISTEM - Criando...');
        
        // Criar stats
        const { error: createError } = await supabase
          .from('reading_stats')
          .insert({
            user_id: user.id,
          });

        if (createError) {
          console.log('   ❌ Erro ao criar stats:', createError.message);
        } else {
          console.log('   ✅ Stats criadas com sucesso!');
        }
      } else {
        console.log('   ✅ Stats existem');
      }

      // 5. Se usuário não está confirmado, confirmar automaticamente
      if (!user.email_confirmed_at) {
        console.log('   🔧 Confirmando email automaticamente...');
        
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          user.id,
          { email_confirm: true }
        );

        if (confirmError) {
          console.log('   ❌ Erro ao confirmar:', confirmError.message);
        } else {
          console.log('   ✅ Email confirmado!');
        }
      }

      console.log('');
    }

    // 6. Instruções finais
    console.log('═══════════════════════════════════════════');
    console.log('✅ DIAGNÓSTICO COMPLETO');
    console.log('═══════════════════════════════════════════\n');

    if (users.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado!');
      console.log('📝 Crie uma conta em: https://biblia-interativa-wine.vercel.app/auth/signup\n');
    } else {
      console.log('📝 PARA FAZER LOGIN:\n');
      console.log('1. Acesse: https://biblia-interativa-wine.vercel.app/auth/login');
      console.log('2. Use email/senha OU clique no botão Google');
      console.log('3. Deve redirecionar para /inicio\n');
      
      console.log('🔐 CREDENCIAIS:');
      users.forEach(user => {
        console.log(`   Email: ${user.email}`);
        console.log(`   Senha: (a que você definiu ao criar)\n`);
      });

      console.log('💡 DICA: Se esqueceu a senha, use "Esqueceu a senha?" na tela de login\n');
    }

  } catch (error: any) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

// Executar
diagnoseAndFix();
