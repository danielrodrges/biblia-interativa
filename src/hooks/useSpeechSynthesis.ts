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
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textsRef = useRef<string[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Verificar suporte do navegador
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Carregar vozes disponíveis
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log('🎤 Vozes carregadas:', voices.length);
        const ptBRVoices = voices.filter(v => v.lang.startsWith('pt'));
        console.log('🇧🇷 Vozes em português:', ptBRVoices.map(v => `${v.name} (${v.lang})`));
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported]);

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

      const text = texts[index];
      if (!text || text.trim().length === 0) {
        // Pular textos vazios
        speakText(index + 1);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const currentRate = options.rate || 1.0;
      console.log(`🗣️ Falando texto ${index + 1}/${texts.length} [${currentRate.toFixed(1)}x]:`, text.substring(0, 100));
      const currentLang = options.lang || 'pt-BR';
      utterance.lang = currentLang;
      utterance.rate = currentRate;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Selecionar voz específica baseada no idioma
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      
      if (currentLang === 'pt-BR') {
        selectedVoice = voices.find(voice => 
          voice.lang === 'pt-BR' || 
          voice.lang.startsWith('pt-BR') ||
          voice.name.toLowerCase().includes('brazil') ||
          voice.name.toLowerCase().includes('portuguese (brazil)') ||
          voice.name.toLowerCase().includes('luciana') ||
          voice.name.toLowerCase().includes('fernanda')
        );
      } else if (currentLang === 'en-US') {
        selectedVoice = voices.find(voice => 
          voice.lang === 'en-US' || 
          voice.lang.startsWith('en-US') ||
          voice.name.toLowerCase().includes('united states') ||
          voice.name.toLowerCase().includes('us english')
        );
      } else if (currentLang === 'es-ES') {
        selectedVoice = voices.find(voice => 
          voice.lang === 'es-ES' || 
          voice.lang.startsWith('es-ES') ||
          voice.lang === 'es-MX' ||
          voice.name.toLowerCase().includes('spanish') ||
          voice.name.toLowerCase().includes('españa') ||
          voice.name.toLowerCase().includes('espanol')
        );
      } else if (currentLang === 'it-IT') {
        selectedVoice = voices.find(voice => 
          voice.lang === 'it-IT' || 
          voice.lang.startsWith('it-IT') ||
          voice.lang === 'it' ||
          voice.name.toLowerCase().includes('italian') ||
          voice.name.toLowerCase().includes('italiano') ||
          voice.name.toLowerCase().includes('italy')
        );
      } else if (currentLang === 'fr-FR') {
        selectedVoice = voices.find(voice => 
          voice.lang === 'fr-FR' || 
          voice.lang.startsWith('fr-FR') ||
          voice.lang === 'fr' ||
          voice.name.toLowerCase().includes('french') ||
          voice.name.toLowerCase().includes('français') ||
          voice.name.toLowerCase().includes('france')
        );
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('🗣️ Voz selecionada:', selectedVoice.name, selectedVoice.lang);
      } else {
        console.warn('⚠️ Nenhuma voz encontrada para', currentLang);
        console.log('Vozes disponíveis:', voices.map(v => `${v.name} (${v.lang})`));
      }

      utterance.onstart = () => {
        setState('speaking');
        setCurrentIndex(index);
        setCurrentCharIndex(0);
        console.log('🎤 Iniciando fala do versículo', index + 1);
      };

      utterance.onboundary = (event) => {
        // Evento disparado a cada limite de palavra ou sentença
        if (event.name === 'word') {
          console.log('📍 Palavra em:', event.charIndex, 'char:', text.substring(event.charIndex, event.charIndex + 10));
          setCurrentCharIndex(event.charIndex);
        }
      };

      utterance.onend = () => {
        // Falar próximo texto
        speakText(index + 1);
      };

      utterance.onerror = (event) => {
        // Alguns erros não são críticos, podemos continuar
        if (event.error === 'interrupted' || event.error === 'canceled') {
          // Usuário pausou ou parou, é esperado - não logar como erro
          return;
        }
        
        // Logar apenas erros reais
        console.error('❌ Erro na síntese de voz:', event.error, 'para o versículo', index + 1);
        
        // Para outros erros, tentar próximo versículo
        if (index + 1 < texts.length) {
          console.log('⏭️ Pulando para próximo versículo...');
          speakText(index + 1);
        } else {
          setState('idle');
        }
      };

      utteranceRef.current = utterance;
      
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('❌ Erro ao iniciar síntese:', error);
        setState('idle');
      }
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
    setCurrentCharIndex(0);
  }, [isSupported]);

  const skipToIndex = useCallback((index: number) => {
    if (!isSupported || textsRef.current.length === 0) return;
    
    window.speechSynthesis.cancel();
    speak(textsRef.current, index);
  }, [isSupported, speak]);

  return {
    state,
    currentIndex,
    currentCharIndex,
    speak,
    pause,
    resume,
    stop,
    skipToIndex,
    isSupported,
  };
}
