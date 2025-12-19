import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validação rigorosa das credenciais
const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey.length > 20;

if (!hasValidCredentials) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas ou inválidas.');
  console.warn('📝 Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.warn('🔗 Acesse: Configurações do Projeto → Integrações → Conectar Supabase');
}

// Criar cliente apenas se credenciais válidas existirem
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Função helper para verificar se Supabase está disponível
export function isSupabaseConfigured(): boolean {
  return hasValidCredentials && supabase !== null;
}

// Função para verificar se o usuário está autenticado
export async function getCurrentUser() {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return null;
    }
    
    return session?.user || null;
  } catch (error: any) {
    return null;
  }
}

// Função para fazer logout
export async function signOut() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não está configurado');
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}

// Função para login com email e senha
export async function signInWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
  
  return data;
}

// Função para cadastro com email e senha
export async function signUpWithEmail(email: string, password: string, fullName: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  // Definir URL de redirect baseada no ambiente
  const redirectUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/callback`
    : process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      : 'https://biblia-interativa-wine.vercel.app/auth/callback';

  console.log('🔍 SignUp Debug:');
  console.log('Email:', email);
  console.log('Redirect URL:', redirectUrl);

  // Timeout para evitar espera infinita
  const signupPromise = supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: redirectUrl,
    },
  });

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout ao criar conta. Tente novamente.')), 15000)
  );

  const { data, error } = await Promise.race([signupPromise, timeoutPromise]) as any;
  
  if (error) {
    console.error('❌ Erro ao criar conta:', error);
    throw error;
  }
  
  console.log('✅ Signup response:', {
    user: data.user?.id,
    session: !!data.session,
    identities: data.user?.identities?.length
  });

  // Criar perfil manualmente se o usuário foi criado
  // (mesmo sem sessão, quando confirmação de email é obrigatória)
  if (data.user) {
    try {
      // Somente tentar criar perfil se já tem sessão (auto-confirmed)
      if (data.session) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
        }, { onConflict: 'id' });

        await supabase.from('reading_stats').upsert({
          user_id: data.user.id,
        }, { onConflict: 'user_id' });
        
        console.log('✅ Perfil criado (auto-confirmed)');
      } else {
        console.log('⏳ Email de confirmação enviado. Perfil será criado após confirmação.');
      }
    } catch (profileError) {
      console.warn('⚠️ Erro ao criar perfil (trigger pode criar):', profileError);
    }
  }
  
  return data;
}

// Função para login com Google
export async function signInWithGoogle() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
    },
  });
  
  if (error) {
    console.error('Erro ao fazer login com Google:', error);
    throw error;
  }
  
  return data;
}

// Função para login com Facebook
export async function signInWithFacebook() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
    },
  });
  
  if (error) {
    console.error('Erro ao fazer login com Facebook:', error);
    throw error;
  }
  
  return data;
}

// Função para resetar senha
export async function resetPassword(email: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : undefined,
  });
  
  if (error) {
    console.error('Erro ao resetar senha:', error);
    throw error;
  }
  
  return data;
}

// Função para atualizar senha
export async function updatePassword(newPassword: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) {
    console.error('Erro ao atualizar senha:', error);
    throw error;
  }
  
  return data;
}
