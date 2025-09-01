
import React, { useState, useCallback } from 'react';
import { BookOpenIcon } from './Icons';

interface FileUploadProps {
  onFileAccept: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileAccept }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/plain') {
        onFileAccept(file);
      } else {
        alert('Пожалуйста, загрузите файл в формате .txt');
      }
    }
  }, [onFileAccept]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileAccept(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <div 
        className={`w-full max-w-2xl h-96 flex flex-col items-center justify-center border-4 border-dashed rounded-2xl transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-gray-800' : 'border-gray-700 hover:border-indigo-600'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center pointer-events-none">
          <BookOpenIcon className="w-24 h-24 mx-auto text-gray-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Загрузите вашу книгу</h2>
          <p className="text-gray-400">Перетащите сюда файл .txt или нажмите кнопку ниже</p>
        </div>
        <label htmlFor="file-upload" className="mt-6 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105">
          Выбрать файл
        </label>
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          accept=".txt" 
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500 mt-4">Поддерживается только формат .txt</p>
      </div>
       <div className="text-center mt-8 max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-2">Author's AI Assistant</h1>
            <p className="text-lg text-gray-300">Ваш персональный помощник для анализа и работы с текстами.</p>
        </div>
    </div>
  );
};

export default FileUpload;
