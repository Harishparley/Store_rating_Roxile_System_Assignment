# Store Rating System

A full-stack web application that allows users to search, view, and rate stores. The system includes Role-Based Access Control (RBAC) for System Admins, Store Owners, and Normal Users.

## Features

### 1. System Admin
- **Dashboard:** View total statistics (Users, Stores, Ratings).
- **User Management:** View, filter, and create new users (Admins, Store Owners, Normal Users).
- **Store Management:** Create new stores and link them to Store Owners.

### 2. Store Owner
- **Owner Dashboard:** View average rating for their specific store.
- **Customer Insights:** View a list of users who have rated their store.

### 3. Normal User
- **Store List:** View all stores with their average ratings.
- **Search & Sort:** Search stores by name/address and sort by rating or name.
- **Rate Stores:** Submit star ratings (1-5 stars) for stores.
- **Profile:** Change password functionality.

---

##  Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** SQLite (with Sequelize ORM)
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control

---

##  Default Admin Credentials

To set up the system and create other users/stores, login with the default Admin account:

| **System Admin** | `admin@roxiler.com` | `Admin@123` |

> **Note:** If this account does not exist in your database yet, please manually update the `role` of your first registered user to `'admin'` in the `database.sqlite` file or Database GUI.

---

##  Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/Harishparley/Store_rating_Roxile_System_Assignment
cd store-rating-app

2. Backend Setup (Server)
Navigate to the server folder, install dependencies, and start the backend.

Bash
cd server
npm install

# Start the server (Runs on http://localhost:5000)
node server.js
or if you are in root directory so use node server/server.js

3. Frontend Setup (Client)
Open a new terminal, navigate to the client folder, and start the React app.

Bash
cd client
npm install

# Start the frontend (Runs on http://localhost:5173 or 3000)
npm run dev
Usage Guide
Login as Admin (admin@roxiler.com).

Create a Store Owner: Go to the Dashboard, scroll down to "Create User", and create a user with the role "Store Owner".

Add a Store: Click "+ Add Store", enter the details, and use the email of the Store Owner you just created to link them.

Login as Owner: Logout and login with the Store Owner's credentials to see the Owner Dashboard.

Login as User: Signup as a new user to search and rate the store.

Project Structure
/client          # React Frontend
  /src
    /pages       # Dashboard, Login, Signup, AddStore
    /components  # Reusable components
/server          # Node.js Backend
  /controllers   # Logic for Auth, Admin, Stores
  /models        # Sequelize Database Models
  /routes        # API Routes
  database.sqlite # Local Database File