import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import api from '../../utils/api';

const MarketTicker = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/stocks/top');
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 mx-5 flex-shrink-0">
            <span className={`text-xs font-semibold ${item.isIndex ? 'text-yellow-400' : 'text-gray-300'}`}>
              {item.symbol}
            </span>
            <span className="text-white text-xs font-bold">
              ₹{item.price?.toLocaleString('en-IN')}
            </span>
            <span className={`text-xs flex items-center gap-0.5 ${item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {item.changePercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
            </span>
            <span className="text-gray-600 mx-1">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;