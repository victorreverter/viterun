"use client";

import { PaceCalculator } from "@/components/calculators/PaceCalculator";
import { RacePredictor } from "@/components/calculators/RacePredictor";
import { BodyFatCalculator } from "@/components/calculators/BodyFatCalculator";
import { HRZoneGenerator } from "@/components/calculators/HRZoneGenerator";
import { NextRaceWidget } from "@/components/dashboard/NextRaceWidget";
import { PersonalRecordsWidget } from "@/components/dashboard/PersonalRecordsWidget";
import { StravaWidget } from "@/components/dashboard/StravaWidget";
import { useSearchStore } from "@/store/useSearchStore";
import { useUserStore } from "@/store/useUserStore";

const CALCULATORS = [
  { name: "Race Predictor", component: <div key="race" className="col-span-1 md:col-span-2"><RacePredictor /></div> },
  { name: "HR Zones Generator", component: <div key="hr" className="col-span-1 md:col-span-2"><HRZoneGenerator /></div> },
  { name: "Pace Calculator", component: <div key="pace" className="col-span-1"><PaceCalculator /></div> },
  { name: "Body Fat Calculator", component: <div key="fat" className="col-span-1"><BodyFatCalculator /></div> },
];

export default function Home() {
  const { query } = useSearchStore();
  const { targetPace, triggerPaceHighlight } = useUserStore();

  const handleScrollToPaceCalc = () => {
    document.getElementById("pace-calculator")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
        triggerPaceHighlight();
    }, 300); // Small delay to let the scroll happen first
  };

  const filteredCalculators = CALCULATORS.filter(calc => 
    calc.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-foreground">Runner Profile</h1>
        <p className="text-gray-400 mt-2">Welcome to your mission control. Your PRs, saved stats, and logs will appear here.</p>
      </div>

      {/* Strava Integration Widget - Full Width */}
      <div className="w-full">
        <StravaWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Next Race Widget */}
        <NextRaceWidget />

        {/* Personal Records Widget */}
        <PersonalRecordsWidget />

        {/* Current Target Pace Widget */}
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/20">
            <h3 className="text-brand-lime font-mono text-sm tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"></span>
              TARGET PACE
            </h3>
            <div className="flex-1 flex flex-col justify-center py-4">
                <div className="text-4xl font-bold text-foreground mb-2">
                    {targetPace ? targetPace.split("/")[0] : "--:--"}
                    <span className="text-xl text-gray-500 ml-1">
                        /{targetPace ? targetPace.split("/")[1] : "km"}
                    </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                    {targetPace ? "Your saved target pace. Crush it!" : "Calculate your target pace below to save it here."}
                </p>
            </div>
            <button 
                onClick={handleScrollToPaceCalc}
                className="w-full py-2 bg-brand-surface-light hover:bg-brand-surface-light/80 text-foreground rounded-lg text-sm font-medium transition-colors"
            >
                {targetPace ? "Update Pace" : "Calculate Pace"}
            </button>
        </div>
      </div>

      <div className="pt-8 border-t border-brand-surface-light">
        <h2 className="text-2xl font-bold text-foreground mb-6">Explore Tools</h2>
        
        {filteredCalculators.length === 0 ? (
            <div className="col-span-1 lg:col-span-3 p-12 flex flex-col items-center justify-center text-center bg-brand-surface rounded-2xl border border-brand-surface-light border-dashed">
              <h2 className="text-xl font-bold text-gray-300">No tools found</h2>
              <p className="text-gray-500 mt-2 max-w-md">We couldn&apos;t find any calculators or predictors matching &quot;{query}&quot;. Try searching for something else like &quot;Pace&quot; or &quot;Zones&quot;.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 items-start">
               {filteredCalculators.map(calc => calc.component)}
            </div>
        )}
      </div>
    </div>
  );
}
