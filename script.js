const cursor = document.querySelector('.custom-cursor');
const clickableElements = document.querySelectorAll('.box');

function updateCursor(e) {
    requestAnimationFrame(() => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

document.addEventListener('mousemove', updateCursor);

// Show/hide cursor on clickable elements
clickableElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
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