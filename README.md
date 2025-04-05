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
## Landing Page
<img src="https://github.com/user-attachments/assets/5713757a-1c6b-4c08-ba7a-1066de9c6f2d" width="800">

Once you open the page you'll be greated by this Bento Box layout.

Each box hast its own animation when hovering over it. 

When hovering over clickable links you can also see either an arrow icon under the cursor if it links to something on my portfolio or a URL if it links to something outside of my website.

In the music box you can see my listening habits in stats, charts and my most recently / currently playing track as well. 

*For this I'm using the LastFM API for the stats, the Spotify API for the covers and as a backup if Spotify can't fetch the cover I'm using the Musicbrainz API.*

### How it works

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

## Projects
![2025-04-0513-17-56-ezgif com-crop](https://github.com/user-attachments/assets/02f610be-dad4-4cfd-9e98-51d358cf4e5f)

For the Projects section, I reused a hover-based project card design from a previous website.

### How it works
1. **project-cards.js**
   - `detectCursorPosition`: Detects the cursor position and displays a preview card for the hovered project.
   - **Location:** `project-cards.js`

## About Me
![2025-04-0513-14-51-ezgif com-crop](https://github.com/user-attachments/assets/60125367-bea9-4981-8a62-46a2f4d5fd82)

In the About Me section I've decided to add an education timeline on the right side with an animation where the opacity of the lines changes depending on how far one scrolled.
Under the text you can see my tech stack inform of an icon carousel as well. I know many people don't like carousels for tech stacks since the UX isn't the best, however you can see 7 icons at a time and there are 8 icons in total.

### How it works 

1. **CSS Styling:**
   - CSS variables `--timeline-color` and `--timeline-opacity` are used to control the color and opacity of the timeline items.

2. **JavaScript Implementation:**
   - The JavaScript code dynamically updates the CSS variables based on the scroll position.

**Key Code Snippet from `script.js`:**

```javascript
const timelineItems = document.querySelectorAll('.timeline-item');
const aboutSection = document.querySelector('#about-section');

window.addEventListener('scroll', () => {
    if (!aboutSection) return;

    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    timelineItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemTop = itemRect.top;
        const startTrigger = viewportHeight * 1; // Start transition earlier
        const endTrigger = viewportHeight * 0.75; // End transition later

        if (itemTop <= startTrigger && itemTop >= endTrigger) {
            // Calculate progress (0 to 1) based on item's position between start and end points
            const progress = (startTrigger - itemTop) / (startTrigger - endTrigger);

            // Interpolate from transparent to purple (#8E8DBE)
            const opacity = progress;
            item.style.setProperty('--timeline-color', `rgba(142, 141, 190, ${opacity})`);
            item.style.setProperty('--timeline-opacity', opacity);
        } else if (itemTop < endTrigger) {
            item.style.setProperty('--timeline-color', '#8E8DBE'); // Fully purple
            item.style.setProperty('--timeline-opacity', '1');
        } else {
            item.style.setProperty('--timeline-color', 'rgba(142, 141, 190, 0)'); // Fully transparent
            item.style.setProperty('--timeline-opacity', '0');
        }
    });
});
```

## Music
![2025-04-0513-15-02-ezgif com-crop](https://github.com/user-attachments/assets/eb61f0a6-e113-4018-8e5c-fbc1832f756f)

For the Music section I've used the LastFM API for getting the stats again as well as the Spotify API for the covers and the MusicBrainz API for the covers as a back up. 
Here you can choose the timeframe of which you want to see my stats, you can either choose 7 Days, 1  Month, 3 Months, 1 Year or All Time.

I've also added a box where you can see SOME of the albums I've listened to in 2025.

### How it works

#### Music stats
**fetch-lastfm-data.js**
- Fetches and processes music stats from the LastFM API.
- Runs automatically every hour.
- URL used:
  - `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=${limit}&page=${page}`
#### Album box
**fetch-album-history**
- Fetches and processes all albums listened to.
  - Album counts as listened to if 70% of the songs have at least one play.
- Runs automatically every 6 hours.

```
  const outputFile = path.join(OUTPUT_DIR, 'lastfm-albums-history.json');
  fs.writeFileSync(outputFile, JSON.stringify({ 
    albums: processedAlbums, 
    lastUpdated: new Date().toISOString(),
    criteria: {
      listenedFrom: FROM_YEAR,
      minTracks: MIN_TRACKS,
      listenThreshold: LISTEN_THRESHOLD
    }
  }, null, 2));
  
  console.log(`Saved album history to ${outputFile}`);
}
```

**album-history.js**
- Shows albums with title, artist name & cover. 

## Contact

- **Email**: reazn.dev@gmail.com
- **Discord**: reazn999

Feel free to reach out if you have any questions!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
