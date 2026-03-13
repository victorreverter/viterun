import { PaceCalculator } from "@/components/calculators/PaceCalculator";

export default function CalculatorsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-white">Calculators</h1>
        <p className="text-gray-400 mt-2">Essential math tools for your marathon training.</p>
      </div>

      <div className="max-w-2xl w-full">
        <div className="flex flex-col gap-6 w-full">
          <PaceCalculator />
        </div>
      </div>
    </div>
  );
}
