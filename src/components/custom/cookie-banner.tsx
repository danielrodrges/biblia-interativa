'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const hasAccepted = localStorage.getItem('cookieConsent');
    if (!hasAccepted) {
      // Mostrar banner após 1 segundo
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 md:p-8">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center">
                <Cookie className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-serif font-bold text-stone-900 mb-2">
                🍪 Cookies e Privacidade
              </h3>
              <p className="text-stone-600 leading-relaxed mb-4">
                Usamos cookies essenciais para garantir o funcionamento do site e cookies analíticos 
                para melhorar sua experiência. Seus dados são protegidos de acordo com a{' '}
                <Link href="/privacidade" className="text-stone-900 underline hover:text-stone-700">
                  Política de Privacidade
                </Link>{' '}
                e a LGPD.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={acceptCookies}
                  className="px-6 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors"
                >
                  Aceitar Todos
                </button>
                <button
                  onClick={rejectCookies}
                  className="px-6 py-3 bg-stone-100 text-stone-900 rounded-xl font-medium hover:bg-stone-200 transition-colors"
                >
                  Apenas Essenciais
                </button>
                <Link
                  href="/privacidade"
                  className="px-6 py-3 text-stone-600 hover:text-stone-900 transition-colors text-center sm:text-left"
                >
                  Saber Mais
                </Link>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={rejectCookies}
              className="flex-shrink-0 p-2 text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
