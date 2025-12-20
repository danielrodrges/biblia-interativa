# 🎙️ Configuração de Voz Melhorada

## Ajustes Aplicados para Voz Masculina Sábia

### 🎯 Prioridades de Seleção

1. **Vozes masculinas específicas** (Daniel, Felipe, Fernando, Ricardo, Carlos)
2. **Vozes com termos** "male", "masculino", "deep", "grave", "narrator"
3. **Vozes Google neurais** (excluindo femininas)
4. **Microsoft/Apple masculinas**
5. **Qualquer voz pt-BR** (evitando femininas)

### ⚙️ Parâmetros da Voz

```typescript
pitch: 0.85   // Tom grave (masculino profundo e sábio)
rate: 0.85    // Velocidade pausada (transmite experiência)
volume: 1.0   // Volume cheio para clareza
```

## 🎧 Melhores Vozes por Sistema

### Chrome/Edge (Windows)
- **Google português do Brasil** - Voz neural de alta qualidade
- **Microsoft David Desktop** - Masculina profunda
- **Microsoft Daniel** - Boa entonação

### Chrome/Edge (Android)
- **pt-br-x-ptd-network** - Google TTS masculina
- **pt-br-x-ptd-local** - Versão offline

### Safari (iOS/macOS)
- **Luciana** (evitada agora)
- **Daniel** (priorizada se disponível)
- Instalar vozes adicionais: Ajustes → Acessibilidade → Conteúdo Falado → Vozes

### Firefox
- Vozes mais limitadas
- Usa sistema do SO

## 📱 Como Instalar Vozes Melhores

### Android
1. Google Play Store → **Google Text-to-Speech**
2. Configurações → Sistema → Idiomas → Saída de texto para voz
3. Baixar **"Português (Brasil)"** de alta qualidade

### iOS/macOS
1. Ajustes → Acessibilidade → Conteúdo Falado
2. Vozes → Português (Brasil)
3. Baixar vozes **"Melhorada"** ou **"Premium"**

### Windows
1. Configurações → Hora e Idioma → Idioma
2. Português (Brasil) → Opções
3. Baixar **"Microsoft Daniel"** ou outras vozes

## 🔧 Personalizações Adicionais (se necessário)

Se quiser ajustar ainda mais, edite em `src/hooks/useSpeechSynthesis.ts`:

```typescript
utterance.pitch = 0.85;  // 0.5 = muito grave, 1.0 = normal, 2.0 = agudo
utterance.rate = 0.85;   // 0.5 = muito lento, 1.0 = normal, 2.0 = rápido
utterance.volume = 1.0;  // 0.0 = mudo, 1.0 = volume máximo
```

## 🎤 APIs de Voz Premium (Futuro)

Para voz REALMENTE profissional (custo adicional):

### Google Cloud Text-to-Speech
- **pt-BR-Wavenet-B** (masculina neural)
- **pt-BR-Neural2-B** (ultra realista)
- Custo: ~$16 por 1 milhão de caracteres

### Amazon Polly
- **Ricardo** (pt-BR masculina)
- Vozes Neural de alta qualidade

### Microsoft Azure
- **Daniel** (pt-BR)
- Vozes Neural premium

## ✅ Status Atual

- ✅ Voz alterada para priorizar masculinas
- ✅ Tom grave configurado (0.85)
- ✅ Velocidade pausada (0.85)
- ✅ Volume cheio para clareza
- ⏳ Aguardando deploy para testar

**Commit mas NÃO fez deploy ainda** (conforme solicitado)
