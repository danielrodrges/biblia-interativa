'use client'

interface SubtitleDisplayProps {
  text: string
  fontSize?: 'S' | 'M' | 'L'
}

const fontSizeClasses = {
  S: 'text-sm leading-relaxed',
  M: 'text-base leading-relaxed',
  L: 'text-lg leading-relaxed',
}

export function SubtitleDisplay({ text, fontSize = 'M' }: SubtitleDisplayProps) {
  return (
    <div className="fixed bottom-[180px] left-0 right-0 z-40 px-4 pointer-events-none animate-in fade-in duration-300">
      <div className="max-w-3xl mx-auto bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-gray-700/50">
        <p className={`text-white text-center font-medium ${fontSizeClasses[fontSize]}`}>
          {text}
        </p>
      </div>
    </div>
  )
}
