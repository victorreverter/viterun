import { RacePredictor } from "@/components/calculators/RacePredictor";

export default function PredictionsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-white">Predictions</h1>
        <p className="text-gray-400 mt-2">Forecast your race outcomes based on your current fitness.</p>
      </div>

      <div className="max-w-5xl w-full">
        <div className="flex flex-col gap-6 w-full">
          <RacePredictor />
        </div>
      </div>
    </div>
  );
}
