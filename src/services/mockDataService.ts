import { Bookmark, Config } from '../types';

// --- Bookmarks ---

export const loadBookmarks = (): { [key: string]: Bookmark } => {
  try {
    const savedBookmarks = localStorage.getItem('garco_bookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : {};
  } catch (error) {
    console.error("Failed to load bookmarks from localStorage:", error);
    return {};
  }
};

export const saveBookmarkLocal = (volumeId: string, pageIndex: number): void => {
  const bookmarks = loadBookmarks();
  const newBookmark: Bookmark = {
    volumeId,
    pageIndex,
    timestamp: Date.now(),
  };
  bookmarks[volumeId] = newBookmark;
  try {
    localStorage.setItem('garco_bookmarks', JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Failed to save bookmark to localStorage:", error);
  }
};


// --- Config ---

export const loadConfig = (): Config => {
  const defaultConfig: Config = {
    cloudflareWorkerUrl: '',
    webDavUrl: '',
    webDavUser: '',
    webDavPass: '',
    geminiApiKey: '',
  };
  try {
    const savedConfig = localStorage.getItem('garco_config');
    return savedConfig ? { ...defaultConfig, ...JSON.parse(savedConfig) } : defaultConfig;
  } catch (error) {
    console.error("Failed to load config from localStorage:", error);
    return defaultConfig;
  }
};

// These functions are no longer used for primary data loading but are kept for potential future use.
// You can remove them if you are certain you will only use the local comics.json.
export const fetchOnlineLibrary = async () => {
    console.warn("fetchOnlineLibrary is a mock and does nothing.");
    return { volumes: [], libraryData: { categories: [], volumeAssignments: {} } };
};

export const selectLocalFolder = async () => {
    console.warn("selectLocalFolder is a mock and does nothing.");
    return { handle: null, volumes: [], libraryData: { categories: [], volumeAssignments: {} } };
};
