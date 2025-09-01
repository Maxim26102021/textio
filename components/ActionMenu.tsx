import React from 'react';
import { SparklesIcon } from './Icons';
import { ChatMode } from '../types';

interface ActionMenuProps {
  onModeSelect: (mode: ChatMode) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onModeSelect }) => {
  const menuOptions = [
    {
      label: "Генерация аннотаций...",
      mode: 'annotation_picker',
      disabled: false,
    },
    {
      label: "AI-резюме главы...",
      mode: 'summary_picker',
      disabled: false,
    },
    {
      label: "Подобрать жанры и теги",
      mode: 'genre_picker',
      disabled: false,
    },
  ];

  return (
    <div className="relative inline-block group">
      <button className="flex items-center gap-2 bg-gray-800 border border-gray-700 hover:border-indigo-500 hover:text-indigo-400 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors">
        <SparklesIcon className="w-5 h-5"/>
        <span>Работа с текстом</span>
      </button>
      <div className="absolute bottom-full mb-2 w-72 origin-bottom scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 ease-out z-20">
        <ul className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden transition-colors">
          {menuOptions.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => option.mode && onModeSelect(option.mode as ChatMode)}
                disabled={option.disabled}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:text-gray-300"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActionMenu;