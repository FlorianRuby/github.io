const cursor = document.querySelector('.custom-cursor');
const clickableElements = document.querySelectorAll('a, .box');

// Update cursor position
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Handle cursor states for different elements
clickableElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        
        // Check if it's an external link
        if (element.tagName === 'A' && !element.getAttribute('onclick')) {
            cursor.classList.add('external');
            cursor.classList.remove('internal');
            cursor.setAttribute('data-href', element.getAttribute('href'));
        } else {
            cursor.classList.add('internal');
            cursor.classList.remove('external');
            cursor.removeAttribute('data-href');
        }
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active', 'internal', 'external');
        cursor.removeAttribute('data-href');
    });
});

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ 
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    document.querySelectorAll('.content-wrapper').forEach((wrapper) => {
        observer.observe(wrapper);
    });
}); 