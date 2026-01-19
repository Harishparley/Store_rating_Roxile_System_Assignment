const loginUrl = 'http://localhost:5000/api/auth/login';
const addStoreUrl = 'http://localhost:5000/api/stores/add';

const adminCreds = {
  email: "admin@roxiler.com",
  password: "Admin@123"
};

const newStore = {
  name: "Tech World Pune",
  email: "store@techworld.com",
  address: "Phoenix Mall, Viman Nagar, Pune"
};

async function testAdminFlow() {
  try {
    // 1. Login as Admin
    console.log("1. Logging in as Admin...");
    const loginRes = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminCreds)
    });
    const loginData = await loginRes.json();

    if (!loginData.token) {
      throw new Error("Login failed! " + JSON.stringify(loginData));
    }
    console.log("✅ Login Success! Token received.");

    // 2. Add a Store (Using the Token)
    console.log("2. Attempting to add a store...");
    const storeRes = await fetch(addStoreUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}` // <--- sending the key
      },
      body: JSON.stringify(newStore)
    });
    const storeData = await storeRes.json();

    console.log("Response:", storeData);

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testAdminFlow();
