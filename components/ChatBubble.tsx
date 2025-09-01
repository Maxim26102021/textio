import React from 'react';
import { TextMessage } from '../types';
import { UserIcon, BotIcon } from './Icons';

interface ChatBubbleProps {
  message: TextMessage;
  isLoading?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLoading = false }) => {
  const isUser = message.sender === 'user';
  const bubbleClasses = isUser
    ? 'bg-indigo-600 ml-auto'
    : 'bg-gray-700';
  const alignmentClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex items-start gap-4 max-w-4xl mx-auto ${alignmentClasses}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-600 transition-colors">
          <BotIcon className="w-6 h-6 text-indigo-400" />
        </div>
      )}
      
      <div className={`rounded-xl px-5 py-3 ${bubbleClasses} max-w-[80%] transition-colors`}>
        {isLoading ? (
          <div className="flex items-center justify-center space-x-1">
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.text}</p>
        )}
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-600 transition-colors">
          <UserIcon className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
