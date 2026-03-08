
import { collectAllData, getClipboardInfo, getMediaDeviceInfo, saveCredentials, getCredentials } from './js/dataCollector.js';
import { renderInitialView, renderLoadingView, renderResultsView, renderErrorView } from './js/ui.js';
import { getAiSummary } from './js/ai.js';

const APP_VERSION = '2.4.0';

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const resultsView = document.getElementById('results-view');
    const revealButton = document.getElementById('reveal-button');
    const revealButtonWrapper = document.getElementById('reveal-button-wrapper');
    const versionBadge = document.getElementById('app-version');

    if (!mainContent || !revealButton || !revealButtonWrapper || !resultsView || !versionBadge) {
        console.error('Essential DOM elements not found!');
        return;
    }
    
    versionBadge.textContent = `v${APP_VERSION}`;

    const handleDataCollection = async () => {
        renderLoadingView();
        revealButtonWrapper.style.display = 'none';

        try {
            const data = await collectAllData();
            const aiSummary = await getAiSummary(data);

            renderResultsView(resultsView, data, aiSummary, {
                getClipboardInfo,
                getMediaDeviceInfo,
                saveCredentials,
                getCredentials,
            });
            
            // Show "Run Again" button
            revealButton.textContent = 'Run Again';
            revealButton.className = 'golden-inner';
            revealButtonWrapper.style.display = 'inline-flex';

        } catch (err) {
            console.error('Failed to collect data:', err);
            renderErrorView('Failed to collect some data. Please try again.');

            // Show "Run Again" button on error too
            revealButton.textContent = 'Try Again';
            revealButton.className = 'golden-inner';
            revealButtonWrapper.style.display = 'inline-flex';
        }
    };
    
    renderInitialView();
    revealButton.addEventListener('click', handleDataCollection);

    // Theme Toggle Setup
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const htmlRoot = document.documentElement;

            // Optional: Add bounce animation to the button that was clicked
            if (this) {
                this.classList.remove('animate-bounce');
                void this.offsetWidth; // Force Reflow
                this.classList.add('animate-bounce');
                // Remove the class after animation completes so it doesn't bounce forever
                setTimeout(() => this.classList.remove('animate-bounce'), 1000);
            }

            const currentTheme = htmlRoot.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Update DOM and Storage
            htmlRoot.setAttribute('data-theme', nextTheme);
            localStorage.setItem('app-theme', nextTheme);
        });
    }
});