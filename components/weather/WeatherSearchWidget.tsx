import React, { useState, useEffect, useRef } from 'react';

interface Location {
  name: string;
  admin1?: string;
  admin2?: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
  };
  hourly: {
    time: string[];
    precipitation: number[];
    relative_humidity_2m: number[];
    windspeed_10m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

const WeatherSearchWidget: React.FC = () => {
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const suggestionsBoxRef = useRef<HTMLDivElement>(null);

  // Debounce utility
  function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: number;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func(...args), wait);
    };
  }

  // Fetch location suggestions
  const fetchLocationSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const url = \`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(query)}&count=10&language=en&format=json&country=IN\`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!json.results || json.results.length === 0) {
        setSuggestions([]);
        return;
      }
      setSuggestions(json.results);
    } catch {
      setErrorMessage('Error fetching locations');
    }
  };

  // Debounced version of fetchLocationSuggestions
  const debouncedFetchLocationSuggestions = useRef(debounce(fetchLocationSuggestions, 300)).current;

  // Handle input change
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
    setSelectedLocation(null);
    setErrorMessage('');
    if (e.target.value.trim().length >= 3) {
      debouncedFetchLocationSuggestions(e.target.value.trim());
    } else {
      setSuggestions([]);
    }
  };

  // Select location from suggestions
  const selectLocation = (loc: Location) => {
    const fullName = loc.name + (loc.admin1 ? ', ' + loc.admin1 : '') + (loc.admin2 ? ', ' + loc.admin2 : '') + ', ' + loc.country;
    setLocationInput(fullName);
    setSelectedLocation(loc);
    setSuggestions([]);
    fetchWeather(loc.latitude, loc.longitude, loc.name);
  };

  // Fetch weather data
  const fetchWeather = async (lat: number, lon: number, locName: string) => {
    setErrorMessage('');
    setWeatherData(null);
    const url = \`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&hourly=temperature_2m,precipitation,relative_humidity_2m,windspeed_10m&current_weather=true&timezone=Asia/Kolkata&forecast_days=3&daily=temperature_2m_max,temperature_2m_min,precipitation_sum\`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather data fetch failed');
      const data = await res.json();
      setWeatherData(data);
    } catch {
      setErrorMessage('Unable to fetch weather data. Please try again.');
    }
  };

  // Keyboard navigation for suggestions
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      scrollToActiveSuggestion();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      scrollToActiveSuggestion();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        selectLocation(suggestions[activeSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const scrollToActiveSuggestion = () => {
    if (!suggestionsBoxRef.current) return;
    const activeEl = suggestionsBoxRef.current.querySelector('.active');
    if (activeEl && activeEl.scrollIntoView) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  };

  // Search button click
  const onSearchClick = () => {
    if (selectedLocation) {
      fetchWeather(selectedLocation.latitude, selectedLocation.longitude, selectedLocation.name);
    } else if (locationInput.trim().length >= 3) {
      fetchLocationSuggestions(locationInput.trim()).then(() => {
        if (suggestions.length > 0) {
          selectLocation(suggestions[0]);
        } else {
          setErrorMessage('No location found, please refine your search.');
        }
      });
    } else {
      setErrorMessage('Please enter a valid location in India.');
    }
  };

  // Render suggestions
  const renderSuggestions = () => {
    if (suggestions.length === 0) return null;
    return (
      <div
        id="suggestions"
        role="listbox"
        aria-label="Location suggestions"
        className="absolute bg-white border border-gray-300 rounded-b-md max-h-36 overflow-y-auto w-full z-10"
        ref={suggestionsBoxRef}
      >
        {suggestions.map((loc, index) => {
          const fullName = loc.name + (loc.admin1 ? ', ' + loc.admin1 : '') + (loc.admin2 ? ', ' + loc.admin2 : '') + ', ' + loc.country;
          return (
            <div
              key={index}
              role="option"
              className={`p-2 cursor-pointer ${index === activeSuggestionIndex ? 'bg-blue-600 text-white' : ''}`}
              onClick={() => selectLocation(loc)}
              onMouseEnter={() => setActiveSuggestionIndex(index)}
            >
              {fullName}
            </div>
          );
        })}
      </div>
    );
  };

  // Display weather info
  const renderWeather = () => {
    if (!weatherData || !selectedLocation) return null;
    const locName = locationInput;
    const current = weatherData.current_weather;
    const nowHour = new Date().getHours();
    const idx = weatherData.hourly.time.findIndex(t => new Date(t).getHours() === nowHour);
    return (
      <div
        id="weather-display"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions removals"
        className="bg-white bg-opacity-90 rounded-lg p-4 shadow-md flex flex-col"
      >
        <div id="location-name" className="font-bold text-lg text-center text-blue-900 mb-2">{locName}</div>
        <div id="current-weather" className="flex justify-between items-center mb-4">
          <div id="temperature" className="text-4xl font-extrabold text-blue-700">{Math.round(current.temperature)}°C</div>
          <div id="weather-details" className="flex flex-col flex-1 pl-4 text-sm text-gray-700">
            <div id="condition">Wind Speed: {current.windspeed} km/h</div>
            <div id="humidity">{idx >= 0 ? \`Humidity: \${weatherData.hourly.relative_humidity_2m[idx]}%\` : ''}</div>
            <div id="precipitation">{idx >= 0 ? \`Precipitation: \${weatherData.hourly.precipitation[idx]} mm\` : ''}</div>
          </div>
        </div>
        <div id="forecast" className="flex overflow-x-auto gap-2 pb-2">
          {weatherData.daily.time.map((date, i) => {
            const dt = new Date(date);
            const dayName = dt.toLocaleDateString('en-IN', { weekday: 'short' });
            const maxTemp = weatherData.daily.temperature_2m_max[i];
            const minTemp = weatherData.daily.temperature_2m_min[i];
            const precip = weatherData.daily.precipitation_sum[i];
            return (
              <div key={i} className="min-w-[60px] bg-blue-100 rounded-md p-1 text-center text-sm text-blue-700 shadow-sm">
                <strong>{dayName}</strong>{dt.getDate()}<br />
                Max: {Math.round(maxTemp)}°C<br />
                Min: {Math.round(minTemp)}°C<br />
                Rain: {precip.toFixed(1)} mm
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-xs mx-auto flex flex-col p-4 bg-gradient-to-br from-cyan-200 to-pink-200 min-h-[600px]">
      <h1 className="text-xl font-bold text-center text-blue-900 mb-2">Crop Weather Forecast (India)</h1>
      <div id="location-form" role="search" className="flex justify-center mb-4 relative">
        <input
          type="text"
          id="location-input"
          placeholder="Enter location in India"
          aria-label="Location input"
          autoComplete="off"
          className="flex-1 px-3 py-2 text-base border-2 border-blue-900 rounded-md outline-offset-2"
          value={locationInput}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
        />
        <button
          id="search-btn"
          aria-label="Search weather"
          className="bg-blue-900 text-white px-4 py-2 ml-2 rounded-md font-semibold hover:bg-blue-800 focus:bg-blue-800"
          onClick={onSearchClick}
        >
          Search
        </button>
        {renderSuggestions()}
      </div>
      {errorMessage && (
        <div id="error-message" role="alert" className="text-red-700 font-semibold text-center mb-2">
          {errorMessage}
        </div>
      )}
      {renderWeather()}
    </div>
  );
};

export default WeatherSearchWidget;
