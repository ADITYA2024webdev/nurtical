
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createChat, sendMessageStream } from '../services/geminiService';
import { ChatMessage, Source } from '../types';
import { PaperAirplaneIcon } from './Icons';
import type { Chat } from '@google/genai';

const NutritionChatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        chatRef.current = createChat();
        setMessages([
            { role: 'assistant', content: 'Hello! I am Nutri-Chat. How can I help you with your nutrition questions today?' }
        ]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
        setMessages(prev => [...prev, assistantMessage]);

        if (chatRef.current) {
            try {
                await sendMessageStream(chatRef.current, input, (chunkText, sources) => {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage && lastMessage.role === 'assistant') {
                            lastMessage.content += chunkText;
                             if(sources) {
                                lastMessage.sources = sources;
                             }
                        }
                        return newMessages;
                    });
                });
            } catch (error) {
                console.error("Chat error:", error);
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage) {
                        lastMessage.content = "Sorry, I encountered an error. Please try again.";
                    }
                    return newMessages;
                });
            } finally {
                setIsLoading(false);
            }
        }
    }, [input, isLoading]);

    return (
        <div className="flex flex-col h-[calc(100vh-150px)] max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                {msg.sources && (
                                    <div className="mt-2 border-t border-gray-600 pt-2">
                                        <h4 className="text-xs font-bold text-gray-400 mb-1">Sources:</h4>
                                        <ul className="space-y-1">
                                            {msg.sources.map((source, i) => (
                                                <li key={i} className="text-xs">
                                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline truncate block">
                                                        {i+1}. {source.title || source.uri}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && messages[messages.length-1].role === 'user' && (
                         <div className="flex justify-start">
                            <div className="max-w-lg px-4 py-2 rounded-xl bg-gray-700 text-gray-300">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 bg-gray-900/50 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a nutrition question..."
                        className="flex-1 bg-gray-700 border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NutritionChatbot;
