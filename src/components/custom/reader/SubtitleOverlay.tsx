'use client';

interface SubtitleOverlayProps {
  text: string | null;
  fontSize: 'S' | 'M' | 'L';
  isVisible: boolean;
}

const fontSizeClasses = {
  S: 'text-sm',
  M: 'text-base',
  L: 'text-lg',
};

export default function SubtitleOverlay({ text, fontSize, isVisible }: SubtitleOverlayProps) {
  if (!isVisible || !text) {
    return null;
  }

  return (
    <div className="fixed bottom-56 left-4 right-4 z-40 pointer-events-none">
      <div className="max-w-[720px] mx-auto">
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-2xl">
          <p className={`${fontSizeClasses[fontSize]} text-white text-center leading-relaxed font-medium`}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
