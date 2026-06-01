const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
  description: { type: String, default: '' },
  razorpayOrderId: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);