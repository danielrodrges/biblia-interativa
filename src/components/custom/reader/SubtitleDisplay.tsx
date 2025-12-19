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
      <div className="max-w-3xl mx-auto bg-stone-900/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl border border-stone-800/50">
        <p className={`text-stone-50 text-center font-medium tracking-wide ${fontSizeClasses[fontSize]}`}>
          {text}
        </p>
      </div>
    </div>
  )
}
