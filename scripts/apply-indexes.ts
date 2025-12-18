#!/usr/bin/env tsx
/**
 * Script para aplicar índices no banco de dados Supabase
 * Isso vai resolver a lentidão nas consultas (18s → <500ms)
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtYmd0dWRncGhid3BrZW9lYnJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDA0MzAyMCwiZXhwIjoyMDQ5NjE5MDIwfQ.UTeVhm5gI63AwrfWCGxL-fRYB_pZxGLQm_BZ7uvzGCM';

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL não encontrada');
  process.exit(1);
}

// Criar cliente Supabase com Service Role Key (necessário para executar SQL direto)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function applyIndexes() {
  console.log('🔧 Aplicando índices no banco de dados...\n');

  // Ler arquivo SQL
  const sqlPath = path.join(__dirname, 'add-database-indexes.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  // Separar comandos SQL (por ponto-e-vírgula)
  const commands = sql
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (const command of commands) {
    // Pular comentários de bloco
    if (command.includes('Script para adicionar') || command.includes('Verificar estatísticas')) {
      continue;
    }

    try {
      console.log(`📝 Executando: ${command.substring(0, 60)}...`);
      
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql_query: command 
      });

      if (error) {
        // Tentar usar query direto se RPC não funcionar
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceRoleKey,
            'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          },
          body: JSON.stringify({ sql_query: command })
        });

        if (!response.ok) {
          console.error(`   ❌ Erro: ${error.message}`);
          console.log(`   ℹ️  Tente executar manualmente no Supabase SQL Editor:`);
          console.log(`   ${command}\n`);
          errorCount++;
          continue;
        }
      }

      console.log(`   ✅ Sucesso!\n`);
      successCount++;

    } catch (err: any) {
      console.error(`   ❌ Exceção: ${err.message}\n`);
      errorCount++;
    }
  }

  console.log('\n📊 Resumo:');
  console.log(`   ✅ ${successCount} comandos executados`);
  console.log(`   ❌ ${errorCount} erros`);

  if (errorCount > 0) {
    console.log('\n⚠️  Alguns índices não foram criados automaticamente.');
    console.log('   Copie o conteúdo de add-database-indexes.sql e execute');
    console.log('   manualmente no Supabase SQL Editor.');
  } else {
    console.log('\n🎉 Todos os índices foram criados com sucesso!');
    console.log('   As consultas devem ser muito mais rápidas agora.');
  }
}

applyIndexes().catch(console.error);
