import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('🔍 Testando conexão Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  try {
    console.log('\n📊 Testando query de versões...');
    const { data: versions, error: versionError } = await supabase
      .from('bible_versions')
      .select('*');
    
    if (versionError) {
      console.error('❌ Erro ao buscar versões:', versionError);
    } else {
      console.log('✅ Versões encontradas:', versions?.length);
      console.log(versions);
    }

    console.log('\n📖 Testando query de versículos João 3...');
    const { data: verses, error: versesError } = await supabase
      .from('bible_verses')
      .select('verse_number, text')
      .eq('book_id', 'JHN')
      .eq('chapter', 3)
      .eq('version_id', 'NVI')
      .order('verse_number', { ascending: true })
      .limit(5);
    
    if (versesError) {
      console.error('❌ Erro ao buscar versículos:', versesError);
    } else {
      console.log('✅ Versículos encontrados:', verses?.length);
      console.log(verses);
    }

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testSupabase();
