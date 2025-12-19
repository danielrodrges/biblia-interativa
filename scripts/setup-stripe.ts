#!/usr/bin/env tsx
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY não configurada');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

async function setupStripeProducts() {
  console.log('🚀 Configurando produtos no Stripe...\n');

  try {
    // 1. Criar produto Premium
    console.log('📦 Criando produto: Bíblia Interativa Premium');
    
    const product = await stripe.products.create({
      name: 'Bíblia Interativa Premium',
      description: 'Acesso completo a todos os idiomas, áudios, exercícios e traduções em tempo real',
      metadata: {
        app: 'biblia-interativa',
        plan: 'premium',
      },
    });

    console.log(`✅ Produto criado: ${product.id}\n`);

    // 2. Criar preço mensal
    console.log('💰 Criando preço mensal: R$ 9,90/mês');
    
    const priceMonthly = await stripe.prices.create({
      product: product.id,
      unit_amount: 990, // R$ 9,90 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: 'premium',
        billing: 'monthly',
      },
    });

    console.log(`✅ Preço mensal criado: ${priceMonthly.id}\n`);

    // 3. Criar preço anual
    console.log('💰 Criando preço anual: R$ 99,00/ano');
    
    const priceYearly = await stripe.prices.create({
      product: product.id,
      unit_amount: 9900, // R$ 99,00 em centavos
      currency: 'brl',
      recurring: {
        interval: 'year',
      },
      metadata: {
        plan: 'premium',
        billing: 'yearly',
      },
    });

    console.log(`✅ Preço anual criado: ${priceYearly.id}\n`);

    // 4. Exibir configurações para .env.local
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ CONFIGURAÇÃO CONCLUÍDA!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📝 Adicione estas linhas ao seu .env.local:\n');
    console.log(`STRIPE_PRICE_PREMIUM_MONTHLY="${priceMonthly.id}"`);
    console.log(`STRIPE_PRICE_PREMIUM_YEARLY="${priceYearly.id}"`);
    console.log();

    // 5. Salvar automaticamente no .env.local
    const fs = require('fs');
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envContent = `\n# Stripe Product IDs\nSTRIPE_PRICE_PREMIUM_MONTHLY="${priceMonthly.id}"\nSTRIPE_PRICE_PREMIUM_YEARLY="${priceYearly.id}"\n`;
    
    fs.appendFileSync(envPath, envContent);
    console.log('✅ Variáveis adicionadas automaticamente ao .env.local\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 PRÓXIMOS PASSOS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('1. Reinicie o servidor de desenvolvimento');
    console.log('2. Configure o webhook do Stripe:');
    console.log('   URL: https://biblia-interativa-wine.vercel.app/api/stripe/webhook');
    console.log('   Eventos: customer.subscription.*, checkout.session.completed');
    console.log('3. Teste o fluxo de pagamento em /pricing\n');

    console.log('🔗 Links úteis:');
    console.log(`   Dashboard: https://dashboard.stripe.com/test/products/${product.id}`);
    console.log('   Webhooks: https://dashboard.stripe.com/test/webhooks\n');

  } catch (error: any) {
    console.error('❌ Erro ao configurar Stripe:', error.message);
    process.exit(1);
  }
}

setupStripeProducts();
