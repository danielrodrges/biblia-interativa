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
  S: 'text-base leading-relaxed',
  M: 'text-lg leading-relaxed',
  L: 'text-xl leading-loose',
};

export default function ReaderContent({ verses, fontSize, highlightedIndex = -1 }: ReaderContentProps) {
  return (
    <div className="h-full w-full px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-[720px] mx-auto h-full">
        <div className={`space-y-4 ${fontSizeClasses[fontSize]} text-gray-900 dark:text-gray-100`}>
          {verses.map((verse, index) => (
            <p 
              key={verse.number} 
              id={`verse-${verse.number}`}
              className={`text-justify transition-all duration-300 rounded-lg p-2 ${
                index === highlightedIndex 
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-600 pl-4' 
                  : ''
              }`}
            >
              <span className="inline-block w-8 text-sm font-semibold text-blue-600 dark:text-blue-400 mr-2">
                {verse.number}
              </span>
              <span>{verse.text}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
