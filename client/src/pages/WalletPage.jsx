import { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const WalletPage = () => {
  const { user } = useAuth();

  const [balance, setBalance] = useState(user?.wallet || 0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const { data } = await api.get('/wallet');
      setBalance(data.balance);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/portfolio/transactions');
      setTransactions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMoney = async () => {
    if (!amount || Number(amount) < 100) {
      toast.error('Minimum amount is ₹100');
      return;
    }

    setLoading(true);

    try {
      const { data: order } = await api.post('/wallet/create-order', {
        amount: Number(amount),
      });

      const options = {
        key: 'rzp_test_SwDwapgVHeuVJ2',
        amount: order.amount,
        currency: 'INR',
        name: 'StockPro',
        description: 'Wallet Top Up',
        order_id: order.id,

        handler: async (response) => {
          try {
            const { data } = await api.post('/wallet/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: Number(amount),
            });

            setBalance(data.wallet);

            const updatedUser = {
              ...user,
              wallet: data.wallet,
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success(`₹${Number(amount).toLocaleString('en-IN')} added!`);
            setAmount('');
            fetchTransactions();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email,
        },

        theme: {
          color: '#1D9E75',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
   if (!withdrawAmount || Number(withdrawAmount) < 100) {
     toast.error('Minimum withdrawal is ₹100');
    return;
     }
   if (Number(withdrawAmount) > balance) {
     toast.error('Insufficient balance!');
     return;
    }
    setWithdrawLoading(true);
   try {
        const res = await api.post('/wallet/withdraw', { amount: Number(withdrawAmount) });
        setBalance(res.data.wallet);
        const updatedUser = { ...user, wallet: res.data.wallet };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success(`₹${Number(withdrawAmount).toLocaleString('en-IN')} withdrawal initiated!`);
        setWithdrawAmount('');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Withdrawal failed');
      } finally {
        setWithdrawLoading(false);
      }
    };

  return (
    <Layout title="Wallet">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Balance Card */}
        <div className="bg-primary rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-white" />
            </div>

            <div>
              <p className="text-green-100 text-sm">Available Balance</p>
              <p className="text-3xl font-bold">
                ₹{balance?.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <p className="text-green-100 text-xs">
            Use this balance to buy stocks
          </p>
        </div>

        {/* Add Money */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-primary" />
            Add Money
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {quickAmounts.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                  ${
                    amount === String(a)
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary'
                  }`}
              >
                ₹{a.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₹
              </span>

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field pl-7"
                min="100"
              />
            </div>

            <button
              onClick={handleAddMoney}
              disabled={loading}
              className="btn-primary px-6 whitespace-nowrap"
            >
              {loading ? 'Adding...' : 'Add Money'}
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            * Demo mode — no real payment needed
          </p>
        </div>

        {/* Withdraw */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <ArrowDownLeft size={18} className="text-danger" />
            Withdraw Money
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {quickAmounts.map((a) => (
              <button
                key={a}
                onClick={() => setWithdrawAmount(String(a))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                  ${
                    withdrawAmount === String(a)
                      ? 'bg-danger text-white border-danger'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-danger hover:text-danger'
                  }`}
              >
                ₹{a.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₹
              </span>

              <input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="input-field pl-7"
                min="100"
              />
            </div>

            <button
              onClick={handleWithdraw}
              disabled={withdrawLoading}
              className="btn-danger px-6 whitespace-nowrap"
            >
              {withdrawLoading ? 'Processing...' : 'Withdraw'}
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            * Demo mode — 2-3 business days processing
          </p>
        </div>

        {/* Transaction History */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Transaction History
          </h3>

          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <Wallet
                size={32}
                className="text-gray-200 dark:text-gray-700 mx-auto mb-2"
              />
              <p className="text-gray-400 text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {transactions.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center
                        ${
                          t.type === 'BUY'
                            ? 'bg-red-50 dark:bg-red-900/20'
                            : 'bg-green-50 dark:bg-green-900/20'
                        }`}
                    >
                      {t.type === 'BUY' ? (
                        <ArrowUpRight size={16} className="text-danger" />
                      ) : (
                        <ArrowDownLeft size={16} className="text-primary" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {t.symbol} — {t.type}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t.quantity} shares @ ₹{t.price}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        t.type === 'BUY'
                          ? 'text-danger'
                          : 'text-primary'
                      }`}
                    >
                      {t.type === 'BUY' ? '-' : '+'}₹
                      {t.total?.toLocaleString('en-IN')}
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

      </div>
    </Layout>
  );
};

export default WalletPage;