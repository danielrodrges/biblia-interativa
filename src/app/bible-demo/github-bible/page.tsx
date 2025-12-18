'use client';

import { useState } from 'react';
import { 
  fetchChapterFromGitHub, 
  fetchVerseFromGitHub,
  searchVerses,
  listBooks,
  getBibleStats,
  type GitHubBibleVersion,
  type GitHubBibleVerse,
  GITHUB_BIBLE_VERSIONS
} from '@/lib/github-bible';
import { BookOpen, Search, BarChart3, Book } from 'lucide-react';

export default function GitHubBibleTestPage() {
  const [version, setVersion] = useState<GitHubBibleVersion>('nvi');
  const [verses, setVerses] = useState<GitHubBibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);

  const loadChapter = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchChapterFromGitHub(version, 'João', 3);
      setVerses(result);
      
      if (result.length === 0) {
        setError('Nenhum versículo encontrado');
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
      const text = await fetchVerseFromGitHub(version, 'João', 3, 16);
      
      if (text) {
        setVerses([{
          book: 'João',
          bookAbbrev: 'jn',
          chapter: 3,
          verse: 16,
          text,
        }]);
      } else {
        setError('Versículo não encontrado');
      }
    } catch (err) {
      setError('Erro ao buscar versículo: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const searchWord = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchVerses(version, 'amor', 10);
      setVerses(results);
      
      if (results.length === 0) {
        setError('Nenhum resultado encontrado');
      }
    } catch (err) {
      setError('Erro ao buscar: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getBibleStats(version);
      setStats(data);
    } catch (err) {
      setError('Erro ao carregar estatísticas: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadBooksList = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await listBooks(version);
      setBooks(data);
    } catch (err) {
      setError('Erro ao listar livros: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              GitHub Bible Integration
            </h1>
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              📚 <strong>Fonte:</strong> <a 
                href="https://github.com/thiagobodruk/biblia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                thiagobodruk/biblia
              </a>
              <br />
              🎯 <strong>Formato:</strong> JSON completo (sem necessidade de API key)
              <br />
              ✨ <strong>Versões:</strong> NVI, ACF, AA
            </p>
          </div>

          {/* Seletor de Versão */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Versão da Bíblia
            </label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as GitHubBibleVersion)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="nvi">NVI - Nova Versão Internacional</option>
              <option value="acf">ACF - Almeida Corrigida e Fiel</option>
              <option value="aa">AA - Almeida Revisada</option>
            </select>
          </div>

          {/* Botões de Teste */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={testVerse}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              João 3:16
            </button>

            <button
              onClick={loadChapter}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              <Book className="w-5 h-5" />
              João 3
            </button>

            <button
              onClick={searchWord}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 disabled:bg-gray-300 transition-colors"
            >
              <Search className="w-5 h-5" />
              Buscar "amor"
            </button>

            <button
              onClick={loadStats}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 disabled:bg-gray-300 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              Estatísticas
            </button>

            <button
              onClick={loadBooksList}
              disabled={loading}
              className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-300 transition-colors"
            >
              <Book className="w-5 h-5" />
              Listar Livros
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Estatísticas */}
          {stats && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Estatísticas</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{stats.books}</div>
                  <div className="text-sm text-gray-600">Livros</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{stats.chapters}</div>
                  <div className="text-sm text-gray-600">Capítulos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{stats.verses.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Versículos</div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Livros */}
          {books.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 mb-6 max-h-96 overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Livros ({books.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {books.map((book, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-semibold text-gray-800 text-sm">{book.name}</div>
                    <div className="text-xs text-gray-500">{book.chapters} capítulos</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resultados */}
          {verses.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📖 Resultado ({verses.length} versículo{verses.length > 1 ? 's' : ''})
              </h2>
              <div className="space-y-4">
                {verses.map((verse, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-sm font-semibold text-purple-600 mb-2">
                      {verse.book} {verse.chapter}:{verse.verse}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {verse.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Documentação */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💻 Como usar no código</h2>
          
          <div className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm">
{`import { 
  fetchChapterFromGitHub, 
  fetchVerseFromGitHub,
  searchVerses 
} from '@/lib/github-bible';

// Buscar versículo
const verse = await fetchVerseFromGitHub('nvi', 'João', 3, 16);

// Buscar capítulo completo  
const chapter = await fetchChapterFromGitHub('nvi', 'João', 3);

// Buscar palavra
const results = await searchVerses('nvi', 'amor', 50);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
