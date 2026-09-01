import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const processScannedCode = useCallback(async (code) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('devices')
        .select('*')
        .or(`qr_code.eq.${code},recovery_token.eq.${code}`)
        .maybeSingle();

      if (dbError) throw dbError;

      if (!data) {
        setError(`No matching asset found for code: "${code}"`);
        setLoading(false);
        return;
      }

      if (onScanSuccess) {
        onScanSuccess(data);
      }

      onClose();
      navigate(`/assets/${data.id}`);
    } catch (err) {
      console.error('Supabase QR verification error:', err);
      setError('Database verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate, onClose, onScanSuccess]);

  useEffect(() => {
    if (!isOpen) return;

    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current, (result) => {
        if (result) {
          const text = result.getText();
          if (codeReaderRef.current) {
            codeReaderRef.current.reset();
          }
          void processScannedCode(text);
        }
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        setError('Unable to access camera. Please check permissions or type code manually.');
      });

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [isOpen, processScannedCode]);

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      if (codeReaderRef.current) codeReaderRef.current.reset();
      void processScannedCode(manualCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white w-full max-w-sm rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-4 relative">
        <button
          onClick={() => {
            if (codeReaderRef.current) codeReaderRef.current.reset();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>

        <div>
          <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase block">VERIFY</span>
          <h3 className="text-base font-bold">QR Scanner</h3>
        </div>

        {/* Viewfinder Window */}
        <div className="relative aspect-square w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" />
          
          {loading && (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-xs font-semibold text-slate-200">Verifying code with Supabase...</p>
            </div>
          )}

          {!error && !loading && (
            <div className="absolute inset-0 border-2 border-indigo-500/50 m-8 rounded-xl flex flex-col justify-between p-2 pointer-events-none animate-pulse">
              <div className="w-4 h-4 border-t-2 border-l-2 border-indigo-400"></div>
              <div className="w-4 h-4 border-b-2 border-r-2 border-indigo-400 self-end"></div>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 bg-slate-900/95 p-4 flex flex-col items-center justify-center text-center gap-2">
              <AlertCircle className="w-8 h-8 text-rose-500" />
              <p className="text-xs text-slate-300">{error}</p>
            </div>
          )}
        </div>

        {/* Manual Fallback Input */}
        <form onSubmit={handleManualSubmit} className="space-y-2">
          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Manual Entry</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter asset or token code..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center min-w-16 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}