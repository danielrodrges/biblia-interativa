-- Migração para popular a Bíblia completa
-- Esta migração desabilita RLS temporariamente, popula os dados e reabilita

-- Desabilitar RLS temporariamente
ALTER TABLE bible_verses DISABLE ROW LEVEL SECURITY;

-- A população será feita via script TypeScript após esta migração

-- Criar função helper para popular (caso queira usar SQL puro)
CREATE OR REPLACE FUNCTION populate_bible_batch(
  verses jsonb
) RETURNS void AS $$
BEGIN
  INSERT INTO bible_verses (book_id, chapter, verse_number, text, language_code, version_id)
  SELECT 
    (v->>'book_id')::text,
    (v->>'chapter')::integer,
    (v->>'verse_number')::integer,
    (v->>'text')::text,
    (v->>'language_code')::text,
    (v->>'version_id')::text
  FROM jsonb_array_elements(verses) v
  ON CONFLICT (book_id, chapter, verse_number, version_id) 
  DO UPDATE SET text = EXCLUDED.text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário: Após popular, execute a migração 20250101000004_enable_rls.sql
