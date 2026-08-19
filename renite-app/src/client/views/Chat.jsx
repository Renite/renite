import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Search, Loader2, MessageSquare } from 'lucide-react';

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fallback mock data in case backend routes are still being set up
    const mockConversations = [
      { _id: '1', name: 'Federal Police - Bole Branch', time: '10:42 AM', preview: 'We have dispatched a unit to the loc...', unread: 2, icon: 'F' },
      { _id: '2', name: 'Abebe Kebede', time: 'Yesterday', preview: "Yes, that's my laptop! I can verify the seri...", unread: 0, icon: 'A', bg: 'bg-purple-500' },
      { _id: '3', name: 'Community Alert', time: 'Mon', preview: 'Update on missing person: Found safe.', unread: 0, icon: 'C' },
    ];

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await api.get('/conversations').catch(() => null);
        setConversations(Array.isArray(data) && data.length > 0 ? data : mockConversations);
      } catch (err) {
        console.error(err);
        setConversations(mockConversations);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchConversations, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const filteredConversations = conversations.filter(convo =>
    (convo.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (convo.preview || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen max-w-md mx-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Messages</h1>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      <div className="flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <p className="text-xs text-slate-400">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No messages found</p>
          </div>
        ) : (
          filteredConversations.map((msg, i) => (
            <div 
              key={msg._id || i} 
              className="flex items-center gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full ${msg.bg || 'bg-slate-900'} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                  {msg.icon || msg.name?.charAt(0) || 'U'}
                </div>
                {i !== 1 && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold text-sm truncate ${msg.unread ? 'text-slate-900' : 'text-slate-700'}`}>{msg.name}</h3>
                  <span className={`text-[10px] shrink-0 ${msg.unread ? 'font-bold text-slate-900' : 'text-slate-400'}`}>{msg.time || 'Today'}</span>
                </div>
                <p className={`text-xs truncate ${msg.unread ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                  {msg.preview}
                </p>
              </div>
              {msg.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {msg.unread}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}