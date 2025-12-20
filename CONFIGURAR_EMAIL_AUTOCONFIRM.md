# 🚀 Desabilitar Confirmação de Email Obrigatória

## Passo a Passo Rápido

### 1. Acessar Configurações de Email

1. Acesse: https://supabase.com/dashboard/project/umbgtudgphbwpkeoebry/auth/providers
2. Clique em **"Email"** na lista de providers

### 2. Desabilitar Confirmação de Email

Procure pela opção:
- **"Confirm email"** ou **"Enable email confirmations"**

**Desative essa opção!** (toggle para OFF/desativado)

### 3. Salvar Alterações

Clique em **"Save"** no final da página

---

## ✅ Resultado

Após essa configuração:
- ✅ Usuários podem fazer login **imediatamente** após cadastro
- ✅ Não precisam clicar em link de confirmação
- ✅ Não precisam verificar email
- ✅ Cadastro mais rápido e menos fricção

---

## ⚠️ Importante

**Desvantagem de desabilitar confirmação:**
- Usuários podem se cadastrar com emails falsos
- Você não terá certeza que o email é válido
- Pode aumentar spam/contas falsas

**Recomendação:**
- Para app em produção, mantenha confirmação ativa
- Para testes/desenvolvimento, pode desabilitar

---

## 🔗 URL Direta

Acesse direto as configurações:
https://supabase.com/dashboard/project/umbgtudgphbwpkeoebry/settings/auth

Procure por:
- **Email Auth Settings**
- **Confirm email** → Desative
- **Save**
