// Test script to debug API endpoints
const axios = require('axios');

async function testAPI() {
  console.log('🔍 Testing API endpoints...');
  console.log('============================');
  
  const baseURL = 'http://localhost:3000';
  
  try {
    // Test 1: Check if API is running
    console.log('\n1. Testing GET /api/vehicles...');
    const getResponse = await axios.get(`${baseURL}/api/vehicles`);
    console.log('✅ GET /api/vehicles - Status:', getResponse.status);
    console.log('📊 Vehicles count:', getResponse.data.length);
    
    // Test 2: Test POST with sample data
    console.log('\n2. Testing POST /api/vehicles...');
    const testVehicle = {
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      vin: '1HGBH41JXMN109186',
      ownerName: 'Test User',
      ownerEmail: 'test@example.com',
      ownerPhone: '(555) 123-4567',
      location: 'Seattle, WA',
      eventType: 'registration',
      eventDate: new Date().toISOString().split('T')[0],
      eventDescription: 'Test vehicle creation',
      mileage: 1000
    };
    
    const postResponse = await axios.post(`${baseURL}/api/vehicles`, testVehicle);
    console.log('✅ POST /api/vehicles - Status:', postResponse.status);
    console.log('📊 Created vehicle ID:', postResponse.data.id);
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Make sure to run: npm run dev');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAPI();
