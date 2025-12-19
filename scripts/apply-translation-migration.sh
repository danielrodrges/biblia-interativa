#!/bin/bash

echo "🗄️ Aplicando migration de cache de traduções..."
echo ""

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não encontrado"
    echo "📦 Instalando Supabase CLI..."
    npm install -g supabase
fi

# Verificar se está logado
echo "🔐 Verificando autenticação..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Não autenticado no Supabase"
    echo "🔑 Execute: supabase login"
    exit 1
fi

# Aplicar migration
echo "📤 Aplicando migration..."
supabase db push

echo ""
echo "✅ Migration aplicada com sucesso!"
echo ""
echo "📊 Verifique a tabela no dashboard Supabase:"
echo "   https://supabase.com/dashboard/project/_/editor"
echo ""
echo "🔍 Testar com SQL:"
echo "   SELECT * FROM translations_cache LIMIT 5;"
