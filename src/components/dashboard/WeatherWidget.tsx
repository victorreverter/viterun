"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import {
    MapPin,
    Search,
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudLightning,
    Wind,
    Droplets,
    Thermometer,
    RefreshCw,
    X
} from "lucide-react";

type WeatherData = {
    current: {
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        weather_code: number;
        is_day: number;
    };
    daily: {
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
};

// Map WMO Weather codes to descriptions and Lucide icons
const getWeatherDetails = (code: number, isDay: number) => {
    if (code === 0) return { desc: "Clear sky", Icon: isDay ? Sun : Sun }; // Could use Moon for night
    if (code === 1 || code === 2) return { desc: "Partly cloudy", Icon: Cloud };
    if (code === 3) return { desc: "Overcast", Icon: Cloud };
    if ([45, 48].includes(code)) return { desc: "Fog", Icon: Cloud };
    if ([51, 53, 55, 56, 57].includes(code)) return { desc: "Drizzle", Icon: CloudRain };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { desc: "Rain", Icon: CloudRain };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { desc: "Snow", Icon: CloudSnow };
    if ([95, 96, 99].includes(code)) return { desc: "Thunderstorm", Icon: CloudLightning };
    
    return { desc: "Unknown", Icon: Cloud };
};

export function WeatherWidget() {
    const { weatherCity, weatherLat, weatherLon, setWeatherLocation } = useUserStore();
    
    const [cityInput, setCityInput] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState("");
    
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);

    // Search for city via Open-Meteo Geocoding API
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cityInput.trim()) return;

        setIsSearching(true);
        setSearchError("");

        try {
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=1&language=en&format=json`);
            const data = await res.json();

            if (data.results && data.results.length > 0) {
                const location = data.results[0];
                const displayName = `${location.name}${location.country ? `, ${location.country}` : ''}`;
                setWeatherLocation(displayName, location.latitude, location.longitude);
                setCityInput("");
            } else {
                setSearchError("City not found. Try again.");
            }
        } catch (err) {
            setSearchError("Failed to search location.");
        } finally {
            setIsSearching(false);
        }
    };

    // Fetch weather data when coordinates exist
    const fetchWeather = async (lat: number, lon: number) => {
        setIsLoadingWeather(true);
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
            const data = await res.json();
            setWeatherData(data);
        } catch (err) {
            console.error("Failed to fetch weather", err);
        } finally {
            setIsLoadingWeather(false);
        }
    };

    useEffect(() => {
        if (weatherLat !== null && weatherLon !== null) {
            fetchWeather(weatherLat, weatherLon);
        }
    }, [weatherLat, weatherLon]);

    // UI when NO city is selected
    if (!weatherCity || weatherLat === null || weatherLon === null) {
        return (
            <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col h-full animate-in zoom-in-95 duration-500 relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-lime/5 blur-[80px] pointer-events-none rounded-full" />
                
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-brand-surface-light rounded-xl text-brand-lime">
                        <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground leading-tight">Live Weather</h2>
                        <p className="text-xs text-gray-500 font-medium">Running conditions</p>
                    </div>
                </div>

                <p className="text-sm text-gray-400 mb-6 flex-1">
                    Set your local city to get live running weather conditions, wind speed, and temperatures directly on your dashboard.
                </p>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            placeholder="Enter your city..."
                            className="w-full pl-9 pr-3 py-3 bg-brand-midnight/50 border border-brand-surface-light rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all placeholder:text-gray-600"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSearching || !cityInput.trim()}
                        className="p-3 bg-brand-lime text-black rounded-xl hover:bg-[#b3e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                    >
                        {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                </form>
                {searchError && <p className="text-xs text-red-400 mt-2 font-medium">{searchError}</p>}
            </div>
        );
    }

    // Return Skeleton if loading
    if (!weatherData) {
        return (
            <div className="bg-brand-surface border border-brand-surface-light rounded-2xl p-6 shadow-lg h-full flex flex-col items-center justify-center min-h-[220px]">
                <RefreshCw className="w-6 h-6 text-brand-lime animate-spin mb-3" />
                <p className="text-sm text-gray-400 font-semibold">Gathering forecast...</p>
            </div>
        );
    }

    const current = weatherData.current;
    const daily = weatherData.daily;
    const { desc, Icon } = getWeatherDetails(current.weather_code, current.is_day);

    // Determine if conditions are "ideal" for running
    const isHot = current.temperature_2m > 25;
    const isCold = current.temperature_2m < 5;
    const isWindy = current.wind_speed_10m > 20; // > 20km/h is fairly windy
    let conditionBadge = { text: "Ideal Conditions", color: "text-brand-lime bg-brand-lime/10 border-brand-lime/20" };
    
    if (isWindy) conditionBadge = { text: "High Wind", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" };
    if (isHot) conditionBadge = { text: "Hot Conditions", color: "text-red-400 bg-red-400/10 border-red-400/20" };
    if (isCold) conditionBadge = { text: "Cold Conditions", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };

    return (
        <div className="bg-brand-surface border border-brand-surface-light hover:border-brand-lime/50 transition-colors rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col h-full relative overflow-hidden">
            {/* Dynamic Background Glow based on condition */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[100px] pointer-events-none rounded-full ${
                isHot ? 'bg-orange-500/10' : isCold ? 'bg-blue-500/10' : 'bg-brand-lime/10'
            }`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2 text-gray-400 hover:text-foreground transition-colors cursor-pointer group" onClick={() => fetchWeather(weatherLat, weatherLon)}>
                    <MapPin className="w-4 h-4 text-brand-lime" />
                    <span className="text-sm font-bold tracking-tight">{weatherCity}</span>
                    <RefreshCw className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isLoadingWeather ? 'animate-spin opacity-100' : ''}`} />
                </div>
                <button 
                    onClick={() => setWeatherLocation("", null, null)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Change Location"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Main Weather Display */}
            <div className="flex items-center gap-6 mb-6 relative z-10">
                <Icon className={`w-14 h-14 ${isHot ? 'text-orange-400' : isCold ? 'text-blue-400' : 'text-brand-lime'} drop-shadow-lg`} />
                <div>
                    <div className="flex items-start">
                        <span className="text-5xl font-black text-foreground tracking-tighter">
                            {Math.round(current.temperature_2m)}
                        </span>
                        <span className="text-xl font-bold text-gray-500 mt-1 ml-0.5">°C</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-400 tracking-wide">{desc}</p>
                </div>
            </div>

            {/* Badges / High&Low */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${conditionBadge.color} tracking-wide`}>
                    {conditionBadge.text}
                </span>
                <span className="text-xs font-bold text-gray-500">
                    H: {Math.round(daily.temperature_2m_max[0])}° L: {Math.round(daily.temperature_2m_min[0])}°
                </span>
            </div>

            {/* Detailed Runner Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mt-auto relative z-10">
                <div className="bg-brand-midnight/60 border border-brand-surface-light rounded-xl p-3 flex flex-col items-center text-center justify-center hover:border-brand-lime/30 transition-colors">
                    <Wind className="w-4 h-4 text-gray-400 mb-1.5" />
                    <span className="text-sm font-black text-foreground">{Math.round(current.wind_speed_10m)} <span className="text-[10px] font-bold text-gray-500">km/h</span></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">Wind</span>
                </div>
                <div className="bg-brand-midnight/60 border border-brand-surface-light rounded-xl p-3 flex flex-col items-center text-center justify-center hover:border-brand-lime/30 transition-colors">
                    <Droplets className="w-4 h-4 text-blue-400 mb-1.5" />
                    <span className="text-sm font-black text-foreground">{Math.round(current.relative_humidity_2m)}<span className="text-[10px] font-bold text-gray-500">%</span></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">Humidity</span>
                </div>
                <div className="bg-brand-midnight/60 border border-brand-surface-light rounded-xl p-3 flex flex-col items-center text-center justify-center hover:border-brand-lime/30 transition-colors">
                    <Thermometer className="w-4 h-4 text-orange-400 mb-1.5" />
                    <span className="text-sm font-black text-foreground">{Math.round(current.apparent_temperature)}<span className="text-[10px] font-bold text-gray-500">°</span></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">Feels Like</span>
                </div>
            </div>
        </div>
    );
}
