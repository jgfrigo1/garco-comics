// src/types.ts

export interface Volume {
  id: string;
  seriesTitle: string;
  volumeNumber: string;
  coverUrl: string;
  folderPath: string;
  pages: { url: string }[];
}

export interface Bookmark {
  volumeId: string;
  pageIndex: number;
  timestamp: number;
}

export interface Config {
  cloudflareWorkerUrl: string;
  webDavUrl: string;
  webDavUser: string;
  webDavPass: string;
  geminiApiKey: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface LibraryData {
  categories: Category[];
  volumeAssignments: { [volumeId: string]: string[] };
}

export interface AppState {
  isAuthenticated: boolean;
  currentView: 'auth' | 'library' | 'reader';
  activeVolumeId: string | null;
  volumes: Volume[];
  bookmarks: { [key: string]: Bookmark };
  fileHandle: FileSystemDirectoryHandle | null;
  libraryData: LibraryData;
  selectedCategoryId: string | null;
  searchQuery: string;
  config: Config;
  selectedSeries: string | null;
}
