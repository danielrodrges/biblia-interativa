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
/**
 * Traduz usando API alternativa (MyMemory) como fallback
 */
async function translateWithFallback(text: string, targetLang: 'en' | 'es' | 'it' | 'fr'): Promise<string> {
  try {
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'es': 'es-ES',
      'it': 'it-IT',
      'fr': 'fr-FR'
    };
    
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt-BR|${langMap[targetLang]}`;
    
    console.log('🔄 Tentando API alternativa (MyMemory)...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      console.log('✅ Tradução via MyMemory bem-sucedida:', translated.substring(0, 50));
      return translated;
    }
    
    throw new Error('Resposta inválida da API MyMemory');
  } catch (error: any) {
    console.error('❌ Falha na API alternativa:', error.message);
    return text; // Retornar original se tudo falhar
  }
}

export async function translateText(text: string, targetLang: 'en' | 'es' | 'it' | 'fr', retryCount = 0): Promise<string> {
  // Verificar cache
  const cacheKey = `pt-${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey)!;
    console.log(`💾 Usando tradução em cache para ${targetLang}:`, text.substring(0, 50), '->', cached.substring(0, 50));
    return cached;
  }

  const maxRetries = 3;
  const timeoutMs = 10000; // 10 segundos para mobile

  try {
    // Usar API do Google Translate com timeout aumentado para mobile
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    console.log(`🌐 Traduzindo para ${targetLang} (tentativa ${retryCount + 1}/${maxRetries + 1}):`, text.substring(0, 50) + '...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(url, { 
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/',
        'Origin': 'https://translate.google.com'
      },
      mode: 'cors',
      cache: 'no-cache'
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`❌ Erro HTTP ${response.status}:`, response.statusText);
      throw new Error(`Falha na tradução: HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Resposta da API (primeiros elementos):', data[0]?.[0]);
    
    // A resposta vem em formato: [[[tradução, original, ...]]]
    if (!data || !data[0] || !Array.isArray(data[0])) {
      console.error('❌ Formato de resposta inválido:', data);
      throw new Error('Formato de resposta inválido da API');
    }
    
    const translated = data[0].map((item: any[]) => item[0]).join('');
    console.log(`✅ Traduzido com sucesso para ${targetLang}:`, translated.substring(0, 50) + '...');
    
    // Verificar se a tradução é diferente do original (evitar armazenar não-traduções)
    const isSimilar = translated.toLowerCase().trim() === text.toLowerCase().trim();
    if (isSimilar) {
      console.warn('⚠️ Tradução retornou texto idêntico ao original - NÃO será cacheada');
      return text; // Retornar sem cachear para tentar novamente depois
    }
    
    // Armazenar no cache APENAS se foi traduzido de fato
    translationCache.set(cacheKey, translated);
    
    // Salvar no localStorage a cada 10 traduções (para não sobrecarregar)
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
      const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Max 5s
      console.log(`🔄 Tentando novamente em ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return translateText(text, targetLang, retryCount + 1);
    }
    
    // Se todas as tentativas falharam, tentar API alternativa
    console.log('🔄 Tentando API alternativa como último recurso...');
    const fallbackResult = await translateWithFallback(text, targetLang);
    
    // Se a API alternativa funcionou, cachear o resultado
    if (fallbackResult !== text) {
      translationCache.set(cacheKey, fallbackResult);
      saveCacheToStorage();
      return fallbackResult;
    }
    
    console.error(`❌ Todas as tentativas falharam. Retornando texto original.`);
    // NÃO armazenar no cache para permitir retry na próxima vez
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
  
  // Detectar se é mobile para ajustar estratégia
  const isMobile = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const batchSize = isMobile ? 5 : 10; // Lotes menores em mobile
  const delayBetweenBatches = isMobile ? 500 : 200; // Mais delay em mobile
  
  console.log(`📱 Dispositivo: ${isMobile ? 'Mobile' : 'Desktop'}, Tamanho do lote: ${batchSize}, Delay: ${delayBetweenBatches}ms`);
  
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
    
    // Delay entre lotes para não sobrecarregar (especialmente em mobile)
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
