'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Sempre redireciona direto para /inicio
    router.replace('/inicio');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-amber-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Carregando...</p>
      </div>
    </div>
  );
}
                Entrar
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
              Transforme sua jornada espiritual
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Aprenda idiomas através de textos sagrados e mensagens inspiradoras
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/auth/signup')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Começar Agora
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="px-8 py-4 bg-white text-gray-800 rounded-full text-lg font-semibold border-2 border-gray-300 hover:border-blue-500 transition-all duration-300 hover:scale-105"
              >
                Já tenho conta
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Múltiplos Idiomas</h3>
              <p className="text-gray-600">
                Aprenda inglês, espanhol, francês, alemão, italiano e muito mais através de textos espirituais
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Conteúdo Inspirador</h3>
              <p className="text-gray-600">
                Textos sagrados, mensagens motivacionais e ensinamentos espirituais de diversas tradições
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Notificações Diárias</h3>
              <p className="text-gray-600">
                Receba mensagens inspiradoras e lembretes para manter sua prática diária de leitura
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">
              Pronto para começar sua jornada?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de pessoas transformando suas vidas através da leitura espiritual
            </p>
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-10 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Criar Conta Gratuita
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
            <p>© 2024 Leitura Espiritual. Transformando vidas através do conhecimento.</p>
          </div>
        </footer>
      </div>
    );
}
