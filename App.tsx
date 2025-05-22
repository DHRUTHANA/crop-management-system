import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropForm';
import DiseaseDetection from './pages/DiseaseDetection';
import WeatherForecast from './pages/WeatherForecast';
import YieldPrediction from './pages/YieldPrediction';
import MarketInsights from './pages/MarketInsights';
import Layout from './components/layout/Layout';
import Login from './pages/Login';

const isAuthenticated = () => {
  return localStorage.getItem('authenticated') === 'true';
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={isAuthenticated() ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Dashboard />} />
        <Route path="crop-recommendation" element={<CropRecommendation />} />
        <Route path="disease-detection" element={<DiseaseDetection />} />
        <Route path="weather-forecast" element={<WeatherForecast />} />
        <Route path="yield-prediction" element={<YieldPrediction />} />
        <Route path="market-insights" element={<MarketInsights />} />
         <Route path="market-insights" element={<MarketInsights />} />

      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
