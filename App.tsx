
import React, { useState } from 'react';
import Header from './components/Header';
import PhotoAnalyzer from './components/PhotoAnalyzer';
import NutritionChatbot from './components/NutritionChatbot';

type View = 'analyzer' | 'chatbot';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('analyzer');

    return (
        <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
            <Header currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
                {currentView === 'analyzer' && <PhotoAnalyzer />}
                {currentView === 'chatbot' && <NutritionChatbot />}
            </main>
            <footer className="text-center p-4 text-gray-600 text-sm">
                <p>Powered by Gemini AI. For informational purposes only.</p>
            </footer>
        </div>
    );
};

export default App;
