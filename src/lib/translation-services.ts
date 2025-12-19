/**
 * Sistema robusto de tradução com múltiplos provedores
 */

export interface TranslationProvider {
  name: string;
  translate: (text: string, targetLang: string) => Promise<string>;
  rateLimit: number; // requests por minuto
  priority: number; // 1 = maior prioridade
}

export interface TranslationResult {
  translated: string;
  provider: string;
  qualityScore: number; // 0 a 1
  cached: boolean;
}

/**
 * LibreTranslate (GRÁTIS, SEM LIMITES, CÓDIGO ABERTO)
 * Pode usar instância pública ou self-hosted
 */
async function translateViaLibreTranslate(text: string, targetLang: string): Promise<string> {
  const langMap: Record<string, string> = {
    'en': 'en',
    'es': 'es',
    'it': 'it',
    'fr': 'fr',
    'pt': 'pt'
  };

  // Usando instância pública do LibreTranslate
  // Alternativa: self-host em Docker para controle total
  const url = 'https://libretranslate.com/translate';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source: 'pt',
      target: langMap[targetLang] || targetLang,
      format: 'text'
    })
  });

  if (!response.ok) {
    throw new Error(`LibreTranslate failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.translatedText) {
    throw new Error('Invalid LibreTranslate response');
  }

  return data.translatedText;
}

/**
 * Lingva Translate (Proxy open-source do Google, sem limites)
 */
async function translateViaLingva(text: string, targetLang: string): Promise<string> {
  const url = `https://lingva.ml/api/v1/pt/${targetLang}/${encodeURIComponent(text)}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Lingva failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.translation) {
    throw new Error('Invalid Lingva response');
  }

  return data.translation;
}

/**
 * DeepL (MELHOR QUALIDADE, mas tem limite grátis)
 * Requer API key - mas tem 500k caracteres/mês grátis
 */
async function translateViaDeepL(text: string, targetLang: string, apiKey?: string): Promise<string> {
  if (!apiKey) {
    throw new Error('DeepL requires API key');
  }

  const langMap: Record<string, string> = {
    'en': 'EN-US',
    'es': 'ES',
    'it': 'IT',
    'fr': 'FR'
  };

  const url = 'https://api-free.deepl.com/v2/translate';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: [text],
      source_lang: 'PT',
      target_lang: langMap[targetLang] || targetLang
    })
  });

  if (!response.ok) {
    throw new Error(`DeepL failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.translations?.[0]?.text) {
    throw new Error('Invalid DeepL response');
  }

  return data.translations[0].text;
}

/**
 * Google Translate (fallback final)
 */
async function translateViaGoogle(text: string, targetLang: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Google failed: ${response.status}`);
  }
  
  const data = await response.json();
  const translated = data[0].map((item: any[]) => item[0]).join('');
  return translated;
}

/**
 * MyMemory (último recurso)
 */
async function translateViaMyMemory(text: string, targetLang: string): Promise<string> {
  const langMap: Record<string, string> = {
    'en': 'en-US',
    'es': 'es-ES',
    'it': 'it-IT',
    'fr': 'fr-FR'
  };
  
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt-BR|${langMap[targetLang]}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`MyMemory failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText;
  }
  
  throw new Error('Invalid MyMemory response');
}

/**
 * Calcula score de qualidade da tradução
 */
function calculateQualityScore(original: string, translated: string): number {
  // Regras básicas de qualidade
  let score = 1.0;
  
  // Penalizar se retornou texto idêntico
  if (original.toLowerCase().trim() === translated.toLowerCase().trim()) {
    score -= 0.8;
  }
  
  // Penalizar se muito curto (possível erro)
  if (translated.length < 3) {
    score -= 0.3;
  }
  
  // Penalizar se muito diferente em tamanho (possível erro)
  const lengthRatio = translated.length / original.length;
  if (lengthRatio < 0.5 || lengthRatio > 2.0) {
    score -= 0.2;
  }
  
  // Bonus se contém caracteres do idioma alvo
  const hasAccents = /[àáâãäåèéêëìíîïòóôõöùúûü]/i.test(translated);
  if (hasAccents) {
    score += 0.1;
  }
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Providers ordenados por prioridade
 */
export function getTranslationProviders(deeplApiKey?: string): TranslationProvider[] {
  const providers: TranslationProvider[] = [
    {
      name: 'LibreTranslate',
      translate: translateViaLibreTranslate,
      rateLimit: 60, // Sem limite oficial, mas ser conservador
      priority: 1
    },
    {
      name: 'Lingva',
      translate: translateViaLingva,
      rateLimit: 60,
      priority: 2
    },
    {
      name: 'Google',
      translate: translateViaGoogle,
      rateLimit: 30,
      priority: 3
    },
    {
      name: 'MyMemory',
      translate: translateViaMyMemory,
      rateLimit: 10, // Limite baixo
      priority: 4
    }
  ];

  // Adicionar DeepL se tiver API key (melhor qualidade)
  if (deeplApiKey) {
    providers.unshift({
      name: 'DeepL',
      translate: (text: string, lang: string) => translateViaDeepL(text, lang, deeplApiKey),
      rateLimit: 100,
      priority: 0 // Maior prioridade
    });
  }

  return providers.sort((a, b) => a.priority - b.priority);
}

/**
 * Traduz com sistema de fallback robusto
 */
export async function translateWithFallback(
  text: string,
  targetLang: string,
  deeplApiKey?: string
): Promise<TranslationResult> {
  const providers = getTranslationProviders(deeplApiKey);
  
  for (const provider of providers) {
    try {
      console.log(`🌐 Tentando ${provider.name}...`);
      
      const translated = await provider.translate(text, targetLang);
      const qualityScore = calculateQualityScore(text, translated);
      
      // Aceitar apenas traduções de qualidade razoável
      if (qualityScore >= 0.5) {
        console.log(`✅ ${provider.name} sucesso (score: ${qualityScore.toFixed(2)})`);
        return {
          translated,
          provider: provider.name,
          qualityScore,
          cached: false
        };
      } else {
        console.warn(`⚠️ ${provider.name} retornou baixa qualidade (${qualityScore.toFixed(2)}), tentando próximo...`);
      }
    } catch (error: any) {
      console.error(`❌ ${provider.name} falhou:`, error.message);
      continue; // Tentar próximo provider
    }
  }
  
  // Se todos falharam, retornar original com score 0
  console.error('❌ Todos os providers falharam');
  return {
    translated: text,
    provider: 'none',
    qualityScore: 0,
    cached: false
  };
}
