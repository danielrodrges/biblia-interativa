# 💳 Guia Completo de Configuração do Stripe

## 📋 Passo a Passo (30 minutos)

### **1. Criar Conta no Stripe** (5 minutos)

1. Acesse: https://dashboard.stripe.com/register
2. Cadastre-se com email/senha
3. Ative sua conta
4. **Importante:** Comece em **Modo de Teste** (test mode)

---

### **2. Criar Produtos e Preços** (10 minutos)

#### a) Acessar Produtos
- Dashboard Stripe → Products → Create Product

#### b) Criar Plano Premium

**Produto:**
- Nome: `Bíblia Interativa - Premium`
- Descrição: `Acesso completo com 5 idiomas, tradução em tempo real e sem anúncios`

**Preços (criar 2):**

1. **Premium Mensal:**
   - Modelo: Recurring
   - Preço: R$ 19,90
   - Billing period: Monthly
   - Copie o **Price ID** → `price_xxxxx`

2. **Premium Anual:**
   - Modelo: Recurring
   - Preço: R$ 179,90
   - Billing period: Yearly
   - Copie o **Price ID** → `price_yyyyy`

#### c) Criar Plano Família

**Produto:**
- Nome: `Bíblia Interativa - Família`
- Descrição: `Até 6 contas com todos os recursos premium`

**Preços (criar 2):**

1. **Família Mensal:**
   - Modelo: Recurring
   - Preço: R$ 29,90
   - Billing period: Monthly
   - Copie o **Price ID** → `price_zzzzz`

2. **Família Anual:**
   - Modelo: Recurring
   - Preço: R$ 269,90
   - Billing period: Yearly
   - Copie o **Price ID** → `price_wwwww`

---

### **3. Configurar Variáveis de Ambiente** (5 minutos)

#### a) Obter Chaves do Stripe

Dashboard Stripe → Developers → API Keys:
- **Publishable key** (começa com `pk_test_`)
- **Secret key** (começa com `sk_test_`)

#### b) Adicionar ao Vercel

Vercel Dashboard → Seu Projeto → Settings → Environment Variables:

```bash
# Chaves Stripe (modo teste)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...

# Price IDs (copie dos produtos criados)
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY=price_yyyyy
NEXT_PUBLIC_STRIPE_PRICE_FAMILY_MONTHLY=price_zzzzz
NEXT_PUBLIC_STRIPE_PRICE_FAMILY_YEARLY=price_wwwww

# Webhook (será criado no passo 4)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Service Role (já existe no Supabase)
SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key
```

#### c) Adicionar Localmente

Crie `.env.local` com as mesmas variáveis.

---

### **4. Configurar Webhook** (5 minutos)

#### a) Criar Endpoint

Dashboard Stripe → Developers → Webhooks → Add endpoint:

**URL do Endpoint:**
```
https://seu-app.vercel.app/api/stripe/webhook
```

**Eventos para ouvir:**
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_failed`

#### b) Copiar Signing Secret

Após criar o webhook:
- Clique em "Reveal" no Signing Secret
- Copie o valor (`whsec_xxxxx`)
- Adicione em `STRIPE_WEBHOOK_SECRET`

---

### **5. Aplicar Migration no Supabase** (3 minutos)

#### a) Via SQL Editor

Supabase Dashboard → SQL Editor → New Query

Cole o conteúdo de:
```
supabase/migrations/20250119000001_create_user_subscriptions.sql
```

Clique em **Run**

#### b) Verificar

```sql
SELECT * FROM user_subscriptions LIMIT 1;
```

Deve retornar sem erro (vazio ou com dados).

---

### **6. Configurar Customer Portal (Opcional)** (2 minutos)

Dashboard Stripe → Settings → Billing → Customer portal:

- **Habilitar:** Customer portal
- **Produtos:** Selecione os produtos criados
- **Permitir cancelamento:** Sim
- **Permitir mudança de plano:** Sim

**URL de retorno:** `https://seu-app.vercel.app/perfil`

---

## 🧪 Testar em Modo de Teste

### **1. Testar Checkout**

1. Acesse: `https://seu-app.vercel.app/pricing`
2. Clique em "Começar Teste Grátis" (Premium)
3. Preencha dados de teste:
   - **Cartão:** `4242 4242 4242 4242`
   - **Data:** Qualquer data futura
   - **CVC:** Qualquer 3 dígitos
   - **CEP:** Qualquer CEP
4. Complete o pagamento
5. Deve redirecionar para `/checkout/success`

### **2. Verificar Webhook**

Dashboard Stripe → Developers → Webhooks → Seu webhook:
- Verifique se há logs de eventos recebidos
- Status deve ser **Succeeded**

### **3. Verificar Supabase**

```sql
SELECT * FROM user_subscriptions 
WHERE user_id = 'seu_user_id';
```

Deve mostrar:
- `plan_type`: `premium`
- `status`: `trialing` ou `active`
- `stripe_customer_id`: preenchido
- `stripe_subscription_id`: preenchido

---

## 🚀 Ativar Modo Produção

### **Quando estiver pronto:**

1. **Ativar conta Stripe:**
   - Dashboard → Activate your account
   - Preencher dados bancários
   - Aguardar aprovação (1-2 dias)

2. **Mudar para Live Mode:**
   - Toggle "Test mode" → "Live mode"
   - Criar NOVOS produtos (repetir passo 2)
   - Obter NOVAS chaves (pk_live_, sk_live_)

3. **Atualizar Variáveis:**
   - Trocar todas as chaves de `test` para `live`
   - Criar novo webhook para produção
   - Atualizar `STRIPE_WEBHOOK_SECRET`

4. **Redeploy:**
   ```bash
   git push origin main
   ```

---

## 🔍 Troubleshooting

### **Erro: "Stripe não configurado"**
- Verifique se `STRIPE_SECRET_KEY` está no `.env.local`
- Redeploy na Vercel

### **Webhook não funciona**
- Verifique URL: `https://` (não `http://`)
- Confirme que `STRIPE_WEBHOOK_SECRET` está correto
- Teste manualmente: Stripe Dashboard → Send test webhook

### **Assinatura não salva no Supabase**
- Verifique logs do webhook no Stripe
- Confirme que `SUPABASE_SERVICE_ROLE_KEY` está configurado
- Teste SQL de insert manual

### **Redirecionamento falha**
- Confirme URLs de success/cancel em `create-checkout/route.ts`
- Verifique se domínio está correto

---

## 📊 Monitorar

### **Dashboard Stripe**
- MRR (Monthly Recurring Revenue)
- Churn rate
- Assinaturas ativas
- Falhas de pagamento

### **Queries Úteis**

```sql
-- Assinaturas por plano
SELECT plan_type, COUNT(*) 
FROM user_subscriptions 
GROUP BY plan_type;

-- Assinaturas ativas
SELECT COUNT(*) 
FROM user_subscriptions 
WHERE status = 'active';

-- Assinaturas em trial
SELECT COUNT(*) 
FROM user_subscriptions 
WHERE status = 'trialing';

-- Revenue potencial mensal
SELECT 
  CASE 
    WHEN plan_type = 'premium' THEN COUNT(*) * 19.90
    WHEN plan_type = 'family' THEN COUNT(*) * 29.90
  END as mrr
FROM user_subscriptions 
WHERE status IN ('active', 'trialing')
GROUP BY plan_type;
```

---

## ✅ Checklist Final

- [ ] Conta Stripe criada
- [ ] 4 produtos criados (Premium Mensal/Anual, Família Mensal/Anual)
- [ ] Variáveis de ambiente configuradas (Vercel + .env.local)
- [ ] Webhook configurado e testado
- [ ] Migration aplicada no Supabase
- [ ] Teste de checkout realizado com sucesso
- [ ] Webhook recebeu eventos corretamente
- [ ] Assinatura salva no Supabase
- [ ] Customer portal configurado
- [ ] Pronto para modo produção

---

## 🎯 Próximos Passos

1. **Teste A/B de preços** (experimentar R$ 17,90 vs R$ 19,90)
2. **Cupons de desconto** (Stripe → Coupons)
3. **Upgrade/Downgrade** (via Customer Portal)
4. **Emails transacionais** (Stripe + SendGrid)
5. **Analytics** (Stripe Dashboard + Google Analytics)

---

## 💰 Faturamento Esperado

**Cenário Conservador:**
- 100 usuários ativos
- Taxa de conversão: 10% (10 pagantes)
- 70% Premium + 30% Família
- **MRR:** ~R$ 230/mês

**Cenário Otimista:**
- 1.000 usuários ativos
- Taxa de conversão: 15% (150 pagantes)
- 60% Premium + 40% Família
- **MRR:** ~R$ 3.600/mês

---

🎉 **Você está pronto para aceitar pagamentos!**
