-- Fix para o erro "Database error saving new user"
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar política para permitir inserção no profiles
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Recriar a função handle_new_user com tratamento de erros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Inserir perfil
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  
  -- Inserir estatísticas de leitura
  INSERT INTO public.reading_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro (opcional)
    RAISE WARNING 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Garantir que as tabelas têm as constraints corretas
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_pkey,
  ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE public.reading_stats
  DROP CONSTRAINT IF EXISTS reading_stats_user_id_key,
  ADD CONSTRAINT reading_stats_user_id_key UNIQUE (user_id);

-- 5. Verificar se as políticas RLS estão corretas
-- Para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Para reading_stats  
ALTER TABLE public.reading_stats ENABLE ROW LEVEL SECURITY;

-- Confirmar que tudo foi criado
SELECT 'Migration completed successfully!' as status;
