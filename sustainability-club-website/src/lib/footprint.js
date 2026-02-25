const DEFAULT_FACTORS = {
  transport: {
    car_kg_co2e_per_km: 0.2,
    public_transport_kg_co2e_per_km: 0.05
  },
  electricity: {
    kg_co2e_per_kwh: 0.5
  },
  waste: {
    general_kg_co2e_per_kg: 1.5,
    recycling_kg_co2e_per_kg: 0.2
  },
  water: {
    kg_co2e_per_liter: 0.001
  },
  flights: {
    short_haul_kg_co2e_per_hour: 150,
    long_haul_kg_co2e_per_hour: 250
  },
  heating: {
    gas_kg_co2e_per_m3: 2.0
  }
};

const toNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mergeFactors = (factors) => {
  return {
    transport: { ...DEFAULT_FACTORS.transport, ...(factors?.transport || {}) },
    electricity: { ...DEFAULT_FACTORS.electricity, ...(factors?.electricity || {}) },
    waste: { ...DEFAULT_FACTORS.waste, ...(factors?.waste || {}) },
    water: { ...DEFAULT_FACTORS.water, ...(factors?.water || {}) },
    flights: { ...DEFAULT_FACTORS.flights, ...(factors?.flights || {}) },
    heating: { ...DEFAULT_FACTORS.heating, ...(factors?.heating || {}) }
  };
};

const addCategoryValue = (totals, categories, categoryId, value) => {
  if (!Number.isFinite(value)) return;
  totals.dailyFootprint += value;
  categories[categoryId] = categories[categoryId] || { dailyFootprint: 0 };
  categories[categoryId].dailyFootprint += value;
};

export const calculateFootprint = (data, selections, factors) => {
  const normalizedFactors = mergeFactors(factors);
  const totals = { dailyFootprint: 0 };
  const categories = {};

  const selected = Array.isArray(selections) ? selections : [];

  if (selected.includes('transport')) {
    const distance = toNumber(data?.transport?.distance);
    const publicTransport = toNumber(data?.transport?.public_transport);
    addCategoryValue(
      totals,
      categories,
      'transport',
      distance * normalizedFactors.transport.car_kg_co2e_per_km
    );
    addCategoryValue(
      totals,
      categories,
      'transport',
      publicTransport * normalizedFactors.transport.public_transport_kg_co2e_per_km
    );
  }

  if (selected.includes('electricity')) {
    const usage = toNumber(data?.electricity?.usage);
    const daily = (usage * normalizedFactors.electricity.kg_co2e_per_kwh) / 30;
    addCategoryValue(totals, categories, 'electricity', daily);
  }

  if (selected.includes('waste')) {
    const amount = toNumber(data?.waste?.amount);
    const recycling = toNumber(data?.waste?.recycling);
    addCategoryValue(
      totals,
      categories,
      'waste',
      (amount * normalizedFactors.waste.general_kg_co2e_per_kg) / 7
    );
    addCategoryValue(
      totals,
      categories,
      'waste',
      (recycling * normalizedFactors.waste.recycling_kg_co2e_per_kg) / 7
    );
  }

  if (selected.includes('diet')) {
    const baseDiet = toNumber(data?.diet?.base_diet);
    const meat = toNumber(data?.diet?.meat_consumption);
    const dairy = toNumber(data?.diet?.dairy_consumption);
    addCategoryValue(totals, categories, 'diet', baseDiet + meat + dairy);
  }

  if (selected.includes('water')) {
    const water = toNumber(data?.water?.daily_use);
    addCategoryValue(
      totals,
      categories,
      'water',
      water * normalizedFactors.water.kg_co2e_per_liter
    );
  }

  if (selected.includes('flights')) {
    const shortHaul = toNumber(data?.flights?.short_haul);
    const longHaul = toNumber(data?.flights?.long_haul);
    addCategoryValue(
      totals,
      categories,
      'flights',
      (shortHaul * normalizedFactors.flights.short_haul_kg_co2e_per_hour) / 365
    );
    addCategoryValue(
      totals,
      categories,
      'flights',
      (longHaul * normalizedFactors.flights.long_haul_kg_co2e_per_hour) / 365
    );
  }

  if (selected.includes('heating')) {
    const gasUse = toNumber(data?.heating?.gas_use);
    const daily = (gasUse * normalizedFactors.heating.gas_kg_co2e_per_m3) / 30;
    addCategoryValue(totals, categories, 'heating', daily);
  }

  return {
    totals: {
      dailyFootprint: totals.dailyFootprint.toFixed(2)
    },
    categories
  };
};

export const DEFAULT_EMISSION_FACTORS = DEFAULT_FACTORS;

