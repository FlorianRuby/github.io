const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Last.fm API proxy endpoint to avoid CORS issues
app.get('/api/lastfm/:method', async (req, res) => {
  try {
    const { method } = req.params;
    const { user, limit } = req.query;
    
    // Use environment variable for API key
    const apiKey = process.env.LASTFM_API_KEY || '974fb2e0a3add0ac42c2729f6c1e854a';
    
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=${method}&user=${user}&api_key=${apiKey}&format=json&limit=${limit}`
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching from Last.fm API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Last.fm API' });
  }
});

// New endpoint for last week's tracks
app.get('/api/lastfm/tracks/weekly', async (req, res) => {
  try {
    const apiKey = process.env.LASTFM_API_KEY || '974fb2e0a3add0ac42c2729f6c1e854a';
    const username = 'syntiiix';
    const limit = 200;
    const days = 7;
    
    const allTracks = [];
    const currentDate = Math.floor(Date.now() / 1000);
    const oneWeekAgo = currentDate - (days * 24 * 60 * 60);
    
    // Fetch up to 6 pages of tracks
    for (let page = 1; page <= 6; page++) {
      const response = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${apiKey}&format=json&limit=${limit}&page=${page}`
      );
      
      const data = await response.json();
      const tracks = data.recenttracks.track;
      
      if (!tracks || tracks.length === 0) break;
      
      // Filter tracks from the last week
      const filteredTracks = tracks.filter(track => {
        if (track.date && track.date['#text']) {
          const trackDate = Math.floor(new Date(track.date['#text']).getTime() / 1000);
          return trackDate >= oneWeekAgo;
        }
        return false;
      });
      
      allTracks.push(...filteredTracks);
      
      // If we have less tracks than the limit, we've reached the end
      if (tracks.length < limit) break;
    }
    
    res.json(allTracks);
  } catch (error) {
    console.error('Error fetching weekly tracks:', error);
    res.status(500).json({ error: 'Failed to fetch weekly tracks' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 