'use client';

import { Play, Pause, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import { AudioPlayerState } from '@/hooks/useAudioPlayer';

interface ReaderControlsProps {
  state: AudioPlayerState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
}

export default function ReaderControls({
  state,
  onPlay,
  onPause,
  onStop,
  onPrevChapter,
  onNextChapter,
}: ReaderControlsProps) {
  const isPlaying = state === 'playing';
  const isLoading = state === 'loading';

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/98 dark:bg-gray-900/98 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-[720px] mx-auto px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Capítulo Anterior */}
          {onPrevChapter && (
            <button
              onClick={onPrevChapter}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Capítulo anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}

          {/* Play / Pause */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={isLoading}
            className={`
              p-5 rounded-full transition-all shadow-lg
              ${isLoading ? 'bg-gray-300 dark:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'}
              ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isLoading ? (
              <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-7 h-7 text-white fill-white" />
            ) : (
              <Play className="w-7 h-7 text-white fill-white" />
            )}
          </button>

          {/* Stop */}
          <button
            onClick={onStop}
            disabled={state === 'idle' || isLoading}
            className={`
              p-3 rounded-full transition-colors
              ${state === 'idle' || isLoading 
                ? 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed' 
                : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
              }
            `}
            aria-label="Parar"
          >
            <Square className={`w-5 h-5 ${state === 'idle' || isLoading ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`} />
          </button>

          {/* Próximo Capítulo */}
          {onNextChapter && (
            <button
              onClick={onNextChapter}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Próximo capítulo"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
