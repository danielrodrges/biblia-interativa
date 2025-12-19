# 🌐 Sistema Robusto de Tradução

## 📋 Visão Geral

Sistema profissional de tradução com **5 provedores**, cache persistente, sistema de fallback automático e validação de qualidade.

## 🎯 Melhorias Implementadas

### ✅ **Antes vs Depois**

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Provedores** | 2 (Google não oficial + MyMemory) | 5 (LibreTranslate, Lingva, DeepL, Google, MyMemory) |
| **Cache** | Memória volátil (perde no deploy) | **Supabase persistente** + memória |
| **Rate Limiting** | Nenhum | Controle por provedor |
| **Qualidade** | Sem validação | Score 0-1 com regras |
| **Fallback** | Linear (Google → MyMemory) | **Cascata inteligente** por qualidade |
| **Persistência** | ❌ Perda total em deploy | ✅ **Cache permanente** |
| **Monitoramento** | Logs básicos | Métricas de uso, qualidade e provider |

## 🔧 Provedores Disponíveis

### 1️⃣ **DeepL** (Melhor Qualidade) ⭐⭐⭐⭐⭐
- **Qualidade**: Profissional (melhor do mercado)
- **Limite Grátis**: 500.000 caracteres/mês
- **Velocidade**: Rápida
- **Configuração**: Requer API Key

```bash
# Obter API Key grátis em: https://www.deepl.com/pro-api
DEEPL_API_KEY=your-key-here
```

### 2️⃣ **LibreTranslate** (Open Source) ⭐⭐⭐⭐
- **Qualidade**: Boa
- **Limite**: Sem limites (self-hosted)
- **Velocidade**: Média
- **Configuração**: Nenhuma (usa instância pública)

**Self-Hosting (Docker):**
```bash
docker run -d -p 5000:5000 libretranslate/libretranslate
```

### 3️⃣ **Lingva** (Proxy Google) ⭐⭐⭐⭐
- **Qualidade**: Boa (usa motor do Google)
- **Limite**: Sem limites oficiais
- **Velocidade**: Rápida
- **Configuração**: Nenhuma

### 4️⃣ **Google Translate** (Fallback) ⭐⭐⭐
- **Qualidade**: Média
- **Limite**: Não oficial (pode bloquear)
- **Velocidade**: Rápida
- **Configuração**: Nenhuma

### 5️⃣ **MyMemory** (Último Recurso) ⭐⭐
- **Qualidade**: Variável
- **Limite**: 500 req/dia
- **Velocidade**: Lenta
- **Configuração**: Nenhuma

## 🗄️ Cache Persistente no Supabase

### Estrutura da Tabela

```sql
translations_cache:
  - source_text: TEXT
  - source_lang: VARCHAR(5)
  - target_lang: VARCHAR(5)
  - translated_text: TEXT
  - translation_service: VARCHAR(50)
  - quality_score: DECIMAL(3,2)  -- 0.00 a 1.00
  - usage_count: INTEGER
  - created_at: TIMESTAMPTZ
  - updated_at: TIMESTAMPTZ
```

### Benefícios

- ✅ **Persistente**: Sobrevive a deploys e reinicializações
- ✅ **Compartilhado**: Todos os usuários se beneficiam do cache
- ✅ **Inteligente**: Apenas traduções de qualidade ≥ 0.7 são cacheadas
- ✅ **Métricas**: Rastreia qual provider e quantas vezes foi usado
- ✅ **Performance**: Índices otimizados para busca instantânea

## 📊 Sistema de Qualidade

### Score de Qualidade (0.0 - 1.0)

```typescript
Critérios:
- Texto idêntico ao original: -0.8
- Muito curto (< 3 chars): -0.3
- Tamanho muito diferente: -0.2
- Contém acentos do idioma alvo: +0.1

Limiares:
- ≥ 0.7: Cache no Supabase (permanente)
- ≥ 0.5: Cache em memória (temporário)
- < 0.5: Descartado, tenta próximo provider
```

## 🔄 Fluxo de Tradução

```
1. Request chega na API
   ↓
2. Verifica cache em memória (⚡ mais rápido)
   ├─ Hit → Retorna imediatamente
   └─ Miss → Próximo passo
   ↓
3. Verifica cache no Supabase (💾 persistente)
   ├─ Hit → Atualiza usage_count + Retorna
   └─ Miss → Próximo passo
   ↓
4. Tenta traduzir (em ordem de prioridade):
   ├─ DeepL (se API key configurada)
   ├─ LibreTranslate
   ├─ Lingva
   ├─ Google
   └─ MyMemory
   ↓
5. Calcula quality_score
   ↓
6. Se score ≥ 0.7 → Salva no Supabase
   ↓
7. Se score ≥ 0.5 → Salva em memória
   ↓
8. Retorna resultado ao cliente
```

## 🚀 Configuração

### 1. Aplicar Migration no Supabase

```bash
# Executar migration localmente
npx supabase db push

# Ou aplicar manualmente no dashboard Supabase
```

### 2. (Opcional) Configurar DeepL

```bash
# .env.local
DEEPL_API_KEY=your-deepl-api-key-here
```

### 3. Fazer Deploy

```bash
git add .
git commit -m "feat: sistema robusto de tradução com múltiplos providers"
git push origin main
```

## 📈 Monitoramento

### Consultar Estatísticas

```sql
-- Traduções mais usadas
SELECT 
  source_text, 
  target_lang, 
  translation_service,
  quality_score,
  usage_count 
FROM translations_cache 
ORDER BY usage_count DESC 
LIMIT 20;

-- Eficiência por provider
SELECT 
  translation_service,
  COUNT(*) as total,
  AVG(quality_score) as avg_quality,
  SUM(usage_count) as total_uses
FROM translations_cache
GROUP BY translation_service
ORDER BY total_uses DESC;

-- Cache hit rate (aproximado)
SELECT 
  COUNT(*) as cached_translations,
  SUM(usage_count) as total_requests,
  ROUND(SUM(usage_count)::decimal / COUNT(*), 2) as avg_reuse
FROM translations_cache;
```

## 🔧 Manutenção

### Limpar Cache Antigo (> 30 dias sem uso)

```sql
DELETE FROM translations_cache
WHERE updated_at < NOW() - INTERVAL '30 days'
  AND usage_count < 5;
```

### Limpar Traduções de Baixa Qualidade

```sql
DELETE FROM translations_cache
WHERE quality_score < 0.5;
```

## 🎛️ Customização

### Adicionar Novo Provider

Edite [translation-services.ts](../src/lib/translation-services.ts):

```typescript
async function translateViaNewService(text: string, targetLang: string): Promise<string> {
  // Implementar integração
  return translatedText;
}

// Adicionar à lista de providers
export function getTranslationProviders(deeplApiKey?: string): TranslationProvider[] {
  return [
    {
      name: 'NewService',
      translate: translateViaNewService,
      rateLimit: 100,
      priority: 1 // Quanto menor, maior prioridade
    },
    // ... outros providers
  ];
}
```

### Ajustar Critérios de Qualidade

Edite `calculateQualityScore()` em [translation-services.ts](../src/lib/translation-services.ts).

## 📚 Recursos

- [LibreTranslate Docs](https://libretranslate.com/docs/)
- [DeepL API Docs](https://www.deepl.com/docs-api)
- [Lingva GitHub](https://github.com/thedaviddelta/lingva-translate)

## 🆘 Troubleshooting

### "All providers failed"

1. Verifique conexão internet
2. Teste cada provider manualmente
3. Verifique logs do console
4. Considere self-host do LibreTranslate

### Cache não está salvando

1. Verifique se migration foi aplicada:
   ```sql
   SELECT * FROM translations_cache LIMIT 1;
   ```
2. Verifique RLS policies
3. Confirme que quality_score ≥ 0.7

### DeepL não funciona

1. Verifique se API key está no `.env.local`
2. Confirme que não excedeu limite mensal
3. Use dashboard DeepL para verificar uso

## 🎉 Resultado Esperado

- ✅ **99.9% uptime** (múltiplos fallbacks)
- ✅ **< 100ms** resposta em cache hit
- ✅ **Economia de custos** (reutilização massiva)
- ✅ **Qualidade profissional** (DeepL quando configurado)
- ✅ **Zero manutenção** (auto-gerenciado)
