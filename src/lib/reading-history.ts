/**
 * Sistema de histórico de leitura e geração de exercícios
 */

export interface ReadingEntry {
  book: string;
  chapter: number;
  verses: number[];
  timestamp: number;
  audioLanguage?: string; // idioma que foi ouvido em voz alta
  portugueseWords: string[];
  translatedWords: { [language: string]: string[] };
}

export interface VocabularyExercise {
  id: string;
  word: string; // palavra no idioma de prática
  portugueseWord: string; // palavra em português
  options: string[]; // 4 opções em português
  correctAnswer: string; // resposta correta em português
  context: string; // contexto da passagem
  reference: string; // referência bíblica (ex: "João 3:16")
}

const STORAGE_KEY = 'bible-reading-history';
const MAX_ENTRIES = 50;

/**
 * Salva uma entrada de leitura no histórico
 */
export function saveReadingEntry(entry: ReadingEntry) {
  try {
    const history = getReadingHistory();
    history.unshift(entry);
    
    // Limita o tamanho do histórico
    if (history.length > MAX_ENTRIES) {
      history.splice(MAX_ENTRIES);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Erro ao salvar histórico de leitura:', error);
  }
}

/**
 * Obtém todo o histórico de leitura
 */
export function getReadingHistory(): ReadingEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao carregar histórico de leitura:', error);
    return [];
  }
}

/**
 * Limpa o histórico de leitura
 */
export function clearReadingHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
  }
}

/**
 * Extrai palavras-chave de um verso (remove artigos, preposições, etc)
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
    'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos',
    'para', 'por', 'com', 'sem', 'sob', 'sobre',
    'e', 'ou', 'mas', 'porém', 'contudo',
    'que', 'qual', 'quais', 'quando', 'onde',
    'é', 'são', 'foi', 'foram', 'ser', 'estar',
    'ele', 'ela', 'eles', 'elas', 'seu', 'sua', 'seus', 'suas'
  ]);
  
  const words = text
    .toLowerCase()
    .replace(/[.,!?;:()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  return words;
}

/**
 * Gera exercícios de vocabulário baseados no histórico de leitura
 */
export function generateVocabularyExercises(
  language: 'en-US' | 'es-ES' | 'it-IT' | 'fr-FR',
  count: number = 10,
  preferAudioLanguage: boolean = true // prioriza idioma de áudio se true
): VocabularyExercise[] {
  const history = getReadingHistory();
  if (history.length === 0) {
    return [];
  }
  
  const exercises: VocabularyExercise[] = [];
  const usedWords = new Set<string>();
  
  // Coleta todas as palavras disponíveis com suas traduções
  const wordPairs: Array<{
    pt: string;
    translated: string;
    context: string;
    reference: string;
  }> = [];
  
  for (const entry of history) {
    const langKey = language.split('-')[0]; // 'en', 'es', 'it', 'fr'
    const translatedWords = entry.translatedWords[langKey] || [];
    
    if (translatedWords.length > 0 && entry.portugueseWords.length > 0) {
      // Cria pares de palavras PT <-> outro idioma
      const minLength = Math.min(entry.portugueseWords.length, translatedWords.length);
      
      for (let i = 0; i < minLength; i++) {
        const ptWord = entry.portugueseWords[i];
        const translatedWord = translatedWords[i];
        
        // Filtra palavras muito curtas ou duplicadas
        if (ptWord && 
            translatedWord && 
            ptWord.length > 3 && 
            translatedWord.length > 3 &&
            !usedWords.has(translatedWord.toLowerCase())) {
          
          wordPairs.push({
            pt: ptWord,
            translated: translatedWord,
            context: `${entry.book} ${entry.chapter}:${entry.verses[0] || 1}`,
            reference: `${entry.book} ${entry.chapter}`,
          });
          
          usedWords.add(translatedWord.toLowerCase());
        }
      }
    }
  }
  
  if (wordPairs.length < 4) {
    return []; // Precisa de pelo menos 4 palavras únicas para criar um exercício
  }
  
  // Shuffle das palavras disponíveis
  const shuffled = wordPairs.sort(() => Math.random() - 0.5);
  
  // Gera exercícios (no máximo o número solicitado ou disponível)
  const numExercises = Math.min(count, shuffled.length);
  
  for (let i = 0; i < numExercises; i++) {
    const target = shuffled[i];
    
    // Gera 3 opções incorretas únicas
    const wrongOptions: string[] = [];
    const usedOptions = new Set([target.pt]);
    
    for (const word of shuffled) {
      if (!usedOptions.has(word.pt) && word.pt !== target.pt) {
        wrongOptions.push(word.pt);
        usedOptions.add(word.pt);
      }
      if (wrongOptions.length === 3) break;
    }
    
    // Se não tem opções suficientes, pula este exercício
    if (wrongOptions.length < 3) continue;
    
    // Cria o exercício com opções embaralhadas
    const options = [target.pt, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    exercises.push({
      id: `vocab_${i}_${Date.now()}_${Math.random()}`,
      word: target.translated,
      portugueseWord: target.pt,
      options,
      correctAnswer: target.pt,
      context: target.context,
      reference: target.reference,
    });
  }
  
  return exercises;
}

/**
 * Obtém estatísticas de leitura
 */
export function getReadingStats() {
  const history = getReadingHistory();
  
  const uniqueChapters = new Set(
    history.map(entry => `${entry.book}-${entry.chapter}`)
  );
  
  const totalVerses = history.reduce((sum, entry) => sum + entry.verses.length, 0);
  
  const languagesUsed = new Set<string>();
  history.forEach(entry => {
    Object.keys(entry.translatedWords).forEach(lang => languagesUsed.add(lang));
  });
  
  return {
    totalChapters: uniqueChapters.size,
    totalVerses,
    totalReadings: history.length,
    languagesUsed: Array.from(languagesUsed),
    lastReading: history[0] || null,
  };
}
