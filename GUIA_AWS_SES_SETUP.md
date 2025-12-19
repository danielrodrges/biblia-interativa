# 📧 Configurar AWS SES para enviar emails do Supabase

## 🎯 Visão Geral
AWS SES (Simple Email Service) permite enviar 62.000 emails/mês GRÁTIS.

---

## 📋 Passo 1: Criar conta AWS (se não tiver)

1. Acesse: https://aws.amazon.com/
2. Clique em "Create an AWS Account"
3. Preencha seus dados
4. **Você precisará de um cartão de crédito** (mas não será cobrado no free tier)

---

## 📋 Passo 2: Configurar AWS SES

### 2.1 Acessar o SES
1. Faça login na AWS Console: https://console.aws.amazon.com/
2. No campo de busca, digite **"SES"**
3. Clique em **"Amazon Simple Email Service"**
4. **IMPORTANTE**: Selecione a região **"US East (N. Virginia)"** no canto superior direito
   - (ou outra região próxima do Brasil como "South America (São Paulo)")

### 2.2 Sair do Sandbox Mode
Por padrão, o SES está em "Sandbox" e só envia emails para endereços verificados.

1. No menu lateral, clique em **"Account dashboard"**
2. Clique no botão **"Request production access"**
3. Preencha o formulário:
   - **Mail type**: Transactional
   - **Website URL**: `https://biblia-interativa-wine.vercel.app`
   - **Use case description**:
     ```
     We are building a Bible study application that requires user authentication.
     We need to send:
     - Email confirmations for new user signups
     - Password reset emails
     - Account notifications
     
     Expected volume: ~100 emails per day
     ```
   - **Compliance**: Marque as caixas confirmando que seguirá as políticas
4. Clique em **"Submit request"**
5. **Aguarde aprovação** (geralmente 24-48 horas)

> ⚠️ **Enquanto aguarda**, você pode usar o Sandbox mode verificando seu email primeiro.

---

## 📋 Passo 3: Verificar seu email/domínio

### Opção A: Verificar email individual (mais rápido)

1. No menu lateral, vá em **"Verified identities"**
2. Clique em **"Create identity"**
3. Selecione **"Email address"**
4. Digite SEU email (ex: seuemail@gmail.com)
5. Clique em **"Create identity"**
6. **Verifique sua caixa de email** e clique no link de verificação
7. Aguarde até o status ficar **"Verified"**

### Opção B: Verificar domínio (recomendado para produção)

1. No menu lateral, vá em **"Verified identities"**
2. Clique em **"Create identity"**
3. Selecione **"Domain"**
4. Digite seu domínio: `biblia-interativa-wine.vercel.app`
5. Marque **"Use a default DKIM signing key pair"**
6. Clique em **"Create identity"**
7. Copie os registros DNS que aparecem
8. Adicione esses registros na sua zona DNS da Vercel
9. Aguarde propagação (pode levar até 72h)

---

## 📋 Passo 4: Criar credenciais SMTP

1. No menu lateral, vá em **"SMTP settings"**
2. Anote o **SMTP endpoint** (algo como: `email-smtp.us-east-1.amazonaws.com`)
3. Clique em **"Create SMTP credentials"**
4. Digite um nome: `biblia-interativa-smtp`
5. Clique em **"Create"**
6. **⚠️ IMPORTANTE**: Baixe o arquivo CSV com as credenciais
   - Você verá:
     - **SMTP Username** (algo como: AKIAXXXXXXXXXXXXXXXX)
     - **SMTP Password** (algo como: XXXXXXXXXXXXXXXXXXXXXX)
   - **Guarde bem essas credenciais**, você não conseguirá vê-las novamente!

---

## 📋 Passo 5: Configurar no Supabase

1. Acesse: https://app.supabase.com/project/umbgtudgphbwpkeoebry/settings/auth
2. Role até **"SMTP Settings"**
3. Clique em **"Enable Custom SMTP"**
4. Preencha:

```
SMTP Host: email-smtp.us-east-1.amazonaws.com
SMTP Port: 587
SMTP Username: [seu SMTP username do CSV]
SMTP Password: [seu SMTP password do CSV]
Sender email: seuemail@dominio.com (ou o email verificado)
Sender name: Bíblia Interativa
```

5. Clique em **"Save"**

---

## 📋 Passo 6: Testar

### Teste rápido no Sandbox (enquanto aguarda aprovação)

1. Verifique seu email pessoal no SES (Passo 3A)
2. Configure o SMTP no Supabase (Passo 5)
3. Teste o signup com SEU email verificado: http://localhost:3000/auth/signup
4. Você deve receber o email de confirmação!

---

## 🔍 Troubleshooting

### Erro: "Email address not verified"
- Você está em Sandbox mode
- Precisa verificar o email destinatário no SES primeiro
- OU aguarde a aprovação do production access

### Erro: "Invalid SMTP credentials"
- Verifique se copiou corretamente username e password
- Confirme se está usando o servidor SMTP correto (us-east-1, sa-east-1, etc)

### Erro: "Timeout" ou "Connection refused"
- Verifique se a porta é **587** (TLS)
- Algumas redes corporativas bloqueiam porta 587

### Email não chega
- Verifique spam/lixo eletrônico
- Verifique os logs no AWS SES: **"Sending statistics"**
- Veja se o email foi rejeitado (bounce/complaint)

---

## 📊 Monitoramento

### Ver estatísticas de envio:
1. No SES, vá em **"Sending statistics"**
2. Você verá:
   - Emails enviados
   - Bounces (emails rejeitados)
   - Complaints (marcados como spam)

### Ver logs detalhados:
1. Vá em **"Suppression list"**
2. Verifique se algum email foi bloqueado

---

## 💰 Custos

### Free Tier (primeiro ano):
- 62.000 emails/mês GRÁTIS

### Após Free Tier:
- $0.10 por 1.000 emails enviados
- $0.12 por GB de anexos

Para um app como o seu: **praticamente grátis** 💰

---

## ✅ Checklist Final

- [ ] Conta AWS criada
- [ ] SES configurado (região selecionada)
- [ ] Production access solicitado (ou usando Sandbox)
- [ ] Email/domínio verificado
- [ ] Credenciais SMTP criadas e salvas
- [ ] SMTP configurado no Supabase
- [ ] Teste de envio realizado

---

## 🚀 Próximos passos após configurar

Depois de configurar o AWS SES:

1. Teste criar conta em: http://localhost:3000/auth/signup
2. Você deve receber o email de confirmação
3. Clique no link e será redirecionado para `/inicio`
4. Sucesso! 🎉

---

## 🆘 Precisa de ajuda?

Me avise se:
- Tiver dúvidas em algum passo
- Encontrar algum erro
- Precisar de ajuda para configurar DNS (se escolher verificar domínio)

Boa sorte! 🚀
