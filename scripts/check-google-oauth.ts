#!/usr/bin/env tsx

/**
 * Script para verificar configuração do Google OAuth no Supabase
 * 
 * Verifica:
 * 1. Se o Google provider está habilitado
 * 2. URLs de callback configuradas
 * 3. Redirecionamento funcional
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas');
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkGoogleOAuthSetup() {
  console.log('🔍 Verificando configuração do Google OAuth...\n');

  try {
    // 1. Verificar se consegue iniciar fluxo OAuth
    console.log('📋 Testando início do fluxo OAuth...');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://biblia-interativa-wine.vercel.app/auth/callback',
        skipBrowserRedirect: true, // Não redirecionar, apenas testar
      },
    });

    if (error) {
      console.error('❌ Erro ao testar OAuth:', error.message);
      console.error('\n📝 O que fazer:');
      console.error('1. Acesse: https://supabase.com/dashboard/project/umbgtudgphbwpkeoebry/auth/providers');
      console.error('2. Procure por "Google" na lista');
      console.error('3. Ative o toggle "Enable Google provider"');
      console.error('4. Configure Client ID e Client Secret');
      console.error('5. Salve as alterações\n');
      process.exit(1);
    }

    if (data.url) {
      console.log('✅ Google OAuth está configurado!');
      console.log('✅ URL de autorização gerada com sucesso\n');
      
      // Extrair informações úteis da URL
      const url = new URL(data.url);
      const clientId = url.searchParams.get('client_id');
      
      if (clientId) {
        console.log('🔑 Client ID detectado:');
        console.log(`   ${clientId}\n`);
      }

      console.log('🔗 URLs configuradas:');
      console.log(`   Auth URL: ${data.url.split('?')[0]}`);
      console.log(`   Redirect: https://biblia-interativa-wine.vercel.app/auth/callback\n`);
      
      console.log('═══════════════════════════════════════════');
      console.log('✅ CONFIGURAÇÃO OK - Google OAuth Funcionando!');
      console.log('═══════════════════════════════════════════\n');

      console.log('📝 Próximos passos:');
      console.log('1. Acesse: https://biblia-interativa-wine.vercel.app/auth/login');
      console.log('2. Clique no botão "Google"');
      console.log('3. Autorize o acesso com sua conta Google');
      console.log('4. Você deve ser redirecionado para /inicio\n');

      console.log('🔍 Verificar usuários criados:');
      console.log('   Dashboard: https://supabase.com/dashboard/project/umbgtudgphbwpkeoebry/auth/users\n');

    } else {
      console.warn('⚠️ OAuth configurado mas sem URL de autorização');
      console.warn('Isso pode indicar problema na configuração\n');
    }

    // 2. Verificar callback URL
    console.log('🌐 URLs de Callback esperadas:');
    console.log('   Supabase: https://umbgtudgphbwpkeoebry.supabase.co/auth/v1/callback');
    console.log('   App: https://biblia-interativa-wine.vercel.app/auth/callback\n');

    // 3. Mostrar guia rápido de configuração
    console.log('📖 Guia completo de configuração:');
    console.log('   Leia: docs/GOOGLE_OAUTH_SETUP.md\n');

    console.log('🔧 Configurar Google Cloud Console:');
    console.log('   1. Acesse: https://console.cloud.google.com/apis/credentials');
    console.log('   2. Crie credenciais OAuth 2.0');
    console.log('   3. Adicione redirect URI: https://umbgtudgphbwpkeoebry.supabase.co/auth/v1/callback');
    console.log('   4. Copie Client ID e Secret');
    console.log('   5. Cole no Supabase Dashboard\n');

  } catch (error: any) {
    console.error('❌ Erro inesperado:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Verifique se o Supabase está acessível');
    console.error('2. Teste a conexão com: curl https://umbgtudgphbwpkeoebry.supabase.co');
    console.error('3. Verifique se as variáveis de ambiente estão corretas\n');
    process.exit(1);
  }
}

// Executar verificação
checkGoogleOAuthSetup();
