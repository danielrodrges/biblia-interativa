# 🔐 Configuração de Login com Google (OAuth)

## ✅ Código já Implementado

Os botões de login com Google já estão funcionando nas páginas:
- ✅ `/auth/login` - Página de login
- ✅ `/auth/signup` - Página de cadastro
- ✅ Função `signInWithGoogle()` no `src/lib/supabase.ts`

**Falta apenas configurar as credenciais do Google no Supabase!**

---

## 🚀 Passo a Passo: Configurar Google OAuth

### 1️⃣ Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Clique em **"Selecionar projeto"** → **"Novo Projeto"**
3. Nome do projeto: `Bíblia Interativa`
4. Clique em **"Criar"**

### 2️⃣ Ativar Google+ API

1. No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
2. Busque por `Google+ API`
3. Clique em **"Ativar"**

### 3️⃣ Configurar Tela de Consentimento OAuth

1. Vá em **"APIs e Serviços"** → **"Tela de consentimento OAuth"**
2. Selecione **"Externo"** (para permitir qualquer usuário Google)
3. Clique em **"Criar"**

**Preencha os campos:**
- **Nome do aplicativo**: `Bíblia Interativa`
- **E-mail de suporte do usuário**: Seu email
- **Logotipo**: (opcional) Faça upload de uma logo
- **Domínios autorizados**: `vercel.app` e seu domínio personalizado (se tiver)
- **E-mail do desenvolvedor**: Seu email
- Clique em **"Salvar e continuar"**

**Escopos (Scopes):**
- Não precisa adicionar escopos personalizados
- Clique em **"Salvar e continuar"**

**Usuários de teste:**
- Adicione seu email para testes
- Clique em **"Salvar e continuar"**

### 4️⃣ Criar Credenciais OAuth

1. Vá em **"APIs e Serviços"** → **"Credenciais"**
2. Clique em **"+ Criar Credenciais"** → **"ID do cliente OAuth 2.0"**
3. **Tipo de aplicativo**: `Aplicativo da Web`
4. **Nome**: `Bíblia Interativa Web`

**URLs de Redirecionamento Autorizadas:**

Copie a URL de callback do Supabase:
```
https://umbgtudgphbwpkeoebry.supabase.co/auth/v1/callback
```

**IMPORTANTE:** Cole exatamente essa URL no campo de redirect URIs!

5. Clique em **"Criar"**

### 5️⃣ Copiar Credenciais

Você receberá:
- ✅ **Client ID** (começa com números e termina em `.apps.googleusercontent.com`)
- ✅ **Client Secret** (string aleatória)

**Guarde essas credenciais!** Você vai usar no próximo passo.

---

## 🔧 Configurar no Supabase Dashboard

### 1. Acessar Configurações de Auth

1. Acesse: https://supabase.com/dashboard/project/umbgtudgphbwpkeoebry/auth/providers
2. Procure por **"Google"** na lista de providers

### 2. Ativar e Configurar Google

1. Clique em **"Google"**
2. Ative o toggle **"Enable Google provider"**

**Preencha os campos:**
- **Client ID**: Cole o Client ID do Google Cloud Console
- **Client Secret**: Cole o Client Secret do Google Cloud Console

**URLs autorizadas (já preenchidas automaticamente):**
- Callback URL: `https://umbgtudgphbwpkeoebry.supabase.co/auth/v1/callback`

3. Clique em **"Save"**

---

## 🧪 Testar o Login com Google

### 1. Acessar Página de Login

Acesse: https://biblia-interativa-wine.vercel.app/auth/login

### 2. Clicar em "Google"

Clique no botão branco com logo do Google

### 3. Autorizar Acesso

- Você será redirecionado para tela do Google
- Selecione sua conta Google
- Autorize o acesso ao app
- Você será redirecionado de volta para o app

### 4. Verificar Login

Você deve ser automaticamente redirecionado para `/inicio` após o login.

---

## 🔍 Verificar se Funcionou

### No Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/umbgtudgphbwpkeoebry/auth/users
2. Você deve ver seu usuário na lista
3. O campo **Provider** deve estar como `google`

### No Banco de Dados

Execute no SQL Editor:
```sql
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as nome,
  raw_app_meta_data->>'provider' as provider,
  created_at
FROM auth.users
WHERE raw_app_meta_data->>'provider' = 'google';
```

---

## 🚨 Troubleshooting

### "redirect_uri_mismatch" Error

**Causa:** URL de redirecionamento não autorizada no Google Cloud  
**Solução:**
1. Volte ao Google Cloud Console → Credenciais
2. Clique no Client ID criado
3. Adicione a URL exata: `https://umbgtudgphbwpkeoebry.supabase.co/auth/v1/callback`
4. Salve e aguarde alguns minutos

### "Access Denied" ou "Acesso Negado"

**Causa:** App ainda está em modo de teste  
**Solução:**
1. Google Cloud Console → Tela de consentimento OAuth
2. Clique em **"Publicar aplicativo"**
3. Ou adicione seu email em "Usuários de teste"

### Usuário não criado no profiles

**Causa:** Trigger do banco pode não estar funcionando  
**Solução:** O callback já cria o perfil automaticamente. Verifique:
```sql
SELECT * FROM profiles WHERE id = (
  SELECT id FROM auth.users WHERE email = 'seu@email.com'
);
```

### Login redireciona mas não mantém sessão

**Causa:** Problema de cookies entre domínios  
**Solução:**
1. Certifique-se que está usando HTTPS
2. Verifique se o callback está em `/auth/callback`
3. Limpe cache e cookies do navegador

---

## 🎯 URLs Importantes

### Google Cloud Console
- Dashboard: https://console.cloud.google.com/
- Credenciais: https://console.cloud.google.com/apis/credentials
- Tela de Consentimento: https://console.cloud.google.com/apis/credentials/consent

### Supabase
- Auth Providers: https://supabase.com/dashboard/project/umbgtudgphbwpkeoebry/auth/providers
- Users: https://supabase.com/dashboard/project/umbgtudgphbwpkeoebry/auth/users
- Logs: https://supabase.com/dashboard/project/umbgtudgphbwpkeoebry/logs/explorer

### Sua Aplicação
- Login: https://biblia-interativa-wine.vercel.app/auth/login
- Signup: https://biblia-interativa-wine.vercel.app/auth/signup
- Callback: https://biblia-interativa-wine.vercel.app/auth/callback

---

## 📋 Checklist de Configuração

- [ ] Projeto criado no Google Cloud Console
- [ ] Google+ API ativada
- [ ] Tela de consentimento configurada
- [ ] Credenciais OAuth criadas
- [ ] URLs de redirecionamento configuradas
- [ ] Client ID e Secret copiados
- [ ] Google provider ativado no Supabase
- [ ] Credenciais coladas no Supabase
- [ ] Teste de login realizado
- [ ] Usuário criado no banco de dados

---

## 🔐 Segurança e Boas Práticas

### ✅ O que o código já faz:

1. **Redirecionamento seguro**: Usa callback URL próprio
2. **Criação automática de perfil**: Trigger ou código cria perfil automaticamente
3. **Sessão persistente**: Cookie seguro mantém usuário logado
4. **Validação de email**: Email do Google já é verificado

### 🔒 Dados coletados do Google:

- Email (verificado)
- Nome completo
- Foto de perfil (opcional)
- ID único do Google

### 🚫 O que NÃO é coletado:

- Senhas (Google gerencia)
- Dados pessoais além do perfil público
- Informações de outras contas Google

---

## 🎉 Pronto!

Após seguir estes passos, o login com Google estará **100% funcional**!

Usuários poderão:
- ✅ Fazer login com 1 clique
- ✅ Sem precisar criar senha
- ✅ Email já verificado automaticamente
- ✅ Experiência fluida e segura

---

## 🔄 Próximos Passos (Opcional)

### Outros Providers OAuth

Se quiser adicionar mais opções de login, já temos código para:
- **Facebook** - Precisa configurar no Meta Developers
- **Apple** - Precisa Apple Developer Account
- **GitHub** - Precisa GitHub OAuth App
- **Twitter/X** - Precisa Twitter Developer Account

O processo é similar para todos os providers!

### Publicar o App no Google

Atualmente o app está em modo "Testing". Para remover a tela de aviso:
1. Google Cloud Console → Tela de consentimento
2. Clique em **"Publicar aplicativo"**
3. Preencha informações adicionais se solicitado
4. Aguarde revisão do Google (pode levar alguns dias)

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no Supabase Dashboard
2. Verifique console do navegador (F12)
3. Teste em modo anônimo/incógnito
4. Limpe cache e cookies

**Erros comuns estão documentados na seção Troubleshooting acima!**
