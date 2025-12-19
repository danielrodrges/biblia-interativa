'use client';

import { AlertTriangle, Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PremiumBlockerProps {
  feature: string;
  description?: string;
}

export default function PremiumBlocker({ feature, description }: PremiumBlockerProps) {
  const router = useRouter();

  const benefits = [
    'Todos os idiomas disponíveis',
    'Áudios em múltiplos idiomas',
    'Exercícios interativos ilimitados',
    'Traduções em tempo real',
    'Planos de leitura personalizados',
    'Sem anúncios',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        {/* Ícone */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Recurso Premium
        </h2>

        {/* Mensagem */}
        <div className="flex items-start gap-3 mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              {feature}
            </p>
            {description && (
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Benefícios */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Com o Plano Premium você tem:
          </p>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botões */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push('/pricing')}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
          >
            <Crown className="w-4 h-4 mr-2" />
            Ver Planos Premium
          </Button>
          
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="w-full"
          >
            Voltar
          </Button>
        </div>

        {/* Nota */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          Cancele quando quiser. Sem compromisso.
        </p>
      </div>
    </div>
  );
}
