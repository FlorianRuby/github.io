const axios = require('axios');
require('dotenv').config();

// Use environment variables with fallbacks
const API_KEY = process.env.LASTFM_API_KEY || '974fb2e0a3add0ac42c2729f6c1e854a';
const USERNAME = process.env.LASTFM_USERNAME || 'syntiiix';
const OUTPUT_FILE = 'last_week_tracks.json';
const LIMIT = 200; // Max tracks per request
const DAYS = 7; // Number of days to fetch
const DELAY = 1000; // Delay in milliseconds between requests

// Store tracks in memory
let lastWeekTracks = [];

async function fetchLastWeekTracks() {
    const allTracks = [];
    const currentDate = Math.floor(Date.now() / 1000); // Current timestamp
    const oneWeekAgo = currentDate - (DAYS * 24 * 60 * 60); // Timestamp for one week ago

    let page = 1; // Start from page 1
    let hasMoreTracks = true;

    while (hasMoreTracks && page <= 6) { // Stop after page 6
        try {
            const response = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
                params: {
                    method: 'user.getRecentTracks',
                    user: USERNAME,
                    api_key: API_KEY,
                    format: 'json',
                    limit: LIMIT,
                    page: page
                }
            });

            const tracks = response.data.recenttracks.track;

            // Check if tracks exist
            if (!tracks) {
                console.error('No tracks found in the response.');
                break;
            }

            // Filter tracks to only include those from the last week
            const filteredTracks = tracks.filter(track => {
                // Check if track.date exists and has the #text property
                if (track.date && track.date['#text']) {
                    const trackDate = Math.floor(new Date(track.date['#text']).getTime() / 1000);
                    return trackDate >= oneWeekAgo;
                }
                return false; // Exclude tracks without a valid date
            });

            allTracks.push(...filteredTracks);

            // Log the number of filtered tracks
            console.log(`Fetched ${filteredTracks.length} tracks from page ${page}.`);

            // Check if we have more tracks to fetch
            if (tracks.length < LIMIT) {
                hasMoreTracks = false; // No more tracks to fetch
            } else {
                page++; // Increment page for next request
                await new Promise(resolve => setTimeout(resolve, DELAY)); // Delay before next request
            }
        } catch (error) {
            console.error('Error fetching tracks:', error);
            hasMoreTracks = false; // Stop fetching on error
        }
    }

    // Store tracks in memory
    lastWeekTracks = allTracks;
    console.log(`Fetched ${allTracks.length} tracks from the last week.`);
    return allTracks;
}

// Export functions and data
module.exports = {
    fetchLastWeekTracks,
    getLastWeekTracks: () => lastWeekTracks,
    startWeeklyFetch: () => {
        // Fetch tracks once a day
        setInterval(fetchLastWeekTracks, 24 * 60 * 60 * 1000);
        
        // Initial fetch
        return fetchLastWeekTracks();
    }
};