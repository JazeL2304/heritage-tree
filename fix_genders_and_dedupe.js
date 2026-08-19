const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabase = createClient(
  'https://bintjjzqkfpssznmqwrs.supabase.co',
  'sb_publishable_BHEske8vUTa6HPgJWvvQIQ_X5arSzYG'
);

async function fix() {
  console.log('1. Deleting all records...');
  await supabase.from('family_members').delete().neq('id', 'dummy_non_existent');

  console.log('2. Inserting clean, correct records...');
  const members = [
    {
      id: 'm_roni',
      surname: 'Lim',
      given_name: 'Roni',
      gender: 'male',
      birth_date: '1974-09-23',
      is_deceased: false,
      photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      generation: 1,
      is_verified: true,
      father_id: null,
      mother_id: null,
      spouse_id: 'm_imelda'
    },
    {
      id: 'm_imelda',
      surname: 'Potu',
      given_name: 'Imelda',
      gender: 'female',
      birth_date: '1977-08-30',
      is_deceased: false,
      photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      generation: 1,
      is_verified: true,
      father_id: null,
      mother_id: null,
      spouse_id: 'm_roni'
    },
    {
      id: 'm_jastin',
      surname: 'Lim',
      given_name: 'Jastin',
      gender: 'male',
      birth_date: '2004-04-23',
      is_deceased: false,
      photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      generation: 2,
      is_verified: true,
      father_id: 'm_roni',
      mother_id: 'm_imelda',
      spouse_id: null
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

  const { data, error } = await supabase.from('family_members').insert(members).select();
  if (error) {
    console.error('INSERT ERROR:', error);
  } else {
    console.log('SUCCESSFULLY FIXED SUPABASE RECORDS:', data);
  }
}

fix();
