// src/components/LibraryView.tsx
import React from 'react';
import { Volume } from '../types';
import { Search, ChevronRight, ArrowLeft, Layers } from 'lucide-react';

const WELCOME_IMAGE = "https://i.annihil.us/u/prod/marvel/i/mg/1/00/6331e8b5487df/clean.jpg"; // Dynamic comic art

interface LibraryViewProps {
  volumes: Volume[];
  bookmarks: { [key: string]: { pageIndex: number } };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hierarchyByAlpha: Record<string, Record<string, Volume[]>>;
  sortedLetters: string[];
  selectedSeries: string | null;
  setSelectedSeries: (series: string | null) => void;
  openVolume: (volumeId: string) => void;
  isLoadingLibrary: boolean;
}

const LibraryView: React.FC<LibraryViewProps> = ({
  volumes, bookmarks, searchQuery, setSearchQuery, hierarchyByAlpha, sortedLetters,
  selectedSeries, setSelectedSeries, openVolume, isLoadingLibrary
}) => {
  const volumesOfSelectedSeries = React.useMemo(() => {
    if (!selectedSeries) return [];
    let allVolumes: Volume[] = [];
    Object.values(hierarchyByAlpha).forEach(letterGroup => {
        if (letterGroup[selectedSeries!]) {
            allVolumes.push(...letterGroup[selectedSeries!]);
        }
    });
    return allVolumes;
  }, [selectedSeries, hierarchyByAlpha]);

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-comic-dots relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-10 relative scroll-smooth">
        {!selectedSeries ? (
          /* --- SERIES LIST VIEW --- */
          <div className="max-w-4xl mx-auto pb-20">
            {!searchQuery && (
                <div className="mb-12 relative max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="absolute -inset-1 bg-gradient-to-r from-spidey-red to-spidey-blue blur opacity-25 rounded-3xl"></div>
                    <div className="relative bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-center">
                        <div className="w-full lg:w-1/2 h-64 lg:h-[400px] shrink-0">
                            <img src={WELCOME_IMAGE} className="w-full h-full object-cover" alt="Welcome Spider-Man" />
                        </div>
                        <div className="p-8 lg:p-12 w-full lg:w-1/2 text-center lg:text-left">
                            <span className="inline-block px-3 py-1 bg-spidey-red text-white font-black text-xs uppercase tracking-widest rounded-full mb-4 border-2 border-black">Agent Peter Parker</span>
                            <h2 className="text-4xl md:text-6xl font-comic text-spidey-blue leading-none mb-4 uppercase drop-shadow-sm">Biblioteca</h2>
                            <p className="text-gray-600 font-bold mb-6 italic text-lg leading-snug">"Un gran poder comporta una gran responsabilitat... i un gran llistat de còmics!"</p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <div className="bg-spidey-yellow px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-1">
                                    <span className="font-comic text-xl text-black">{volumes.length} Volumes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 border-b-4 border-black pb-4">
              <div>
                <h3 className="text-4xl font-comic text-black uppercase tracking-tight">Col·lecció A-Z</h3>
                <p className="text-gray-500 font-bold text-sm uppercase">Selecciona una sèrie per veure'n els números</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cerca sèrie..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-black focus:border-spidey-blue outline-none font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-8">
              {sortedLetters.map(letter => (
                <div key={letter} className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-12 h-12 flex items-center justify-center bg-spidey-red text-white border-4 border-black text-3xl font-comic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg shrink-0">
                      {letter}
                    </span>
                    <div className="h-1 flex-1 bg-black/10 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(hierarchyByAlpha[letter]).map(seriesName => (
                      <button
                        key={seriesName}
                        onClick={() => setSelectedSeries(seriesName)}
                        className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all flex justify-between items-center group text-left"
                      >
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-comic text-xl text-spidey-blue group-hover:text-spidey-red transition-colors uppercase tracking-tight truncate">{seriesName}</h4>
                          <p className="text-[10px] font-black text-gray-400 uppercase">{hierarchyByAlpha[letter][seriesName].length} Volumes</p>
                        </div>
                        <ChevronRight className="text-spidey-red group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* --- DETAILED SERIES VIEW (VOLUMES WITH COVERS) --- */
          <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-right-4 duration-300">
            <button
              onClick={() => setSelectedSeries(null)}
              className="mb-6 flex items-center gap-2 text-spidey-red font-comic text-2xl uppercase hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft size={24} /> Tornar a la Biblioteca
            </button>
            <div className="bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 mb-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-spidey-blue rounded-2xl flex items-center justify-center border-4 border-black text-white shrink-0 shadow-lg">
                    <Layers size={40} />
                </div>
                <div className="text-center md:text-left overflow-hidden">
                    <h2 className="text-5xl font-comic text-black uppercase tracking-tight leading-none mb-2 truncate">{selectedSeries}</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm italic">Col·lecció Completa • {volumesOfSelectedSeries.length} Volumes</p>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {volumesOfSelectedSeries.map(vol => {
                const bookmark = bookmarks[vol.id];
                const progress = bookmark ? ((bookmark.pageIndex + 1) / vol.pages.length) * 100 : 0;
                return (
                  <div
                    key={vol.id}
                    onClick={() => openVolume(vol.id)}
                    className="group relative bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden cursor-pointer hover:-translate-y-2 transition-all hover:shadow-[10px_10px_0px_0px_rgba(226,54,54,1)]"
                  >
                    <div className="aspect-[2/3] overflow-hidden bg-gray-200 relative">
                        <img src={vol.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={vol.volumeNumber} loading="lazy" />
                        {bookmark && (
                            <div className="absolute top-2 right-2 bg-spidey-yellow text-black border-2 border-black px-2 py-1 font-comic text-xs rotate-3 shadow-md z-10 animate-in bounce-in">
                                PÀG {bookmark.pageIndex + 1}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    <div className="p-3 bg-white border-t-4 border-black relative">
                        <span className="font-comic text-lg text-black uppercase block truncate">{vol.volumeNumber}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase block tracking-tighter">{vol.pages.length} PÀGINES</span>
                        {/* Progress Bar */}
                        {progress > 0 && (
                            <div className="absolute bottom-0 left-0 h-1 bg-spidey-yellow w-full">
                                <div className="h-full bg-spidey-red" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default LibraryView;
