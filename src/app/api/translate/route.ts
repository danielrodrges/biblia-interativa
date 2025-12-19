import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { translateWithFallback } from '@/lib/translation-services';

export const runtime = 'edge';

// Cache em memória para respostas rápidas
const memoryCache = new Map<string, { translated: string; timestamp: number }>();
const MEMORY_CACHE_TTL = 1000 * 60 * 60; // 1 hora

// Cliente Supabase para cache persistente
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
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
    
    const cacheKey = `pt-${targetLang}:${text}`;
    const now = Date.now();
    
    // 1. Verificar cache em memória (mais rápido)
    if (memoryCache.has(cacheKey)) {
      const cached = memoryCache.get(cacheKey)!;
      if (now - cached.timestamp < MEMORY_CACHE_TTL) {
        console.log('⚡ Cache em memória hit:', text.substring(0, 30));
        return NextResponse.json({
          translated: cached.translated,
          cached: true,
          source: 'memory'
        });
      } else {
        memoryCache.delete(cacheKey);
      }
    }
    
    // 2. Verificar cache no Supabase (persistente)
    const supabase = getSupabaseClient();
    
    const { data: cachedTranslation, error: cacheError } = await supabase
      .from('translations_cache')
      .select('translated_text, translation_service, quality_score')
      .eq('source_text', text)
      .eq('source_lang', 'pt')
      .eq('target_lang', targetLang)
      .gte('quality_score', 0.7) // Apenas traduções de qualidade
      .single();
    
    if (!cacheError && cachedTranslation) {
      console.log('💾 Cache Supabase hit:', text.substring(0, 30));
      
      // Atualizar contador de uso
      await supabase
        .from('translations_cache')
        .update({ updated_at: new Date().toISOString() })
        .eq('source_text', text)
        .eq('target_lang', targetLang);
      
      // Armazenar em memória para próximas requisições
      memoryCache.set(cacheKey, {
        translated: cachedTranslation.translated_text,
        timestamp: now
      });
      
      return NextResponse.json({
        translated: cachedTranslation.translated_text,
        cached: true,
        source: 'database',
        provider: cachedTranslation.translation_service,
        quality: cachedTranslation.quality_score
      });
    }
    
    // 3. Fazer nova tradução com sistema robusto de fallback
    console.log('🌐 Nova tradução:', text.substring(0, 50));
    
    const deeplApiKey = process.env.DEEPL_API_KEY; // Opcional
    const result = await translateWithFallback(text, targetLang, deeplApiKey);
    
    // 4. Salvar no Supabase se qualidade for boa
    if (result.qualityScore >= 0.7) {
      await supabase
        .from('translations_cache')
        .upsert({
          source_text: text,
          source_lang: 'pt',
          target_lang: targetLang,
          translated_text: result.translated,
          translation_service: result.provider,
          quality_score: result.qualityScore
        }, {
          onConflict: 'source_text,source_lang,target_lang'
        });
      
      console.log(`✅ Tradução salva no cache (${result.provider}, score: ${result.qualityScore.toFixed(2)})`);
    } else {
      console.warn(`⚠️ Tradução não cacheada - baixa qualidade (${result.qualityScore.toFixed(2)})`);
    }
    
    // 5. Armazenar em memória
    if (result.qualityScore >= 0.5) {
      memoryCache.set(cacheKey, {
        translated: result.translated,
        timestamp: now
      });
      
      // Limitar tamanho do cache em memória
      if (memoryCache.size > 1000) {
        const firstKey = memoryCache.keys().next().value;
        memoryCache.delete(firstKey);
      }
    }
    
    return NextResponse.json({
      translated: result.translated,
      cached: false,
      provider: result.provider,
      quality: result.qualityScore
    });
    
  } catch (error: any) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
