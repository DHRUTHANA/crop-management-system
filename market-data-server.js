/**
 * Simple WebSocket server to send real-time market data updates.
 * Uses ws package: npm install ws
 */

import { WebSocketServer, WebSocket } from 'ws';

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

// ...rest of the code unchanged, using WebSocket.OPEN for readyState checks




console.log(`WebSocket server is running on ws://localhost:${PORT}`);

// Initial mock market data
let marketData = {
  commodities: [
    { name: 'Wheat', price: 8.25, change: 1.85, trend: 'up' },
    { name: 'Corn', price: 5.77, change: -0.23, trend: 'down' },
    { name: 'Soybeans', price: 14.20, change: 2.97, trend: 'up' },
    { name: 'Rice', price: 17.50, change: 0.85, trend: 'up' },
    { name: 'Barley', price: 6.40, change: -0.15, trend: 'down' },
  ],
  insights: [
    {
      title: 'Wheat prices rising due to drought concerns',
      description: 'Prolonged dry conditions in major wheat producing regions are driving up prices. Consider timing your sales carefully.',
      impact: 'positive',
      source: 'USDA Weekly Report'
    },
    {
      title: 'Corn futures trending down after bumper crop predictions',
      description: 'Updated forecasts suggest a larger than expected corn harvest this season, pushing prices lower.',
      impact: 'negative',
      source: 'Commodity Futures Trading Commission'
    },
    {
      title: 'Potential trade agreement to boost soybean exports',
      description: 'Upcoming trade negotiations could reduce tariffs on soybeans, potentially opening new markets.',
      impact: 'positive',
      source: 'International Trade Commission'
    }
  ],
  priceHistory: {
    wheat: [7.8, 7.9, 8.0, 8.1, 7.9, 8.0, 8.25],
    corn: [6.1, 6.0, 5.9, 5.85, 5.8, 5.75, 5.77],
    soybeans: [13.2, 13.4, 13.5, 13.7, 13.9, 14.1, 14.2]
  },
  forecast: {
    wheat: { shortTerm: 'increase', longTerm: 'stable', confidence: 'high' },
    corn: { shortTerm: 'decrease', longTerm: 'increase', confidence: 'medium' },
    soybeans: { shortTerm: 'increase', longTerm: 'increase', confidence: 'high' }
  }
};

// Helper function to simulate price changes
function randomPriceChange(price) {
  // random change between -0.5 and 0.5
  const change = (Math.random() - 0.5);
  const newPrice = Math.max(0, price + change);
  return { newPrice, change };
}

function updateMarketData() {
  marketData.commodities = marketData.commodities.map(commodity => {
    const { newPrice, change } = randomPriceChange(commodity.price);
    const trend = change >= 0 ? 'up' : 'down';
    return {
      ...commodity,
      price: parseFloat(newPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      trend
    };
  });

  // Optionally update price history (slide and add latest price)
  Object.keys(marketData.priceHistory).forEach(cropKey => {
    const commodity = marketData.commodities.find(c => c.name.toLowerCase() === cropKey);
    if (commodity) {
      const history = marketData.priceHistory[cropKey];
      history.shift();
      history.push(commodity.price);
    }
  });

  // Insights and forecast could also be dynamically updated if desired
}

// Broadcast data to all connected clients
function broadcastMarketData() {
  const dataString = JSON.stringify(marketData);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(dataString);
    }
  });
}

// On client connection
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send initial data immediately
  ws.send(JSON.stringify(marketData));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Update and broadcast data every 5 seconds
setInterval(() => {
  updateMarketData();
  broadcastMarketData();
}, 5000);

