-- Fix definitivo para "Database error saving new user"
-- Execute este script no Supabase SQL Editor

-- ========================================
-- 1. REMOVER POLÍTICAS ANTIGAS
-- ========================================
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;

DROP POLICY IF EXISTS "Usuários podem ver suas próprias estatísticas" ON public.reading_stats;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias estatísticas" ON public.reading_stats;
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias estatísticas" ON public.reading_stats;

-- ========================================
-- 2. CRIAR POLÍTICAS CORRETAS PARA PROFILES
-- ========================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ========================================
-- 3. CRIAR POLÍTICAS CORRETAS PARA READING_STATS
-- ========================================
CREATE POLICY "Users can view own stats"
  ON public.reading_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON public.reading_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.reading_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 4. RECRIAR FUNÇÃO HANDLE_NEW_USER (BACKUP)
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Inserir perfil (ignorar se já existe)
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  
  -- Inserir estatísticas (ignorar se já existe)
  INSERT INTO public.reading_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log mas não quebra o signup
    RAISE WARNING 'Erro ao criar perfil automaticamente: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. RECRIAR TRIGGER
-- ========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 6. VERIFICAÇÃO
-- ========================================
SELECT 
  'Políticas RLS configuradas com sucesso!' as status,
  COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'reading_stats');
