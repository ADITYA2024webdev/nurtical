
export interface MacroNutrients {
    protein: number;
    carbohydrates: number;
    fat: number;
}

export interface MicroNutrient {
    name: string;
    amount: number;
    unit: string;
}

export interface AnalysisResult {
    mealName: string;
    description: string;
    totalCalories: number;
    macros: MacroNutrients;
    micronutrients: MicroNutrient[];
    novaScore: number;
    healthScore: number;
    healthTips: string[];
}

export interface Source {
  uri: string;
  title: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
}
