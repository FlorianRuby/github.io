// Last.fm music data loading functionality

document.addEventListener('DOMContentLoaded', function() {
  // Get all timespan buttons
  const timespanButtons = document.querySelectorAll('.timespan-btn');
  
  // Add click event to all timespan buttons
  timespanButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      timespanButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get selected timespan
      const timespan = this.dataset.timespan;
      
      // Load music data for selected timespan
      loadMusicData(timespan);
    });
  });
  
  // Load default timespan (7 days)
  loadMusicData('7day');
});

// Enhanced mock data with realistic values
const mockData = {
  topArtists: [
    {
      name: "Radiohead",
      playcount: "127",
      image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    },
    {
      name: "Daft Punk",
      playcount: "98",
      image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    }
  ],
  topTracks: [
    {
      name: "Karma Police",
      artist: "Radiohead",
      playcount: "36",
      image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    },
    {
      name: "Get Lucky",
      artist: "Daft Punk",
      playcount: "29",
      image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    }
  ],
  topAlbums: [
    {
      name: "OK Computer",
      artist: "Radiohead",
      playcount: "87",
      image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    },
    {
      name: "Random Access Memories",
      artist: "Daft Punk",
      playcount: "75",
      image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    }
  ]
};

// Enhanced loadMusicData function with robust error handling for Heroku
async function loadMusicData(timespan) {
  // Show loading state
  document.querySelectorAll('.music-box-content').forEach(box => {
    box.innerHTML = '<div class="music-item-loading">Loading...</div>';
  });
  
  try {
    let data = null;
    let usedMockData = false;
    
    try {
      // Add cache-busting parameter to avoid caching issues
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/lastfm/top?period=${timespan}&_=${timestamp}`, {
        headers: { 'Cache-Control': 'no-cache' },
        timeout: 10000 // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      data = await response.json();
      
      // Check if we got empty data back
      const hasData = 
        data.topArtists.length > 0 || 
        data.topTracks.length > 0 || 
        data.topAlbums.length > 0;
        
      if (!hasData) {
        console.warn("API returned empty data, using mock data");
        data = mockData;
        usedMockData = true;
      }
    } catch (fetchError) {
      console.warn("Failed to fetch from API, using mock data:", fetchError);
      data = mockData;
      usedMockData = true;
    }
    
    // Display the data
    updateMusicDisplay(data);
    
    // Show a note if we used mock data
    if (usedMockData) {
      document.querySelectorAll('.music-box-content').forEach(box => {
        const noteElement = document.createElement('div');
        noteElement.className = 'mock-data-note';
        noteElement.textContent = 'Using sample data';
        noteElement.style.fontSize = '0.7rem';
        noteElement.style.fontStyle = 'italic';
        noteElement.style.color = '#999';
        noteElement.style.marginTop = '8px';
        box.appendChild(noteElement);
      });
    }
  } catch (error) {
    console.error('Error in loadMusicData:', error);
    document.querySelectorAll('.music-box-content').forEach(box => {
      box.innerHTML = '<div class="music-item-loading">Error loading data</div>';
    });
  }
}

// Function to update the display with music data
function updateMusicDisplay(data) {
  // Update top artist box
  if (data.topArtists && data.topArtists.length > 0) {
    const artist = data.topArtists[0];
    document.getElementById('top-artist-box').querySelector('.music-box-content').innerHTML = `
      <div class="music-item">
        <img src="${artist.image || './assets/default-artist.jpg'}" alt="${artist.name}" class="music-item-image">
        <div class="music-item-info">
          <h5>${artist.name}</h5>
          <div class="music-item-stats">${artist.playcount} plays</div>
        </div>
      </div>
    `;
  }
  
  // Update top track box
  if (data.topTracks && data.topTracks.length > 0) {
    const track = data.topTracks[0];
    document.getElementById('top-track-box').querySelector('.music-box-content').innerHTML = `
      <div class="music-item">
        <img src="${track.image || './assets/default-track.jpg'}" alt="${track.name}" class="music-item-image">
        <div class="music-item-info">
          <h5>${track.name}</h5>
          <p>${track.artist}</p>
          <div class="music-item-stats">${track.playcount} plays</div>
        </div>
      </div>
    `;
  }
  
  // Update top album box
  if (data.topAlbums && data.topAlbums.length > 0) {
    const album = data.topAlbums[0];
    document.getElementById('top-album-box').querySelector('.music-box-content').innerHTML = `
      <div class="music-item">
        <img src="${album.image || './assets/default-album.jpg'}" alt="${album.name}" class="music-item-image">
        <div class="music-item-info">
          <h5>${album.name}</h5>
          <p>${album.artist}</p>
          <div class="music-item-stats">${album.playcount} plays</div>
        </div>
      </div>
    `;
  }
} 