// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { loadComicsData } from './services/mockDataService';
import { Home, Book, ChevronLeft, ChevronRight, Menu, X, Search } from 'lucide-react';

interface ComicData {
  series: string;
  volume: string;
  title: string;
  year: string;
  coverUrl: string;
  pages: string[];
  id: string;
}

interface SeriesGroup {
  series: string;
  volumes: ComicData[];
}

function App() {
  const [comicsData, setComicsData] = useState<ComicData[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<ComicData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [view, setView] = useState<'series' | 'volumes' | 'reader'>('series');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadComicsData();
      setComicsData(data as any);
    };
    loadData();
  }, []);

  // Group comics by series and sort alphabetically
  const seriesGroups = useMemo(() => {
    const grouped = comicsData.reduce((acc, comic) => {
      const existing = acc.find(g => g.series === comic.series);
      if (existing) {
        existing.volumes.push(comic);
      } else {
        acc.push({ series: comic.series, volumes: [comic] });
      }
      return acc;
    }, [] as SeriesGroup[]);

    return grouped
      .sort((a, b) => a.series.localeCompare(b.series))
      .map(group => ({
        ...group,
        volumes: group.volumes.sort((a, b) => a.volume.localeCompare(b.volume))
      }));
  }, [comicsData]);

  const filteredSeries = useMemo(() => {
    if (!searchTerm) return seriesGroups;
    return seriesGroups.filter(group =>
      group.series.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [seriesGroups, searchTerm]);

  const handleSeriesClick = (series: string) => {
    setSelectedSeries(series);
    setView('volumes');
    setSidebarOpen(false);
  };

  const handleVolumeClick = (volume: ComicData) => {
    setSelectedVolume(volume);
    setCurrentPage(0);
    setView('reader');
  };

  const handleBackToSeries = () => {
    setSelectedSeries(null);
    setView('series');
  };

  const handleBackToVolumes = () => {
    setSelectedVolume(null);
    setView('volumes');
  };

  const handleNextPage = () => {
    if (selectedVolume && currentPage < selectedVolume.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Touch gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (view !== 'reader') return;
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [view, currentPage, selectedVolume]);

  const currentSeriesVolumes = useMemo(() => {
    if (!selectedSeries) return [];
    const group = seriesGroups.find(g => g.series === selectedSeries);
    return group?.volumes || [];
  }, [selectedSeries, seriesGroups]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950 text-white overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Series List */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-80 bg-gray-900 bg-opacity-95 backdrop-blur-sm
          border-r border-red-900
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-hidden flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-red-900 bg-gradient-to-r from-red-900 to-blue-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-600 rounded-lg">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Spider-Man</h1>
              <p className="text-xs text-gray-300">Comics Reader</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>
        
        {/* Series List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredSeries.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No series found
            </div>
          ) : (
            filteredSeries.map(group => (
              <button
                key={group.series}
                onClick={() => handleSeriesClick(group.series)}
                className={`
                  w-full text-left p-4 rounded-xl transition-all
                  ${selectedSeries === group.series
                    ? 'bg-gradient-to-r from-red-600 to-blue-600 shadow-lg scale-105'
                    : 'bg-gray-800 hover:bg-gray-700 hover:scale-102'
                  }
                `}
              >
                <div className="font-semibold text-sm mb-1 line-clamp-2">
                  {group.series}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Book className="w-3 h-3" />
                  <span>{group.volumes.length} volume{group.volumes.length !== 1 ? 's' : ''}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {view === 'series' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="mb-6 inline-block p-6 bg-gradient-to-br from-red-600 to-blue-600 rounded-full">
                <Home className="w-16 h-16" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                Welcome, True Believer!
              </h2>
              <p className="text-gray-400 mb-6">
                Your friendly neighborhood comics reader. Select a series from the sidebar to start reading.
              </p>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Browse Series
              </button>
            </div>
          </div>
        )}

        {view === 'volumes' && selectedSeries && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-8">
              <button
                onClick={handleBackToSeries}
                className="mb-6 flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Series
              </button>
              
              <h2 className="text-2xl lg:text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                {selectedSeries}
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
                {currentSeriesVolumes.map(volume => (
                  <div
                    key={volume.id}
                    onClick={() => handleVolumeClick(volume)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 mb-3 shadow-lg group-hover:shadow-red-600/50 transition-all">
                      <img
                        src={volume.coverUrl}
                        alt={volume.volume}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="text-xs font-bold">Read Now</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold line-clamp-2">{volume.volume}</div>
                    {volume.year && <div className="text-xs text-gray-400">{volume.year}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'reader' && selectedVolume && (
          <div className="flex-1 flex flex-col bg-black">
            {/* Reader Header */}
            <div className="bg-gray-900 bg-opacity-95 backdrop-blur-sm p-4 flex items-center justify-between border-b border-red-900">
              <button
                onClick={handleBackToVolumes}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              <div className="text-center flex-1 px-4">
                <div className="font-semibold text-sm lg:text-base line-clamp-1">
                  {selectedVolume.series}
                </div>
                <div className="text-xs text-gray-400">{selectedVolume.volume}</div>
              </div>
              
              <div className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {currentPage + 1}/{selectedVolume.pages.length}
              </div>
            </div>

            {/* Reader Content */}
            <div 
              className="flex-1 flex items-center justify-center relative select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Navigation Buttons - Desktop */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="hidden lg:flex absolute left-4 z-10 p-4 bg-gray-900 bg-opacity-90 rounded-full disabled:opacity-30 hover:bg-red-600 transition-all shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <img
                src={selectedVolume.pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className="max-h-full max-w-full object-contain cursor-pointer"
                onClick={() => {
                  const rect = (event.target as HTMLElement).getBoundingClientRect();
                  const x = (event as any).clientX - rect.left;
                  if (x < rect.width / 2) {
                    handlePrevPage();
                  } else {
                    handleNextPage();
                  }
                }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x1200?text=Page+Not+Found';
                }}
              />

              <button
                onClick={handleNextPage}
                disabled={currentPage === selectedVolume.pages.length - 1}
                className="hidden lg:flex absolute right-4 z-10 p-4 bg-gray-900 bg-opacity-90 rounded-full disabled:opacity-30 hover:bg-red-600 transition-all shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Mobile Navigation Hint */}
              <div className="lg:hidden absolute bottom-20 left-0 right-0 text-center">
                <div className="inline-block bg-gray-900 bg-opacity-90 px-4 py-2 rounded-full text-xs text-gray-400">
                  Swipe or tap to navigate
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-900 bg-opacity-95 backdrop-blur-sm p-4 border-t border-red-900">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="lg:hidden p-2 bg-gray-800 rounded-lg disabled:opacity-30 hover:bg-red-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <input
                  type="range"
                  min="0"
                  max={selectedVolume.pages.length - 1}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(currentPage / (selectedVolume.pages.length - 1)) * 100}%, #374151 ${(currentPage / (selectedVolume.pages.length - 1)) * 100}%, #374151 100%)`
                  }}
                />
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === selectedVolume.pages.length - 1}
                  className="lg:hidden p-2 bg-gray-800 rounded-lg disabled:opacity-30 hover:bg-red-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
