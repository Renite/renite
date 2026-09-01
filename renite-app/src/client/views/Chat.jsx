import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../supabase';
import { Search, Loader2, MessageSquare, Plus, Bot, Send, X, ArrowLeft } from 'lucide-react';

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Chat State
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // New Conversation Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Deduplicate by conversation name to avoid rendering duplicate records
      const uniqueData = Array.from(
        new Map((data || []).map(item => [item.name.trim().toLowerCase(), item])).values()
      );

      setConversations(uniqueData);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchConversations();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchConversations]);

  const openConversation = async (convo) => {
    setActiveConvo(convo);
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convo.id)
        .order('created_at', { ascending: true });

      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreateConversation = async (e) => {
    e.preventDefault();
    const trimmedName = newChatName.trim();
    if (!trimmedName) return;

    // Check if conversation already exists locally
    const existing = conversations.find(c => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (existing) {
      setShowNewModal(false);
      setNewChatName('');
      openConversation(existing);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{ 
          name: trimmedName, 
          preview: 'Conversation started', 
          unread: 0, 
          icon: trimmedName.charAt(0).toUpperCase() 
        }])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setConversations(prev => [data[0], ...prev]);
        openConversation(data[0]);
      }
      setShowNewModal(false);
      setNewChatName('');
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  };

  const handleStartGeminiSupport = async () => {
    let supportConvo = conversations.find(c => c.name.toLowerCase() === 'gemini support bot');

    if (!supportConvo) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .insert([{ 
            name: 'Gemini Support Bot', 
            preview: 'How can I help you today?', 
            unread: 0, 
            icon: '🤖', 
            bg: 'bg-emerald-600' 
          }])
          .select();

        if (error) throw error;
        supportConvo = data[0];
        setConversations(prev => [supportConvo, ...prev]);
      } catch (err) {
        console.error('Failed to initialize AI Support:', err);
        return;
      }
    }
    openConversation(supportConvo);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvo) return;

    const userText = newMessage;
    setNewMessage('');
    setSending(true);

    try {
      const { data: userMsgObj } = await supabase
        .from('messages')
        .insert([{ conversation_id: activeConvo.id, sender: 'user', content: userText }])
        .select();

      if (userMsgObj) setMessages(prev => [...prev, userMsgObj[0]]);

      await supabase
        .from('conversations')
        .update({ preview: userText })
        .eq('id', activeConvo.id);

      if (activeConvo.name.toLowerCase() === 'gemini support bot') {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          alert('Missing VITE_GEMINI_API_KEY in environment variables.');
          setSending(false);
          return;
        }

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: `You are a helpful customer support assistant for an asset protection and community platform. Keep responses concise and friendly. User query: ${userText}` }]
                }
              ]
            })
          }
        );

        const aiData = await response.json();
        const aiReply = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request right now.";

        const { data: aiMsgObj } = await supabase
          .from('messages')
          .insert([{ conversation_id: activeConvo.id, sender: 'ai', content: aiReply }])
          .select();

        if (aiMsgObj) setMessages(prev => [...prev, aiMsgObj[0]]);

        await supabase
          .from('conversations')
          .update({ preview: aiReply })
          .eq('id', activeConvo.id);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
      fetchConversations();
    }
  };

  const filteredConversations = conversations.filter(convo =>
    (convo.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (convo.preview || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen max-w-md mx-auto relative pb-20">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <div className="flex gap-2">
            <button 
              onClick={handleStartGeminiSupport}
              className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition"
            >
              <Bot className="w-3.5 h-3.5" /> AI Support
            </button>
            <button 
              onClick={() => setShowNewModal(true)}
              className="bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative">
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
          filteredConversations.map((msg) => (
            <div 
              key={msg.id} 
              onClick={() => openConversation(msg)}
              className="flex items-center gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
            >
              <div className={`w-12 h-12 rounded-full ${msg.bg || 'bg-slate-900'} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                {msg.icon || msg.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate text-slate-900">{msg.name}</h3>
                <p className="text-xs truncate text-slate-500">{msg.preview || 'No messages yet'}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {activeConvo && (
        <div className="fixed inset-0 bg-white z-50 max-w-md mx-auto flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
            <button onClick={() => setActiveConvo(null)} className="p-1 hover:bg-slate-200 rounded-full">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div className={`w-9 h-9 rounded-full ${activeConvo.bg || 'bg-slate-900'} text-white flex items-center justify-center font-bold text-sm`}>
              {activeConvo.icon || activeConvo.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">{activeConvo.name}</h2>
              <p className="text-[10px] text-emerald-600 font-medium">Online</p>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.length === 0 ? (
              <p className="text-center text-xs text-slate-400 mt-8">Send a message to start the conversation.</p>
            ) : (
              messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                      isUser ? 'bg-slate-900 text-white rounded-br-xs' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                );
              })
            )}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button type="submit" disabled={sending} className="bg-slate-900 text-white p-2.5 rounded-full hover:bg-slate-800 transition disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateConversation} className="bg-white rounded-2xl p-5 max-w-xs w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Start New Conversation</h3>
              <button type="button" onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Contact / Recipient Name</label>
              <input 
                required
                type="text" 
                value={newChatName} 
                onChange={(e) => setNewChatName(e.target.value)}
                placeholder="e.g. Police Department, Support"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none mt-1"
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition">
              Create Chat
            </button>
          </form>
        </div>
      )}
    </div>
  );
}