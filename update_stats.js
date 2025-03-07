const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.LASTFM_API_KEY || '974fb2e0a3add0ac42c2729f6c1e854a';
const USERNAME = 'syntiiix';

async function fetchMonthlyStats() {
    try {
        const limit = 1000;
        const days = 30;
        const allTracks = [];
        const currentDate = Math.floor(Date.now() / 1000);
        const oneMonthAgo = currentDate - (days * 24 * 60 * 60);

        // Fetch up to 10 pages of tracks
        for (let page = 1; page <= 10; page++) {
            console.log(`Fetching page ${page} of monthly tracks...`);
            const response = await fetch(
                `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=${limit}&page=${page}`
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

            if (tracks.length < limit || filteredTracks.length === 0) break;
        }

        // Calculate top tracks, artists, and albums
        const trackCounts = {};
        const artistCounts = {};
        const albumCounts = {};

        allTracks.forEach(track => {
            // Count tracks
            const trackKey = `${track.name} - ${track.artist['#text']}`;
            trackCounts[trackKey] = (trackCounts[trackKey] || 0) + 1;

            // Count artists
            artistCounts[track.artist['#text']] = (artistCounts[track.artist['#text']] || 0) + 1;

            // Count albums
            if (track.album && track.album['#text']) {
                const albumKey = `${track.album['#text']} - ${track.artist['#text']}`;
                albumCounts[albumKey] = (albumCounts[albumKey] || 0) + 1;
            }
        });

        // Get top items
        const topTrackKey = Object.keys(trackCounts).reduce((a, b) => trackCounts[a] > trackCounts[b] ? a : b);
        const topArtist = Object.keys(artistCounts).reduce((a, b) => artistCounts[a] > artistCounts[b] ? a : b);
        const topAlbumKey = Object.keys(albumCounts).reduce((a, b) => albumCounts[a] > albumCounts[b] ? a : b);

        // Find track objects for the top items
        const [topTrackName, topTrackArtist] = topTrackKey.split(' - ');
        const topTrackObj = allTracks.find(t => t.name === topTrackName && t.artist['#text'] === topTrackArtist);
        const topArtistTrack = allTracks.find(t => t.artist['#text'] === topArtist);
        const [topAlbumName, topAlbumArtist] = topAlbumKey.split(' - ');
        const topAlbumTrack = allTracks.find(t => t.album && t.album['#text'] === topAlbumName && t.artist['#text'] === topAlbumArtist);

        // Create monthly stats object
        const monthlyStats = {
            topTrack: {
                name: topTrackName,
                artist: topTrackArtist,
                plays: trackCounts[topTrackKey],
                image: topTrackObj?.image[2]['#text']
            },
            topArtist: {
                name: topArtist,
                plays: artistCounts[topArtist],
                image: topArtistTrack?.image[2]['#text']
            },
            topAlbum: {
                name: topAlbumName,
                artist: topAlbumArtist,
                plays: albumCounts[topAlbumKey],
                image: topAlbumTrack?.image[2]['#text']
            }
        };

        // Save to file
        fs.writeFileSync('monthly_stats.json', JSON.stringify(monthlyStats, null, 2));
        console.log('Monthly stats updated successfully!');

        // Now update the weekly chart
        await updateWeeklyChart();

    } catch (error) {
        console.error('Error updating monthly stats:', error);
    }
}

async function updateWeeklyChart() {
    try {
        const limit = 1000;
        const allTracks = [];
        const currentDate = Math.floor(Date.now() / 1000);
        const sevenDaysAgo = currentDate - (7 * 24 * 60 * 60);

        // Fetch up to 3 pages of tracks
        for (let page = 1; page <= 3; page++) {
            console.log(`Fetching page ${page} of weekly tracks...`);
            const response = await fetch(
                `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=${limit}&page=${page}`
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

            // Check if we've reached tracks older than 7 days
            const oldestTrack = tracks[tracks.length - 1];
            if (oldestTrack.date && oldestTrack.date['#text']) {
                const oldestDate = Math.floor(new Date(oldestTrack.date['#text']).getTime() / 1000);
                if (oldestDate < sevenDaysAgo) break;
            }
        }

        // Get the last 7 days in order
        const orderedDays = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            orderedDays.push(days[date.getDay()]);
        }

        // Initialize counts for all days
        const dailyCounts = {};
        orderedDays.forEach(day => {
            dailyCounts[day] = 0;
        });

        // Count tracks for each day
        allTracks.forEach(track => {
            if (track.date && track.date['#text']) {
                const trackDate = new Date(track.date['#text']);
                const dayName = days[trackDate.getDay()];
                if (dailyCounts.hasOwnProperty(dayName)) {
                    dailyCounts[dayName]++;
                }
            }
        });

        // Convert to array format for the chart, maintaining the order
        const chartData = {
            data: orderedDays.map(day => ({
                day,
                count: dailyCounts[day]
            }))
        };

        // Save to file
        fs.writeFileSync('weekly_chart.json', JSON.stringify(chartData, null, 2));
        console.log('Weekly chart updated successfully!');

    } catch (error) {
        console.error('Error updating weekly chart:', error);
    }
}

// Run the update
fetchMonthlyStats(); 