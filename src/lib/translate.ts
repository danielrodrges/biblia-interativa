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

/**
 * Traduz texto de português para outro idioma usando Google Translate (via API pública)
 */
export async function translateText(text: string, targetLang: 'en' | 'es' | 'it' | 'fr'): Promise<string> {
  // Verificar cache
  const cacheKey = `pt-${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    // Usar API do Google Translate com timeout de 3 segundos
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Falha na tradução');
    }

    const data = await response.json();
    
    // A resposta vem em formato: [[[tradução, original, ...]]]
    const translated = data[0].map((item: any[]) => item[0]).join('');
    
    // Armazenar no cache
    translationCache.set(cacheKey, translated);
    
    // Salvar no localStorage a cada 10 traduções (para não sobrecarregar)
    if (translationCache.size % 10 === 0) {
      saveCacheToStorage();
    }
    
    return translated;
  } catch (error) {
    console.warn('⚠️ Erro na tradução, mantendo português:', error);
    // Armazenar texto original no cache para não tentar novamente
    translationCache.set(cacheKey, text);
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
  console.log(`🌐 Iniciando tradução de ${texts.length} versículos para ${targetLang}...`);
  
  // Verificar quantos já estão em cache
  const cacheHits = texts.filter(text => translationCache.has(`pt-${targetLang}:${text}`)).length;
  console.log(`💾 ${cacheHits} de ${texts.length} já em cache`);
  
  const translated: string[] = [];
  let successCount = 0;
  let failCount = 0;
  
  // Aumentar tamanho do lote e remover delay para velocidade
  const batchSize = 15; // Aumentado de 3 para 15
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(async text => {
        const result = await translateText(text, targetLang);
        if (result !== text) successCount++;
        else failCount++;
        return result;
      })
    );
    translated.push(...batchResults);
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
}
