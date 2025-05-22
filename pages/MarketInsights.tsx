import React, { useEffect, useState } from 'react';

interface Commodity {
  name: string;
  price: number;
  change: number;
  trend: 'up' | 'down';
}

interface Insight {
  title: string;
  description: string;
  impact: 'positive' | 'negative';
  source: string;
}

interface PriceHistory {
  [key: string]: number[];
}

interface Forecast {
  shortTerm: string;
  longTerm: string;
  confidence: string;
}

interface MarketData {
  commodities: Commodity[];
  insights: Insight[];
  priceHistory: PriceHistory;
  forecast: { [key: string]: Forecast };
}

const MarketInsights: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      setConnectionStatus('Connected');
    };

    ws.onmessage = (event) => {
      const data: MarketData = JSON.parse(event.data);
      setMarketData(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    };

    ws.onclose = () => {
      setConnectionStatus('Disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  if (!marketData) {
    return <div>Loading market data... Connection status: {connectionStatus}</div>;
  }

  return (
    <>
      <style>{`
        .market-insights-container {
          display: flex;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }
        .sidebar {
          width: 250px;
          background-color: #2c3e50;
          color: white;
          padding: 20px;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
        }
        .sidebar h2 {
          margin-top: 0;
        }
        .main-content {
          flex: 1;
          padding: 20px;
          background-color: #ecf0f1;
          box-sizing: border-box;
          overflow-y: auto;
        }
        h1, h2 {
          color: #34495e;
        }
        ul {
          list-style-type: none;
          padding-left: 0;
        }
        li {
          background: white;
          margin-bottom: 10px;
          padding: 10px 15px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        section {
          margin-bottom: 30px;
        }
        @media (max-width: 768px) {
          .market-insights-container {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            box-shadow: none;
          }
          .main-content {
            padding: 10px;
          }
        }
      `}</style>

      <div className="market-insights-container">
        <aside className="sidebar">
          <h2>Sidebar</h2>
          <p>Put your sidebar content here.</p>
          {/* You can add additional sidebar elements here */}
        </aside>
        <main className="main-content">
          <h1>Market Insights</h1>
          <p>Connection status: {connectionStatus}</p>

          <section>
            <h2>Commodities</h2>
            <ul>
              {marketData.commodities.map((commodity) => (
                <li key={commodity.name}>
                  <strong>{commodity.name}</strong>: ${commodity.price.toFixed(2)} ({commodity.change >= 0 ? '+' : ''}
                  {commodity.change.toFixed(2)}) - Trend: {commodity.trend}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Insights</h2>
            <ul>
              {marketData.insights.map((insight, index) => (
                <li key={index}>
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>
                  <p>Impact: {insight.impact}</p>
                  <p>Source: {insight.source}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Forecast</h2>
            <ul>
              {Object.entries(marketData.forecast).map(([key, forecast]) => (
                <li key={key}>
                  <strong>{key}</strong>: Short Term - {forecast.shortTerm}, Long Term - {forecast.longTerm}, Confidence - {forecast.confidence}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </>
  );
};

export default MarketInsights;
