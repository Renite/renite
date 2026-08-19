import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, Layers, 
  CheckSquare, ShieldAlert, LogOut, X 
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const adminNavItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Missing Persons', path: '/admin/missing', icon: FileText },
    { label: 'Asset Inventory', path: '/admin/assets', icon: Layers },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Verifications', path: '/admin/verifications', icon: CheckSquare },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('renite_token');
    localStorage.removeItem('renite_user');
    onClose();
    navigate('/admin/auth');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white w-72 max-w-[80vw] h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-200">
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm"
                style={{ backgroundColor: '#0a2540' }}
              >
                R
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm leading-tight">RENITE ADMIN</h2>
                <p className="text-[10px] text-slate-500 font-medium">Control & Operations Panel</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition outline-none ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  style={isActive ? { backgroundColor: '#0a2540' } : {}}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition outline-none"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}