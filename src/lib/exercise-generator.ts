import { supabase } from './supabase';

export interface ExerciseQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'order-words' | 'match-pairs';
  question: string;
  verse: {
    text: string;
    reference: string;
    book: string;
    chapter: number;
    verse: number;
  };
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface ExerciseSet {
  title: string;
  description: string;
  questions: ExerciseQuestion[];
  totalPoints: number;
}

// Gerar exercício de múltipla escolha - completar versículo
export async function generateFillVerseExercise(book: string, chapter: number): Promise<ExerciseQuestion | null> {
  try {
    if (!supabase) {
      console.error('Supabase não inicializado');
      return null;
    }

    // Buscar versículos do capítulo
    const { data: verses, error } = await supabase
      .from('bible_verses')
      .select('verse_number, text')
      .eq('version_id', 1) // NVI
      .eq('book_id', getBookId(book))
      .eq('chapter', chapter)
      .order('verse_number')
      .limit(10);

    if (error || !verses || verses.length === 0) {
      return null;
    }

    // Escolher versículo aleatório
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    const words = randomVerse.text.split(' ');
    
    // Escolher palavra para remover (não a primeira nem última)
    const wordIndex = Math.floor(Math.random() * (words.length - 2)) + 1;
    const correctWord = words[wordIndex];
    
    // Criar versão com lacuna
    const verseWithBlank = words.map((w: string, i: number) => i === wordIndex ? '____' : w).join(' ');
    
    // Gerar palavras alternativas (da mesma categoria gramatical se possível)
    const alternatives = await generateAlternatives(correctWord, verses);
    const options = shuffleArray([correctWord, ...alternatives]).slice(0, 4);

    return {
      id: `fill-${book}-${chapter}-${randomVerse.verse_number}`,
      type: 'multiple-choice',
      question: `Complete o versículo:`,
      verse: {
        text: verseWithBlank,
        reference: `${book} ${chapter}:${randomVerse.verse_number}`,
        book,
        chapter,
        verse: randomVerse.verse_number,
      },
      options,
      correctAnswer: correctWord,
      explanation: `Texto completo: ${randomVerse.text}`,
    };
  } catch (error) {
    return null;
  }
}

// Gerar exercício de ordenar palavras
export async function generateOrderWordsExercise(book: string, chapter: number): Promise<ExerciseQuestion | null> {
  try {
    if (!supabase) return null;

    const { data: verses, error } = await supabase
      .from('bible_verses')
      .select('verse_number, text')
      .eq('version_id', 1)
      .eq('book_id', getBookId(book))
      .eq('chapter', chapter)
      .order('verse_number');

    if (error || !verses || verses.length === 0) return null;

    // Escolher versículo curto (5-10 palavras)
    const shortVerses = verses.filter(v => {
      const words = v.text.split(' ');
      return words.length >= 5 && words.length <= 10;
    });

    if (shortVerses.length === 0) return null;

    const randomVerse = shortVerses[Math.floor(Math.random() * shortVerses.length)];
    const words = randomVerse.text.split(' ');
    const shuffledWords = shuffleArray([...words]);

    return {
      id: `order-${book}-${chapter}-${randomVerse.verse_number}`,
      type: 'order-words',
      question: 'Ordene as palavras para formar o versículo correto:',
      verse: {
        text: shuffledWords.join(' '),
        reference: `${book} ${chapter}:${randomVerse.verse_number}`,
        book,
        chapter,
        verse: randomVerse.verse_number,
      },
      correctAnswer: words,
      explanation: `Ordem correta: ${randomVerse.text}`,
    };
  } catch (error) {
    return null;
  }
}

// Gerar exercício de identificar versículo
export async function generateIdentifyVerseExercise(book: string, chapter: number): Promise<ExerciseQuestion | null> {
  try {
    if (!supabase) return null;

    const { data: verses, error } = await supabase
      .from('bible_verses')
      .select('verse_number, text')
      .eq('version_id', 1)
      .eq('book_id', getBookId(book))
      .eq('chapter', chapter)
      .order('verse_number');

    if (error || !verses || verses.length < 4) return null;

    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    
    // Pegar 3 outros versículos do mesmo capítulo como alternativas
    const otherVerses = verses.filter(v => v.verse_number !== randomVerse.verse_number);
    const alternatives = shuffleArray(otherVerses).slice(0, 3);
    
    const options = shuffleArray([
      `${chapter}:${randomVerse.verse_number}`,
      ...alternatives.map(v => `${chapter}:${v.verse_number}`)
    ]);

    return {
      id: `identify-${book}-${chapter}-${randomVerse.verse_number}`,
      type: 'multiple-choice',
      question: 'Qual é a referência deste versículo?',
      verse: {
        text: randomVerse.text,
        reference: `${book} ${chapter}:${randomVerse.verse_number}`,
        book,
        chapter,
        verse: randomVerse.verse_number,
      },
      options,
      correctAnswer: `${chapter}:${randomVerse.verse_number}`,
    };
  } catch (error) {
    return null;
  }
}

// Gerar um conjunto completo de exercícios
export async function generateExerciseSet(book: string, chapter: number): Promise<ExerciseSet | null> {
  try {
    const exercises: ExerciseQuestion[] = [];

    // Gerar 2 exercícios de completar
    for (let i = 0; i < 2; i++) {
      const ex = await generateFillVerseExercise(book, chapter);
      if (ex) exercises.push(ex);
    }

    // Gerar 1 exercício de ordenar
    const orderEx = await generateOrderWordsExercise(book, chapter);
    if (orderEx) exercises.push(orderEx);

    // Gerar 2 exercícios de identificar
    for (let i = 0; i < 2; i++) {
      const ex = await generateIdentifyVerseExercise(book, chapter);
      if (ex) exercises.push(ex);
    }

    if (exercises.length === 0) return null;

    return {
      title: `Exercícios - ${book} ${chapter}`,
      description: `Pratique seu conhecimento do capítulo ${chapter} de ${book}`,
      questions: exercises,
      totalPoints: exercises.length * 10,
    };
  } catch (error) {
    return null;
  }
}

// Helpers
function getBookId(bookName: string): number {
  const bookMap: { [key: string]: number } = {
    'genesis': 1,
    'gênesis': 1,
    'exodus': 2,
    'êxodo': 2,
    'leviticus': 3,
    'levítico': 3,
    'numbers': 4,
    'números': 4,
    'deuteronomy': 5,
    'deuteronômio': 5,
    'joão': 43,
    'john': 43,
    'mateus': 40,
    'matthew': 40,
    'marcos': 41,
    'mark': 41,
    'lucas': 42,
    'luke': 42,
  };
  return bookMap[bookName.toLowerCase()] || 1;
}

async function generateAlternatives(word: string, verses: any[]): Promise<string[]> {
  // Coletar palavras similares dos versículos
  const allWords = verses
    .flatMap(v => v.text.split(' '))
    .map(w => w.replace(/[.,;:!?]/g, ''))
    .filter(w => w.length >= 3 && w.toLowerCase() !== word.toLowerCase());
  
  // Remover duplicatas e embaralhar
  const uniqueWords = [...new Set(allWords)];
  const shuffled = shuffleArray(uniqueWords);
  
  return shuffled.slice(0, 3);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
