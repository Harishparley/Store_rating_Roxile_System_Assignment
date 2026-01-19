const api = 'http://localhost:5000/api/auth/login';

// We use the same credentials we just created in the signup test
const loginData = {
  email: "john@example.com",
  password: "Password@123" 
};

fetch(api, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData)
})
.then(res => res.json())
.then(data => {
  if (data.token) {
    console.log("✅ Login Success!");
    console.log("Token received:", data.token.substring(0, 20) + "...");
    console.log("User Role:", data.user.role);
  } else {
    console.log("❌ Login Failed:", data);
  }
})
.catch(err => console.error("Error:", err));