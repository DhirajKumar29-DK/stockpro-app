const express = require('express');
const router = express.Router();
const { getWalletBalance, createOrder, verifyPayment } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/', protect, getWalletBalance);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/demo-add', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user._id);
    user.wallet += Number(amount);
    await user.save();
    res.json({ wallet: user.wallet, message: 'Success' });
  } catch (error) {
    console.error('WALLET ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post('/withdraw', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    if (Number(amount) < 100) {
      return res.status(400).json({ message: 'Minimum withdrawal is ₹100' });
    }
    if (user.wallet < Number(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    user.wallet -= Number(amount);
    await user.save();
    res.json({ wallet: user.wallet, message: 'Withdrawal initiated!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;