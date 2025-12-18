'use client';

import { useRouter } from 'next/navigation';
import LanguageVersionSetup from '@/components/custom/language-version-setup';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/inicio');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">📖</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Bem-vindo à Bíblia Interativa
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Configure sua experiência de leitura bíblica
          </p>
        </div>

        {/* Setup Component */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <LanguageVersionSetup onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
