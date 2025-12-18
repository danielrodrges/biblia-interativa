# Arquivos de Áudio da Bíblia

Esta pasta contém os arquivos de áudio para a funcionalidade de leitura com narração.

## Como Adicionar Arquivos de Áudio

### Opção 1: Usar um Serviço de Text-to-Speech (TTS)

Você pode usar serviços como:
- **Google Cloud Text-to-Speech**: https://cloud.google.com/text-to-speech
- **Amazon Polly**: https://aws.amazon.com/polly/
- **Microsoft Azure Speech**: https://azure.microsoft.com/services/cognitive-services/text-to-speech/

### Opção 2: Áudio Profissional

Você também pode usar gravações profissionais de narração bíblica:
- **Bible.is (Faith Comes By Hearing)**: https://www.faithcomesbyhearing.com/
- **YouVersion**: Pode ter parcerias para áudio

### Formato do Arquivo

- **Nome do arquivo**: `sample.mp3` (para teste)
- **Formato**: MP3 (recomendado) ou OGG
- **Qualidade**: 128kbps ou superior
- **Mono ou Stereo**: Ambos funcionam, mas mono economiza espaço

### Estrutura Futura

Para um sistema completo, você pode organizar assim:

```
public/audio/
  ├── pt-BR/
  │   ├── NVI/
  │   │   ├── JOH/
  │   │   │   ├── chapter-1.mp3
  │   │   │   ├── chapter-2.mp3
  │   │   │   └── ...
  │   │   └── ...
  │   └── ...
  ├── en-US/
  │   ├── NIV/
  │   │   └── ...
  │   └── ...
  └── sample.mp3
```

### Gerar Áudio de Teste com TTS Online

Você pode usar sites gratuitos para gerar um áudio de teste:

1. Acesse: https://www.naturalreaders.com/online/ ou https://ttsmp3.com/
2. Cole o texto de João 3:16-18
3. Escolha voz em português
4. Baixe o arquivo MP3
5. Renomeie para `sample.mp3`
6. Coloque nesta pasta

### Importante

Por enquanto, a aplicação usa `/audio/sample.mp3` como placeholder.
Para produção, você precisará:
1. Criar um sistema de gerenciamento de áudio
2. Implementar download sob demanda
3. Considerar CDN para distribuição
4. Sincronizar legendas com timestamps precisos
