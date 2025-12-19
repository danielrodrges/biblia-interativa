'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, ArrowRight, Sparkles, Gift, Zap } from 'lucide-react';
import Link from 'next/link';
import Confetti from 'react-confetti';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Configurar tamanho da janela para confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setError('Sessão inválida');
      setLoading(false);
      return;
    }

    // Aguardar processamento do webhook
    setTimeout(() => {
      setLoading(false);
      setShowConfetti(true);
      // Parar confetti após 5 segundos
      setTimeout(() => setShowConfetti(false), 5000);
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
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-6 py-12">
        <div className="max-w-3xl w-full">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border-2 border-green-200 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30 -z-10"></div>
            
            {/* Success Icon */}
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
                <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-stone-900 via-green-800 to-stone-900 bg-clip-text text-transparent mb-4">
              Bem-vindo ao Premium! 🎉
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-600 mb-3">
              Sua assinatura foi ativada com sucesso!
            </p>
            
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-8">
              <Gift className="w-4 h-4" />
              7 dias de teste grátis ativado
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-6 text-left">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 mb-1">Recursos Premium</h3>
                    <p className="text-sm text-stone-600">Acesso completo desbloqueado</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-700">Áudio em 5 idiomas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-700">Tradução em tempo real</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-700">Modo offline completo</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-left">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 mb-1">Experiência Aprimorada</h3>
                    <p className="text-sm text-stone-600">Sem limites ou anúncios</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-700">Exercícios ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-700">Planos personalizados</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-stone-700">Suporte prioritário</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link
                href="/inicio"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-stone-900 to-stone-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all shadow-lg"
              >
                Começar a Ler
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/perfil"
                className="inline-flex items-center justify-center gap-2 bg-stone-100 text-stone-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-stone-200 hover:scale-105 transition-all"
              >
                Ver Meu Perfil
              </Link>
            </div>

            {/* Email Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>📧 Confirmação enviada!</strong> Verifique seu email para detalhes da assinatura. 
                Você pode gerenciá-la a qualquer momento no seu perfil.
              </p>
            </div>
          </div>

          {/* Footer Help */}
          <div className="text-center mt-8 space-y-3">
            <p className="text-stone-600">
              Dúvidas sobre sua assinatura?{' '}
              <Link href="/perfil" className="text-stone-900 font-bold hover:underline">
                Gerenciar no perfil
              </Link>
            </p>
            <p className="text-sm text-stone-500">
              Precisa de ajuda?{' '}
              <a href="mailto:suporte@bibliainterativa.com" className="text-stone-700 hover:underline">
                suporte@bibliainterativa.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
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
