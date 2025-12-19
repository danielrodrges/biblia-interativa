import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface UserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_type: 'free' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Obtém a assinatura do usuário
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Erro ao buscar assinatura:', error);
    return null;
  }

  return data as UserSubscription;
}

/**
 * Verifica se o usuário tem um plano premium ativo
 */
export async function hasPremiumAccess(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) return false;
  
  // Verificar se é premium e está ativo
  return (
    subscription.plan_type === 'premium' &&
    (subscription.status === 'active' || subscription.status === 'trialing')
  );
}

/**
 * Verifica se o usuário tem acesso a um recurso específico
 */
export async function hasFeatureAccess(
  userId: string,
  feature: Feature
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    // Sem assinatura = apenas recursos free
    return freeFeatures.includes(feature);
  }

  // Usuário free
  if (subscription.plan_type === 'free') {
    return freeFeatures.includes(feature);
  }

  // Usuário premium com assinatura ativa
  if (
    subscription.plan_type === 'premium' &&
    (subscription.status === 'active' || subscription.status === 'trialing')
  ) {
    return premiumFeatures.includes(feature);
  }

  // Assinatura cancelada ou vencida = apenas recursos free
  return freeFeatures.includes(feature);
}

/**
 * Obtém informações sobre o plano do usuário
 */
export async function getUserPlanInfo(userId: string): Promise<{
  planType: 'free' | 'premium';
  isPremium: boolean;
  isActive: boolean;
  status: string;
  periodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return {
      planType: 'free',
      isPremium: false,
      isActive: true,
      status: 'active',
      periodEnd: null,
      cancelAtPeriodEnd: false,
    };
  }

  const isPremium = subscription.plan_type === 'premium';
  const isActive = subscription.status === 'active' || subscription.status === 'trialing';

  return {
    planType: subscription.plan_type,
    isPremium,
    isActive,
    status: subscription.status,
    periodEnd: subscription.current_period_end ? new Date(subscription.current_period_end) : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };
}

/**
 * Cria assinatura gratuita para novo usuário
 */
export async function createFreeSubscription(userId: string): Promise<boolean> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      plan_type: 'free',
      status: 'active',
    });

  if (error) {
    console.error('Erro ao criar assinatura free:', error);
    return false;
  }

  return true;
}

// Tipos de recursos disponíveis
export type Feature =
  | 'basic_reading'
  | 'all_versions'
  | 'single_audio_language'
  | 'multiple_audio_languages'
  | 'real_time_translation'
  | 'offline_mode'
  | 'no_ads'
  | 'interactive_exercises'
  | 'custom_reading_plans'
  | 'priority_support'
  | 'basic_bookmarks'
  | 'advanced_bookmarks';

// Recursos disponíveis no plano gratuito
const freeFeatures: Feature[] = [
  'basic_reading',
  'all_versions',
  'single_audio_language',
  'basic_bookmarks',
];

// Recursos disponíveis no plano premium
const premiumFeatures: Feature[] = [
  ...freeFeatures,
  'multiple_audio_languages',
  'real_time_translation',
  'offline_mode',
  'no_ads',
  'interactive_exercises',
  'custom_reading_plans',
  'priority_support',
  'advanced_bookmarks',
];

/**
 * Obtém lista de recursos por plano
 */
export function getPlanFeatures(planType: 'free' | 'premium'): Feature[] {
  return planType === 'premium' ? premiumFeatures : freeFeatures;
}

/**
 * Verifica se assinatura está próxima de vencer
 */
export function isSubscriptionExpiringSoon(subscription: UserSubscription | null): boolean {
  if (!subscription || !subscription.current_period_end) return false;

  const daysUntilExpiry = Math.floor(
    (new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
}

/**
 * Formata data de término da assinatura
 */
export function formatSubscriptionPeriodEnd(date: Date | null): string {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
