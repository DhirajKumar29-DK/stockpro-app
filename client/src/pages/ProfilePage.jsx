import { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Eye, EyeOff } from 'lucide-react';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/user/profile', { name, phone });
      updateUser({ ...user, name: data.name, phone: data.phone });
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) { toast.error('Both fields are required'); return; }
    if (newPassword.length < 6) { toast.error('Min 6 characters'); return; }
    setChangingPass(true);
    try {
      await api.put('/user/change-password', { oldPassword, newPassword });
      toast.success('Password changed!');
      setOldPassword(''); setNewPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <Layout title="Profile">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Avatar */}
        <div className="card flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <span className="text-primary text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{user?.name}</h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <span className="text-xs bg-green-50 dark:bg-green-900/30 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">Investor</span>
          </div>
        </div>

        {/* Personal Info */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <User size={18} className="text-primary" /> Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
              <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email</label>
              <div className="input-field bg-gray-50 dark:bg-gray-800 text-gray-400 flex items-center gap-2">
                <Mail size={14} />{user?.email}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</label>
              <input type="tel" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <button onClick={handleUpdateProfile} disabled={saving} className="btn-primary flex items-center gap-2">
              <Save size={16} />{saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Lock size={18} className="text-primary" /> Change Password
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showOldPass ? 'text' : 'password'}
                  className="input-field pr-10"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showOldPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  className="input-field pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button onClick={handleChangePassword} disabled={changingPass} className="btn-primary flex items-center gap-2">
              <Lock size={16} />{changingPass ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Account Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Wallet Balance</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">₹{user?.wallet?.toLocaleString('en-IN') || '0'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Member Since</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default ProfilePage;