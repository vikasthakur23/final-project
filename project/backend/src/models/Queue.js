const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  number: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['waiting','served','cancelled'], default: 'waiting' },
  createdAt: { type: Date, default: Date.now }
});

const queueSchema = new mongoose.Schema({
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  tokens: [ tokenSchema ],
  lastNumber: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Queue', queueSchema);
