'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LeituraPage() {
  const router = useRouter();

  useEffect(() => {
    // Sempre redireciona para setup primeiro
    // O setup decidirá se vai para reader ou configuração
    router.replace('/leitura/setup');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Carregando...</p>
      </div>
    </div>
  );
}
