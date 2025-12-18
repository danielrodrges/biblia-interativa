import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://umbgtudgphbwpkeoebry.supabase.co'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtYmd0dWRncGhid3BrZW9lYnJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDI3NjQzOCwiZXhwIjoyMDc5ODUyNDM4fQ.UTeVhm5gI63AwrfWCGxL-fRYB_pZxGLQm_BZ7uvzGCM'

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

// Mapeamento de abreviações do GitHub para códigos usados no banco de dados
const ABBREV_TO_BOOK_ID: Record<string, string> = {
  'gn': 'GEN',
  'ex': 'EXO',
  'lv': 'LEV',
  'nm': 'NUM',
  'dt': 'DEU',
  'js': 'JOS',
  'jz': 'JDG',
  'rt': 'RUT',
  '1sm': '1SA',
  '2sm': '2SA',
  '1rs': '1KI',
  '2rs': '2KI',
  '1cr': '1CH',
  '2cr': '2CH',
  'ed': 'EZR',
  'ne': 'NEH',
  'et': 'EST',
  'jó': 'JOB',
  'job': 'JOB',
  'sl': 'PSA',
  'pv': 'PRO',
  'ec': 'ECC',
  'ct': 'SNG',
  'is': 'ISA',
  'jr': 'JER',
  'lm': 'LAM',
  'ez': 'EZK',
  'dn': 'DAN',
  'os': 'HOS',
  'jl': 'JOL',
  'am': 'AMO',
  'ob': 'OBA',
  'jn': 'JON',
  'mq': 'MIC',
  'na': 'NAM',
  'hc': 'HAB',
  'sf': 'ZEP',
  'ag': 'HAG',
  'zc': 'ZEC',
  'ml': 'MAL',
  'mt': 'MAT',
  'mc': 'MRK',
  'lc': 'LUK',
  'jo': 'JHN',
  'at': 'ACT',
  'atos': 'ACT',
  'rm': 'ROM',
  '1co': '1CO',
  '2co': '2CO',
  'gl': 'GAL',
  'ef': 'EPH',
  'fp': 'PHP',
  'cl': 'COL',
  '1ts': '1TH',
  '2ts': '2TH',
  '1tm': '1TI',
  '2tm': '2TI',
  'tt': 'TIT',
  'fm': 'PHM',
  'hb': 'HEB',
  'tg': 'JAS',
  '1pe': '1PE',
  '2pe': '2PE',
  '1jo': '1JN',
  '2jo': '2JN',
  '3jo': '3JN',
  'jd': 'JUD',
  'ap': 'REV',
}

const VERSIONS = [
  { code: 'nvi', language: 'pt', versionId: 'NVI' },
  { code: 'acf', language: 'pt', versionId: 'ACF' },
  { code: 'aa', language: 'pt', versionId: 'ARA' }, // AA no GitHub = ARA no banco
]

interface GitHubBook {
  abbrev: string
  name: string
  chapters: string[][] // array de capítulos, cada capítulo é array de versículos
}

async function fetchBibleVersion(versionCode: string): Promise<GitHubBook[]> {
  const url = `https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/${versionCode}.json`
  
  try {
    console.log(`  📥 Baixando ${url}...`)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json() as GitHubBook[]
    console.log(`  ✅ Baixado com sucesso - ${data.length} livros`)
    return data
  } catch (error) {
    console.error(`  ❌ Erro ao baixar:`, error)
    return []
  }
}

async function populateBible() {
  console.log('🚀 Iniciando população do banco de dados da Bíblia...\n')

  for (const version of VERSIONS) {
    console.log(`\n📖 Processando versão: ${version.code.toUpperCase()}`)
    
    const books = await fetchBibleVersion(version.code)
    
    if (books.length === 0) {
      console.log(`  ⚠️ Nenhum livro encontrado para ${version.code}`)
      continue
    }

    for (const book of books) {
      const bookId = ABBREV_TO_BOOK_ID[book.abbrev]
      
      if (!bookId) {
        console.log(`  ⚠️ Livro desconhecido: ${book.abbrev} (${book.name})`)
        continue
      }

      console.log(`\n  📚 ${book.name} (${bookId}) - ${book.chapters.length} capítulos`)
      
      let totalVerses = 0
      const allVerses: any[] = []

      for (let chapterIndex = 0; chapterIndex < book.chapters.length; chapterIndex++) {
        const chapterNum = chapterIndex + 1
        const verses = book.chapters[chapterIndex]
        
        for (let verseIndex = 0; verseIndex < verses.length; verseIndex++) {
          const verseNum = verseIndex + 1
          const text = verses[verseIndex]
          
          allVerses.push({
            book_id: bookId,
            chapter: chapterNum,
            verse_number: verseNum,
            text: text,
            language_code: version.language,
            version_id: version.versionId // Usar o versionId correto
          })
          
          totalVerses++
        }
      }

      // Inserir em lotes de 100
      for (let i = 0; i < allVerses.length; i += 100) {
        const batch = allVerses.slice(i, i + 100)
        
        const { error } = await supabase
          .from('bible_verses')
          .upsert(batch, {
            onConflict: 'book_id,chapter,verse_number,version_id'
          })

        if (error) {
          console.error(`    ❌ Erro ao inserir lote ${i / 100 + 1}:`, error.message)
        } else {
          console.log(`    ✅ Lote ${i / 100 + 1}/${Math.ceil(allVerses.length / 100)} inserido`)
        }
      }

      console.log(`  ✅ Total: ${totalVerses} versículos inseridos`)
    }
  }

  console.log('\n✅ População concluída!')
}

populateBible().catch(console.error)
