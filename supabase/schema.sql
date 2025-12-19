-- Bíblia Interativa - Schema do Supabase
-- Execute este script no Supabase SQL Editor

-- ========================================
-- 1. TABELA DE PERFIS DE USUÁRIOS
-- ========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- 2. TABELA DE PROGRESSO DE LEITURA
-- ========================================
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_code TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER,
  bible_version TEXT NOT NULL,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_code, chapter_number, bible_version)
);

-- RLS para reading_progress
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio progresso"
  ON public.reading_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio progresso"
  ON public.reading_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio progresso"
  ON public.reading_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- 3. TABELA DE ESTATÍSTICAS DE LEITURA
-- ========================================
CREATE TABLE IF NOT EXISTS public.reading_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_verses_read INTEGER DEFAULT 0,
  total_chapters_read INTEGER DEFAULT 0,
  total_books_read INTEGER DEFAULT 0,
  total_reading_time_minutes INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_read_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS para reading_stats
ALTER TABLE public.reading_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias estatísticas"
  ON public.reading_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias estatísticas"
  ON public.reading_stats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias estatísticas"
  ON public.reading_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 4. TABELA DE NOTAS E MARCAÇÕES
-- ========================================
CREATE TABLE IF NOT EXISTS public.verse_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_code TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  bible_version TEXT NOT NULL,
  note_text TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  color_tag TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para verse_notes
ALTER TABLE public.verse_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias notas"
  ON public.verse_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias notas"
  ON public.verse_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias notas"
  ON public.verse_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias notas"
  ON public.verse_notes FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 5. TABELA DE PREFERÊNCIAS DE LEITURA
-- ========================================
CREATE TABLE IF NOT EXISTS public.reading_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dominant_language TEXT NOT NULL,
  bible_version TEXT NOT NULL,
  practice_language TEXT NOT NULL,
  reader_font_size TEXT DEFAULT 'M',
  subtitle_enabled BOOLEAN DEFAULT TRUE,
  subtitle_font_size TEXT DEFAULT 'M',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS para reading_preferences
ALTER TABLE public.reading_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias preferências"
  ON public.reading_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias preferências"
  ON public.reading_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias preferências"
  ON public.reading_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- 6. ÍNDICES PARA PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_last_read ON public.reading_progress(last_read_at DESC);
CREATE INDEX IF NOT EXISTS idx_verse_notes_user_id ON public.verse_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_verse_notes_favorite ON public.verse_notes(user_id, is_favorite) WHERE is_favorite = TRUE;

-- ========================================
-- 7. FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.reading_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente quando novo usuário se cadastra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 8. FUNÇÃO PARA ATUALIZAR updated_at
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_reading_stats
  BEFORE UPDATE ON public.reading_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_verse_notes
  BEFORE UPDATE ON public.verse_notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_reading_preferences
  BEFORE UPDATE ON public.reading_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- CONCLUÍDO!
-- ========================================
-- Todas as tabelas, políticas RLS e triggers foram criados com sucesso.
-- Agora você pode sincronizar seu app com o Supabase.
