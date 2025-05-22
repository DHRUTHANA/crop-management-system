import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Sun, CloudRain, Cloud, CloudLightning } from 'lucide-react';
import Card from '../components/ui/Card';

interface WeatherData {
  date: string;
  day: string;
  temperature: { high: number; low: number };
  precipitation: number;
  condition: string;
  description: string;
}

const WeatherForecast: React.FC = () => {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [currentWeather, setCurrentWeather] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [location, setLocation] = useState<string>('Delhi');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const { t } = useTranslation();

  const weatherCodeToCondition = (code: number): string => {
    if (code === 0) return 'clear';
    if ([1, 2].includes(code)) return 'partly-cloudy';
    if ([3].includes(code)) return 'cloudy';
    if ([61, 63, 65].includes(code)) return 'rainy';
    if ([95, 96, 99].includes(code)) return 'stormy';
    return 'sunny';
  };

  const fetchLocation = async (loc: string) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1&country=IN&format=json`);

      const data = res.data;
      if (data?.results?.length) {
        const locData = data.results[0];
        setLatitude(locData.latitude);
        setLongitude(locData.longitude);
      } else {
        setError(t('weatherForecast.error'));
        setLoading(false);
      }
    } catch {
      setError(t('weatherForecast.error'));
      setLoading(false);
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Asia/Kolkata&forecast_days=7`;

      const res = await axios.get(url);
      const data = res.data;
      if (data.current_weather) {
        setCurrentWeather(data.current_weather);
        setForecast(
          data.daily.time.map((date: string, index: number) => ({
            date,
            day: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
            temperature: {
              high: data.daily.temperature_2m_max[index],
              low: data.daily.temperature_2m_min[index],
            },
            precipitation: data.daily.precipitation_sum[index],
            condition: weatherCodeToCondition(data.daily.weathercode[index]),
            description: ''
          }))
        );
      } else {
        setError(t('weatherForecast.error'));
      }
    } catch {
      setError(t('weatherForecast.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation(location);
  }, [location]);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude]);

  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition) {
      case 'sunny':
      case 'clear':
        return <Sun size={size} className="text-amber-500" />;
      case 'partly-cloudy':
      case 'cloudy':
        return <Cloud size={size} className="text-gray-500" />;
      case 'rainy':
        return <CloudRain size={size} className="text-blue-500" />;
      case 'stormy':
        return <CloudLightning size={size} className="text-purple-500" />;
      default:
        return <Sun size={size} className="text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">{t('weatherForecast.title')}</h1>
      <p className="text-gray-500 mt-1">{t('weatherForecast.subtitle')}</p>

      <input
        type="text"
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder={t('weatherForecast.enterLocation')}
        className="border p-2 rounded w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
        aria-label={t('weatherForecast.enterLocation')}
      />

      {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}
      {loading && <p className="text-indigo-600 font-semibold mt-4">{t('weatherForecast.loading')}</p>}

      {!loading && currentWeather && forecast.length > 0 && (
        <div className="mt-6 space-y-6">
          {forecast.map((data, index) => (
            <Card key={index} className="p-4 bg-gray-50 rounded-lg shadow-md flex items-center space-x-6">
              <div>{getWeatherIcon(data.condition, 48)}</div>
              <div>
                <p className="text-lg font-semibold">{data.day}, {new Date(data.date).toLocaleDateString()}</p>
                <p>{t(`weatherCodeDescriptions.${data.condition}`, data.condition)}</p>
                <p>
                  {t('weatherForecast.high')}: {Math.round(data.temperature.high)}°C, {t('weatherForecast.low')}: {Math.round(data.temperature.low)}°C
                </p>
                <p>{t('weatherForecast.precipitation')}: {data.precipitation.toFixed(1)} mm</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
