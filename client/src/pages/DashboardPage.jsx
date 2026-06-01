import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, Briefcase, BarChart2 } from 'lucide-react';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const StatCard = ({ title, value, sub, icon: Icon, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{title}</p>
      <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stocksRes, portfolioRes] = await Promise.all([
        api.get('/stocks/top'),
        api.get('/portfolio'),
      ]);
      setAllData(stocksRes.data);
      setPortfolio(portfolioRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Separate indices and stocks
  const indices = allData.filter(s => s.isIndex);
  const stocks = allData.filter(s => !s.isIndex);
  const totalInvested = portfolio.reduce((sum, h) => sum + h.avgPrice * h.quantity, 0);

  return (
    <Layout title="Dashboard" showTicker={true}>
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Good morning, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-gray-400 text-sm mt-1">Here's your market overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard title="Wallet Balance" value={`₹${user?.wallet?.toLocaleString('en-IN') || '0'}`} icon={Wallet} color="bg-primary" />
        <StatCard title="Invested" value={`₹${totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} icon={Briefcase} color="bg-blue-500" />
        <StatCard title="Holdings" value={`${portfolio.length} stocks`} icon={TrendingUp} color="bg-purple-500" />
        <StatCard title="Market" value="NSE Live" sub="15 min delay" icon={BarChart2} color="bg-orange-500" />
      </div>

      {/* Market Indices */}
      {indices.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {indices.map((idx) => (
            <div key={idx.symbol} className="card">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{idx.symbol}</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                ₹{idx.price?.toLocaleString('en-IN')}
              </p>
              <div className={`flex items-center gap-1 text-xs font-medium mt-1
                ${idx.changePercent >= 0 ? 'text-primary' : 'text-danger'}`}>
                {idx.changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Stocks */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Top Stocks</h3>
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">NSE</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {stocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => navigate(`/stocks/${stock.symbol}`)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      {stock.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{stock.symbol}</p>
                    <p className="text-xs text-gray-400 truncate w-32">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    ₹{stock.price?.toLocaleString('en-IN')}
                  </p>
                  <div className={`flex items-center justify-end gap-1 text-xs font-medium
                    ${stock.changePercent >= 0 ? 'text-primary' : 'text-danger'}`}>
                    {stock.changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;