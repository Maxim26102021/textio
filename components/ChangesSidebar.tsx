import React from 'react';
import { Change, ChangeType } from '../types';
import { TagIcon, DocumentDownloadIcon, PencilIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from './Icons';

interface ChangesSidebarProps {
  changes: Change[];
  isOpen: boolean;
  onToggle: () => void;
  animateToggle?: boolean;
}

const downloadTxtFile = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${filename}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
}

const ChangeCard: React.FC<{ change: Change }> = ({ change }) => {
  const renderContent = () => {
    switch (change.type) {
      case ChangeType.GENRES_AND_TAGS:
        return (
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-indigo-400">
                <TagIcon className="w-5 h-5" />
                Жанры и теги
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(change.data).map((item) => (
                <span key={item} className="bg-gray-600 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      case ChangeType.CHAPTER_SUMMARY:
        return (
            <div>
                 <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-indigo-400">
                    <DocumentDownloadIcon className="w-5 h-5" />
                    Резюме главы
                </div>
                <p className="text-sm font-medium text-white mb-2 truncate">"{change.data.title}"</p>
                <button 
                  onClick={() => downloadTxtFile(change.data.summary, change.data.title)}
                  className="w-full text-center text-sm bg-gray-700 hover:bg-gray-600 text-indigo-400 font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                    Скачать .txt
                </button>
            </div>
        );
      case ChangeType.ANNOTATION:
        return (
             <div>
                 <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-indigo-400">
                    <PencilIcon className="w-5 h-5" />
                    Аннотация
                </div>
                <p className="text-sm font-medium text-white mb-2 truncate">"{change.data.title}"</p>
                <button 
                  onClick={() => downloadTxtFile(change.data.annotation, change.data.title)}
                  className="w-full text-center text-sm bg-gray-700 hover:bg-gray-600 text-indigo-400 font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                    Скачать .txt
                </button>
            </div>
        )
      default:
        return <p>Неизвестное изменение</p>;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 transition-colors">
      <div className="flex justify-between items-start">
         {renderContent()}
      </div>
       <div className="text-right text-xs text-gray-500 mt-2">
            {change.timestamp}
       </div>
    </div>
  );
};

const ChangesSidebar: React.FC<ChangesSidebarProps> = ({ changes, isOpen, onToggle, animateToggle }) => {
  return (
    <aside className={`h-full bg-gray-900 border-l border-gray-700 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'w-80' : 'w-16'}`}>
      <header className={`flex-shrink-0 border-b border-gray-700 p-2 h-[60px] flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">История изменений</h2>
            <p className="text-sm text-gray-400 truncate">Здесь отображаются все ваши действия.</p>
          </div>
        )}
         <button 
            onClick={onToggle} 
            className={`p-2 rounded-md hover:bg-gray-700 transition-colors flex-shrink-0 ${animateToggle ? 'animate-nudge' : ''}`}
            title={isOpen ? "Свернуть панель" : "Развернуть панель"}
        >
            {isOpen ? <ChevronDoubleRightIcon className="w-6 h-6 text-gray-400" /> : <ChevronDoubleLeftIcon className="w-6 h-6 text-gray-400" />}
        </button>
      </header>
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {changes.length > 0 ? (
          changes.map((change) => <ChangeCard key={change.id} change={change} />)
        ) : (
          <div className="text-center text-gray-500 mt-8 px-4">
            <p>Ваши изменения появятся здесь после того, как вы примените их в чате.</p>
          </div>
        )}
      </div>
       <footer className={`flex-shrink-0 border-t border-gray-700 p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={changes.length === 0}
            title={changes.length === 0 ? "Нет изменений для применения" : "Применить все изменения"}
           >
            Применить все изменения
          </button>
      </footer>
    </aside>
  );
};

export default ChangesSidebar;