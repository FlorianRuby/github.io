const fs = require('fs');
const axios = require('axios');

const API_KEY = '974fb2e0a3add0ac42c2729f6c1e854a';
const USERNAME = 'syntiiix';
const OUTPUT_FILE = 'recent_tracks.json';

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
        saveTracksToFile(tracks);
    } catch (error) {
        console.error('Error fetching recent tracks:', error);
    }
}

function saveTracksToFile(tracks) {
    fs.writeFile(OUTPUT_FILE, JSON.stringify(tracks, null, 2), (err) => {
        if (err) {
            console.error('Error saving tracks to file:', err);
        } else {
            console.log('Recent tracks saved to', OUTPUT_FILE);
        }
    });
}

// Fetch tracks every hour
setInterval(fetchRecentTracks, 60 * 60 * 1000);

// Initial fetch
fetchRecentTracks(); 