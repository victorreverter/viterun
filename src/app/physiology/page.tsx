import { BodyFatCalculator } from "@/components/calculators/BodyFatCalculator";
import { HRZoneGenerator } from "@/components/calculators/HRZoneGenerator";

export default function PhysiologyPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-white">Physiology Lab</h1>
        <p className="text-gray-400 mt-2">Analyze your body composition and training zones.</p>
      </div>

      <div className="max-w-5xl w-full">
        <div className="flex flex-col gap-6 w-full">
          <HRZoneGenerator />
          <BodyFatCalculator />
        </div>
      </div>
    </div>
  );
}
