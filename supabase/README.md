# Sincronização com Supabase

## 🚀 Configuração Inicial

### 1. Executar Schema SQL

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto `umbgtudgphbwpkeoebry`
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Cole o conteúdo do arquivo `supabase/schema.sql`
6. Clique em **Run** (▶️)

### 2. Verificar Tabelas Criadas

Vá em **Table Editor** e verifique se foram criadas:
- ✅ `profiles` - Perfis de usuários
- ✅ `reading_progress` - Progresso de leitura
- ✅ `reading_stats` - Estatísticas
- ✅ `verse_notes` - Notas e marcações
- ✅ `reading_preferences` - Preferências

### 3. Configurar Auth

1. Vá em **Authentication** → **URL Configuration**
2. Configure o **Site URL**: `https://biblia-interativa.vercel.app`
3. Adicione em **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://biblia-interativa.vercel.app/auth/callback`

## 📊 Estrutura do Banco de Dados

### Tabela: `profiles`
```sql
- id (UUID) - Primary Key, referencia auth.users
- full_name (TEXT)
- avatar_url (TEXT)
- created_at, updated_at
```

### Tabela: `reading_progress`
```sql
- id (UUID)
- user_id (UUID) - Foreign Key
- book_code (TEXT) - Ex: 'GEN', 'JHN'
- chapter_number (INTEGER)
- verse_number (INTEGER)
- bible_version (TEXT) - Ex: 'NVI', 'ACF'
- last_read_at (TIMESTAMP)
```

### Tabela: `reading_stats`
```sql
- user_id (UUID)
- total_verses_read (INTEGER)
- total_chapters_read (INTEGER)
- total_books_read (INTEGER)
- total_reading_time_minutes (INTEGER)
- current_streak_days (INTEGER)
- longest_streak_days (INTEGER)
- last_read_date (DATE)
```

### Tabela: `verse_notes`
```sql
- id (UUID)
- user_id (UUID)
- book_code, chapter_number, verse_number
- bible_version (TEXT)
- note_text (TEXT)
- is_favorite (BOOLEAN)
- color_tag (TEXT)
```

### Tabela: `reading_preferences`
```sql
- user_id (UUID)
- dominant_language (TEXT)
- bible_version (TEXT)
- practice_language (TEXT)
- reader_font_size (TEXT)
- subtitle_enabled (BOOLEAN)
- subtitle_font_size (TEXT)
```

## 🔐 Segurança (RLS)

Todas as tabelas têm **Row Level Security (RLS)** ativado:
- Usuários só podem ver/editar seus próprios dados
- Autenticação automática via `auth.uid()`

## 🔄 Triggers Automáticos

1. **Criar Perfil**: Ao cadastrar novo usuário, cria automaticamente:
   - Registro em `profiles`
   - Registro em `reading_stats`

2. **Updated At**: Atualiza automaticamente `updated_at` em todas as tabelas

## 📝 Próximos Passos

1. Execute o schema SQL no Supabase
2. Configure as URLs de autenticação
3. Teste o cadastro de um usuário
4. Verifique se perfil foi criado automaticamente
5. Deploy na Vercel com as variáveis de ambiente

## 🧪 Testar Conexão

Execute no SQL Editor:
```sql
SELECT * FROM public.profiles;
SELECT * FROM public.reading_stats;
```

Se retornar vazio (sem erros), está funcionando! ✅
