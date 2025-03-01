const cursor = document.querySelector('.custom-cursor');
const clickableElements = document.querySelectorAll('a, .box');
const projects = document.querySelectorAll('.project');
const previewImage = document.getElementById('preview-image');
const previewWindow = document.querySelector('.preview-window');

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

// Add event listener to the arrow icon to hide the preview window
const arrowIcons = document.querySelectorAll('.link-icon');
arrowIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        const previewWindow = document.querySelector('.preview-window');
        previewWindow.style.display = 'none'; // Hide the preview window
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

// Fetch and display music stats
async function displayMusicStats() {
    try {
        // Fetch the most recent track from Last.fm API
        const recentResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=syntiiix&api_key=974fb2e0a3add0ac42c2729f6c1e854a&format=json&limit=1`);
        const recentData = await recentResponse.json();
        const recentTrack = recentData.recenttracks.track[0];

        // Display the most recent track with cover image next to the song name
        document.getElementById('recent-track').innerHTML = `
            <h4>Most Recent Track</h4>
            <div style="display: flex; align-items: center;">
                <img src="${recentTrack.image[2]['#text']}" alt="${recentTrack.name}" style="border-radius: 13px; width: 50px; height: 50px; margin-right: 10px;">
                <div>
                    <p>${recentTrack.name}</p>
                    <p style="margin: 0;">by ${recentTrack.artist['#text']}</p>
                </div>
            </div>
        `;

        // Fetch the last week's data from last_week_tracks.json
        const tracksResponse = await fetch('last_week_tracks.json');
        const tracks = await tracksResponse.json();

        // Determine top track, artist, and album
        const trackCounts = {};
        const artistCounts = {};
        const albumCounts = {};

        tracks.forEach(track => {
            // Count occurrences of each track
            trackCounts[track.name] = (trackCounts[track.name] || 0) + 1;

            // Count occurrences of each artist
            artistCounts[track.artist['#text']] = (artistCounts[track.artist['#text']] || 0) + 1;

            // Count occurrences of each album
            albumCounts[track.album['#text']] = (albumCounts[track.album['#text']] || 0) + 1;
        });

        // Get the top track, artist, and album
        const topTrack = Object.keys(trackCounts).reduce((a, b) => trackCounts[a] > trackCounts[b] ? a : b);
        const topArtist = Object.keys(artistCounts).reduce((a, b) => artistCounts[a] > artistCounts[b] ? a : b);
        const topAlbum = Object.keys(albumCounts).reduce((a, b) => albumCounts[a] > albumCounts[b] ? a : b);

        // Display monthly music stats header
        document.getElementById('top-track').innerHTML = `
            <h4>Monthly Music Stats</h4>
            <p>Top Track: ${topTrack} - ${trackCounts[topTrack]} plays</p>
            <p>Top Artist: ${topArtist} - ${artistCounts[topArtist]} plays</p>
            <p>Top Album: ${topAlbum} - ${albumCounts[topAlbum]} plays</p>
        `;
    } catch (error) {
        console.error('Error fetching music stats:', error);
    }
}

// Call the function to display music stats
displayMusicStats();

// Add event listeners for each project
projects.forEach((project) => {
    project.addEventListener('mouseenter', (event) => {
        // Hide the cursor
        document.body.classList.add('hide-cursor');

        const imagePath = project.getAttribute('data-preview');
        previewImage.src = imagePath;
        previewImage.classList.add('visible');
        previewWindow.style.display = 'block'; // Show the preview window

        // Position the preview window based on mouse coordinates
        positionPreviewWindow(event);
    });

    project.addEventListener('mousemove', (event) => {
        // Update the position of the preview window as the mouse moves
        positionPreviewWindow(event);
    });

    project.addEventListener('mouseleave', () => {
        // Show the cursor again
        document.body.classList.remove('hide-cursor');

        previewImage.classList.remove('visible');
        previewWindow.style.display = 'none'; // Hide the preview window
    });

    // Add event listener to the arrow icon to hide the preview window
    const arrowIcon = project.querySelector('.link-icon');
    if (arrowIcon) {
        arrowIcon.addEventListener('mouseenter', () => {
            previewWindow.style.display = 'none'; // Hide the preview window
        });

        // Add event listener to show the preview window again when leaving the arrow icon
        arrowIcon.addEventListener('mouseleave', () => {
            const imagePath = project.getAttribute('data-preview');
            previewImage.src = imagePath;
            previewImage.classList.add('visible');
            previewWindow.style.display = 'block'; // Show the preview window again
        });
    }
});

// Function to position the preview window
function positionPreviewWindow(event) {
    const { clientX, clientY } = event;
    const offsetX = 10; // Decrease this value to move the preview window further to the left
    const offsetY = 20; // Keep the vertical offset as needed

    // Set the position of the preview window
    previewWindow.style.left = `${clientX - offsetX}px`; // Adjust for the left offset
    previewWindow.style.top = `${clientY + offsetY}px`; // Align with the cursor
} 