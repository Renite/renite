import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, ShieldAlert } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      
      {/* Admin Sidebar Component */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Top Admin Header Bar */}
      <header className="h-16 bg-white px-4 flex items-center justify-between z-40 relative shadow-xs border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-slate-600 hover:text-slate-900 transition outline-none"
            aria-label="Open Admin Menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">Admin Control Center</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-600">
          <ShieldAlert size={14} style={{ color: '#0a2540' }} />
          <span>Secure Mode</span>
        </div>
      </header>

      {/* Main Admin View Content Outlet */}
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        <Outlet />
      </main>

    </div>
  );
}