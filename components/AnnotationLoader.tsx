import React from 'react';
import { BotIcon } from './Icons';

const AnnotationLoader: React.FC = () => {
  return (
    <div className="flex items-start gap-4 max-w-4xl mx-auto justify-start">
      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-600 transition-colors">
        <BotIcon className="w-6 h-6 text-indigo-400" />
      </div>
      <div className="bg-gray-700 rounded-xl px-5 py-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 relative">
            <svg viewBox="0 0 50 40" className="w-full h-full text-indigo-400">
              {/* Stars */}
              <path d="M25 2 l3 9 h9 l-7 6 l3 9 l-8 -5 l-8 5 l3 -9 l-7 -6 h9 z" fill="currentColor">
                 <animateTransform attributeName="transform" type="rotate" from="0 25 20" to="360 25 20" dur="10s" repeatCount="indefinite" />
                 <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </path>
               <path d="M5 15 l1.5 4.5 h4.5 l-3.5 3 l1.5 4.5 l-4 -2.5 l-4 2.5 l1.5 -4.5 l-3.5 -3 h4.5 z" fill="currentColor" opacity="0.7">
                  <animateTransform attributeName="transform" type="rotate" from="360 5 20" to="0 5 20" dur="12s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.5s" repeatCount="indefinite" />
              </path>
               <path d="M45 25 l1.5 4.5 h4.5 l-3.5 3 l1.5 4.5 l-4 -2.5 l-4 2.5 l1.5 -4.5 l-3.5 -3 h4.5 z" fill="currentColor" opacity="0.6">
                  <animateTransform attributeName="transform" type="rotate" from="0 45 30" to="360 45 30" dur="8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.8s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <span className="font-medium text-gray-300">Создаю аннотацию...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationLoader;