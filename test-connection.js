// Test script to verify database connection with containerWizrdDbAccess
require('dotenv').config({ path: '.env.local' });
const DatabaseConnection = require('./lib/database.js');

async function testConnection() {
  console.log('🔍 Testing database connection with containerWizrdDbAccess...');
  console.log('================================================');
  
  try {
    const db = DatabaseConnection.getInstance();
    const pool = await db.getConnection();
    
    console.log('✅ Successfully connected to database!');
    
    // Test a simple query
    const result = await pool.request().query('SELECT COUNT(*) as table_count FROM sys.tables WHERE name = \'Vehicles\'');
    const tableExists = result.recordset[0].table_count > 0;
    
    if (tableExists) {
      console.log('✅ Vehicles table exists!');
      
      // Test if we can read from the table
      const vehicleCount = await pool.request().query('SELECT COUNT(*) as count FROM Vehicles');
      console.log(`📊 Vehicles in database: ${vehicleCount.recordset[0].count}`);
    } else {
      console.log('❌ Vehicles table not found. Please run the schema.sql script.');
    }
    
    await db.closeConnection(pool);
    console.log('✅ Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Check your .env.local file has correct values');
    console.error('2. Verify containerWizrdDbAccess has database permissions');
    console.error('3. Ensure SQL Server firewall allows Azure services');
    console.error('4. Check that your App Registration has the correct API permissions');
  }
}

testConnection();
