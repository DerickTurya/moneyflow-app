// Test database connection
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'moneyflow',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  connectionTimeoutMillis: 10000
});

async function testConnection() {
  try {
    console.log('Testing connection with:');
    console.log('- Host:', process.env.DB_HOST);
    console.log('- Port:', process.env.DB_PORT);
    console.log('- Database:', process.env.DB_NAME);
    console.log('- User:', process.env.DB_USER);
    console.log('- Password:', process.env.DB_PASSWORD ? '****' : 'NOT SET');
    
    const result = await pool.query('SELECT NOW(), current_database(), version()');
    console.log('\n✅ Connection successful!');
    console.log('- Time:', result.rows[0].now);
    console.log('- Database:', result.rows[0].current_database);
    console.log('- Version:', result.rows[0].version.split(',')[0]);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error('- Error:', error.message);
    console.error('- Code:', error.code);
    process.exit(1);
  }
}

testConnection();
