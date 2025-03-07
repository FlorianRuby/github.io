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
    const days = 30; // Changed from 7 to 30 days for monthly stats
    
    const allTracks = [];
    const currentDate = Math.floor(Date.now() / 1000);
    const oneMonthAgo = currentDate - (days * 24 * 60 * 60);
    
    // Fetch up to 10 pages of tracks to get more monthly data
    for (let page = 1; page <= 10; page++) {
      const response = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${apiKey}&format=json&limit=${limit}&page=${page}`
      );
      
      const data = await response.json();
      const tracks = data.recenttracks.track;
      
      if (!tracks || tracks.length === 0) break;
      
      // Filter tracks from the last month
      const filteredTracks = tracks.filter(track => {
        if (track.date && track.date['#text']) {
          const trackDate = Math.floor(new Date(track.date['#text']).getTime() / 1000);
          return trackDate >= oneMonthAgo;
        }
        return false;
      });
      
      allTracks.push(...filteredTracks);
      
      // If we have less tracks than the limit or no tracks from this page are within our date range, we've reached the end
      if (tracks.length < limit || filteredTracks.length === 0) break;
    }
    
    res.json(allTracks);
  } catch (error) {
    console.error('Error fetching monthly tracks:', error);
    res.status(500).json({ error: 'Failed to fetch monthly tracks' });
  }
});

// Add a new endpoint for weekly chart data
app.get('/api/lastfm/tracks/chart', async (req, res) => {
  try {
    const apiKey = process.env.LASTFM_API_KEY || '974fb2e0a3add0ac42c2729f6c1e854a';
    const username = 'syntiiix';
    const limit = 1000; // Get more tracks to ensure we have enough data
    
    const allTracks = [];
    const currentDate = Math.floor(Date.now() / 1000);
    const sevenDaysAgo = currentDate - (7 * 24 * 60 * 60);
    
    // Fetch up to 3 pages of tracks to ensure we get all data from the last 7 days
    for (let page = 1; page <= 3; page++) {
      const response = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${apiKey}&format=json&limit=${limit}&page=${page}`
      );
      
      const data = await response.json();
      const tracks = data.recenttracks.track;
      
      if (!tracks || tracks.length === 0) break;
      
      // Filter tracks from the last 7 days
      const filteredTracks = tracks.filter(track => {
        if (track.date && track.date['#text']) {
          const trackDate = Math.floor(new Date(track.date['#text']).getTime() / 1000);
          return trackDate >= sevenDaysAgo;
        }
        return false;
      });
      
      allTracks.push(...filteredTracks);
      
      // If we have tracks older than 7 days, we can stop
      const oldestTrackInBatch = tracks[tracks.length - 1];
      if (oldestTrackInBatch.date && oldestTrackInBatch.date['#text']) {
        const oldestDate = Math.floor(new Date(oldestTrackInBatch.date['#text']).getTime() / 1000);
        if (oldestDate < sevenDaysAgo) break;
      }
    }
    
    // Group tracks by day
    const dailyCounts = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize all 7 days with 0 counts
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      dailyCounts[dayName] = 0;
    }
    
    // Count tracks for each day
    allTracks.forEach(track => {
      if (track.date && track.date['#text']) {
        const trackDate = new Date(track.date['#text']);
        const dayName = days[trackDate.getDay()];
        dailyCounts[dayName]++;
      }
    });
    
    // Convert to array format for the chart
    const chartData = Object.entries(dailyCounts).map(([day, count]) => ({
      day,
      count
    }));
    
    res.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 