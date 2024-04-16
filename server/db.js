const { Pool } = require('pg');

// ACTUAL DB DONT USE UNLESS WERE FINISHED WITH EVERYTHING AND ITS FINAL
// const pool = new Pool({
//   user: 'postgres.inkgeoagzteoswbmhiuw',
//   host: 'aws-0-ca-central-1.pooler.supabase.com',
//   database: 'postgres',
//   password: 'S41tsucks?410t',
//   port: 5432, 
// });

// local testdb RYEKS
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nvmtdb',
  password: 'password',
  port: 5432, 
});

// Function to test the database connection
async function testDatabaseConnection() {
  try {
    // Query to select the current version of PostgreSQL
    const result = await pool.query('SELECT version();');

    // Log the result to the console
    console.log('Connected to PostgreSQL database successfully:');
    console.log(result.rows[0].version);
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error.message);
  } 
}
// Call the function to test the database connection
testDatabaseConnection();

module.exports = pool;