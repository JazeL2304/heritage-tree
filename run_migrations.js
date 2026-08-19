const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const sql = fs.readFileSync('./supabase-schema.sql', 'utf8');

  // Supabase pooler / direct connection strings
  const connectionStrings = [
    'postgres://postgres.bintjjzqkfpssznmqwrs:potu@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
    'postgres://postgres:potu@db.bintjjzqkfpssznmqwrs.supabase.co:5432/postgres',
    'postgres://postgres.bintjjzqkfpssznmqwrs:potu@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
  ];

  for (const connStr of connectionStrings) {
    console.log('Trying connection:', connStr);
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log('CONNECTED TO POSTGRES! EXECUTING MIGRATIONS...');
      await client.query(sql);
      console.log('MIGRATION EXECUTED SUCCESSFULLY!');
      await client.end();
      return;
    } catch (err) {
      console.error('Connection failed:', err.message);
      try { await client.end(); } catch {}
    }
  }
}

run();
