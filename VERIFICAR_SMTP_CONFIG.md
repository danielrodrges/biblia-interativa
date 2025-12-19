# ✅ CHECKLIST DE VERIFICAÇÃO - SMTP AWS SES NO SUPABASE

## 📋 Verificar Configuração SMTP no Supabase

Acesse: https://app.supabase.com/project/umbgtudgphbwpkeoebry/settings/auth

Role até **"SMTP Settings"** e confirme que está EXATAMENTE assim:

---

### ✅ CONFIGURAÇÃO CORRETA:

```
Enable Custom SMTP: ☑️ ATIVADO

Sender name: Bíblia Interativa

Sender email: [O EMAIL QUE VOCÊ VERIFICOU NO AWS SES]
Exemplo: seuemail@gmail.com
⚠️ DEVE ser o MESMO email que está "Verified" no AWS SES

Host: email-smtp.us-east-1.amazonaws.com
⚠️ Verifique se é exatamente esta região (us-east-1)
⚠️ Se você criou as credenciais em outra região, mude:
   - us-east-1 = N. Virginia
   - sa-east-1 = São Paulo
   - us-west-2 = Oregon

Port number: 587
⚠️ DEVE ser 587 (TLS)
⚠️ NÃO use 25, 465 ou 2587

Username: AKIAXXXXXXXXXXXXXXXX
⚠️ Deve começar com AKIA
⚠️ Tem exatamente 20 caracteres
⚠️ Vem do arquivo CSV que você baixou

Password: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
⚠️ Senha longa (40+ caracteres)
⚠️ Vem do arquivo CSV que você baixou
⚠️ Começa geralmente com letras e números misturados
```

---

## ❌ ERROS COMUNS:

### 1. Sender email DIFERENTE do verificado no AWS SES
**Problema**: Você colocou `contato@seudominio.com` mas verificou `danieldpaula98@hotmail.com`
**Solução**: Use o MESMO email em ambos os lugares

### 2. Região errada no Host
**Problema**: Host está como `email-smtp.us-west-2.amazonaws.com` mas você criou as credenciais em `us-east-1`
**Solução**: Use a região CORRETA onde criou as credenciais SMTP

### 3. Porta errada
**Problema**: Porta 465 ou 25
**Solução**: SEMPRE use porta 587

### 4. Username ou Password errados
**Problema**: Copiou errado do CSV ou colou com espaços extras
**Solução**: Baixe o CSV novamente e copie com cuidado

### 5. Credenciais de REGIÃO diferente
**Problema**: Criou credenciais em uma região mas está usando em outra
**Solução**: Use credenciais da mesma região do Host

---

## 🔍 COMO VERIFICAR NO AWS SES:

### Verificar SMTP Endpoint (Host):
1. Acesse: https://console.aws.amazon.com/ses/
2. Confirme a REGIÃO no canto superior direito
3. Menu lateral → **"SMTP settings"**
4. Veja o **"SMTP endpoint"** - exemplo: `email-smtp.us-east-1.amazonaws.com`
5. COPIE EXATAMENTE isso para o campo "Host" do Supabase

### Verificar Sender Email:
1. Menu lateral → **"Verified identities"**
2. Veja qual email tem status **"Verified" ✅**
3. Use EXATAMENTE esse email no campo "Sender email" do Supabase

### Verificar Credenciais:
1. Se não tem mais o CSV, crie novas credenciais:
2. Menu lateral → **"SMTP settings"**
3. Clique em **"Create SMTP credentials"**
4. Baixe o CSV e use essas novas credenciais

---

## 🧪 TESTE RÁPIDO:

Depois de corrigir as configurações no Supabase:

1. **Salve as alterações** no Supabase
2. **Aguarde 30 segundos** para aplicar
3. **Delete o usuário antigo** em: https://app.supabase.com/project/umbgtudgphbwpkeoebry/auth/users
4. **Tente criar conta novamente** no app
5. **Aguarde 2-3 minutos**
6. **Verifique o email**

---

## 📊 VERIFICAR LOGS DO SUPABASE:

https://app.supabase.com/project/umbgtudgphbwpkeoebry/logs/auth-logs

Procure por mensagens de erro como:
- `Invalid SMTP credentials`
- `Connection timeout`
- `MessageRejected`
- `Email address not verified`

---

## 🆘 SE AINDA NÃO FUNCIONAR:

Tire screenshots de:
1. Configuração SMTP no Supabase (censure a senha)
2. Verified identities no AWS SES
3. SMTP settings no AWS SES
4. Logs do Supabase mostrando o erro

E me envie para eu ver exatamente onde está o problema!
