import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  FolderPlus, 
  ShieldCheck, 
  FileText, 
  QrCode, 
  Camera, 
  MapPin, 
  BarChart2, 
  FileUp,
  ArrowRight
} from 'lucide-react';
import QRScannerModal from '../components/QRScannerModal';

export default function QuickActionModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  if (!isOpen) return null;

  const handleOpenScanner = (e) => {
    if (e) e.stopPropagation();
    console.log("🚀 QR BUTTON CLICKED - OPENING SCANNER MODAL"); // Watch your browser console (F12)
    setIsScannerOpen(true);
  };

  const handleScanSuccess = () => {
    setIsScannerOpen(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end justify-center sm:items-center">
        <div className="bg-slate-900 text-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-5">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase block">ACTIONS</span>
              <h2 className="text-lg font-bold">Resource & Verify</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Primary Action Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { onClose(); navigate('/register'); }}
              className="bg-amber-100/10 border border-amber-500/20 rounded-2xl p-4 text-left hover:bg-amber-100/20 transition"
            >
              <div className="w-8 h-8 bg-amber-200/20 text-amber-400 rounded-xl flex items-center justify-center mb-2">
                <FolderPlus className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-amber-200">Catalog My Asset</h3>
              <p className="text-[10px] text-amber-300/70 mt-0.5">Digitize, tag, and organize your assets.</p>
            </button>

            <button
              onClick={() => { onClose(); navigate('/volunteer-network'); }}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-800 transition"
            >
              <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-100">Verify Credentials</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Verify volunteer background & certs.</p>
            </button>

            <button
              onClick={() => { onClose(); navigate('/report-asset'); }}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-800 transition"
            >
              <div className="w-8 h-8 bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-100">Report Asset Issue</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Document damage & submit logs.</p>
            </button>

            {/* QR Scanner Trigger Button */}
            <button
              onClick={handleOpenScanner}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-800 transition"
            >
              <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-2">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-100">Scan QR Code</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Instant asset & personnel check.</p>
            </button>
          </div>

          {/* QR Scan Feature Row - Activated Trigger */}
          <div 
            onClick={handleOpenScanner}
            className="bg-indigo-950/60 border border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-indigo-900/60 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/30 border border-indigo-500/40 rounded-xl flex items-center justify-center text-indigo-400">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Verify Via QR Scan</h4>
                <p className="text-[10px] text-indigo-300">Instant asset & personnel check</p>
              </div>
            </div>
            <div className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* More Tools Footer Toolbar */}
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2 font-bold">More Tools</span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-slate-800/50 rounded-xl flex flex-col items-center cursor-pointer hover:bg-slate-800">
                <Camera className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-[9px] text-slate-400">Photo Log</span>
              </div>
              <div className="p-2 bg-slate-800/50 rounded-xl flex flex-col items-center cursor-pointer hover:bg-slate-800">
                <MapPin className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-[9px] text-slate-400">Assign Location</span>
              </div>
              <div className="p-2 bg-slate-800/50 rounded-xl flex flex-col items-center cursor-pointer hover:bg-slate-800">
                <BarChart2 className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-[9px] text-slate-400">Analyze Usage</span>
              </div>
              <div className="p-2 bg-slate-800/50 rounded-xl flex flex-col items-center cursor-pointer hover:bg-slate-800">
                <FileUp className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-[9px] text-slate-400">Import CSV</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded QR Scanner Modal */}
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