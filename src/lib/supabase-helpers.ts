import { supabase, isSupabaseConfigured } from './supabase';

export interface ReadingProgress {
  book_code: string;
  chapter_number: number;
  verse_number?: number;
  bible_version: string;
  last_read_at?: string;
}

export interface ReadingStats {
  total_verses_read: number;
  total_chapters_read: number;
  total_books_read: number;
  total_reading_time_minutes: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_read_date?: string;
}

export interface VerseNote {
  book_code: string;
  chapter_number: number;
  verse_number: number;
  bible_version: string;
  note_text?: string;
  is_favorite?: boolean;
  color_tag?: string;
}

/**
 * Salva ou atualiza o progresso de leitura do usuário
 */
export async function saveReadingProgress(progress: ReadingProgress) {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase não configurado - progresso salvo apenas localmente');
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: user.id,
      ...progress,
      last_read_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar progresso:', error);
    return null;
  }

  return data;
}

/**
 * Busca o último progresso de leitura do usuário
 */
export async function getLastReadingProgress() {
  if (!isSupabaseConfigured() || !supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', user.id)
    .order('last_read_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Erro ao buscar progresso:', error);
    return null;
  }

  return data;
}

/**
 * Atualiza as estatísticas de leitura do usuário
 */
export async function updateReadingStats(stats: Partial<ReadingStats>) {
  if (!isSupabaseConfigured() || !supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Busca stats atuais
  const { data: currentStats } = await supabase
    .from('reading_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data, error } = await supabase
    .from('reading_stats')
    .upsert({
      user_id: user.id,
      total_verses_read: stats.total_verses_read ?? currentStats?.total_verses_read ?? 0,
      total_chapters_read: stats.total_chapters_read ?? currentStats?.total_chapters_read ?? 0,
      total_books_read: stats.total_books_read ?? currentStats?.total_books_read ?? 0,
      total_reading_time_minutes: stats.total_reading_time_minutes ?? currentStats?.total_reading_time_minutes ?? 0,
      current_streak_days: stats.current_streak_days ?? currentStats?.current_streak_days ?? 0,
      longest_streak_days: stats.longest_streak_days ?? currentStats?.longest_streak_days ?? 0,
      last_read_date: stats.last_read_date ?? new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar estatísticas:', error);
    return null;
  }

  return data;
}

/**
 * Busca as estatísticas de leitura do usuário
 */
export async function getReadingStats(): Promise<ReadingStats | null> {
  if (!isSupabaseConfigured() || !supabase) {
    // Retorna stats vazias se Supabase não configurado
    return {
      total_verses_read: 0,
      total_chapters_read: 0,
      total_books_read: 0,
      total_reading_time_minutes: 0,
      current_streak_days: 0,
      longest_streak_days: 0,
    };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('reading_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return null;
  }

  return data;
}

/**
 * Salva uma nota/marcação em um versículo
 */
export async function saveVerseNote(note: VerseNote) {
  if (!isSupabaseConfigured() || !supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('verse_notes')
    .insert({
      user_id: user.id,
      ...note,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar nota:', error);
    return null;
  }

  return data;
}

/**
 * Busca todas as notas do usuário
 */
export async function getAllVerseNotes() {
  if (!isSupabaseConfigured() || !supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('verse_notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar notas:', error);
    return [];
  }

  return data || [];
}

/**
 * Busca versículos favoritos
 */
export async function getFavoriteVerses() {
  if (!isSupabaseConfigured() || !supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('verse_notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar favoritos:', error);
    return [];
  }

  return data || [];
}

/**
 * Salva preferências de leitura no Supabase
 */
export async function saveReadingPreferencesToSupabase(preferences: {
  dominant_language: string;
  bible_version: string;
  practice_language: string;
  reader_font_size?: string;
  subtitle_enabled?: boolean;
  subtitle_font_size?: string;
}) {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase não configurado - preferências salvas apenas localmente');
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('reading_preferences')
    .upsert({
      user_id: user.id,
      ...preferences,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar preferências:', error);
    return null;
  }

  return data;
}

/**
 * Busca preferências de leitura do Supabase
 */
export async function getReadingPreferencesFromSupabase() {
  if (!isSupabaseConfigured() || !supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('reading_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Erro ao buscar preferências:', error);
    return null;
  }

  return data;
}
