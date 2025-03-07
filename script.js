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
        // Fetch the most recent track directly from Last.fm API
        const recentResponse = await fetch('/api/lastfm/user.getRecentTracks?user=syntiiix&limit=1');
        const recentData = await recentResponse.json();
        
        if (!recentData.recenttracks || !recentData.recenttracks.track || recentData.recenttracks.track.length === 0) {
            throw new Error('No recent tracks found');
        }
        
        const recentTrack = recentData.recenttracks.track[0];

        // Display the most recent track with cover image next to the song name
        document.getElementById('recent-track').innerHTML = `
            <h4 style="font-size: 0.9em; margin-bottom: 8px;">Most Recent Track</h4>
            <div style="display: flex; align-items: center;">
                <img src="${recentTrack.image[2]['#text'] || './assets/default-album.png'}" alt="${recentTrack.name}" style="border-radius: 8px; width: 40px; height: 40px; margin-right: 8px;">
                <div>
                    <p style="font-size: 0.85em; margin: 0;">${recentTrack.name}</p>
                    <p style="margin: 0; font-size: 0.75em;">by ${recentTrack.artist['#text']}</p>
                </div>
            </div>
        `;

        // Fetch monthly stats from local JSON
        const monthlyResponse = await fetch('monthly_stats.json');
        const monthlyStats = await monthlyResponse.json();

        // Display top track
        document.getElementById('top-track').innerHTML = `
            <h4 style="font-size: 0.9em; margin-bottom: 8px;">Top Track This Month</h4>
            <div style="display: flex; align-items: center;">
                <img src="${monthlyStats.topTrack.image || './assets/default-album.png'}" alt="${monthlyStats.topTrack.name}" style="border-radius: 8px; width: 40px; height: 40px; margin-right: 8px;">
                <div>
                    <p style="font-size: 0.85em; margin: 0;">${monthlyStats.topTrack.name}</p>
                    <p style="margin: 0; font-size: 0.75em;">by ${monthlyStats.topTrack.artist}</p>
                    <p style="margin: 0; font-size: 0.7em; color: #666;">${monthlyStats.topTrack.plays} plays</p>
                </div>
            </div>
        `;

        // Display top artist
        document.getElementById('top-artist').innerHTML = `
            <h4 style="font-size: 0.9em; margin-bottom: 8px;">Top Artist This Month</h4>
            <div style="display: flex; align-items: center;">
                <img src="${monthlyStats.topArtist.image || './assets/default-album.png'}" alt="${monthlyStats.topArtist.name}" style="border-radius: 8px; width: 40px; height: 40px; margin-right: 8px;">
                <div>
                    <p style="font-size: 0.85em; margin: 0;">${monthlyStats.topArtist.name}</p>
                    <p style="margin: 0; font-size: 0.7em; color: #666;">${monthlyStats.topArtist.plays} plays</p>
                </div>
            </div>
        `;

        // Display top album
        document.getElementById('top-album').innerHTML = `
            <h4 style="font-size: 0.9em; margin-bottom: 8px;">Top Album This Month</h4>
            <div style="display: flex; align-items: center;">
                <img src="${monthlyStats.topAlbum.image || './assets/default-album.png'}" alt="${monthlyStats.topAlbum.name}" style="border-radius: 8px; width: 40px; height: 40px; margin-right: 8px;">
                <div>
                    <p style="font-size: 0.85em; margin: 0;">${monthlyStats.topAlbum.name}</p>
                    <p style="margin: 0; font-size: 0.75em;">by ${monthlyStats.topAlbum.artist}</p>
                    <p style="margin: 0; font-size: 0.7em; color: #666;">${monthlyStats.topAlbum.plays} plays</p>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error fetching music stats:', error);
        // Display error messages in the UI
        const elements = ['recent-track', 'top-track', 'top-artist', 'top-album'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = `
                    <div style="color: #666;">
                        <p>Unable to load music stats</p>
                        <p style="font-size: 0.8em;">Please try again later</p>
                    </div>
                `;
            }
        });
    }
}

// Function to display a random track recommendation from a Spotify playlist
async function displayRandomRecommendation() {
    try {
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
            <h4 style="font-size: 0.9em; margin-bottom: 8px;">Random Recommendation</h4>
            <div style="display: flex; align-items: center;">
                <img src="${randomTrack.image}" alt="${randomTrack.name}" style="border-radius: 8px; width: 40px; height: 40px; margin-right: 8px;">
                <div>
                    <p style="font-size: 0.85em; margin: 0;">${randomTrack.name}</p>
                    <p style="margin: 0; font-size: 0.75em;">by ${randomTrack.artist}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error displaying random recommendation:', error);
    }
}

// Add this function to update the chart
async function updateChart() {
    try {
        const response = await fetch('weekly_chart.json');
        const chartData = await response.json();

        // Debug logs to see what data we're working with
        console.log('Raw chart data:', chartData);
        console.log('Labels:', chartData.data.map(d => d.day));
        console.log('Values:', chartData.data.map(d => d.count));

        // Update the chart with the new data
        const ctx = document.getElementById('listening-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.data.map(d => d.day),
                datasets: [{
                    label: 'Tracks Played',
                    data: chartData.data.map(d => ({ x: d.day, y: d.count })),
                    backgroundColor: 'rgba(142, 141, 190, 0.4)',
                    borderColor: 'rgba(142, 141, 190, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                parsing: {
                    xAxisKey: 'x',
                    yAxisKey: 'y'
                },
                scales: {
                    x: {
                        type: 'category',
                        display: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            source: 'data',
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0,
                            font: {
                                size: 10
                            },
                            color: '#666'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            stepSize: 20,
                            font: {
                                size: 10
                            },
                            color: '#666'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

// Call all functions when the page loads
displayMusicStats();
displayRandomRecommendation();
updateChart();

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