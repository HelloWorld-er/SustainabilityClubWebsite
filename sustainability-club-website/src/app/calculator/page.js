'use client';

import { useState } from 'react';
import { Calculator as CalcIcon, RefreshCw, Info } from 'lucide-react';

export default function Calculator() {
  const [data, setData] = useState({
    transport: 0,
    electricity: 0,
    waste: 0,
    diet: 'omnivore',
  });
  const [score, setScore] = useState(null);

  const calculateScore = (e) => {
    e.preventDefault();
    // Simplified calculation logic
    let total = 0;
    total += data.transport * 0.2; // 0.2 kg CO2 per km
    total += data.electricity * 0.5; // 0.5 kg CO2 per kWh
    total += data.waste * 1.5; // 1.5 kg CO2 per kg waste
    
    if (data.diet === 'vegan') total += 1.5;
    else if (data.diet === 'vegetarian') total += 2.5;
    else total += 4.5;

    setScore(total.toFixed(2));
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-primary-green mb-4">Sustainability Calculator</h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Take the first step towards a greener lifestyle by measuring your daily environmental impact.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        <form onSubmit={calculateScore} className="lg:col-span-3 space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl">
              <Info className="w-6 h-6 text-primary-green flex-shrink-0 mt-1" />
              <p className="text-sm text-green-800">
                This tool uses average CO2 emission factors to estimate your footprint. Be as accurate as possible for the best results!
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                Daily Transport (km)
              </label>
              <input 
                type="number" 
                className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-green transition-all outline-none text-lg"
                placeholder="How far do you travel daily?"
                onChange={(e) => setData({...data, transport: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Monthly Electricity Use (kWh)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-green transition-all outline-none text-lg"
                placeholder="Check your latest bill"
                onChange={(e) => setData({...data, electricity: (parseFloat(e.target.value) || 0) / 30})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Weekly Waste (kg)</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-green transition-all outline-none text-lg"
                  placeholder="Estimated weight"
                  onChange={(e) => setData({...data, waste: (parseFloat(e.target.value) || 0) / 7})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Diet Type</label>
                <select 
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-green transition-all outline-none text-lg appearance-none"
                  onChange={(e) => setData({...data, diet: e.target.value})}
                >
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary-green text-white font-black py-5 rounded-2xl hover:bg-opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg text-xl flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-6 h-6" />
            Calculate My Footprint
          </button>
        </form>

        <div className="lg:col-span-2 sticky top-24">
          <div className={`p-10 rounded-3xl transition-all duration-500 border-2 ${score !== null ? 'bg-primary-skyblue text-white border-primary-skyblue shadow-2xl scale-105' : 'bg-gray-50 text-gray-400 border-dashed border-gray-200'}`}>
            {score !== null ? (
              <div className="text-center">
                <CalcIcon className="w-16 h-16 mx-auto mb-6 opacity-80" />
                <h2 className="text-xl font-bold mb-2 uppercase tracking-widest">Your Result</h2>
                <div className="text-7xl font-black mb-4">
                  {score}
                </div>
                <div className="text-xl font-medium mb-8">kg CO2e / day</div>
                
                <div className="bg-white bg-opacity-20 p-6 rounded-2xl text-left backdrop-blur-sm">
                  <h4 className="font-bold mb-2">Analysis:</h4>
                  <p className="text-sm leading-relaxed">
                    {score < 5 
                      ? "Excellent! You are living very sustainably. Your footprint is well below the global average." 
                      : "There's room for improvement. Small changes like reducing meat consumption or using public transport can make a big difference."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <CalcIcon className="w-16 h-16 mx-auto mb-6 opacity-20" />
                <p className="text-lg font-medium">Complete the form to see your impact analysis here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
