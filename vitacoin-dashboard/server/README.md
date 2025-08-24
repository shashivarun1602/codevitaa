# Vitacoin Dashboard Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. MongoDB Setup
You have two options:

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Database will be created automatically at `mongodb://localhost:27017/vitacoin`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a new cluster
- Get your connection string
- Update the `MONGODB_URI` in `.env` file

### 3. Environment Variables
Update the `.env` file with your settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vitacoin
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Create Demo Data
Make a POST request to create demo user:
```bash
curl -X POST http://localhost:5000/api/create-demo-user
```

## API Endpoints

- `GET /api/user/:userId` - Get user dashboard data
- `POST /api/user/:userId/claim` - Claim daily bonus
- `GET /api/user/:userId/transactions` - Get user transactions
- `GET /api/leaderboard` - Get leaderboard
- `POST /api/create-demo-user` - Create demo user (development only)
- `GET /api/health` - Health check

## Database Schema

### User
- username, email, password
- coins, badges, level
- lastClaimDate, createdAt, updatedAt

### Transaction
- userId (ref to User)
- type (earn/spend), amount, description
- createdAt
