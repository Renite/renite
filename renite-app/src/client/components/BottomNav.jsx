import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Shield, 
  MessageSquare, 
  User, 
  Plus, 
  X, 
  Folder, 
  Database, 
  FileEdit, 
  UserCheck, 
  QrCode, 
  ChevronRight, 
  Camera, 
  Globe, 
  Activity, 
  FileText 
} from 'lucide-react';
import QRScannerModal from './QRScannerModal'; // Adjust import path if needed based on folder structure

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleAction = (route) => {
    setIsActionMenuOpen(false);
    navigate(route);
  };

  const handleOpenScanner = () => {
    setIsActionMenuOpen(false); // Close the bottom sheet action menu
    setIsScannerOpen(true);    // Open the QR scanner modal
  };

  const handleScanSuccess = (data) => {
    setIsScannerOpen(false);
    if (data?.id) {
      navigate(`/assets/${data.id}`);
    }
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex justify-between items-center z-30">
        <button
          onClick={() => navigate('/home')}
          className={`flex flex-col items-center gap-1 py-1 w-14 transition ${
            location.pathname === '/home' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${location.pathname === '/home' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => navigate('/assets')}
          className={`flex flex-col items-center gap-1 py-1 w-14 transition ${
            location.pathname === '/assets' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Shield className={`w-5 h-5 ${location.pathname === '/assets' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span className="text-[10px]">Assets</span>
        </button>

        {/* TikTok Style Plus Button */}
        <button
          onClick={() => setIsActionMenuOpen(true)}
          className="flex flex-col items-center justify-center -mt-5 relative z-10 w-16"
        >
          <div className="w-12 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition-all active:scale-95">
            <Plus className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
        </button>

        <button
          onClick={() => navigate('/chat')}
          className={`flex flex-col items-center gap-1 py-1 w-14 transition ${
            location.pathname === '/chat' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare className={`w-5 h-5 ${location.pathname === '/chat' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span className="text-[10px]">Chat</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center gap-1 py-1 w-14 transition ${
            location.pathname === '/profile' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className={`w-5 h-5 ${location.pathname === '/profile' ? 'text-slate-900' : 'text-slate-400'}`} />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

      {/* Action Menu Modal (Bottom Sheet) */}
      {isActionMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center max-w-md mx-auto">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsActionMenuOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full bg-[#0f172a] rounded-t-3xl p-5 pb-8 animate-in slide-in-from-bottom-full duration-300">
            {/* Handle/Indicator */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-5 opacity-50" />

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-indigo-400 text-[10px] font-bold tracking-widest mb-1 uppercase">Actions</p>
                <h2 className="text-white text-2xl font-bold">Resource & Verify</h2>
              </div>
              <button 
                onClick={() => setIsActionMenuOpen(false)} 
                className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => handleAction('/assets')} 
                className="bg-[#fffbeb] p-4 rounded-2xl text-left hover:scale-[0.98] transition shadow-sm"
              >
                <Folder className="text-amber-500 mb-3 w-6 h-6" />
                <h3 className="text-slate-900 font-bold text-sm mb-1">Catalog My Asset</h3>
                <p className="text-slate-600 text-[10px] leading-snug">Digitize, tag, and organize your assets.</p>
              </button>

              <button 
                onClick={() => handleAction('/volunteers')} 
                className="bg-[#eff6ff] p-4 rounded-2xl text-left hover:scale-[0.98] transition shadow-sm"
              >
                <Database className="text-blue-500 mb-3 w-6 h-6" />
                <h3 className="text-slate-900 font-bold text-sm mb-1">Verify Credentials</h3>
                <p className="text-slate-600 text-[10px] leading-snug">Verify volunteer background & certs.</p>
              </button>

              <button 
                onClick={() => handleAction('/emergency-report')} 
                className="bg-slate-800 p-4 rounded-2xl text-left hover:scale-[0.98] transition border border-slate-700/50"
              >
                <FileEdit className="text-slate-300 mb-3 w-6 h-6" />
                <h3 className="text-white font-bold text-sm mb-1">Report Asset Issue</h3>
                <p className="text-slate-400 text-[10px] leading-snug">Document damage & submit logs.</p>
              </button>

              <button 
                onClick={() => handleAction('/volunteers')} 
                className="bg-slate-800 p-4 rounded-2xl text-left hover:scale-[0.98] transition border border-slate-700/50"
              >
                <UserCheck className="text-slate-300 mb-3 w-6 h-6" />
                <h3 className="text-white font-bold text-sm mb-1">Quick Volunteer Check-In</h3>
                <p className="text-slate-400 text-[10px] leading-snug">Enable rapid volunteer tracking with QR.</p>
              </button>
            </div>

            {/* Wide QR Scanner Button - FIXED TO OPEN SCANNER INSTEAD OF /track */}
            <button 
              onClick={handleOpenScanner} 
              className="w-full bg-[#1e1b4b] border-2 border-indigo-500/30 hover:border-indigo-500/60 p-4 rounded-2xl flex items-center justify-between mb-8 hover:scale-[0.98] transition group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl text-slate-900 shadow-sm">
                  <QrCode className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-sm mb-0.5">Verify Via QR Scan</h3>
                  <p className="text-indigo-200 text-[11px] font-medium">Instant asset & personnel check</p>
                  <p className="text-indigo-400 text-[10px] font-medium mt-1">Scanner active — point at code</p>
                </div>
              </div>
              <div className="bg-indigo-600 p-2.5 rounded-full text-white group-hover:bg-indigo-500 shadow-lg transition">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* More Tools Row */}
            <div>
              <p className="text-slate-500 text-[10px] font-bold tracking-widest mb-4 uppercase">More Tools</p>
              <div className="flex justify-between gap-2">
                <button onClick={() => handleAction('/assets')} className="flex flex-col items-center gap-2 group flex-1">
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition w-full flex justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-slate-400 text-[9px] font-medium whitespace-nowrap">Photo Log Asset</span>
                </button>
                
                <button onClick={() => handleAction('/map')} className="flex flex-col items-center gap-2 group flex-1">
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition w-full flex justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-slate-400 text-[9px] font-medium whitespace-nowrap">Assign Location</span>
                </button>
                
                <button onClick={() => handleAction('/track')} className="flex flex-col items-center gap-2 group flex-1">
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition w-full flex justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-slate-400 text-[9px] font-medium whitespace-nowrap">Analyze Usage</span>
                </button>
                
                <button onClick={() => handleAction('/assets')} className="flex flex-col items-center gap-2 group flex-1">
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition w-full flex justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-slate-400 text-[9px] font-medium whitespace-nowrap">Import CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal Triggered from BottomNav */}
      {isScannerOpen && (
        <QRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </>
  );
}