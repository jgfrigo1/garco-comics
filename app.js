// State Management
const state = {
    comics: [],
    currentSeries: null,
    currentComic: null,
    currentPage: 0,
    zoom: 1,
    fitMode: 'width', // 'width', 'height', 'none'
    controlsVisible: false
};

// DOM Elements
const elements = {
    welcomeScreen: document.getElementById('welcomeScreen'),
    enterApp: document.getElementById('enterApp'),
    loading: document.getElementById('loading'),
    sidebar: document.getElementById('sidebar'),
    menuToggle: document.getElementById('menuToggle'),
    closeSidebar: document.getElementById('closeSidebar'),
    sidebarNav: document.getElementById('sidebarNav'),
    sidebarSearch: document.getElementById('sidebarSearch'),
    homeView: document.getElementById('homeView'),
    volumeView: document.getElementById('volumeView'),
    readerView: document.getElementById('readerView'),
    seriesGrid: document.getElementById('seriesGrid'),
    volumesGrid: document.getElementById('volumesGrid'),
    volumeTitle: document.getElementById('volumeTitle'),
    backToSeries: document.getElementById('backToSeries'),
    backToVolumes: document.getElementById('backToVolumes'),
    readerTitle: document.getElementById('readerTitle'),
    pageInfo: document.getElementById('pageInfo'),
    comicPage: document.getElementById('comicPage'),
    pageSlider: document.getElementById('pageSlider'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    fitWidth: document.getElementById('fitWidth'),
    fitHeight: document.getElementById('fitHeight'),
    zoomIn: document.getElementById('zoomIn'),
    zoomOut: document.getElementById('zoomOut'),
    fullscreen: document.getElementById('fullscreen'),
    readerContainer: document.getElementById('readerContainer'),
    controlsToggle: document.getElementById('controlsToggle'),
    controlsPanel: document.getElementById('controlsPanel'),
    closeControls: document.getElementById('closeControls'),
    touchLeft: document.getElementById('touchLeft'),
    touchRight: document.getElementById('touchRight')
};

// Utility Functions
const showLoading = () => elements.loading.classList.add('active');
const hideLoading = () => elements.loading.classList.remove('active');

const showView = (viewName) => {
    Object.values(elements).forEach(el => {
        if (el && el.classList && el.classList.contains('view')) {
            el.classList.add('hidden');
        }
    });
    
    if (viewName === 'home') {
        elements.homeView.classList.remove('hidden');
    } else if (viewName === 'volume') {
        elements.volumeView.classList.remove('hidden');
    } else if (viewName === 'reader') {
        elements.readerView.classList.remove('hidden');
        // Show controls briefly, then auto-hide for immersion
        showControls();
        setTimeout(() => hideControls(), 3000);
    }
};

const hideControls = () => {
    if (!elements.readerControlsPanel.classList.contains('hidden')) {
        elements.readerControlsPanel.classList.add('hidden');
        state.controlsVisible = false;
    }
};

const showControls = () => {
    if (elements.readerControlsPanel.classList.contains('hidden')) {
        elements.readerControlsPanel.classList.remove('hidden');
        state.controlsVisible = true;
    }
};

const toggleControls = () => {
    state.controlsVisible ? hideControls() : showControls();
};

// Data Loading
async function loadComics() {
    showLoading();
    
    const sources = [
        {
            url: './data/comics.json',
            name: 'Local'
        },
        {
            url: 'https://cdn.jsdelivr.net/gh/jgfrigo2/apps_data@main/spidey/spidey.json',
            name: 'CDN'
        },
        {
            url: 'https://raw.githubusercontent.com/jgfrigo2/apps_data/main/spidey/spidey.json',
            name: 'GitHub Raw'
        }
    ];
    
    for (const source of sources) {
        try {
            console.log(`📡 Intentant carregar des de ${source.name}:`, source.url);
            
            const response = await fetch(source.url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            const comics = Array.isArray(data) ? data : (data.comics || []);
            
            if (comics.length === 0) {
                throw new Error('No hi ha còmics en les dades');
            }
            
            console.log(`✅ Carregats ${comics.length} còmics des de ${source.name}`);
            state.comics = comics;
            initializeApp();
            hideLoading();
            return;
            
        } catch (error) {
            console.error(`❌ Error carregant des de ${source.name}:`, error);
        }
    }
    
    hideLoading();
    const errorMsg = `No s'han pogut carregar els còmics. Revisa la consola del navegador (F12) per més detalls.`;
    alert(errorMsg);
    
    elements.seriesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <h2 class="comic-heading" style="color: var(--primary); margin-bottom: 20px;">❌ ERROR DE CÀRREGA</h2>
            <p class="comic-text">No s'han pogut carregar les dades dels còmics.</p>
            <button onclick="location.reload()" class="enter-btn" style="margin-top: 30px; font-size: 24px; padding: 15px 40px;">
                <span>RECARREGAR</span>
            </button>
        </div>
    `;
}

// Initialize App
function initializeApp() {
    renderSidebar();
    renderHomePage();
    setupEventListeners();
}

// Render Functions
function renderSidebar() {
    const groupedBySeries = {};
    
    state.comics.forEach(comic => {
        const series = comic.series || 'Altres';
        if (!groupedBySeries[series]) {
            groupedBySeries[series] = [];
        }
        groupedBySeries[series].push(comic);
    });

    const sortedSeries = Object.keys(groupedBySeries).sort();
    const groupedByLetter = {};

    sortedSeries.forEach(series => {
        const firstLetter = series[0].toUpperCase();
        if (!groupedByLetter[firstLetter]) {
            groupedByLetter[firstLetter] = [];
        }
        groupedByLetter[firstLetter].push({
            name: series,
            volumes: groupedBySeries[series]
        });
    });

    const sortedLetters = Object.keys(groupedByLetter).sort();
    
    elements.sidebarNav.innerHTML = sortedLetters.map(letter => `
        <div class="letter-group">
            <div class="letter-header" onclick="toggleLetterGroup('${letter}')">
                <h3>${letter}</h3>
                <span class="letter-count">${groupedByLetter[letter].length}</span>
            </div>
            <div class="series-list" id="letter-${letter}">
                ${groupedByLetter[letter].map(series => `
                    <div class="series-item" onclick="showSeriesVolumes('${series.name.replace(/'/g, "\\'")}')">
                        <span class="series-name">${series.name}</span>
                        <span class="series-count">${series.volumes.length} volum${series.volumes.length !== 1 ? 's' : ''}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderHomePage() {
    const groupedBySeries = {};
    
    state.comics.forEach(comic => {
        const series = comic.series || 'Altres';
        if (!groupedBySeries[series]) {
            groupedBySeries[series] = [];
        }
        groupedBySeries[series].push(comic);
    });

    const sortedSeries = Object.keys(groupedBySeries).sort();
    const groupedByLetter = {};

    sortedSeries.forEach(series => {
        const firstLetter = series[0].toUpperCase();
        if (!groupedByLetter[firstLetter]) {
            groupedByLetter[firstLetter] = [];
        }
        groupedByLetter[firstLetter].push({
            name: series,
            count: groupedBySeries[series].length
        });
    });

    const sortedLetters = Object.keys(groupedByLetter).sort();
    
    elements.seriesGrid.innerHTML = sortedLetters.map(letter => `
        <div class="letter-section">
            <h2 class="letter-title">${letter}</h2>
        </div>
        ${groupedByLetter[letter].map(series => `
            <div class="series-card" onclick="showSeriesVolumes('${series.name.replace(/'/g, "\\'")}')">
                <h3>${series.name}</h3>
                <p>${series.count} volum${series.count !== 1 ? 's' : ''}</p>
            </div>
        `).join('')}
    `).join('');
}

function renderVolumes(seriesName) {
    const volumes = state.comics.filter(comic => comic.series === seriesName);
    
    elements.volumeTitle.textContent = seriesName;
    elements.volumesGrid.innerHTML = volumes.map((volume, index) => `
        <div class="volume-card" onclick="openReader(${index}, '${seriesName.replace(/'/g, "\\'")}')">
            <img class="volume-cover" src="${volume.coverUrl}" alt="${volume.title}" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/220x330/e62429/ffffff?text=Portada+no+disponible';">
            <div class="volume-info">
                <h3>${volume.volume || volume.title}</h3>
                <p>${volume.year || ''}</p>
                <p>${volume.pages.length} pàgines</p>
            </div>
        </div>
    `).join('');
}

// Navigation Functions
window.toggleLetterGroup = function(letter) {
    const element = document.getElementById(`letter-${letter}`);
    element.classList.toggle('expanded');
};

window.showSeriesVolumes = function(seriesName) {
    state.currentSeries = seriesName;
    renderVolumes(seriesName);
    showView('volume');
    if (window.innerWidth <= 768) {
        elements.sidebar.classList.remove('active');
    }
};

window.openReader = function(volumeIndex, seriesName) {
    const volumes = state.comics.filter(comic => comic.series === seriesName);
    state.currentComic = volumes[volumeIndex];
    state.currentPage = 0;
    state.zoom = 1;
    state.fitMode = 'width';
    
    elements.readerTitle.textContent = state.currentComic.title;
    elements.pageSlider.max = state.currentComic.pages.length;
    elements.pageSlider.value = 1;
    
    showView('reader');
    updatePage();
};

function updatePage() {
    if (!state.currentComic) return;
    
    const pageUrl = state.currentComic.pages[state.currentPage];
    elements.comicPage.src = pageUrl;
    
    elements.pageInfo.textContent = `Pàgina ${state.currentPage + 1} de ${state.currentComic.pages.length}`;
    elements.pageSlider.value = state.currentPage + 1;
    
    elements.prevPage.disabled = state.currentPage === 0;
    elements.nextPage.disabled = state.currentPage === state.currentComic.pages.length - 1;
    
    applyFitMode();
}

function applyFitMode() {
    elements.comicPage.classList.remove('fit-width', 'fit-height');
    
    if (state.fitMode === 'width') {
        elements.comicPage.classList.add('fit-width');
    } else if (state.fitMode === 'height') {
        elements.comicPage.classList.add('fit-height');
    }
    
    if (state.fitMode === 'none') {
        elements.comicPage.style.transform = `scale(${state.zoom})`;
    } else {
        elements.comicPage.style.transform = '';
    }
}

// Event Listeners
function setupEventListeners() {
    // Welcome Screen
    elements.enterApp.addEventListener('click', () => {
        elements.welcomeScreen.classList.add('hidden');
    });

    // Menu Toggle
    elements.menuToggle.addEventListener('click', () => {
        elements.sidebar.classList.toggle('active');
    });

    elements.closeSidebar.addEventListener('click', () => {
        elements.sidebar.classList.remove('active');
    });

    // Search
    elements.sidebarSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const seriesItems = document.querySelectorAll('.series-item');
        
        seriesItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Back Buttons
    elements.backToSeries.addEventListener('click', () => {
        showView('home');
    });

    elements.backToVolumes.addEventListener('click', () => {
        showView('volume');
    });

    // Reader Controls Toggle
    elements.controlsToggle.addEventListener('click', toggleControls);
    elements.closeControls.addEventListener('click', hideControls);

    // Reader Controls Actions
    elements.prevPage.addEventListener('click', () => {
        if (state.currentPage > 0) {
            state.currentPage--;
            updatePage();
        }
    });

    elements.nextPage.addEventListener('click', () => {
        if (state.currentPage < state.currentComic.pages.length - 1) {
            state.currentPage++;
            updatePage();
        }
    });

    elements.pageSlider.addEventListener('input', (e) => {
        state.currentPage = parseInt(e.target.value) - 1;
        updatePage();
    });

    elements.fitWidth.addEventListener('click', () => {
        state.fitMode = 'width';
        state.zoom = 1;
        applyFitMode();
    });

    elements.fitHeight.addEventListener('click', () => {
        state.fitMode = 'height';
        state.zoom = 1;
        applyFitMode();
    });

    elements.zoomIn.addEventListener('click', () => {
        state.fitMode = 'none';
        state.zoom = Math.min(state.zoom + 0.25, 3);
        applyFitMode();
    });

    elements.zoomOut.addEventListener('click', () => {
        state.fitMode = 'none';
        state.zoom = Math.max(state.zoom - 0.25, 0.5);
        applyFitMode();
    });

    elements.fullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
    
    // Touch zones for navigation
    elements.touchLeft.addEventListener('click', () => {
        if (state.currentPage > 0) {
            state.currentPage--;
            updatePage();
        }
    });

    elements.touchRight.addEventListener('click', () => {
        if (state.currentPage < state.currentComic.pages.length - 1) {
            state.currentPage++;
            updatePage();
        }
    });


    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (state.currentComic && !elements.readerView.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft' && state.currentPage > 0) {
                state.currentPage--;
                updatePage();
            } else if (e.key === 'ArrowRight' && state.currentPage < state.currentComic.pages.length - 1) {
                state.currentPage++;
                updatePage();
            } else if (e.key === 'c' || e.key === 'C') {
                toggleControls();
            }
        }
    });
    
    // Auto-hide controls when mouse stops moving
    let mouseTimeout;
    elements.readerContainer.addEventListener('mousemove', () => {
        if (!elements.readerView.classList.contains('hidden')) {
            showControls();
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(hideControls, 3000);
        }
    });

    // Touch/Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    elements.readerContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    elements.readerContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50 && state.currentPage < state.currentComic.pages.length - 1) {
            state.currentPage++;
            updatePage();
        }
        if (touchEndX > touchStartX + 50 && state.currentPage > 0) {
            state.currentPage--;
            updatePage();
        }
    }
}

// Initialize
loadComics();
