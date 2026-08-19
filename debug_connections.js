const { calculateTreePositions } = require('./src/lib/tree-layout.ts');

// We will load members from Supabase to test exact layout output
const { createClient } = require('./node_modules/@supabase/supabase-js');
const supabase = createClient(
  'https://bintjjzqkfpssznmqwrs.supabase.co',
  'sb_publishable_BHEske8vUTa6HPgJWvvQIQ_X5arSzYG'
);

async function test() {
  const { data: rows } = await supabase.from('family_members').select('*');
  const members = rows.map(row => ({
    id: row.id,
    surname: row.surname || '',
    givenName: row.given_name || '',
    gender: row.gender || 'male',
    birthDate: row.birth_date,
    deathDate: row.death_date,
    isDeceased: row.is_deceased,
    photoUrl: row.photo_url,
    notes: row.notes,
    generation: row.generation || 1,
    isVerified: row.is_verified,
    fatherId: row.father_id,
    motherId: row.mother_id,
    spouseId: row.spouse_id
  }));

  console.log('MEMBERS:', members);
  const { positionedMembers, connections } = calculateTreePositions(members);
  console.log('POSITIONED:', positionedMembers.map(m => ({ id: m.id, givenName: m.givenName, x: m.x, y: m.y })));
  console.log('CONNECTIONS:', connections);
}

test();
