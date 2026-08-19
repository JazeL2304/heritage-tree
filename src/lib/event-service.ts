import { supabase, isSupabaseConfigured } from './supabase';
import { FamilyEvent } from '@/components/events/EventsView';

const STORAGE_KEY = 'heritage_tree_family_events';

export async function loadEvents(): Promise<FamilyEvent[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('family_events')
        .select('*')
        .order('date', { ascending: true });

      if (!error && data) {
        const loaded: FamilyEvent[] = data.map((row: any) => ({
          id: row.id,
          title: row.title,
          type: row.type || 'meeting',
          date: row.date || '',
          time: row.time || '',
          location: row.location || '',
          description: row.description || '',
          organizer: row.organizer || '',
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
        return loaded;
      }
    } catch (err) {
      console.warn('Failed to load events from Supabase:', err);
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

export async function saveEvent(event: FamilyEvent): Promise<void> {
  try {
    const cached = await loadEvents();
    const updated = [event, ...cached.filter((e) => e.id !== event.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  if (isSupabaseConfigured) {
    try {
      await supabase.from('family_events').upsert({
        id: event.id,
        title: event.title,
        type: event.type,
        date: event.date || null,
        time: event.time || null,
        location: event.location,
        description: event.description,
        organizer: event.organizer,
      });
    } catch (err) {
      console.error('Failed to save event to Supabase:', err);
    }
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    const cached = await loadEvents();
    const updated = cached.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  if (isSupabaseConfigured) {
    try {
      await supabase.from('family_events').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to delete event from Supabase:', err);
    }
  }
}
