const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabase = createClient(
  'https://bintjjzqkfpssznmqwrs.supabase.co',
  'sb_publishable_BHEske8vUTa6HPgJWvvQIQ_X5arSzYG'
);

const members = [
  {
    id: 'm_jastin',
    surname: 'Lim',
    given_name: 'Jastin',
    gender: 'male',
    birth_date: '2004-04-23',
    is_deceased: false,
    generation: 2,
    is_verified: true,
    father_id: 'm_roni',
    mother_id: 'm_imelda',
    spouse_id: null
  },
  {
    id: 'm_imelda',
    surname: 'Lim',
    given_name: 'Imelda',
    gender: 'female',
    birth_date: '1977-08-30',
    is_deceased: false,
    generation: 1,
    is_verified: true,
    father_id: null,
    mother_id: null,
    spouse_id: 'm_roni'
  },
  {
    id: 'm_roni',
    surname: 'Lim',
    given_name: 'Roni',
    gender: 'male',
    birth_date: '1975-01-01',
    is_deceased: false,
    generation: 1,
    is_verified: true,
    father_id: null,
    mother_id: null,
    spouse_id: 'm_imelda'
  },
  {
    id: 'm_jason',
    surname: 'Lim',
    given_name: 'Jason',
    gender: 'male',
    birth_date: '2008-01-01',
    is_deceased: false,
    generation: 2,
    is_verified: true,
    father_id: 'm_roni',
    mother_id: 'm_imelda',
    spouse_id: null
  },
  {
    id: 'm_jasjsajs',
    surname: 'Lim',
    given_name: 'jasjsajs',
    gender: 'female',
    birth_date: '2010-01-01',
    is_deceased: false,
    generation: 2,
    is_verified: true,
    father_id: 'm_roni',
    mother_id: 'm_imelda',
    spouse_id: null
  }
];

async function seed() {
  console.log('Inserting members into Supabase...');
  const { data, error } = await supabase
    .from('family_members')
    .upsert(members, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('UPSERT ERROR:', error);
  } else {
    console.log('SUCCESS! INSERTED MEMBERS:', data);
  }
}

seed();
