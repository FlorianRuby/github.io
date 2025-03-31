# 💻 FlorianRuby Portfolio Website

Welcome to my portfolio website repository! This project showcases my personal portfolio using a Bento-Box layout and integrates LastFM for displaying music stats.

## Tech Stack

- **JavaScript**
- **CSS**
- **HTML**

## Features

- **Bento-Box Layout**: A modern and responsive layout design.
- **LastFM Integration**: Fetch and display my music stats from LastFM.

## Showcase

Once you open the page you'll be greated by this Bento Box layout.

Each box hast its own animation when hovering over it. 

When hovering over clickable links you can also see either an arrow icon under the cursor if it links to something on my portfolio or a URL if it links to something outside of my website.
![ezgif com-optimize](https://github.com/user-attachments/assets/5713757a-1c6b-4c08-ba7a-1066de9c6f2d)

In the music box you can see my listening habits in stats, charts and my most recently / currently playing track as well. 

*For this I'm using the LastFM API for the stats, the Spotify API for the covers and as a backup if Spotify can't fetch the cover I'm using the Musicbrainz API.*

### How It Works

The integration with LastFM is handled through several key functions and files:

1. **fetch-lastfm-data.js**
   - `fetchLastFmData`: Fetches data from the Last.fm API based on specified method, period, and limit.
   - `processAllData`: Fetches and processes data for each defined time period.
   - **Location:** `fetch-lastfm-data.js`

2. **music-stats.js**
   - `loadMusicData`: Loads music data for a specified timespan, fetching from a static JSON file or falling back to mock data.
   - **Location:** `music-stats.js`

3. **script.js**
   - `displayMusicStats`: Fetches the most recent track played by the user from the Last.fm API and displays it on the webpage.
   - **Location:** `script.js`

4. **server.js**
   - Handles server-side API requests to fetch data from Last.fm.
   - **Location:** `server.js`

5. **Data Files**: Static JSON files used to store fetched data.
   - **Location:** `data` directory (e.g., `lastfm-7day.json`, `lastfm-overall.json`)


---
add more gifs and text later
--
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Email**: reazn.dev@gmail.com
- **Discord**: reazn999

Feel free to reach out if you have any questions or suggestions!
