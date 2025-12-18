'use client';

import { Verse } from '@/mocks/bibleChapter';

interface ReaderContentProps {
  verses: Verse[];
  fontSize: 'S' | 'M' | 'L';
}

const fontSizeClasses = {
  S: 'text-base',
  M: 'text-lg',
  L: 'text-xl',
};

export default function ReaderContent({ verses, fontSize }: ReaderContentProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-40">
      <div className="max-w-[720px] mx-auto px-6 py-8">
        <div className={`space-y-4 ${fontSizeClasses[fontSize]} leading-relaxed text-gray-800 dark:text-gray-200`}>
          {verses.map((verse) => (
            <p key={verse.number} className="text-justify">
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
