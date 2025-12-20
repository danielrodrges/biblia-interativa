import { config } from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis de ambiente do .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { ensureUserSetup } from '../src/lib/ensure-user-setup';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function setupExistingUser() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🔍 Buscando usuário: danieldpaula98@gmail.com\n');

  // Buscar o usuário específico
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Erro ao listar usuários:', listError);
    return;
  }

  const user = users.find(u => u.email === 'danieldpaula98@gmail.com');

  if (!user) {
    console.error('❌ Usuário não encontrado!');
    return;
  }

  console.log('✅ Usuário encontrado:');
  console.log('  ID:', user.id);
  console.log('  Email:', user.email);
  console.log('  Provider:', user.app_metadata?.provider);
  console.log('  Confirmado:', user.email_confirmed_at ? '✅' : '❌');
  console.log();

  // Verificar status atual
  console.log('📊 Verificando status atual...\n');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: stats } = await supabase
    .from('reading_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  console.log('Status antes:');
  console.log('  Perfil:', profile ? '✅ Existe' : '❌ Não existe');
  console.log('  Stats:', stats ? '✅ Existem' : '❌ Não existem');
  console.log('  Assinatura:', subscription ? `✅ ${subscription.plan_type}` : '❌ Não existe');
  console.log();

  // Aplicar setup completo
  console.log('🔧 Aplicando setup completo...\n');
  
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
  await ensureUserSetup(user.id, user.email!, fullName);

  // Verificar novamente
  console.log('\n📊 Verificando status após setup...\n');

  const { data: newProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: newStats } = await supabase
    .from('reading_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: newSubscription } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  console.log('Status depois:');
  console.log('  Perfil:', newProfile ? `✅ ${newProfile.full_name}` : '❌ Não existe');
  console.log('  Stats:', newStats ? '✅ Existem' : '❌ Não existem');
  console.log('  Assinatura:', newSubscription ? `✅ ${newSubscription.plan_type} (${newSubscription.status})` : '❌ Não existe');
  console.log();

  console.log('🎉 Setup concluído! O usuário agora tem:');
  console.log('   ✅ Perfil completo');
  console.log('   ✅ Estatísticas de leitura');
  console.log('   ✅ Assinatura gratuita ativa');
  console.log();
  console.log('🚀 Agora tente fazer login novamente!');
}

setupExistingUser().catch(console.error);
