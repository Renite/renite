import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, Search, Globe, Bell, Check, X, 
  Home, ShieldAlert, MapPin, MessageSquare, 
  User, Users, FileText, Layers 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BottomNav from '../components/BottomNav';
import { Award } from 'lucide-react';
const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'AM', label: 'አማርኛ' },
  { code: 'OM', label: 'Afaan Oromoo' },
  { code: 'TI', label: 'ትግርኛ' },
  { code: 'AR', label: 'العربية' },
  { code: 'SN', label: 'SNNPR' }
];

export default function ClientLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // States for interactive dropdowns & sidebar drawer
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dummy Notifications Data
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsLangMenuOpen(false);
  };

  const sidebarLinks = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/assets', label: 'Asset Tracker', icon: Layers },
    { path: '/map', label: 'Map View', icon: MapPin },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/emergency-report', label: 'Emergency Report', icon: ShieldAlert },
    { path: '/volunteers', label: 'Volunteers', icon: Users },
    { path: '/missing-person', label: 'Missing Persons', icon: FileText },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/rewards', label: 'Rewards & Bounties', icon: Award },
  ];

  const isRtl = i18n.language === 'AR';

  return (
    <div className={`flex flex-col h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* Invisible/Blurred overlay to close dropdowns and sidebar when clicking outside */}
      {(isLangMenuOpen || isNotifOpen || isSidebarOpen) && (
        <div 
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-xs transition-opacity" 
          onClick={() => { 
            setIsLangMenuOpen(false); 
            setIsNotifOpen(false); 
            setIsSidebarOpen(false); 
          }}
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')
      }`}>
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span>Navigation Menu</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-300 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition outline-none [-webkit-tap-highlight-color:transparent] ${
                  isActive 
                    ? 'text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                style={isActive ? { backgroundColor: '#0a2540' } : {}}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
          Client App Dashboard v1.0
        </div>
      </aside>

      {/* Top Bar */}
      <header className="h-16 bg-white px-4 flex items-center justify-between z-40 relative shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={() => { 
              setIsSidebarOpen(true); 
              setIsLangMenuOpen(false); 
              setIsNotifOpen(false); 
            }}
            className="p-1 text-slate-600 hover:text-slate-900 transition"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          <div className="relative flex-1 max-w-[190px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('search')} 
              dir={isRtl ? 'rtl' : 'ltr'}
              className="w-full bg-slate-100 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ '--tw-ring-color': '#0a2540' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          
          {/* LANGUAGE BUTTON & DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => { setIsLangMenuOpen(!isLangMenuOpen); setIsNotifOpen(false); setIsSidebarOpen(false); }}
              className="flex items-center gap-1 text-xs font-medium border border-slate-200 rounded-full px-2.5 py-1 hover:bg-slate-50 transition"
            >
              <Globe size={14} /> {i18n.language}
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition"
                  >
                    {lang.label}
                    {i18n.language === lang.code && <Check size={16} style={{ color: '#0a2540' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* NOTIFICATION BUTTON & DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsLangMenuOpen(false); setIsSidebarOpen(false); }}
              className="relative p-1.5 text-slate-600 hover:text-slate-900 transition"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white" style={{ backgroundColor: '#0a2540' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-800 text-sm">{t('notifications')}</h3>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="text-[10px] font-medium hover:underline flex items-center gap-1" style={{ color: '#0a2540' }}>
                      {t('markRead')}
                    </button>
                  )}
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-500">{t('emptyNotif')}</div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`px-4 py-3 border-b border-slate-50 text-sm transition hover:bg-slate-50 cursor-pointer ${notif.unread ? 'bg-slate-100/60' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-slate-800 ${notif.unread ? 'font-semibold' : ''}`}>{notif.text}</p>
                          {notif.unread && <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#0a2540' }}></span>}
                        </div>
                        <p className="text-xs text-slate-400">{notif.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
      
    </div>
  );
}