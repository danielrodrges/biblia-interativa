# 🔧 CONFIGURAÇÃO COMPLETA DO SUPABASE PARA CONFIRMAÇÃO DE EMAIL

## ⚠️ PROBLEMA IDENTIFICADO
O link de confirmação está offline porque o Supabase não conhece as URLs permitidas para redirect.

## ✅ SOLUÇÃO - Execute estes passos:

### 1️⃣ Acesse o Dashboard do Supabase
```
https://app.supabase.com/project/umbgtudgphbwpkeoebry
```

---

### 2️⃣ Configure Authentication → URL Configuration

#### **Site URL** (URL principal do site):
```
https://biblia-interativa-wine.vercel.app
```

#### **Redirect URLs** (adicione TODAS estas URLs):
```
http://localhost:3000/**
https://biblia-interativa-wine.vercel.app/**
https://biblia-interativa-q6n8.vercel.app/**
https://*.vercel.app/**
```

**💡 O `/**` permite qualquer sub-rota**

---

### 3️⃣ Configure Email Templates

Vá em: **Authentication → Email Templates → Confirm signup**

#### Template HTML:
```html
<h2>Bem-vindo à Bíblia Interativa! 📖</h2>

<p>Olá {{ .Data.full_name }},</p>

<p>Obrigado por se cadastrar! Para começar a usar o app, confirme seu email clicando no botão abaixo:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #292524; color: white; padding: 12px 24px; 
            text-decoration: none; border-radius: 8px; display: inline-block; 
            font-weight: bold;">
    Confirmar meu email
  </a>
</p>

<p>Ou copie e cole este link no navegador:</p>
<p style="word-break: break-all; color: #666;">{{ .ConfirmationURL }}</p>

<p>Se você não criou esta conta, ignore este email.</p>

<p>Até breve! 🙏</p>
```

---

### 4️⃣ Configurações de Email (opcional mas recomendado)

Em **Authentication → Email**:

✅ **Enable email confirmations**: ATIVADO
✅ **Secure email change**: ATIVADO  
✅ **Double confirm email changes**: ATIVADO (opcional)

---

### 5️⃣ Teste o Fluxo

1. Vá para: http://localhost:3000/auth/signup
2. Crie uma conta com um email real
3. Verifique seu email
4. Clique no link de confirmação
5. Você será redirecionado para: `/auth/callback` → `/inicio`

---

### 6️⃣ Verificar se está funcionando

Após configurar, teste com este comando:

```bash
cd /workspaces/biblia-interativa && npx tsx scripts/diagnose-supabase.ts
```

---

## 🔍 Troubleshooting

### Se o link continuar offline:

1. **Verifique as URLs permitidas** no Supabase
2. **Limpe o cache** do navegador
3. **Teste em modo anônimo** do navegador
4. **Verifique os logs** do Supabase em: Project → Logs → Auth

### Se aparecer "Invalid redirect URL":

- Adicione `https://*.vercel.app/**` nas Redirect URLs
- Certifique-se de que salvou as configurações

### Se não receber o email:

1. Verifique a pasta de spam
2. Verifique em Authentication → Users se o usuário foi criado
3. Confira se o email está correto
4. Teste com outro provedor de email (Gmail, Outlook, etc.)

---

## 📝 Fluxo Completo após Configuração

```
1. Usuário preenche formulário → /auth/signup
2. Sistema cria conta no Supabase
3. Supabase envia email com link de confirmação
4. Usuário clica no link → /auth/callback?code=...
5. Sistema valida o código
6. Sistema cria perfil e estatísticas
7. Redireciona para → /inicio ✅
```

---

## 🚀 Após Configurar

Execute um novo deploy:

```bash
cd /workspaces/biblia-interativa
vercel --prod
```

Agora o fluxo de confirmação funcionará perfeitamente! 🎉
