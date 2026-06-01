import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../utils/api';

const Navbar = ({ title }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length < 2) return setResults([]);
    try {
      const { data } = await api.get(`/stocks/search?q=${val}`);
      setResults(data);
    } catch {
      setResults([]);
    }
  };

  const handleSelect = (symbol) => {
    setQuery('');
    setResults([]);
    navigate(`/stocks/${symbol}`);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100 md:text-lg">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={query}
              onChange={handleSearch}
              className="bg-transparent text-sm outline-none w-32 md:w-48 text-gray-700 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
          {results.length > 0 && (
            <div className="absolute top-10 right-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg w-64 z-50 overflow-hidden">
              {results.map((r) => (
                <button
                  key={r.symbol}
                  onClick={() => handleSelect(r.symbol)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{r.symbol}</p>
                  <p className="text-xs text-gray-400 truncate">{r.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;