import Stripe from 'stripe';

// Inicializar Stripe com a chave secreta
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeSecretKey) {
  console.warn('⚠️ STRIPE_SECRET_KEY não configurada');
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    })
  : null;

// IDs dos produtos no Stripe (você criará esses produtos no dashboard)
// Substitua pelos IDs reais após criar os produtos no Stripe
export const STRIPE_PLANS = {
  premium_monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_premium_monthly',
  premium_yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || 'price_premium_yearly',
  family_monthly: process.env.STRIPE_PRICE_FAMILY_MONTHLY || 'price_family_monthly',
  family_yearly: process.env.STRIPE_PRICE_FAMILY_YEARLY || 'price_family_yearly',
};

// Mapear plan_id para tipo de plano
export function getPlanType(priceId: string): 'premium' | 'family' {
  if (priceId.includes('family')) {
    return 'family';
  }
  return 'premium';
}

// Verificar se Stripe está configurado
export function isStripeConfigured(): boolean {
  return stripe !== null && !!stripeSecretKey;
}
