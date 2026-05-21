'use client';

import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudDrizzle, CloudFog, AlertTriangle } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  code: number;
  isDay: boolean;
}

const getWeatherIcon = (code: number, isDay: boolean, className = "w-4 h-4") => {
  if (code === 0) return <Sun className={`${className} text-amber-400 animate-spin-slow`} />;
  if ([1, 2, 3].includes(code)) return <Cloud className={`${className} text-zinc-300`} />;
  if ([45, 48].includes(code)) return <CloudFog className={`${className} text-zinc-400`} />;
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle className={`${className} text-cyan-300`} />;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain className={`${className} text-cyan-400`} />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className={`${className} text-blue-200 animate-bounce`} />;
  if ([95, 96, 99].includes(code)) return <CloudLightning className={`${className} text-yellow-400 animate-pulse`} />;
  return <Cloud className={`${className} text-zinc-300`} />;
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Despejado';
  if (code === 1) return 'Parcialmente despejado';
  if (code === 2) return 'Parcialmente nublado';
  if (code === 3) return 'Cubierto';
  if (code === 45 || code === 48) return 'Niebla';
  if ([51, 53, 55].includes(code)) return 'Llovizna';
  if ([61, 63, 65].includes(code)) return 'Lluvia';
  if ([71, 73, 75, 77].includes(code)) return 'Nieve';
  if ([80, 81, 82].includes(code)) return 'Chubascos';
  if ([95, 96, 99].includes(code)) return 'Tormenta';
  return 'Parcialmente nublado';
};

export default function Weather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-32.8895&longitude=-68.8458&current=temperature_2m,is_day,weather_code&timezone=America/Argentina/Mendoza'
        );
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        
        if (active) {
          const current = json.current;
          setData({
            temp: Math.round(current.temperature_2m),
            code: current.weather_code,
            isDay: current.is_day === 1,
            condition: getWeatherDescription(current.weather_code)
          });
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchWeather();
    
    // Refresh weather every 15 minutes
    const interval = setInterval(fetchWeather, 900000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-zinc-500 font-medium text-xs px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/60 rounded-full select-none backdrop-blur-sm">
        <span className="w-3 h-3 rounded-full border border-zinc-700 border-t-transparent animate-spin"></span>
        <span>Cargando clima...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center space-x-2 text-red-400 font-medium text-xs px-3 py-1.5 bg-red-950/20 border border-red-900/30 rounded-full select-none backdrop-blur-sm">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Mendoza --°C</span>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center space-x-2.5 text-zinc-100 text-xs px-3.5 py-1.5 bg-zinc-900/50 border border-zinc-800/80 rounded-full select-none backdrop-blur-sm shadow-inner transition-all hover:border-cyan-500/30"
      title="Mendoza, Argentina"
    >
      <div className="flex items-center justify-center">
        {getWeatherIcon(data.code, data.isDay)}
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="font-semibold">{data.temp}°C</span>
        <span className="text-zinc-500">|</span>
        <span className="text-zinc-400 tracking-wide">{data.condition}</span>
      </div>
    </div>
  );
}
