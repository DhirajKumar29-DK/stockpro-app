import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import Layout from '../components/common/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PortfolioPage = () => {
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('holdings');
  const [prices, setPrices] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [holdingsRes, txRes] = await Promise.all([
        api.get('/portfolio'),
        api.get('/portfolio/transactions'),
      ]);
      setHoldings(holdingsRes.data);
      setTransactions(txRes.data);

      // Fetch current prices
      const pricePromises = holdingsRes.data.map(h =>
        api.get(`/stocks/${h.symbol}`)
          .then(r => ({ symbol: h.symbol, price: r.data.price }))
          .catch(() => ({ symbol: h.symbol, price: h.avgPrice }))
      );
      const priceResults = await Promise.all(pricePromises);
      const priceMap = {};
      priceResults.forEach(p => priceMap[p.symbol] = p.price);
      setPrices(priceMap);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalInvested = holdings.reduce((sum, h) => sum + h.avgPrice * h.quantity, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + (prices[h.symbol] || h.avgPrice) * h.quantity, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? ((totalPnL / totalInvested) * 100).toFixed(2) : 0;
  const isProfit = totalPnL >= 0;

  return (
    <Layout title="Portfolio">

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card">
          <p className="text-xs text-gray-400 mb-1">Invested</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-400 mb-1">Current Value</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">₹{totalCurrent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-400 mb-1">Total P&L</p>
          <p className={`text-lg font-bold ${isProfit ? 'text-primary' : 'text-danger'}`}>
            {isProfit ? '+' : ''}₹{totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-400 mb-1">Returns</p>
          <p className={`text-lg font-bold ${isProfit ? 'text-primary' : 'text-danger'}`}>
            {isProfit ? '+' : ''}{totalPnLPercent}%
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('holdings')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${activeTab === 'holdings' ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
        >
          Holdings ({holdings.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${activeTab === 'transactions' ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
        >
          Transactions ({transactions.length})
        </button>
      </div>

      {/* Holdings Tab */}
      {activeTab === 'holdings' && (
        <div className="card">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : holdings.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No holdings yet</p>
              <p className="text-gray-300 text-sm mt-1">Buy stocks to see them here</p>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-2 px-3 pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-400 col-span-2">Stock</p>
                <p className="text-xs text-gray-400 text-right">Avg Price</p>
                <p className="text-xs text-gray-400 text-right">LTP</p>
                <p className="text-xs text-gray-400 text-right">P&L</p>
              </div>

              {holdings.map((h) => {
                const ltp = prices[h.symbol] || h.avgPrice;
                const pnl = (ltp - h.avgPrice) * h.quantity;
                const pnlPercent = (((ltp - h.avgPrice) / h.avgPrice) * 100).toFixed(2);
                const profit = pnl >= 0;

                return (
                  <div key={h._id} className="grid grid-cols-5 gap-2 px-3 py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">{h.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{h.symbol}</p>
                        <p className="text-xs text-gray-400">{h.quantity} shares</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-right self-center">₹{h.avgPrice?.toFixed(2)}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 text-right self-center">₹{ltp?.toLocaleString('en-IN')}</p>
                    <div className="text-right self-center">
                      <p className={`text-sm font-semibold ${profit ? 'text-primary' : 'text-danger'}`}>
                        {profit ? '+' : ''}₹{pnl.toFixed(0)}
                      </p>
                      <p className={`text-xs ${profit ? 'text-primary' : 'text-danger'}`}>
                        {profit ? '+' : ''}{pnlPercent}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="card">
          {transactions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {transactions.map((t) => (
                <div key={t._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center
                      ${t.type === 'BUY' ? 'bg-red-50' : 'bg-green-50'}`}>
                      {t.type === 'BUY'
                        ? <TrendingUp size={16} className="text-danger" />
                        : <TrendingDown size={16} className="text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{t.symbol}</p>
                      <p className="text-xs text-gray-400">{t.quantity} shares @ ₹{t.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${t.type === 'BUY' ? 'text-danger' : 'text-primary'}`}>
                      {t.type === 'BUY' ? '-' : '+'}₹{t.total?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(t.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </Layout>
  );
};

export default PortfolioPage;