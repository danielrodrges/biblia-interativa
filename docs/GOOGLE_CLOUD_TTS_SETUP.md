# 🎙️ Google Cloud Text-to-Speech - Guia Completo

## 1️⃣ Criar Conta Google Cloud (SE NÃO TIVER)

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. **Aceite os $300 de créditos grátis** (válido 90 dias)
4. Adicione cartão de crédito (não será cobrado no free tier)

## 2️⃣ Criar Projeto

1. No Console, clique em **"Select a project"** (topo)
2. Clique **"NEW PROJECT"**
3. Nome do projeto: `biblia-interativa-tts`
4. Clique **"CREATE"**
5. Aguarde alguns segundos e selecione o projeto

## 3️⃣ Ativar API Text-to-Speech

1. No menu lateral: **APIs & Services** → **Library**
2. Busque: `text-to-speech`
3. Clique em **"Cloud Text-to-Speech API"**
4. Clique **"ENABLE"**

## 4️⃣ Criar Credenciais (Service Account)

### Passo 4.1 - Criar Service Account
1. Menu: **APIs & Services** → **Credentials**
2. Clique **"+ CREATE CREDENTIALS"** → **Service Account**
3. Preencha:
   - **Service account name**: `biblia-tts-service`
   - **Service account ID**: (gerado automaticamente)
   - **Description**: `Service account para TTS da Bíblia Interativa`
4. Clique **"CREATE AND CONTINUE"**

### Passo 4.2 - Dar Permissões
1. **Select a role**: Busque `Cloud Text-to-Speech`
2. Selecione: **Cloud Text-to-Speech User**
3. Clique **"CONTINUE"**
4. Clique **"DONE"**

### Passo 4.3 - Criar Chave JSON
1. Na lista de Service Accounts, clique no email criado
2. Aba **"KEYS"**
3. **"ADD KEY"** → **"Create new key"**
4. Tipo: **JSON**
5. Clique **"CREATE"**
6. **Arquivo JSON será baixado** - GUARDE BEM!

## 5️⃣ Configurar Variáveis de Ambiente

### Opção A: Usar o arquivo JSON completo (MAIS FÁCIL)

Abra o arquivo JSON baixado e copie TODO o conteúdo. Vai ser algo assim:

\`\`\`json
{
  "type": "service_account",
  "project_id": "biblia-interativa-tts",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
  "client_email": "biblia-tts-service@biblia-interativa-tts.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
\`\`\`

No arquivo \`.env.local\`, adicione:

\`\`\`bash
# Google Cloud Text-to-Speech
GOOGLE_CLOUD_TTS_CREDENTIALS='{"type":"service_account","project_id":"..."}'
\`\`\`

**OU** (se preferir separado):

\`\`\`bash
GOOGLE_CLOUD_PROJECT_ID=biblia-interativa-tts
GOOGLE_CLOUD_CLIENT_EMAIL=biblia-tts-service@biblia-interativa-tts.iam.gserviceaccount.com
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
\`\`\`

### Opção B: Na Vercel (Produção)

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione a variável:
   - **Name**: `GOOGLE_CLOUD_TTS_CREDENTIALS`
   - **Value**: Cole o conteúdo do JSON (em uma linha)
   - Selecione: Production, Preview, Development
3. Clique **"Save"**

## 6️⃣ Vozes Disponíveis (pt-BR)

### 🎤 Vozes Masculinas Recomendadas para Leitura Bíblica

| Voz | Tipo | Gênero | Qualidade | Recomendação |
|-----|------|--------|-----------|--------------|
| **pt-BR-Neural2-B** | Neural | Masculino | ⭐⭐⭐⭐⭐ | **MELHOR - Ultra realista, grave, sábia** |
| **pt-BR-Wavenet-B** | Wavenet | Masculino | ⭐⭐⭐⭐ | Muito boa, profunda |
| **pt-BR-Standard-B** | Standard | Masculino | ⭐⭐⭐ | Boa, mais simples |

### 🎯 Configuração Recomendada

\`\`\`typescript
{
  name: 'pt-BR-Neural2-B',  // Melhor qualidade
  languageCode: 'pt-BR',
  ssmlGender: 'MALE',
  
  // Parâmetros de áudio
  speakingRate: 0.85,  // Velocidade pausada e sábia
  pitch: -2.0,         // Tom grave (-20.0 a 20.0, negativo = mais grave)
  volumeGainDb: 0.0,   // Volume normal
}
\`\`\`

## 💰 Custos

### Free Tier (GRÁTIS PARA SEMPRE)
- **4 milhões de caracteres/mês** usando vozes Standard/WaveNet
- **1 milhão de caracteres/mês** usando vozes Neural2

### Após Free Tier
- Standard/WaveNet: **$4 por milhão de caracteres**
- Neural2: **$16 por milhão de caracteres**

### Exemplo Prático
- Bíblia completa: ~3.5 milhões de caracteres
- **Cabe no free tier!** 🎉
- Usuários podem ouvir toda a Bíblia de graça

## 🧪 Testar API

Depois de configurar, teste se está funcionando:

\`\`\`bash
curl -X POST http://localhost:3000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text":"No princípio, Deus criou os céus e a terra.","voice":"pt-BR-Neural2-B"}'
\`\`\`

Deve retornar um áudio em base64.

## ✅ Checklist

- [ ] Conta Google Cloud criada
- [ ] Projeto criado
- [ ] API Text-to-Speech ativada
- [ ] Service Account criado com permissões
- [ ] Arquivo JSON baixado
- [ ] Variável de ambiente configurada
- [ ] Código integrado (feito pelo assistente)
- [ ] Testado localmente
- [ ] Deploy na Vercel com variáveis

---

**Quando tiver o arquivo JSON, me envie que eu configuro as variáveis de ambiente!**
