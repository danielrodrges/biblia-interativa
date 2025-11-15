import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Função para verificar se o usuário está autenticado
export async function getCurrentUser() {
  try {
    // Usar getSession() em vez de getUser() para evitar erro quando não há sessão
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      // Silenciosamente retorna null se não houver sessão (comportamento esperado)
      return null;
    }
    
    // Retorna o usuário da sessão, ou null se não houver sessão
    return session?.user || null;
  } catch (error: any) {
    // Silenciosamente retorna null - ausência de sessão é comportamento normal
    return null;
  }
}

// Função para fazer logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}

// Função para login com email e senha
export async function signInWithEmail(email: string, password: string) {
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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
    },
  });
  
  if (error) {
    console.error('Erro ao criar conta:', error);
    throw error;
  }
  
  return data;
}

// Função para login com Google
export async function signInWithGoogle() {
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
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) {
    console.error('Erro ao atualizar senha:', error);
    throw error;
  }
  
  return data;
}
