'use client';

interface Verse {
  number: number;
  text: string;
}

interface ReaderContentProps {
  verses: Verse[];
  fontSize: 'S' | 'M' | 'L';
  highlightedIndex?: number;
}

const fontSizeClasses = {
  S: 'text-[15px] leading-[1.6]',
  M: 'text-[17px] leading-[1.7]',
  L: 'text-[19px] leading-[1.8]',
};

export default function ReaderContent({ verses, fontSize, highlightedIndex = -1 }: ReaderContentProps) {
  return (
    <div className="h-full w-full px-5 py-4">
      <div className="max-w-[680px] mx-auto h-full">
        <div 
          className={`${fontSizeClasses[fontSize]} text-gray-900 dark:text-gray-100 text-justify`}
          style={{ 
            hyphens: 'auto',
            wordSpacing: '0.05em',
            letterSpacing: '0.01em'
          }}
        >
          {verses.map((verse, index) => (
            <span 
              key={verse.number} 
              id={`verse-${verse.number}`}
              className={`inline transition-all duration-200 ${
                index === highlightedIndex 
                  ? 'bg-blue-200 dark:bg-blue-900/40' 
                  : ''
              }`}
            >
              <sup 
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mr-[2px] select-none"
                style={{ lineHeight: '0' }}
              >
                {verse.number}
              </sup>
              <span>{verse.text}</span>
              {index < verses.length - 1 && ' '}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
