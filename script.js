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
        // Spotify playlist tracks from https://open.spotify.com/playlist/522c2o74Xw5z1JxWBBGutT
        const playlistTracks = [
            { name: "Dirty Secrets", artist: "d4vd", image: "./assets/cover/Dirty Secrets.jpg" },
            { name: "DTN", artist: "d4vd", image: "./assets/cover/DTN.jpg" },
            { name: "Lady Brown (feat. Cise Starr from CYNE)", artist: "Nujabes, Cise Starr", image: "./assets/cover/Lady Brown (feat. Cise Starr from CYNE).jpg" },
            { name: "Lullaby", artist: "Ichiko Aoba", image: "./assets/cover/Lullaby.jpg" },
            { name: "Music On The Radio", artist: "Empire Of The Sun", image: "./assets/cover/Music On The Radio.jpg" },
            { name: "Husk", artist: "Men I Trust", image: "./assets/cover/Husk.jpg" },
            { name: "What's Going On", artist: "Marvin Gaye", image: "./assets/cover/What's Going On.jpg" },
            { name: "I'll Be Right There", artist: "JPEGMAFIA", image: "./assets/cover/I'll Be Right There.jpg" },
            { name: "either on or off the drugs", artist: "JPEGMAFIA", image: "./assets/cover/either on or off the drugs.jpg" },
            { name: "i recovered from this", artist: "JPEGMAFIA", image: "./assets/cover/i recovered from this.jpg" },
            { name: "Don't Put Anything On the Bible (feat. Buzzy Lee)", artist: "JPEGMAFIA, Buzzy Lee", image: "./assets/cover/Don't Put Anything On the Bible (feat. Buzzy Lee).jpg" },
            { name: "Imaginary Folklore", artist: "clammbon, Nujabes", image: "./assets/cover/Imaginary Folklore.jpg" },
            { name: "Kids", artist: "MGMT", image: "./assets/cover/Kids.jpg" },
            { name: "Wonderful World", artist: "The Flying Pickets", image: "./assets/cover/Wonderful World.jpg" },
            { name: "Love Lost", artist: "Mac Miller, The Temper Trap", image: "./assets/cover/Love Lost.jpg" },
            { name: "Cigarette Daydreams", artist: "Cage The Elephant", image: "./assets/cover/Cigarette Daydreams.jpg" },
            { name: "Call me when you're home", artist: "kkanji", image: "./assets/cover/Call me when you're home.jpg" },
            { name: "Levitation", artist: "Beach House", image: "./assets/cover/Levitation.jpg" },
            { name: "Sparks", artist: "Beach House", image: "./assets/cover/Sparks.jpg" },
            { name: "Greed", artist: "kkanji", image: "./assets/cover/Greed.jpg" },
            { name: "Here, There And Everywhere - Remastered 2009", artist: "The Beatles", image: "./assets/cover/Here, There And Everywhere - Remastered 2009.jpg" },
            { name: "The Spins", artist: "Mac Miller, Empire Of The Sun", image: "./assets/cover/The Spins.jpg" },
            { name: "Just Can't Get Enough", artist: "Black Eyed Peas", image: "./assets/cover/Just Can't Get Enough.jpg" },
            { name: "DIKEMBE!", artist: "JPEGMAFIA", image: "./assets/cover/DIKEMBE!.jpg" },
            { name: "ARE YOU HAPPY?", artist: "JPEGMAFIA", image: "./assets/cover/ARE YOU HAPPY?.jpg" },
            { name: "Meet Me Halfway", artist: "Black Eyed Peas", image: "./assets/cover/Meet Me Halfway.jpg" },
            { name: "Who Did You Touch?", artist: "Montell Fish", image: "./assets/cover/Who Did You Touch?.jpg" },
            { name: "Ain't No Mountain High Enough", artist: "Marvin Gaye, Tammi Terrell", image: "./assets/cover/Ain't No Mountain High Enough.jpg" },
            { name: "Smalltown Boy", artist: "Bronski Beat", image: "./assets/cover/Smalltown Boy.jpg" }
        ];

        // Select a random track
        const randomTrack = playlistTracks[Math.floor(Math.random() * playlistTracks.length)];

        // Display the random recommendation
        document.getElementById('random-recommendation').innerHTML = `
            <h4 style="margin-top: 0.5rem;">Random Recommendation</h4>
            <div style="display: flex; align-items: center;">
                <img src="${randomTrack.image}" alt="${randomTrack.name}" style="border-radius: 13px; width: 50px; height: 50px; margin-right: 10px;">
                <div>
                    <p>${randomTrack.name}</p>
                    <p style="margin: 0;">by ${randomTrack.artist}</p>
                </div>
            </div>
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