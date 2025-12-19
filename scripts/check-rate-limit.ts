#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup() {
  console.log('🧪 Testando rate limit...\n');
  
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Test123456!';
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) {
      if (error.message.includes('rate limit')) {
        console.log('❌ Rate limit ainda ativo.');
        console.log('⏳ Aguarde mais alguns minutos antes de tentar criar conta.\n');
        console.log('💡 Dica: O rate limit geralmente dura 60 minutos.');
        return false;
      } else {
        console.log('⚠️  Outro erro:', error.message);
        return false;
      }
    }
    
    // Limpar usuário de teste
    if (data.user) {
      console.log('✅ Rate limit liberado! Você pode criar conta agora.\n');
      
      // Tentar deletar o usuário de teste
      await supabase.auth.admin.deleteUser(data.user.id);
    }
    
    return true;
  } catch (err: any) {
    console.log('❌ Erro ao testar:', err.message);
    return false;
  }
}

testSignup().catch(console.error);
