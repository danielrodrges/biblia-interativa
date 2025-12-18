import { useState, useEffect } from 'react';
import { SubtitleCue } from '@/mocks/subtitles';

export function useSubtitleSync(
  currentTime: number,
  cues: SubtitleCue[],
  enabled: boolean
) {
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveSubtitle(null);
      return;
    }

    // Encontrar cue ativo baseado no tempo atual
    const activeCue = cues.find(
      (cue) => currentTime >= cue.start && currentTime <= cue.end
    );

    setActiveSubtitle(activeCue ? activeCue.text : null);
  }, [currentTime, cues, enabled]);

  return activeSubtitle;
}
