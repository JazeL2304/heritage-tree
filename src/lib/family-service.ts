import { supabase, isSupabaseConfigured } from './supabase';
import { FamilyMember } from '@/types/family';

const STORAGE_KEY = 'heritage_tree_family_members';

/**
 * Format partial date string (e.g. '1977' or '1977-08') into valid Postgres DATE string ('YYYY-MM-DD')
 */
export function formatDateForPostgres(dateStr?: string): string | null {
  if (!dateStr || !dateStr.trim()) return null;
  const parts = dateStr.trim().split('-');
  if (parts.length === 1 && parts[0].length === 4) {
    return `${parts[0]}-01-01`;
  }
  if (parts.length === 2 && parts[0].length === 4 && parts[1].length === 2) {
    return `${parts[0]}-${parts[1]}-01`;
  }
  if (parts.length === 3 && parts[0].length === 4) {
    return dateStr;
  }
  return null;
}

/**
 * Convert DB snake_case row to FamilyMember camelCase object
 */
export function mapRowToMember(row: any): FamilyMember {
  return {
    id: row.id,
    surname: row.surname || '',
    givenName: row.given_name || 'Nama Anggota',
    gender: row.gender || 'male',
    birthDate: row.birth_date || '',
    deathDate: row.death_date || '',
    isDeceased: row.is_deceased ?? false,
    photoUrl: row.photo_url || '',
    notes: row.notes || '',
    generation: row.generation ?? 1,
    isVerified: row.is_verified ?? true,
    fatherId: row.father_id || undefined,
    motherId: row.mother_id || undefined,
    spouseId: row.spouse_id || undefined,
  };
}

/**
 * Convert FamilyMember camelCase object to DB snake_case row
 */
export function mapMemberToRow(member: FamilyMember) {
  return {
    id: member.id,
    surname: member.surname || '',
    given_name: member.givenName || 'Nama Anggota',
    gender: member.gender || 'male',
    birth_date: formatDateForPostgres(member.birthDate),
    death_date: formatDateForPostgres(member.deathDate),
    is_deceased: member.isDeceased ?? false,
    photo_url: member.photoUrl || null,
    notes: member.notes || null,
    generation: member.generation ?? 1,
    is_verified: member.isVerified ?? true,
    father_id: member.fatherId || null,
    mother_id: member.motherId || null,
    spouse_id: member.spouseId || null,
  };
}

/**
 * Load members from Supabase if configured, otherwise fallback to localStorage
 */
export async function loadFamilyMembers(): Promise<FamilyMember[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        const loaded = data.map(mapRowToMember);
        // Sync to local storage as cache
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
        return loaded;
      } else if (error) {
        console.error('Supabase fetch error:', error);
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to localStorage:', err);
    }
  }

  // Fallback to localStorage
  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch {
      return [];
    }
  }

  return [];
}

/**
 * Save all members to localStorage and sync upsert to Supabase
 */
export async function syncMembers(members: FamilyMember[]): Promise<void> {
  // Always update localStorage immediately
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));

  if (isSupabaseConfigured && members.length > 0) {
    try {
      const rows = members.map(mapMemberToRow);
      await supabase.from('family_members').upsert(rows, { onConflict: 'id' });
    } catch (err) {
      console.error('Failed to sync members to Supabase:', err);
    }
  }
}

/**
 * Upsert a single member into Supabase
 */
export async function saveMember(member: FamilyMember): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      const row = mapMemberToRow(member);
      await supabase.from('family_members').upsert(row, { onConflict: 'id' });
    } catch (err) {
      console.error('Failed to save member to Supabase:', err);
    }
  }
}

/**
 * Delete a single member from Supabase
 */
export async function deleteMember(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('family_members').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to delete member from Supabase:', err);
    }
  }
}

/**
 * Clear all data from local storage and optionally Supabase
 */
export async function clearAllFamilyMembers(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  if (isSupabaseConfigured) {
    try {
      await supabase.from('family_members').delete().neq('id', '0');
    } catch (err) {
      console.error('Failed to clear Supabase table:', err);
    }
  }
}
