import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppState, Volume } from './types';
import { loadBookmarks, saveBookmarkLocal, loadConfig } from './services/mockDataService';
import AuthView from './components/AuthView';
import LibraryView from './components/LibraryView';
import ReaderView from './components/ReaderView';
import SpideyChat from './components/SpideyChat';
import { Menu, X, Library, LogOut, ChevronDown, ChevronRight, Layers } from 'lucide-react';

const APP_TITLE = "Garco Comics";
const PASSWORD = "peter";

const App: React.FC = () => {
  // ... all of your component logic, state, effects, etc. ...
  // (The content you already have is correct, just make sure it's all here)

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedAlpha, setExpandedAlpha] = useState<Record<string, boolean>>({});
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      const config = loadConfig();
      const books = loadBookmarks();

      try {
        const response = await fetch('/data/comics.json');
        if (!response.ok) {
          throw new Error(`Could not load comics.json: ${response.statusText}`);
        }
        const volumesData: Volume[] = await response.json();
        
        setState(prev => ({ 
            ...prev, 
            bookmarks: books, 
            config: config,
            volumes: volumesData 
        }));

      } catch (error) {
        console.error("Failed to load local library:", error);
        setErrorMsg("Error: No s'ha pogut carregar la biblioteca de còmics.");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      setState(prev => ({ ...prev, isAuthenticated: true }));
      setErrorMsg('');
    } else {
      setErrorMsg('Contrasenya incorrecta.');
    }
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
    state.volumes
      .filter(v => v.seriesTitle.toLowerCase().includes(state.searchQuery.toLowerCase()))
      .forEach(vol => {
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
  
  const toggleAlpha = (letter: string) => {
    setExpandedAlpha(prev => ({ ...prev, [letter]: !prev[letter] }));
  };
  
  // The JSX that renders the main layout
  return (
    <div className="h-screen w-screen font-sans flex flex-col md:flex-row bg-spidey-black overflow-hidden border-4 border-black">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-full w-72 bg-spidey-red text-white z-50 transition-transform duration-300 transform border-r-4 border-black shadow-2xl flex flex-col shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="absolute inset-0 opacity-20 bg-spider-web pointer-events-none"></div>
        <div className="p-6 border-b-4 border-black bg-spidey-red relative z-10 flex justify-between items-center shrink-0">
          <h1 className="text-3xl font-comic tracking-wider text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] -rotate-2">
            {APP_TITLE}
          </h1>
          <button className="md:hidden p-1 bg-black/20 rounded" onClick={() => setIsSidebarOpen(false)}><X size={24}/></button>
        </div>
        
        <nav className="p-4 space-y-4 relative z-10 flex-1 overflow-y-auto scrollbar-hide bg-spidey-red">
            <button onClick={() => { setState(s => ({...s, selectedSeries: null, searchQuery: ''})); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-black font-bold uppercase text-sm transition-all ${!state.selectedSeries ? 'bg-spidey-blue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent border-white/20 hover:bg-black/10'}`}>
                <Library size={18} /> <span>Biblioteca</span>
            </button>
            
            <div className="pt-4 border-t-2 border-black/20">
                <span className="text-xs font-black uppercase tracking-[0.2em] mb-4 block px-2 opacity-60">Biblioteca A-Z</span>
                <div className="space-y-1">
                    {sortedLetters.map(letter => (
                        <div key={letter} className="group">
                            <button 
                                onClick={() => toggleAlpha(letter)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-bold rounded transition-colors ${expandedAlpha[letter] ? 'bg-black/20 text-spidey-yellow' : 'hover:bg-black/10'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="w-6 h-6 flex items-center justify-center bg-black/30 rounded text-xs">{letter}</span>
                                    <span>{letter} Series</span>
                                </span>
                                {expandedAlpha[letter] ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                            </button>
                            {expandedAlpha[letter] && (
                                <div className="ml-4 mt-1 border-l-2 border-white/20 pl-2 space-y-1">
                                    {Object.keys(hierarchyByAlpha[letter]).map(seriesName => (
                                        <button 
                                            key={seriesName}
                                            onClick={() => { setState(s => ({...s, selectedSeries: seriesName})); setIsSidebarOpen(false); }}
                                            className={`w-full text-left px-2 py-1.5 text-[11px] font-bold uppercase tracking-tight flex items-center gap-2 transition-all ${state.selectedSeries === seriesName ? 'text-spidey-yellow' : 'text-white/80 hover:text-white'}`}
                                        >
                                            <Layers size={10} className="shrink-0" />
                                            <span className="truncate">{seriesName}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </nav>

        <div className="p-4 border-t-4 border-black bg-black/10 shrink-0">
             <button onClick={() => { setPasswordInput(''); setState(prev => ({...prev, isAuthenticated: false})); }} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors w-full px-2 font-bold uppercase text-xs">
                <LogOut size={14} /> Sortir del Sistema
             </button>
        </div>
      </aside>

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
          isLoadingLibrary={isLoading}
        />
        
        {state.volumes.length > 0 && <SpideyChat library={state.volumes} />}
    </div>
  );
};

// THIS IS THE LINE THAT WAS MISSING OR IN THE WRONG PLACE
export default App;
