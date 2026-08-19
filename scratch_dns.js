const dns = require('dns');

const candidates = [
  'bintjjzqkfpssznmcwrs',
  'bintjjzqkfpssznmqwrs',
  'bintjzqkfpssznmcwrs',
  'bintjzqkfpssznmqwrs',
  'ointjjzqkfpssznmcwrs',
  'ointjjzqkfpssznmqwrs',
  'ointjzqkfpssznmcwrs',
  'ointjzqkfpssznmqwrs',
  'blntjjzckfpssznmcwrs'
];

async function check() {
  for (const c of candidates) {
    const domain = `${c}.supabase.co`;
    dns.resolve(domain, (err, addresses) => {
      if (!err && addresses) {
        console.log('VALID DOMAIN FOUND:', domain, addresses);
      }
    });
  }
}

check();
