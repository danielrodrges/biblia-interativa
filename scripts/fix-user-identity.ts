import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function fixUserIdentity() {
  if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não configurada!');
    console.log('📝 Adicione no .env.local:');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('🔍 Buscando usuário: danieldpaula98@gmail.com\n');

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
  console.log('   ID:', user.id);
  console.log('   Email:', user.email);
  console.log('   Identidades atuais:', user.identities?.length || 0);
  console.log();

  // Verificar se já tem identidade email
  const hasEmailIdentity = user.identities?.some((i: any) => i.provider === 'email');

  if (!hasEmailIdentity) {
    console.log('⚠️ Usuário sem identidade vinculada! Isso é um problema.');
    console.log('🔧 Tentando recriar a identidade...\n');

    try {
      // Criar nova identidade email para o usuário
      const identityData = {
        provider: 'email',
        email: user.email,
        email_confirmed: true,
      };

      console.log('📝 Criando identidade email...');
      
      // Usar a API do Supabase para linkar identidade
      const { data: linkData, error: linkError } = await supabase.auth.admin.updateUserById(
        user.id,
        {
          email_confirm: true,
          user_metadata: {
            ...user.user_metadata,
          }
        }
      );

      if (linkError) {
        console.error('❌ Erro ao atualizar usuário:', linkError);
      } else {
        console.log('✅ Usuário atualizado');
      }

      // Verificar novamente
      const { data: { user: updatedUser }, error: getUserError } = await supabase.auth.admin.getUserById(user.id);

      if (getUserError) {
        console.error('❌ Erro ao buscar usuário atualizado:', getUserError);
        return;
      }

      console.log();
      console.log('📊 Status após atualização:');
      console.log('   Identidades:', updatedUser?.identities?.length || 0);
      
      if (updatedUser?.identities && updatedUser.identities.length > 0) {
        updatedUser.identities.forEach((identity: any) => {
          console.log(`   - ${identity.provider}`);
        });
      }

    } catch (error) {
      console.error('❌ Erro ao criar identidade:', error);
    }
  } else {
    console.log('✅ Usuário já tem identidade email vinculada');
  }

  console.log();
  console.log('💡 SOLUÇÃO ALTERNATIVA:');
  console.log('   Como o problema é complexo de resolver programaticamente,');
  console.log('   a melhor solução é deletar e recriar o usuário via Google.');
  console.log();
  console.log('🔧 Execute:');
  console.log('   npx tsx scripts/delete-and-recreate-user.ts');
}

fixUserIdentity().catch(console.error);
