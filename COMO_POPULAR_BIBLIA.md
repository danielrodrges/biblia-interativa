# 🔐 Como Popular a Bíblia no Supabase

## ⚠️ Problema: RLS Bloqueando Inserções

O erro **"new row violates row-level security policy"** acontece porque:

- A tabela `bible_verses` tem **RLS (Row Level Security)** ativado
- O script está usando a **Anon Key** que só permite leitura pública
- Para inserir dados, precisamos da **Service Role Key** que bypassa o RLS

## ✅ Solução: Usar Service Role Key

### Passo 1: Buscar a Service Role Key

1. Acesse o painel do Supabase: https://supabase.com/dashboard/project/umbgtudgphbwpkeoebry/settings/api
2. Na seção "Project API keys", copie a **`service_role`** key (não a `anon` key!)
3. ⚠️ **ATENÇÃO**: Esta chave tem permissões de admin - NUNCA a exponha no frontend!

### Passo 2: Atualizar o Script

Abra o arquivo `scripts/populate-bible-from-json.ts` e cole a Service Role Key:

```typescript
// Linha 6 do arquivo
const supabaseServiceRoleKey = 'COLE_AQUI_A_SERVICE_ROLE_KEY'
```

### Passo 3: Executar o Script

```bash
cd /workspaces/biblia-interativa
npx tsx scripts/populate-bible-from-json.ts
```

O script irá:
- ✅ Baixar os 3 JSONs completos (NVI, ACF, AA)  
- ✅ Processar todos os 66 livros da Bíblia
- ✅ Inserir ~31.000 versículos por versão
- ✅ Total: ~93.000 versículos

## 🔒 Segurança

**Após popular**, remova a Service Role Key do arquivo:

```bash
# Limpar a chave do arquivo
sed -i 's/eyJhbGciOi.*$/REMOVIDA_POR_SEGURANCA/' scripts/populate-bible-from-json.ts
```

## 🎯 Status Atual

- ✅ Migrações aplicadas  
- ✅ Tabelas criadas
- ✅ Versões configuradas (NVI, ACF, AA, KJV, NIV, RVR60)
- ⏳ Aguardando população dos versículos

## 🚀 Alternativa: Popular via Dashboard

Se preferir, você pode:

1. Desabilitar RLS temporariamente no dashboard
2. Rodar o script com a anon key
3. Reabilitar RLS

```sql
-- No SQL Editor do Supabase
ALTER TABLE bible_verses DISABLE ROW LEVEL SECURITY;

-- Após popular
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
```

## 📊 Verificar População

Após popular, verifique no Supabase:

```sql
SELECT 
  version_id,
  COUNT(*) as total_verses,
  COUNT(DISTINCT book_id) as books,
  MIN(text) as sample
FROM bible_verses
GROUP BY version_id;
```

Resultado esperado:
- NVI: ~31.102 versículos, 66 livros
- ACF: ~31.102 versículos, 66 livros  
- AA: ~31.102 versículos, 66 livros
