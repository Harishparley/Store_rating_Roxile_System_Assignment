// This script simulates a User logging in and rating a store
const loginUrl = 'http://localhost:5000/api/auth/login';
const rateUrl = 'http://localhost:5000/api/stores/rate';

async function testRating() {
  try {
    // 1. Login as Normal User (John Doe)
    console.log("1. Logging in as User...");
    const loginRes = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "john@example.com", password: "Password@123" })
    });
    const loginData = await loginRes.json();
    
    if (!loginData.token) throw new Error("Login failed");

    // 2. Rate Store ID 1 (The one we made earlier)
    console.log("2. Submitting a 5-star rating...");
    const rateRes = await fetch(rateUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({ storeId: 1, rating: 5 })
    });
    
    const rateData = await rateRes.json();
    console.log("✅ RESULT:", rateData);

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testRating();