'use client';

import { useState } from 'react';
import { ArrowLeft, BookOpen, Info } from 'lucide-react';
import Link from 'next/link';
import BibleVersionSelector from '@/components/custom/bible-version-selector';
import BilingualReader from '@/components/custom/bilingual-reader';
import { getBilingualChapter } from '@/lib/bible-utils';
import { BilingualReadingConfig, BibleVerseData } from '@/lib/types';
import { getBookName } from '@/lib/bible-books';

export default function BibleManagementDemo() {
  const [nativeLanguage] = useState('pt-BR');
  const [learningLanguage] = useState('en-US');
  const [nativeVersion, setNativeVersion] = useState('NVI');
  const [learningVersion, setLearningVersion] = useState('NIV');
  const [displayMode, setDisplayMode] = useState<'side-by-side' | 'verse-by-verse'>('side-by-side');
  const [verses, setVerses] = useState<Array<{ native: BibleVerseData; learning: BibleVerseData }>>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadChapter = (bookId: string, chapter: number) => {
    setLoading(true);
    setMessage('');

    const config: BilingualReadingConfig = {
      native_version: nativeVersion,
      learning_version: learningVersion,
      display_mode: displayMode,
      sync_position: true,
    };

    const result = getBilingualChapter(config, bookId, chapter);

    if (result.success && result.verses) {
      setVerses(result.verses);
      if (result.verses.length > 0) {
        const bookName = result.verses[0].native.book_name;
        setMessage(`✅ Carregado: ${bookName} ${chapter} (${result.verses.length} versículos)`);
      }
    } else {
      setMessage(`❌ ${result.message || 'Erro ao carregar capítulo'}`);
      setVerses([]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/inicio"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Gestão de Dados Bíblicos
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Sistema de traduções oficiais e leitura bilíngue
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informações do sistema */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold">Sistema de Gestão Bíblica Implementado:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                <li>✅ Traduções oficiais (NVI, ARA, KJV, NIV, RVR1960, etc.)</li>
                <li>✅ Múltiplos idiomas (Português, Inglês, Espanhol, Francês, Alemão, Italiano)</li>
                <li>✅ Sincronização automática entre versões</li>
                <li>✅ Sugestão de versões alternativas quando necessário</li>
                <li>✅ Leitura bilíngue (lado a lado ou versículo por versículo)</li>
                <li>✅ Preservação da integridade dos textos bíblicos</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seleção de versões */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Língua que você domina
            </h2>
            <BibleVersionSelector
              languageCode={nativeLanguage}
              languageName="Português do Brasil"
              selectedVersionId={nativeVersion}
              onVersionSelect={setNativeVersion}
              label="Escolha a versão bíblica"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Língua que você quer aprender
            </h2>
            <BibleVersionSelector
              languageCode={learningLanguage}
              languageName="English (United States)"
              selectedVersionId={learningVersion}
              onVersionSelect={setLearningVersion}
              label="Choose Bible version"
            />
          </div>
        </div>

        {/* Exemplos de leitura */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Exemplos de Leitura
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => loadChapter('JOH', 3)}
              disabled={loading}
              className="p-4 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors disabled:opacity-50"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">João 3</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                O amor de Deus
              </p>
            </button>
            <button
              onClick={() => loadChapter('ROM', 8)}
              disabled={loading}
              className="p-4 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors disabled:opacity-50"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">Romanos 8</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Nada nos separa
              </p>
            </button>
            <button
              onClick={() => loadChapter('PHP', 4)}
              disabled={loading}
              className="p-4 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors disabled:opacity-50"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">Filipenses 4</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Força em Cristo
              </p>
            </button>
            <button
              onClick={() => loadChapter('PSA', 23)}
              disabled={loading}
              className="p-4 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors disabled:opacity-50"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">Salmos 23</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                O Senhor é meu pastor
              </p>
            </button>
          </div>
        </div>

        {/* Mensagem de status */}
        {message && (
          <div className={`rounded-lg p-4 mb-6 ${
            message.startsWith('✅')
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
              : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Leitor bilíngue */}
        {verses.length > 0 && (
          <BilingualReader
            verses={verses}
            displayMode={displayMode}
            onDisplayModeChange={setDisplayMode}
            fontSize="medium"
          />
        )}

        {/* Estado vazio */}
        {verses.length === 0 && !loading && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Selecione um exemplo de leitura acima
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Os versículos serão exibidos aqui em modo bilíngue
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
