#!/usr/bin/env tsx

/**
 * Script para testar o fluxo completo de checkout do Stripe
 * 
 * Testa:
 * 1. Criação de customer
 * 2. Criação de checkout session
 * 3. Validação dos price IDs
 * 4. URLs de retorno
 */

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY não configurada');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

const PRICE_IDS = {
  monthly: 'price_1SgD7EK0UayFnw7rorp4Y439',
  yearly: 'price_1SgD7EK0UayFnw7rVjbTODaV',
};

async function testStripeCheckout() {
  console.log('🔍 Testando configuração do Stripe...\n');

  try {
    // 1. Verificar se os price IDs existem
    console.log('📋 Validando Price IDs...');
    
    for (const [key, priceId] of Object.entries(PRICE_IDS)) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        const product = await stripe.products.retrieve(price.product as string);
        
        console.log(`✅ ${key.toUpperCase()}:`);
        console.log(`   - Price ID: ${priceId}`);
        console.log(`   - Produto: ${product.name}`);
        console.log(`   - Valor: R$ ${(price.unit_amount! / 100).toFixed(2)}`);
        console.log(`   - Recorrência: ${price.recurring?.interval}`);
        console.log('');
      } catch (error: any) {
        console.error(`❌ Erro ao validar price ${key}:`, error.message);
      }
    }

    // 2. Criar customer de teste
    console.log('👤 Criando customer de teste...');
    const customer = await stripe.customers.create({
      email: 'teste@exemplo.com',
      metadata: {
        test: 'true',
        supabase_user_id: 'test-user-123',
      },
    });
    console.log(`✅ Customer criado: ${customer.id}\n`);

    // 3. Criar checkout session de teste (mensal)
    console.log('🛒 Criando Checkout Session (Mensal)...');
    const sessionMonthly = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS.monthly,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://biblia-interativa-wine.vercel.app/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://biblia-interativa-wine.vercel.app/pricing?canceled=true',
      metadata: {
        user_id: 'test-user-123',
      },
      subscription_data: {
        metadata: {
          user_id: 'test-user-123',
        },
        trial_period_days: 7,
      },
    });
    console.log(`✅ Session criada: ${sessionMonthly.id}`);
    console.log(`🔗 URL: ${sessionMonthly.url}\n`);

    // 4. Criar checkout session de teste (anual)
    console.log('🛒 Criando Checkout Session (Anual)...');
    const sessionYearly = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS.yearly,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://biblia-interativa-wine.vercel.app/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://biblia-interativa-wine.vercel.app/pricing?canceled=true',
      metadata: {
        user_id: 'test-user-123',
      },
      subscription_data: {
        metadata: {
          user_id: 'test-user-123',
        },
        trial_period_days: 7,
      },
    });
    console.log(`✅ Session criada: ${sessionYearly.id}`);
    console.log(`🔗 URL: ${sessionYearly.url}\n`);

    // 5. Limpar customer de teste
    console.log('🧹 Limpando customer de teste...');
    await stripe.customers.del(customer.id);
    console.log(`✅ Customer removido\n`);

    // Resumo
    console.log('═══════════════════════════════════════════');
    console.log('✅ TESTE COMPLETO - Tudo funcionando!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📝 Próximos passos:');
    console.log('1. Acesse: https://biblia-interativa-wine.vercel.app/pricing');
    console.log('2. Clique em "Começar Teste Grátis"');
    console.log('3. Use cartão de teste: 4242 4242 4242 4242');
    console.log('4. Validade: qualquer data futura');
    console.log('5. CVV: qualquer 3 dígitos');
    console.log('6. CEP: qualquer 5 dígitos\n');

    console.log('🔗 Links úteis:');
    console.log('- Dashboard Stripe: https://dashboard.stripe.com/test/subscriptions');
    console.log('- Webhooks: https://dashboard.stripe.com/test/webhooks');
    console.log('- Logs: https://dashboard.stripe.com/test/logs\n');

  } catch (error: any) {
    console.error('\n❌ Erro no teste:', error.message);
    if (error.response) {
      console.error('Detalhes:', error.response);
    }
    process.exit(1);
  }
}

// Executar teste
testStripeCheckout();
