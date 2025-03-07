# Personal Portfolio Website with Last.fm Integration

This is a personal portfolio website that integrates with the Last.fm API to display music listening statistics.

## Features

- Displays recent tracks from Last.fm
- Shows statistics for the last week's listening habits
- Updates data automatically

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Last.fm API key:
   ```
   LASTFM_API_KEY=your_api_key
   LASTFM_USERNAME=your_username
   PORT=3000
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Deploying to Heroku

1. Create a Heroku account if you don't have one
2. Install the Heroku CLI
3. Login to Heroku:
   ```
   heroku login
   ```
4. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
5. Set environment variables:
   ```
   heroku config:set LASTFM_API_KEY=your_api_key
   heroku config:set LASTFM_USERNAME=your_username
   ```
6. Deploy to Heroku:
   ```
   git push heroku main
   ```
7. Open your app:
   ```
   heroku open
   ```

## Keeping Your Heroku Dyno Awake

To prevent your Heroku dyno from sleeping (on free tier), you can use a service like [Kaffeine](https://kaffeine.herokuapp.com/) or [UptimeRobot](https://uptimerobot.com/) to ping your app every 30 minutes.

## How It Works

- The server fetches recent tracks from Last.fm and stores them in memory
- The server also fetches tracks from the last week and stores them in memory
- The data is served via API endpoints that the frontend can access
- The data is updated periodically (recent tracks every hour, last week's tracks every day)

## API Endpoints

- `/recent_tracks.json` - Returns the most recent tracks
- `/last_week_tracks.json` - Returns tracks from the last week
- `/api/lastfm/:method` - Proxy for Last.fm API calls 