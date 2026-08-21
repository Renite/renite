import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { computeDeviceHash, registerDeviceOnChain, verifyDeviceOnChain } from '../../services/blockchain';
import {
  Shield, Plus, Search, X, Loader2, AlertCircle,
  CheckCircle2, ExternalLink, Link2, AlertTriangle
} from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────

function shortHash(hash) {
  if (!hash) return '—';
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

function explorerUrl(txHash) {
  // Adjust the base URL to match your deployed network (e.g. Sepolia, Polygon, etc.)
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}

// ─── sub-components ───────────────────────────────────────────────────────────

/**
 * Three-step status pill shown inside the registration modal while the
 * blockchain + Supabase flow is in progress.
 */
function BlockchainSteps({ step }) {
  const steps = [
    { id: 1, label: 'Hashing device ID' },
    { id: 2, label: 'Awaiting MetaMask…' },
    { id: 3, label: 'Syncing to Supabase' },
  ];
  return (
    <div className="space-y-1.5 py-1">
      {steps.map(({ id, label }) => {
        const done = step > id;
        const active = step === id;
        return (
          <div key={id} className="flex items-center gap-2 text-xs">
            {done ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : active ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
            )}
            <span className={done ? 'text-emerald-600' : active ? 'text-slate-800 font-medium' : 'text-slate-400'}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function AssetTracker() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [blockchainStep, setBlockchainStep] = useState(0); // 0 = idle, 1-3 = in-progress, 4 = done
  const [txError, setTxError] = useState(null);

  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'Laptop',
    serialNumber: '',
    macAddress: '',
    location: '',
  });

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // verify state per-asset (keyed by asset id)
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // ── fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const fetchAssets = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (!cancelled) setAssets(data || []);
      } catch (err) {
        console.error('Fetch assets error:', err);
        if (!cancelled) setFetchError('Could not connect to database server.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchAssets();
    return () => { cancelled = true; };
  }, []);

  // ── registration ───────────────────────────────────────────────────────────

  const resetRegisterForm = () => {
    setNewAsset({ name: '', category: 'Laptop', serialNumber: '', macAddress: '', location: '' });
    setBlockchainStep(0);
    setTxError(null);
    setIsRegistering(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.serialNumber || blockchainStep > 0) return;

    setTxError(null);

    try {
      // Step 1 — compute hash off-chain (instant, no wallet needed)
      setBlockchainStep(1);
      const deviceHash = computeDeviceHash(newAsset.serialNumber, newAsset.macAddress);

      // Step 2 — submit to smart contract via MetaMask
      setBlockchainStep(2);
      const { txHash, ownerWallet, onChainId } = await registerDeviceOnChain(deviceHash);

      // Step 3 — persist full record to Supabase
      setBlockchainStep(3);
      const { data, error: insertError } = await supabase
        .from('devices')
        .insert([{
          name: newAsset.name,
          serial_number: newAsset.serialNumber,
          mac_address: newAsset.macAddress || null,
          location: newAsset.location || null,
          device_hash: deviceHash,
          on_chain_id: onChainId,
          tx_hash: txHash,
          owner_wallet: ownerWallet,
          status: 'active',
          // legacy columns kept for backward compatibility with existing rows
          device_name: newAsset.name,
          device_type: newAsset.category,
          brand: newAsset.category,
        }])
        .select();

      if (insertError) throw insertError;

      setBlockchainStep(4); // done
      if (data && data[0]) setAssets(prev => [data[0], ...prev]);

      // brief pause so the user sees the "done" state, then close
      setTimeout(resetRegisterForm, 1200);
    } catch (err) {
      console.error('Registration failed:', err);
      setTxError(err.message || 'Registration failed. Please try again.');
      setBlockchainStep(0);
    }
  };

  // ── report lost ────────────────────────────────────────────────────────────

  const handleReportLost = async (id) => {
    try {
      const { error } = await supabase
        .from('devices')
        .update({ status: 'LOST' })
        .eq('id', id);

      if (error) throw error;

      setAssets(prev => prev.map(a => (a.id === id ? { ...a, status: 'LOST' } : a)));
      setSelectedAsset(prev => prev ? { ...prev, status: 'LOST' } : null);
    } catch (err) {
      console.error('Report lost error:', err);
      alert('Failed to update asset status.');
    }
  };

  // ── on-chain verify ────────────────────────────────────────────────────────

  const handleVerify = async (asset) => {
    if (!asset.on_chain_id || !asset.device_hash) {
      setVerifyResult({ error: 'This asset has no on-chain record to verify.' });
      return;
    }
    try {
      setVerifying(true);
      setVerifyResult(null);
      const result = await verifyDeviceOnChain(asset.on_chain_id, asset.device_hash);
      setVerifyResult(result);
    } catch (err) {
      console.error('Verify error:', err);
      setVerifyResult({ error: err.message || 'Verification failed.' });
    } finally {
      setVerifying(false);
    }
  };

  // ── filter ─────────────────────────────────────────────────────────────────

  const filteredAssets = assets.filter(asset => {
    const name   = asset.name || asset.device_name || '';
    const serial = asset.serial_number || asset.serial || '';
    const status = asset.status || 'active';

    const matchesTab    = activeTab === 'ALL' || status.toUpperCase() === activeTab;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          serial.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const isSubmitting = blockchainStep > 0 && blockchainStep < 4;

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 max-w-md mx-auto p-4 space-y-5">

      {/* ── header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Asset Protection</h1>
          <p className="text-xs text-slate-500">Register &amp; safeguard your electronics on-chain</p>
        </div>
        <button
          onClick={() => setIsRegistering(true)}
          className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-slate-800 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Register
        </button>
      </div>

      {/* ── search ── */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by asset name or serial code…"
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      {/* ── tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', 'ACTIVE', 'LOST', 'RECOVERED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── asset list ── */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <p className="text-xs text-slate-400">Loading assets from database…</p>
          </div>
        ) : fetchError ? (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{fetchError}</span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-1">
            <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No assets found</p>
            <p className="text-[11px] text-slate-400">Register your first item to begin tracking.</p>
          </div>
        ) : (
          filteredAssets.map(asset => {
            const assetName   = asset.name || asset.device_name;
            const assetSerial = asset.serial_number || asset.serial;
            const assetStatus = asset.status || 'active';
            const assetId     = asset.id;
            const isOnChain   = Boolean(asset.on_chain_id);

            return (
              <div
                key={assetId}
                onClick={() => {
                  setSelectedAsset({ ...asset, id: assetId, name: assetName, serial: assetSerial, status: assetStatus });
                  setVerifyResult(null);
                }}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-slate-300 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{assetName}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">S/N: {assetSerial}</p>
                    {isOnChain && (
                      <p className="text-[9px] text-blue-500 font-medium mt-0.5 flex items-center gap-0.5">
                        <Link2 className="w-2.5 h-2.5" /> On-chain #{asset.on_chain_id}
                      </p>
                    )}
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  assetStatus.toUpperCase() === 'ACTIVE' || assetStatus === 'active' || assetStatus === 'REGISTERED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : assetStatus.toUpperCase() === 'LOST'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {assetStatus.toUpperCase()}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          REGISTRATION MODAL  (tasks 4)
      ════════════════════════════════════════════════════════════════════ */}
      {isRegistering && (
        <div
          onClick={isSubmitting ? undefined : resetRegisterForm}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        >
          <form
            onSubmit={handleRegisterSubmit}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl p-5 max-w-xs w-full space-y-4 shadow-2xl relative"
          >
            {/* header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Register Device On-Chain</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Stored on blockchain + Supabase</p>
              </div>
              {!isSubmitting && (
                <button type="button" onClick={resetRegisterForm} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* fields */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Device Name *</label>
                <input
                  required
                  disabled={isSubmitting}
                  type="text"
                  value={newAsset.name}
                  onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="e.g. Emergency Radio"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Serial Number *</label>
                <input
                  required
                  disabled={isSubmitting}
                  type="text"
                  value={newAsset.serialNumber}
                  onChange={e => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                  placeholder="e.g. SN-998123"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">MAC Address <span className="normal-case text-slate-400">(optional)</span></label>
                <input
                  disabled={isSubmitting}
                  type="text"
                  value={newAsset.macAddress}
                  onChange={e => setNewAsset({ ...newAsset, macAddress: e.target.value })}
                  placeholder="e.g. AA:BB:CC:DD:EE:FF"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Location <span className="normal-case text-slate-400">(optional)</span></label>
                <input
                  disabled={isSubmitting}
                  type="text"
                  value={newAsset.location}
                  onChange={e => setNewAsset({ ...newAsset, location: e.target.value })}
                  placeholder="e.g. HQ Storage Room B"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                <select
                  disabled={isSubmitting}
                  value={newAsset.category}
                  onChange={e => setNewAsset({ ...newAsset, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Mobile">Mobile Phone</option>
                  <option value="Audio">Audio / Headphones</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Radio">Radio / Comms Device</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* blockchain progress steps */}
            {isSubmitting && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <BlockchainSteps step={blockchainStep} />
              </div>
            )}

            {/* success state */}
            {blockchainStep === 4 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Device registered on-chain and saved!</span>
              </div>
            )}

            {/* error state */}
            {txError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{txError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isSubmitting ? 'Confirming on Blockchain…' : 'Register Device'}
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              MetaMask will open to sign the transaction.
            </p>
          </form>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          ASSET DETAIL MODAL  (task 5)
      ════════════════════════════════════════════════════════════════════ */}
      {selectedAsset && (
        <div
          onClick={() => { setSelectedAsset(null); setVerifyResult(null); }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl p-5 max-w-xs w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => { setSelectedAsset(null); setVerifyResult(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            {/* title */}
            <div className="pr-6">
              <h3 className="font-bold text-slate-900 text-sm">{selectedAsset.name}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{selectedAsset.device_type || selectedAsset.category || 'Device'}</p>
            </div>

            {/* ── off-chain metadata ── */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Device Info</p>
              <Row label="Status">
                <span className={`font-bold ${
                  selectedAsset.status?.toUpperCase() === 'LOST' ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  {selectedAsset.status?.toUpperCase()}
                </span>
              </Row>
              <Row label="Serial">
                <span className="font-mono text-[10px]">{selectedAsset.serial}</span>
              </Row>
              {selectedAsset.mac_address && (
                <Row label="MAC">
                  <span className="font-mono text-[10px]">{selectedAsset.mac_address}</span>
                </Row>
              )}
              {selectedAsset.location && (
                <Row label="Location">{selectedAsset.location}</Row>
              )}
            </div>

            {/* ── on-chain reference ── */}
            {selectedAsset.on_chain_id ? (
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 space-y-1.5 text-xs">
                <p className="text-[10px] font-bold text-blue-400 uppercase mb-1 flex items-center gap-1">
                  <Link2 className="w-3 h-3" /> On-Chain Record
                </p>
                <Row label="Device ID">
                  <span className="font-mono font-bold text-blue-700">#{selectedAsset.on_chain_id}</span>
                </Row>
                <Row label="Device Hash">
                  <span className="font-mono text-[10px] text-blue-600 break-all">
                    {shortHash(selectedAsset.device_hash)}
                  </span>
                </Row>
                <Row label="Owner Wallet">
                  <span className="font-mono text-[10px] text-slate-600 break-all">
                    {shortHash(selectedAsset.owner_wallet)}
                  </span>
                </Row>
                {selectedAsset.tx_hash && (
                  <Row label="Tx Hash">
                    <a
                      href={explorerUrl(selectedAsset.tx_hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] text-blue-500 hover:underline flex items-center gap-0.5"
                    >
                      {shortHash(selectedAsset.tx_hash)}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </Row>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>No on-chain record — registered off-chain only.</span>
              </div>
            )}

            {/* ── verify result ── */}
            {verifyResult && !verifyResult.error && (
              <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                verifyResult.isVerified
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  {verifyResult.isVerified
                    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Hash verified — record is authentic</>
                    : <><AlertCircle className="w-3.5 h-3.5" /> Hash mismatch — record may be tampered</>
                  }
                </div>
                <p className="text-[10px]">Owner: <span className="font-mono">{shortHash(verifyResult.onChainOwner)}</span></p>
                <p className="text-[10px]">Registered: {verifyResult.registeredAt}</p>
              </div>
            )}

            {verifyResult?.error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{verifyResult.error}</span>
              </div>
            )}

            {/* ── action buttons ── */}
            <div className="space-y-2">
              {/* verify on-chain — only shown when on_chain_id exists */}
              {selectedAsset.on_chain_id && (
                <button
                  disabled={verifying}
                  onClick={() => handleVerify(selectedAsset)}
                  className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {verifying
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying on-chain…</>
                    : <><Shield className="w-3.5 h-3.5" /> Verify On-Chain</>
                  }
                </button>
              )}

              {/* report lost */}
              {selectedAsset.status?.toUpperCase() !== 'LOST' && (
                <button
                  onClick={() => handleReportLost(selectedAsset.id)}
                  className="w-full bg-rose-500 text-white py-2 rounded-xl font-bold text-xs hover:bg-rose-600 transition active:scale-95"
                >
                  Report Lost / Stolen
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── tiny layout helper ───────────────────────────────────────────────────────
function Row({ label, children }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-800 text-right">{children}</span>
    </div>
  );
}
