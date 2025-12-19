/**
 * Serviço de tradução de texto
 */

// Cache de traduções em memória para acesso rápido
const translationCache = new Map<string, string>();

// Chave para localStorage
const TRANSLATION_STORAGE_KEY = 'bible-translations-cache';

/**
 * Carrega cache do localStorage
 */
function loadCacheFromStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(TRANSLATION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([key, value]) => {
        translationCache.set(key, value as string);
      });
      console.log('📦 Cache de traduções carregado:', translationCache.size, 'entradas');
    }
  } catch (error) {
    console.warn('⚠️ Erro ao carregar cache de traduções:', error);
  }
}

/**
 * Salva cache no localStorage
 */
function saveCacheToStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const obj: Record<string, string> = {};
    translationCache.forEach((value, key) => {
      obj[key] = value;
    });
    localStorage.setItem(TRANSLATION_STORAGE_KEY, JSON.stringify(obj));
  } catch (error) {
    console.warn('⚠️ Erro ao salvar cache de traduções:', error);
  }
}

// Carregar cache ao iniciar
if (typeof window !== 'undefined') {
  loadCacheFromStorage();
}

export async function translateText(text: string, targetLang: 'en' | 'es' | 'it' | 'fr', retryCount = 0): Promise<string> {
  // Verificar cache local
  const cacheKey = `pt-${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey)!;
    console.log(`💾 Usando tradução em cache LOCAL para ${targetLang}:`, text.substring(0, 30));
    return cached;
  }

  const maxRetries = 2;

  try {
    console.log(`🌐 Traduzindo via servidor para ${targetLang} (tentativa ${retryCount + 1}/${maxRetries + 1}):`, text.substring(0, 50) + '...');
    
    // Usar a API route do Next.js (servidor) em vez de chamar direto as APIs externas
    // Isso evita problemas de CORS e bloqueios em mobile
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        targetLang
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ Erro HTTP ${response.status}:`, errorData);
      throw new Error(`Falha na tradução: HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Erro retornado pela API:', data.error);
      throw new Error(data.error);
    }
    
    const translated = data.translated;
    const wasCached = data.cached || false;
    const method = data.method || 'unknown';
    
    console.log(`✅ Traduzido com sucesso via ${method} (${wasCached ? 'cache servidor' : 'novo'}):`, translated.substring(0, 50) + '...');
    
    // Verificar se a tradução é diferente do original (evitar armazenar não-traduções)
    const isSimilar = translated.toLowerCase().trim() === text.toLowerCase().trim();
    if (isSimilar) {
      console.warn('⚠️ Tradução retornou texto idêntico ao original - NÃO será cacheada localmente');
      return text; // Retornar sem cachear localmente
    }
    
    // Armazenar no cache LOCAL
    translationCache.set(cacheKey, translated);
    
    // Salvar no localStorage a cada 10 traduções
    if (translationCache.size % 10 === 0) {
      saveCacheToStorage();
    }
    
    return translated;
  } catch (error: any) {
    console.error('❌ ERRO NA TRADUÇÃO:', {
      mensagem: error.message,
      erro: error.name,
      texto: text.substring(0, 100),
      idioma: targetLang,
      tentativa: retryCount + 1
    });
    
    // Retry com backoff exponencial
    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 3000);
      console.log(`🔄 Tentando novamente em ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return translateText(text, targetLang, retryCount + 1);
    }
    
    console.error(`❌ Todas as ${maxRetries + 1} tentativas falharam. Retornando texto original.`);
    return text; // Fallback: retornar texto original
  }
}

/**
 * Traduz texto de português para inglês (função de compatibilidade)
 */
export async function translateToEnglish(text: string): Promise<string> {
  return translateText(text, 'en');
}

/**
 * Traduz texto de português para espanhol
 */
export async function translateToSpanish(text: string): Promise<string> {
  return translateText(text, 'es');
}

/**
 * Traduz texto de português para italiano
 */
export async function translateToItalian(text: string): Promise<string> {
  return translateText(text, 'it');
}

/**
 * Traduz texto de português para francês
 */
export async function translateToFrench(text: string): Promise<string> {
  return translateText(text, 'fr');
}

/**
 * Traduz array de textos em lote com otimização
 */
export async function translateBatch(texts: string[], targetLang: 'en' | 'es' | 'it' | 'fr' = 'en'): Promise<string[]> {
  console.log(`🌐 Iniciando tradução de ${texts.length} versículos para ${targetLang} via servidor...`);
  
  // Verificar quantos já estão em cache LOCAL
  const cacheHits = texts.filter(text => translationCache.has(`pt-${targetLang}:${text}`)).length;
  console.log(`💾 ${cacheHits} de ${texts.length} já em cache LOCAL`);
  
  const translated: string[] = [];
  let successCount = 0;
  let failCount = 0;
  
  // Processar em lotes menores para evitar sobrecarga
  const batchSize = 5; // Reduzido para garantir estabilidade
  const delayBetweenBatches = 300; // Delay fixo entre lotes
  
  console.log(`📦 Processando em lotes de ${batchSize} com delay de ${delayBetweenBatches}ms`);
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    console.log(`📦 Processando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);
    
    const batchResults = await Promise.all(
      batch.map(async text => {
        const result = await translateText(text, targetLang);
        if (result !== text) successCount++;
        else failCount++;
        return result;
      })
    );
    translated.push(...batchResults);
    
    // Delay entre lotes
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }
  
  // Salvar cache após tradução completa
  saveCacheToStorage();
  
  console.log(`✅ Tradução concluída! Sucesso: ${successCount}, Falhas: ${failCount}, Cache: ${cacheHits}`);
  return translated;
}

/**
 * Limpar cache de traduções
 */
export function clearTranslationCache() {
  translationCache.clear();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TRANSLATION_STORAGE_KEY);
    console.log('🗑️ Cache de traduções limpo completamente');
  }
}

/**
 * Obter estatísticas do cache
 */
export function getTranslationCacheStats() {
  return {
    totalEntries: translationCache.size,
    entries: Array.from(translationCache.entries()).map(([key, value]) => ({
      key,
      original: key.split(':')[1]?.substring(0, 30),
      translated: value.substring(0, 30),
      language: key.split('-')[1]?.split(':')[0]
    }))
  };
}
