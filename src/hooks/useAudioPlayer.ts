import { useState, useEffect, useRef, useCallback } from 'react';

export type AudioPlayerState = 'idle' | 'playing' | 'paused' | 'loading' | 'error';

export function useAudioPlayer(audioUrl: string) {
  const [state, setState] = useState<AudioPlayerState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Inicializar áudio
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('ended', () => {
      setState('idle');
      setCurrentTime(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    });

    audio.addEventListener('error', () => {
      setState('error');
    });

    return () => {
      audio.pause();
      audio.remove();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioUrl]);

  // Atualizar currentTime usando requestAnimationFrame
  const updateTime = useCallback(() => {
    if (audioRef.current && state === 'playing') {
      setCurrentTime(audioRef.current.currentTime);
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'playing') {
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state, updateTime]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      setState('loading');
      await audioRef.current.play();
      setState('playing');
    } catch (error) {
      console.error('Error playing audio:', error);
      setState('error');
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setState('paused');
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setState('idle');
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  return {
    state,
    currentTime,
    duration,
    play,
    pause,
    stop,
    seek,
    audioRef,
  };
}
