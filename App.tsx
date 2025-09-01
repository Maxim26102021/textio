import React, { useState, useCallback } from 'react';
import { ChatMessage, TextMessage, Change, ChangeType, ChatMode, AnnotationMessage } from './types';
import FileUpload from './components/FileUpload';
import ChatView from './components/ChatView';
import ChangesSidebar from './components/ChangesSidebar';
import { analyzeBook, generateGenresAndTags, generateChapterSummary, generateAnnotation } from './services/geminiService';

const App: React.FC = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<ChatMode>('default');
  const [changes, setChanges] = useState<Change[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [animateToggle, setAnimateToggle] = useState<boolean>(false);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleFileAccept = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
      setFileName(file.name);
      setMessages([
        {
          id: `ai-intro-${Date.now()}`,
          text: `Файл "${file.name}" был успешно загружен. Теперь вы можете работать с текстом. Воспользуйтесь меню опций или задайте свой вопрос.`,
          sender: 'ai',
          type: 'text',
        },
      ]);
    };
    reader.readAsText(file);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!fileContent) return;

    const newUserMessage: TextMessage = {
      id: `user-${Date.now()}`,
      text: text,
      sender: 'user',
      type: 'text',
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      let aiResponseText: string;
      if (chatMode === 'annotation_picker') {
        aiResponseText = await generateAnnotation(fileContent, text);
        const newAiMessage: AnnotationMessage = {
          id: `ai-annotation-${Date.now()}`,
          text: aiResponseText,
          sender: 'ai',
          type: 'annotation',
        };
        setMessages((prev) => [...prev, newAiMessage]);
      } else { // default mode
        aiResponseText = await analyzeBook(fileContent, text);
        const newAiMessage: TextMessage = {
          id: `ai-${Date.now()}`,
          text: aiResponseText,
          sender: 'ai',
          type: 'text',
        };
        setMessages((prev) => [...prev, newAiMessage]);
      }
    } catch (error) {
       const newErrorMessage: TextMessage = {
        id: `ai-error-${Date.now()}`,
        text: 'К сожалению, произошла ошибка при обработке вашего запроса.',
        sender: 'ai',
        type: 'text',
      };
      setMessages((prev) => [...prev, newErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [fileContent, chatMode]);
  
  const handleModeSelect = useCallback(async (mode: ChatMode) => {
    if (!fileContent) return;

    setChatMode(mode);

    if (mode === 'genre_picker') {
      setIsLoading(true);
      const userMessage: TextMessage = {
        id: `user-mode-${Date.now()}`,
        text: "Подобрать жанры и теги.",
        sender: 'user',
        type: 'text',
      };
      setMessages(prev => [...prev, userMessage]);
      try {
        const genres = await generateGenresAndTags(fileContent);
        const genreMessage: ChatMessage = {
          id: `ai-genres-${Date.now()}`,
          sender: 'ai',
          type: 'genre_slider',
          items: genres,
        };
        setMessages(prev => [...prev, genreMessage]);
      } catch (error) {
        // Handle error...
      } finally {
        setIsLoading(false);
      }
    } else if (mode === 'summary_picker') {
        const userMessage: TextMessage = {
            id: `user-mode-${Date.now()}`,
            text: "AI-резюме главы...",
            sender: 'user',
            type: 'text',
        };
        const aiPrompt: TextMessage = {
            id: `ai-prompt-${Date.now()}`,
            text: "Отлично! Пожалуйста, опишите главу или сцену, для которой нужно создать резюме. Например: 'сцена, где герой впервые встречает дракона'.",
            sender: 'ai',
            type: 'text',
        };
        setMessages(prev => [...prev, userMessage, aiPrompt]);
    } else if (mode === 'annotation_picker') {
      setIsLoading(true);
      const userMessage: TextMessage = {
        id: `user-mode-${Date.now()}`,
        text: "Сгенерировать аннотацию...",
        sender: 'user',
        type: 'text',
      };
      setMessages(prev => [...prev, userMessage]);
      try {
        const annotation = await generateAnnotation(fileContent);
        const annotationMessage: AnnotationMessage = {
          id: `ai-annotation-${Date.now()}`,
          sender: 'ai',
          type: 'annotation',
          text: annotation,
        };
        setMessages(prev => [...prev, annotationMessage]);
      } catch (error) {
        // handle error
      } finally {
        setIsLoading(false);
      }
    }
  }, [fileContent]);
  
  const handleGenerateSummary = useCallback(async (description: string) => {
    if (!fileContent) return;

    const newUserMessage: TextMessage = {
      id: `user-${Date.now()}`,
      text: description,
      sender: 'user',
      type: 'text',
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const result = await generateChapterSummary(fileContent, description);
      if (result.found && result.summary && result.title) {
        const newChange: Change = {
            id: `change-${Date.now()}`,
            type: ChangeType.CHAPTER_SUMMARY,
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            data: { title: result.title, summary: result.summary },
        };
        setChanges(prev => [...prev, newChange]);
        if (!isSidebarOpen) {
          setAnimateToggle(true);
          setTimeout(() => setAnimateToggle(false), 500);
        }
        
        const confirmationMsg: TextMessage = {
            id: `ai-confirm-${Date.now()}`,
            sender: 'ai',
            type: 'text',
            text: `Резюме для "${result.title}" успешно создано и добавлено в историю. Вы можете скачать его из боковой панели.`,
        };
        setMessages(prev => [...prev, confirmationMsg]);
        setChatMode('default');
      } else {
        const clarificationMsg: TextMessage = {
            id: `ai-clarify-${Date.now()}`,
            sender: 'ai',
            type: 'text',
            text: result.clarificationNeeded || 'Не удалось найти указанную сцену. Попробуйте описать ее по-другому.',
        };
        setMessages(prev => [...prev, clarificationMsg]);
      }
    } catch (error) {
        const errorMessage: TextMessage = {
            id: `ai-error-${Date.now()}`,
            text: 'Произошла ошибка при создании резюме. Пожалуйста, попробуйте еще раз.',
            sender: 'ai',
            type: 'text',
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }

  }, [fileContent, isSidebarOpen]);


  const handleApplyGenres = useCallback((selectedItems: string[]) => {
    setChatMode('default');

    if (selectedItems.length > 0) {
      const newChange: Change = {
        id: `change-${Date.now()}`,
        type: ChangeType.GENRES_AND_TAGS,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        data: selectedItems,
      };
      setChanges(prev => [...prev, newChange]);
      if (!isSidebarOpen) {
        setAnimateToggle(true);
        setTimeout(() => setAnimateToggle(false), 500);
      }
    }

    const confirmationText = selectedItems.length > 0
      ? `Отлично! Выбранные жанры и теги добавлены в историю изменений. Теперь вы можете задать следующий вопрос.`
      : 'Вы не выбрали ни одного жанра или тега. Режим подбора завершен. Можете задать другой вопрос.';
      
    const newAiMessage: TextMessage = {
      id: `ai-confirm-${Date.now()}`,
      text: confirmationText,
      sender: 'ai',
      type: 'text',
    };
    setMessages((prev) => [...prev, newAiMessage]);
  }, [isSidebarOpen]);
  
  const handleApplyAnnotation = useCallback((annotation: string) => {
    setChatMode('default');
    
    const newChange: Change = {
      id: `change-annotation-${Date.now()}`,
      type: ChangeType.ANNOTATION,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      data: { title: "Аннотация к книге", annotation },
    };
    setChanges(prev => [...prev, newChange]);
    if (!isSidebarOpen) {
      setAnimateToggle(true);
      setTimeout(() => setAnimateToggle(false), 500);
    }
    
    const newAiMessage: TextMessage = {
      id: `ai-confirm-annotation-${Date.now()}`,
      text: 'Аннотация была успешно сохранена в истории изменений. Вы можете скачать ее из боковой панели.',
      sender: 'ai',
      type: 'text',
    };
    setMessages((prev) => [...prev, newAiMessage]);
  }, [isSidebarOpen]);

  const handleReset = useCallback(() => {
    setFileContent(null);
    setFileName(null);
    setMessages([]);
    setChanges([]);
    setIsLoading(false);
    setChatMode('default');
  }, []);
  
  const getThemeClass = () => {
    switch(chatMode) {
      case 'genre_picker': return 'theme-pink';
      case 'summary_picker': return 'theme-green';
      case 'annotation_picker': return 'theme-yellow';
      default: return '';
    }
  }

  return (
    <div className={`h-screen w-screen bg-gray-900 text-white flex flex-col font-sans transition-colors duration-500 ${getThemeClass()}`}>
      {fileContent && fileName ? (
        <div className="flex h-full w-full">
          <div className="flex-1 h-full min-w-0">
            <ChatView
              fileName={fileName}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onReset={handleReset}
              chatMode={chatMode}
              onModeSelect={handleModeSelect}
              onApplyGenres={handleApplyGenres}
              onGenerateSummary={handleGenerateSummary}
              onApplyAnnotation={handleApplyAnnotation}
            />
          </div>
          <ChangesSidebar 
            changes={changes} 
            isOpen={isSidebarOpen} 
            onToggle={handleToggleSidebar} 
            animateToggle={animateToggle}
          />
        </div>
      ) : (
        <FileUpload onFileAccept={handleFileAccept} />
      )}
    </div>
  );
};

export default App;