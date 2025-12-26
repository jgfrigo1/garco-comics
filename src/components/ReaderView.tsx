// src/components/ReaderView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Volume } from '../types';
import { ChevronLeft, Maximize, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

interface ReaderViewProps {
  volume: Volume;
  closeReader: () => void;
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
  handlePageChange: (direction: 'next' | 'prev') => void;
}

const ReaderView: React.FC<ReaderViewProps> = ({ volume, closeReader, currentPageIndex, setCurrentPageIndex, handlePageChange }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fitMode, setFitMode] = useState<'contain' | 'width'>('contain');
  const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement);
  const [uiVisible, setUiVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // UI Auto-hide logic
  useEffect(() => {
    const showThenHide = () => {
      setUiVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setUiVisible(false), 3000);
    };
    showThenHide(); // Initial show
    window.addEventListener('mousemove', showThenHide);
    window.addEventListener('touchstart', showThenHide);
    return () => {
      window.removeEventListener('mousemove', showThenHide);
      window.removeEventListener('touchstart', showThenHide);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Image preloading for smoother navigation
  useEffect(() => {
    if (currentPageIndex + 1 < volume.pages.length) {
      const nextImage = new Image();
      nextImage.src = volume.pages[currentPageIndex + 1].url;
    }
    if (currentPageIndex > 0) {
      const prevImage = new Image();
      prevImage.src = volume.pages[currentPageIndex - 1].url;
    }
  }, [currentPageIndex, volume.pages]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      document.exitFullscreen();
    }
  };

  const imageStyle: React.CSSProperties = {
    transform: `scale(${zoomLevel})`,
    maxWidth: fitMode === 'width' ? '100%' : 'none',
    maxHeight: fitMode === 'contain' ? '100%' : 'none',
    width: fitMode === 'width' ? '100%' : 'auto',
    height: fitMode === 'contain' ? 'auto' : '100%',
    objectFit: 'contain',
    transition: 'transform 0.2s, opacity 0.3s',
  };

  const totalPages = volume.pages.length;

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden fixed inset-0 z-[100]">
      {/* --- UI OVERLAYS --- */}
      <div className={`fixed inset-x-0 top-0 z-20 transition-opacity duration-300 ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="h-12 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-3 text-white">
              <button onClick={closeReader} className="flex items-center gap-1 hover:text-spidey-red transition-colors font-bold uppercase text-xs tracking-tight">
                  <ChevronLeft size={20} /> <span className="hidden xs:inline">Biblioteca</span>
              </button>
              <div className="text-center truncate">
                  <div className="text-sm font-bold uppercase truncate max-w-xs">{volume.seriesTitle}</div>
                  <div className="text-xs text-gray-400">{volume.volumeNumber}</div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                  <button onClick={toggleFullScreen} className="p-1.5 rounded-full hover:bg-white/10">
                      {isFullScreen ? <Minimize2 size={16} /> : <Maximize size={16} />}
                  </button>
              </div>
          </div>
      </div>

      <div className="flex-1 relative overflow-auto scrollbar-hide flex items-center justify-center">
        {/* Navigation Zones */}
        <div className="absolute inset-0 z-10 flex">
            <div className="w-1/4 h-full cursor-w-resize" onClick={() => handlePageChange('prev')}></div>
            <div className="w-1/2 h-full" onDoubleClick={() => setZoomLevel(z => z > 1 ? 1 : 2)}></div>
            <div className="w-1/4 h-full cursor-e-resize" onClick={() => handlePageChange('next')}></div>
        </div>
        <img src={volume.pages[currentPageIndex]?.url} style={imageStyle} alt={`Page ${currentPageIndex + 1}`} />
      </div>
      
      <div className={`fixed inset-x-0 bottom-0 z-20 transition-opacity duration-300 ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col gap-4 safe-bottom">
              <div className="flex items-center gap-2 text-white text-xs font-mono justify-center">
                  <span>{currentPageIndex + 1}</span>
                  <input type="range" min="0" max={totalPages - 1} value={currentPageIndex} onChange={(e) => setCurrentPageIndex(parseInt(e.target.value, 10))} className="flex-1 h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-spidey-red" />
                  <span>{totalPages}</span>
              </div>
              <div className="flex justify-center items-center gap-4 text-white">
                  <button onClick={() => setFitMode('contain')} className={`p-2 rounded-full ${fitMode === 'contain' ? 'bg-spidey-blue' : 'bg-white/10'}`}><Layers size={16}/></button>
                  <button onClick={() => setFitMode('width')} className={`p-2 rounded-full ${fitMode === 'width' ? 'bg-spidey-blue' : 'bg-white/10'}`}>W</button>
                  <button onClick={() => setZoomLevel(z => Math.max(z - 0.25, 0.5))} className="p-2 rounded-full bg-white/10"><ZoomOut size={16}/></button>
                  <button onClick={() => setZoomLevel(z => Math.min(z + 0.25, 5))} className="p-2 rounded-full bg-white/10"><ZoomIn size={16}/></button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ReaderView;
