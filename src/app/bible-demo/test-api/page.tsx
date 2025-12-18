'use client';

import { useEffect, useState } from 'react';
import { fetchChapter, fetchVerse, isScriptureApiConfigured } from '@/lib/scripture-api';
import type { BibleVerse } from '@/lib/scripture-api';

export default function TestScriptureAPI() {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConfigured, setApiConfigured] = useState(false);

  useEffect(() => {
    setApiConfigured(isScriptureApiConfigured());
  }, []);

  const loadChapter = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar João 3 na versão NVI
      const result = await fetchChapter('NVI', 'João', 3);
      setVerses(result);
      
      if (result.length === 0) {
        setError('Nenhum versículo encontrado. Verifique a configuração da API.');
      }
    } catch (err) {
      setError('Erro ao buscar capítulo: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testVerse = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar João 3:16
      const text = await fetchVerse('NVI', 'João', 3, 16);
      
      if (text) {
        setVerses([{ number: 16, text }]);
      } else {
        setError('Versículo não encontrado');
      }
    } catch (err) {
      setError('Erro ao buscar versículo: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Teste da Scripture API
          </h1>
          
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              apiConfigured ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                apiConfigured ? 'bg-green-500' : 'bg-red-500'
              }`} />
              {apiConfigured ? 'API Configurada' : 'API Não Configurada'}
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={testVerse}
              disabled={loading || !apiConfigured}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Carregando...' : 'Buscar João 3:16'}
            </button>

            <button
              onClick={loadChapter}
              disabled={loading || !apiConfigured}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Carregando...' : 'Buscar João 3 (completo)'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!apiConfigured && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold mb-2">⚠️ API não configurada</p>
              <p className="text-sm">
                Certifique-se de que as variáveis de ambiente estão configuradas:
                <br />
                <code className="bg-amber-100 px-2 py-1 rounded mt-2 inline-block">
                  NEXT_PUBLIC_BIBLE_API_KEY
                </code>
                <br />
                <code className="bg-amber-100 px-2 py-1 rounded mt-1 inline-block">
                  NEXT_PUBLIC_BIBLE_API_ENDPOINT
                </code>
              </p>
            </div>
          )}

          {verses.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Resultado ({verses.length} versículo{verses.length > 1 ? 's' : ''})
              </h2>
              <div className="space-y-3">
                {verses.map((verse) => (
                  <p key={verse.number} className="text-gray-700 leading-relaxed">
                    <span className="inline-block w-8 font-bold text-blue-600 mr-2">
                      {verse.number}
                    </span>
                    {verse.text}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📖 Como usar no código
          </h2>
          
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm">
{`import { fetchChapter, fetchVerse } from '@/lib/scripture-api';

// Buscar um versículo
const verse = await fetchVerse('NVI', 'João', 3, 16);
console.log(verse); // Texto do versículo

// Buscar capítulo completo
const chapter = await fetchChapter('NVI', 'João', 3);
chapter.forEach(v => {
  console.log(\`\${v.number}: \${v.text}\`);
});`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
