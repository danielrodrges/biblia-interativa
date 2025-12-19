/**
 * Sugestões de leitura bíblica baseadas em emoções e necessidades
 */

export interface ReadingSuggestion {
  id: string;
  emotion: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  book: string;
  bookCode: string;
  chapter: number;
  verse?: string;
  preview: string;
}

export const readingSuggestions: ReadingSuggestion[] = [
  {
    id: 'peace',
    emotion: 'Paz',
    title: 'Preciso de Paz',
    description: 'Encontre tranquilidade e descanso para sua alma',
    icon: '🕊️',
    color: 'from-blue-400 to-blue-600',
    gradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
    book: 'João',
    bookCode: 'JHN',
    chapter: 14,
    verse: '27',
    preview: 'Deixo-vos a paz, a minha paz vos dou...'
  },
  {
    id: 'hope',
    emotion: 'Esperança',
    title: 'Busco Esperança',
    description: 'Renove sua fé e veja um futuro melhor',
    icon: '🌅',
    color: 'from-amber-400 to-orange-600',
    gradient: 'bg-gradient-to-br from-amber-50 to-orange-100',
    book: 'Jeremias',
    bookCode: 'JER',
    chapter: 29,
    verse: '11',
    preview: 'Porque eu bem sei os pensamentos que tenho a vosso respeito...'
  },
  {
    id: 'strength',
    emotion: 'Força',
    title: 'Preciso de Força',
    description: 'Encontre coragem para enfrentar seus desafios',
    icon: '💪',
    color: 'from-red-400 to-red-600',
    gradient: 'bg-gradient-to-br from-red-50 to-red-100',
    book: 'Josué',
    bookCode: 'JOS',
    chapter: 1,
    verse: '9',
    preview: 'Esforça-te, e tem bom ânimo; não temas...'
  },
  {
    id: 'comfort',
    emotion: 'Conforto',
    title: 'Busco Conforto',
    description: 'Receba o consolo divino em tempos difíceis',
    icon: '🤗',
    color: 'from-purple-400 to-purple-600',
    gradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
    book: 'Salmos',
    bookCode: 'PSA',
    chapter: 23,
    verse: '1',
    preview: 'O Senhor é o meu pastor, nada me faltará...'
  },
  {
    id: 'wisdom',
    emotion: 'Sabedoria',
    title: 'Busco Sabedoria',
    description: 'Receba direção e discernimento divino',
    icon: '🧠',
    color: 'from-indigo-400 to-indigo-600',
    gradient: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    book: 'Provérbios',
    bookCode: 'PRO',
    chapter: 3,
    verse: '5-6',
    preview: 'Confia no Senhor de todo o teu coração...'
  },
  {
    id: 'joy',
    emotion: 'Alegria',
    title: 'Quero Celebrar',
    description: 'Cultive gratidão e alegria no Senhor',
    icon: '🎉',
    color: 'from-yellow-400 to-yellow-600',
    gradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    book: 'Salmos',
    bookCode: 'PSA',
    chapter: 100,
    verse: '1-2',
    preview: 'Celebrai com júbilo ao Senhor...'
  },
  {
    id: 'love',
    emotion: 'Amor',
    title: 'Sobre o Amor',
    description: 'Compreenda o amor verdadeiro e incondicional',
    icon: '❤️',
    color: 'from-pink-400 to-pink-600',
    gradient: 'bg-gradient-to-br from-pink-50 to-pink-100',
    book: '1 Coríntios',
    bookCode: '1CO',
    chapter: 13,
    verse: '4-8',
    preview: 'O amor é paciente, o amor é bondoso...'
  },
  {
    id: 'guidance',
    emotion: 'Direção',
    title: 'Preciso de Direção',
    description: 'Encontre o caminho certo para sua vida',
    icon: '🧭',
    color: 'from-teal-400 to-teal-600',
    gradient: 'bg-gradient-to-br from-teal-50 to-teal-100',
    book: 'Salmos',
    bookCode: 'PSA',
    chapter: 119,
    verse: '105',
    preview: 'Lâmpada para os meus pés é a tua palavra...'
  },
  {
    id: 'faith',
    emotion: 'Fé',
    title: 'Fortalecer minha Fé',
    description: 'Cresça em confiança e certeza em Deus',
    icon: '⛪',
    color: 'from-cyan-400 to-cyan-600',
    gradient: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
    book: 'Hebreus',
    bookCode: 'HEB',
    chapter: 11,
    verse: '1',
    preview: 'Ora, a fé é o firme fundamento das coisas que se esperam...'
  },
  {
    id: 'forgiveness',
    emotion: 'Perdão',
    title: 'Sobre Perdão',
    description: 'Aprenda a perdoar e ser perdoado',
    icon: '🙏',
    color: 'from-green-400 to-green-600',
    gradient: 'bg-gradient-to-br from-green-50 to-green-100',
    book: 'Mateus',
    bookCode: 'MAT',
    chapter: 6,
    verse: '14-15',
    preview: 'Porque, se perdoardes aos homens as suas ofensas...'
  },
  {
    id: 'anxiety',
    emotion: 'Ansiedade',
    title: 'Contra Ansiedade',
    description: 'Liberte-se das preocupações e medos',
    icon: '🌿',
    color: 'from-emerald-400 to-emerald-600',
    gradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    book: 'Filipenses',
    bookCode: 'PHP',
    chapter: 4,
    verse: '6-7',
    preview: 'Não andeis ansiosos por coisa alguma...'
  },
  {
    id: 'gratitude',
    emotion: 'Gratidão',
    title: 'Cultivar Gratidão',
    description: 'Reconheça as bênçãos e seja grato',
    icon: '🌟',
    color: 'from-violet-400 to-violet-600',
    gradient: 'bg-gradient-to-br from-violet-50 to-violet-100',
    book: '1 Tessalonicenses',
    bookCode: '1TH',
    chapter: 5,
    verse: '18',
    preview: 'Em tudo dai graças, porque esta é a vontade de Deus...'
  }
];

/**
 * Retorna sugestões aleatórias para exibir
 */
export function getRandomSuggestions(count: number = 4): ReadingSuggestion[] {
  const shuffled = [...readingSuggestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Busca uma sugestão específica por ID
 */
export function getSuggestionById(id: string): ReadingSuggestion | undefined {
  return readingSuggestions.find(s => s.id === id);
}
