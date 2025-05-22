import React, { useState, useEffect } from 'react';
import { BarChart2, Droplet, CloudRain, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import Card from '../components/ui/Card';
import WeatherWidget from '../components/weather/WeatherWidget';
import CropStatusCard from '../components/crops/CropStatusCard';
import AlertNotification from '../components/ui/AlertNotification';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);  // Sidebar toggle state

  // Mock data (keep your original data here)
  const weatherForecast = [
    { day: 'Mon', temperature: 28, condition: 'sunny', precipitation: 0 },
    { day: 'Tue', temperature: 27, condition: 'sunny', precipitation: 10 },
    { day: 'Wed', temperature: 25, condition: 'cloudy', precipitation: 20 },
    { day: 'Thu', temperature: 23, condition: 'rainy', precipitation: 80 },
    { day: 'Fri', temperature: 25, condition: 'cloudy', precipitation: 30 },
  ] as const;

  const cropStatuses = [
    {
      name: 'Wheat',
      growthStage: 'Ripening',
      health: 'excellent',
      daysTillHarvest: 21,
      irrigationStatus: 'optimal',
      sunlightStatus: 'optimal',
    },
    {
      name: 'Corn',
      growthStage: 'Vegetative',
      health: 'good',
      daysTillHarvest: 65,
      irrigationStatus: 'needs-water',
      sunlightStatus: 'optimal',
    },
    {
      name: 'Soybeans',
      growthStage: 'Flowering',
      health: 'fair',
      daysTillHarvest: 42,
      irrigationStatus: 'optimal',
      sunlightStatus: 'needs-more',
    },
  ] as const;

  const marketPrices = [
    { crop: 'Wheat', price: 8.25, change: 0.15, trend: 'up' },
    { crop: 'Corn', price: 5.77, change: -0.23, trend: 'down' },
    { crop: 'Soybeans', price: 14.20, change: 0.42, trend: 'up' },
  ];

  interface Alert {
    id: number;
    type: 'warning' | 'info' | 'error' | 'success';
    message: string;
  }

  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const newAlerts: Alert[] = [];

    marketPrices.forEach(({ crop, change }) => {
      if (Math.abs(change) >= 0.2) {
        newAlerts.push({
          id: newAlerts.length + 1,
          type: change > 0 ? 'success' : 'warning',
          message: `Significant price ${change > 0 ? 'increase' : 'decrease'} detected for ${crop}: ${change > 0 ? '+' : ''}${change.toFixed(2)}`,
        });
      }
    });

    weatherForecast.forEach(({ day, precipitation }) => {
      if (precipitation > 50) {
        newAlerts.push({
          id: newAlerts.length + 1,
          type: 'warning',
          message: `Heavy precipitation expected on ${day}: ${precipitation}% chance of rain.`,
        });
      }
    });

    cropStatuses.forEach(({ name, irrigationStatus }) => {
      if (irrigationStatus === 'needs-water') {
        newAlerts.push({
          id: newAlerts.length + 1,
          type: 'info',
          message: `Irrigation needed for ${name}. Please check the schedule.`,
        });
      }
    });

    setAlerts(newAlerts);
  }, [marketPrices, weatherForecast, cropStatuses]);

  const handleCloseAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar - Add your existing sidebar component here */}
      <aside
        style={{
          width: sidebarOpen ? 250 : 60,
          transition: 'width 0.3s ease',
          backgroundColor: '#2E7D32',
          color: 'white',
          padding: sidebarOpen ? '20px' : '20px 8px',
          boxSizing: 'border-box',
        }}
        aria-label="Sidebar"
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            marginBottom: '20px',
            fontSize: '20px',
          }}
        >
          {sidebarOpen ? '←' : '→'}
        </button>
        {sidebarOpen ? (
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#dashboard" style={{ color: 'white', display: 'block', marginBottom: '10px' }}>Dashboard</a></li>
              <li><a href="#settings" style={{ color: 'white', display: 'block', marginBottom: '10px' }}>Settings</a></li>
              <li><a href="#profile" style={{ color: 'white', display: 'block', marginBottom: '10px' }}>Profile</a></li>
            </ul>
          </nav>
        ) : (
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
              <li style={{ marginBottom: '20px' }}>🏠</li>
              <li style={{ marginBottom: '20px' }}>⚙️</li>
              <li>👤</li>
            </ul>
          </nav>
        )}
      </aside>

      {/* Main content - adjust margin or width depending on sidebar */}
      <main
        style={{
          flexGrow: 1,
          padding: 24,
          overflowY: 'auto',
          transition: 'margin-left 0.3s ease',
          marginLeft: sidebarOpen ? 0 : 0, // No margin needed since we're using flex with fixed sidebar width
          backgroundColor: '#f9fafb',
          height: '100vh',
        }}
        tabIndex={-1}
      >
        {/* Your existing dashboard JSX here without altering */}
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening on your farm today.</p>
          </div>

          <div className="space-y-4">
            {alerts.map(({ id, type, message }) => (
              <AlertNotification key={id} type={type} message={message} onClose={() => handleCloseAlert(id)} />
            ))}
          </div>

          {/* Below continue with your full dashboard JSX structure as is */}
          {/* ... Rest of your dashboard JSX ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Crop Yield Forecast" 
              value="92 t" 
              change={{ value: "12%", type: "increase" }}
              icon={<BarChart2 size={24} className="text-primary-600" />}
              trend={[30, 40, 45, 50, 55, 60, 65]}
            />
            <StatsCard 
              title="Soil Moisture" 
              value="28%" 
              change={{ value: "5%", type: "decrease" }}
              icon={<Droplet size={24} className="text-blue-600" />}
              trend={[65, 60, 55, 50, 45, 40, 35]}
            />
            <StatsCard 
              title="Rainfall (Monthly)" 
              value="115 mm" 
              change={{ value: "Normal", type: "neutral" }}
              icon={<CloudRain size={24} className="text-blue-600" />}
              trend={[20, 30, 40, 50, 60, 40, 30]}
            />
            <StatsCard 
              title="Alerts" 
              value={alerts.length.toString()} 
              change={{ value: alerts.length > 0 ? "Action needed" : "No alerts", type: alerts.length > 0 ? "increase" : "neutral" }}
              icon={<AlertCircle size={24} className="text-amber-600" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeatherWidget 
                location="Austin, TX"
                currentTemperature={28}
                currentCondition="sunny"
                forecast={weatherForecast}
              />
            </div>
            <div>
              <Card title="Market Prices" subtitle="Live commodity prices">
                <div className="divide-y">
                  {marketPrices.map((item, index) => (
                    <div key={index} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                      <span className="font-medium">{item.crop}</span>
                      <div className="flex items-center">
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                        <span className={`ml-2 text-sm ${item.trend === 'up' ? 'text-success-500' : 'text-error-500'}`}>
                          {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}
                          <TrendingUp className={`h-4 w-4 inline ml-1 ${item.trend === 'up' ? '' : 'transform rotate-180'}`} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                    View all prices →
                  </a>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Crop Status</h2>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                View all crops
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cropStatuses.map((crop, index) => (
                <CropStatusCard key={index} crop={crop} />
              ))}
            </div>
          </div>

          <div>
            <Card 
              title="Recommendations" 
              subtitle="AI-powered suggestions to optimize your farm"
            >
              <ul className="divide-y">
                <li className="py-3 flex items-start">
                  <span className="bg-blue-100 text-blue-700 p-1 rounded mr-3">
                    <Droplet size={18} />
                  </span>
                  <div>
                    <p className="font-medium">Increase irrigation for corn fields</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Soil moisture levels are 10% below optimal. Consider adding 15mm of water over the next 2 days.
                    </p>
                  </div>
                </li>
                <li className="py-3 flex items-start">
                  <span className="bg-amber-100 text-amber-700 p-1 rounded mr-3">
                    <AlertCircle size={18} />
                  </span>
                  <div>
                    <p className="font-medium">Potential pest infestation in Soybeans</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Early signs of aphids detected. Inspect field section B3 and consider targeted treatment.
                    </p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
