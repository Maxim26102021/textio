import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatMode } from '../types';
import ChatBubble from './ChatBubble';
import AnnotationBubble from './AnnotationBubble';
import ActionMenu from './ActionMenu';
import GenreSlider from './GenreSlider';
import CreativeLoader from './CreativeLoader';
import SummaryLoader from './SummaryLoader';
import AnnotationLoader from './AnnotationLoader';
import { PaperclipIcon, SendIcon, RefreshIcon } from './Icons';

interface ChatViewProps {
  fileName: string;
  messages: ChatMessage[];
  onSendMessage: (prompt: string) => void;
  isLoading: boolean;
  onReset: () => void;
  chatMode: ChatMode;
  onModeSelect: (mode: ChatMode) => void;
  onApplyGenres: (selectedItems: string[]) => void;
  onGenerateSummary: (description: string) => void;
  onApplyAnnotation: (annotation: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ fileName, messages, onSendMessage, isLoading, onReset, chatMode, onModeSelect, onApplyGenres, onGenerateSummary, onApplyAnnotation }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    if (chatMode === 'default' || chatMode === 'annotation_picker') {
      onSendMessage(inputValue);
    } else if (chatMode === 'summary_picker') {
      onGenerateSummary(inputValue);
    }
    setInputValue('');
  };

  const getPlaceholderText = () => {
    switch(chatMode) {
      case 'genre_picker':
        return "Выберите жанры и теги выше...";
      case 'summary_picker':
        return isLoading ? "Анализирую ваш запрос..." : "Опишите сцену для резюме...";
      case 'annotation_picker':
        return isLoading ? "Создаю магию..." : "Введите ваши правки для улучшения аннотации...";
      default:
        return "Или введите свой вопрос здесь...";
    }
  }

  const isInputDisabled = isLoading || chatMode === 'genre_picker';

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-8 h-[60px] flex justify-between items-center z-10 transition-colors">
        <div className="flex items-center gap-3">
          <PaperclipIcon className="w-6 h-6 text-indigo-400" />
          <span className="font-semibold text-lg truncate">{fileName}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          if (msg.type === 'text') {
            return <ChatBubble key={msg.id} message={msg} />;
          }
          if (msg.type === 'genre_slider') {
            return <GenreSlider key={msg.id} items={msg.items} onApply={onApplyGenres} />;
          }
          if (msg.type === 'annotation') {
            return <AnnotationBubble key={msg.id} message={msg} onApply={onApplyAnnotation} />;
          }
          return null;
        })}
        {isLoading && chatMode === 'genre_picker' && <CreativeLoader />}
        {isLoading && chatMode === 'summary_picker' && <SummaryLoader />}
        {isLoading && chatMode === 'annotation_picker' && <AnnotationLoader />}
        {isLoading && chatMode === 'default' && <ChatBubble message={{ id: 'loading', type: 'text', text: '...', sender: 'ai' }} isLoading={true} />}
        <div ref={messagesEndRef} />
      </main>

      <footer className="flex-shrink-0 bg-gray-900 p-4 border-t border-gray-700 transition-colors">
        <div className="max-w-4xl mx-auto">
          {chatMode === 'default' && <ActionMenu onModeSelect={onModeSelect} />}
          <form onSubmit={handleSubmit} className="relative mt-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getPlaceholderText()}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              disabled={isInputDisabled}
            />
            <button
              type="submit"
              disabled={isInputDisabled || !inputValue.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 hover:text-white hover:bg-indigo-600 disabled:hover:bg-transparent disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default ChatView;