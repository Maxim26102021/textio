export type TextMessage = {
  id: string;
  sender: 'user' | 'ai';
  type: 'text';
  text: string;
};

export type GenreSliderMessage = {
  id: string;
  sender: 'ai';
  type: 'genre_slider';
  items: string[];
};

export type AnnotationMessage = {
  id: string;
  sender: 'ai';
  type: 'annotation';
  text: string;
};

export type ChatMessage = TextMessage | GenreSliderMessage | AnnotationMessage;

export type ChatMode = 'default' | 'genre_picker' | 'summary_picker' | 'annotation_picker';

// New types for the Changes Sidebar
export enum ChangeType {
  GENRES_AND_TAGS = 'GENRES_AND_TAGS',
  CHAPTER_SUMMARY = 'CHAPTER_SUMMARY',
  ANNOTATION = 'ANNOTATION',
}

export type GenreChange = {
  id: string;
  type: ChangeType.GENRES_AND_TAGS;
  timestamp: string;
  data: string[];
};

export type SummaryChange = {
  id: string;
  type: ChangeType.CHAPTER_SUMMARY;
  timestamp: string;
  data: {
    title: string;
    summary: string;
  };
};

export type AnnotationChange = {
  id: string;
  type: ChangeType.ANNOTATION;
  timestamp: string;
  data: {
    title: string;
    annotation: string;
  };
};

export type Change = GenreChange | SummaryChange | AnnotationChange;