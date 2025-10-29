
import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import { AnalysisResult } from '../types';
import MealCard from './MealCard';
import LoadingSpinner from './LoadingSpinner';
import { ArrowUpOnSquareIcon, PhotoIcon } from './Icons';

const PhotoAnalyzer: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAnalysis(null);
            setError(null);
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeClick = useCallback(async () => {
        if (!imageFile || !imagePreview) return;

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const base64Image = imagePreview.split(',')[1];
            if (!base64Image) {
                throw new Error("Could not read image data.");
            }
            const result = await analyzeImage(base64Image, imageFile.type);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [imageFile, imagePreview]);
    
    const DropZone: React.FC = () => (
      <div 
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-600 p-12 text-center hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileChange({ target: { files: [file] } } as any);
          }}
      >
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
          <span className="mt-2 block text-sm font-semibold text-gray-400">
              Drop an image or{' '}
              <label htmlFor="file-upload" className="cursor-pointer font-bold text-teal-500 hover:text-teal-400">
                  upload a file
              </label>
          </span>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
      </div>
    );

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-2xl text-center">
                <h2 className="text-3xl font-bold text-white">Analyze Your Meal</h2>
                <p className="mt-2 text-lg text-gray-400">Upload a photo of your food to get an instant nutritional analysis.</p>
            </div>

            <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-xl shadow-lg space-y-4">
                {imagePreview ? (
                    <div className="flex flex-col items-center">
                        <img src={imagePreview} alt="Meal preview" className="max-h-80 w-auto rounded-lg shadow-md" />
                         <button onClick={() => {setImagePreview(null); setImageFile(null); setAnalysis(null);}} className="mt-4 text-sm text-teal-500 hover:underline">
                            Choose a different image
                        </button>
                    </div>
                ) : (
                    <DropZone />
                )}

                {imagePreview && (
                    <button
                        onClick={handleAnalyzeClick}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner />
                                Analyzing...
                            </>
                        ) : (
                           <>
                             <ArrowUpOnSquareIcon className="w-5 h-5" />
                             Analyze Meal
                           </>
                        )}
                    </button>
                )}
            </div>
            
            {error && (
                <div className="w-full max-w-2xl p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                    <p className="font-bold">Analysis Failed</p>
                    <p>{error}</p>
                </div>
            )}
            
            {analysis && <MealCard result={analysis} />}
        </div>
    );
};

export default PhotoAnalyzer;
