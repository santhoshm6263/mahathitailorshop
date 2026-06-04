// create_tables.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Ensure 'pg' database driver is installed locally
try {
  require.resolve('pg');
} catch (e) {
  console.log('📦 pg database driver not found. Installing pg via npm...');
  try {
    execSync('npm install pg', { stdio: 'inherit' });
    console.log('✅ pg driver installed successfully.\n');
  } catch (err) {
    console.error('❌ Failed to install pg driver. Please run "npm install pg" manually.');
    process.exit(1);
  }
}

const { Client } = require('pg');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log('\n==================================================');
  console.log(' 👑 MAHATHI TAILOR SHOP - DATABASE SCHEMA DEPLOYER');
  console.log('==================================================\n');

  // Attempt to load connection URI from standard environment variables
  let connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    console.log('To run this command, you need your Supabase PostgreSQL connection string.');
    console.log('Location: Supabase Dashboard -> Project Settings -> Database -> Connection string -> URI');
    console.log('Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres\n');
    connectionString = await askQuestion('🔗 Paste your Supabase Connection string (URI): ');
  }

  if (!connectionString || !connectionString.trim()) {
    console.error('❌ Connection URI is required. Exiting...');
    rl.close();
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, 'supabase_schema.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ Could not locate schema file at: ${sqlPath}`);
    rl.close();
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  console.log('\n⏳ Connecting to Supabase Database...');
  const client = new Client({
    connectionString: connectionString.trim(),
    ssl: {
      rejectUnauthorized: false // SSL is required for connecting to cloud Supabase PostgreSQL
    }
  });

  try {
    await client.connect();
    console.log('✅ Connection established.');

    console.log('⏳ Running schema migration scripts (Creating tables, RLS, triggers)...');
    await client.query(sqlContent);
    console.log('\n🎉 SUCCESS! All tables, row-level policies, triggers, and stored procedures created.');

  } catch (err) {
    console.error('\n❌ Database migration failed:');
    console.error(err.message || err);
  } finally {
    await client.end();
    rl.close();
  }
}

main();
