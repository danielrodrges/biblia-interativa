import { NextRequest, NextResponse } from 'next/server';

const BIBLE_API_BASE = 'https://bible-api.com';

// Mapeamento de versões para a API
const VERSION_MAP: Record<string, string> = {
  'NVI': 'almeida',
  'NIV': 'kjv',
  'ARA': 'almeida',
  'KJV': 'kjv',
};

// Mapeamento de códigos de livros para nomes
const BOOK_NAMES: Record<string, string> = {
  'GEN': 'genesis',
  'EXO': 'exodus',
  'LEV': 'leviticus',
  'NUM': 'numbers',
  'DEU': 'deuteronomy',
  'JOS': 'joshua',
  'JDG': 'judges',
  'RUT': 'ruth',
  '1SA': '1samuel',
  '2SA': '2samuel',
  '1KI': '1kings',
  '2KI': '2kings',
  '1CH': '1chronicles',
  '2CH': '2chronicles',
  'EZR': 'ezra',
  'NEH': 'nehemiah',
  'EST': 'esther',
  'JOB': 'job',
  'PSA': 'psalms',
  'PRO': 'proverbs',
  'ECC': 'ecclesiastes',
  'SNG': 'song',
  'ISA': 'isaiah',
  'JER': 'jeremiah',
  'LAM': 'lamentations',
  'EZK': 'ezekiel',
  'DAN': 'daniel',
  'HOS': 'hosea',
  'JOL': 'joel',
  'AMO': 'amos',
  'OBA': 'obadiah',
  'JON': 'jonah',
  'MIC': 'micah',
  'NAM': 'nahum',
  'HAB': 'habakkuk',
  'ZEP': 'zephaniah',
  'HAG': 'haggai',
  'ZEC': 'zechariah',
  'MAL': 'malachi',
  'MAT': 'matthew',
  'MRK': 'mark',
  'LUK': 'luke',
  'JOH': 'john',
  'ACT': 'acts',
  'ROM': 'romans',
  '1CO': '1corinthians',
  '2CO': '2corinthians',
  'GAL': 'galatians',
  'EPH': 'ephesians',
  'PHP': 'philippians',
  'COL': 'colossians',
  '1TH': '1thessalonians',
  '2TH': '2thessalonians',
  '1TI': '1timothy',
  '2TI': '2timothy',
  'TIT': 'titus',
  'PHM': 'philemon',
  'HEB': 'hebrews',
  'JAS': 'james',
  '1PE': '1peter',
  '2PE': '2peter',
  '1JN': '1john',
  '2JN': '2john',
  '3JN': '3john',
  'JUD': 'jude',
  'REV': 'revelation',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bookId = searchParams.get('bookId');
    const chapter = searchParams.get('chapter');
    const version = searchParams.get('version');

    if (!bookId || !chapter || !version) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: bookId, chapter, version' },
        { status: 400 }
      );
    }

    const bookName = BOOK_NAMES[bookId];
    if (!bookName) {
      return NextResponse.json(
        { error: `Livro não encontrado: ${bookId}` },
        { status: 404 }
      );
    }

    const translationId = VERSION_MAP[version] || 'kjv';
    const url = `${BIBLE_API_BASE}/${bookName}+${chapter}?translation=${translationId}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API retornou status ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Erro na API Bible:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao buscar dados da Bíblia',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
