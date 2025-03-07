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

        // Display monthly music stats
        document.getElementById('top-track').innerHTML = `
            <h3>Monthly Music Stats</h3>
            <p>Top Track: ${topTrack} - ${trackCounts[topTrack]} plays</p>
            <p>Top Artist: ${topArtist} - ${artistCounts[topArtist]} plays</p>
        `;

        // Display top album with image
        document.getElementById('top-album').innerHTML = `
            <div>
                <p>Top Album: ${topAlbum} - ${albumCounts[topAlbum]} plays</p>
            </div>
        `;

        // Display random recommendation
        displayRandomRecommendation();
    } catch (error) {
        console.error('Error fetching music stats:', error);
    }
}

// Function to display a random track recommendation from a Spotify playlist
async function displayRandomRecommendation() {
    try {
        const playlistTracks = [
            { name: "Dirty Secrets", artist: "d4vd", image: "https://i.scdn.co/image/ab67616d0000b273c6e0948b4aa3cccb2d274a8d" },
            { name: "DTN", artist: "d4vd", image: "https://i.scdn.co/image/ab67616d0000b273c6e0948b4aa3cccb2d274a8d" },
            { name: "Lady Brown (feat. Cise Starr from CYNE)", artist: "Nujabes, Cise Starr", image: "https://i.scdn.co/image/ab67616d0000b273c0133d07a9e3b150e6868c4f" },
            { name: "Lullaby", artist: "Ichiko Aoba", image: "https://i.scdn.co/image/ab67616d0000b273d8a5c3e4d0b6c1c89b02c5c7" },
            { name: "Music On The Radio", artist: "Empire Of The Sun", image: "https://i.scdn.co/image/ab67616d0000b273c8a1e4f1a4f9c1421b4ead9c" },
            { name: "Husk", artist: "Men I Trust", image: "https://i.scdn.co/image/ab67616d0000b273c2e9b9e48d54a9a5a0c8c7c6" },
            { name: "What's Going On", artist: "Marvin Gaye", image: "https://i.scdn.co/image/ab67616d0000b273b36949bee43217351961ffbc" },
            { name: "I'll Be Right There", artist: "JPEGMAFIA", image: "https://i.scdn.co/image/ab67616d0000b273e5d6c0e9e8264e4251996aaa" },
            { name: "either on or off the drugs", artist: "JPEGMAFIA", image: "https://i.scdn.co/image/ab67616d0000b273e5d6c0e9e8264e4251996aaa" },
            { name: "i recovered from this", artist: "JPEGMAFIA", image: "https://i.scdn.co/image/ab67616d0000b273e5d6c0e9e8264e4251996aaa" },
            { name: "Don't Put Anything On the Bible (feat. Buzzy Lee)", artist: "JPEGMAFIA, Buzzy Lee", image: "https://i.scdn.co/image/ab67616d0000b273e5d6c0e9e8264e4251996aaa" },
            { name: "Imaginary Folklore", artist: "clammbon, Nujabes", image: "https://i.scdn.co/image/ab67616d0000b273c0133d07a9e3b150e6868c4f" },
            { name: "Kids", artist: "MGMT", image: "https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005eb" },
            { name: "Wonderful World", artist: "The Flying Pickets", image: "https://i.scdn.co/image/ab67616d0000b273e0e5e8a28c2befa7571a6c9d" },
            { name: "Love Lost", artist: "Mac Miller, The Temper Trap", image: "https://i.scdn.co/image/ab67616d0000b273a9f6eb70aff5f29b3d96a26e" },
            { name: "Cigarette Daydreams", artist: "Cage The Elephant", image: "https://i.scdn.co/image/ab67616d0000b273bcaf6c7f3c2e9d1f91034782" },
            { name: "Call me when you're home", artist: "kkanji", image: "https://i.scdn.co/image/ab67616d0000b273c2e9b9e48d54a9a5a0c8c7c6" },
            { name: "Levitation", artist: "Beach House", image: "https://i.scdn.co/image/ab67616d0000b273e69f3477f5bbc8c2bc34c698" },
            { name: "Sparks", artist: "Beach House", image: "https://i.scdn.co/image/ab67616d0000b273e69f3477f5bbc8c2bc34c698" },
            { name: "Greed", artist: "kkanji", image: "https://i.scdn.co/image/ab67616d0000b273c2e9b9e48d54a9a5a0c8c7c6" },
            { name: "Here, There And Everywhere - Remastered 2009", artist: "The Beatles", image: "https://i.scdn.co/image/ab67616d0000b2733d92b2ad5af9fbc8637425f0" },
            { name: "The Spins", artist: "Mac Miller, Empire Of The Sun", image: "https://i.scdn.co/image/ab67616d0000b273a9f6eb70aff5f29b3d96a26e" },
            { name: "Just Can't Get Enough", artist: "Black Eyed Peas", image: "https://i.scdn.co/image/ab67616d0000b273f0147e2438d9d42b9471b6a4" },
            { name: "DIKEMBE!", artist: "JPEGMAFIA", image: "https://i.scdn.co/image/ab67616d0000b273e5d6c0e9e8264e4251996aaa" },
            { name: "ARE YOU HAPPY?", artist: "JPEGMAFIA", image: "https://i.scdn.co/image/ab67616d0000b273e5d6c0e9e8264e4251996aaa" },
            { name: "Meet Me Halfway", artist: "Black Eyed Peas", image: "https://i.scdn.co/image/ab67616d0000b273f0147e2438d9d42b9471b6a4" },
            { name: "Who Did You Touch?", artist: "Montell Fish", image: "https://i.scdn.co/image/ab67616d0000b273c2e9b9e48d54a9a5a0c8c7c6" },
            { name: "Ain't No Mountain High Enough", artist: "Marvin Gaye, Tammi Terrell", image: "https://i.scdn.co/image/ab67616d0000b273b36949bee43217351961ffbc" },
            { name: "Smalltown Boy", artist: "Bronski Beat", image: "https://i.scdn.co/image/ab67616d0000b273c2e9b9e48d54a9a5a0c8c7c6" }
        ];

        // Select a random track
        const randomTrack = playlistTracks[Math.floor(Math.random() * playlistTracks.length)];

        // Display the random recommendation
        document.getElementById('random-recommendation').innerHTML = `
            <h4>Random Recommendation</h4>
            <div style="display: flex; align-items: center;">
                <img src="${randomTrack.image}" alt="${randomTrack.name}" style="border-radius: 13px; width: 50px; height: 50px; margin-right: 10px;">
                <div>
                    <p>${randomTrack.name}</p>
                    <p style="margin: 0;">by ${randomTrack.artist}</p>
                </div>
            </div>
            <p style="font-size: 0.8rem; margin-top: 5px;">From <a href="https://open.spotify.com/playlist/522c2o74Xw5z1JxWBBGutT?si=1feb0965c2664c25" target="_blank" style="color: inherit; text-decoration: underline;">Spotify Playlist</a></p>
        `;
    } catch (error) {
        console.error('Error displaying random recommendation:', error);
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