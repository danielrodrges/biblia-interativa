'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ensureUserSetup } from '@/lib/ensure-user-setup';

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
          
          // Tratamento específico para erro de usuário já registrado
          if (errorDescription?.includes('User already registered') || 
              errorDescription?.includes('already registered')) {
            setStatus('Esta conta já existe com outro método de login. Use email/senha.');
            console.warn('⚠️ Conta existe com provider diferente');
          } else {
            setStatus('Erro na autenticação: ' + errorDescription);
          }
          
          setTimeout(() => router.push('/auth/login'), 4000);
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
              provider: data.user.app_metadata?.provider,
              identities: data.user.identities?.map((i: any) => i.provider)
            });

            // Verificar se usuário tem identidades vinculadas
            if (!data.user.identities || data.user.identities.length === 0) {
              console.error('❌ Usuário sem identidades vinculadas!');
              setStatus('Erro: Conta corrompida. Entre em contato com suporte.');
              setTimeout(() => router.push('/auth/login'), 5000);
              return;
            }

            setStatus('Configurando conta...');
            
            // Configurar usuário completo: perfil, stats, assinatura gratuita
            const userId = data.user.id;
            const email = data.user.email || '';
            const fullName = data.user.user_metadata?.full_name || 
                           data.user.user_metadata?.name || 
                           email.split('@')[0] || 
                           'Usuário';

            console.log('🔧 Configurando usuário:', { userId, fullName });

            try {
              await ensureUserSetup(userId, email, fullName);
              console.log('✅ Usuário configurado com acesso gratuito');
            } catch (setupError) {
              console.warn('⚠️ Erro ao configurar usuário:', setupError);
              // Continua mesmo com erro, deixa o RLS criar os dados depois
            }

            setStatus('Login realizado! Redirecionando...');
            console.log('🚀 Redirecionando para /inicio');
            
            // Aguardar um pouco para garantir persistência da sessão
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Usar window.location.href em vez de router.push para forçar reload
            window.location.href = '/inicio';
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
          await new Promise(resolve => setTimeout(resolve, 1000));
          window.location.href = '/inicio';
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
