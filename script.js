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

// Fetch and display music stats
async function displayMusicStats() {
    try {
        // Fetch the most recent track from Last.fm API
        const recentResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=syntiiix&api_key=974fb2e0a3add0ac42c2729f6c1e854a&format=json&limit=1`);
        const recentData = await recentResponse.json();
        const recentTrack = recentData.recenttracks.track[0];

        // Display the most recent track without play count
        document.getElementById('recent-track').innerHTML = `
            <h4>Most Recent Track</h4>
            <img src="${recentTrack.image[2]['#text']}" alt="${recentTrack.name}" style="border-radius: 50%; width: 50px; height: 50px;">
            <p>${recentTrack.name} by ${recentTrack.artist['#text']}</p>
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

        // Display top track, artist, and album with play counts
        document.getElementById('top-track').innerHTML = `
            <h4>Top Track This Month</h4>
            <p>${topTrack} - ${trackCounts[topTrack]} plays</p>
        `;

        document.getElementById('top-artist').innerHTML = `
            <h4>Top Artist This Month</h4>
            <p>${topArtist} - ${artistCounts[topArtist]} plays</p>
        `;

        document.getElementById('top-album').innerHTML = `
            <h4>Top Album This Month</h4>
            <p>${topAlbum} - ${albumCounts[topAlbum]} plays</p>
        `;
    } catch (error) {
        console.error('Error fetching music stats:', error);
    }
}

// Call the function to display music stats
displayMusicStats(); 