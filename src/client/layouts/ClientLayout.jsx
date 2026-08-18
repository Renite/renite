import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Globe, Bell, Home as HomeIcon, Map as MapIcon, Eye, MessageSquare, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function ClientLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/home', icon: HomeIcon, label: 'Home' },
    { path: '/map', icon: MapIcon, label: 'Map' },
    { path: '/assets', icon: Eye, label: 'AI Detect' }, // Used for Asset Tracker in MVP
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-white px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-slate-600">
            <Menu size={24} />
          </button>
          <div className="relative flex-1 max-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-slate-100 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-xs font-medium border border-slate-200 rounded-full px-2 py-1">
            <Globe size={14} /> EN
          </button>
          <button className="relative p-1 text-slate-600">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              3
            </span>
          </button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="h-16 bg-white border-t border-slate-200 absolute bottom-0 w-full flex justify-between items-center px-6 z-20">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link key={item.label} to={item.path} className={`flex flex-col items-center gap-1 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
              <item.icon size={22} className={isActive ? 'fill-slate-900' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}