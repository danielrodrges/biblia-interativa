'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Sessão inválida');
      setLoading(false);
      return;
    }

    // Aguardar processamento do webhook (simples delay)
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-stone-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            Processando seu pagamento...
          </h2>
          <p className="text-stone-600">
            Aguarde enquanto confirmamos sua assinatura
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            Erro no Checkout
          </h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <Link
            href="/pricing"
            className="inline-block bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors"
          >
            Voltar para Planos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-[#FAF9F6] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border-2 border-green-200">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
            Bem-vindo ao Premium! 🎉
          </h1>
          
          <p className="text-xl text-stone-600 mb-8">
            Sua assinatura foi ativada com sucesso!
          </p>

          <div className="bg-stone-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-stone-900 mb-4 text-lg">O que você acabou de ganhar:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">7 dias de teste grátis - cancele quando quiser</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">Áudio em 5 idiomas (inglês, espanhol, italiano, francês)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">Tradução em tempo real</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">Modo offline completo</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">Exercícios interativos ilimitados</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-stone-700">Sem anúncios</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inicio"
              className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all shadow-lg"
            >
              Começar a Ler
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/perfil"
              className="inline-flex items-center justify-center gap-2 bg-stone-100 text-stone-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-stone-200 transition-all"
            >
              Ver Meu Perfil
            </Link>
          </div>

          <p className="text-sm text-stone-500 mt-8">
            Enviamos um email de confirmação para você. Você pode gerenciar sua assinatura a qualquer momento no seu perfil.
          </p>
        </div>

        <div className="text-center mt-8">
          <p className="text-stone-600">
            Dúvidas? <Link href="/contact" className="text-stone-900 font-bold hover:underline">Entre em contato</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-stone-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            Carregando...
          </h2>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
