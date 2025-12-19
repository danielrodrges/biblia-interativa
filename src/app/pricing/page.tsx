'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Zap, Crown, Shield, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase';
import { loadStripe } from '@stripe/stripe-js';

// Inicializar Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Grátis',
      description: 'Para começar sua jornada',
      icon: <Shield className="w-8 h-8" />,
      price: { monthly: 0, yearly: 0 },
      features: [
        'Acesso a todas as versões',
        '1 idioma de áudio',
        'Leitura ilimitada',
        'Marcadores básicos',
        'Anúncios ocasionais'
      ],
      cta: 'Começar Grátis',
      highlight: false
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Para leitores dedicados',
      icon: <Zap className="w-8 h-8" />,
      price: { monthly: 19.90, yearly: 179.90 },
      features: [
        'Tudo do plano Grátis',
        '5 idiomas de áudio',
        'Tradução em tempo real',
        'Modo offline completo',
        'Sem anúncios',
        'Exercícios interativos',
        'Planos de leitura personalizados',
        'Suporte prioritário'
      ],
      cta: 'Começar Teste Grátis',
      highlight: true,
      badge: 'Mais Popular'
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      router.push('/auth/signup');
      return;
    }

    setLoading(planId);

    try {
      // Verificar se usuário está autenticado
      const user = await getCurrentUser();
      
      if (!user) {
        // Não autenticado → redirecionar para signup com plano
        router.push(`/auth/signup?plan=${planId}&billing=${billingCycle}`);
        return;
      }

      // Usuário autenticado → criar checkout session
      const priceMap: Record<string, string> = {
        'premium-monthly': process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY || '',
        'premium-yearly': process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY || '',
      };

      const priceKey = `${planId}-${billingCycle}`;
      const priceId = priceMap[priceKey];

      if (!priceId) {
        alert('Configuração de preço não encontrada. Entre em contato com o suporte.');
        setLoading(null);
        return;
      }

      // Criar sessão de checkout
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          email: user.email,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert(error);
        setLoading(null);
        return;
      }

      // Redirecionar para checkout do Stripe
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setLoading(null);
    }
  };

  const savings = billingCycle === 'yearly' ? '2 meses grátis' : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] via-stone-50 to-stone-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/welcome" className="inline-block mb-6 text-stone-500 hover:text-stone-800 transition-colors">
            ← Voltar
          </Link>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-4">
            Escolha seu plano
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-8">
            Comece grátis e faça upgrade quando quiser. Sem surpresas.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl p-1.5 shadow-lg border border-stone-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Anual
              {savings && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  -17%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-[2rem] p-8 shadow-xl border-2 transition-all hover:scale-105 ${
                plan.highlight
                  ? 'border-stone-900 shadow-2xl'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                  {plan.badge}
                </div>
              )}

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                plan.highlight ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'
              }`}>
                {plan.icon}
              </div>

              <h3 className="text-2xl font-bold text-stone-900 mb-2">{plan.name}</h3>
              <p className="text-stone-500 mb-6">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-stone-900">
                    R$ {plan.price[billingCycle].toFixed(2).replace('.', ',')}
                  </span>
                  {plan.price[billingCycle] > 0 && (
                    <span className="text-stone-500">
                      /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  )}
                </div>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <p className="text-sm text-green-600 mt-1 font-medium">
                    Economize R$ {((plan.price.monthly * 12) - plan.price.yearly).toFixed(2).replace('.', ',')} por ano
                  </p>
                )}
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-4 rounded-2xl font-bold text-lg mb-6 transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-lg disabled:opacity-50'
                    : 'bg-stone-100 text-stone-900 hover:bg-stone-200 disabled:opacity-50'
                }`}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-stone-800 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 text-center">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="Posso cancelar a qualquer momento?"
              answer="Sim! Você pode cancelar sua assinatura a qualquer momento, sem multas. Você manterá acesso até o final do período pago."
            />
            <FAQItem
              question="O teste grátis é realmente grátis?"
              answer="Sim! O teste de 7 dias é totalmente grátis. Você pode cancelar antes do término e não será cobrado."
            />
            <FAQItem
              question="Quais formas de pagamento são aceitas?"
              answer="Aceitamos cartão de crédito, débito, PIX e boleto bancário. Todos os pagamentos são processados de forma segura."
            />
            <FAQItem
              question="Posso mudar de plano depois?"
              answer="Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente."
            />
          </div>
        </div>

        {/* Guarantee Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-2xl px-6 py-4">
            <Shield className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <div className="font-bold text-green-900">Garantia de 30 dias</div>
              <div className="text-sm text-green-700">Reembolso total se não ficar satisfeito</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left font-bold text-stone-900 hover:bg-stone-50 transition-colors flex items-center justify-between"
      >
        {question}
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-stone-100 text-stone-700">
          {answer}
        </div>
      )}
    </div>
  );
}
