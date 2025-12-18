'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingPrefs } from '@/hooks/useReadingPrefs';

export default function LeituraPage() {
  const router = useRouter();
  const { hasValidPrefs } = useReadingPrefs();

  useEffect(() => {
    // Redireciona para setup se as preferências de leitura não estiverem configuradas
    if (!hasValidPrefs()) {
      router.replace('/leitura/setup');
    } else {
      router.replace('/leitura/reader');
    }
  }, [router, hasValidPrefs]);

  // Loading enquanto redireciona
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Carregando...</p>
      </div>
    </div>
  );
}
