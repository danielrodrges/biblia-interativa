# Guia de Integração - Versões da Bíblia

## Versões Disponíveis no App

O app agora suporta as **5 principais versões da Bíblia em Português do Brasil**:

1. **NVI** - Nova Versão Internacional (2000)
2. **ARA** - Almeida Revista e Atualizada (1993)
3. **ARC** - Almeida Revista e Corrigida (1995)
4. **NTLH** - Nova Tradução na Linguagem de Hoje (2000)
5. **NAA** - Nova Almeida Atualizada (2017)

## APIs Recomendadas para Obter os Textos

### 1. API da Bíblia (bible-api.com)
```bash
# Gratuita e open source
GET https://www.abibliadigital.com.br/api/verses/nvi/joão/3/16

# Exemplo de resposta
{
  "book": "João",
  "chapter": 3,
  "number": 16,
  "text": "Porque Deus amou o mundo de tal maneira..."
}
```

**Versões disponíveis:**
- `nvi` - Nova Versão Internacional
- `acf` - Almeida Corrigida Fiel
- `aa` - Almeida Atualizada

### 2. API Bíblia Online (api.scripture.api.bible)
```bash
# Requer API Key (gratuita)
GET https://api.scripture.api.bible/v1/bibles/{bibleId}/verses/{verseId}

# Bible IDs para português:
# - de4e12af7f28f599-02 (ARC)
# - 06125adad2d5898a-01 (ARA)
```

**Documentação:** https://scripture.api.bible/

### 3. Bolls Life API
```bash
# Gratuita
GET https://bolls.life/get-chapter/NVI/João/3/

# Retorna capítulo completo
```

### 4. Implementação Própria

Para ter controle total, você pode:

1. **Fazer download dos textos** das versões públicas
2. **Armazenar no Supabase** em uma tabela estruturada:

```sql
CREATE TABLE bible_verses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version_id TEXT NOT NULL, -- 'NVI', 'ARA', etc.
  book_name TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(version_id, book_name, chapter, verse)
);

-- Índices para performance
CREATE INDEX idx_verses_version ON bible_verses(version_id);
CREATE INDEX idx_verses_book ON bible_verses(book_name);
CREATE INDEX idx_verses_chapter ON bible_verses(chapter);
```

## Como Integrar no App

### Passo 1: Criar Serviço de API

```typescript
// src/lib/bible-api.ts
import { BibleVersionData } from './types';

export async function fetchVerse(
  version: string,
  book: string,
  chapter: number,
  verse: number
): Promise<string> {
  // Implementar chamada à API escolhida
  const response = await fetch(
    `https://www.abibliadigital.com.br/api/verses/${version.toLowerCase()}/${book}/${chapter}/${verse}`
  );
  
  const data = await response.json();
  return data.text;
}

export async function fetchChapter(
  version: string,
  book: string,
  chapter: number
): Promise<Verse[]> {
  // Retorna capítulo completo
  const response = await fetch(
    `https://bolls.life/get-chapter/${version}/${book}/${chapter}/`
  );
  
  return await response.json();
}
```

### Passo 2: Atualizar Componentes

Os componentes já estão preparados para usar as versões:
- `src/lib/bible-versions.ts` - Lista de versões
- `src/lib/data.ts` - Dados mockados
- `src/components/custom/bible-version-selector.tsx` - Seletor de versões

### Passo 3: Cache com Supabase

Para melhor performance, implemente cache:

```typescript
// Primeiro tenta buscar do cache
const cached = await supabase
  .from('bible_verses')
  .select('*')
  .eq('version_id', version)
  .eq('book_name', book)
  .eq('chapter', chapter)
  .single();

if (cached.data) {
  return cached.data.text;
}

// Se não encontrar, busca da API e salva no cache
const text = await fetchFromExternalAPI();
await supabase.from('bible_verses').insert({ ... });
```

## Considerações de Direitos Autorais

⚠️ **Importante:**

- **NVI**: Requer permissão da Sociedade Bíblica Internacional
- **ARA/ARC**: Domínio público no Brasil
- **NTLH**: Requer permissão da SBB
- **NAA**: Requer permissão da SBB

Para uso comercial, consulte as Sociedades Bíblicas.

## Próximos Passos

1. ✅ Versões adicionadas ao app
2. ⏳ Escolher API ou implementação própria
3. ⏳ Implementar serviço de busca de versículos
4. ⏳ Adicionar cache no Supabase
5. ⏳ Obter permissões necessárias

## Recursos Úteis

- [A Bíblia Digital API](https://www.abibliadigital.com.br/)
- [Scripture API](https://scripture.api.bible/)
- [Sociedade Bíblica do Brasil](https://www.sbb.org.br/)
- [Bolls Life](https://bolls.life/)
