'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, getCurrentUser } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (isSupabaseConfigured()) {
        const user = await getCurrentUser();
        if (user) {
          // Usuário autenticado → ir para início
          router.replace('/inicio');
        } else {
          // Não autenticado → ir para welcome (landing page)
          router.replace('/welcome');
        }
      } else {
        // Sem Supabase configurado → ir direto para início (modo demo)
        router.replace('/inicio');
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-b from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Carregando...</p>
      </div>
    </div>
  );
}
