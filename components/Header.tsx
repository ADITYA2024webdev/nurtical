
import React from 'react';
import { CameraIcon, ChatBubbleLeftRightIcon } from './Icons';

interface HeaderProps {
    currentView: 'analyzer' | 'chatbot';
    setCurrentView: (view: 'analyzer' | 'chatbot') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500";
    const activeClasses = "bg-teal-500 text-white shadow-lg";
    const inactiveClasses = "bg-gray-700 text-gray-400 hover:bg-gray-600";

    return (
        <header className="bg-gray-800 shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src="https://picsum.photos/seed/nutrisnap/40/40" alt="logo" className="w-10 h-10 rounded-full" />
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">NutriSnap AI</h1>
                </div>
                <nav className="flex items-center gap-2 p-1 bg-gray-900 rounded-lg">
                    <button
                        onClick={() => setCurrentView('analyzer')}
                        className={`${baseClasses} ${currentView === 'analyzer' ? activeClasses : inactiveClasses}`}
                    >
                        <CameraIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Analyzer</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('chatbot')}
                        className={`${baseClasses} ${currentView === 'chatbot' ? activeClasses : inactiveClasses}`}
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Chat</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
