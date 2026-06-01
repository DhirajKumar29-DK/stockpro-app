import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Mail, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">StockPro</span>
          </div>
          <p className="text-gray-500 text-sm">India's smart stock tracker</p>
        </div>

        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          {!sent ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Forgot Password?</h2>
                  <p className="text-xs text-gray-400">Enter your email to reset</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="aapka@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-base"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Check your email!</h3>
              <p className="text-gray-400 text-sm mb-4">
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-xs text-gray-400">Link expires in 15 minutes</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;