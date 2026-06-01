import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MarketTicker from './MarketTicker';

const Layout = ({ children, title, showTicker = false }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="md:ml-56">
        {showTicker && <MarketTicker />}
        <Navbar title={title} />
        <main className="p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;