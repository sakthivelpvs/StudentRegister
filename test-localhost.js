// Simple test script for localhost setup
// Run with: node test-localhost.js

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testLocalhost() {
  console.log('🧪 Testing localhost setup...\n');

  try {
    // Test 1: Check server is running
    console.log('1. Testing server connection...');
    const response = await fetch(`${BASE_URL}/`);
    const data = await response.json();
    console.log('✅ Server running:', data.message);

    // Test 2: Test login
    console.log('\n2. Testing login...');
    const loginResponse = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'pass123' })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData.user.username);
      
      // Get session cookie
      const cookies = loginResponse.headers.get('set-cookie');
      
      // Test 3: Test authenticated endpoint
      console.log('\n3. Testing student API...');
      const studentsResponse = await fetch(`${BASE_URL}/api/students`, {
        headers: { 'Cookie': cookies }
      });
      
      if (studentsResponse.ok) {
        const students = await studentsResponse.json();
        console.log('✅ Students API working:', `${students.length} students found`);
      } else {
        console.log('❌ Students API failed:', studentsResponse.status);
      }
      
    } else {
      console.log('❌ Login failed:', loginResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLocalhost();