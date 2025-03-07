const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

// Import our lastfm modules
const lastfm = require('./lastfm');
const lastWeekData = require('./fetch_last_week_data');

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

// New endpoint to serve recent tracks from memory
app.get('/recent_tracks.json', (req, res) => {
  const tracks = lastfm.getCachedTracks();
  res.json(tracks);
});

// New endpoint to serve last week's tracks from memory
app.get('/last_week_tracks.json', (req, res) => {
  const tracks = lastWeekData.getLastWeekTracks();
  res.json(tracks);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Start the interval to fetch recent tracks
  lastfm.startFetchInterval()
    .then(() => console.log('Initial Last.fm tracks fetch completed'))
    .catch(err => console.error('Error during initial Last.fm fetch:', err));
    
  // Start the interval to fetch last week's tracks
  lastWeekData.startWeeklyFetch()
    .then(() => console.log('Initial Last.fm last week tracks fetch completed'))
    .catch(err => console.error('Error during initial Last.fm last week fetch:', err));
}); 