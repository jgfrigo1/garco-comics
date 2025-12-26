import {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { loadComicsData } from './services/mockDataService';
import {
  Home,
  Book,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
} from 'lucide-react';

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

export default function App() {
  const [comicsData, setComicsData] = useState<ComicData[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<ComicData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [view, setView] = useState<'series' | 'volumes' | 'reader'>('series');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [touchStart, setTouchStart] = useState<number | null>(null);

  /* ------------------ DATA ------------------ */

  useEffect(() => {
    loadComicsData().then((data) => setComicsData(data as ComicData[]));
  }, []);

  const seriesGroups = useMemo<SeriesGroup[]>(() => {
    const grouped = comicsData.reduce((acc, comic) => {
      const group = acc.find((g) => g.series === comic.series);
      if (group) group.volumes.push(comic);
      else acc.push({ series: comic.series, volumes: [comic] });
      return acc;
    }, [] as SeriesGroup[]);

    return grouped
      .sort((a, b) => a.series.localeCompare(b.series))
      .map((g) => ({
        ...g,
        volumes: g.volumes.sort((a, b) =>
          a.volume.localeCompare(b.volume)
        ),
      }));
  }, [comicsData]);

  const filteredSeries = useMemo(() => {
    if (!searchTerm) return seriesGroups;
    return seriesGroups.filter((g) =>
      g.series.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [seriesGroups, searchTerm]);

  const currentSeriesVolumes = useMemo(() => {
    if (!selectedSeries) return [];
    return (
      seriesGroups.find((g) => g.series === selectedSeries)?.volumes ||
      []
    );
  }, [selectedSeries, seriesGroups]);

  /* ------------------ NAVIGATION ------------------ */

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

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) =>
      selectedVolume && p < selectedVolume.pages.length - 1 ? p + 1 : p
    );
  }, [selectedVolume]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((p) => (p > 0 ? p - 1 : p));
  }, []);

  /* ------------------ INPUT ------------------ */

  useEffect(() => {
    if (view !== 'reader') return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, handlePrevPage, handleNextPage]);

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50)
      diff > 0 ? handleNextPage() : handlePrevPage();
    setTouchStart(null);
  };

  /* ------------------ RENDER ------------------ */

  return (
    <div className="flex h-screen bg-gradient-to-br from-red-950 via-gray-900 to-blue-950 text-white overflow-hidden">
      {/* MOBILE MENU */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-red-600 rounded-full"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:relative z-40 inset-y-0 left-0
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-80'}
          w-80 bg-gray-900 border-r border-red-900
          transform transition-all
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        <div className="relative p-6 border-b border-red-900">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex absolute top-6 right-4"
          >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>

          <div className="flex items-center gap-3">
            <Book />
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold">Spider-Man</h1>
                <p className="text-xs text-gray-400">Comics Reader</p>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search series…"
                className="w-full pl-9 py-2 bg-gray-800 rounded"
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredSeries.map((g) => (
            <button
              key={g.series}
              title={sidebarCollapsed ? g.series : undefined}
              onClick={() => handleSeriesClick(g.series)}
              className="w-full p-3 rounded bg-gray-800 hover:bg-gray-700"
            >
              <Book className="inline-block mr-2" />
              {!sidebarCollapsed && g.series}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-hidden">
        {view === 'series' && (
          <div className="p-8 overflow-y-auto">
            <h2 className="text-4xl font-bold mb-8">All Series</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              {filteredSeries.map((g) => (
                <button
                  key={g.series}
                  onClick={() => handleSeriesClick(g.series)}
                  className="p-6 bg-gray-900 rounded-xl hover:shadow-lg"
                >
                  <Book className="w-12 h-12 mb-4" />
                  <div className="font-semibold">{g.series}</div>
                  <div className="text-sm text-gray-400">
                    {g.volumes.length} volumes
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'volumes' && (
          <div className="p-8 overflow-y-auto">
            <button
              onClick={handleBackToSeries}
              className="mb-6 text-red-400 flex items-center"
            >
              <ChevronLeft /> Back
            </button>

            <h2 className="text-3xl font-bold mb-8">{selectedSeries}</h2>

            <div className="grid gap-6 grid-cols-2 sm:grid-cols-4 xl:grid-cols-6">
              {currentSeriesVolumes.map((v) => (
                <div key={v.id} onClick={() => handleVolumeClick(v)}>
                  <img
                    src={v.coverUrl}
                    className="rounded shadow cursor-pointer"
                  />
                  <div className="mt-2 text-sm">{v.volume}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'reader' && selectedVolume && (
          <div
            className="h-full flex items-center justify-center bg-black"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={selectedVolume.pages[currentPage]}
              className="max-h-full max-w-full"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                x < rect.width / 2
                  ? handlePrevPage()
                  : handleNextPage();
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
