import { NextRequest, NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Interface para as opções de síntese
interface SynthesizeRequest {
  text: string;
  voice?: string;
  languageCode?: string;
  speakingRate?: number;
  pitch?: number;
  volumeGainDb?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: SynthesizeRequest = await request.json();
    const { 
      text, 
      voice = 'pt-BR-Neural2-B',  // Voz masculina neural (melhor qualidade)
      languageCode = 'pt-BR',
      speakingRate = 0.85,  // Velocidade pausada
      pitch = -2.0,         // Tom grave
      volumeGainDb = 0.0    // Volume normal
    } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Texto é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se as credenciais estão configuradas
    const credentials = process.env.GOOGLE_CLOUD_TTS_CREDENTIALS;
    
    if (!credentials) {
      console.warn('⚠️ Google Cloud TTS não configurado, usando fallback');
      return NextResponse.json(
        { 
          error: 'Google Cloud TTS não configurado',
          fallback: true,
          message: 'Configure GOOGLE_CLOUD_TTS_CREDENTIALS no .env.local'
        },
        { status: 503 }
      );
    }

    // Parse das credenciais
    let credentialsJson;
    try {
      credentialsJson = JSON.parse(credentials);
    } catch (e) {
      console.error('❌ Erro ao parsear credenciais:', e);
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 500 }
      );
    }

    // Criar cliente do Google Cloud TTS
    const client = new TextToSpeechClient({
      credentials: credentialsJson,
    });

    // Configurar request
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode,
        name: voice,
        ssmlGender: 'MALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate,
        pitch,
        volumeGainDb,
        effectsProfileId: ['headphone-class-device'], // Otimizado para fones
      },
    });

    // Retornar áudio em base64
    const audioContent = response.audioContent;
    if (!audioContent) {
      return NextResponse.json(
        { error: 'Nenhum áudio gerado' },
        { status: 500 }
      );
    }

    const base64Audio = Buffer.from(audioContent).toString('base64');

    return NextResponse.json({
      audio: base64Audio,
      format: 'mp3',
      voice,
      languageCode,
      charactersCount: text.length,
    });

  } catch (error: any) {
    console.error('❌ Erro ao sintetizar:', error);
    
    // Mensagem específica para erro de permissão
    if (error.message?.includes('permission') || error.code === 7) {
      return NextResponse.json(
        { 
          error: 'Permissão negada',
          message: 'Service Account não tem permissão para Text-to-Speech API',
          hint: 'Adicione a role "Cloud Text-to-Speech User" no Google Cloud Console'
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno', message: error.message },
      { status: 500 }
    );
  }
}
