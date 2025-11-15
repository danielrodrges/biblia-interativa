// Dados dos Apóstolos e seus escritos

export interface Apostle {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  books: string[];
}

export interface Chapter {
  number: number;
  title: string;
  book: string;
  chapter: number;
  verses: string;
  content: string;
  duration: string; // "5 min"
}

export interface Exercise {
  afterChapter: number; // 3, 6 ou 10
  questions: ExerciseQuestion[];
  bonusMultiplier: number; // 1.0, 1.2 ou 1.5
}

export interface ExerciseQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

export interface ReadingPlan {
  id: string;
  apostleId: string;
  level: 'iniciante' | 'fundamentos' | 'aprofundamento' | 'maturidade' | 'avancado';
  title: string;
  description: string;
  chapters: Chapter[]; // sempre 10 capítulos
  exercises: Exercise[]; // sempre 3 exercícios (após cap 3, 6 e 10)
  totalPoints: number;
  medal: string;
}

export const apostles: Apostle[] = [
  {
    id: 'paulo',
    name: 'Paulo',
    description: 'O apóstolo dos gentios, autor de 13 cartas do Novo Testamento',
    color: '#3B82F6',
    icon: '✍️',
    books: ['Romanos', 'Coríntios', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses', 'Tessalonicenses', 'Timóteo', 'Tito', 'Filemom']
  },
  {
    id: 'pedro',
    name: 'Pedro',
    description: 'O primeiro líder da igreja, pescador escolhido por Jesus',
    color: '#10B981',
    icon: '🎣',
    books: ['1 Pedro', '2 Pedro']
  },
  {
    id: 'joao',
    name: 'João',
    description: 'O discípulo amado, autor do Evangelho e do Apocalipse',
    color: '#8B5CF6',
    icon: '❤️',
    books: ['João', '1 João', '2 João', '3 João', 'Apocalipse']
  },
  {
    id: 'tiago',
    name: 'Tiago',
    description: 'Irmão de Jesus, líder da igreja em Jerusalém',
    color: '#F59E0B',
    icon: '⚖️',
    books: ['Tiago']
  }
];

// Planos de Leitura - 5 planos por apóstolo, 10 capítulos cada
export const readingPlans: ReadingPlan[] = [
  // PAULO - Plano 1: Iniciante
  {
    id: 'paulo-1-iniciante',
    apostleId: 'paulo',
    level: 'iniciante',
    title: 'Primeiros Passos na Fé',
    description: 'Introdução aos ensinamentos básicos de Paulo sobre fé e salvação',
    totalPoints: 300,
    medal: '🥉',
    chapters: [
      { number: 1, title: 'O Amor Verdadeiro', book: '1 Coríntios', chapter: 13, verses: '1-3', content: 'Introdução ao amor ágape', duration: '3 min' },
      { number: 2, title: 'Características do Amor', book: '1 Coríntios', chapter: 13, verses: '4-7', content: 'O amor é paciente e bondoso', duration: '3 min' },
      { number: 3, title: 'O Amor Permanece', book: '1 Coríntios', chapter: 13, verses: '8-13', content: 'A permanência do amor', duration: '3 min' },
      { number: 4, title: 'Salvos pela Graça', book: 'Efésios', chapter: 2, verses: '1-5', content: 'Mortos em pecado, vivos em Cristo', duration: '3 min' },
      { number: 5, title: 'Dom de Deus', book: 'Efésios', chapter: 2, verses: '6-10', content: 'Salvação é presente de Deus', duration: '3 min' },
      { number: 6, title: 'Nova Criatura', book: '2 Coríntios', chapter: 5, verses: '17-21', content: 'Em Cristo somos novas criaturas', duration: '3 min' },
      { number: 7, title: 'Paz com Deus', book: 'Romanos', chapter: 5, verses: '1-5', content: 'Justificados pela fé', duration: '3 min' },
      { number: 8, title: 'Nada nos Separa', book: 'Romanos', chapter: 8, verses: '35-39', content: 'O amor de Cristo', duration: '3 min' },
      { number: 9, title: 'Viver é Cristo', book: 'Filipenses', chapter: 1, verses: '21-26', content: 'O propósito de viver', duration: '3 min' },
      { number: 10, title: 'Alegria no Senhor', book: 'Filipenses', chapter: 4, verses: '4-7', content: 'Alegria e paz em todas as circunstâncias', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          {
            id: 'p1-ex1-q1',
            type: 'multiple-choice',
            question: 'Segundo Paulo, o que acontece se falarmos línguas dos anjos mas não tivermos amor?',
            options: ['Seremos abençoados', 'Seremos como bronze que soa', 'Seremos sábios', 'Seremos profetas'],
            correctAnswer: 1,
            points: 10
          },
          {
            id: 'p1-ex1-q2',
            type: 'true-false',
            question: 'O amor é paciente e bondoso.',
            correctAnswer: 0,
            points: 10
          },
          {
            id: 'p1-ex1-q3',
            type: 'multiple-choice',
            question: 'Qual dessas características NÃO é do amor segundo Paulo?',
            options: ['É paciente', 'Inveja', 'É bondoso', 'Não se orgulha'],
            correctAnswer: 1,
            points: 10
          }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          {
            id: 'p1-ex2-q1',
            type: 'multiple-choice',
            question: 'Como somos salvos segundo Efésios 2?',
            options: ['Pelas nossas obras', 'Pela graça, mediante a fé', 'Pelo nosso esforço', 'Pela nossa bondade'],
            correctAnswer: 1,
            points: 10
          },
          {
            id: 'p1-ex2-q2',
            type: 'true-false',
            question: 'Em Cristo, somos novas criaturas.',
            correctAnswer: 0,
            points: 10
          },
          {
            id: 'p1-ex2-q3',
            type: 'multiple-choice',
            question: 'A salvação é um presente de quem?',
            options: ['De nós mesmos', 'Da igreja', 'De Deus', 'Dos apóstolos'],
            correctAnswer: 2,
            points: 10
          }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          {
            id: 'p1-ex3-q1',
            type: 'multiple-choice',
            question: 'O que Paulo diz que pode nos separar do amor de Cristo?',
            options: ['Tribulação', 'Angústia', 'Perseguição', 'Nada pode nos separar'],
            correctAnswer: 3,
            points: 10
          },
          {
            id: 'p1-ex3-q2',
            type: 'true-false',
            question: 'Para Paulo, viver é Cristo e morrer é lucro.',
            correctAnswer: 0,
            points: 10
          },
          {
            id: 'p1-ex3-q3',
            type: 'multiple-choice',
            question: 'O que devemos fazer em todas as circunstâncias segundo Filipenses 4?',
            options: ['Reclamar', 'Desistir', 'Alegrar-nos no Senhor', 'Ter medo'],
            correctAnswer: 2,
            points: 10
          }
        ]
      }
    ]
  },
  // PAULO - Plano 2: Fundamentos
  {
    id: 'paulo-2-fundamentos',
    apostleId: 'paulo',
    level: 'fundamentos',
    title: 'Fundamentos da Vida Cristã',
    description: 'Aprofunde-se nos princípios essenciais da fé cristã',
    totalPoints: 300,
    medal: '🥈',
    chapters: [
      { number: 1, title: 'O Fruto do Espírito', book: 'Gálatas', chapter: 5, verses: '16-18', content: 'Andar no Espírito', duration: '3 min' },
      { number: 2, title: 'Amor, Alegria e Paz', book: 'Gálatas', chapter: 5, verses: '22-23', content: 'Primeiros frutos', duration: '3 min' },
      { number: 3, title: 'Paciência e Bondade', book: 'Gálatas', chapter: 5, verses: '24-26', content: 'Crucificar a carne', duration: '3 min' },
      { number: 4, title: 'Armadura de Deus', book: 'Efésios', chapter: 6, verses: '10-13', content: 'Fortalecidos no Senhor', duration: '3 min' },
      { number: 5, title: 'Peças da Armadura', book: 'Efésios', chapter: 6, verses: '14-17', content: 'Verdade, justiça, fé', duration: '3 min' },
      { number: 6, title: 'Oração Constante', book: 'Efésios', chapter: 6, verses: '18-20', content: 'Orar em todo tempo', duration: '3 min' },
      { number: 7, title: 'Mente Renovada', book: 'Romanos', chapter: 12, verses: '1-2', content: 'Transformação pela renovação', duration: '3 min' },
      { number: 8, title: 'Dons Diversos', book: 'Romanos', chapter: 12, verses: '3-8', content: 'Cada um com seu dom', duration: '3 min' },
      { number: 9, title: 'Amor Sincero', book: 'Romanos', chapter: 12, verses: '9-13', content: 'Amor sem hipocrisia', duration: '3 min' },
      { number: 10, title: 'Vencer o Mal', book: 'Romanos', chapter: 12, verses: '14-21', content: 'Vencer o mal com o bem', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'p2-ex1-q1', type: 'multiple-choice', question: 'Qual é o primeiro fruto do Espírito mencionado?', options: ['Paz', 'Alegria', 'Amor', 'Paciência'], correctAnswer: 2, points: 10 },
          { id: 'p2-ex1-q2', type: 'true-false', question: 'Devemos andar segundo a carne.', correctAnswer: 1, points: 10 },
          { id: 'p2-ex1-q3', type: 'multiple-choice', question: 'Quantos frutos do Espírito Paulo menciona?', options: ['5', '7', '9', '12'], correctAnswer: 2, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'p2-ex2-q1', type: 'multiple-choice', question: 'Onde devemos nos fortalecer?', options: ['Em nós mesmos', 'No Senhor', 'Nos outros', 'Na igreja'], correctAnswer: 1, points: 10 },
          { id: 'p2-ex2-q2', type: 'true-false', question: 'A armadura de Deus nos protege contra as forças espirituais.', correctAnswer: 0, points: 10 },
          { id: 'p2-ex2-q3', type: 'multiple-choice', question: 'O que devemos fazer em todo tempo?', options: ['Dormir', 'Trabalhar', 'Orar', 'Comer'], correctAnswer: 2, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'p2-ex3-q1', type: 'multiple-choice', question: 'Como devemos ser transformados?', options: ['Pela força', 'Pela renovação da mente', 'Pelo esforço', 'Pela lei'], correctAnswer: 1, points: 10 },
          { id: 'p2-ex3-q2', type: 'true-false', question: 'Cada pessoa tem dons diferentes segundo a graça.', correctAnswer: 0, points: 10 },
          { id: 'p2-ex3-q3', type: 'multiple-choice', question: 'Como devemos vencer o mal?', options: ['Com mais mal', 'Com indiferença', 'Com o bem', 'Com vingança'], correctAnswer: 2, points: 10 }
        ]
      }
    ]
  },
  // PAULO - Plano 3: Aprofundamento
  {
    id: 'paulo-3-aprofundamento',
    apostleId: 'paulo',
    level: 'aprofundamento',
    title: 'Vida no Espírito',
    description: 'Compreenda a vida guiada pelo Espírito Santo',
    totalPoints: 300,
    medal: '🥇',
    chapters: [
      { number: 1, title: 'Libertos do Pecado', book: 'Romanos', chapter: 6, verses: '1-7', content: 'Mortos para o pecado', duration: '3 min' },
      { number: 2, title: 'Escravos da Justiça', book: 'Romanos', chapter: 6, verses: '15-23', content: 'Servos de Deus', duration: '3 min' },
      { number: 3, title: 'Luta Interior', book: 'Romanos', chapter: 7, verses: '14-25', content: 'O bem que quero fazer', duration: '3 min' },
      { number: 4, title: 'Vida no Espírito', book: 'Romanos', chapter: 8, verses: '1-8', content: 'Nenhuma condenação', duration: '3 min' },
      { number: 5, title: 'Filhos de Deus', book: 'Romanos', chapter: 8, verses: '9-17', content: 'Guiados pelo Espírito', duration: '3 min' },
      { number: 6, title: 'Sofrimento e Glória', book: 'Romanos', chapter: 8, verses: '18-25', content: 'Esperança da glória', duration: '3 min' },
      { number: 7, title: 'Intercessão do Espírito', book: 'Romanos', chapter: 8, verses: '26-30', content: 'O Espírito intercede', duration: '3 min' },
      { number: 8, title: 'Mais que Vencedores', book: 'Romanos', chapter: 8, verses: '31-34', content: 'Deus por nós', duration: '3 min' },
      { number: 9, title: 'Amor Inseparável', book: 'Romanos', chapter: 8, verses: '35-39', content: 'Nada nos separa', duration: '3 min' },
      { number: 10, title: 'Unidade em Cristo', book: 'Efésios', chapter: 4, verses: '1-6', content: 'Um só corpo', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'p3-ex1-q1', type: 'multiple-choice', question: 'Para que fomos batizados segundo Romanos 6?', options: ['Para a vida', 'Para a morte de Cristo', 'Para a igreja', 'Para o mundo'], correctAnswer: 1, points: 10 },
          { id: 'p3-ex1-q2', type: 'true-false', question: 'Somos escravos da justiça.', correctAnswer: 0, points: 10 },
          { id: 'p3-ex1-q3', type: 'multiple-choice', question: 'Paulo descreve uma luta entre o quê?', options: ['Bem e mal', 'Carne e espírito', 'Fé e obras', 'Graça e lei'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'p3-ex2-q1', type: 'multiple-choice', question: 'Há condenação para quem está em Cristo?', options: ['Sim, muita', 'Sim, pouca', 'Não, nenhuma', 'Depende'], correctAnswer: 2, points: 10 },
          { id: 'p3-ex2-q2', type: 'true-false', question: 'Somos filhos de Deus guiados pelo Espírito.', correctAnswer: 0, points: 10 },
          { id: 'p3-ex2-q3', type: 'multiple-choice', question: 'O que Paulo compara: sofrimento presente e...?', options: ['Glória futura', 'Tristeza', 'Dor', 'Medo'], correctAnswer: 0, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'p3-ex3-q1', type: 'multiple-choice', question: 'Quem intercede por nós?', options: ['A igreja', 'Os anjos', 'O Espírito Santo', 'Nós mesmos'], correctAnswer: 2, points: 10 },
          { id: 'p3-ex3-q2', type: 'true-false', question: 'Somos mais que vencedores em Cristo.', correctAnswer: 0, points: 10 },
          { id: 'p3-ex3-q3', type: 'multiple-choice', question: 'Quantos corpos há segundo Efésios 4?', options: ['Muitos', 'Dois', 'Um só', 'Três'], correctAnswer: 2, points: 10 }
        ]
      }
    ]
  },
  // PAULO - Plano 4: Maturidade
  {
    id: 'paulo-4-maturidade',
    apostleId: 'paulo',
    level: 'maturidade',
    title: 'Maturidade Espiritual',
    description: 'Cresça em sabedoria e conhecimento de Cristo',
    totalPoints: 300,
    medal: '🏆',
    chapters: [
      { number: 1, title: 'Sabedoria de Deus', book: '1 Coríntios', chapter: 2, verses: '6-10', content: 'Sabedoria oculta', duration: '3 min' },
      { number: 2, title: 'Espírito Revela', book: '1 Coríntios', chapter: 2, verses: '11-16', content: 'Mente de Cristo', duration: '3 min' },
      { number: 3, title: 'Templo do Espírito', book: '1 Coríntios', chapter: 3, verses: '16-23', content: 'Santuário de Deus', duration: '3 min' },
      { number: 4, title: 'Ministros de Cristo', book: '1 Coríntios', chapter: 4, verses: '1-5', content: 'Despenseiros dos mistérios', duration: '3 min' },
      { number: 5, title: 'Imitadores de Paulo', book: '1 Coríntios', chapter: 4, verses: '14-21', content: 'Pais na fé', duration: '3 min' },
      { number: 6, title: 'Conhecimento de Cristo', book: 'Filipenses', chapter: 3, verses: '7-11', content: 'Tudo como perda', duration: '3 min' },
      { number: 7, title: 'Prosseguir para o Alvo', book: 'Filipenses', chapter: 3, verses: '12-16', content: 'Esquecendo o passado', duration: '3 min' },
      { number: 8, title: 'Cidadãos do Céu', book: 'Filipenses', chapter: 3, verses: '17-21', content: 'Nossa pátria', duration: '3 min' },
      { number: 9, title: 'Pensar nas Coisas do Alto', book: 'Colossenses', chapter: 3, verses: '1-4', content: 'Buscar as coisas lá do alto', duration: '3 min' },
      { number: 10, title: 'Revestir-se do Novo', book: 'Colossenses', chapter: 3, verses: '5-14', content: 'Nova natureza', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'p4-ex1-q1', type: 'multiple-choice', question: 'Quem revela as coisas profundas de Deus?', options: ['Os sábios', 'O Espírito', 'A igreja', 'Os profetas'], correctAnswer: 1, points: 10 },
          { id: 'p4-ex1-q2', type: 'true-false', question: 'Temos a mente de Cristo.', correctAnswer: 0, points: 10 },
          { id: 'p4-ex1-q3', type: 'multiple-choice', question: 'Nosso corpo é templo de quem?', options: ['De nós', 'Do Espírito Santo', 'Da igreja', 'Dos anjos'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'p4-ex2-q1', type: 'multiple-choice', question: 'Como devemos ser vistos?', options: ['Como sábios', 'Como ministros de Cristo', 'Como perfeitos', 'Como santos'], correctAnswer: 1, points: 10 },
          { id: 'p4-ex2-q2', type: 'true-false', question: 'Paulo pede para sermos seus imitadores.', correctAnswer: 0, points: 10 },
          { id: 'p4-ex2-q3', type: 'multiple-choice', question: 'O que Paulo considera como perda?', options: ['Dinheiro', 'Tudo', 'Fama', 'Poder'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'p4-ex3-q1', type: 'multiple-choice', question: 'Para onde devemos prosseguir?', options: ['Para o passado', 'Para o alvo', 'Para o mundo', 'Para nós mesmos'], correctAnswer: 1, points: 10 },
          { id: 'p4-ex3-q2', type: 'true-false', question: 'Nossa pátria está nos céus.', correctAnswer: 0, points: 10 },
          { id: 'p4-ex3-q3', type: 'multiple-choice', question: 'Do que devemos nos revestir?', options: ['Do velho', 'Do mundo', 'Do novo homem', 'Da carne'], correctAnswer: 2, points: 10 }
        ]
      }
    ]
  },
  // PAULO - Plano 5: Avançado
  {
    id: 'paulo-5-avancado',
    apostleId: 'paulo',
    level: 'avancado',
    title: 'Ensinamentos Profundos',
    description: 'Explore os mistérios mais profundos da fé',
    totalPoints: 300,
    medal: '👑',
    chapters: [
      { number: 1, title: 'Eleição e Predestinação', book: 'Efésios', chapter: 1, verses: '3-6', content: 'Escolhidos antes da fundação', duration: '3 min' },
      { number: 2, title: 'Redenção pelo Sangue', book: 'Efésios', chapter: 1, verses: '7-12', content: 'Perdão dos pecados', duration: '3 min' },
      { number: 3, title: 'Selados com o Espírito', book: 'Efésios', chapter: 1, verses: '13-14', content: 'Garantia da herança', duration: '3 min' },
      { number: 4, title: 'Poder de Deus', book: 'Efésios', chapter: 1, verses: '15-23', content: 'Grandeza do poder', duration: '3 min' },
      { number: 5, title: 'Mistério de Cristo', book: 'Efésios', chapter: 3, verses: '1-6', content: 'Revelação do mistério', duration: '3 min' },
      { number: 6, title: 'Riquezas de Cristo', book: 'Efésios', chapter: 3, verses: '7-13', content: 'Insondáveis riquezas', duration: '3 min' },
      { number: 7, title: 'Amor de Cristo', book: 'Efésios', chapter: 3, verses: '14-21', content: 'Conhecer o amor', duration: '3 min' },
      { number: 8, title: 'Justificação pela Fé', book: 'Romanos', chapter: 3, verses: '21-26', content: 'Justiça de Deus', duration: '3 min' },
      { number: 9, title: 'Exemplo de Abraão', book: 'Romanos', chapter: 4, verses: '1-8', content: 'Fé creditada como justiça', duration: '3 min' },
      { number: 10, title: 'Promessa pela Fé', book: 'Romanos', chapter: 4, verses: '13-25', content: 'Herdeiros pela fé', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'p5-ex1-q1', type: 'multiple-choice', question: 'Quando fomos escolhidos em Cristo?', options: ['Ontem', 'Hoje', 'Antes da fundação do mundo', 'No futuro'], correctAnswer: 2, points: 10 },
          { id: 'p5-ex1-q2', type: 'true-false', question: 'Temos redenção pelo sangue de Cristo.', correctAnswer: 0, points: 10 },
          { id: 'p5-ex1-q3', type: 'multiple-choice', question: 'Com o que fomos selados?', options: ['Com água', 'Com fogo', 'Com o Espírito Santo', 'Com óleo'], correctAnswer: 2, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'p5-ex2-q1', type: 'multiple-choice', question: 'O que Paulo ora para conhecermos?', options: ['O mundo', 'O poder de Deus', 'A riqueza', 'A fama'], correctAnswer: 1, points: 10 },
          { id: 'p5-ex2-q2', type: 'true-false', question: 'O mistério de Cristo foi revelado aos apóstolos.', correctAnswer: 0, points: 10 },
          { id: 'p5-ex2-q3', type: 'multiple-choice', question: 'As riquezas de Cristo são...?', options: ['Limitadas', 'Pequenas', 'Insondáveis', 'Visíveis'], correctAnswer: 2, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'p5-ex3-q1', type: 'multiple-choice', question: 'Como somos justificados?', options: ['Pelas obras', 'Pela lei', 'Pela fé', 'Pelo esforço'], correctAnswer: 2, points: 10 },
          { id: 'p5-ex3-q2', type: 'true-false', question: 'Abraão é exemplo de fé.', correctAnswer: 0, points: 10 },
          { id: 'p5-ex3-q3', type: 'multiple-choice', question: 'A promessa vem pela...?', options: ['Lei', 'Fé', 'Obras', 'Tradição'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },

  // PEDRO - 5 Planos
  {
    id: 'pedro-1-iniciante',
    apostleId: 'pedro',
    level: 'iniciante',
    title: 'Esperança Viva',
    description: 'Descubra a esperança que temos em Cristo',
    totalPoints: 300,
    medal: '🥉',
    chapters: [
      { number: 1, title: 'Nova Vida', book: '1 Pedro', chapter: 1, verses: '3-5', content: 'Renascidos para esperança viva', duration: '3 min' },
      { number: 2, title: 'Alegria nas Provações', book: '1 Pedro', chapter: 1, verses: '6-9', content: 'Fé mais preciosa que ouro', duration: '3 min' },
      { number: 3, title: 'Salvação Anunciada', book: '1 Pedro', chapter: 1, verses: '10-12', content: 'Profetas investigaram', duration: '3 min' },
      { number: 4, title: 'Vida Santa', book: '1 Pedro', chapter: 1, verses: '13-16', content: 'Sede santos', duration: '3 min' },
      { number: 5, title: 'Resgatados', book: '1 Pedro', chapter: 1, verses: '17-21', content: 'Sangue precioso de Cristo', duration: '3 min' },
      { number: 6, title: 'Amor Fraternal', book: '1 Pedro', chapter: 1, verses: '22-25', content: 'Amai-vos ardentemente', duration: '3 min' },
      { number: 7, title: 'Leite Espiritual', book: '1 Pedro', chapter: 2, verses: '1-3', content: 'Desejai o leite puro', duration: '3 min' },
      { number: 8, title: 'Pedra Viva', book: '1 Pedro', chapter: 2, verses: '4-8', content: 'Cristo, pedra angular', duration: '3 min' },
      { number: 9, title: 'Povo de Deus', book: '1 Pedro', chapter: 2, verses: '9-10', content: 'Raça eleita', duration: '3 min' },
      { number: 10, title: 'Bom Testemunho', book: '1 Pedro', chapter: 2, verses: '11-12', content: 'Viver bem entre os gentios', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'pe1-ex1-q1', type: 'multiple-choice', question: 'Para que tipo de esperança fomos renascidos?', options: ['Esperança morta', 'Esperança viva', 'Esperança fraca', 'Esperança humana'], correctAnswer: 1, points: 10 },
          { id: 'pe1-ex1-q2', type: 'true-false', question: 'Nossa fé é mais preciosa que ouro.', correctAnswer: 0, points: 10 },
          { id: 'pe1-ex1-q3', type: 'multiple-choice', question: 'Quem investigou sobre a salvação?', options: ['Os reis', 'Os profetas', 'Os sacerdotes', 'Os escribas'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'pe1-ex2-q1', type: 'multiple-choice', question: 'Como devemos ser?', options: ['Comuns', 'Santos', 'Normais', 'Iguais ao mundo'], correctAnswer: 1, points: 10 },
          { id: 'pe1-ex2-q2', type: 'true-false', question: 'Fomos resgatados com sangue de Cristo.', correctAnswer: 0, points: 10 },
          { id: 'pe1-ex2-q3', type: 'multiple-choice', question: 'Como devemos amar uns aos outros?', options: ['Friamente', 'Às vezes', 'Ardentemente', 'Raramente'], correctAnswer: 2, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'pe1-ex3-q1', type: 'multiple-choice', question: 'O que devemos desejar como bebês?', options: ['Comida', 'Leite espiritual', 'Brinquedos', 'Sono'], correctAnswer: 1, points: 10 },
          { id: 'pe1-ex3-q2', type: 'true-false', question: 'Cristo é a pedra angular.', correctAnswer: 0, points: 10 },
          { id: 'pe1-ex3-q3', type: 'multiple-choice', question: 'O que somos segundo Pedro?', options: ['Povo comum', 'Raça eleita', 'Pessoas normais', 'Grupo qualquer'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'pedro-2-fundamentos',
    apostleId: 'pedro',
    level: 'fundamentos',
    title: 'Vida Submissa',
    description: 'Aprenda sobre submissão e humildade cristã',
    totalPoints: 300,
    medal: '🥈',
    chapters: [
      { number: 1, title: 'Submissão às Autoridades', book: '1 Pedro', chapter: 2, verses: '13-17', content: 'Por amor ao Senhor', duration: '3 min' },
      { number: 2, title: 'Servos e Senhores', book: '1 Pedro', chapter: 2, verses: '18-20', content: 'Suportar injustiças', duration: '3 min' },
      { number: 3, title: 'Exemplo de Cristo', book: '1 Pedro', chapter: 2, verses: '21-25', content: 'Sofreu por nós', duration: '3 min' },
      { number: 4, title: 'Esposas e Maridos', book: '1 Pedro', chapter: 3, verses: '1-7', content: 'Relacionamento conjugal', duration: '3 min' },
      { number: 5, title: 'Unidade na Igreja', book: '1 Pedro', chapter: 3, verses: '8-12', content: 'Todos de um mesmo sentimento', duration: '3 min' },
      { number: 6, title: 'Sofrer por Fazer o Bem', book: '1 Pedro', chapter: 3, verses: '13-17', content: 'Bem-aventurados', duration: '3 min' },
      { number: 7, title: 'Cristo Sofreu', book: '1 Pedro', chapter: 3, verses: '18-22', content: 'Justo pelos injustos', duration: '3 min' },
      { number: 8, title: 'Viver para Deus', book: '1 Pedro', chapter: 4, verses: '1-6', content: 'Não mais para paixões', duration: '3 min' },
      { number: 9, title: 'Amor Cobre Pecados', book: '1 Pedro', chapter: 4, verses: '7-11', content: 'Hospitalidade sem murmuração', duration: '3 min' },
      { number: 10, title: 'Alegria no Sofrimento', book: '1 Pedro', chapter: 4, verses: '12-19', content: 'Participar dos sofrimentos', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'pe2-ex1-q1', type: 'multiple-choice', question: 'Por que devemos nos submeter às autoridades?', options: ['Por medo', 'Por amor ao Senhor', 'Por obrigação', 'Por tradição'], correctAnswer: 1, points: 10 },
          { id: 'pe2-ex1-q2', type: 'true-false', question: 'Devemos suportar injustiças com paciência.', correctAnswer: 0, points: 10 },
          { id: 'pe2-ex1-q3', type: 'multiple-choice', question: 'Quem é nosso exemplo de sofrimento?', options: ['Pedro', 'Paulo', 'Cristo', 'João'], correctAnswer: 2, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'pe2-ex2-q1', type: 'multiple-choice', question: 'Como deve ser o relacionamento na igreja?', options: ['Dividido', 'Unido', 'Competitivo', 'Distante'], correctAnswer: 1, points: 10 },
          { id: 'pe2-ex2-q2', type: 'true-false', question: 'Somos bem-aventurados se sofrermos por fazer o bem.', correctAnswer: 0, points: 10 },
          { id: 'pe2-ex2-q3', type: 'multiple-choice', question: 'Cristo sofreu como?', options: ['Injusto', 'Justo pelos injustos', 'Culpado', 'Merecedor'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'pe2-ex3-q1', type: 'multiple-choice', question: 'Para quem devemos viver?', options: ['Para nós', 'Para o mundo', 'Para Deus', 'Para os outros'], correctAnswer: 2, points: 10 },
          { id: 'pe2-ex3-q2', type: 'true-false', question: 'O amor cobre multidão de pecados.', correctAnswer: 0, points: 10 },
          { id: 'pe2-ex3-q3', type: 'multiple-choice', question: 'Como devemos reagir ao sofrimento?', options: ['Com tristeza', 'Com alegria', 'Com raiva', 'Com medo'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'pedro-3-aprofundamento',
    apostleId: 'pedro',
    level: 'aprofundamento',
    title: 'Liderança Cristã',
    description: 'Princípios de liderança e pastoreio',
    totalPoints: 300,
    medal: '🥇',
    chapters: [
      { number: 1, title: 'Pastoreando o Rebanho', book: '1 Pedro', chapter: 5, verses: '1-4', content: 'Apascentai o rebanho', duration: '3 min' },
      { number: 2, title: 'Humildade', book: '1 Pedro', chapter: 5, verses: '5-7', content: 'Deus resiste aos soberbos', duration: '3 min' },
      { number: 3, title: 'Vigilância', book: '1 Pedro', chapter: 5, verses: '8-11', content: 'O adversário anda ao redor', duration: '3 min' },
      { number: 4, title: 'Saudações Finais', book: '1 Pedro', chapter: 5, verses: '12-14', content: 'Paz a todos', duration: '3 min' },
      { number: 5, title: 'Promessas Preciosas', book: '2 Pedro', chapter: 1, verses: '3-4', content: 'Tudo para vida e piedade', duration: '3 min' },
      { number: 6, title: 'Crescimento Espiritual', book: '2 Pedro', chapter: 1, verses: '5-9', content: 'Acrescentar virtudes', duration: '3 min' },
      { number: 7, title: 'Chamado e Eleição', book: '2 Pedro', chapter: 1, verses: '10-11', content: 'Confirmar vocação', duration: '3 min' },
      { number: 8, title: 'Testemunha Ocular', book: '2 Pedro', chapter: 1, verses: '16-18', content: 'Vimos sua majestade', duration: '3 min' },
      { number: 9, title: 'Palavra Profética', book: '2 Pedro', chapter: 1, verses: '19-21', content: 'Lâmpada que brilha', duration: '3 min' },
      { number: 10, title: 'Falsos Mestres', book: '2 Pedro', chapter: 2, verses: '1-3', content: 'Heresias destruidoras', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'pe3-ex1-q1', type: 'multiple-choice', question: 'Como devemos pastorear?', options: ['Com força', 'Com amor', 'Com medo', 'Com raiva'], correctAnswer: 1, points: 10 },
          { id: 'pe3-ex1-q2', type: 'true-false', question: 'Deus resiste aos soberbos e dá graça aos humildes.', correctAnswer: 0, points: 10 },
          { id: 'pe3-ex1-q3', type: 'multiple-choice', question: 'O que o adversário faz?', options: ['Dorme', 'Anda ao redor', 'Descansa', 'Foge'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'pe3-ex2-q1', type: 'multiple-choice', question: 'O que Deus nos deu?', options: ['Pouco', 'Nada', 'Tudo para vida e piedade', 'Apenas bênçãos'], correctAnswer: 2, points: 10 },
          { id: 'pe3-ex2-q2', type: 'true-false', question: 'Devemos acrescentar virtudes à nossa fé.', correctAnswer: 0, points: 10 },
          { id: 'pe3-ex2-q3', type: 'multiple-choice', question: 'O que devemos confirmar?', options: ['Dúvidas', 'Medos', 'Vocação e eleição', 'Incertezas'], correctAnswer: 2, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'pe3-ex3-q1', type: 'multiple-choice', question: 'Pedro foi testemunha de quê?', options: ['Nada', 'Majestade de Cristo', 'Milagres', 'Curas'], correctAnswer: 1, points: 10 },
          { id: 'pe3-ex3-q2', type: 'true-false', question: 'A palavra profética é como lâmpada que brilha.', correctAnswer: 0, points: 10 },
          { id: 'pe3-ex3-q3', type: 'multiple-choice', question: 'Contra o que Pedro alerta?', options: ['Boas obras', 'Falsos mestres', 'Oração', 'Jejum'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'pedro-4-maturidade',
    apostleId: 'pedro',
    level: 'maturidade',
    title: 'Discernimento Espiritual',
    description: 'Desenvolva discernimento contra falsas doutrinas',
    totalPoints: 300,
    medal: '🏆',
    chapters: [
      { number: 1, title: 'Juízo dos Ímpios', book: '2 Pedro', chapter: 2, verses: '4-9', content: 'Deus sabe livrar', duration: '3 min' },
      { number: 2, title: 'Caminho da Injustiça', book: '2 Pedro', chapter: 2, verses: '10-16', content: 'Seguem a carne', duration: '3 min' },
      { number: 3, title: 'Promessas Vazias', book: '2 Pedro', chapter: 2, verses: '17-22', content: 'Escravos da corrupção', duration: '3 min' },
      { number: 4, title: 'Lembrar Palavras', book: '2 Pedro', chapter: 3, verses: '1-2', content: 'Despertar entendimento', duration: '3 min' },
      { number: 5, title: 'Escarnecedores', book: '2 Pedro', chapter: 3, verses: '3-7', content: 'Nos últimos dias', duration: '3 min' },
      { number: 6, title: 'Dia do Senhor', book: '2 Pedro', chapter: 3, verses: '8-10', content: 'Como ladrão', duration: '3 min' },
      { number: 7, title: 'Vida Santa', book: '2 Pedro', chapter: 3, verses: '11-13', content: 'Novos céus e nova terra', duration: '3 min' },
      { number: 8, title: 'Diligência', book: '2 Pedro', chapter: 3, verses: '14-16', content: 'Sem mácula', duration: '3 min' },
      { number: 9, title: 'Cuidado', book: '2 Pedro', chapter: 3, verses: '17-18', content: 'Não cair', duration: '3 min' },
      { number: 10, title: 'Crescer na Graça', book: '2 Pedro', chapter: 3, verses: '18', content: 'Conhecimento de Cristo', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'pe4-ex1-q1', type: 'multiple-choice', question: 'Deus sabe fazer o quê?', options: ['Punir', 'Livrar os piedosos', 'Esquecer', 'Ignorar'], correctAnswer: 1, points: 10 },
          { id: 'pe4-ex1-q2', type: 'true-false', question: 'Falsos mestres seguem a carne.', correctAnswer: 0, points: 10 },
          { id: 'pe4-ex1-q3', type: 'multiple-choice', question: 'As promessas dos falsos mestres são...?', options: ['Verdadeiras', 'Vazias', 'Boas', 'Santas'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'pe4-ex2-q1', type: 'multiple-choice', question: 'O que devemos lembrar?', options: ['Nada', 'Palavras dos profetas', 'Tradições', 'Costumes'], correctAnswer: 1, points: 10 },
          { id: 'pe4-ex2-q2', type: 'true-false', question: 'Virão escarnecedores nos últimos dias.', correctAnswer: 0, points: 10 },
          { id: 'pe4-ex2-q3', type: 'multiple-choice', question: 'O dia do Senhor virá como...?', options: ['Trovão', 'Ladrão', 'Luz', 'Vento'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'pe4-ex3-q1', type: 'multiple-choice', question: 'O que aguardamos?', options: ['Nada', 'Novos céus e nova terra', 'Fim', 'Morte'], correctAnswer: 1, points: 10 },
          { id: 'pe4-ex3-q2', type: 'true-false', question: 'Devemos ser diligentes para sermos achados sem mácula.', correctAnswer: 0, points: 10 },
          { id: 'pe4-ex3-q3', type: 'multiple-choice', question: 'Em que devemos crescer?', options: ['Riqueza', 'Graça e conhecimento', 'Fama', 'Poder'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'pedro-5-avancado',
    apostleId: 'pedro',
    level: 'avancado',
    title: 'Perseverança na Fé',
    description: 'Mantenha-se firme até o fim',
    totalPoints: 300,
    medal: '👑',
    chapters: [
      { number: 1, title: 'Revisão: Esperança Viva', book: '1 Pedro', chapter: 1, verses: '3-9', content: 'Fundamento da fé', duration: '3 min' },
      { number: 2, title: 'Revisão: Vida Santa', book: '1 Pedro', chapter: 1, verses: '13-21', content: 'Chamado à santidade', duration: '3 min' },
      { number: 3, title: 'Revisão: Pedra Viva', book: '1 Pedro', chapter: 2, verses: '4-10', content: 'Edificados em Cristo', duration: '3 min' },
      { number: 4, title: 'Revisão: Exemplo de Cristo', book: '1 Pedro', chapter: 2, verses: '21-25', content: 'Seguir seus passos', duration: '3 min' },
      { number: 5, title: 'Revisão: Unidade', book: '1 Pedro', chapter: 3, verses: '8-12', content: 'Um só sentimento', duration: '3 min' },
      { number: 6, title: 'Revisão: Sofrimento', book: '1 Pedro', chapter: 4, verses: '12-19', content: 'Participar dos sofrimentos', duration: '3 min' },
      { number: 7, title: 'Revisão: Humildade', book: '1 Pedro', chapter: 5, verses: '5-11', content: 'Graça aos humildes', duration: '3 min' },
      { number: 8, title: 'Revisão: Crescimento', book: '2 Pedro', chapter: 1, verses: '3-11', content: 'Acrescentar virtudes', duration: '3 min' },
      { number: 9, title: 'Revisão: Vigilância', book: '2 Pedro', chapter: 3, verses: '1-13', content: 'Aguardar novos céus', duration: '3 min' },
      { number: 10, title: 'Síntese Final', book: '2 Pedro', chapter: 3, verses: '14-18', content: 'Crescer na graça', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'pe5-ex1-q1', type: 'multiple-choice', question: 'Qual é o fundamento da nossa esperança?', options: ['Obras', 'Ressurreição de Cristo', 'Lei', 'Tradição'], correctAnswer: 1, points: 10 },
          { id: 'pe5-ex1-q2', type: 'true-false', question: 'Somos chamados para ser santos.', correctAnswer: 0, points: 10 },
          { id: 'pe5-ex1-q3', type: 'multiple-choice', question: 'Em quem somos edificados?', options: ['Em nós', 'Em Cristo', 'Na igreja', 'Nos apóstolos'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'pe5-ex2-q1', type: 'multiple-choice', question: 'Cujos passos devemos seguir?', options: ['De Pedro', 'De Cristo', 'De Paulo', 'Dos profetas'], correctAnswer: 1, points: 10 },
          { id: 'pe5-ex2-q2', type: 'true-false', question: 'Devemos ter um só sentimento na igreja.', correctAnswer: 0, points: 10 },
          { id: 'pe5-ex2-q3', type: 'multiple-choice', question: 'Do que participamos ao sofrer?', options: ['Do mundo', 'Dos sofrimentos de Cristo', 'Da tristeza', 'Do pecado'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'pe5-ex3-q1', type: 'multiple-choice', question: 'A quem Deus dá graça?', options: ['Aos soberbos', 'Aos humildes', 'Aos ricos', 'Aos fortes'], correctAnswer: 1, points: 10 },
          { id: 'pe5-ex3-q2', type: 'true-false', question: 'Devemos acrescentar virtudes à nossa fé.', correctAnswer: 0, points: 10 },
          { id: 'pe5-ex3-q3', type: 'multiple-choice', question: 'Qual é a mensagem final de Pedro?', options: ['Desistir', 'Crescer na graça', 'Parar', 'Voltar atrás'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },

  // JOÃO - 5 Planos (estrutura similar)
  {
    id: 'joao-1-iniciante',
    apostleId: 'joao',
    level: 'iniciante',
    title: 'Deus é Luz',
    description: 'Descubra que Deus é luz e não há trevas nele',
    totalPoints: 300,
    medal: '🥉',
    chapters: [
      { number: 1, title: 'Palavra da Vida', book: '1 João', chapter: 1, verses: '1-4', content: 'O que vimos e ouvimos', duration: '3 min' },
      { number: 2, title: 'Deus é Luz', book: '1 João', chapter: 1, verses: '5-7', content: 'Andar na luz', duration: '3 min' },
      { number: 3, title: 'Confissão de Pecados', book: '1 João', chapter: 1, verses: '8-10', content: 'Ele é fiel e justo', duration: '3 min' },
      { number: 4, title: 'Nosso Advogado', book: '1 João', chapter: 2, verses: '1-2', content: 'Jesus Cristo, o justo', duration: '3 min' },
      { number: 5, title: 'Guardar Mandamentos', book: '1 João', chapter: 2, verses: '3-6', content: 'Conhecer a Deus', duration: '3 min' },
      { number: 6, title: 'Mandamento Novo', book: '1 João', chapter: 2, verses: '7-11', content: 'Amar o irmão', duration: '3 min' },
      { number: 7, title: 'Não Amar o Mundo', book: '1 João', chapter: 2, verses: '15-17', content: 'Vontade de Deus permanece', duration: '3 min' },
      { number: 8, title: 'Anticristos', book: '1 João', chapter: 2, verses: '18-23', content: 'Última hora', duration: '3 min' },
      { number: 9, title: 'Permanecer em Cristo', book: '1 João', chapter: 2, verses: '24-27', content: 'Unção que ensina', duration: '3 min' },
      { number: 10, title: 'Filhos de Deus', book: '1 João', chapter: 3, verses: '1-3', content: 'Seremos semelhantes a ele', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'j1-ex1-q1', type: 'multiple-choice', question: 'O que João viu e ouviu?', options: ['Nada', 'A Palavra da Vida', 'Histórias', 'Lendas'], correctAnswer: 1, points: 10 },
          { id: 'j1-ex1-q2', type: 'true-false', question: 'Deus é luz e não há trevas nele.', correctAnswer: 0, points: 10 },
          { id: 'j1-ex1-q3', type: 'multiple-choice', question: 'O que acontece se confessarmos nossos pecados?', options: ['Nada', 'Ele perdoa', 'Somos punidos', 'Somos rejeitados'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'j1-ex2-q1', type: 'multiple-choice', question: 'Quem é nosso advogado?', options: ['João', 'Pedro', 'Jesus Cristo', 'Paulo'], correctAnswer: 2, points: 10 },
          { id: 'j1-ex2-q2', type: 'true-false', question: 'Conhecemos a Deus se guardamos seus mandamentos.', correctAnswer: 0, points: 10 },
          { id: 'j1-ex2-q3', type: 'multiple-choice', question: 'Qual é o mandamento novo?', options: ['Jejuar', 'Amar o irmão', 'Orar', 'Ofertar'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'j1-ex3-q1', type: 'multiple-choice', question: 'O que não devemos amar?', options: ['A Deus', 'O mundo', 'Os irmãos', 'A verdade'], correctAnswer: 1, points: 10 },
          { id: 'j1-ex3-q2', type: 'true-false', question: 'Estamos na última hora segundo João.', correctAnswer: 0, points: 10 },
          { id: 'j1-ex3-q3', type: 'multiple-choice', question: 'O que somos agora?', options: ['Nada', 'Filhos de Deus', 'Escravos', 'Estrangeiros'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'joao-2-fundamentos',
    apostleId: 'joao',
    level: 'fundamentos',
    title: 'Amor Fraternal',
    description: 'Aprenda sobre o amor entre irmãos',
    totalPoints: 300,
    medal: '🥈',
    chapters: [
      { number: 1, title: 'Praticar Justiça', book: '1 João', chapter: 3, verses: '4-10', content: 'Nascidos de Deus', duration: '3 min' },
      { number: 2, title: 'Amar de Fato', book: '1 João', chapter: 3, verses: '11-18', content: 'Não só de palavra', duration: '3 min' },
      { number: 3, title: 'Confiança em Deus', book: '1 João', chapter: 3, verses: '19-24', content: 'Coração não nos condena', duration: '3 min' },
      { number: 4, title: 'Provar os Espíritos', book: '1 João', chapter: 4, verses: '1-6', content: 'Espírito de Deus', duration: '3 min' },
      { number: 5, title: 'Deus é Amor', book: '1 João', chapter: 4, verses: '7-12', content: 'Amemos uns aos outros', duration: '3 min' },
      { number: 6, title: 'Amor Perfeito', book: '1 João', chapter: 4, verses: '13-18', content: 'Lança fora o medo', duration: '3 min' },
      { number: 7, title: 'Amar a Deus', book: '1 João', chapter: 4, verses: '19-21', content: 'Amar também o irmão', duration: '3 min' },
      { number: 8, title: 'Fé que Vence', book: '1 João', chapter: 5, verses: '1-5', content: 'Vencer o mundo', duration: '3 min' },
      { number: 9, title: 'Testemunho de Deus', book: '1 João', chapter: 5, verses: '6-12', content: 'Vida eterna no Filho', duration: '3 min' },
      { number: 10, title: 'Certeza da Salvação', book: '1 João', chapter: 5, verses: '13-15', content: 'Sabemos que temos', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'j2-ex1-q1', type: 'multiple-choice', question: 'Quem pratica justiça?', options: ['Qualquer um', 'Nascidos de Deus', 'Os sábios', 'Os ricos'], correctAnswer: 1, points: 10 },
          { id: 'j2-ex1-q2', type: 'true-false', question: 'Devemos amar de fato e de verdade, não só de palavra.', correctAnswer: 0, points: 10 },
          { id: 'j2-ex1-q3', type: 'multiple-choice', question: 'Quando temos confiança em Deus?', options: ['Nunca', 'Quando o coração não condena', 'Sempre', 'Às vezes'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'j2-ex2-q1', type: 'multiple-choice', question: 'O que devemos provar?', options: ['Comida', 'Os espíritos', 'Bebida', 'Roupas'], correctAnswer: 1, points: 10 },
          { id: 'j2-ex2-q2', type: 'true-false', question: 'Deus é amor.', correctAnswer: 0, points: 10 },
          { id: 'j2-ex2-q3', type: 'multiple-choice', question: 'O que o amor perfeito faz?', options: ['Traz medo', 'Lança fora o medo', 'Cria dúvidas', 'Gera tristeza'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'j2-ex3-q1', type: 'multiple-choice', question: 'Se amamos a Deus, devemos amar também...?', options: ['O mundo', 'O irmão', 'A nós mesmos', 'O pecado'], correctAnswer: 1, points: 10 },
          { id: 'j2-ex3-q2', type: 'true-false', question: 'Nossa fé vence o mundo.', correctAnswer: 0, points: 10 },
          { id: 'j2-ex3-q3', type: 'multiple-choice', question: 'Onde está a vida eterna?', options: ['No mundo', 'No Filho', 'Em nós', 'Na lei'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'joao-3-aprofundamento',
    apostleId: 'joao',
    level: 'aprofundamento',
    title: 'Verdade e Amor',
    description: 'Equilibre verdade e amor na vida cristã',
    totalPoints: 300,
    medal: '🥇',
    chapters: [
      { number: 1, title: 'Andar na Verdade', book: '2 João', chapter: 1, verses: '1-6', content: 'Mandamento desde o princípio', duration: '3 min' },
      { number: 2, title: 'Enganadores', book: '2 João', chapter: 1, verses: '7-11', content: 'Não receber em casa', duration: '3 min' },
      { number: 3, title: 'Saudações Finais', book: '2 João', chapter: 1, verses: '12-13', content: 'Face a face', duration: '3 min' },
      { number: 4, title: 'Gaio, o Amado', book: '3 João', chapter: 1, verses: '1-4', content: 'Prosperar em tudo', duration: '3 min' },
      { number: 5, title: 'Hospitalidade', book: '3 João', chapter: 1, verses: '5-8', content: 'Cooperadores da verdade', duration: '3 min' },
      { number: 6, title: 'Diótrefes', book: '3 João', chapter: 1, verses: '9-10', content: 'Gosta de primazia', duration: '3 min' },
      { number: 7, title: 'Demétrio', book: '3 João', chapter: 1, verses: '11-12', content: 'Bom testemunho', duration: '3 min' },
      { number: 8, title: 'Oração Confiante', book: '1 João', chapter: 5, verses: '14-15', content: 'Segundo sua vontade', duration: '3 min' },
      { number: 9, title: 'Pecado para Morte', book: '1 João', chapter: 5, verses: '16-17', content: 'Orar pelos irmãos', duration: '3 min' },
      { number: 10, title: 'Certezas Finais', book: '1 João', chapter: 5, verses: '18-21', content: 'Sabemos', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'j3-ex1-q1', type: 'multiple-choice', question: 'Em que devemos andar?', options: ['Na mentira', 'Na verdade', 'No erro', 'Na dúvida'], correctAnswer: 1, points: 10 },
          { id: 'j3-ex1-q2', type: 'true-false', question: 'Não devemos receber enganadores em casa.', correctAnswer: 0, points: 10 },
          { id: 'j3-ex1-q3', type: 'multiple-choice', question: 'Como João prefere falar?', options: ['Por carta', 'Face a face', 'Por telefone', 'Por mensagem'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'j3-ex2-q1', type: 'multiple-choice', question: 'O que João deseja para Gaio?', options: ['Riqueza', 'Prosperar em tudo', 'Fama', 'Poder'], correctAnswer: 1, points: 10 },
          { id: 'j3-ex2-q2', type: 'true-false', question: 'Devemos ser hospitaleiros.', correctAnswer: 0, points: 10 },
          { id: 'j3-ex2-q3', type: 'multiple-choice', question: 'Qual era o problema de Diótrefes?', options: ['Humildade', 'Gostava de primazia', 'Timidez', 'Medo'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'j3-ex3-q1', type: 'multiple-choice', question: 'Quem tinha bom testemunho?', options: ['Diótrefes', 'Demétrio', 'Gaio', 'João'], correctAnswer: 1, points: 10 },
          { id: 'j3-ex3-q2', type: 'true-false', question: 'Devemos orar segundo a vontade de Deus.', correctAnswer: 0, points: 10 },
          { id: 'j3-ex3-q3', type: 'multiple-choice', question: 'Quantas vezes João usa "sabemos" no final?', options: ['Uma', 'Duas', 'Três', 'Quatro'], correctAnswer: 2, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'joao-4-maturidade',
    apostleId: 'joao',
    level: 'maturidade',
    title: 'Comunhão com Deus',
    description: 'Aprofunde sua comunhão com o Pai',
    totalPoints: 300,
    medal: '🏆',
    chapters: [
      { number: 1, title: 'Revisão: Luz', book: '1 João', chapter: 1, verses: '5-10', content: 'Deus é luz', duration: '3 min' },
      { number: 2, title: 'Revisão: Mandamentos', book: '1 João', chapter: 2, verses: '3-11', content: 'Guardar e amar', duration: '3 min' },
      { number: 3, title: 'Revisão: Filhos', book: '1 João', chapter: 3, verses: '1-10', content: 'Nascidos de Deus', duration: '3 min' },
      { number: 4, title: 'Revisão: Amor Prático', book: '1 João', chapter: 3, verses: '11-24', content: 'Amar de fato', duration: '3 min' },
      { number: 5, title: 'Revisão: Espíritos', book: '1 João', chapter: 4, verses: '1-6', content: 'Provar os espíritos', duration: '3 min' },
      { number: 6, title: 'Revisão: Deus é Amor', book: '1 João', chapter: 4, verses: '7-21', content: 'Amor perfeito', duration: '3 min' },
      { number: 7, title: 'Revisão: Fé Vitoriosa', book: '1 João', chapter: 5, verses: '1-5', content: 'Vencer o mundo', duration: '3 min' },
      { number: 8, title: 'Revisão: Testemunho', book: '1 João', chapter: 5, verses: '6-12', content: 'Vida no Filho', duration: '3 min' },
      { number: 9, title: 'Revisão: Certeza', book: '1 João', chapter: 5, verses: '13-21', content: 'Sabemos', duration: '3 min' },
      { number: 10, title: 'Síntese: Amor e Verdade', book: '1 João', chapter: 4, verses: '16-21', content: 'Deus é amor', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'j4-ex1-q1', type: 'multiple-choice', question: 'Qual é a natureza de Deus?', options: ['Trevas', 'Luz', 'Neutro', 'Indefinido'], correctAnswer: 1, points: 10 },
          { id: 'j4-ex1-q2', type: 'true-false', question: 'Conhecemos a Deus guardando seus mandamentos.', correctAnswer: 0, points: 10 },
          { id: 'j4-ex1-q3', type: 'multiple-choice', question: 'O que somos agora?', options: ['Escravos', 'Filhos de Deus', 'Estrangeiros', 'Servos'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'j4-ex2-q1', type: 'multiple-choice', question: 'Como devemos amar?', options: ['De palavra', 'De fato e verdade', 'Às vezes', 'Raramente'], correctAnswer: 1, points: 10 },
          { id: 'j4-ex2-q2', type: 'true-false', question: 'Devemos provar os espíritos.', correctAnswer: 0, points: 10 },
          { id: 'j4-ex2-q3', type: 'multiple-choice', question: 'Qual é a essência de Deus?', options: ['Poder', 'Amor', 'Justiça', 'Santidade'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'j4-ex3-q1', type: 'multiple-choice', question: 'O que vence o mundo?', options: ['Força', 'Nossa fé', 'Dinheiro', 'Poder'], correctAnswer: 1, points: 10 },
          { id: 'j4-ex3-q2', type: 'true-false', question: 'A vida eterna está no Filho.', correctAnswer: 0, points: 10 },
          { id: 'j4-ex3-q3', type: 'multiple-choice', question: 'Quantas vezes João diz "sabemos"?', options: ['Nenhuma', 'Uma', 'Três', 'Cinco'], correctAnswer: 2, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'joao-5-avancado',
    apostleId: 'joao',
    level: 'avancado',
    title: 'Amor Perfeito',
    description: 'Alcance a plenitude do amor de Deus',
    totalPoints: 300,
    medal: '👑',
    chapters: [
      { number: 1, title: 'Amor Manifestado', book: '1 João', chapter: 4, verses: '7-10', content: 'Deus nos amou primeiro', duration: '3 min' },
      { number: 2, title: 'Amor Correspondido', book: '1 João', chapter: 4, verses: '11-12', content: 'Amar uns aos outros', duration: '3 min' },
      { number: 3, title: 'Permanência Mútua', book: '1 João', chapter: 4, verses: '13-16', content: 'Deus em nós', duration: '3 min' },
      { number: 4, title: 'Amor Aperfeiçoado', book: '1 João', chapter: 4, verses: '17-18', content: 'Lança fora o medo', duration: '3 min' },
      { number: 5, title: 'Amor Integrado', book: '1 João', chapter: 4, verses: '19-21', content: 'Amar a Deus e ao irmão', duration: '3 min' },
      { number: 6, title: 'Amor e Obediência', book: '1 João', chapter: 5, verses: '1-3', content: 'Guardar mandamentos', duration: '3 min' },
      { number: 7, title: 'Vitória da Fé', book: '1 João', chapter: 5, verses: '4-5', content: 'Vencer o mundo', duration: '3 min' },
      { number: 8, title: 'Testemunho Triplo', book: '1 João', chapter: 5, verses: '6-9', content: 'Espírito, água e sangue', duration: '3 min' },
      { number: 9, title: 'Vida Eterna', book: '1 João', chapter: 5, verses: '10-13', content: 'No Filho de Deus', duration: '3 min' },
      { number: 10, title: 'Confiança Final', book: '1 João', chapter: 5, verses: '14-21', content: 'Certeza absoluta', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 'j5-ex1-q1', type: 'multiple-choice', question: 'Quem amou primeiro?', options: ['Nós', 'Deus', 'Os anjos', 'A igreja'], correctAnswer: 1, points: 10 },
          { id: 'j5-ex1-q2', type: 'true-false', question: 'Se Deus nos amou, devemos amar uns aos outros.', correctAnswer: 0, points: 10 },
          { id: 'j5-ex1-q3', type: 'multiple-choice', question: 'Onde Deus permanece?', options: ['No céu', 'Em nós', 'Na igreja', 'No mundo'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 'j5-ex2-q1', type: 'multiple-choice', question: 'O que o amor perfeito faz com o medo?', options: ['Aumenta', 'Lança fora', 'Mantém', 'Esconde'], correctAnswer: 1, points: 10 },
          { id: 'j5-ex2-q2', type: 'true-false', question: 'Não podemos amar a Deus e odiar o irmão.', correctAnswer: 0, points: 10 },
          { id: 'j5-ex2-q3', type: 'multiple-choice', question: 'Como mostramos amor a Deus?', options: ['Palavras', 'Guardando mandamentos', 'Ofertas', 'Jejum'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 'j5-ex3-q1', type: 'multiple-choice', question: 'O que vence o mundo?', options: ['Poder', 'Nossa fé', 'Dinheiro', 'Sabedoria'], correctAnswer: 1, points: 10 },
          { id: 'j5-ex3-q2', type: 'true-false', question: 'Há três testemunhas: Espírito, água e sangue.', correctAnswer: 0, points: 10 },
          { id: 'j5-ex3-q3', type: 'multiple-choice', question: 'Onde está a vida eterna?', options: ['Em nós', 'No Filho de Deus', 'Na igreja', 'No mundo'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },

  // TIAGO - 5 Planos
  {
    id: 'tiago-1-iniciante',
    apostleId: 'tiago',
    level: 'iniciante',
    title: 'Fé Prática',
    description: 'Descubra como viver a fé no dia a dia',
    totalPoints: 300,
    medal: '🥉',
    chapters: [
      { number: 1, title: 'Alegria nas Provações', book: 'Tiago', chapter: 1, verses: '2-4', content: 'Prova produz perseverança', duration: '3 min' },
      { number: 2, title: 'Pedir Sabedoria', book: 'Tiago', chapter: 1, verses: '5-8', content: 'Deus dá generosamente', duration: '3 min' },
      { number: 3, title: 'Rico e Pobre', book: 'Tiago', chapter: 1, verses: '9-11', content: 'Glória na humilhação', duration: '3 min' },
      { number: 4, title: 'Bem-aventurado', book: 'Tiago', chapter: 1, verses: '12-15', content: 'Suportar a provação', duration: '3 min' },
      { number: 5, title: 'Toda Boa Dádiva', book: 'Tiago', chapter: 1, verses: '16-18', content: 'Pai das luzes', duration: '3 min' },
      { number: 6, title: 'Prontos para Ouvir', book: 'Tiago', chapter: 1, verses: '19-21', content: 'Tardios para falar', duration: '3 min' },
      { number: 7, title: 'Praticantes da Palavra', book: 'Tiago', chapter: 1, verses: '22-25', content: 'Não só ouvintes', duration: '3 min' },
      { number: 8, title: 'Religião Pura', book: 'Tiago', chapter: 1, verses: '26-27', content: 'Visitar órfãos', duration: '3 min' },
      { number: 9, title: 'Sem Acepção', book: 'Tiago', chapter: 2, verses: '1-7', content: 'Não fazer distinção', duration: '3 min' },
      { number: 10, title: 'Lei do Amor', book: 'Tiago', chapter: 2, verses: '8-13', content: 'Amar o próximo', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 't1-ex1-q1', type: 'multiple-choice', question: 'Como devemos encarar as provações?', options: ['Com tristeza', 'Com alegria', 'Com medo', 'Com raiva'], correctAnswer: 1, points: 10 },
          { id: 't1-ex1-q2', type: 'true-false', question: 'Devemos pedir sabedoria a Deus.', correctAnswer: 0, points: 10 },
          { id: 't1-ex1-q3', type: 'multiple-choice', question: 'Em que o pobre deve se gloriar?', options: ['Riqueza', 'Exaltação', 'Pobreza', 'Nada'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 't1-ex2-q1', type: 'multiple-choice', question: 'Quem é bem-aventurado?', options: ['O rico', 'Quem suporta provação', 'O sábio', 'O forte'], correctAnswer: 1, points: 10 },
          { id: 't1-ex2-q2', type: 'true-false', question: 'Toda boa dádiva vem do Pai das luzes.', correctAnswer: 0, points: 10 },
          { id: 't1-ex2-q3', type: 'multiple-choice', question: 'Como devemos ser?', options: ['Rápidos para falar', 'Prontos para ouvir', 'Lentos para ouvir', 'Rápidos para irar'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 't1-ex3-q1', type: 'multiple-choice', question: 'O que devemos ser além de ouvintes?', options: ['Críticos', 'Praticantes', 'Juízes', 'Mestres'], correctAnswer: 1, points: 10 },
          { id: 't1-ex3-q2', type: 'true-false', question: 'Religião pura é visitar órfãos e viúvas.', correctAnswer: 0, points: 10 },
          { id: 't1-ex3-q3', type: 'multiple-choice', question: 'O que não devemos fazer?', options: ['Amar', 'Acepção de pessoas', 'Orar', 'Ajudar'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'tiago-2-fundamentos',
    apostleId: 'tiago',
    level: 'fundamentos',
    title: 'Fé e Obras',
    description: 'Entenda a relação entre fé e ações',
    totalPoints: 300,
    medal: '🥈',
    chapters: [
      { number: 1, title: 'Fé sem Obras', book: 'Tiago', chapter: 2, verses: '14-17', content: 'Fé morta', duration: '3 min' },
      { number: 2, title: 'Mostrar a Fé', book: 'Tiago', chapter: 2, verses: '18-20', content: 'Pelas obras', duration: '3 min' },
      { number: 3, title: 'Exemplo de Abraão', book: 'Tiago', chapter: 2, verses: '21-24', content: 'Fé cooperou', duration: '3 min' },
      { number: 4, title: 'Exemplo de Raabe', book: 'Tiago', chapter: 2, verses: '25-26', content: 'Justificada pelas obras', duration: '3 min' },
      { number: 5, title: 'Controlar a Língua', book: 'Tiago', chapter: 3, verses: '1-5', content: 'Pequeno membro', duration: '3 min' },
      { number: 6, title: 'Fogo Destruidor', book: 'Tiago', chapter: 3, verses: '6-8', content: 'Língua indomável', duration: '3 min' },
      { number: 7, title: 'Bênção e Maldição', book: 'Tiago', chapter: 3, verses: '9-12', content: 'Da mesma boca', duration: '3 min' },
      { number: 8, title: 'Sabedoria do Alto', book: 'Tiago', chapter: 3, verses: '13-16', content: 'Pura e pacífica', duration: '3 min' },
      { number: 9, title: 'Fruto da Justiça', book: 'Tiago', chapter: 3, verses: '17-18', content: 'Semeado em paz', duration: '3 min' },
      { number: 10, title: 'Origem das Guerras', book: 'Tiago', chapter: 4, verses: '1-3', content: 'Paixões que combatem', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 't2-ex1-q1', type: 'multiple-choice', question: 'Fé sem obras é...?', options: ['Viva', 'Morta', 'Forte', 'Perfeita'], correctAnswer: 1, points: 10 },
          { id: 't2-ex1-q2', type: 'true-false', question: 'Mostramos nossa fé pelas obras.', correctAnswer: 0, points: 10 },
          { id: 't2-ex1-q3', type: 'multiple-choice', question: 'Quem é exemplo de fé com obras?', options: ['Moisés', 'Abraão', 'Davi', 'Salomão'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 't2-ex2-q1', type: 'multiple-choice', question: 'Quem mais é exemplo de fé com obras?', options: ['Sara', 'Raabe', 'Rute', 'Ester'], correctAnswer: 1, points: 10 },
          { id: 't2-ex2-q2', type: 'true-false', question: 'A língua é um pequeno membro mas causa grandes estragos.', correctAnswer: 0, points: 10 },
          { id: 't2-ex2-q3', type: 'multiple-choice', question: 'A língua é comparada a...?', options: ['Água', 'Fogo', 'Vento', 'Terra'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 't2-ex3-q1', type: 'multiple-choice', question: 'Da boca sai...?', options: ['Só bênção', 'Só maldição', 'Bênção e maldição', 'Nada'], correctAnswer: 2, points: 10 },
          { id: 't2-ex3-q2', type: 'true-false', question: 'A sabedoria do alto é pura e pacífica.', correctAnswer: 0, points: 10 },
          { id: 't2-ex3-q3', type: 'multiple-choice', question: 'De onde vêm as guerras?', options: ['De Deus', 'Das paixões', 'Dos outros', 'Do acaso'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'tiago-3-aprofundamento',
    apostleId: 'tiago',
    level: 'aprofundamento',
    title: 'Humildade e Submissão',
    description: 'Aprenda sobre humildade diante de Deus',
    totalPoints: 300,
    medal: '🥇',
    chapters: [
      { number: 1, title: 'Amizade com o Mundo', book: 'Tiago', chapter: 4, verses: '4-6', content: 'Inimizade com Deus', duration: '3 min' },
      { number: 2, title: 'Submeter-se a Deus', book: 'Tiago', chapter: 4, verses: '7-10', content: 'Resistir ao diabo', duration: '3 min' },
      { number: 3, title: 'Não Julgar', book: 'Tiago', chapter: 4, verses: '11-12', content: 'Um só Legislador', duration: '3 min' },
      { number: 4, title: 'Vontade de Deus', book: 'Tiago', chapter: 4, verses: '13-17', content: 'Se o Senhor quiser', duration: '3 min' },
      { number: 5, title: 'Ricos Opressores', book: 'Tiago', chapter: 5, verses: '1-6', content: 'Chorai e lamentai', duration: '3 min' },
      { number: 6, title: 'Paciência', book: 'Tiago', chapter: 5, verses: '7-11', content: 'Até a vinda do Senhor', duration: '3 min' },
      { number: 7, title: 'Não Jurar', book: 'Tiago', chapter: 5, verses: '12', content: 'Sim seja sim', duration: '3 min' },
      { number: 8, title: 'Oração Eficaz', book: 'Tiago', chapter: 5, verses: '13-16', content: 'Confissão mútua', duration: '3 min' },
      { number: 9, title: 'Exemplo de Elias', book: 'Tiago', chapter: 5, verses: '17-18', content: 'Homem semelhante', duration: '3 min' },
      { number: 10, title: 'Converter o Pecador', book: 'Tiago', chapter: 5, verses: '19-20', content: 'Salvar uma alma', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 't3-ex1-q1', type: 'multiple-choice', question: 'Amizade com o mundo é...?', options: ['Boa', 'Inimizade com Deus', 'Neutra', 'Necessária'], correctAnswer: 1, points: 10 },
          { id: 't3-ex1-q2', type: 'true-false', question: 'Devemos nos submeter a Deus e resistir ao diabo.', correctAnswer: 0, points: 10 },
          { id: 't3-ex1-q3', type: 'multiple-choice', question: 'Quantos legisladores há?', options: ['Muitos', 'Dois', 'Um só', 'Nenhum'], correctAnswer: 2, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 't3-ex2-q1', type: 'multiple-choice', question: 'Como devemos fazer planos?', options: ['Livremente', 'Se o Senhor quiser', 'Sozinhos', 'Sem pensar'], correctAnswer: 1, points: 10 },
          { id: 't3-ex2-q2', type: 'true-false', question: 'Tiago alerta os ricos opressores.', correctAnswer: 0, points: 10 },
          { id: 't3-ex2-q3', type: 'multiple-choice', question: 'Até quando devemos ter paciência?', options: ['Pouco tempo', 'Vinda do Senhor', 'Nunca', 'Um ano'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 't3-ex3-q1', type: 'multiple-choice', question: 'Como deve ser nossa palavra?', options: ['Confusa', 'Sim seja sim', 'Duvidosa', 'Incerta'], correctAnswer: 1, points: 10 },
          { id: 't3-ex3-q2', type: 'true-false', question: 'A oração do justo é poderosa e eficaz.', correctAnswer: 0, points: 10 },
          { id: 't3-ex3-q3', type: 'multiple-choice', question: 'Quem é exemplo de oração?', options: ['Moisés', 'Davi', 'Elias', 'Samuel'], correctAnswer: 2, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'tiago-4-maturidade',
    apostleId: 'tiago',
    level: 'maturidade',
    title: 'Vida de Oração',
    description: 'Desenvolva uma vida de oração eficaz',
    totalPoints: 300,
    medal: '🏆',
    chapters: [
      { number: 1, title: 'Revisão: Provações', book: 'Tiago', chapter: 1, verses: '2-8', content: 'Alegria e sabedoria', duration: '3 min' },
      { number: 2, title: 'Revisão: Praticantes', book: 'Tiago', chapter: 1, verses: '19-27', content: 'Fazer a palavra', duration: '3 min' },
      { number: 3, title: 'Revisão: Fé e Obras', book: 'Tiago', chapter: 2, verses: '14-26', content: 'Fé viva', duration: '3 min' },
      { number: 4, title: 'Revisão: Língua', book: 'Tiago', chapter: 3, verses: '1-12', content: 'Controlar palavras', duration: '3 min' },
      { number: 5, title: 'Revisão: Sabedoria', book: 'Tiago', chapter: 3, verses: '13-18', content: 'Do alto', duration: '3 min' },
      { number: 6, title: 'Revisão: Submissão', book: 'Tiago', chapter: 4, verses: '7-10', content: 'Humilhar-se', duration: '3 min' },
      { number: 7, title: 'Revisão: Vontade de Deus', book: 'Tiago', chapter: 4, verses: '13-17', content: 'Se o Senhor quiser', duration: '3 min' },
      { number: 8, title: 'Revisão: Paciência', book: 'Tiago', chapter: 5, verses: '7-11', content: 'Perseverar', duration: '3 min' },
      { number: 9, title: 'Revisão: Oração', book: 'Tiago', chapter: 5, verses: '13-18', content: 'Eficaz e poderosa', duration: '3 min' },
      { number: 10, title: 'Síntese: Fé Prática', book: 'Tiago', chapter: 5, verses: '19-20', content: 'Converter e salvar', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 't4-ex1-q1', type: 'multiple-choice', question: 'Como encarar provações?', options: ['Tristeza', 'Alegria', 'Medo', 'Raiva'], correctAnswer: 1, points: 10 },
          { id: 't4-ex1-q2', type: 'true-false', question: 'Devemos ser praticantes da palavra.', correctAnswer: 0, points: 10 },
          { id: 't4-ex1-q3', type: 'multiple-choice', question: 'Fé sem obras é...?', options: ['Viva', 'Morta', 'Forte', 'Perfeita'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 't4-ex2-q1', type: 'multiple-choice', question: 'O que devemos controlar?', options: ['Pensamentos', 'A língua', 'Emoções', 'Desejos'], correctAnswer: 1, points: 10 },
          { id: 't4-ex2-q2', type: 'true-false', question: 'A sabedoria do alto é pura e pacífica.', correctAnswer: 0, points: 10 },
          { id: 't4-ex2-q3', type: 'multiple-choice', question: 'A quem devemos nos submeter?', options: ['Ao mundo', 'A Deus', 'Aos homens', 'A nós mesmos'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 't4-ex3-q1', type: 'multiple-choice', question: 'Como devemos fazer planos?', options: ['Livremente', 'Se o Senhor quiser', 'Sozinhos', 'Sem pensar'], correctAnswer: 1, points: 10 },
          { id: 't4-ex3-q2', type: 'true-false', question: 'Devemos ter paciência até a vinda do Senhor.', correctAnswer: 0, points: 10 },
          { id: 't4-ex3-q3', type: 'multiple-choice', question: 'A oração do justo é...?', options: ['Fraca', 'Poderosa e eficaz', 'Inútil', 'Desnecessária'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  },
  {
    id: 'tiago-5-avancado',
    apostleId: 'tiago',
    level: 'avancado',
    title: 'Maturidade Cristã',
    description: 'Alcance maturidade na fé prática',
    totalPoints: 300,
    medal: '👑',
    chapters: [
      { number: 1, title: 'Síntese: Provações e Sabedoria', book: 'Tiago', chapter: 1, verses: '2-8', content: 'Crescer nas dificuldades', duration: '3 min' },
      { number: 2, title: 'Síntese: Palavra Viva', book: 'Tiago', chapter: 1, verses: '19-27', content: 'Ouvir e praticar', duration: '3 min' },
      { number: 3, title: 'Síntese: Amor sem Distinção', book: 'Tiago', chapter: 2, verses: '1-13', content: 'Amar o próximo', duration: '3 min' },
      { number: 4, title: 'Síntese: Fé Ativa', book: 'Tiago', chapter: 2, verses: '14-26', content: 'Obras que comprovam', duration: '3 min' },
      { number: 5, title: 'Síntese: Palavras que Edificam', book: 'Tiago', chapter: 3, verses: '1-12', content: 'Controle da língua', duration: '3 min' },
      { number: 6, title: 'Síntese: Sabedoria Prática', book: 'Tiago', chapter: 3, verses: '13-18', content: 'Viver com sabedoria', duration: '3 min' },
      { number: 7, title: 'Síntese: Humildade Genuína', book: 'Tiago', chapter: 4, verses: '1-10', content: 'Submissão a Deus', duration: '3 min' },
      { number: 8, title: 'Síntese: Vida Dependente', book: 'Tiago', chapter: 4, verses: '13-17', content: 'Vontade de Deus', duration: '3 min' },
      { number: 9, title: 'Síntese: Perseverança Final', book: 'Tiago', chapter: 5, verses: '7-12', content: 'Aguardar com paciência', duration: '3 min' },
      { number: 10, title: 'Síntese: Comunidade que Ora', book: 'Tiago', chapter: 5, verses: '13-20', content: 'Oração e restauração', duration: '3 min' }
    ],
    exercises: [
      {
        afterChapter: 3,
        bonusMultiplier: 1.0,
        questions: [
          { id: 't5-ex1-q1', type: 'multiple-choice', question: 'O que as provações produzem?', options: ['Medo', 'Perseverança', 'Dúvida', 'Tristeza'], correctAnswer: 1, points: 10 },
          { id: 't5-ex1-q2', type: 'true-false', question: 'Devemos ser praticantes da palavra, não só ouvintes.', correctAnswer: 0, points: 10 },
          { id: 't5-ex1-q3', type: 'multiple-choice', question: 'Como devemos amar?', options: ['Com distinção', 'Sem acepção', 'Seletivamente', 'Raramente'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 6,
        bonusMultiplier: 1.2,
        questions: [
          { id: 't5-ex2-q1', type: 'multiple-choice', question: 'Como a fé se manifesta?', options: ['Só em palavras', 'Em obras', 'Em pensamentos', 'Em desejos'], correctAnswer: 1, points: 10 },
          { id: 't5-ex2-q2', type: 'true-false', question: 'A língua é um pequeno membro mas causa grandes efeitos.', correctAnswer: 0, points: 10 },
          { id: 't5-ex2-q3', type: 'multiple-choice', question: 'De onde vem a verdadeira sabedoria?', options: ['De nós', 'Do alto', 'Do mundo', 'Dos livros'], correctAnswer: 1, points: 10 }
        ]
      },
      {
        afterChapter: 10,
        bonusMultiplier: 1.5,
        questions: [
          { id: 't5-ex3-q1', type: 'multiple-choice', question: 'A quem devemos nos submeter?', options: ['Ao mundo', 'A Deus', 'Aos homens', 'A nós mesmos'], correctAnswer: 1, points: 10 },
          { id: 't5-ex3-q2', type: 'true-false', question: 'Devemos fazer planos dizendo "se o Senhor quiser".', correctAnswer: 0, points: 10 },
          { id: 't5-ex3-q3', type: 'multiple-choice', question: 'Qual é o poder da oração?', options: ['Nenhum', 'Eficaz e poderoso', 'Fraco', 'Limitado'], correctAnswer: 1, points: 10 }
        ]
      }
    ]
  }
];

// Função auxiliar para buscar planos por apóstolo
export function getPlansByApostle(apostleId: string): ReadingPlan[] {
  return readingPlans.filter(plan => plan.apostleId === apostleId);
}

// Função auxiliar para buscar apóstolo por ID
export function getApostleById(id: string): Apostle | undefined {
  return apostles.find(apostle => apostle.id === id);
}

// Função auxiliar para buscar plano por ID
export function getPlanById(id: string): ReadingPlan | undefined {
  return readingPlans.find(plan => plan.id === id);
}

// Função para calcular pontuação total de um exercício
export function calculateExercisePoints(exercise: Exercise): number {
  const basePoints = exercise.questions.reduce((sum, q) => sum + q.points, 0);
  return Math.round(basePoints * exercise.bonusMultiplier);
}

// Função para calcular progresso do plano
export function calculatePlanProgress(completedChapters: number): number {
  return Math.round((completedChapters / 10) * 100);
}
