import React from 'react';
import { AnnotationMessage } from '../types';
import { BotIcon, CheckIcon } from './Icons';

interface AnnotationBubbleProps {
  message: AnnotationMessage;
  onApply: (annotationText: string) => void;
}

const AnnotationBubble: React.FC<AnnotationBubbleProps> = ({ message, onApply }) => {
  return (
    <div className="flex items-start gap-4 max-w-4xl mx-auto justify-start">
      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-600 mt-2 transition-colors">
        <BotIcon className="w-6 h-6 text-indigo-400" />
      </div>
      <div className="flex-1 bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 transition-colors">
        <p className="whitespace-pre-wrap text-white mb-4">{message.text}</p>
        <div className="mt-4 pt-4 border-t border-gray-600 flex justify-end">
          <button
            onClick={() => onApply(message.text)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg transition-colors"
          >
            <CheckIcon className="w-5 h-5" />
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnotationBubble;
