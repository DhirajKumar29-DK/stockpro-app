const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const axios = require('axios');

const buyStock = async (req, res) => {
  try {
    const { symbol, name, quantity, price } = req.body;
    const totalCost = quantity * price;
    const user = await User.findById(req.user._id);

    if (user.wallet < totalCost) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    user.wallet -= totalCost;
    await user.save();

    let holding = await Portfolio.findOne({ user: req.user._id, symbol });
    if (holding) {
      const totalQty = holding.quantity + quantity;
      holding.avgPrice = ((holding.avgPrice * holding.quantity) + (price * quantity)) / totalQty;
      holding.quantity = totalQty;
      await holding.save();
    } else {
      holding = await Portfolio.create({
        user: req.user._id, symbol, name, quantity, avgPrice: price,
      });
    }

    await Transaction.create({
      user: req.user._id, symbol, name, type: 'BUY', quantity, price, total: totalCost,
    });

    res.json({ message: 'Stock purchased successfully', wallet: user.wallet, holding });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sellStock = async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;
    const holding = await Portfolio.findOne({ user: req.user._id, symbol });

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient shares' });
    }

    const totalValue = quantity * price;
    const user = await User.findById(req.user._id);
    user.wallet += totalValue;
    await user.save();

    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      await Portfolio.deleteOne({ _id: holding._id });
    } else {
      await holding.save();
    }

    await Transaction.create({
      user: req.user._id, symbol, name: holding.name, type: 'SELL', quantity, price, total: totalValue,
    });

    res.json({ message: 'Stock sold successfully', wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.user._id });
    res.json(holdings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { buyStock, sellStock, getPortfolio, getTransactions };