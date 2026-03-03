import { PaceCalculator } from "@/components/calculators/PaceCalculator";
import { RacePredictor } from "@/components/calculators/RacePredictor";
import { BodyFatCalculator } from "@/components/calculators/BodyFatCalculator";
import { HRZoneGenerator } from "@/components/calculators/HRZoneGenerator";

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to your mission control. Analyze, predict, and optimize your marathon training.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-2">
          <PaceCalculator />
          <RacePredictor />
        </div>

        {/* Physiology Lab Column */}
        <div className="flex flex-col gap-6">
          <HRZoneGenerator />
          <BodyFatCalculator />
        </div>
      </div>
    </div>
  );
}
