import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Globe, X } from 'lucide-react';

export default function TopBar({ onOpenSidebar }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/assets?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNotificationClick = () => {
    setHasUnread(false);
    navigate('/notifications');
  };

  const toggleLanguage = (selectedLang) => {
    setLang(selectedLang);
    setShowLangMenu(false);
  };

  return (
    <header className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <button 
        onClick={onOpenSidebar}
        aria-label="Open sidebar menu"
        className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 transition"
      >
        <Menu className="w-5 h-5" />
      </button>

      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs mx-3 relative">
        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items, cases..."
          className="w-full bg-slate-100 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
        />
        {searchQuery && (
          <button 
            type="button" 
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </form>

      <div className="flex items-center gap-1.5 relative">
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
          >
            <Globe className="w-3 h-3" />
            <span>{lang}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1 w-24 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-40">
              <button 
                onClick={() => toggleLanguage('EN')}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-50 ${lang === 'EN' ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-600'}`}
              >
                English
              </button>
              <button 
                onClick={() => toggleLanguage('AM')}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-50 ${lang === 'AM' ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-600'}`}
              >
                አማርኛ
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={handleNotificationClick}
          aria-label="View notifications"
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 relative transition"
        >
          <Bell className="w-4 h-4" />
          {hasUnread && (
            <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" />
          )}
        </button>
      </div>
    </header>
  );
}