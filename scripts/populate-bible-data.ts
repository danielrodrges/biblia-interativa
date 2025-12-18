#!/usr/bin/env tsx
/**
 * Script para popular o banco de dados Supabase com dados completos da Bíblia
 * Usa dados do repositório GitHub thiagobodruk/biblia
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = 'https://umbgtudgphbwpkeoebry.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtYmd0dWRncGhid3BrZW9lYnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzY0MzgsImV4cCI6MjA3OTg1MjQzOH0.iYgznrCNhtk4f-7syllTUR-Kv5rFBYC9dVAO7rAbrYg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Estrutura completa da Bíblia (66 livros)
const BIBLE_STRUCTURE = [
  // Antigo Testamento
  { code: 'GEN', name: 'Gênesis', chapters: 50, github: 'gn' },
  { code: 'EXO', name: 'Êxodo', chapters: 40, github: 'ex' },
  { code: 'LEV', name: 'Levítico', chapters: 27, github: 'lv' },
  { code: 'NUM', name: 'Números', chapters: 36, github: 'nm' },
  { code: 'DEU', name: 'Deuteronômio', chapters: 34, github: 'dt' },
  { code: 'JOS', name: 'Josué', chapters: 24, github: 'js' },
  { code: 'JDG', name: 'Juízes', chapters: 21, github: 'jz' },
  { code: 'RUT', name: 'Rute', chapters: 4, github: 'rt' },
  { code: '1SA', name: '1 Samuel', chapters: 31, github: '1sm' },
  { code: '2SA', name: '2 Samuel', chapters: 24, github: '2sm' },
  { code: '1KI', name: '1 Reis', chapters: 22, github: '1rs' },
  { code: '2KI', name: '2 Reis', chapters: 25, github: '2rs' },
  { code: '1CH', name: '1 Crônicas', chapters: 29, github: '1cr' },
  { code: '2CH', name: '2 Crônicas', chapters: 36, github: '2cr' },
  { code: 'EZR', name: 'Esdras', chapters: 10, github: 'ed' },
  { code: 'NEH', name: 'Neemias', chapters: 13, github: 'ne' },
  { code: 'EST', name: 'Ester', chapters: 10, github: 'et' },
  { code: 'JOB', name: 'Jó', chapters: 42, github: 'job' },
  { code: 'PSA', name: 'Salmos', chapters: 150, github: 'sl' },
  { code: 'PRO', name: 'Provérbios', chapters: 31, github: 'pv' },
  { code: 'ECC', name: 'Eclesiastes', chapters: 12, github: 'ec' },
  { code: 'SNG', name: 'Cantares', chapters: 8, github: 'ct' },
  { code: 'ISA', name: 'Isaías', chapters: 66, github: 'is' },
  { code: 'JER', name: 'Jeremias', chapters: 52, github: 'jr' },
  { code: 'LAM', name: 'Lamentações', chapters: 5, github: 'lm' },
  { code: 'EZK', name: 'Ezequiel', chapters: 48, github: 'ez' },
  { code: 'DAN', name: 'Daniel', chapters: 12, github: 'dn' },
  { code: 'HOS', name: 'Oséias', chapters: 14, github: 'os' },
  { code: 'JOL', name: 'Joel', chapters: 3, github: 'jl' },
  { code: 'AMO', name: 'Amós', chapters: 9, github: 'am' },
  { code: 'OBA', name: 'Obadias', chapters: 1, github: 'ob' },
  { code: 'JON', name: 'Jonas', chapters: 4, github: 'jn' },
  { code: 'MIC', name: 'Miquéias', chapters: 7, github: 'mq' },
  { code: 'NAM', name: 'Naum', chapters: 3, github: 'na' },
  { code: 'HAB', name: 'Habacuque', chapters: 3, github: 'hc' },
  { code: 'ZEP', name: 'Sofonias', chapters: 3, github: 'sf' },
  { code: 'HAG', name: 'Ageu', chapters: 2, github: 'ag' },
  { code: 'ZEC', name: 'Zacarias', chapters: 14, github: 'zc' },
  { code: 'MAL', name: 'Malaquias', chapters: 4, github: 'ml' },
  
  // Novo Testamento
  { code: 'MAT', name: 'Mateus', chapters: 28, github: 'mt' },
  { code: 'MRK', name: 'Marcos', chapters: 16, github: 'mc' },
  { code: 'LUK', name: 'Lucas', chapters: 24, github: 'lc' },
  { code: 'JOH', name: 'João', chapters: 21, github: 'jo' },
  { code: 'ACT', name: 'Atos', chapters: 28, github: 'at' },
  { code: 'ROM', name: 'Romanos', chapters: 16, github: 'rm' },
  { code: '1CO', name: '1 Coríntios', chapters: 16, github: '1co' },
  { code: '2CO', name: '2 Coríntios', chapters: 13, github: '2co' },
  { code: 'GAL', name: 'Gálatas', chapters: 6, github: 'gl' },
  { code: 'EPH', name: 'Efésios', chapters: 6, github: 'ef' },
  { code: 'PHP', name: 'Filipenses', chapters: 4, github: 'fp' },
  { code: 'COL', name: 'Colossenses', chapters: 4, github: 'cl' },
  { code: '1TH', name: '1 Tessalonicenses', chapters: 5, github: '1ts' },
  { code: '2TH', name: '2 Tessalonicenses', chapters: 3, github: '2ts' },
  { code: '1TI', name: '1 Timóteo', chapters: 6, github: '1tm' },
  { code: '2TI', name: '2 Timóteo', chapters: 4, github: '2tm' },
  { code: 'TIT', name: 'Tito', chapters: 3, github: 'tt' },
  { code: 'PHM', name: 'Filemom', chapters: 1, github: 'fm' },
  { code: 'HEB', name: 'Hebreus', chapters: 13, github: 'hb' },
  { code: 'JAS', name: 'Tiago', chapters: 5, github: 'tg' },
  { code: '1PE', name: '1 Pedro', chapters: 5, github: '1pe' },
  { code: '2PE', name: '2 Pedro', chapters: 3, github: '2pe' },
  { code: '1JN', name: '1 João', chapters: 5, github: '1jo' },
  { code: '2JN', name: '2 João', chapters: 1, github: '2jo' },
  { code: '3JN', name: '3 João', chapters: 1, github: '3jo' },
  { code: 'JUD', name: 'Judas', chapters: 1, github: 'jd' },
  { code: 'REV', name: 'Apocalipse', chapters: 22, github: 'ap' },
];

const GITHUB_VERSIONS = [
  { id: 'nvi', code: 'NVI', lang: 'pt-BR' },
  { id: 'acf', code: 'ACF', lang: 'pt-BR' },
  { id: 'aa', code: 'AA', lang: 'pt-BR' },
];

async function fetchChapterFromGitHub(version: string, bookGithub: string, chapter: number) {
  const url = `https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/${version}/${bookGithub}/${chapter}.json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar ${version}/${bookGithub}/${chapter}:`, error);
    return null;
  }
}

async function populateBook(book: typeof BIBLE_STRUCTURE[0]) {
  console.log(`\n📖 Processando ${book.name} (${book.code})...`);
  
  for (const version of GITHUB_VERSIONS) {
    console.log(`  📚 Versão ${version.code}...`);
    
    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      const data = await fetchChapterFromGitHub(version.id, book.github, chapter);
      
      if (!data || !data.verses) {
        console.log(`    ⚠️  Cap ${chapter}: Não encontrado`);
        continue;
      }
      
      // Preparar versículos para inserção
      const verses = data.verses.map((verse: any) => ({
        book_id: book.code,
        chapter: chapter,
        verse_number: verse.number,
        text: verse.text,
        language_code: version.lang,
        version_id: version.code,
      }));
      
      // Inserir em lotes de 50 versículos
      const batchSize = 50;
      for (let i = 0; i < verses.length; i += batchSize) {
        const batch = verses.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('bible_verses')
          .upsert(batch, {
            onConflict: 'version_id,book_id,chapter,verse_number',
            ignoreDuplicates: true
          });
        
        if (error) {
          console.error(`    ❌ Erro no cap ${chapter}, batch ${i}:`, error.message);
        }
      }
      
      console.log(`    ✅ Cap ${chapter}: ${verses.length} versículos`);
      
      // Delay para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

async function main() {
  console.log('🚀 Iniciando população do banco de dados...\n');
  console.log(`📊 Total de livros: ${BIBLE_STRUCTURE.length}`);
  console.log(`📚 Versões: ${GITHUB_VERSIONS.map(v => v.code).join(', ')}\n`);
  
  // Popular livros em sequência
  for (const book of BIBLE_STRUCTURE) {
    await populateBook(book);
  }
  
  console.log('\n✅ População concluída!');
  console.log('\n📊 Estatísticas:');
  
  // Contar versículos inseridos
  const { count } = await supabase
    .from('bible_verses')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Total de versículos: ${count}`);
}

main().catch(console.error);
