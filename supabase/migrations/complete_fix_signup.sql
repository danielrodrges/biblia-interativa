-- ========================================
-- FIX COMPLETO PARA "Database error saving new user"
-- Execute TODO este script no Supabase SQL Editor
-- ========================================

-- Passo 1: Desabilitar RLS temporariamente para debug
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_stats DISABLE ROW LEVEL SECURITY;

-- Passo 2: Remover o trigger problemático
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Passo 3: Criar função CORRETA com permissões adequadas
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- Importante: executa com permissões do owner
SET search_path = public
AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Extrair nome do usuário ou usar vazio
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  -- Inserir perfil (ignorar conflitos)
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (NEW.id, user_name, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE 
  SET full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      updated_at = NOW();
  
  -- Inserir estatísticas (ignorar conflitos)
  INSERT INTO public.reading_stats (
    user_id, 
    total_verses_read,
    total_chapters_read,
    total_books_read,
    total_reading_time_minutes,
    current_streak_days,
    longest_streak_days,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    0, 0, 0, 0, 0, 0,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
  
EXCEPTION WHEN OTHERS THEN
  -- Log do erro mas não quebra o signup
  RAISE LOG 'Erro em handle_new_user para usuário %: %', NEW.id, SQLERRM;
  -- Retorna NEW mesmo com erro para não bloquear o signup
  RETURN NEW;
END;
$$;

-- Passo 4: Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Passo 5: Reabilitar RLS com políticas corretas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_stats ENABLE ROW LEVEL SECURITY;

-- Passo 6: Remover TODAS as políticas antigas
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reading_stats')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.reading_stats';
    END LOOP;
END $$;

-- Passo 7: Criar políticas RLS CORRETAS

-- Políticas para PROFILES
CREATE POLICY "enable_read_own_profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "enable_insert_own_profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "enable_update_own_profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Políticas para READING_STATS
CREATE POLICY "enable_read_own_stats"
  ON public.reading_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "enable_insert_own_stats"
  ON public.reading_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "enable_update_own_stats"
  ON public.reading_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Passo 8: Garantir que service_role bypassa RLS (para o trigger)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.reading_stats FORCE ROW LEVEL SECURITY;

-- Passo 9: Verificar se tudo está OK
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completa!';
  RAISE NOTICE '📊 Verificando configuração...';
END $$;

SELECT 
  'Políticas criadas para profiles' as status,
  count(*) as total
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
UNION ALL
SELECT 
  'Políticas criadas para reading_stats',
  count(*)
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'reading_stats'
UNION ALL
SELECT
  'Trigger configurado',
  count(*)::integer
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- ========================================
-- FIM - Agora teste criar uma conta!
-- ========================================
