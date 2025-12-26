// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Volume } from './types';
import { loadComicsData } from './services/mockDataService';
import { X, Home, Book, ChevronLeft, ChevronRight } from 'lucide-react';

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

    // Sort series alphabetically and volumes within each series
    return grouped
      .sort((a, b) => a.series.localeCompare(b.series))
      .map(group => ({
        ...group,
        volumes: group.volumes.sort((a, b) => a.volume.localeCompare(b.volume))
      }));
  }, [comicsData]);

  const handleSeriesClick = (series: string) => {
    setSelectedSeries(series);
    setView('volumes');
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

  const currentSeriesVolumes = useMemo(() => {
    if (!selectedSeries) return [];
    const group = seriesGroups.find(g => g.series === selectedSeries);
    return group?.volumes || [];
  }, [selectedSeries, seriesGroups]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Sidebar - Series List */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Book className="w-6 h-6" />
            Spider-Man Comics
          </h1>
        </div>
        
        <div className="p-4">
          {seriesGroups.map(group => (
            <button
              key={group.series}
              onClick={() => handleSeriesClick(group.series)}
              className={`w-full text-left p-3 mb-2 rounded-lg transition-colors ${
                selectedSeries === group.series
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="font-medium">{group.series}</div>
              <div className="text-sm text-gray-400 mt-1">
                {group.volumes.length} volume{group.volumes.length !== 1 ? 's' : ''}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {view === 'series' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Home className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h2 className="text-2xl font-bold mb-2">Welcome to Spider-Man Comics</h2>
              <p className="text-gray-400">Select a series from the sidebar to get started</p>
            </div>
          </div>
        )}

        {view === 'volumes' && selectedSeries && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <button
                onClick={handleBackToSeries}
                className="mb-4 flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Series
              </button>
              
              <h2 className="text-3xl font-bold mb-6">{selectedSeries}</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {currentSeriesVolumes.map(volume => (
                  <div
                    key={volume.id}
                    onClick={() => handleVolumeClick(volume)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-700 mb-2">
                      <img
                        src={volume.coverUrl}
                        alt={volume.volume}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
                    </div>
                    <div className="text-sm font-medium">{volume.volume}</div>
                    {volume.year && <div className="text-xs text-gray-400">{volume.year}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'reader' && selectedVolume && (
          <div className="flex-1 flex flex-col bg-black">
            <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
              <button
                onClick={handleBackToVolumes}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Volumes
              </button>
              
              <div className="text-center flex-1">
                <div className="font-medium">{selectedVolume.series}</div>
                <div className="text-sm text-gray-400">{selectedVolume.volume}</div>
              </div>
              
              <div className="text-sm text-gray-400">
                Page {currentPage + 1} / {selectedVolume.pages.length}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 relative">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="absolute left-4 z-10 p-3 bg-gray-800 rounded-full disabled:opacity-30 hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <img
                src={selectedVolume.pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x1200?text=Page+Not+Found';
                }}
              />

              <button
                onClick={handleNextPage}
                disabled={currentPage === selectedVolume.pages.length - 1}
                className="absolute right-4 z-10 p-3 bg-gray-800 rounded-full disabled:opacity-30 hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gray-800 p-4 border-t border-gray-700">
              <input
                type="range"
                min="0"
                max={selectedVolume.pages.length - 1}
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
