import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLastSignup() {
  console.log('🔍 Verificando último signup...\n');

  // Procurar pelo email
  const { data: users, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Erro ao listar usuários:', error.message);
    console.log('\n⚠️  Isso é normal - o client não tem permissão para listar usuários.');
    console.log('Você precisa verificar manualmente no Supabase Dashboard.');
    return;
  }

  console.log('Usuários encontrados:', users);
}

async function checkEmailVerified() {
  console.log('📧 Verificando se o email danieldpaula98@hotmail.com precisa estar verificado no AWS SES...\n');

  console.log('⚠️  IMPORTANTE:');
  console.log('Se o AWS SES está em SANDBOX mode, você só pode enviar emails para:');
  console.log('1. Emails verificados no AWS SES');
  console.log('2. Domínios verificados no AWS SES');
  console.log('\n🔍 Verificar no AWS:');
  console.log('1. Acesse: https://console.aws.amazon.com/ses/');
  console.log('2. Vá em "Verified identities"');
  console.log('3. Procure por: danieldpaula98@hotmail.com');
  console.log('4. Status deve estar: "Verified" ✅');
  console.log('\n❌ Se NÃO estiver verificado:');
  console.log('1. Clique em "Create identity"');
  console.log('2. Selecione "Email address"');
  console.log('3. Digite: danieldpaula98@hotmail.com');
  console.log('4. Clique em "Create identity"');
  console.log('5. Vá no email e clique no link de verificação da AWS');
  console.log('6. Aguarde status ficar "Verified"');
  console.log('7. Tente criar conta novamente no app');
}

console.log('═'.repeat(60));
console.log('🔍 DIAGNÓSTICO - Email não chegou');
console.log('═'.repeat(60));
console.log('\n');

checkEmailVerified();

console.log('\n\n📋 PRÓXIMOS PASSOS:\n');
console.log('1. Verifique se danieldpaula98@hotmail.com está verificado no AWS SES');
console.log('2. Verifique os logs do Supabase:');
console.log('   https://app.supabase.com/project/umbgtudgphbwpkeoebry/logs/auth-logs');
console.log('3. Verifique se o SMTP está configurado:');
console.log('   https://app.supabase.com/project/umbgtudgphbwpkeoebry/settings/auth');
console.log('4. Procure por erros como "Email address not verified" nos logs');
console.log('\n');
