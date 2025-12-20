import { useState, useCallback, useRef, useEffect } from 'react';
import { synthesizeSpeech, createAudioUrl } from '@/lib/google-tts';
import { useSpeechSynthesis } from './useSpeechSynthesis';

export type AudioState = 'idle' | 'loading' | 'playing' | 'paused';

interface UseGoogleTTSOptions {
  voice?: string;
  languageCode?: string;
  speakingRate?: number;
  pitch?: number;
  fallbackToWebSpeech?: boolean;
}

/**
 * Hook híbrido: usa Google Cloud TTS quando disponível,
 * fallback para Web Speech API nativa
 */
export function useHybridTTS(options: UseGoogleTTSOptions = {}) {
  const [state, setState] = useState<AudioState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [useGoogleTTS, setUseGoogleTTS] = useState(true);
  const [isGoogleAvailable, setIsGoogleAvailable] = useState<boolean | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textsRef = useRef<string[]>([]);
  const audioUrlsRef = useRef<Map<number, string>>(new Map());

  // Fallback para Web Speech API
  const webSpeech = useSpeechSynthesis({
    lang: options.languageCode || 'pt-BR',
    rate: options.speakingRate || 0.85,
    pitch: 0.85, // Web Speech usa escala diferente
  });

  // Limpar URLs ao desmontar
  useEffect(() => {
    return () => {
      audioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      audioUrlsRef.current.clear();
    };
  }, []);

  // Testar se Google TTS está disponível
  useEffect(() => {
    const checkGoogleTTS = async () => {
      try {
        const result = await synthesizeSpeech({ 
          text: 'teste',
          voice: options.voice || 'pt-BR-Neural2-B',
          languageCode: options.languageCode || 'pt-BR',
        });
        
        setIsGoogleAvailable(result !== null);
        setUseGoogleTTS(result !== null);
        
        if (result === null) {
          console.log('🔄 Google TTS não disponível, usando Web Speech API');
        } else {
          console.log('✅ Google Cloud TTS disponível e configurado');
        }
      } catch (error) {
        console.warn('⚠️ Erro ao verificar Google TTS:', error);
        setIsGoogleAvailable(false);
        setUseGoogleTTS(false);
      }
    };

    checkGoogleTTS();
  }, [options.voice, options.languageCode]);

  const speak = useCallback(async (texts: string[], startIndex = 0) => {
    textsRef.current = texts;
    setCurrentIndex(startIndex);

    // Se Google TTS não está disponível, usar Web Speech
    if (!useGoogleTTS || isGoogleAvailable === false) {
      console.log('🗣️ Usando Web Speech API (fallback)');
      webSpeech.speak(texts, startIndex);
      return;
    }

    // Usar Google Cloud TTS
    console.log('🎙️ Usando Google Cloud TTS');
    await playWithGoogleTTS(texts, startIndex);
  }, [useGoogleTTS, isGoogleAvailable, webSpeech, options]);

  const playWithGoogleTTS = async (texts: string[], index: number) => {
    if (index >= texts.length) {
      setState('idle');
      setCurrentIndex(0);
      return;
    }

    const text = texts[index];
    if (!text || text.trim().length === 0) {
      playWithGoogleTTS(texts, index + 1);
      return;
    }

    setState('loading');
    console.log(`🎤 Sintetizando versículo ${index + 1}/${texts.length}`);

    try {
      // Verificar se já tem cache
      let audioUrl = audioUrlsRef.current.get(index);

      if (!audioUrl) {
        // Sintetizar novo áudio
        const result = await synthesizeSpeech({
          text,
          voice: options.voice || 'pt-BR-Neural2-B',
          languageCode: options.languageCode || 'pt-BR',
          speakingRate: options.speakingRate || 0.90,
          pitch: options.pitch || -1.0,
          volumeGainDb: 2.0, // Volume aumentado para clareza máxima
        });

        if (!result) {
          // Fallback para Web Speech
          console.log('🔄 Fallback para Web Speech API');
          setUseGoogleTTS(false);
          webSpeech.speak(texts, index);
          return;
        }

        // Criar URL do áudio
        audioUrl = createAudioUrl(result.audio);
        audioUrlsRef.current.set(index, audioUrl);
      }

      // Criar e tocar áudio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadeddata = () => {
        setState('playing');
        setCurrentIndex(index);
        audio.play();
      };

      audio.onended = () => {
        playWithGoogleTTS(texts, index + 1);
      };

      audio.onerror = (e) => {
        console.error('❌ Erro ao tocar áudio:', e);
        // Tentar próximo ou fallback
        playWithGoogleTTS(texts, index + 1);
      };

    } catch (error) {
      console.error('❌ Erro ao sintetizar:', error);
      // Fallback para Web Speech
      setUseGoogleTTS(false);
      webSpeech.speak(texts, index);
    }
  };

  const pause = useCallback(() => {
    if (useGoogleTTS && audioRef.current) {
      audioRef.current.pause();
      setState('paused');
    } else {
      webSpeech.pause();
    }
  }, [useGoogleTTS, webSpeech]);

  const resume = useCallback(() => {
    if (useGoogleTTS && audioRef.current && state === 'paused') {
      audioRef.current.play();
      setState('playing');
    } else {
      webSpeech.resume();
    }
  }, [useGoogleTTS, state, webSpeech]);

  const stop = useCallback(() => {
    if (useGoogleTTS && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setState('idle');
      setCurrentIndex(0);
    } else {
      webSpeech.stop();
    }
  }, [useGoogleTTS, webSpeech]);

  const skipToIndex = useCallback((index: number) => {
    if (textsRef.current.length === 0) return;
    
    stop();
    speak(textsRef.current, index);
  }, [stop, speak]);

  // Se estiver usando Web Speech, retornar o estado dele
  if (!useGoogleTTS) {
    return {
      ...webSpeech,
      isGoogleTTS: false,
      isGoogleAvailable: false,
    };
  }

  return {
    state: state === 'loading' ? 'speaking' : state,
    currentIndex,
    currentCharIndex: 0,
    speak,
    pause,
    resume,
    stop,
    skipToIndex,
    isSupported: true,
    isGoogleTTS: true,
    isGoogleAvailable,
  };
}
