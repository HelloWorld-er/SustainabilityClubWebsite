import { 
  Car, 
  Zap, 
  Trash, 
  Utensils, 
  Plane, 
  Droplets 
} from 'lucide-react';

export const CATEGORIES = {
  transport: {
    id: 'transport',
    name: 'Daily Transport',
    icon: Car,
    unit: 'km',
    factor: 0.2, // kg CO2 per km
    placeholder: 'Distance traveled per day',
    description: 'Average car or public transport emissions.',
    inputType: 'number'
  },
  electricity: {
    id: 'electricity',
    name: 'Electricity Use',
    icon: Zap,
    unit: 'kWh / month',
    factor: 0.5 / 30, // kg CO2 per kWh per day
    placeholder: 'Monthly consumption',
    description: 'Emissions from power plants.',
    inputType: 'number'
  },
  waste: {
    id: 'waste',
    name: 'Weekly Waste',
    icon: Trash,
    unit: 'kg / week',
    factor: 1.5 / 7, // kg CO2 per kg per day
    placeholder: 'Waste produced per week',
    description: 'Methane and processing emissions.',
    inputType: 'number'
  },
  diet: {
    id: 'diet',
    name: 'Diet Type',
    icon: Utensils,
    inputType: 'select',
    options: [
      { label: 'Omnivore', value: '4.5' },
      { label: 'Vegetarian', value: '2.5' },
      { label: 'Vegan', value: '1.5' }
    ],
    description: 'Daily impact of food choices.'
  },
  water: {
    id: 'water',
    name: 'Water Usage',
    icon: Droplets,
    unit: 'Liters / day',
    factor: 0.001, // Minimal impact but good for awareness
    placeholder: 'Daily water use',
    description: 'Energy used for water treatment.',
    inputType: 'number'
  },
  flights: {
    id: 'flights',
    name: 'Annual Flights',
    icon: Plane,
    unit: 'Hours / year',
    factor: 90 / 365, // ~90kg CO2 per flight hour
    placeholder: 'Total flight hours per year',
    description: 'High-altitude carbon emissions.',
    inputType: 'number'
  },
  heating: {
    id: 'heating',
    name: 'Home Heating',
    icon: Zap,
    unit: 'm³ / month',
    factor: 2.0 / 30, // Example factor for natural gas
    placeholder: 'Monthly gas use',
    description: 'Carbon emissions from space heating.',
    inputType: 'number'
  }
};

export const COMPARISON_DATA = {
  local: 8.2,
  national: 14.5,
  world: 4.8
};

export const calculateScore = (selectionData, selections) => {
  return selections.reduce((acc, id) => {
    const config = CATEGORIES[id];
    const value = selectionData[id];
    if (config.inputType === 'select') {
      return acc + (parseFloat(value) || 0);
    }
    return acc + (parseFloat(value) * config.factor || 0);
  }, 0).toFixed(2);
};

export const getCategoryScore = (id, value) => {
  const config = CATEGORIES[id];
  if (!config) return 0;
  if (config.inputType === 'select') {
    return parseFloat(value) || 0;
  }
  return parseFloat(value) * config.factor || 0;
};

export const CHART_COLORS = ['#10B981', '#0EA5E9', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const ANALYSIS_CHARTS = {
  ratios: {
    id: 'ratios',
    type: 'pie',
    title: 'Emission Ratios',
    accentColor: 'bg-primary-green',
    getData: (data, activeSelections) => {
      return activeSelections.map(id => {
        const config = CATEGORIES[id];
        const value = data[id];
        const score = getCategoryScore(id, value);
        
        return {
          name: config.name,
          value: parseFloat(score.toFixed(2))
        };
      }).filter(item => item.value > 0);
    }
  },
  comparison: {
    id: 'comparison',
    type: 'bar',
    title: 'Global Comparison',
    accentColor: 'bg-primary-skyblue',
    footer: 'Values in kg CO2e per day',
    getData: (data, activeSelections) => {
      const totalScore = calculateScore(data, activeSelections);
      return [
        { name: 'You', value: parseFloat(totalScore), fill: '#0EA5E9' },
        { name: 'Local', value: COMPARISON_DATA.local, fill: '#10B981' },
        { name: 'National', value: COMPARISON_DATA.national, fill: '#64748B' },
        { name: 'World', value: COMPARISON_DATA.world, fill: '#94A3B8' }
      ];
    }
  }
};

export const SIMULATION_CHARTS = {
  categoryComparison: {
    id: 'categoryComparison',
    type: 'line',
    title: 'Category Comparison',
    getData: (data, simulationData, activeSelections) => {
      return activeSelections.map(id => {
        const config = CATEGORIES[id];
        const originalValue = data[id];
        const simulatedValue = simulationData[id];
        
        const originalScore = getCategoryScore(id, originalValue);
        const simulatedScore = getCategoryScore(id, simulatedValue);

        return {
          category: config.name,
          original: parseFloat(originalScore.toFixed(2)),
          simulated: parseFloat(simulatedScore.toFixed(2))
        };
      });
    }
  },
  totalTrend: {
    id: 'totalTrend',
    type: 'line',
    title: 'Total Impact Trend',
    getData: (data, simulationData, activeSelections) => {
      const current = parseFloat(calculateScore(data, activeSelections));
      const simulated = parseFloat(calculateScore(simulationData, activeSelections));
      const target = current * 0.5;

      return [
        { name: 'Original State', original: current, simulated: current },
        { name: 'Simulated State', original: current, simulated: simulated },
        { name: '50% Goal', original: target, simulated: target },
      ];
    }
  }
};
