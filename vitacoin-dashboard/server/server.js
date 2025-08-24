const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vitacoin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  coins: { type: Number, default: 0 },
  badges: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  lastClaimDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['earn', 'spend'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// User Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      coins: 100, // Starting bonus
      badges: [],
      level: 1,
      lastClaimDate: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        coins: newUser.coins,
        badges: newUser.badges,
        level: newUser.level,
        lastClaimDate: newUser.lastClaimDate
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins,
        level: user.level,
        badges: user.badges
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes

// Get user dashboard data
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        coins: user.coins,
        badges: user.badges,
        level: user.level,
        lastClaimDate: user.lastClaimDate
      },
      transactions
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Claim daily bonus (Protected route)
app.post('/api/user/:userId/claim-bonus', authenticateToken, async (req, res) => {
  try {
    // Verify user can only access their own data
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const today = new Date();
    const lastClaim = user.lastClaimDate;
    
    // Check if user can claim (once per day)
    if (lastClaim && lastClaim.toDateString() === today.toDateString()) {
      return res.status(400).json({ error: 'Daily bonus already claimed' });
    }

    // Award daily bonus
    const bonusAmount = 10;
    user.coins += bonusAmount;
    user.lastClaimDate = today;
    user.updatedAt = today;
    
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'earn',
      amount: bonusAmount,
      description: 'Daily login bonus'
    });
    await transaction.save();

    res.json({
      success: true,
      newBalance: user.coins,
      bonusAmount,
      message: 'Daily bonus claimed successfully!'
    });
  } catch (error) {
    console.error('Error claiming bonus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ coins: -1 })
      .limit(10)
      .select('username coins badges level');
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user transactions
app.get('/api/user/:userId/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ userId: req.params.userId });

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/user/:userId/earn (Protected route)
app.post('/api/user/:userId/earn', authenticateToken, async (req, res) => {
  try {
    // Verify user can only access their own data
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { amount, description, category } = req.body;
    
    if (!amount || !description) {
      return res.status(400).json({ error: 'Amount and description are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.coins += amount;
    user.updatedAt = new Date();
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: 'earn',
      amount,
      description,
      category: category || 'earn'
    });
    await transaction.save();

    res.json({
      success: true,
      newBalance: user.coins,
      amount,
      transaction: transaction.toObject()
    });
  } catch (error) {
    console.error('Error earning coins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/user/:userId/spend (Protected route)
app.post('/api/user/:userId/spend', authenticateToken, async (req, res) => {
  try {
    // Verify user can only access their own data
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { amount, description, category } = req.body;
    
    if (!amount || !description) {
      return res.status(400).json({ error: 'Amount and description are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.coins < amount) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }

    user.coins -= amount;
    user.updatedAt = new Date();
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: 'spend',
      amount,
      description,
      category: category || 'spend'
    });
    await transaction.save();

    res.json({
      success: true,
      newBalance: user.coins,
      amount,
      transaction: transaction.toObject()
    });
  } catch (error) {
    console.error('Error spending coins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Daily bonus claiming endpoint
app.post('/api/user/:userId/claim-bonus', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has already claimed today
    const today = new Date().toDateString();
    const lastClaimDate = user.lastClaimDate ? new Date(user.lastClaimDate).toDateString() : null;
    
    if (lastClaimDate === today) {
      return res.status(400).json({ 
        success: false,
        error: 'Daily bonus already claimed today' 
      });
    }

    // Award daily bonus
    const bonusAmount = 10;
    user.coins += bonusAmount;
    user.lastClaimDate = new Date();
    user.updatedAt = new Date();
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: user._id,
      type: 'earn',
      amount: bonusAmount,
      description: 'Daily login bonus',
      category: 'bonus'
    });
    await transaction.save();

    res.json({
      success: true,
      bonusAmount,
      newBalance: user.coins,
      message: 'Daily bonus claimed successfully!',
      transaction: transaction.toObject()
    });
  } catch (error) {
    console.error('Error claiming daily bonus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Record transaction endpoint
app.post('/api/user/:userId/transaction', async (req, res) => {
  try {
    const { type, amount, description, category } = req.body;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user coins based on transaction type
    if (type === 'earn') {
      user.coins += amount;
    } else if (type === 'spend') {
      if (user.coins < amount) {
        return res.status(400).json({ error: 'Insufficient coins' });
      }
      user.coins -= amount;
    }

    user.updatedAt = new Date();
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: user._id,
      type,
      amount,
      description,
      category: category || type
    });
    await transaction.save();

    res.json({
      success: true,
      newBalance: user.coins,
      transaction: transaction.toObject()
    });
  } catch (error) {
    console.error('Error recording transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh leaderboard endpoint
app.post('/api/leaderboard/refresh', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ coins: -1 })
      .limit(10)
      .select('username coins badges level');
    
    res.json({
      success: true,
      leaderboard: users
    });
  } catch (error) {
    console.error('Error refreshing leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create demo user (for testing)
app.post('/api/create-demo-user', async (req, res) => {
  try {
    const demoUser = new User({
      username: 'Demo User',
      email: 'demo@vitacoin.com',
      password: 'demo123', // In production, this should be hashed
      coins: 75,
      badges: 3,
      level: 2
    });

    await demoUser.save();

    // Create some demo transactions
    const demoTransactions = [
      {
        userId: demoUser._id,
        type: 'earn',
        amount: 20,
        description: 'Quiz completed'
      },
      {
        userId: demoUser._id,
        type: 'earn',
        amount: 10,
        description: 'Daily login bonus'
      },
      {
        userId: demoUser._id,
        type: 'spend',
        amount: 5,
        description: 'Badge purchase'
      }
    ];

    await Transaction.insertMany(demoTransactions);

    res.json({ 
      success: true, 
      userId: demoUser._id,
      message: 'Demo user created successfully!' 
    });
  } catch (error) {
    console.error('Error creating demo user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
