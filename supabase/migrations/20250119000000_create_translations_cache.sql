-- Tabela para cache de traduções
CREATE TABLE IF NOT EXISTS translations_cache (
  id BIGSERIAL PRIMARY KEY,
  source_text TEXT NOT NULL,
  source_lang VARCHAR(5) DEFAULT 'pt' NOT NULL,
  target_lang VARCHAR(5) NOT NULL,
  translated_text TEXT NOT NULL,
  translation_service VARCHAR(50),
  quality_score DECIMAL(3,2), -- 0.00 a 1.00
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  usage_count INTEGER DEFAULT 1,
  
  -- Índices para performance
  CONSTRAINT unique_translation UNIQUE (source_text, source_lang, target_lang)
);

-- Índices para buscas rápidas
CREATE INDEX idx_translations_cache_lookup ON translations_cache(source_text, source_lang, target_lang);
CREATE INDEX idx_translations_cache_lang ON translations_cache(target_lang);
CREATE INDEX idx_translations_cache_created ON translations_cache(created_at DESC);

-- Função para atualizar timestamp e contador de uso
CREATE OR REPLACE FUNCTION update_translation_usage()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.usage_count = OLD.usage_count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente
CREATE TRIGGER trigger_update_translation_usage
  BEFORE UPDATE ON translations_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_usage();

-- Row Level Security
ALTER TABLE translations_cache ENABLE ROW LEVEL SECURITY;

-- Política: todos podem ler
CREATE POLICY "Translations cache are viewable by everyone"
  ON translations_cache FOR SELECT
  USING (true);

-- Política: apenas autenticados podem inserir/atualizar
CREATE POLICY "Authenticated users can insert translations"
  ON translations_cache FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update translations"
  ON translations_cache FOR UPDATE
  USING (true);

COMMENT ON TABLE translations_cache IS 'Cache persistente de traduções com métricas de qualidade';
