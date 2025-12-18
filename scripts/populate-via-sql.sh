#!/bin/bash

# Script para popular a Bíblia via SQL (bypassa RLS)
# Baixa os JSONs e cria comandos SQL INSERT

VERSIONS=("nvi" "acf" "aa")
TEMP_SQL="/tmp/populate_bible.sql"

echo "🚀 Criando script SQL para popular a Bíblia..."
echo "" > $TEMP_SQL

for VERSION in "${VERSIONS[@]}"; do
    echo "📥 Baixando $VERSION..."
    
    JSON_FILE="/tmp/${VERSION}.json"
    curl -s "https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/${VERSION}.json" -o "$JSON_FILE"
    
    if [ ! -f "$JSON_FILE" ]; then
        echo "❌ Erro ao baixar $VERSION"
        continue
    fi
    
    echo "📝 Gerando SQL para $VERSION..."
    
    # Usar Node.js para processar o JSON e gerar SQL
    node -e "
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('$JSON_FILE', 'utf8'));
    
    const abbrevMap = {
        'gn': 'GEN', 'ex': 'EXO', 'lv': 'LEV', 'nm': 'NUM', 'dt': 'DEU',
        'js': 'JOS', 'jz': 'JDG', 'rt': 'RUT', '1sm': '1SA', '2sm': '2SA',
        '1rs': '1KI', '2rs': '2KI', '1cr': '1CH', '2cr': '2CH', 'ed': 'EZR',
        'ne': 'NEH', 'et': 'EST', 'jó': 'JOB', 'sl': 'PSA', 'pv': 'PRO',
        'ec': 'ECC', 'ct': 'SNG', 'is': 'ISA', 'jr': 'JER', 'lm': 'LAM',
        'ez': 'EZK', 'dn': 'DAN', 'os': 'HOS', 'jl': 'JOL', 'am': 'AMO',
        'ob': 'OBA', 'jn': 'JON', 'mq': 'MIC', 'na': 'NAM', 'hc': 'HAB',
        'sf': 'ZEP', 'ag': 'HAG', 'zc': 'ZEC', 'ml': 'MAL', 'mt': 'MAT',
        'mc': 'MRK', 'lc': 'LUK', 'jo': 'JHN', 'at': 'ACT', 'rm': 'ROM',
        '1co': '1CO', '2co': '2CO', 'gl': 'GAL', 'ef': 'EPH', 'fp': 'PHP',
        'cl': 'COL', '1ts': '1TH', '2ts': '2TH', '1tm': '1TI', '2tm': '2TI',
        'tt': 'TIT', 'fm': 'PHM', 'hb': 'HEB', 'tg': 'JAS', '1pe': '1PE',
        '2pe': '2PE', '1jo': '1JN', '2jo': '2JN', '3jo': '3JN', 'jd': 'JUD',
        'ap': 'REV'
    };
    
    const version = '$VERSION'.toUpperCase();
    const language = 'pt';
    
    let inserts = [];
    
    data.forEach(book => {
        const bookId = abbrevMap[book.abbrev];
        if (!bookId) {
            console.error('⚠️ Livro desconhecido:', book.abbrev);
            return;
        }
        
        book.chapters.forEach((verses, chapterIndex) => {
            const chapter = chapterIndex + 1;
            
            verses.forEach((text, verseIndex) => {
                const verse = verseIndex + 1;
                const escapedText = text.replace(/'/g, \"''\");
                
                inserts.push(
                    \`('\${bookId}', \${chapter}, \${verse}, '\${escapedText}', '\${language}', '\${version}')\`
                );
            });
        });
    });
    
    // Inserir em lotes de 500
    for (let i = 0; i < inserts.length; i += 500) {
        const batch = inserts.slice(i, i + 500);
        console.log(\`INSERT INTO bible_verses (book_id, chapter, verse_number, text, language_code, version_id) VALUES\`);
        console.log(batch.join(',\\n'));
        console.log(\`ON CONFLICT (book_id, chapter, verse_number, version_id) DO UPDATE SET text = EXCLUDED.text;\\n\`);
    }
    " >> $TEMP_SQL
    
    echo "✅ SQL gerado para $VERSION"
done

echo ""
echo "📊 Executando SQL no Supabase..."
supabase db reset --db-url "postgresql://postgres.umbgtudgphbwpkeoebry:${SUPABASE_DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres" < $TEMP_SQL

echo "✅ Concluído!"
