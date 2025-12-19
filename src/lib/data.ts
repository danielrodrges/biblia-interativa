// Dados fictícios para demonstração

import { Language, BibleVersion, Book, Chapter, Exercise } from './types';

export const availableLanguages: Language[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export const bibleVersions: BibleVersion[] = [
  // Versões em Português (Brasil) - Disponíveis via GitHub e Scripture API
  { id: 'nvi-pt', languageCode: 'pt', name: 'Nova Versão Internacional', abbreviation: 'NVI' },
  { id: 'acf-pt', languageCode: 'pt', name: 'Almeida Corrigida e Fiel', abbreviation: 'ACF' },
  { id: 'aa-pt', languageCode: 'pt', name: 'Almeida Revisada Imprensa Bíblica', abbreviation: 'AA' },
  
  // Versões em Inglês - Disponíveis via Scripture API
  { id: 'kjv-en', languageCode: 'en', name: 'King James Version', abbreviation: 'KJV' },
  { id: 'niv-en', languageCode: 'en', name: 'New International Version', abbreviation: 'NIV' },
];

export const bibleBooks: Book[] = [
  { id: 'genesis', name: 'Gênesis', chapters: 50 },
  { id: 'exodus', name: 'Êxodo', chapters: 40 },
  { id: 'psalms', name: 'Salmos', chapters: 150 },
  { id: 'proverbs', name: 'Provérbios', chapters: 31 },
  { id: 'matthew', name: 'Mateus', chapters: 28 },
  { id: 'john', name: 'João', chapters: 21 },
  { id: 'romans', name: 'Romanos', chapters: 16 },
  { id: 'corinthians1', name: '1 Coríntios', chapters: 16 },
];

export const sampleChapter: Chapter = {
  book: 'João',
  chapter: 3,
  verses: [
    { number: 16, text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
    { number: 17, text: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' },
    { number: 18, text: 'Quem crê nele não é condenado; mas quem não crê já está condenado, porquanto não crê no nome do unigênito Filho de Deus.' },
  ],
};

export const sampleChapterEnglish: Chapter = {
  book: 'John',
  chapter: 3,
  verses: [
    { number: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
    { number: 17, text: 'For God did not send his Son into the world to condemn the world, but to save the world through him.' },
    { number: 18, text: 'Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God\'s one and only Son.' },
  ],
};

export const verseOfTheDay = {
  reference: 'João 3:16',
  nativeText: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
  learningText: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
};

export const sampleExercises: Exercise[] = [
  {
    id: '1',
    type: 'vocabulary',
    verse: {
      reference: 'João 3:16',
      nativeText: 'Porque Deus amou o mundo...',
      learningText: 'For God so loved the world...',
    },
    words: [
      { native: 'amou', learning: 'loved', context: 'Deus amou o mundo' },
      { native: 'mundo', learning: 'world', context: 'o mundo de tal maneira' },
      { native: 'vida eterna', learning: 'eternal life', context: 'tenha a vida eterna' },
      { native: 'crê', learning: 'believes', context: 'todo aquele que nele crê' },
    ],
  },
  {
    id: '2',
    type: 'translation',
    verse: {
      reference: 'João 3:17',
      nativeText: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.',
      learningText: 'For God did not send his Son into the world to condemn the world, but to save the world through him.',
    },
  },
  {
    id: '3',
    type: 'meditation',
    verse: {
      reference: 'João 3:16',
      nativeText: 'Porque Deus amou o mundo...',
      learningText: 'For God so loved the world...',
    },
    meditation: {
      native: 'Este versículo nos lembra do amor incondicional de Deus. Ele não apenas nos ama, mas demonstrou esse amor através do maior presente: seu próprio Filho. Hoje, reflita sobre como você pode compartilhar esse amor com as pessoas ao seu redor.',
      learning: 'This verse reminds us of God\'s unconditional love. He not only loves us but demonstrated that love through the greatest gift: His own Son. Today, reflect on how you can share this love with the people around you.',
    },
  },
];
