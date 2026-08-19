import { supabase, isSupabaseConfigured } from './supabase';
import { ArchivalItem } from '@/components/archive/ArchiveView';

const STORAGE_KEY = 'heritage_tree_family_archives';

export async function loadArchives(): Promise<ArchivalItem[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('family_archives')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const loaded: ArchivalItem[] = data.map((row: any) => ({
          id: row.id,
          title: row.title,
          category: row.category || 'photos',
          date: row.date || '',
          description: row.description || '',
          imageUrl: row.image_url || '',
          taggedMembers: row.tagged_members ? row.tagged_members.split(',') : [],
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
        return loaded;
      }
    } catch (err) {
      console.warn('Failed to load archives from Supabase:', err);
    }
  }

  // Fallback to localStorage
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

export async function saveArchive(item: ArchivalItem): Promise<void> {
  try {
    const cached = await loadArchives();
    const updated = [item, ...cached.filter((i) => i.id !== item.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  if (isSupabaseConfigured) {
    try {
      await supabase.from('family_archives').upsert({
        id: item.id,
        title: item.title,
        category: item.category,
        date: item.date || null,
        description: item.description,
        image_url: item.imageUrl,
        tagged_members: item.taggedMembers ? item.taggedMembers.join(',') : '',
      });
    } catch (err) {
      console.error('Failed to save archive to Supabase:', err);
    }
  }
}

export async function deleteArchive(id: string): Promise<void> {
  try {
    const cached = await loadArchives();
    const updated = cached.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  if (isSupabaseConfigured) {
    try {
      await supabase.from('family_archives').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to delete archive from Supabase:', err);
    }
  }
}
