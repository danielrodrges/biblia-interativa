import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Garante que o usuário tenha tudo configurado:
 * - Perfil criado
 * - Estatísticas de leitura inicializadas
 * - Assinatura gratuita ativa
 */
export async function ensureUserSetup(userId: string, email: string, fullName?: string) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Verificar/Criar Perfil
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!existingProfile) {
      console.log('📝 Criando perfil para:', email);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: fullName || email.split('@')[0],
          email: email,
        });

      if (profileError) {
        console.error('❌ Erro ao criar perfil:', profileError);
      } else {
        console.log('✅ Perfil criado com sucesso');
      }
    }

    // 2. Verificar/Criar Estatísticas de Leitura
    const { data: existingStats } = await supabase
      .from('reading_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existingStats) {
      console.log('📊 Criando estatísticas para:', email);
      const { error: statsError } = await supabase
        .from('reading_stats')
        .insert({
          user_id: userId,
          total_chapters_read: 0,
          total_verses_read: 0,
          current_streak_days: 0,
          longest_streak_days: 0,
          total_reading_time_minutes: 0,
        });

      if (statsError) {
        console.error('❌ Erro ao criar estatísticas:', statsError);
      } else {
        console.log('✅ Estatísticas criadas com sucesso');
      }
    }

    // 3. Verificar/Criar Assinatura Gratuita
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existingSubscription) {
      console.log('💳 Criando assinatura gratuita para:', email);
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_type: 'free',
          status: 'active',
          stripe_customer_id: null,
          stripe_subscription_id: null,
          current_period_start: new Date().toISOString(),
          current_period_end: null,
          cancel_at_period_end: false,
        });

      if (subscriptionError) {
        console.error('❌ Erro ao criar assinatura:', subscriptionError);
      } else {
        console.log('✅ Assinatura gratuita criada com sucesso');
      }
    } else {
      console.log('✅ Assinatura já existe:', existingSubscription.plan_type);
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao configurar usuário:', error);
    return { success: false, error };
  }
}

/**
 * Verifica se o usuário tem acesso (qualquer plano ativo)
 */
export async function hasActiveAccess(userId: string): Promise<boolean> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Se não tem subscription, cria uma gratuita
  if (!subscription) {
    const { data: user } = await supabase.auth.admin.getUserById(userId);
    if (user.user?.email) {
      await ensureUserSetup(userId, user.user.email);
    }
    return true; // Permite acesso enquanto cria
  }

  // Qualquer assinatura ativa dá acesso (free ou premium)
  return subscription.status === 'active' || subscription.status === 'trialing';
}
