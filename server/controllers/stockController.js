const axios = require('axios');
const User = require('../models/User');

const getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const quote = data.chart.result[0];
    const meta = quote.meta;
    res.json({
      symbol: meta.symbol,
      name: meta.longName || symbol,
      price: meta.regularMarketPrice,
      previousClose: meta.previousClose,
      change: (meta.regularMarketPrice - meta.previousClose).toFixed(2),
      changePercent: (((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100).toFixed(2),
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      volume: meta.regularMarketVolume,
      marketCap: meta.marketCap,
    });
  } catch (error) {
    res.status(500).json({ message: 'Stock data fetch failed' });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1mo' } = req.query;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=${period}&interval=1d`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;
    const history = timestamps.map((ts, i) => ({
      date: new Date(ts * 1000).toLocaleDateString('en-IN'),
      price: closes[i] ? closes[i].toFixed(2) : null,
    })).filter(d => d.price !== null);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'History fetch failed' });
  }
};

const searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${q}&region=IN&lang=en`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const results = data.quotes
      .filter(q => q.exchange === 'NSI' || q.exchange === 'BSE')
      .slice(0, 8)
      .map(q => ({
        symbol: q.symbol.replace('.NS', '').replace('.BO', ''),
        name: q.longname || q.shortname,
        exchange: q.exchange,
      }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
};

const getTopStocks = async (req, res) => {
  try {
    const stocks = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'WIPRO', 'ADANIENT', 'BAJFINANCE', 'TATAMOTORS'];
    const indices = ['^NSEI', '^BSESN', '^NSEBANK'];

    const allSymbols = [...indices, ...stocks.map(s => `${s}.NS`)];

    const promises = allSymbols.map(sym =>
      axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }).then(({ data }) => {
        const meta = data.chart.result[0].meta;
        const change = meta.regularMarketPrice - meta.previousClose;
        const changePercent = ((change / meta.previousClose) * 100).toFixed(2);
        return {
          symbol: sym === '^NSEI' ? 'NIFTY 50' : sym === '^BSESN' ? 'SENSEX' : sym === '^NSEBANK' ? 'BANK NIFTY' : sym.replace('.NS', ''),
          name: meta.longName || sym,
          price: meta.regularMarketPrice,
          change: change.toFixed(2),
          changePercent: parseFloat(changePercent),
          isIndex: indices.includes(sym),
        };
      }).catch(() => null)
    );

    const results = (await Promise.all(promises)).filter(Boolean);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stocks' });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const { symbol, name } = req.body;
    const user = await User.findById(req.user._id);
    const exists = user.watchlist.find(w => w.symbol === symbol);
    if (exists) {
      return res.status(400).json({ message: 'Already in watchlist' });
    }
    user.watchlist.push({ symbol, name });
    await user.save();
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;
    const user = await User.findById(req.user._id);
    user.watchlist = user.watchlist.filter(w => w.symbol !== symbol);
    await user.save();
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStockQuote, getStockHistory, searchStocks, getTopStocks, addToWatchlist, removeFromWatchlist, getWatchlist };