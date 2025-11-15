// Dados bíblicos estruturados - Base de dados local
// Fonte: Versões oficiais da Bíblia (NVI, NIV, etc.)

import { BibleVerseData } from './types';

/**
 * Base de dados bíblica local
 * Contém versículos de livros principais em múltiplas versões e idiomas
 */
export const sampleBibleVerses: BibleVerseData[] = [
  // ========== JOÃO 1 ==========
  // João 1:1-5 (Prólogo)
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'JOH',
    book_name: 'João',
    chapter: 1,
    verse: 1,
    text: 'No princípio era aquele que é a Palavra. Ele estava com Deus, e era Deus.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'JOH',
    book_name: 'John',
    chapter: 1,
    verse: 1,
    text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'JOH',
    book_name: 'João',
    chapter: 1,
    verse: 2,
    text: 'Ele estava com Deus no princípio.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'JOH',
    book_name: 'John',
    chapter: 1,
    verse: 2,
    text: 'He was with God in the beginning.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'JOH',
    book_name: 'João',
    chapter: 1,
    verse: 3,
    text: 'Todas as coisas foram feitas por intermédio dele; sem ele, nada do que existe teria sido feito.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'JOH',
    book_name: 'John',
    chapter: 1,
    verse: 3,
    text: 'Through him all things were made; without him nothing was made that has been made.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'JOH',
    book_name: 'João',
    chapter: 1,
    verse: 4,
    text: 'Nele estava a vida, e esta era a luz dos homens.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'JOH',
    book_name: 'John',
    chapter: 1,
    verse: 4,
    text: 'In him was life, and that life was the light of all mankind.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'JOH',
    book_name: 'João',
    chapter: 1,
    verse: 5,
    text: 'A luz brilha nas trevas, e as trevas não a derrotaram.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'JOH',
    book_name: 'John',
    chapter: 1,
    verse: 5,
    text: 'The light shines in the darkness, and the darkness has not overcome it.',
    source_reference: 'Biblica',
  },

  // ========== JOÃO 3:16-18 ==========
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'JOH',
    book_name: 'João',
    chapter: 3,
    verse: 16,
    text: 'Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'JOH',
    book_name: 'John',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'JOH',
    book_name: 'João',
    chapter: 3,
    verse: 17,
    text: 'Pois Deus enviou o seu Filho ao mundo, não para condenar o mundo, mas para que este fosse salvo por meio dele.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'JOH',
    book_name: 'John',
    chapter: 3,
    verse: 17,
    text: 'For God did not send his Son into the world to condemn the world, but to save the world through him.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'JOH',
    book_name: 'João',
    chapter: 3,
    verse: 18,
    text: 'Quem nele crê não é condenado, mas quem não crê já está condenado, por não crer no nome do Filho Unigênito de Deus.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'JOH',
    book_name: 'John',
    chapter: 3,
    verse: 18,
    text: 'Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God\'s one and only Son.',
    source_reference: 'Biblica',
  },

  // ========== MATEUS 5:1-12 (Bem-aventuranças) ==========
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'MAT',
    book_name: 'Mateus',
    chapter: 5,
    verse: 1,
    text: 'Vendo as multidões, Jesus subiu ao monte e se assentou. Seus discípulos aproximaram-se dele,',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'MAT',
    book_name: 'Matthew',
    chapter: 5,
    verse: 1,
    text: 'Now when Jesus saw the crowds, he went up on a mountainside and sat down. His disciples came to him,',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'MAT',
    book_name: 'Mateus',
    chapter: 5,
    verse: 2,
    text: 'e ele começou a ensiná-los, dizendo:',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'MAT',
    book_name: 'Matthew',
    chapter: 5,
    verse: 2,
    text: 'and he began to teach them. He said:',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'MAT',
    book_name: 'Mateus',
    chapter: 5,
    verse: 3,
    text: '"Bem-aventurados os pobres em espírito, pois deles é o Reino dos céus.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'MAT',
    book_name: 'Matthew',
    chapter: 5,
    verse: 3,
    text: '"Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'MAT',
    book_name: 'Mateus',
    chapter: 5,
    verse: 4,
    text: 'Bem-aventurados os que choram, pois serão consolados.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'MAT',
    book_name: 'Matthew',
    chapter: 5,
    verse: 4,
    text: 'Blessed are those who mourn, for they will be comforted.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'MAT',
    book_name: 'Mateus',
    chapter: 5,
    verse: 5,
    text: 'Bem-aventurados os humildes, pois eles receberão a terra por herança.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'MAT',
    book_name: 'Matthew',
    chapter: 5,
    verse: 5,
    text: 'Blessed are the meek, for they will inherit the earth.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'MAT',
    book_name: 'Mateus',
    chapter: 5,
    verse: 6,
    text: 'Bem-aventurados os que têm fome e sede de justiça, pois serão satisfeitos.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'MAT',
    book_name: 'Matthew',
    chapter: 5,
    verse: 6,
    text: 'Blessed are those who hunger and thirst for righteousness, for they will be filled.',
    source_reference: 'Biblica',
  },

  // ========== GÊNESIS 1:1-5 (Criação) ==========
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'GEN',
    book_name: 'Gênesis',
    chapter: 1,
    verse: 1,
    text: 'No princípio Deus criou os céus e a terra.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'GEN',
    book_name: 'Genesis',
    chapter: 1,
    verse: 1,
    text: 'In the beginning God created the heavens and the earth.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'GEN',
    book_name: 'Gênesis',
    chapter: 1,
    verse: 2,
    text: 'Era a terra sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'GEN',
    book_name: 'Genesis',
    chapter: 1,
    verse: 2,
    text: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'GEN',
    book_name: 'Gênesis',
    chapter: 1,
    verse: 3,
    text: 'Disse Deus: "Haja luz", e houve luz.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'GEN',
    book_name: 'Genesis',
    chapter: 1,
    verse: 3,
    text: 'And God said, "Let there be light," and there was light.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'GEN',
    book_name: 'Gênesis',
    chapter: 1,
    verse: 4,
    text: 'Deus viu que a luz era boa, e separou a luz das trevas.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'GEN',
    book_name: 'Genesis',
    chapter: 1,
    verse: 4,
    text: 'God saw that the light was good, and he separated the light from the darkness.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'GEN',
    book_name: 'Gênesis',
    chapter: 1,
    verse: 5,
    text: 'Deus chamou à luz dia, e às trevas chamou noite. Passaram-se a tarde e a manhã; esse foi o primeiro dia.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'GEN',
    book_name: 'Genesis',
    chapter: 1,
    verse: 5,
    text: 'God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.',
    source_reference: 'Biblica',
  },

  // ========== SALMOS 23 (Salmo do Bom Pastor) ==========
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'PSA',
    book_name: 'Salmos',
    chapter: 23,
    verse: 1,
    text: 'O Senhor é o meu pastor; de nada terei falta.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'PSA',
    book_name: 'Psalms',
    chapter: 23,
    verse: 1,
    text: 'The Lord is my shepherd, I lack nothing.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'PSA',
    book_name: 'Salmos',
    chapter: 23,
    verse: 2,
    text: 'Em verdes pastagens me faz repousar e me conduz a águas tranquilas;',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'PSA',
    book_name: 'Psalms',
    chapter: 23,
    verse: 2,
    text: 'He makes me lie down in green pastures, he leads me beside quiet waters,',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'PSA',
    book_name: 'Salmos',
    chapter: 23,
    verse: 3,
    text: 'refrigera-me a alma. Guia-me pelas veredas da justiça por amor do seu nome.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'PSA',
    book_name: 'Psalms',
    chapter: 23,
    verse: 3,
    text: 'he refreshes my soul. He guides me along the right paths for his name\'s sake.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'PSA',
    book_name: 'Salmos',
    chapter: 23,
    verse: 4,
    text: 'Mesmo quando eu andar por um vale de trevas e morte, não temerei perigo algum, pois tu estás comigo; a tua vara e o teu cajado me protegem.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'PSA',
    book_name: 'Psalms',
    chapter: 23,
    verse: 4,
    text: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'PSA',
    book_name: 'Salmos',
    chapter: 23,
    verse: 5,
    text: 'Preparas um banquete para mim à vista dos meus inimigos. Tu me honras, ungindo a minha cabeça com óleo e fazendo transbordar o meu cálice.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'PSA',
    book_name: 'Psalms',
    chapter: 23,
    verse: 5,
    text: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'PSA',
    book_name: 'Salmos',
    chapter: 23,
    verse: 6,
    text: 'Sei que a bondade e a fidelidade me acompanharão todos os dias da minha vida, e voltarei à casa do Senhor enquanto eu viver.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'PSA',
    book_name: 'Psalms',
    chapter: 23,
    verse: 6,
    text: 'Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.',
    source_reference: 'Biblica',
  },

  // ========== ROMANOS 8:28 ==========
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'ROM',
    book_name: 'Romanos',
    chapter: 8,
    verse: 28,
    text: 'Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'ROM',
    book_name: 'Romans',
    chapter: 8,
    verse: 28,
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    source_reference: 'Biblica',
  },

  // ========== FILIPENSES 4:13 ==========
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'PHP',
    book_name: 'Filipenses',
    chapter: 4,
    verse: 13,
    text: 'Tudo posso naquele que me fortalece.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'PHP',
    book_name: 'Philippians',
    chapter: 4,
    verse: 13,
    text: 'I can do all this through him who gives me strength.',
    source_reference: 'Biblica',
  },

  // ========== PROVÉRBIOS 3:5-6 ==========
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'PRO',
    book_name: 'Provérbios',
    chapter: 3,
    verse: 5,
    text: 'Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento;',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'PRO',
    book_name: 'Proverbs',
    chapter: 3,
    verse: 5,
    text: 'Trust in the Lord with all your heart and lean not on your own understanding;',
    source_reference: 'Biblica',
  },
  {
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    bible_version_id: 'NVI',
    bible_version_name: 'Nova Versão Internacional',
    book_id: 'PRO',
    book_name: 'Provérbios',
    chapter: 3,
    verse: 6,
    text: 'reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas.',
    source_reference: 'Sociedade Bíblica Internacional',
  },
  {
    language_code: 'en-US',
    language_name: 'English (United States)',
    bible_version_id: 'NIV',
    bible_version_name: 'New International Version',
    book_id: 'PRO',
    book_name: 'Proverbs',
    chapter: 3,
    verse: 6,
    text: 'in all your ways submit to him, and he will make your paths straight.',
    source_reference: 'Biblica',
  },
];

/**
 * Gera identificador único para um versículo
 */
export function generateVerseId(
  languageCode: string,
  versionId: string,
  bookId: string,
  chapter: number,
  verse: number
): string {
  return `${languageCode}:${versionId}:${bookId}:${chapter}:${verse}`;
}

/**
 * Busca um versículo específico
 */
export function getVerse(
  languageCode: string,
  versionId: string,
  bookId: string,
  chapter: number,
  verse: number
): BibleVerseData | undefined {
  return sampleBibleVerses.find(
    (v) =>
      v.language_code === languageCode &&
      v.bible_version_id === versionId &&
      v.book_id === bookId &&
      v.chapter === chapter &&
      v.verse === verse
  );
}

/**
 * Busca todos os versículos de um capítulo
 */
export function getChapterVerses(
  languageCode: string,
  versionId: string,
  bookId: string,
  chapter: number
): BibleVerseData[] {
  return sampleBibleVerses.filter(
    (v) =>
      v.language_code === languageCode &&
      v.bible_version_id === versionId &&
      v.book_id === bookId &&
      v.chapter === chapter
  );
}

/**
 * Busca versículos bilíngues (mesmo livro, capítulo e versículo em dois idiomas)
 */
export function getBilingualVerses(
  nativeLanguage: string,
  nativeVersion: string,
  learningLanguage: string,
  learningVersion: string,
  bookId: string,
  chapter: number
): Array<{ native: BibleVerseData; learning: BibleVerseData }> {
  const nativeVerses = getChapterVerses(nativeLanguage, nativeVersion, bookId, chapter);
  const learningVerses = getChapterVerses(learningLanguage, learningVersion, bookId, chapter);

  const bilingualVerses: Array<{ native: BibleVerseData; learning: BibleVerseData }> = [];

  for (const nativeVerse of nativeVerses) {
    const learningVerse = learningVerses.find((v) => v.verse === nativeVerse.verse);
    if (learningVerse) {
      bilingualVerses.push({
        native: nativeVerse,
        learning: learningVerse,
      });
    }
  }

  return bilingualVerses;
}

/**
 * Verifica se um capítulo tem dados disponíveis
 */
export function hasChapterData(
  languageCode: string,
  versionId: string,
  bookId: string,
  chapter: number
): boolean {
  return sampleBibleVerses.some(
    (v) =>
      v.language_code === languageCode &&
      v.bible_version_id === versionId &&
      v.book_id === bookId &&
      v.chapter === chapter
  );
}

/**
 * Lista capítulos disponíveis para um livro
 */
export function getAvailableChapters(
  languageCode: string,
  versionId: string,
  bookId: string
): number[] {
  const chapters = new Set<number>();
  sampleBibleVerses
    .filter(
      (v) =>
        v.language_code === languageCode &&
        v.bible_version_id === versionId &&
        v.book_id === bookId
    )
    .forEach((v) => chapters.add(v.chapter));
  return Array.from(chapters).sort((a, b) => a - b);
}
