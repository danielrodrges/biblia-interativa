import { useState, useEffect, useCallback, useRef } from 'react';

export type SpeechState = 'idle' | 'speaking' | 'paused';

interface UseSpeechSynthesisOptions {
  lang?: string;
  rate?: number; // 0.1 a 10 (velocidade)
  pitch?: number; // 0 a 2 (tom)
  volume?: number; // 0 a 1
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const [state, setState] = useState<SpeechState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textsRef = useRef<string[]>([]);

  // Verificar suporte do navegador
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      if (isSupported && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const speak = useCallback((texts: string[], startIndex = 0) => {
    if (!isSupported) {
      console.error('Speech Synthesis não suportado neste navegador');
      return;
    }

    // Cancelar qualquer fala anterior
    window.speechSynthesis.cancel();

    textsRef.current = texts;
    setCurrentIndex(startIndex);

    const speakText = (index: number) => {
      if (index >= texts.length) {
        setState('idle');
        setCurrentIndex(0);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(texts[index]);
      utterance.lang = options.lang || 'pt-BR';
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      utterance.onstart = () => {
        setState('speaking');
        setCurrentIndex(index);
      };

      utterance.onend = () => {
        // Falar próximo texto
        speakText(index + 1);
      };

      utterance.onerror = (event) => {
        console.error('Erro na síntese de voz:', event);
        setState('idle');
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakText(startIndex);
  }, [isSupported, options.lang, options.rate, options.pitch, options.volume]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setState('paused');
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setState('speaking');
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    setState('idle');
    setCurrentIndex(0);
  }, [isSupported]);

  const skipToIndex = useCallback((index: number) => {
    if (!isSupported || textsRef.current.length === 0) return;
    
    window.speechSynthesis.cancel();
    speak(textsRef.current, index);
  }, [isSupported, speak]);

  return {
    state,
    currentIndex,
    speak,
    pause,
    resume,
    stop,
    skipToIndex,
    isSupported,
  };
}
