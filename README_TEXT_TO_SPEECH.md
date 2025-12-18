# 🎧 Sistema de Leitura em Voz Alta (Text-to-Speech)

## ✨ Funcionalidades

O sistema de áudio usa a **Web Speech API** nativa do navegador para ler os versículos em voz alta, sem necessidade de arquivos externos ou conexão com internet.

### 🚀 Recursos Principais

- ✅ **100% Offline**: Funciona sem internet após carregar a página
- ✅ **Gratuito**: Não requer APIs pagas ou chaves
- ✅ **Multilíngue**: Suporta português (pt-BR) e inglês (en-US) automaticamente
- ✅ **Sincronização Visual**: Destaca o versículo sendo lido em tempo real
- ✅ **Controles Completos**: Play, Pause, Resume, Stop
- ✅ **Leve**: Sem downloads de arquivos de áudio

## 🎮 Como Usar

### 1. Navegue até a Página de Leitura
```
/leitura/setup → Configurar preferências
/leitura/reader → Tela de leitura
```

### 2. Controles de Áudio

Na parte inferior da tela, você encontrará:

- **▶️ Play**: Inicia a leitura do capítulo
- **⏸️ Pause**: Pausa temporariamente
- **⏹️ Stop**: Para completamente

### 3. Destaque Automático

Durante a leitura:
- O versículo atual fica **destacado em azul**
- A página rola automaticamente para acompanhar
- Indicador visual do versículo sendo lido

## ⚙️ Configurações

### Idioma da Voz

O idioma é determinado automaticamente pela configuração de **"Idioma de Prática"**:

- `pt-BR` → Voz em Português Brasileiro
- `en-US` → Voz em Inglês Americano

### Velocidade de Leitura

Por padrão, a velocidade está em **0.9x** (um pouco mais lenta que normal) para melhor compreensão.

Para ajustar, modifique em `src/hooks/useSpeechSynthesis.ts`:

```typescript
rate: 0.9,  // 0.1 a 10.0 (1.0 é velocidade normal)
pitch: 1.0, // 0 a 2.0 (tom da voz)
volume: 1.0 // 0 a 1.0 (volume)
```

## 🔧 Compatibilidade

### Navegadores Suportados

| Navegador | Suporte | Observações |
|-----------|---------|-------------|
| Chrome/Edge | ✅ Completo | Melhor qualidade de voz |
| Safari | ✅ Completo | Vozes nativas do iOS/macOS |
| Firefox | ✅ Parcial | Menos vozes disponíveis |
| Opera | ✅ Completo | Baseado em Chromium |

### Detecção Automática

O sistema detecta automaticamente se o navegador suporta Text-to-Speech:

```typescript
if (!isSupported) {
  // Exibe mensagem de aviso
  return "⚠️ Seu navegador não suporta síntese de voz";
}
```

## 📱 Dispositivos Móveis

### iOS (Safari)

- ✅ Funciona perfeitamente
- Usa vozes nativas do iOS (excelente qualidade)
- Requer interação do usuário antes de reproduzir

### Android (Chrome)

- ✅ Funciona perfeitamente
- Usa vozes do Google TTS
- Permite download de vozes adicionais

## 🎯 Estrutura Técnica

### Hook Principal: `useSpeechSynthesis`

```typescript
const {
  state,          // 'idle' | 'speaking' | 'paused'
  currentIndex,   // Índice do versículo atual
  speak,          // Inicia leitura
  pause,          // Pausa
  resume,         // Retoma
  stop,           // Para
  isSupported     // Verifica suporte do navegador
} = useSpeechSynthesis({
  lang: 'pt-BR',
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0
});
```

### Componente: `SpeechControls`

Interface de controles de áudio na parte inferior da tela.

### Componente: `ReaderContent`

Exibe versículos com destaque dinâmico baseado em `highlightedIndex`.

## 🐛 Solução de Problemas

### Áudio não inicia

1. Verifique se o navegador suporta Web Speech API
2. Certifique-se de que houve interação do usuário (clique)
3. Verifique o console do navegador para erros

### Voz em idioma errado

1. Vá em `/leitura/setup`
2. Configure o **Idioma de Prática** corretamente
3. O idioma da voz segue o idioma de prática

### Navegador não suportado

Atualize para a versão mais recente de:
- Google Chrome
- Microsoft Edge
- Safari
- Opera

## 📝 Notas Importantes

1. **Privacidade**: Tudo roda localmente no navegador
2. **Performance**: Muito leve, não afeta o desempenho
3. **Sem Custos**: API nativa gratuita
4. **Offline**: Funciona sem internet (após carregar)

## 🚀 Melhorias Futuras

- [ ] Controle de velocidade na interface
- [ ] Seleção de voz específica
- [ ] Controle de pitch (tom)
- [ ] Skip para próximo/anterior versículo
- [ ] Marcadores de tempo
- [ ] Download de capítulo em MP3

## 📚 Referências

- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechSynthesis Interface](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [Browser Compatibility](https://caniuse.com/speech-synthesis)
