const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('wallet');
    res.json({ balance: user.wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (error) {
    console.error('RAZORPAY ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const user = await User.findById(req.user._id);
    user.wallet += Number(amount);
    await user.save();

    res.json({ message: 'Wallet topped up successfully', wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWalletBalance, createOrder, verifyPayment };