import { NextRequest, NextResponse } from 'next/server';

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

    // Obter access token do Google Cloud
    const accessToken = await getAccessToken(credentialsJson);

    // Chamar API do Google Cloud Text-to-Speech
    const response = await fetch(
      'https://texttospeech.googleapis.com/v1/text:synthesize',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Erro na API do Google:', error);
      return NextResponse.json(
        { error: 'Erro ao sintetizar áudio', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Retornar áudio em base64
    return NextResponse.json({
      audio: data.audioContent,  // Base64
      format: 'mp3',
      voice,
      languageCode,
      charactersCount: text.length,
    });

  } catch (error: any) {
    console.error('❌ Erro ao sintetizar:', error);
    return NextResponse.json(
      { error: 'Erro interno', message: error.message },
      { status: 500 }
    );
  }
}

// Função para obter access token usando service account
async function getAccessToken(credentials: any): Promise<string> {
  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtClaim = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  // Criar JWT
  const header = base64UrlEncode(JSON.stringify(jwtHeader));
  const claim = base64UrlEncode(JSON.stringify(jwtClaim));
  const signature = await signJwt(`${header}.${claim}`, credentials.private_key);
  
  const jwt = `${header}.${claim}.${signature}`;

  // Trocar JWT por access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao obter access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Helper para base64 URL encoding
function base64UrlEncode(str: string): string {
  const base64 = Buffer.from(str).toString('base64');
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Assinar JWT com private key
async function signJwt(data: string, privateKey: string): Promise<string> {
  const crypto = await import('crypto');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data);
  sign.end();
  
  const signature = sign.sign(privateKey);
  return base64UrlEncode(signature.toString('base64'));
}
