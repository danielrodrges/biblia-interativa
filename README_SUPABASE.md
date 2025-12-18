# 📖 Bíblia Interativa - Documentação do Banco de Dados Supabase

## 📋 Visão Geral

Este documento descreve a estrutura do banco de dados Supabase utilizado na aplicação Bíblia Interativa. O banco armazena versões da Bíblia, versículos, notas de usuários, preferências e progresso de leitura.

## 🗃️ Estrutura do Banco de Dados

### Tabelas Principais

#### 1. `bible_versions`
Armazena as diferentes versões/traduções da Bíblia disponíveis.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `version_id` | TEXT (PK) | Identificador único (ex: NVI, KJV) |
| `language_code` | TEXT | Código do idioma (ex: pt-BR, en-US) |
| `version_name` | TEXT | Nome completo da versão |
| `abbreviation` | TEXT | Abreviação |
| `description` | TEXT | Descrição da versão |
| `created_at` | TIMESTAMP | Data de criação |

**Exemplo:**
```sql
SELECT * FROM bible_versions WHERE language_code = 'pt-BR';
```

#### 2. `bible_verses`
Armazena todos os versículos da Bíblia em diferentes versões.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | BIGINT (PK) | ID único gerado automaticamente |
| `book_id` | TEXT | Código do livro (ex: GEN, JOH) |
| `chapter` | INTEGER | Número do capítulo |
| `verse_number` | INTEGER | Número do versículo |
| `text` | TEXT | Texto do versículo |
| `language_code` | TEXT | Código do idioma |
| `version_id` | TEXT (FK) | Referência a bible_versions |
| `created_at` | TIMESTAMP | Data de criação |

**Índices:**
- `idx_verses_book_chapter`: (book_id, chapter, verse_number)
- `idx_verses_version_book`: (version_id, book_id, chapter)
- `idx_verses_language`: (language_code)

**Exemplo:**
```sql
-- Buscar versículos de um capítulo
SELECT * FROM bible_verses 
WHERE version_id = 'NVI' 
  AND book_id = 'JOH' 
  AND chapter = 1
ORDER BY verse_number;
```

#### 3. `verse_notes`
Armazena notas, favoritos e destaques dos usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | BIGINT (PK) | ID único |
| `user_id` | UUID (FK) | Referência ao usuário |
| `book_id` | TEXT | Código do livro |
| `chapter` | INTEGER | Número do capítulo |
| `verse_number` | INTEGER | Número do versículo |
| `note` | TEXT | Texto da nota |
| `is_favorite` | BOOLEAN | Versículo favorito |
| `highlight_color` | TEXT | Cor do destaque |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Última atualização |

**Exemplo:**
```sql
-- Buscar favoritos do usuário
SELECT * FROM verse_notes 
WHERE user_id = auth.uid() 
  AND is_favorite = TRUE;
```

#### 4. `reading_preferences`
Armazena preferências de leitura dos usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | BIGINT (PK) | ID único |
| `user_id` | UUID (FK, UNIQUE) | Referência ao usuário |
| `dominant_language` | TEXT | Idioma principal |
| `bible_version` | TEXT | Versão preferida |
| `practice_language` | TEXT | Idioma de prática |
| `reader_font_size` | TEXT | Tamanho da fonte (small/medium/large) |
| `subtitle_enabled` | BOOLEAN | Legenda habilitada |
| `subtitle_font_size` | TEXT | Tamanho da legenda |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Última atualização |

#### 5. `reading_progress`
Rastreia o progresso de leitura dos usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | BIGINT (PK) | ID único |
| `user_id` | UUID (FK) | Referência ao usuário |
| `book_id` | TEXT | Código do livro |
| `chapter` | INTEGER | Número do capítulo |
| `completed` | BOOLEAN | Capítulo completado |
| `reading_time_minutes` | INTEGER | Tempo de leitura em minutos |
| `completed_at` | TIMESTAMP | Data de conclusão |
| `created_at` | TIMESTAMP | Data de criação |

**Constraint UNIQUE:** (user_id, book_id, chapter)

## 🔒 Row Level Security (RLS)

Todas as tabelas têm RLS habilitado para garantir segurança dos dados.

### Políticas de Acesso

#### Tabelas Públicas (Leitura)
- ✅ `bible_versions`: Acesso público para SELECT
- ✅ `bible_verses`: Acesso público para SELECT

#### Tabelas Privadas (Apenas Usuário Autenticado)
- 🔐 `verse_notes`: Usuários veem apenas suas próprias notas
- 🔐 `reading_preferences`: Usuários veem apenas suas preferências
- 🔐 `reading_progress`: Usuários veem apenas seu progresso

**Exemplo de Política:**
```sql
CREATE POLICY "Usuários podem ver suas próprias notas"
  ON verse_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

## ⚡ Funções Auxiliares

### `update_updated_at_column()`
Atualiza automaticamente o campo `updated_at` quando um registro é modificado.

**Uso:** Trigger automático em verse_notes e reading_preferences

### `get_user_reading_stats(user_uuid UUID)`
Retorna estatísticas de leitura do usuário.

**Retorna:**
- `total_reading_time`: Tempo total em minutos
- `total_chapters_completed`: Capítulos completados
- `current_streak`: Dias consecutivos de leitura
- `last_read_date`: Data da última leitura

**Exemplo:**
```sql
SELECT * FROM get_user_reading_stats(auth.uid());
```

### `complete_chapter(user_uuid, book, chapter, time_spent)`
Marca um capítulo como completo e registra o tempo.

**Exemplo:**
```sql
SELECT complete_chapter(
  auth.uid(), 
  'JOH', 
  1, 
  15  -- 15 minutos
);
```

### `get_chapter_verses(version, book, chapter)`
Retorna todos os versículos de um capítulo.

**Exemplo:**
```sql
SELECT * FROM get_chapter_verses('NVI', 'JOH', 1);
```

### `search_verses(search_text, version, max_results)`
Busca versículos por texto usando full-text search.

**Exemplo:**
```sql
SELECT * FROM search_verses('amor', 'NVI', 20);
```

## 🚀 Como Executar as Migrations

### 1. Via Supabase Dashboard

1. Acesse: https://app.supabase.com/project/[seu-project-id]/sql
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Cole o conteúdo de cada arquivo na ordem:
   - `20250101000001_create_base_tables.sql`
   - `20250101000002_seed_bible_versions.sql`
   - `20250101000003_seed_bible_data_john.sql`
   - `20250101000004_create_functions.sql`
5. Clique em **Run** para cada arquivo

### 2. Via Supabase CLI

```bash
# Login no Supabase
supabase login

# Link ao projeto
supabase link --project-ref [seu-project-id]

# Executar migrations
supabase db push
```

## 📊 Queries Úteis

### Buscar Versículos de um Capítulo (Bilíngue)
```sql
SELECT 
  v1.verse_number,
  v1.text AS portuguese,
  v2.text AS english
FROM bible_verses v1
LEFT JOIN bible_verses v2 
  ON v1.book_id = v2.book_id 
  AND v1.chapter = v2.chapter
  AND v1.verse_number = v2.verse_number
  AND v2.version_id = 'KJV'
WHERE v1.version_id = 'NVI'
  AND v1.book_id = 'JOH'
  AND v1.chapter = 1
ORDER BY v1.verse_number;
```

### Estatísticas do Usuário
```sql
SELECT 
  COUNT(DISTINCT book_id || '-' || chapter) as chapters_read,
  SUM(reading_time_minutes) as total_minutes,
  COUNT(*) FILTER (WHERE completed = TRUE) as chapters_completed
FROM reading_progress
WHERE user_id = auth.uid();
```

### Versículos Favoritos
```sql
SELECT 
  vn.book_id,
  vn.chapter,
  vn.verse_number,
  bv.text,
  vn.note
FROM verse_notes vn
JOIN bible_verses bv 
  ON vn.book_id = bv.book_id
  AND vn.chapter = bv.chapter
  AND vn.verse_number = bv.verse_number
WHERE vn.user_id = auth.uid()
  AND vn.is_favorite = TRUE
  AND bv.version_id = 'NVI';
```

### Progresso de Leitura por Livro
```sql
SELECT 
  book_id,
  COUNT(*) as chapters_started,
  COUNT(*) FILTER (WHERE completed = TRUE) as chapters_completed,
  SUM(reading_time_minutes) as total_time
FROM reading_progress
WHERE user_id = auth.uid()
GROUP BY book_id
ORDER BY book_id;
```

## 📚 Como Adicionar Mais Livros da Bíblia

### Estrutura dos Códigos de Livros

Use os códigos padrão de 3 letras (ISO):

**Antigo Testamento:**
- GEN (Gênesis), EXO (Êxodo), LEV (Levítico), NUM (Números)
- DEU (Deuteronômio), JOS (Josué), JDG (Juízes), RUT (Rute)
- 1SA, 2SA, 1KI, 2KI, 1CH, 2CH, EZR, NEH, EST
- JOB, PSA, PRO, ECC, SNG, ISA, JER, LAM, EZK
- DAN, HOS, JOL, AMO, OBA, JON, MIC, NAM, HAB
- ZEP, HAG, ZEC, MAL

**Novo Testamento:**
- MAT, MRK, LUK, JOH, ACT, ROM, 1CO, 2CO, GAL
- EPH, PHP, COL, 1TH, 2TH, 1TI, 2TI, TIT, PHM
- HEB, JAS, 1PE, 2PE, 1JN, 2JN, 3JN, JUD, REV

### Exemplo de Inserção

```sql
-- Adicionar versículos de Gênesis 1
INSERT INTO public.bible_verses (book_id, chapter, verse_number, text, language_code, version_id)
VALUES 
  ('GEN', 1, 1, 'No princípio Deus criou os céus e a terra.', 'pt-BR', 'NVI'),
  ('GEN', 1, 2, 'Era a terra sem forma e vazia...', 'pt-BR', 'NVI')
ON CONFLICT (version_id, book_id, chapter, verse_number) DO NOTHING;
```

### Script para Importação em Massa

```sql
-- Copiar de CSV
COPY bible_verses(book_id, chapter, verse_number, text, language_code, version_id)
FROM '/path/to/verses.csv'
DELIMITER ','
CSV HEADER;
```

## 🔧 Manutenção

### Verificar Integridade dos Dados
```sql
-- Verificar versículos duplicados
SELECT version_id, book_id, chapter, verse_number, COUNT(*)
FROM bible_verses
GROUP BY version_id, book_id, chapter, verse_number
HAVING COUNT(*) > 1;

-- Verificar referências órfãs
SELECT DISTINCT version_id 
FROM bible_verses 
WHERE version_id NOT IN (SELECT version_id FROM bible_versions);
```

### Backup e Restore
```bash
# Backup
supabase db dump -f backup.sql

# Restore
supabase db reset
supabase db push
```

## 📖 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🤝 Contribuindo

Para adicionar novas versões da Bíblia ou livros:

1. Siga o padrão de códigos ISO
2. Mantenha a estrutura de versículos consistente
3. Adicione comentários explicativos no SQL
4. Teste as queries antes de fazer commit
5. Atualize este README com as mudanças

## 📝 Licença

Os textos bíblicos têm suas próprias licenças conforme a versão. Consulte os detentores dos direitos autorais de cada tradução antes de uso comercial.
