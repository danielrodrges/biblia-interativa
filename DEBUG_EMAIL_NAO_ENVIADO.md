# 🔍 DIAGNÓSTICO - Email não está sendo enviado

## ✅ Ambiente de Dev Rodando:
- **Local**: http://localhost:3000
- **Network**: http://10.0.0.92:3000

## 🔍 Possíveis causas do email não chegar:

### 1️⃣ Confirmação de Email pode estar DESATIVADA no Supabase

Verifique em: **Authentication → Providers → Email**

**Se estiver DESATIVADO "Confirm email":**
- O usuário é criado imediatamente SEM precisar confirmar email
- Nenhum email é enviado
- O login já funciona direto

**Se estiver ATIVADO "Confirm email":**
- Um email DEVE ser enviado
- Usuário precisa clicar no link para ativar a conta

---

### 2️⃣ Verificar configuração de SMTP (Email Provider)

Por padrão, Supabase usa um servidor de email compartilhado que tem **rate limits baixos** e pode não funcionar bem.

#### Verificar no Supabase:
1. Vá em: **Project Settings → Auth**
2. Role até **SMTP Settings**
3. Verifique se está usando:
   - **Default (Supabase)**: Limite de 4 emails/hora no plano free
   - **Custom SMTP**: Seu próprio servidor de email

#### ⚠️ IMPORTANTE:
Se estiver no plano FREE e usando o SMTP padrão do Supabase, você está limitado a **4 emails por hora**.

---

### 3️⃣ Verificar Template de Email

Vá em: **Authentication → Email Templates → Confirm signup**

Verifique se:
- O template existe
- Contém `{{ .ConfirmationURL }}`
- Está ativo

---

### 4️⃣ Verificar Rate Limit

Se você testou muitas vezes, pode ter atingido o rate limit.

**Espere 1 hora ou:**
1. Vá em **Authentication → Rate Limits**
2. Aumente o limite se necessário

---

### 5️⃣ Verificar Logs do Supabase

1. Acesse: **Logs → Auth Logs**
2. Procure por entradas de signup recentes
3. Veja se há erros de envio de email

---

## 🧪 TESTE AGORA:

### Passo 1: Verifique configurações acima

### Passo 2: Teste signup no ambiente local
1. Acesse: http://localhost:3000/auth/signup
2. Crie uma conta com SEU email real
3. **ABRA O CONSOLE DO NAVEGADOR (F12)** para ver os logs
4. Procure por mensagens como:
   - `🔍 SignUp Debug:`
   - `✅ Signup response:`
   - `⏳ Email de confirmação enviado`

### Passo 3: Verifique o email
- Caixa de entrada
- Pasta de spam/lixo
- Aguarde até 5 minutos (pode demorar)

---

## 📋 O que os logs devem mostrar:

Se confirmação de email está ATIVADA:
```
✅ Signup response: {
  user: "uuid-do-usuario",
  session: false,
  identities: 1
}
⏳ Email de confirmação enviado. Perfil será criado após confirmação.
```

Se confirmação está DESATIVADA:
```
✅ Signup response: {
  user: "uuid-do-usuario", 
  session: true,
  identities: 1
}
✅ Perfil criado (auto-confirmed)
```

---

## 🔧 SOLUÇÃO RÁPIDA se email não está sendo enviado:

### Opção 1: Desativar confirmação de email (para testes)
1. Vá em: **Authentication → Providers → Email**
2. DESATIVE "Confirm email"
3. Teste criar conta novamente
4. Deve funcionar sem precisar de email

### Opção 2: Configurar SMTP próprio
1. Use um serviço como SendGrid, Mailgun, AWS SES
2. Configure em: **Project Settings → Auth → SMTP Settings**

---

## 📊 Status Atual:
- ✅ Código atualizado com logs detalhados
- ✅ Ambiente dev rodando em http://localhost:3000
- ⏳ Aguardando teste e verificação de logs

**Teste agora e me diga o que aparece no console do navegador!** 🔍
