const express = require('express');
const router = express.Router();
const { getStockQuote, getStockHistory, searchStocks, getTopStocks, addToWatchlist, removeFromWatchlist, getWatchlist } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

router.get('/top', protect, getTopStocks);
router.get('/search', protect, searchStocks);
router.get('/watchlist', protect, getWatchlist);
router.post('/watchlist', protect, addToWatchlist);
router.delete('/watchlist/:symbol', protect, removeFromWatchlist);
router.get('/:symbol', protect, getStockQuote);
router.get('/:symbol/history', protect, getStockHistory);

module.exports = router;