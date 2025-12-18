-- Script para adicionar índices compostos ao banco de dados Supabase
-- Isso vai acelerar significativamente as consultas de versículos

-- Índice composto para a consulta principal de versículos
-- Usado em: .eq('book_id', bookCode).eq('chapter', chapter).eq('version_id', version)
CREATE INDEX IF NOT EXISTS idx_bible_verses_lookup 
ON bible_verses(version_id, book_id, chapter, verse_number);

-- Índice individual para book_id (caso não exista)
CREATE INDEX IF NOT EXISTS idx_bible_verses_book 
ON bible_verses(book_id);

-- Índice individual para version_id (caso não exista)  
CREATE INDEX IF NOT EXISTS idx_bible_verses_version 
ON bible_verses(version_id);

-- Análise da tabela para otimizar o plano de execução
ANALYZE bible_verses;

-- Verificar estatísticas da tabela
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE tablename = 'bible_verses'
ORDER BY attname;
