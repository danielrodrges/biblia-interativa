/**
 * Cliente para Google Cloud Text-to-Speech
 */

export interface TTSOptions {
  text: string;
  voice?: string;
  languageCode?: string;
  speakingRate?: number;
  pitch?: number;
  volumeGainDb?: number;
}

export interface TTSResponse {
  audio: string;  // Base64
  format: 'mp3';
  voice: string;
  languageCode: string;
  charactersCount: number;
}

/**
 * Sintetizar texto em áudio usando Google Cloud TTS
 */
export async function synthesizeSpeech(options: TTSOptions): Promise<TTSResponse | null> {
  try {
    const response = await fetch('/api/tts/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const error = await response.json();
      
      // Se não está configurado, retornar null para fallback
      if (error.fallback) {
        console.warn('⚠️ Google Cloud TTS não disponível, usando Web Speech API');
        return null;
      }
      
      throw new Error(error.error || 'Erro ao sintetizar áudio');
    }

    const data: TTSResponse = await response.json();
    return data;

  } catch (error) {
    console.error('❌ Erro ao chamar TTS:', error);
    return null;
  }
}

/**
 * Converter base64 para Blob de áudio
 */
export function base64ToAudioBlob(base64: string): Blob {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: 'audio/mp3' });
}

/**
 * Criar URL de áudio a partir de base64
 */
export function createAudioUrl(base64: string): string {
  const blob = base64ToAudioBlob(base64);
  return URL.createObjectURL(blob);
}
