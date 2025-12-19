'use client';

interface Verse {
  number: number;
  text: string;
}

interface ReaderContentProps {
  verses: Verse[];
  fontSize: 'S' | 'M' | 'L';
  highlightedIndex?: number;
  currentCharIndex?: number;
}

const fontSizeClasses = {
  S: 'text-[16px] leading-[1.65]',
  M: 'text-[18px] leading-[1.75]',
  L: 'text-[20px] leading-[1.85]',
};

// Função para encontrar qual palavra está sendo falada
function findCurrentWordRange(text: string, charIndex: number): { start: number; end: number } | null {
  if (charIndex < 0 || charIndex >= text.length) return null;
  
  // Encontrar o início da palavra (voltar até espaço ou início)
  let start = charIndex;
  while (start > 0 && /\S/.test(text[start - 1])) {
    start--;
  }
  
  // Encontrar o fim da palavra (avançar até espaço ou fim)
  let end = charIndex;
  while (end < text.length && /\S/.test(text[end])) {
    end++;
  }
  
  return { start, end };
}

export default function ReaderContent({ verses, fontSize, highlightedIndex = -1, currentCharIndex = 0 }: ReaderContentProps) {
  // Renderizar versículo com destaque de palavra
  const renderVerseWithHighlight = (verse: Verse, index: number) => {
    const isCurrentVerse = index === highlightedIndex;
    const text = verse.text;
    
    if (!isCurrentVerse) {
      // Versículo normal sem destaque
      return (
        <span key={verse.number} id={`verse-${verse.number}`} className="inline">
          <sup 
            className="text-[10px] font-bold text-stone-400 dark:text-stone-500 mr-[2px] select-none font-sans"
            style={{ lineHeight: '0' }}
          >
            {verse.number}
          </sup>
          <span className="text-stone-800 dark:text-stone-300">{text}</span>
          {index < verses.length - 1 && ' '}
        </span>
      );
    }
    
    // Versículo sendo lido - destacar palavra atual
    const wordRange = findCurrentWordRange(text, currentCharIndex);
    
    if (!wordRange || currentCharIndex <= 0) {
      // Sem palavra específica, destacar versículo inteiro
      return (
        <span key={verse.number} id={`verse-${verse.number}`} className="inline">
          <sup 
            className="text-[10px] font-bold text-stone-400 dark:text-stone-500 mr-[2px] select-none font-sans"
            style={{ lineHeight: '0' }}
          >
            {verse.number}
          </sup>
          <span className="bg-stone-200 dark:bg-stone-800 transition-colors duration-150 rounded px-0.5 text-stone-900 dark:text-stone-100">{text}</span>
          {index < verses.length - 1 && ' '}
        </span>
      );
    }
    
    // Dividir o texto em: antes da palavra, palavra atual, depois da palavra
    const before = text.substring(0, wordRange.start);
    const word = text.substring(wordRange.start, wordRange.end);
    const after = text.substring(wordRange.end);
    
    return (
      <span key={verse.number} id={`verse-${verse.number}`} className="inline">
        <sup 
          className="text-[10px] font-bold text-stone-400 dark:text-stone-500 mr-[2px] select-none font-sans"
          style={{ lineHeight: '0' }}
        >
          {verse.number}
        </sup>
        <span>
          <span className="bg-stone-100 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100">{before}</span>
          <span className="bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 font-medium px-1 rounded transition-all duration-100">
            {word}
          </span>
          <span className="bg-stone-100 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100">{after}</span>
        </span>
        {index < verses.length - 1 && ' '}
      </span>
    );
  };

  return (
    <div className="h-full w-full px-5 py-4">
      <div className="max-w-[680px] mx-auto h-full">
        <div 
          className={`${fontSizeClasses[fontSize]} font-bookerly text-gray-800 dark:text-gray-100 text-justify`}
          style={{ 
            hyphens: 'auto',
            wordSpacing: '0.05em',
            letterSpacing: '0.015em',
            lineHeight: 'inherit'
          }}
        >
          {verses.map((verse, index) => renderVerseWithHighlight(verse, index))}
        </div>
      </div>
    </div>
  );
}
