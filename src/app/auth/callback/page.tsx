'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Verificando autenticação...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Pegar os parâmetros da URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          console.error('Erro na URL:', error, errorDescription);
          setStatus('Erro na autenticação');
          setTimeout(() => router.push('/auth/login'), 2000);
          return;
        }

        if (code) {
          setStatus('Validando código...');
          // Trocar o código por uma sessão
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Erro ao trocar código:', exchangeError);
            setStatus('Erro ao validar código');
            setTimeout(() => router.push('/auth/login'), 2000);
            return;
          }

          if (data.session) {
            setStatus('Criando perfil...');
            // Criar perfil caso não exista
            const userId = data.session.user.id;
            const fullName = data.session.user.user_metadata?.full_name || '';

            // Tentar criar perfil
            await supabase.from('profiles').upsert({
              id: userId,
              full_name: fullName,
            }, { onConflict: 'id' });

            // Tentar criar stats
            await supabase.from('reading_stats').upsert({
              user_id: userId,
            }, { onConflict: 'user_id' });

            setStatus('Redirecionando...');
            router.push('/inicio');
            return;
          }
        }

        // Fallback: tentar pegar sessão existente
        setStatus('Verificando sessão...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao obter sessão:', sessionError);
          setStatus('Erro ao obter sessão');
          setTimeout(() => router.push('/auth/login'), 2000);
          return;
        }

        if (session) {
          setStatus('Autenticado! Redirecionando...');
          router.push('/inicio');
        } else {
          setStatus('Nenhuma sessão encontrada');
          setTimeout(() => router.push('/auth/login'), 2000);
        }
      } catch (err) {
        console.error('Erro no callback:', err);
        setStatus('Erro inesperado');
        setTimeout(() => router.push('/auth/login'), 2000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-600 text-lg font-serif">{status}</p>
      </div>
    </div>
  );
}
