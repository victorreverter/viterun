import { PaceCalculator } from "@/components/calculators/PaceCalculator";
import { RacePredictor } from "@/components/calculators/RacePredictor";

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to your mission control. Analyze, predict, and optimize your marathon training.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <PaceCalculator />
        <RacePredictor />
      </div>

      {/* Placeholders for future components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-50 relative pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="px-4 py-2 bg-brand-surface border border-brand-surface-light rounded-full text-brand-lime font-medium text-sm shadow-lg">
            Physiology Lab Coming Soon
          </div>
        </div>
        <div className="bg-brand-surface rounded-2xl border border-brand-surface-light p-6 h-64 blur-[2px]" />
        <div className="bg-brand-surface rounded-2xl border border-brand-surface-light p-6 h-64 blur-[2px]" />
      </div>
    </div>
  );
}
