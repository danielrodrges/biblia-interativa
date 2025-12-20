'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function InicioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔐 Verificando autenticação na página /inicio');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('📊 Status da sessão:', {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        error: error?.message
      });

      if (!session) {
        console.log('❌ Sem sessão, redirecionando para login');
        router.push('/auth/login');
      } else {
        console.log('✅ Sessão válida, usuário pode acessar /inicio');
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
