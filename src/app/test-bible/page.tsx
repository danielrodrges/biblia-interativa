'use client';

import { useEffect, useState } from 'react';
import { loadBibleChapter, BibleChapter } from '@/lib/bible-loader';

export default function TestBiblePage() {
  const [result, setResult] = useState<string>('Carregando...');
  const [chapter, setChapter] = useState<BibleChapter | null>(null);

  useEffect(() => {
    async function test() {
      try {
        console.log('Iniciando teste de loadBibleChapter...');
        
        // Teste 1: NVI (GitHub)
        console.log('Teste 1: Carregando João 1 (NVI)...');
        const nviChapter = await loadBibleChapter('JHN', 1, 'NVI');
        
        if (!nviChapter) {
          setResult('❌ Erro: loadBibleChapter retornou null para NVI');
          console.error('NVI retornou null');
          return;
        }

        console.log('✅ NVI carregado:', nviChapter);
        setChapter(nviChapter);
        setResult(`✅ Sucesso! João 1 (NVI) - ${nviChapter.verses.length} versículos carregados`);
      } catch (error: any) {
        console.error('❌ Erro no teste:', error);
        setResult(`❌ Erro: ${error.message}`);
      }
    }

    test();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Teste de Carregamento da Bíblia</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status:</h2>
          <p className="text-lg">{result}</p>
        </div>

        {chapter && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {chapter.bookName} {chapter.chapter} ({chapter.version})
            </h2>
            
            <div className="space-y-3">
              {chapter.verses.slice(0, 5).map((verse) => (
                <div key={verse.number} className="flex gap-3">
                  <span className="font-semibold text-blue-600 min-w-[2rem]">
                    {verse.number}
                  </span>
                  <p className="text-gray-700">{verse.text}</p>
                </div>
              ))}
              
              {chapter.verses.length > 5 && (
                <p className="text-gray-500 italic">
                  ... e mais {chapter.verses.length - 5} versículos
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
