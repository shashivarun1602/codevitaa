const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	coins: { type: Number, default: 0 },
	badges: { type: [String], default: [] }
});

module.exports = mongoose.model('User', userSchema);

// ...existing code...
