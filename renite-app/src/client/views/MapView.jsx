
export default function MapView() {
  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      <div className="absolute top-4 left-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xs font-bold">Safety Zones Map</h2>
          <p className="text-[10px] text-slate-400">Addis Ababa Central Region</p>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-emerald-500/30">
          Live Data
        </span>
      </div>

      <iframe
        title="Ethiopia Safety Map"
        width="100%"
        height="100%"
        className="w-full h-screen border-none"
        src="https://www.openstreetmap.org/export/embed.html?bbox=38.7000%2C8.9500%2C38.8000%2C9.0500&layer=mapnik"
      />
    </div>
  );
}