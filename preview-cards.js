// Preview cards in the projects section

// Debug flag - set to true to show console logs
const DEBUG = false;

// Basic variables
let mouseX = 0;
let mouseY = 0;
let activeProject = null;
let isTracking = false;

// Get DOM elements
const preview = document.querySelector('.preview-window');
const previewImg = document.getElementById('preview-image');

// Function to log debug messages
function log(message) {
    if (DEBUG) console.log(`[Preview] ${message}`);
}

// Create a new standalone preview element
function createStandalonePreview() {
    // Remove any existing preview first
    const existingPreview = document.getElementById('standalone-preview');
    if (existingPreview) existingPreview.remove();
    
    // Create new preview container
    const container = document.createElement('div');
    container.id = 'standalone-preview';
    container.style.cssText = `
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        top: 0;
        left: 0;
        transform: translate(-50%, -50%);
        transition: opacity 0.2s ease;
        opacity: 0;
        display: none;
    `;
    
    // Create image element
    const img = document.createElement('img');
    img.style.cssText = `
        max-width: 250px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Add to DOM
    container.appendChild(img);
    document.body.appendChild(container);
    
    log('Created standalone preview element');
    return { container, img };
}

// Initialize the preview system
function initPreviewSystem() {
    log('Initializing preview system');
    
    // Create our custom preview element
    const { container: previewEl, img: imgEl } = createStandalonePreview();
    
    // Track mouse movement globally
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // If we're actively tracking, update the preview position immediately
        if (isTracking) {
            updatePreviewPosition(previewEl);
            
            // Check if mouse is near any project links
            if (activeProject) {
                const isNearLinks = checkIfNearLinks(activeProject, mouseX, mouseY);
                if (isNearLinks) {
                    previewEl.style.opacity = '0';
                    document.body.classList.remove('hide-cursor');
                } else {
                    previewEl.style.opacity = '1';
                    document.body.classList.add('hide-cursor');
                }
            }
        }
    });
    
    // Handle project hover
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        // Mouse enter a project
        project.addEventListener('mouseenter', (e) => {
            activateProjectPreview(project, previewEl, imgEl);
        });
        
        // Mouse leave a project
        project.addEventListener('mouseleave', () => {
            log('Left project');
            previewEl.style.opacity = '0';
            setTimeout(() => {
                if (!isTracking) previewEl.style.display = 'none';
            }, 200);
            isTracking = false;
            activeProject = null;
            
            // Show cursor
            document.body.classList.remove('hide-cursor');
        });
    });
    
    // Setup intersection observer to handle scrolling into projects
    setupIntersectionObserver(previewEl, imgEl);
    
    // Handle scroll events
    window.addEventListener('scroll', () => {
        if (!isTracking) return;
        
        log('Scroll detected');
        
        // Update position immediately during scroll
        updatePreviewPosition(previewEl);
        
        // Check what's under the cursor now
        const elementAtPoint = document.elementFromPoint(mouseX, mouseY);
        if (!elementAtPoint) {
            hidePreview(previewEl);
            return;
        }
        
        // Find if we're over a project
        let currentProject = elementAtPoint;
        while (currentProject && !currentProject.classList.contains('project')) {
            currentProject = currentProject.parentElement;
        }
        
        // If we found a project and it's different from our active one
        if (currentProject && currentProject !== activeProject) {
            log(`Scrolled to new project: ${currentProject.querySelector('h3')?.textContent}`);
            
            // Update the preview image
            const newPreviewImg = currentProject.getAttribute('data-preview');
            if (newPreviewImg) {
                imgEl.src = newPreviewImg;
                activeProject = currentProject;
            }
        } else if (!currentProject) {
            // Not over a project anymore
            hidePreview(previewEl);
        }
    });
    
    // Function to update preview position
    function updatePreviewPosition(element) {
        element.style.transform = 'translate(-50%, -50%)';
        element.style.left = `${mouseX}px`;
        element.style.top = `${mouseY}px`;
    }
    
    // Function to hide preview
    function hidePreview(element) {
        log('Hiding preview');
        element.style.opacity = '0';
        setTimeout(() => {
            if (!isTracking) element.style.display = 'none';
        }, 200);
        isTracking = false;
        activeProject = null;
        document.body.classList.remove('hide-cursor');
    }
    
    log('Preview system initialized');
}

// Helper function to activate preview for a project
function activateProjectPreview(project, previewEl, imgEl) {
    const previewImg = project.getAttribute('data-preview');
    if (!previewImg) return;
    
    log(`Activating project: ${project.querySelector('h3')?.textContent}`);
    activeProject = project;
    imgEl.src = previewImg;
    imgEl.onload = () => {
        previewEl.style.opacity = '1';
        previewEl.style.display = 'block';
        isTracking = true;
        
        // Update position
        previewEl.style.transform = 'translate(-50%, -50%)';
        previewEl.style.left = `${mouseX}px`;
        previewEl.style.top = `${mouseY}px`;
        
        // Check if near links before hiding cursor
        const isNearLinks = checkIfNearLinks(project, mouseX, mouseY);
        if (!isNearLinks) {
            document.body.classList.add('hide-cursor');
        }
    };
}

// Set up intersection observer to detect when projects enter viewport
function setupIntersectionObserver(previewEl, imgEl) {
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If a project is entering the viewport
            if (entry.isIntersecting) {
                const project = entry.target;
                
                // Check if the mouse cursor is over this project
                const rect = project.getBoundingClientRect();
                if (
                    mouseX >= rect.left &&
                    mouseX <= rect.right &&
                    mouseY >= rect.top &&
                    mouseY <= rect.bottom
                ) {
                    log('Project scrolled into cursor position');
                    
                    // If we're not already tracking another project
                    if (!isTracking) {
                        activateProjectPreview(project, previewEl, imgEl);
                    }
                }
            }
        });
    }, {
        // Only trigger when at least 30% of the project is visible
        threshold: 0.3
    });
    
    // Observe all project elements
    document.querySelectorAll('.project').forEach(project => {
        observer.observe(project);
    });
}

// Function to check if cursor is near project links
function checkIfNearLinks(projectElement, x, y) {
    // Find all link elements within the project-links container
    const linksContainer = projectElement.querySelector('.project-links');
    if (!linksContainer) return false;
    
    // Get bounding rect of the links container
    const rect = linksContainer.getBoundingClientRect();
    
    // Define a larger detection area around the links (100px buffer)
    const buffer = 100;
    const extendedRect = {
        left: rect.left - buffer,
        right: rect.right + buffer,
        top: rect.top - buffer,
        bottom: rect.bottom + buffer
    };
    
    // Check if cursor is within the extended area
    const isNear = 
        x >= extendedRect.left && 
        x <= extendedRect.right && 
        y >= extendedRect.top && 
        y <= extendedRect.bottom;
    
    if (isNear && isTracking) {
        log('Cursor near links - hiding preview');
    }
    
    return isNear;
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreviewSystem);
} else {
    initPreviewSystem();
} 
