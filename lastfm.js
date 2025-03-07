const axios = require('axios');
require('dotenv').config();

// Use environment variables with fallbacks
const API_KEY = process.env.LASTFM_API_KEY || '974fb2e0a3add0ac42c2729f6c1e854a';
const USERNAME = process.env.LASTFM_USERNAME || 'syntiiix';

// Store tracks in memory instead of writing to a file
let cachedTracks = [];

async function fetchRecentTracks() {
    try {
        const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
            params: {
                method: 'user.getRecentTracks',
                user: USERNAME,
                api_key: API_KEY,
                format: 'json',
                limit: 100
            }
        });

        const tracks = response.data.recenttracks.track;
        cachedTracks = tracks; // Store in memory
        console.log(`Fetched ${tracks.length} recent tracks from Last.fm`);
        return tracks;
    } catch (error) {
        console.error('Error fetching recent tracks:', error);
        return [];
    }
}

// Export functions and data for use in server.js
module.exports = {
    fetchRecentTracks,
    getCachedTracks: () => cachedTracks,
    startFetchInterval: () => {
        // Fetch tracks every hour
        setInterval(fetchRecentTracks, 60 * 60 * 1000);
        
        // Initial fetch
        return fetchRecentTracks();
    }
}; 