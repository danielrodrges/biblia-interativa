import { useState, useEffect } from 'react';
import { getUserSubscription, hasPremiumAccess, type UserSubscription } from '@/lib/subscription';
import { supabase } from '@/lib/supabase';

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubscription() {
      try {
        // Obter usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        setUserId(user.id);

        // Buscar assinatura
        const userSub = await getUserSubscription(user.id);
        setSubscription(userSub);

        // Verificar se tem premium
        const premium = await hasPremiumAccess(user.id);
        setIsPremium(premium);
      } catch (error) {
        console.error('Erro ao carregar assinatura:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSubscription();
  }, []);

  // Funcões de verificação de acesso
  const canAccessLanguage = (languageCode: string) => {
    // Português sempre disponível
    if (languageCode === 'pt' || languageCode === 'pt-BR') {
      return true;
    }
    // Outros idiomas só para premium
    return isPremium;
  };

  const canAccessAudio = (languageCode: string) => {
    // Áudio em português sempre disponível
    if (languageCode === 'pt' || languageCode === 'pt-BR') {
      return true;
    }
    // Outros idiomas só para premium
    return isPremium;
  };

  const canAccessExercises = () => {
    return isPremium;
  };

  const canAccessTranslation = () => {
    return isPremium;
  };

  const canAccessAllVersions = () => {
    return isPremium;
  };

  return {
    subscription,
    isPremium,
    isLoading,
    userId,
    canAccessLanguage,
    canAccessAudio,
    canAccessExercises,
    canAccessTranslation,
    canAccessAllVersions,
  };
}
