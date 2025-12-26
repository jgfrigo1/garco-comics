// src/types.ts

// Defines the structure of a single comic book volume
export interface Volume {
  id: string;
  seriesTitle: string;
  volumeNumber: string;
  coverUrl: string;
  folderPath: string; // e.g., 'local' or 'online'
  pages: { url: string }[];
}

// Defines the structure for a reading progress bookmark
export interface Bookmark {
  volumeId: string;
  pageIndex: number;
  timestamp: number;
}

// Defines the structure for application configuration
export interface Config {
  cloudflareWorkerUrl: string;
  webDavUrl: string;
  webDavUser: string;
  webDavPass: string;
  geminiApiKey: string;
}

// (Kept for future expandability)
export interface Category {
  id: string;
  name: string;
}

// (Kept for future expandability)
export interface LibraryData {
  categories: Category[];
  volumeAssignments: { [volumeId: string]: string[] }; // volumeId -> [categoryId]
}

// Defines the entire state of your main App component
export interface AppState {
  isAuthenticated: boolean;
  currentView: 'auth' | 'library' | 'reader';
  activeVolumeId: string | null;
  volumes: Volume[];
  bookmarks: { [key: string]: Bookmark };
  fileHandle: FileSystemDirectoryHandle | null; // For potential local folder access in the future
  libraryData: LibraryData;
  selectedCategoryId: string | null;
  searchQuery: string;
  config: Config;
  selectedSeries: string | null;
}
