import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

async function testGoogleTTS() {
  console.log('🧪 TESTANDO GOOGLE CLOUD TEXT-TO-SPEECH\n');

  const credentials = process.env.GOOGLE_CLOUD_TTS_CREDENTIALS;

  if (!credentials) {
    console.error('❌ GOOGLE_CLOUD_TTS_CREDENTIALS não encontrada no .env.local');
    return;
  }

  console.log('✅ Credenciais encontradas no .env.local');

  try {
    const credentialsJson = JSON.parse(credentials);
    console.log('✅ JSON válido');
    console.log('   Project ID:', credentialsJson.project_id);
    console.log('   Client Email:', credentialsJson.client_email);
    console.log();

    // Testar chamada à API
    console.log('🎤 Testando síntese de voz...\n');

    const response = await fetch('http://localhost:3000/api/tts/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'No princípio, Deus criou os céus e a terra.',
        voice: 'pt-BR-Neural2-B',
        languageCode: 'pt-BR',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erro na API:', error);
      
      if (error.message?.includes('permission') || error.message?.includes('403')) {
        console.log('\n⚠️  PROBLEMA DE PERMISSÃO DETECTADO!');
        console.log('\n🔧 SOLUÇÃO:');
        console.log('1. Acesse: https://console.cloud.google.com/iam-admin/iam');
        console.log('2. Encontre o service account:', credentialsJson.client_email);
        console.log('3. Clique no lápis (editar)');
        console.log('4. Adicione a role: "Cloud Text-to-Speech User"');
        console.log('5. Salve e teste novamente\n');
      }
      return;
    }

    const data = await response.json();
    console.log('✅ SUCESSO! Áudio sintetizado');
    console.log('   Formato:', data.format);
    console.log('   Voz:', data.voice);
    console.log('   Caracteres:', data.charactersCount);
    console.log('   Tamanho do áudio:', data.audio.length, 'bytes (base64)');
    console.log();
    console.log('🎉 GOOGLE CLOUD TTS FUNCIONANDO PERFEITAMENTE!\n');

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

testGoogleTTS();
