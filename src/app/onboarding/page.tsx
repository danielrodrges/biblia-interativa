'use client';

import { useRouter } from 'next/navigation';
import LanguageVersionSetup from '@/components/custom/language-version-setup';
import { Book } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/inicio');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-stone-950 px-6 py-12 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="w-20 h-20 bg-stone-100 dark:bg-stone-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Book className="w-10 h-10 text-stone-800 dark:text-stone-200" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-3">
            Bem-vindo à Bíblia Interativa
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            Configure sua experiência de leitura bíblica
          </p>
        </div>

        {/* Setup Component */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xl shadow-stone-200/50 dark:shadow-none p-8 border border-stone-100 dark:border-stone-800 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150">
          <LanguageVersionSetup onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
