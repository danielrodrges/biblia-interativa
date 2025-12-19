import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Cache em memória no servidor (Edge Runtime)
const serverCache = new Map<string, string>();

async function translateViaGoogle(text: string, targetLang: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Google API failed: ${response.status}`);
  }
  
  const data = await response.json();
  const translated = data[0].map((item: any[]) => item[0]).join('');
  return translated;
}

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
    throw new Error(`MyMemory API failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText;
  }
  
  throw new Error('Invalid MyMemory response');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLang } = body;
    
    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Missing text or targetLang' },
        { status: 400 }
      );
    }
    
    // Validar idioma
    if (!['en', 'es', 'it', 'fr'].includes(targetLang)) {
      return NextResponse.json(
        { error: 'Invalid target language' },
        { status: 400 }
      );
    }
    
    // Verificar cache
    const cacheKey = `pt-${targetLang}:${text}`;
    if (serverCache.has(cacheKey)) {
      const cached = serverCache.get(cacheKey)!;
      console.log('💾 Cache hit:', text.substring(0, 30));
      return NextResponse.json({ 
        translated: cached,
        cached: true 
      });
    }
    
    let translated = text;
    let method = 'none';
    
    // Tentar Google primeiro
    try {
      translated = await translateViaGoogle(text, targetLang);
      method = 'google';
      console.log('✅ Google translation successful');
    } catch (error) {
      console.log('⚠️ Google failed, trying MyMemory...');
      
      // Tentar MyMemory como fallback
      try {
        translated = await translateViaMyMemory(text, targetLang);
        method = 'mymemory';
        console.log('✅ MyMemory translation successful');
      } catch (fallbackError) {
        console.error('❌ All translation methods failed');
        return NextResponse.json(
          { error: 'Translation failed', original: text },
          { status: 500 }
        );
      }
    }
    
    // Verificar se realmente traduziu (não retornou texto idêntico)
    if (translated.toLowerCase().trim() === text.toLowerCase().trim()) {
      console.warn('⚠️ Translation returned identical text');
      return NextResponse.json({ 
        translated: text,
        cached: false,
        warning: 'Translation returned identical text'
      });
    }
    
    // Armazenar no cache
    serverCache.set(cacheKey, translated);
    
    // Limitar tamanho do cache (máximo 1000 entradas)
    if (serverCache.size > 1000) {
      const firstKey = serverCache.keys().next().value;
      serverCache.delete(firstKey);
    }
    
    return NextResponse.json({ 
      translated,
      cached: false,
      method 
    });
    
  } catch (error: any) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
