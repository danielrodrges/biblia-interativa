'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Confirmando seu email...');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Pegar token da URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const code = searchParams.get('code');

        if (code) {
          setStatus('Validando código...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Erro ao trocar código:', error);
            setStatus('Erro ao confirmar email');
            setTimeout(() => router.push('/auth/login'), 3000);
            return;
          }

          if (data.session) {
            // Criar perfil se não existir
            const userId = data.session.user.id;
            const fullName = data.session.user.user_metadata?.full_name || '';

            await supabase.from('profiles').upsert({
              id: userId,
              full_name: fullName,
            }, { onConflict: 'id' });

            await supabase.from('reading_stats').upsert({
              user_id: userId,
            }, { onConflict: 'user_id' });

            setStatus('Email confirmado! Redirecionando...');
            setTimeout(() => router.push('/inicio'), 1000);
            return;
          }
        }

        if (token && type === 'signup') {
          setStatus('Verificando token...');
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });

          if (error) {
            console.error('Erro ao verificar token:', error);
            setStatus('Erro ao confirmar email');
            setTimeout(() => router.push('/auth/login'), 3000);
            return;
          }

          setStatus('Email confirmado! Redirecionando...');
          setTimeout(() => router.push('/inicio'), 1000);
          return;
        }

        // Fallback
        setStatus('Link inválido ou expirado');
        setTimeout(() => router.push('/auth/login'), 3000);
      } catch (err) {
        console.error('Erro ao confirmar:', err);
        setStatus('Erro ao processar confirmação');
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };

    confirmEmail();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <div className="w-12 h-12 border-4 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">
          {status}
        </h2>
        <p className="text-stone-600">
          Aguarde enquanto processamos sua confirmação...
        </p>
      </div>
    </div>
  );
}
