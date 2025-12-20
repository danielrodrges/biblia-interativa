'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Verificando autenticação...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔍 Callback iniciado');
        
        // Pegar os parâmetros da URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('📋 Parâmetros:', { code: !!code, error, errorDescription });

        if (error) {
          console.error('❌ Erro na URL:', error, errorDescription);
          setStatus('Erro na autenticação: ' + errorDescription);
          setTimeout(() => router.push('/auth/login'), 3000);
          return;
        }

        if (code) {
          setStatus('Validando código...');
          console.log('🔄 Trocando código por sessão...');
          
          // Trocar o código por uma sessão
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('❌ Erro ao trocar código:', exchangeError);
            setStatus('Erro: ' + exchangeError.message);
            setTimeout(() => router.push('/auth/login'), 3000);
            return;
          }

          console.log('✅ Código trocado com sucesso');

          if (data.session && data.user) {
            console.log('✅ Sessão obtida:', {
              userId: data.user.id,
              email: data.user.email,
              provider: data.user.app_metadata?.provider
            });

            setStatus('Criando perfil...');
            
            // Criar perfil caso não exista
            const userId = data.user.id;
            const fullName = data.user.user_metadata?.full_name || 
                           data.user.user_metadata?.name || 
                           data.user.email?.split('@')[0] || 
                           'Usuário';

            console.log('👤 Criando perfil para:', { userId, fullName });

            // Tentar criar perfil
            try {
              await supabase.from('profiles').upsert({
                id: userId,
                full_name: fullName,
              }, { onConflict: 'id' });
              console.log('✅ Perfil criado/atualizado');
            } catch (profileError) {
              console.warn('⚠️ Erro ao criar perfil:', profileError);
            }

            // Tentar criar stats
            try {
              await supabase.from('reading_stats').upsert({
                user_id: userId,
              }, { onConflict: 'user_id' });
              console.log('✅ Stats criadas/atualizadas');
            } catch (statsError) {
              console.warn('⚠️ Erro ao criar stats:', statsError);
            }

            setStatus('Login realizado! Redirecionando...');
            console.log('🚀 Redirecionando para /inicio');
            
            // Aguardar um pouco para garantir persistência da sessão
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push('/inicio');
            return;
          }
        }

        // Fallback: tentar pegar sessão existente
        console.log('🔍 Verificando sessão existente...');
        setStatus('Verificando sessão...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Erro ao obter sessão:', sessionError);
          setStatus('Erro ao obter sessão');
          setTimeout(() => router.push('/auth/login'), 3000);
          return;
        }

        if (session) {
          console.log('✅ Sessão existente encontrada');
          setStatus('Autenticado! Redirecionando...');
          await new Promise(resolve => setTimeout(resolve, 500));
          router.push('/inicio');
        } else {
          console.warn('⚠️ Nenhuma sessão encontrada');
          setStatus('Nenhuma sessão encontrada. Redirecionando...');
          setTimeout(() => router.push('/auth/login'), 2000);
        }
      } catch (err: any) {
        console.error('❌ Erro no callback:', err);
        setStatus('Erro: ' + (err.message || 'Erro inesperado'));
        setTimeout(() => router.push('/auth/login'), 3000);
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 text-lg font-serif">Carregando...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
