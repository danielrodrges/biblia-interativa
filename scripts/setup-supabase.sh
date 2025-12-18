#!/bin/bash

# Script para configurar Supabase automaticamente
# Uso: ./scripts/setup-supabase.sh <SUPABASE_SERVICE_ROLE_KEY>

set -e

SUPABASE_URL="https://umbgtudgphbwpkeoebry.supabase.co"
SERVICE_ROLE_KEY="$1"

if [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "❌ Erro: Service Role Key não fornecida"
  echo ""
  echo "📝 Como usar:"
  echo "   ./scripts/setup-supabase.sh <SUA_SERVICE_ROLE_KEY>"
  echo ""
  echo "🔑 Para obter a Service Role Key:"
  echo "   1. Acesse: https://app.supabase.com/project/umbgtudgphbwpkeoebry/settings/api"
  echo "   2. Copie a 'service_role' key (NÃO a anon key)"
  echo "   3. Execute: ./scripts/setup-supabase.sh <KEY_COPIADA>"
  exit 1
fi

echo "🚀 Configurando Supabase..."
echo ""

# Executar schema SQL
echo "📊 Executando schema SQL..."
SQL_CONTENT=$(cat supabase/schema.sql)

curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(jq -Rs . <<< "$SQL_CONTENT")}" \
  2>&1

echo ""
echo "✅ Schema executado com sucesso!"
echo ""
echo "🔐 Próximos passos:"
echo "   1. Acesse: https://app.supabase.com/project/umbgtudgphbwpkeoebry"
echo "   2. Vá em 'Authentication' > 'URL Configuration'"
echo "   3. Configure:"
echo "      Site URL: https://biblia-interativa-wine.vercel.app"
echo "      Redirect URLs:"
echo "        - http://localhost:3000/auth/callback"
echo "        - https://biblia-interativa-wine.vercel.app/auth/callback"
echo ""
echo "✨ Configuração concluída!"
