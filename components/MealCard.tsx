
import React from 'react';
import { AnalysisResult } from '../types';

const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
};

const getNovaScoreInfo = (score: number) => {
    switch(score) {
        case 1: return 'Unprocessed or minimally processed foods.';
        case 2: return 'Processed culinary ingredients.';
        case 3: return 'Processed foods.';
        case 4: return 'Ultra-processed foods and drinks.';
        default: return 'N/A';
    }
}

const MealCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const { mealName, description, totalCalories, macros, micronutrients, novaScore, healthScore, healthTips } = result;

    return (
        <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-fade-in">
            <div className="p-6">
                <h3 className="text-2xl font-bold text-white">{mealName}</h3>
                <p className="mt-1 text-gray-400">{description}</p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Calories</p>
                        <p className="text-2xl font-bold text-teal-400">{totalCalories}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Health Score</p>
                        <p className={`text-2xl font-bold ${getScoreColor(healthScore)}`}>{healthScore}/100</p>
                    </div>
                     <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">NOVA Score</p>
                        <p className={`text-2xl font-bold ${getScoreColor(100 - (novaScore -1) * 25)}`}>{novaScore}</p>
                        <p className="text-xs text-gray-500 mt-1">{getNovaScoreInfo(novaScore)}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white">Macronutrients</h4>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <p className="font-bold text-blue-400">Protein</p>
                            <p className="text-lg text-white">{macros.protein.toFixed(1)}g</p>
                        </div>
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <p className="font-bold text-orange-400">Carbs</p>
                            <p className="text-lg text-white">{macros.carbohydrates.toFixed(1)}g</p>
                        </div>
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <p className="font-bold text-yellow-400">Fat</p>
                            <p className="text-lg text-white">{macros.fat.toFixed(1)}g</p>
                        </div>
                    </div>
                </div>
                
                {micronutrients && micronutrients.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-white">Key Micronutrients</h4>
                        <ul className="mt-2 space-y-2">
                            {micronutrients.slice(0, 5).map((nutrient, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-700/50 p-2 rounded-md">
                                    <span className="text-gray-300">{nutrient.name}</span>
                                    <span className="font-mono text-teal-400">{nutrient.amount} {nutrient.unit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {healthTips && healthTips.length > 0 && (
                     <div className="mt-6">
                        <h4 className="text-lg font-semibold text-white">Health Tips</h4>
                         <ul className="mt-2 space-y-2 list-disc list-inside text-gray-400">
                             {healthTips.map((tip, index) => (
                                 <li key={index}>{tip}</li>
                             ))}
                         </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealCard;
