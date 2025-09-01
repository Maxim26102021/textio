import React from 'react';
import { BotIcon } from './Icons';

const CreativeLoader: React.FC = () => {
  return (
    <div className="flex items-start gap-4 max-w-4xl mx-auto justify-start">
      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-600 transition-colors">
        <BotIcon className="w-6 h-6 text-indigo-400" />
      </div>
      <div className="bg-gray-700 rounded-xl px-5 py-3 transition-colors">
        <div className="flex items-end gap-2">
          <svg width="60" height="40" viewBox="0 0 60 40" className="text-gray-400">
            {/* Person */}
            <circle cx="10" cy="15" r="5" fill="currentColor" />
            <path d="M10 20 v15 h-2 v-10" fill="none" stroke="currentColor" strokeWidth="2" />
            {/* Book */}
            <path d="M20 30 Q35 10 50 30" fill="none" stroke="currentColor" strokeWidth="2">
              <animate attributeName="d" values="M20 30 Q35 10 50 30; M20 30 Q35 40 50 30; M20 30 Q35 10 50 30" dur="1.5s" repeatCount="indefinite" />
            </path>
          </svg>
          <div className="flex items-center justify-center space-x-1 pb-2">
              <span className="font-medium text-gray-300">Анализирую книгу...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeLoader;
