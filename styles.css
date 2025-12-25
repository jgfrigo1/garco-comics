* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #e62429;
    --primary-dark: #b71c1c;
    --secondary: #0d47a1;
    --dark: #1a1a1a;
    --darker: #0a0a0a;
    --gray: #333;
    --light-gray: #e0e0e0;
    --text: #ffffff;
    --text-dark: #b0b0b0;
    --sidebar-width: 280px;
    --header-height: 60px;
    --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, var(--darker) 0%, var(--dark) 100%);
    color: var(--text);
    overflow-x: hidden;
}

/* Header */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    box-shadow: 0 4px 20px rgba(230, 36, 41, 0.3);
    z-index: 1000;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 20px;
}

.logo {
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.menu-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
}

.menu-toggle span {
    width: 25px;
    height: 3px;
    background: var(--text);
    border-radius: 2px;
    transition: var(--transition);
}

.header-actions {
    display: flex;
    gap: 10px;
}

.btn-icon {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text);
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-icon:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

/* Sidebar */
.sidebar {
    position: fixed;
    left: 0;
    top: var(--header-height);
    width: var(--sidebar-width);
    height: calc(100vh - var(--header-height));
    background: var(--gray);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    transition: var(--transition);
    z-index: 999;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 2px solid var(--primary);
}

.sidebar-header h2 {
    font-size: 20px;
    color: var(--text);
}

.close-sidebar {
    display: none;
    background: none;
    border: none;
    color: var(--text);
    font-size: 24px;
    cursor: pointer;
}

.search-box {
    padding: 15px;
}

.search-box input {
    width: 100%;
    padding: 10px;
    background: var(--dark);
    border: 1px solid rgba(230, 36, 41, 0.3);
    border-radius: 8px;
    color: var(--text);
    font-size: 14px;
}

.search-box input:focus {
    outline: none;
    border-color: var(--primary);
}

.sidebar-nav {
    padding: 10px;
}

.letter-group {
    margin-bottom: 20px;
}

.letter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 15px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 5px;
    transition: var(--transition);
}

.letter-header:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(230, 36, 41, 0.4);
}

.letter-header h3 {
    font-size: 18px;
    font-weight: 700;
}

.letter-count {
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
}

.series-list {
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition);
}

.series-list.expanded {
    max-height: 2000px;
}

.series-item {
    padding: 12px 15px;
    margin: 5px 0;
    background: var(--dark);
    border-radius: 6px;
    cursor: pointer;
    transition: var(--transition);
    border-left: 3px solid transparent;
}

.series-item:hover {
    background: var(--darker);
    border-left-color: var(--primary);
    transform: translateX(5px);
}

.series-name {
    font-size: 14px;
    color: var(--text);
    display: block;
}

.series-count {
    font-size: 12px;
    color: var(--text-dark);
    margin-top: 4px;
}

/* Main Content */
.main-content {
    margin-left: var(--sidebar-width);
    margin-top: var(--header-height);
    padding: 30px;
    min-height: calc(100vh - var(--header-height));
}

.view {
    display: block;
}

.view.hidden {
    display: none;
}

.hero {
    text-align: center;
    padding: 60px 20px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    border-radius: 16px;
    margin-bottom: 40px;
    box-shadow: 0 8px 32px rgba(230, 36, 41, 0.3);
}

.hero h2 {
    font-size: 42px;
    margin-bottom: 10px;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.hero p {
    font-size: 18px;
    color: var(--text-dark);
}

.series-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.letter-section {
    grid-column: 1 / -1;
    margin-top: 30px;
}

.letter-title {
    font-size: 32px;
    color: var(--primary);
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 3px solid var(--primary);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.series-card {
    background: var(--gray);
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: var(--transition);
    border: 2px solid transparent;
}

.series-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(230, 36, 41, 0.4);
    border-color: var(--primary);
}

.series-card h3 {
    font-size: 16px;
    margin-bottom: 8px;
}

.series-card p {
    font-size: 14px;
    color: var(--text-dark);
}

.volumes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 30px;
}

.volume-card {
    background: var(--gray);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: var(--transition);
    border: 2px solid transparent;
}

.volume-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 40px rgba(230, 36, 41, 0.5);
    border-color: var(--primary);
}

.volume-cover {
    width: 100%;
    height: 320px;
    object-fit: cover;
    display: block;
}

.volume-info {
    padding: 15px;
}

.volume-info h3 {
    font-size: 16px;
    margin-bottom: 8px;
    color: var(--text);
}

.volume-info p {
    font-size: 14px;
    color: var(--text-dark);
}

.back-btn {
    background: var(--gray);
    border: 2px solid var(--primary);
    color: var(--text);
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: var(--transition);
    margin-bottom: 20px;
}

.back-btn:hover {
    background: var(--primary);
    transform: translateX(-5px);
}

.view-title {
    font-size: 32px;
    margin-bottom: 30px;
    color: var(--text);
}

/* Reader View */
#readerView {
    padding: 0;
    margin: 0;
    margin-top: var(--header-height);
    margin-left: 0;
}

.reader-header {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(10px);
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    z-index: 900;
    border-bottom: 2px solid var(--primary);
}

.reader-info {
    flex: 1;
    text-align: center;
}

.reader-info h3 {
    font-size: 16px;
    margin-bottom: 5px;
}

.reader-info span {
    font-size: 14px;
    color: var(--text-dark);
}

.reader-controls {
    display: flex;
    gap: 10px;
}

.reader-container {
    margin-top: 80px;
    margin-bottom: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - var(--header-height) - 160px);
    overflow: auto;
    padding: 20px;
    background: var(--darker);
}

.reader-container img {
    max-width: 100%;
    height: auto;
    display: block;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
    transition: transform var(--transition);
}

.reader-container img.fit-width {
    width: 100%;
    height: auto;
}

.reader-container img.fit-height {
    width: auto;
    height: calc(100vh - var(--header-height) - 200px);
}

.reader-navigation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(10px);
    padding: 15px 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    z-index: 900;
    border-top: 2px solid var(--primary);
}

.nav-btn {
    background: var(--primary);
    border: none;
    color: var(--text);
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: var(--transition);
    white-space: nowrap;
}

.nav-btn:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: scale(1.05);
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-slider {
    flex: 1;
}

.page-slider input {
    width: 100%;
    height: 6px;
    background: var(--dark);
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
}

.page-slider input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: var(--primary);
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition);
}

.page-slider input::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

.page-slider input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: var(--primary);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    transition: var(--transition);
}

.page-slider input::-moz-range-thumb:hover {
    transform: scale(1.2);
}

/* Loading */
.loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition);
}

.loading.active {
    opacity: 1;
    pointer-events: all;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(230, 36, 41, 0.3);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
    .menu-toggle {
        display: flex;
    }

    .sidebar {
        transform: translateX(-100%);
    }

    .sidebar.active {
        transform: translateX(0);
    }

    .close-sidebar {
        display: block;
    }

    .main-content {
        margin-left: 0;
        padding: 20px;
    }

    .logo {
        font-size: 18px;
    }

    .hero h2 {
        font-size: 28px;
    }

    .hero p {
        font-size: 16px;
    }

    .series-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
    }

    .volumes-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
    }

    .volume-cover {
        height: 220px;
    }

    .reader-header {
        flex-wrap: wrap;
        gap: 10px;
    }

    .reader-controls {
        order: 3;
        width: 100%;
        justify-content: center;
    }

    .reader-info {
        order: 2;
    }

    .back-btn {
        order: 1;
    }

    .nav-btn {
        padding: 10px 16px;
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .series-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
    }

    .volumes-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }

    .btn-icon {
        width: 36px;
        height: 36px;
        font-size: 16px;
    }
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track {
    background: var(--dark);
}

::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
}
