// cropRecommendation.tsx

// Sample crop data (you can replace this with a database or a JSON file)
interface Crop {
    name: string;
    soil: string;
    rainfall: [number, number];
    temp: [number, number];
    humidity: [number, number];
    pH: [number, number];
    nitrogen: [number, number];
    phosphorus: [number, number];
}

const crops: Crop[] = [
    { name: "Wheat", soil: "Loamy", rainfall: [500, 1200], temp: [15, 25], humidity: [60, 70], pH: [6, 8], nitrogen: [20, 60], phosphorus: [30, 60] },
    { name: "Rice", soil: "Clay Loam", rainfall: [1000, 2000], temp: [20, 30], humidity: [80, 100], pH: [5, 6.5], nitrogen: [50, 100], phosphorus: [40, 60] },
    { name: "Maize", soil: "Sandy Loam", rainfall: [400, 800], temp: [20, 30], humidity: [50, 70], pH: [6, 7.5], nitrogen: [30, 80], phosphorus: [30, 50] },
    { name: "Barley", soil: "Clay", rainfall: [300, 500], temp: [12, 25], humidity: [40, 60], pH: [6, 7.5], nitrogen: [40, 60], phosphorus: [30, 40] },
    { name: "Millets", soil: "Silty", rainfall: [400, 1000], temp: [28, 35], humidity: [40, 60], pH: [5.5, 7.5], nitrogen: [40, 60], phosphorus: [20, 30] },
];

// Recommendation function
export function recommendCrops(params: {
    soil: string;
    rainfall: number;
    temp: number;
    humidity: number;
    pH: number;
    nitrogen: number;
    phosphorus: number;
}): string[] {
    const { soil, rainfall, temp, humidity, pH, nitrogen, phosphorus } = params;
    return crops.filter(crop => 
        crop.soil === soil &&
        rainfall >= crop.rainfall[0] && rainfall <= crop.rainfall[1] &&
        temp >= crop.temp[0] && temp <= crop.temp[1] &&
        humidity >= crop.humidity[0] && humidity <= crop.humidity[1] &&
        pH >= crop.pH[0] && pH <= crop.pH[1] &&
        nitrogen >= crop.nitrogen[0] && nitrogen <= crop.nitrogen[1] &&
        phosphorus >= crop.phosphorus[0] && phosphorus <= crop.phosphorus[1]
    ).map(crop => crop.name);
}
