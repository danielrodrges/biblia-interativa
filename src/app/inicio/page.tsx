'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  ChevronRight, 
  Database,
  Waves,
  Sunrise,
  Flame,
  Heart,
  Lightbulb,
  Sun,
  Sparkle,
  Compass,
  Shield,
  HandHeart,
  Leaf,
  Star,
  Quote,
  Feather
} from 'lucide-react';
import { getPreferences, savePreferences } from '@/lib/preferences';
import { verseOfTheDay } from '@/lib/data';
import { UserPreferences } from '@/lib/types';
import { getRandomSuggestions, type ReadingSuggestion } from '@/lib/reading-suggestions';

// Componente auxiliar para renderizar ícones dinamicamente
const IconByName = ({ name, className }: { name: string, className?: string }) => {
  const icons: Record<string, any> = {
    Waves, Sunrise, Flame, Heart, Lightbulb, Sun, Sparkle, Compass, Shield, HandHeart, Leaf, Star
  };
  const Icon = icons[name] || Sparkles;
  return <Icon className={className} />;
};

export default function InicioPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [suggestions, setSuggestions] = useState<ReadingSuggestion[]>([]);

  useEffect(() => {
    console.log('📍 InicioPage montado, URL:', window.location.href);
    const prefs = getPreferences();
    // Não redireciona mais para onboarding - página inicial é sempre acessível
    setPreferences(prefs);
    setSuggestions(getRandomSuggestions(4));
  }, [router]);

  const handleSuggestionClick = (suggestion: ReadingSuggestion) => {
    const prefs = getPreferences();
    savePreferences({
      ...prefs,
      lastReading: {
        book: suggestion.book,
        chapter: suggestion.chapter,
        timestamp: Date.now()
      }
    });
    router.push(`/leitura/reader?book=${suggestion.bookCode}&chapter=${suggestion.chapter}`);
  };

  if (!preferences) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF9F6]">
        <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-stone-950 px-4 py-8 md:px-6 font-sans">
      <div className="max-w-lg mx-auto pb-24">
        {/* Header Minimalista */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-2 tracking-wide">
            Bom dia, Leitor
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm font-light tracking-wider uppercase">
            Sua jornada espiritual continua
          </p>
        </div>

        {/* Verse of the Day - Card Sofisticado */}
        <div className="relative bg-white dark:bg-stone-900 rounded-[2rem] p-8 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 dark:border-stone-800 overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Quote className="w-24 h-24 text-stone-900 dark:text-white" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-[1px] w-8 bg-stone-300 dark:bg-stone-700"></div>
              <span className="text-stone-400 dark:text-stone-500 font-medium text-xs uppercase tracking-[0.2em]">
                Palavra do Dia
              </span>
            </div>
            
            <div className="mb-8">
              <p className="text-stone-800 dark:text-stone-100 text-xl md:text-2xl font-serif leading-relaxed mb-4 italic">
                "{verseOfTheDay.learningText}"
              </p>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed font-light">
                {verseOfTheDay.nativeText}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
              <span className="text-stone-600 dark:text-stone-300 font-medium text-sm">
                {verseOfTheDay.reference}
              </span>
              <button
                onClick={() => router.push('/praticar')}
                className="flex items-center gap-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors text-sm font-medium"
              >
                <Feather className="w-4 h-4" />
                <span>Refletir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Continue Reading - Minimal */}
        {preferences.lastReading && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-stone-800 dark:text-stone-200 font-serif text-lg">Continuar Leitura</h2>
            </div>
            <button
              onClick={() => router.push('/leitura')}
              className="w-full bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center group-hover:bg-stone-100 dark:group-hover:bg-stone-700 transition-colors">
                  <BookOpen className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">
                    Última sessão
                  </div>
                  <div className="text-lg font-medium text-stone-800 dark:text-stone-100 font-serif">
                    {preferences.lastReading.book} <span className="text-stone-400 font-sans">{preferences.lastReading.chapter}</span>
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center group-hover:border-stone-400 transition-colors">
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
              </div>
            </button>
          </div>
        )}

        {/* Sugestões de Leitura - Clean Grid */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6 px-2">
            <Sparkles className="w-4 h-4 text-stone-400" />
            <h2 className="text-stone-800 dark:text-stone-200 font-serif text-lg">
              Para seu momento
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`relative overflow-hidden ${suggestion.gradient} dark:bg-stone-900 rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-md text-left group border border-white/50 dark:border-stone-800`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500">
                  <IconByName name={suggestion.iconName} className="w-12 h-12 text-stone-800/5 dark:text-white/5" />
                </div>
                
                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-full bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm flex items-center justify-center mb-4 shadow-sm`}>
                    <IconByName name={suggestion.iconName} className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                  </div>
                  
                  <div className="font-medium text-stone-800 dark:text-stone-100 mb-1 text-sm tracking-wide">
                    {suggestion.title}
                  </div>
                  
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium mt-3 flex items-center gap-1">
                    {suggestion.book} {suggestion.chapter}
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions - Minimal */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push('/leitura')}
            className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_5px_20px_rgb(0,0,0,0.05)] transition-all text-center group border border-stone-50 dark:border-stone-800"
          >
            <div className="w-12 h-12 mx-auto bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-stone-100 transition-colors">
              <BookOpen className="w-5 h-5 text-stone-600 dark:text-stone-300" />
            </div>
            <div className="font-medium text-stone-800 dark:text-stone-200 text-sm">
              Bíblia Completa
            </div>
          </button>

          <button
            onClick={() => router.push('/praticar')}
            className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_5px_20px_rgb(0,0,0,0.05)] transition-all text-center group border border-stone-50 dark:border-stone-800"
          >
            <div className="w-12 h-12 mx-auto bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-stone-100 transition-colors">
              <TrendingUp className="w-5 h-5 text-stone-600 dark:text-stone-300" />
            </div>
            <div className="font-medium text-stone-800 dark:text-stone-200 text-sm">
              Exercícios
            </div>
          </button>
        </div>

        {/* Language Info - Clean Footer */}
        <div className="flex items-center justify-center gap-6 py-6 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <span className="text-lg grayscale opacity-80">{preferences.nativeLanguage?.flag}</span>
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              {preferences.nativeVersion?.abbreviation}
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-stone-300"></div>
          <div className="flex items-center gap-2">
            <span className="text-lg grayscale opacity-80">{preferences.learningLanguage?.flag}</span>
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              {preferences.learningVersion?.abbreviation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
