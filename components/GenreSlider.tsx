import React, { useState } from 'react';
import { BotIcon, CheckIcon } from './Icons';

interface GenreSliderProps {
  items: string[];
  onApply: (selectedItems: string[]) => void;
}

const ITEMS_PER_PAGE = 15;

const GenreSlider: React.FC<GenreSliderProps> = ({ items, onApply }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const handleSelect = (item: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(item)) {
      newSelected.delete(item);
    } else {
      newSelected.add(item);
    }
    setSelected(newSelected);
  };

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, items.length));
  };
  
  const visibleItems = items.slice(0, visibleCount);

  return (
    <div className="flex items-start gap-4 max-w-4xl mx-auto justify-start">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-600 mt-2 transition-colors">
          <BotIcon className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="flex-1 bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 transition-colors">
            <p className="text-sm text-gray-300 mb-3">Я проанализировал вашу книгу. Выберите подходящие жанры и теги из списка ниже:</p>
            <div className="flex flex-wrap gap-2">
                {visibleItems.map((item) => {
                    const isSelected = selected.has(item);
                    return (
                        <button 
                            key={item}
                            onClick={() => handleSelect(item)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-600 hover:border-indigo-500'}`}
                        >
                           {isSelected && <CheckIcon className="w-4 h-4" />}
                           {item}
                        </button>
                    )
                })}
                 {visibleCount < items.length && (
                    <button
                        onClick={handleShowMore}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-600 hover:bg-gray-500 transition-colors"
                    >
                        Показать еще...
                    </button>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-600 flex justify-end">
                <button
                    onClick={() => onApply(Array.from(selected))}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50"
                    disabled={selected.size === 0}
                    title={selected.size === 0 ? "Выберите хотя бы один тег" : "Применить выбранные теги"}
                >
                    Применить
                </button>
            </div>
        </div>
    </div>
  );
};

export default GenreSlider;
