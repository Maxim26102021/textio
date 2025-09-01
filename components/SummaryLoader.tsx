import React from 'react';
import { BotIcon, MagnifyingGlassIcon } from './Icons';

const SummaryLoader: React.FC = () => {
  return (
    <div className="flex items-start gap-4 max-w-4xl mx-auto justify-start">
      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-600 transition-colors">
        <BotIcon className="w-6 h-6 text-indigo-400" />
      </div>
      <div className="bg-gray-700 rounded-xl px-5 py-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-10">
            <MagnifyingGlassIcon className="w-10 h-10 text-gray-400 absolute top-0 left-0 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                    <path d="M 5 10 H 35 M 5 20 H 35 M 5 30 H 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-500" />
                </svg>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-1">
              <span className="font-medium text-gray-300">Ищу в тексте...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryLoader;