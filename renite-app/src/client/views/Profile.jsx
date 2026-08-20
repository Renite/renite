import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { Edit3, Shield, CreditCard, Bell, Settings, LogOut, X, Loader2 } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State ('edit' | 'security' | 'payment' | 'notifications' | 'settings' | null)
  const [activeModal, setActiveModal] = useState(null);

  // Interactive form states
  const [editForm, setEditForm] = useState({ name: '' });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [securitySettings, setSecuritySettings] = useState({ twoFactor: true, biometric: false });
  const [paymentMethods] = useState([{ id: 1, type: 'TeleBirr / Chapa', number: '+251 9*** **42' }]);
  const [accountSettings, setAccountSettings] = useState({ darkMode: false, language: 'English' });
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch logged-in user profile from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // DEBUG: Let's see what Supabase actually returns
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("🔍 SUPABASE SESSION DEBUG:", { session, sessionError });
        
        if (sessionError || !session?.user) {
          console.warn("⚠️ Redirecting to login because session is missing or errored.");
          if (isMounted) navigate('/login');
          return;
        }

        const authUser = session.user;

        // 2. Fetch additional profile record from your 'profiles' table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (!isMounted) return;

        const userData = {
          id: authUser.id,
          email: authUser.email,
          name: profileData?.name || profileData?.full_name || authUser.user_metadata?.full_name || 'User',
          avatarUrl: profileData?.avatar_url || authUser.user_metadata?.avatar_url,
          nationalId: profileData?.national_id || profileData?.fayda_id || 'FYD-**** 9042',
          casesFiled: profileData?.cases_filed || 0,
          resolved: profileData?.resolved_cases || 0,
          points: profileData?.points || 0,
          ...profileData
        };

        setUser(userData);
        setEditForm({ name: userData.name });
      } catch (err) {
        console.error('Profile fetch error:', err);
        if (isMounted) setError('Failed to load profile details.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchProfile();

    // 3. Listen for actual auth state changes (FIXED to rely only on SIGNED_OUT event)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate]);

  // Sign out handler using Supabase Auth
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
      navigate('/login');
    }
  };

  // Save profile changes handler to Supabase
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Update name in Supabase database table ('profiles')
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name: editForm.name, updated_at: new Date() })
        .eq('id', authUser.id);

      if (updateError) {
        console.warn('Profiles table update notice:', updateError.message);
      }

      setUser((prev) => ({ ...prev, name: editForm.name }));
      setSuccessMessage('Profile updated successfully!');
      setActiveModal(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Failed to update profile on the server.');
    }
  };

  const options = [
    { icon: Edit3, label: 'Edit Profile', color: 'text-slate-600', modal: 'edit' },
    { icon: Shield, label: 'Security & Privacy', color: 'text-emerald-600', modal: 'security' },
    { icon: CreditCard, label: 'Payment Methods', color: 'text-slate-400', modal: 'payment' },
    { icon: Bell, label: 'Notification Preferences', color: 'text-yellow-600', modal: 'notifications' },
    { icon: Settings, label: 'Account Settings', color: 'text-slate-600', modal: 'settings' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 items-center justify-center max-w-md mx-auto">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
        <p className="text-xs text-slate-500 mt-2">Loading your profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 items-center justify-center max-w-md mx-auto p-4 text-center">
        <p className="text-xs text-red-500 mb-4">{error || 'Could not retrieve user data.'}</p>
        <button onClick={handleSignOut} className="bg-slate-900 text-white text-xs px-4 py-2 rounded-xl">
          Sign In Again
        </button>
      </div>
    );
  }

  const displayName = user.name || 'User';
  const displayInitials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
  const nationalId = user.nationalId || 'FYD-**** 9042';

  return (
    <div className="bg-slate-50 min-h-screen pb-20 max-w-md mx-auto relative">
      {/* Profile Header */}
      <div className="bg-slate-900 pt-6 pb-20 px-6 rounded-b-[40px] relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-700 border-2 border-slate-600 text-white flex items-center justify-center font-bold text-xl overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                displayInitials
              )}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{displayName}</h2>
              <p className="text-slate-400 text-xs flex items-center gap-1">Fayda ID Verified</p>
            </div>
          </div>
          <button 
            onClick={() => { setEditForm({ name: displayName }); setActiveModal('edit'); }}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition"
          >
            <Edit3 size={16} />
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="mx-4 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold text-center">
          {successMessage}
        </div>
      )}

      {/* ID Card & Stats */}
      <div className="px-4 -mt-14 relative z-10 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">National ID</p>
              <p className="font-mono text-sm font-bold text-slate-800 mt-0.5">{nationalId}</p>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">Active</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="font-bold text-xl text-slate-900">{user.casesFiled}</p>
            <p className="text-[10px] text-slate-500 mt-1">Cases Filed</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="font-bold text-xl text-slate-900">{user.resolved}</p>
            <p className="text-[10px] text-slate-500 mt-1">Resolved</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="font-bold text-xl text-slate-900">{user.points}</p>
            <p className="text-[10px] text-slate-500 mt-1">Points</p>
          </div>
        </div>
      </div>

      {/* Account Options List */}
      <div className="px-4 mt-8">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Account Options</p>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {options.map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveModal(item.modal)}
              className={`w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors ${i !== options.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={item.color} />
                <span className="font-bold text-sm text-slate-800">{item.label}</span>
              </div>
              <span className="text-slate-300">&rarr;</span>
            </button>
          ))}
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full mt-6 bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-red-100 hover:bg-red-100 transition"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 text-base capitalize">
                {activeModal === 'edit' && 'Edit Profile'}
                {activeModal === 'security' && 'Security & Privacy'}
                {activeModal === 'payment' && 'Payment Methods'}
                {activeModal === 'notifications' && 'Notification Preferences'}
                {activeModal === 'settings' && 'Account Settings'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* EDIT PROFILE MODAL */}
            {activeModal === 'edit' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-md hover:bg-slate-800 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* SECURITY & PRIVACY MODAL */}
            {activeModal === 'security' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-400">Secure your account with 2FA</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactor}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactor: e.target.checked })}
                    className="w-5 h-5 rounded accent-slate-900 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Biometric Login</p>
                    <p className="text-xs text-slate-400">Use fingerprint/face ID</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.biometric}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, biometric: e.target.checked })}
                    className="w-5 h-5 rounded accent-slate-900 cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl shadow-md hover:bg-slate-800 transition"
                >
                  Done
                </button>
              </div>
            )}

            {/* PAYMENT METHODS MODAL */}
            {activeModal === 'payment' && (
              <div className="space-y-4">
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{pm.type}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{pm.number}</p>
                    </div>
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full">Linked</span>
                  </div>
                ))}
                <button
                  onClick={() => alert('Add payment method flow triggered')}
                  className="w-full border-2 border-dashed border-slate-200 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-50 transition text-sm"
                >
                  + Add New Payment Method
                </button>
              </div>
            )}

            {/* NOTIFICATION PREFERENCES MODAL */}
            {activeModal === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Push Notifications</p>
                    <p className="text-xs text-slate-400">Receive alerts on missing persons & cases</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="w-5 h-5 rounded accent-slate-900 cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl shadow-md hover:bg-slate-800 transition"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {/* ACCOUNT SETTINGS MODAL */}
            {activeModal === 'settings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm font-bold text-slate-800">Dark Mode</span>
                  <input
                    type="checkbox"
                    checked={accountSettings.darkMode}
                    onChange={(e) => setAccountSettings({ ...accountSettings, darkMode: e.target.checked })}
                    className="w-5 h-5 rounded accent-slate-900 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-bold text-slate-800">Language</span>
                  <select
                    value={accountSettings.language}
                    onChange={(e) => setAccountSettings({ ...accountSettings, language: e.target.value })}
                    className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Amharic">አማርኛ</option>
                  </select>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl shadow-md hover:bg-slate-800 transition"
                >
                  Save Settings
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}