/**
 * Cache simples em memória para capítulos bíblicos
 * Evita requisições duplicadas ao Supabase
 */

interface BibleChapter {
  book: string;
  bookName: string;
  chapter: number;
  version: string;
  verses: { number: number; text: string }[];
}

interface CacheEntry {
  data: BibleChapter;
  timestamp: number;
}

class BibleCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutos

  private generateKey(book: string, chapter: number, version: string): string {
    return `${version}:${book}:${chapter}`;
  }

  get(book: string, chapter: number, version: string): BibleChapter | null {
    const key = this.generateKey(book, chapter, version);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    console.log(`💾 Cache HIT: ${key}`);
    return entry.data;
  }

  set(book: string, chapter: number, version: string, data: BibleChapter): void {
    const key = this.generateKey(book, chapter, version);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    console.log(`💾 Cache SET: ${key} (${this.cache.size} itens no cache)`);
  }

  clear(): void {
    this.cache.clear();
    console.log('💾 Cache limpo');
  }

  size(): number {
    return this.cache.size;
  }
}

// Singleton
export const bibleCache = new BibleCache();
