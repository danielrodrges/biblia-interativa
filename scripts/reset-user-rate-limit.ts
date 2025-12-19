#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetUserRateLimit(email: string) {
  console.log(`🔍 Procurando usuário: ${email}`);
  
  // Buscar usuário
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Erro ao listar usuários:', listError);
    return;
  }

  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.log('✅ Nenhum usuário encontrado com este email. Pode criar conta normalmente.');
    return;
  }

  console.log(`📧 Usuário encontrado: ${user.id}`);
  console.log(`   Email confirmado: ${user.email_confirmed_at ? 'Sim' : 'Não'}`);
  console.log(`   Criado em: ${user.created_at}`);

  // Deletar usuário para resetar rate limit
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
  
  if (deleteError) {
    console.error('❌ Erro ao deletar usuário:', deleteError);
    return;
  }

  console.log('✅ Usuário deletado com sucesso!');
  console.log('✅ Rate limit resetado. Agora pode criar conta novamente.');
}

const email = process.argv[2] || 'danieldpaula98@hotmail.com';
resetUserRateLimit(email).catch(console.error);
