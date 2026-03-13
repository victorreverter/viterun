export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to your mission control. Your PRs, saved stats, and logs will appear here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Next Race Widget */}
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20">
            <h3 className="text-brand-lime font-mono text-sm tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-lime shadow-[0_0_8px_#CCFF00]"></span>
              NEXT RACE
            </h3>
            <div className="flex-1 flex flex-col justify-center py-4">
                <div className="text-4xl font-bold text-white mb-2">TBD</div>
                <p className="text-gray-400 text-sm leading-relaxed">No target race set. Select a future marathon date to begin the countdown.</p>
            </div>
            <button className="w-full py-2 bg-brand-surface-light hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors">Setup Race</button>
        </div>

        {/* Weekly Volume Widget */}
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20">
            <h3 className="text-brand-lime font-mono text-sm tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              WEEKLY VOLUME
            </h3>
            <div className="flex-1 flex flex-col justify-center py-4">
                <div className="text-4xl font-bold text-white mb-2">0.0<span className="text-xl text-gray-500 ml-1">km</span></div>
                <p className="text-gray-400 text-sm leading-relaxed">Log your first run to start analyzing your weekly mileage peak.</p>
            </div>
            <button className="w-full py-2 bg-brand-surface-light hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors">Log Run</button>
        </div>

        {/* Current Target Pace Widget */}
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20">
            <h3 className="text-brand-lime font-mono text-sm tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"></span>
              TARGET PACE
            </h3>
            <div className="flex-1 flex flex-col justify-center py-4">
                <div className="text-4xl font-bold text-white mb-2">--:--<span className="text-xl text-gray-500 ml-1">/km</span></div>
                <p className="text-gray-400 text-sm leading-relaxed">Calculate your marathon pace in the tools tab to save it here.</p>
            </div>
            <button className="w-full py-2 bg-brand-surface-light hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors">Calculate Pace</button>
        </div>
      </div>
    </div>
  );
}
