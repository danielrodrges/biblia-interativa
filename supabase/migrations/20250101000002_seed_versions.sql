-- Inserir versões da Bíblia
INSERT INTO public.bible_versions (version_id, language_code, version_name, abbreviation, description)
VALUES 
  ('NVI', 'pt-BR', 'Nova Versão Internacional', 'NVI', 'Tradução moderna e precisa'),
  ('ARA', 'pt-BR', 'Almeida Revista e Atualizada', 'ARA', 'Revisão de Almeida'),
  ('ACF', 'pt-BR', 'Almeida Corrigida Fiel', 'ACF', 'Versão fiel ao texto'),
  ('KJV', 'en-US', 'King James Version', 'KJV', 'Classic English translation'),
  ('NIV', 'en-US', 'New International Version', 'NIV', 'Modern English translation'),
  ('RVR60', 'es-ES', 'Reina-Valera 1960', 'RVR60', 'Versión clásica en español')
ON CONFLICT (version_id) DO NOTHING;
