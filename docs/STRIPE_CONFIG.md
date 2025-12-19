# Guia de Configuração Stripe

## 1. Obter Chaves da API

1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Copie:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

## 2. Criar Produtos no Stripe

### Produto: Bíblia Interativa Premium

1. Acesse: https://dashboard.stripe.com/test/products
2. Clique em **"+ Add Product"**
3. Preencha:
   - **Name**: Bíblia Interativa Premium
   - **Description**: Acesso completo a todos os idiomas, áudios e funcionalidades
   - **Pricing Model**: Recurring
   
4. Adicione preços:
   
   **Plano Mensal:**
   - Price: R$ 9,90 (ou valor desejado)
   - Billing period: Monthly
   - Copie o Price ID gerado (ex: `price_xxxxx`)
   
   **Plano Anual:**
   - Price: R$ 99,00 (ou valor desejado)
   - Billing period: Yearly
   - Copie o Price ID gerado (ex: `price_yyyyy`)

## 3. Configurar Webhook

1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique em **"+ Add endpoint"**
3. URL do endpoint: `https://biblia-interativa-wine.vercel.app/api/stripe/webhook`
4. Selecione eventos:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
5. Copie o **Signing secret** (começa com `whsec_...`)

## 4. Configurar Variáveis de Ambiente

Adicione ao `.env.local`:

```bash
# Stripe - Chaves de Teste
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe - IDs dos Produtos
STRIPE_PRICE_PREMIUM_MONTHLY="price_xxxxx"
STRIPE_PRICE_PREMIUM_YEARLY="price_yyyyy"
```

## 5. Regras de Negócio

### Conta Gratuita (Free)
- ✅ Acesso à Bíblia em **Português** (NVI, ACF, ARA)
- ✅ Áudio em **Português**
- ❌ Idiomas bloqueados: Inglês, Espanhol, Francês, etc
- ❌ Exercícios interativos bloqueados
- ❌ Traduções em tempo real bloqueadas

### Conta Premium
- ✅ Todos os idiomas disponíveis
- ✅ Todos os áudios
- ✅ Exercícios interativos
- ✅ Traduções em tempo real
- ✅ Recursos exclusivos

## 6. URLs de Teste

- Dashboard: https://dashboard.stripe.com/test/dashboard
- Produtos: https://dashboard.stripe.com/test/products
- Webhooks: https://dashboard.stripe.com/test/webhooks
- Logs: https://dashboard.stripe.com/test/logs
