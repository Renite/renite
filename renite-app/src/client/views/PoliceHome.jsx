import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Megaphone, 
  Search, 
  LogOut, 
  CheckCircle, 
  Clock, 
  User, 
  Home,
  BadgeAlert,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { api } from '../../services/api';

export default function PoliceHome() {
  const navigate = useNavigate();
  const [officerProfile, setOfficerProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setLoadingCases] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data states
  const [cases, setCases] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  // Navigation Tab State ('overview' | 'cases' | 'verify' | 'broadcast')
  const [activeTab, setActiveTab] = useState('overview');

  // Asset / Fayda Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchType, setSearchType] = useState('token');

  // Broadcast form state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  const fetchOfficerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) setOfficerProfile(data);
    } catch (err) {
      console.error('Error fetching officer profile:', err.message);
    }
  };


  const fetchCases = async () => {
  setLoadingCases(true);
  try {
    // Fetch both real tables in parallel via the backend
    const [assetsResponse, personsResponse] = await Promise.all([
      api.get('/reports/stolen-assets?limit=100'),
      api.get('/reports/emergency-reports?limit=100')
    ]);

    // Normalize stolen assets data
    const assetsData = (assetsResponse.data.assets || []).map((item) => ({
      ...item,
      type: 'asset',
      id: item.id,
      title: item.asset_name || 'Stolen Asset',
      description: item.description || item.details,
      assetToken: item.serial_number,
      createdAt: item.created_at
    }));

    // Normalize emergency reports data
    const personsData = (personsResponse.data.reports || []).map((item) => ({
      ...item,
      type: 'person',
      id: item.id,
      title: item.full_name || 'Missing Person',
      description: item.details || `Last seen: ${item.last_seen_location || 'Unknown'}`,
      faydaNumber: item.fayda_id,
      createdAt: item.created_at
    }));

    // Combine both tables into a single array and sort by newest first
    const combinedCases = [...assetsData, ...personsData].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    setCases(combinedCases);
  } catch (err) {
    console.error('Error fetching cases:', err.message);
  } finally {
    setLoadingCases(false);
  }
};

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err.message);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchOfficerData(),
        fetchCases(),
        fetchAnnouncements()
      ]);
    };

    loadInitialData();
  }, []);

  const STATUS_UI_TO_BACKEND = { 'Open': 'OPEN', 'Under Review': 'IN_PROGRESS', 'Closed': 'CLOSED' };

  const handleUpdateStatus = async (caseItem, newStatusUi) => {
    try {
      const status = STATUS_UI_TO_BACKEND[newStatusUi] || newStatusUi;
      const endpoint = caseItem.type === 'asset'
        ? `/reports/stolen-assets/${caseItem.id}/status`
        : `/reports/emergency-reports/${caseItem.id}/status`;
      await api.patch(endpoint, { status });
      fetchCases();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleSearchAsset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSearchResult(null);

    try {
      if (searchType === 'token') {
        const { data } = await api.get(`/reports/devices/lookup?token=${encodeURIComponent(searchQuery.trim())}`);
        setSearchResult({ type: 'device', data });
      } else {
        const { data } = await api.get(`/reports/citizens/lookup?fayda_id=${encodeURIComponent(searchQuery.trim())}`);
        setSearchResult({ type: 'citizen', data });
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('announcements').insert([
        {
          title: annTitle,
          content: annContent,
          author_id: user?.id || null,
        },
      ]);

      if (error) throw error;

      setSuccessMsg('Announcement successfully broadcasted to all citizens.');
      setAnnTitle('');
      setAnnContent('');
      fetchAnnouncements();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const openCasesCount = cases.filter(c => c.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* ================= TOP BAR ================= */}
      <header className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-30 border-b border-blue-900">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center border border-blue-700 shadow-inner">
            <ShieldAlert size={22} className="text-amber-400" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide flex items-center gap-2">
              Renite Law Enforcement <span className="hidden sm:inline text-[10px] bg-blue-900 px-2 py-0.5 rounded-full text-blue-200 uppercase font-mono">Command Portal</span>
            </h1>
            <p className="text-[11px] text-blue-300 font-mono">
              {officerProfile?.full_name ? `${officerProfile.full_name} • Badge: ${officerProfile.badge_number || 'N/A'}` : 'Loading officer details...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-200">{officerProfile?.station || 'Command Precinct'}</span>
            <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Secure Terminal Online
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-blue-900 hover:bg-blue-800 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-blue-800 shadow-sm"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ================= APP BODY LAYOUT (Sidebar + Main Content) ================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-4 space-y-2 shrink-0">
          <div className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-2">Navigation</div>
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-blue-950 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Home size={18} /> Command Overview
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'cases' ? 'bg-blue-950 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText size={18} /> Incident Cases
            </div>
            {openCasesCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'cases' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-amber-100 text-amber-800'}`}>
                {openCasesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'verify' ? 'bg-blue-950 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Search size={18} /> Asset & ID Verification
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'broadcast' ? 'bg-blue-950 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Megaphone size={18} /> Broadcast Alert
          </button>

          <div className="mt-auto pt-4 border-t border-slate-100 px-3 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-700">Renite Security Grid</p>
            <p className="text-[10px]">Federal Law Enforcement Framework v2.4</p>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* VIEW 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="space-y-2 z-10">
                    <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
                      <BadgeAlert size={16} /> Official Law Enforcement Portal
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                      Welcome back, {officerProfile?.full_name || 'Officer'}
                    </h2>
                    <p className="text-xs text-blue-200 max-w-md leading-relaxed">
                      Stationed at <strong className="text-white">{officerProfile?.station || 'General Precinct'}</strong>. Monitor active civilian asset reports, verify recovery tokens, and dispatch safety alerts across your jurisdiction.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 z-10 w-full md:w-auto">
                    <button 
                      onClick={() => setActiveTab('cases')} 
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={16} /> View Cases ({openCasesCount} Open)
                    </button>
                    <button 
                      onClick={() => setActiveTab('verify')} 
                      className="bg-blue-800 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-blue-700"
                    >
                      <Search size={16} /> Verify Asset / ID
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div onClick={() => setActiveTab('cases')} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-all group">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                        <AlertTriangle size={24} />
                      </div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Requires Attention</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{openCasesCount}</h3>
                    <p className="text-xs text-slate-500 font-medium">Active Open Incident Cases</p>
                  </div>

                  <div onClick={() => setActiveTab('verify')} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-all group">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-900 group-hover:scale-105 transition-transform">
                        <Search size={24} />
                      </div>
                      <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full">National Database</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Instant</h3>
                    <p className="text-xs text-slate-500 font-medium">Recovery Token & Fayda Check</p>
                  </div>

                  <div onClick={() => setActiveTab('broadcast')} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-all group">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                        <Megaphone size={24} />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{announcements.length} Published</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Broadcast</h3>
                    <p className="text-xs text-slate-500 font-medium">Community Safety Bulletins</p>
                  </div>
                </div>
              </>
            )}

            {/* VIEW 2: CASES */}
            {activeTab === 'cases' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Active Incident & Lost Asset Cases</h2>
                    <p className="text-xs text-slate-500">Review civilian reports and update case resolution statuses.</p>
                  </div>
                  <button onClick={fetchCases} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50">
                    Refresh Cases
                  </button>
                </div>

                {cases.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
                    <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="font-bold text-slate-700">No active cases reported</h3>
                    <p className="text-xs text-slate-400 mt-1">All citizen reports and lost items will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {cases.map((c) => (
                      <div key={c.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              c.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                              c.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {c.status}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock size={12} /> {new Date(c.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-base">{c.title}</h3>
                          <p className="text-xs text-slate-600 leading-relaxed">{c.description || 'No additional description provided.'}</p>

                          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-500 border-t border-slate-100">
                            <span><strong>Citizen:</strong> {c.profiles?.full_name || 'Unknown'} ({c.profiles?.phone || 'No phone'})</span>
                            <span><strong>Region:</strong> {c.profiles?.region || 'N/A'}</span>
                            {c.devices && (
                              <span className="text-blue-950 font-medium">
                                <strong>Device:</strong> {c.devices.brand} {c.devices.model} (SN: {c.devices.serial_number})
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase hidden md:block">Update Status:</span>
                          <button 
                            onClick={() => handleUpdateStatus(c, 'Open')} 
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${c.status === 'OPEN' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            Open
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(c, 'Under Review')} 
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${c.status === 'IN_PROGRESS' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            Under Review
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(c, 'Closed')} 
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${c.status === 'CLOSED' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            Resolve / Close
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: VERIFY */}
            {activeTab === 'verify' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">National Asset & Identity Verification</h2>
                  <p className="text-xs text-slate-500">Scan or look up device recovery tokens or national Fayda IDs during field stops.</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                    <button
                      type="button"
                      onClick={() => { setSearchType('token'); setSearchResult(null); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${searchType === 'token' ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-500'}`}
                    >
                      Device Recovery Token
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSearchType('fayda'); setSearchResult(null); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${searchType === 'fayda' ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-500'}`}
                    >
                      Fayda National ID
                    </button>
                  </div>

                  <form onSubmit={handleSearchAsset} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {searchType === 'token' ? 'Enter Recovery Token (e.g., RNT-XXXX)' : 'Enter 10-digit Fayda ID'}
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={searchType === 'token' ? 'RNT-A8B9C2' : '1234 5678 90'}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-blue-500"
                          required
                        />
                        <button type="submit" disabled={loading} className="bg-blue-950 hover:bg-blue-900 text-white px-6 rounded-xl font-bold text-sm shadow-md transition-colors">
                          {loading ? 'Searching...' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  </form>

                  {errorMsg && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mt-4 text-center">{errorMsg}</div>}
                </div>

                {searchResult && searchResult.type === 'device' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-emerald-800">
                      <CheckCircle size={24} className="text-emerald-600" />
                      <div>
                        <h3 className="font-bold text-base">Verified Legitimate Asset</h3>
                        <p className="text-xs text-emerald-600">This device is registered on the Renite national database.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-emerald-100 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-slate-400 block">Device Name:</span> <strong className="text-slate-800">{searchResult.data.device_name}</strong></div>
                        <div><span className="text-slate-400 block">Brand & Model:</span> <strong className="text-slate-800">{searchResult.data.brand} {searchResult.data.model}</strong></div>
                        <div><span className="text-slate-400 block">Serial Number:</span> <strong className="font-mono text-slate-800">{searchResult.data.serial_number}</strong></div>
                        <div><span className="text-slate-400 block">Recovery Token:</span> <strong className="font-mono text-blue-950">{searchResult.data.recovery_token}</strong></div>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-slate-400 block mb-1">Registered Owner:</span>
                        <strong className="text-slate-900 text-sm block">{searchResult.data.profiles?.full_name || 'Unknown Owner'}</strong>
                        <span className="text-slate-600">Phone: {searchResult.data.profiles?.phone} | Region: {searchResult.data.profiles?.region}</span>
                      </div>
                    </div>
                  </div>
                )}

                {searchResult && searchResult.type === 'citizen' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-blue-950">
                      <User size={24} className="text-blue-900" />
                      <div>
                        <h3 className="font-bold text-base">Citizen Profile Verified</h3>
                        <p className="text-xs text-blue-800">Fayda ID match found in national registry.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-blue-100 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-slate-400 block">Full Name:</span> <strong className="text-slate-800">{searchResult.data.full_name}</strong></div>
                        <div><span className="text-slate-400 block">Phone:</span> <strong className="text-slate-800">{searchResult.data.phone}</strong></div>
                        <div><span className="text-slate-400 block">Region / City:</span> <strong className="text-slate-800">{searchResult.data.region}, {searchResult.data.city}</strong></div>
                        <div><span className="text-slate-400 block">Role:</span> <strong className="uppercase text-blue-950">{searchResult.data.role}</strong></div>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-slate-400 block mb-2">Registered Devices ({searchResult.data.devices?.length || 0}):</span>
                        {searchResult.data.devices?.length === 0 ? (
                          <p className="text-slate-400 italic">No devices registered under this ID.</p>
                        ) : (
                          <div className="space-y-2">
                            {searchResult.data.devices.map(d => (
                              <div key={d.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between items-center">
                                <span>{d.brand} {d.model} ({d.serial_number})</span>
                                <span className="font-mono text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded">{d.recovery_token}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 4: BROADCAST */}
            {activeTab === 'broadcast' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Broadcast Community Safety Announcement</h2>
                  <p className="text-xs text-slate-500">Publish safety alerts, warnings, or recovery notices directly to citizen dashboards.</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  {errorMsg && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4 text-center">{errorMsg}</div>}
                  {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl mb-4 text-center">{successMsg}</div>}

                  <form onSubmit={handlePostAnnouncement} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Announcement Title <span className="text-red-500">*</span></label>
                      <input 
                        type="text"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        placeholder="e.g., Safety Warning: Vehicle Break-ins Reported in Bole Sub-City"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Alert Content & Details <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={5}
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        placeholder="Provide full instructions or safety details for citizens..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-blue-950 hover:bg-blue-900 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? 'Broadcasting...' : 'Publish Safety Announcement'} <Megaphone size={18} />
                    </button>
                  </form>
                </div>

                <div className="space-y-3 pt-4">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Active Announcements ({announcements.length})</h3>
                  {announcements.map(a => (
                    <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>{new Date(a.created_at).toLocaleDateString()}</span>
                        <span className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-bold uppercase">Official Bulletin</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{a.title}</h4>
                      <p className="text-xs text-slate-600">{a.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] flex justify-around items-center z-30 shadow-lg"
      >
        {[
          { id: 'overview', label: 'Home', icon: Home },
          { id: 'cases', label: 'Cases', icon: FileText, badge: openCasesCount },
          { id: 'verify', label: 'Verify', icon: Search },
          { id: 'broadcast', label: 'Broadcast', icon: Megaphone },
        ].map(({ id, label, icon: Icon, badge }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              aria-selected={isActive}
              role="tab"
              className={`relative flex flex-col items-center justify-center min-w-[64px] py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-amber-400 font-bold bg-amber-400/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                />
                {Boolean(badge && badge > 0) && (
                  <span className="absolute -top-1 -right-2.5 min-w-[18px] h-[18px] px-1 bg-amber-500 text-slate-950 rounded-full text-[9px] font-bold flex items-center justify-center leading-none ring-2 ring-slate-900">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}