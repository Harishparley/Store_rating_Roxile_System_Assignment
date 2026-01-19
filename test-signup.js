// A simple script to test your Signup API
const api = 'http://localhost:5000/api/auth/signup';

const userData = {
  name: "John Doe The Software Engineer", // 20+ chars
  email: "john@example.com",
  password: "Password@123", // Upper + Special char
  address: "123 Main St, Pune",
  role: "user"
};

fetch(api, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
})
.then(res => res.json())
.then(data => console.log("Response:", data))
.catch(err => console.error("Error:", err));