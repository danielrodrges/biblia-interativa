-- ============================================================================
-- BÍBLIA INTERATIVA - ADICIONAR TABELAS DE CONTEÚDO BÍBLICO
-- ============================================================================
-- Descrição: Adiciona tabelas para armazenar versões e versículos da Bíblia
--            (complementa o schema inicial existente)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABELA DE VERSÕES DA BÍBLIA
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bible_versions (
  version_id TEXT PRIMARY KEY,
  language_code TEXT NOT NULL,
  version_name TEXT NOT NULL,
  abbreviation TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.bible_versions IS 'Armazena as diferentes versões/traduções da Bíblia disponíveis';

-- ----------------------------------------------------------------------------
-- 2. TABELA DE VERSÍCULOS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bible_verses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  language_code TEXT NOT NULL,
  version_id TEXT NOT NULL REFERENCES public.bible_versions(version_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_verse_per_version UNIQUE (version_id, book_id, chapter, verse_number)
);

COMMENT ON TABLE public.bible_verses IS 'Armazena todos os versículos da Bíblia em diferentes versões';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_verses_book_chapter ON public.bible_verses(book_id, chapter, verse_number);
CREATE INDEX IF NOT EXISTS idx_verses_version_book ON public.bible_verses(version_id, book_id, chapter);
CREATE INDEX IF NOT EXISTS idx_verses_language ON public.bible_verses(language_code);

-- ----------------------------------------------------------------------------
-- 3. ADICIONAR CAMPOS FALTANTES NA TABELA verse_notes EXISTENTE
-- ----------------------------------------------------------------------------
DO $$ 
BEGIN
  -- Adicionar coluna color_tag se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verse_notes' AND column_name = 'color_tag'
  ) THEN
    ALTER TABLE public.verse_notes ADD COLUMN color_tag TEXT;
  END IF;
  
  -- Renomear note_text para note se necessário
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verse_notes' AND column_name = 'note_text'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verse_notes' AND column_name = 'note'
  ) THEN
    ALTER TABLE public.verse_notes RENAME COLUMN note_text TO note;
  END IF;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) 
-- ============================================================================

ALTER TABLE public.bible_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;

-- Políticas para bible_versions (acesso público)
DROP POLICY IF EXISTS "Permitir leitura pública de versões" ON public.bible_versions;
CREATE POLICY "Permitir leitura pública de versões"
  ON public.bible_versions FOR SELECT
  TO public
  USING (true);

-- Políticas para bible_verses (acesso público)
DROP POLICY IF EXISTS "Permitir leitura pública de versículos" ON public.bible_verses;
CREATE POLICY "Permitir leitura pública de versículos"
  ON public.bible_verses FOR SELECT
  TO public
  USING (true);
