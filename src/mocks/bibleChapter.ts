// Mock de capítulo bíblico
export interface Verse {
  number: number;
  text: string;
}

export interface BibleChapterMock {
  book: string;
  chapter: number;
  verses: Verse[];
}

// João 3 (versão simplificada em Português)
export const mockChapter: BibleChapterMock = {
  book: 'João',
  chapter: 3,
  verses: [
    {
      number: 1,
      text: 'Havia entre os fariseus um homem chamado Nicodemos, uma autoridade entre os judeus.'
    },
    {
      number: 2,
      text: 'Ele veio a Jesus, à noite, e disse: "Mestre, sabemos que ensinas da parte de Deus, pois ninguém pode realizar os sinais miraculosos que estás fazendo, se Deus não estiver com ele".'
    },
    {
      number: 3,
      text: 'Em resposta, Jesus declarou: "Digo a verdade: Ninguém pode ver o Reino de Deus, se não nascer de novo".'
    },
    {
      number: 4,
      text: 'Perguntou Nicodemos: "Como alguém pode nascer, sendo velho? É claro que não pode entrar pela segunda vez no ventre de sua mãe e renascer!"'
    },
    {
      number: 5,
      text: 'Respondeu Jesus: "Digo a verdade: Ninguém pode entrar no Reino de Deus, se não nascer da água e do Espírito.'
    },
    {
      number: 6,
      text: 'O que nasce da carne é carne, mas o que nasce do Espírito é espírito.'
    },
    {
      number: 7,
      text: 'Não se surpreenda pelo fato de eu ter dito: É necessário que vocês nasçam de novo.'
    },
    {
      number: 8,
      text: 'O vento sopra onde quer. Você o escuta, mas não pode dizer de onde vem nem para onde vai. Assim acontece com todos os nascidos do Espírito".'
    },
    {
      number: 9,
      text: 'Perguntou Nicodemos: "Como pode ser isso?"'
    },
    {
      number: 10,
      text: 'Disse Jesus: "Você é mestre em Israel e não entende essas coisas?'
    },
    {
      number: 11,
      text: 'Digo a verdade: Nós falamos do que conhecemos e testemunhamos do que vimos, mas mesmo assim vocês não aceitam o nosso testemunho.'
    },
    {
      number: 12,
      text: 'Eu falei de coisas terrenas e vocês não creram; como crerão se eu falar de coisas celestiais?'
    },
    {
      number: 13,
      text: 'Ninguém jamais subiu ao céu, a não ser aquele que veio do céu: o Filho do homem.'
    },
    {
      number: 14,
      text: 'Da mesma forma como Moisés levantou a serpente no deserto, assim também é necessário que o Filho do homem seja levantado,'
    },
    {
      number: 15,
      text: 'para que todo o que nele crer tenha a vida eterna.'
    },
    {
      number: 16,
      text: 'Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.'
    },
    {
      number: 17,
      text: 'Pois Deus enviou o seu Filho ao mundo, não para condenar o mundo, mas para que este fosse salvo por meio dele.'
    },
    {
      number: 18,
      text: 'Quem nele crê não é condenado, mas quem não crê já está condenado, por não crer no nome do Filho Unigênito de Deus.'
    }
  ]
};
