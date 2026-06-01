import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Zap, BarChart2, ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { dark, toggleDark } = useTheme();

  const features = [
    { icon: TrendingUp, title: 'Live Market Data', desc: 'Track real NSE/BSE stock movements with delayed live pricing' },
    { icon: BarChart2, title: 'Advanced Analytics', desc: 'Interactive charts with technical insights' },
    { icon: Shield, title: 'Risk-Free Trading', desc: 'Practice trading with virtual money' },
    { icon: Zap, title: 'Instant Orders', desc: 'Execute buy and sell orders instantly' },
  ];

  const stats = [
    { value: '5,000+', label: 'Stocks Listed' },
    { value: '₹0', label: 'Commission' },
    { value: '15min', label: 'Data Delay' },
    { value: '100%', label: 'Free Forever' },
  ];

  const stocks = [
    ['RELIANCE', '₹2,847', '+1.2%'],
    ['TCS', '₹3,912', '+0.8%'],
    ['INFY', '₹1,543', '-0.4%'],
    ['HDFCBANK', '₹1,687', '+2.1%'],
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1117]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-4 sticky top-0 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">StockPro</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDark}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => navigate('/login')} className="text-gray-600 dark:text-gray-300 font-medium hover:text-primary">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="btn-primary px-6 py-2 hover:scale-105 transition-all duration-300">
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-primary px-5 py-2 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Live NSE/BSE Market Data
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
          Trade Smarter with<br />
          <span className="text-primary">India's Virtual Stock Market</span>
        </h1>

        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-10">
          Learn stock trading, track live market trends, and build your investment confidence.
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => navigate('/register')} className="btn-primary px-8 py-4 text-lg flex items-center gap-2 hover:scale-105 transition-all">
            Start Trading Free <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate('/login')} className="px-8 py-4 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            Login
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-16">No real money required • Free forever</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl mb-20">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="ml-4 bg-gray-700 px-4 py-1 rounded-md text-xs text-gray-400">stockpro.app/dashboard</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[['Portfolio', '₹4,82,350'], ['Day P&L', '+₹8,240'], ['Holdings', '6 Stocks'], ['Wallet', '₹38,200']].map(([label, value]) => (
              <div key={label} className="bg-gray-800 rounded-xl p-4 text-left">
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-white font-bold text-lg">{value}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-white font-semibold">Top Stocks</h3>
              <span className="text-xs text-green-400">NSE Live</span>
            </div>
            {stocks.map(([name, price, change]) => (
              <div key={name} className="flex justify-between py-3 border-b border-gray-700 last:border-0">
                <p className="text-gray-300">{name}</p>
                <div className="text-right">
                  <p className="text-white">{price}</p>
                  <p className={change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{change}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 rounded-2xl p-6">
            <h3 className="text-white mb-4 font-semibold">Portfolio Growth</h3>
            <div className="flex items-end gap-3 h-32">
              {[30, 45, 40, 65, 55, 75, 85, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-green-400 rounded-t-lg" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 dark:hover:border-primary transition-all">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Icon className="text-primary" size={22} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-14 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="mb-8 text-green-100">Join thousands mastering stock trading</p>
          <button onClick={() => navigate('/register')} className="bg-white text-primary px-10 py-4 rounded-xl font-semibold hover:scale-105 transition-all">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-10 text-center">
        <p className="text-gray-500 dark:text-gray-400">© 2026 StockPro • Educational Purpose Only</p>
      </footer>

    </div>
  );
};

export default LandingPage;