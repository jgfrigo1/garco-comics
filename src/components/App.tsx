// src/App.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AppState, Volume } from './types';
import { loadBookmarks, saveBookmarkLocal, loadConfig, fetchOnlineLibrary } from './services/mockDataService';
import AuthView from './components/AuthView';
import LibraryView from './components/LibraryView';
import ReaderView from './components/ReaderView';
import SpideyChat from './components/SpideyChat';
import { Menu, X } from 'lucide-react';

const APP_TITLE = "Garco Comics";
const PASSWORD = "peter";

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    currentView: 'library',
    activeVolumeId: null,
    volumes: [],
    bookmarks: {},
    fileHandle: null,
    libraryData: { categories: [], volumeAssignments: {} },
    selectedCategoryId: null,
    searchQuery: '',
    config: { cloudflareWorkerUrl: '', webDavUrl: '', webDavUser: '', webDavPass: '', geminiApiKey: '' },
    selectedSeries: null,
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedAlpha, setExpandedAlpha] = useState<Record<string, boolean>>({});
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const config = loadConfig();
    const books = loadBookmarks();
    setState(prev => ({ ...prev, bookmarks: books, config: config }));
  }, []);

  useEffect(() => {
    if (state.isAuthenticated && state.volumes.length === 0) {
      handleSyncOnline();
    }
  }, [state.isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      setState(prev => ({ ...prev, isAuthenticated: true }));
      setErrorMsg('');
    } else {
      setErrorMsg('Contrasenya incorrecta.');
    }
  };

  const handleSyncOnline = async () => {
    setIsLoadingLibrary(true);
    const result = await fetchOnlineLibrary();
    setState(prev => ({
        ...prev,
        volumes: [...prev.volumes.filter(v => v.folderPath !== 'online'), ...result.volumes],
        libraryData: {
            categories: result.libraryData.categories,
            volumeAssignments: { ...prev.libraryData.volumeAssignments, ...result.libraryData.volumeAssignments }
        }
    }));
    setIsLoadingLibrary(false);
  };
  
  const openVolume = (volumeId: string) => {
    const bookmark = state.bookmarks[volumeId];
    setCurrentPageIndex(bookmark ? bookmark.pageIndex : 0);
    setState(prev => ({ ...prev, currentView: 'reader', activeVolumeId: volumeId }));
  };

  const closeReader = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    setState(prev => ({ ...prev, currentView: 'library', activeVolumeId: null }));
  };

  const handlePageChange = useCallback((direction: 'next' | 'prev') => {
    const activeVol = state.volumes.find(v => v.id === state.activeVolumeId);
    if (!activeVol) return;

    let newIndex = currentPageIndex;
    if (direction === 'next' && currentPageIndex < activeVol.pages.length - 1) newIndex++;
    else if (direction === 'prev' && currentPageIndex > 0) newIndex--;

    if (newIndex !== currentPageIndex) {
      setCurrentPageIndex(newIndex);
      if (state.activeVolumeId) {
        saveBookmarkLocal(state.activeVolumeId, newIndex);
        setState(prev => ({
          ...prev,
          bookmarks: { ...prev.bookmarks, [prev.activeVolumeId!]: { volumeId: prev.activeVolumeId!, pageIndex: newIndex, timestamp: Date.now() } }
        }));
      }
    }
  }, [currentPageIndex, state.activeVolumeId, state.volumes]);

  useEffect(() => {
    if (state.currentView !== 'reader') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') handlePageChange('next');
      if (e.key === 'ArrowLeft' || e.key === 'a') handlePageChange('prev');
      if (e.key === 'Escape') closeReader();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.currentView, handlePageChange]);

  const hierarchyByAlpha = useMemo(() => {
      const hierarchy: Record<string, Record<string, Volume[]>> = {};
      state.volumes.filter(v => 
        v.seriesTitle.toLowerCase().includes(state.searchQuery.toLowerCase())
      ).forEach(vol => {
          const firstChar = vol.seriesTitle.charAt(0).toUpperCase();
          const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
          if (!hierarchy[letter]) hierarchy[letter] = {};
          if (!hierarchy[letter][vol.seriesTitle]) hierarchy[letter][vol.seriesTitle] = [];
          hierarchy[letter][vol.seriesTitle].push(vol);
      });
      return hierarchy;
  }, [state.volumes, state.searchQuery]);

  const sortedLetters = useMemo(() => Object.keys(hierarchyByAlpha).sort(), [hierarchyByAlpha]);
  const currentVolume = useMemo(() => state.volumes.find(v => v.id === state.activeVolumeId), [state.volumes, state.activeVolumeId]);

  if (!state.isAuthenticated) {
    return <AuthView handleLogin={handleLogin} passwordInput={passwordInput} setPasswordInput={setPasswordInput} errorMsg={errorMsg} />;
  }

  if (state.currentView === 'reader' && currentVolume) {
    return <ReaderView volume={currentVolume} closeReader={closeReader} currentPageIndex={currentPageIndex} setCurrentPageIndex={setCurrentPageIndex} handlePageChange={handlePageChange} />;
  }
  
  return (
    <div className="h-screen w-screen font-sans flex flex-col md:flex-row bg-spidey-black overflow-hidden border-4 border-black">
       {/* Mobile Header and Sidebar Toggle */}
       <header className="md:hidden bg-spidey-red text-white p-4 flex justify-between items-center border-b-4 border-black shadow-md shrink-0 z-30">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-black/20 rounded-lg shadow-inner border border-black/10"><Menu size={24}/></button>
            <span className="font-comic text-2xl tracking-wider uppercase drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">{APP_TITLE}</span>
            <div className="w-10"></div>
       </header>

       {/* Sidebar will go here... but for now we focus on the main content */}

       <LibraryView
          volumes={state.volumes}
          bookmarks={state.bookmarks}
          searchQuery={state.searchQuery}
          setSearchQuery={(query) => setState(s => ({...s, searchQuery: query}))}
          hierarchyByAlpha={hierarchyByAlpha}
          sortedLetters={sortedLetters}
          selectedSeries={state.selectedSeries}
          setSelectedSeries={(series) => setState(s => ({...s, selectedSeries: series}))}
          openVolume={openVolume}
          isLoadingLibrary={isLoadingLibrary}
        />
        
        {state.volumes.length > 0 && <SpideyChat library={state.volumes} />}
    </div>
  );
};

export default App;
