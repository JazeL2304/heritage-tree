const { createClient } = require('./node_modules/@supabase/supabase-js');

const supabase = createClient(
  'https://bintjjzqkfpssznmqwrs.supabase.co',
  'sb_publishable_BHEske8vUTa6HPgJWvvQIQ_X5arSzYG'
);

async function setup() {
  console.log('Testing access to family_archives and family_events...');
  
  // Test query
  const { error: errArch } = await supabase.from('family_archives').select('*').limit(1);
  console.log('family_archives check:', errArch ? errArch.message : 'Table OK!');

  const { error: errEvt } = await supabase.from('family_events').select('*').limit(1);
  console.log('family_events check:', errEvt ? errEvt.message : 'Table OK!');
}

setup();
