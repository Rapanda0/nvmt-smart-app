const { Pool } = require('pg');

const pool = new Pool({
  user: 'ryek_admin',
  host: 'nvmt-smart-postgresql.postgres.database.azure.com',
  database: 'nvmt_smart',
  password: 'S41tsucks?',
  port: 5432, 
});
// NEW CHANGES HELLO

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