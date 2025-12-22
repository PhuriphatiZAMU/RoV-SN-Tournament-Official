// Navigation and UI Controls

// Global switchTab function
export function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content-custom').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Update Nav state
    document.querySelectorAll('.nav-link-custom').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.getElementById('nav-' + tabId);
    if (activeLink) activeLink.classList.add('active');

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('opacity-100')) {
        toggleMobileMenu();
    }
}

// Mobile Menu Toggle
export function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    // Toggle classes for smooth animation
    if (menu.classList.contains('opacity-0')) {
        // Open
        menu.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none', 'invisible');
        menu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto', 'visible');
    } else {
        // Close
        menu.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none', 'invisible');
        menu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto', 'visible');
    }
}

// Make functions available globally
window.switchTab = switchTab;
window.toggleMobileMenu = toggleMobileMenu;
