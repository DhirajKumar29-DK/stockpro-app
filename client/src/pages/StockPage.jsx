import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Plus, Minus, ArrowLeft, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/common/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';

const StockPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1mo');
  const [orderType, setOrderType] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetchStock();
  }, [symbol]);

  useEffect(() => {
    fetchHistory();
  }, [symbol, period]);

  const fetchStock = async () => {
    try {
      const { data } = await api.get(`/stocks/${symbol}`);
      setStock(data);
    } catch {
      toast.error('Stock data fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await api.get(`/stocks/${symbol}/history?period=${period}`);
      setHistory(data);
    } catch {
      console.error('History fetch failed');
    }
  };

  const handleOrder = async () => {
    if (!stock) return;
    setPlacing(true);
    try {
      const endpoint = orderType === 'BUY' ? '/portfolio/buy' : '/portfolio/sell';
      await api.post(endpoint, {
        symbol,
        name: stock.name,
        quantity: Number(quantity),
        price: stock.price,
      });
      toast.success(`${orderType === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${symbol}!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setPlacing(false);
    }
  };

  const handleWatchlist = async () => {
    try {
      await api.post('/stocks/watchlist', { symbol, name: stock?.name });
      toast.success('Added to watchlist!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const periods = [
    { label: '1W', value: '5d' },
    { label: '1M', value: '1mo' },
    { label: '3M', value: '3mo' },
    { label: '6M', value: '6mo' },
    { label: '1Y', value: '1y' },
  ];

  const isUp = stock?.changePercent >= 0;
  const totalCost = (stock?.price * quantity).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  return (
    <Layout title={symbol}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4 text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : stock ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left — Chart + Info */}
          <div className="lg:col-span-2 space-y-4">

            {/* Stock Header */}
            <div className="card">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">{symbol}</h2>
                    <button onClick={handleWatchlist} className="text-gray-300 hover:text-yellow-400 transition-colors">
                      <Star size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">₹{stock.price?.toLocaleString('en-IN')}</p>
                  <div className={`flex items-center justify-end gap-1 text-sm font-medium ${isUp ? 'text-primary' : 'text-danger'}`}>
                    {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {isUp ? '+' : ''}{stock.change} ({isUp ? '+' : ''}{stock.changePercent}%)
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Day High</p>
                  <p className="text-sm font-medium text-gray-800">₹{stock.high?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Day Low</p>
                  <p className="text-sm font-medium text-gray-800">₹{stock.low?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Volume</p>
                  <p className="text-sm font-medium text-gray-800">{(stock.volume / 1000000).toFixed(2)}M</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Price Chart</h3>
                <div className="flex gap-1">
                  {periods.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPeriod(p.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
                        ${period === p.value ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={history}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v) => [`₹${v}`, 'Price']} labelStyle={{ fontSize: 11 }} contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 11 }} />
                  <Line type="monotone" dataKey="price" stroke={isUp ? '#1D9E75' : '#E24B4A'} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Right — Order Form */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Place Order</h3>

              {/* Buy/Sell Toggle */}
              <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-4">
                <button
                  onClick={() => setOrderType('BUY')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all
                    ${orderType === 'BUY' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setOrderType('SELL')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all
                    ${orderType === 'SELL' ? 'bg-danger text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Sell
                </button>
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-1">Market Price</label>
                <div className="input-field bg-gray-50 text-gray-600">
                  ₹{stock.price?.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="input-field text-center"
                  />
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-3 border-t border-gray-100 mb-4">
                <span className="text-sm text-gray-400">Total Amount</span>
                <span className="text-base font-bold text-gray-800">₹{totalCost}</span>
              </div>

              <button
                onClick={handleOrder}
                disabled={placing}
                className={`w-full py-3 rounded-lg text-white font-medium text-sm transition-all disabled:opacity-50
                  ${orderType === 'BUY' ? 'bg-primary hover:bg-green-700' : 'bg-danger hover:bg-red-700'}`}
              >
                {placing ? 'Placing...' : `${orderType === 'BUY' ? 'Buy' : 'Sell'} ${quantity} Share${quantity > 1 ? 's' : ''}`}
              </button>

              <p className="text-xs text-gray-400 text-center mt-2">
                * Virtual trading only
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">Stock not found</div>
      )}
    </Layout>
  );
};

export default StockPage;