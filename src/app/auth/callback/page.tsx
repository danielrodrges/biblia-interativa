'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro na autenticação:', error);
        router.push('/auth/login');
        return;
      }

      if (session) {
        router.push('/inicio');
      } else {
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-600 text-lg font-serif">Autenticando...</p>
      </div>
    </div>
  );
}
