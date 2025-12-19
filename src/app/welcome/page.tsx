'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Sparkles, Users, Heart, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { isSupabaseConfigured, getCurrentUser } from '@/lib/supabase';

export default function WelcomePage() {
  const router = useRouter();

  // Verificar se já está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured()) {
        const user = await getCurrentUser();
        if (user) {
          router.replace('/inicio');
        }
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] via-stone-50 to-stone-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(236,72,153,0.05),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-stone-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-stone-900/20 rotate-3 hover:rotate-0 transition-transform">
              <Book className="w-12 h-12 text-stone-50" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-4 tracking-tight">
              Bíblia Interativa
            </h1>
            <p className="text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto font-light">
              Transforme sua leitura bíblica com tecnologia de ponta
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-stone-200 text-stone-800 rounded-2xl font-bold text-lg hover:border-stone-400 hover:shadow-lg transition-all"
            >
              Já tenho conta
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Áudio Inteligente"
              description="Ouça a Bíblia em múltiplos idiomas com sincronização perfeita"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Acompanhe Progresso"
              description="Estatísticas detalhadas do seu tempo de leitura e evolução"
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8" />}
              title="Planos Personalizados"
              description="Sugestões de leitura baseadas no seu momento espiritual"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
            <StatCard number="5+" label="Idiomas" />
            <StatCard number="10+" label="Versões" />
            <StatCard number="1,189" label="Capítulos" />
            <StatCard number="∞" label="Inspiração" />
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-stone-100 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-8 text-center">
              Por que escolher a Bíblia Interativa?
            </h2>
            <div className="space-y-4">
              <BenefitItem text="Tradução em tempo real para 5 idiomas" />
              <BenefitItem text="Síntese de voz natural e profissional" />
              <BenefitItem text="Interface minimalista e sem distrações" />
              <BenefitItem text="Funciona offline após primeiro acesso" />
              <BenefitItem text="Sincronização automática entre dispositivos" />
              <BenefitItem text="Exercícios interativos de compreensão" />
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-20">
            <p className="text-stone-500 mb-6 text-lg">
              Junte-se a milhares de leitores transformando sua jornada espiritual
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              Criar Conta Grátis
              <Users className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/50 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-stone-500 text-sm">
          <p>© 2025 Bíblia Interativa. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-stone-800 transition-colors">
              Privacidade
            </Link>
            <Link href="/terms" className="hover:text-stone-800 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/contact" className="hover:text-stone-800 transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center mb-4 text-stone-700">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">{number}</div>
      <div className="text-stone-500 text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 bg-stone-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle className="w-4 h-4 text-white" />
      </div>
      <p className="text-stone-700 text-lg">{text}</p>
    </div>
  );
}
