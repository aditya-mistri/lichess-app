# Lichess Explorer

A modern web application built with Next.js, React, and Tailwind CSS that interacts with the Lichess.org API to display user profiles, leaderboards, and tournaments.

## Features

###  Home Page
- Clean, responsive landing page with feature overview
- Quick navigation to all sections
- Chess-themed design with beautiful gradients

###  Profile Lookup (`/profile`)
- Search for any Lichess player by username
- Display comprehensive profile information:
  - Username, title, online status
  - Bio, location, country information
  - Total games played, wins, member since date
  - Detailed ratings across all game types (Bullet, Blitz, Rapid, Classical, Correspondence)
  - Rating progression indicators
  - Color-coded ratings based on skill level

###  Leaderboards (`/leaderboards`)
- View top players across different time controls
- Interactive filters for Bullet, Blitz, Rapid, and Classical
- Player information includes:
  - Username and official titles (GM, IM, FM, etc.)
  - Current ratings and game counts
  - Country information
  - Online status indicators
  - Rating progression
  - FIDE ratings (when available)

###  Tournaments (`/tournaments`)
- Display currently ongoing and upcoming tournaments
- Advanced filtering options:
  - All tournaments
  - Live tournaments
  - Upcoming tournaments
  - Starting soon
- Tournament details include:
  - Tournament name and status
  - Variant type (Standard, Chess960, King of the Hill, etc.)
  - Time control classification
  - Number of participants
  - Duration and start times
  - Rating restrictions
  - Direct links to join tournaments

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **API**: Lichess.org REST API
- **Icons**: Unicode chess symbols and emojis
- **Fonts**: Inter font family

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## Project Structure

```
lichess-app/
├── src/
│   ├── app/
│   │   ├── profile/page.js      # Profile lookup page
│   │   ├── leaderboards/page.js # Leaderboards page
│   │   ├── tournaments/page.js  # Tournaments page
│   │   ├── layout.js            # Root layout with navigation
│   │   ├── page.js              # Home page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── Navigation.js        # Main navigation component
│   │   └── ErrorBoundary.js     # Error handling components
│   └── services/
│       └── lichessApi.js        # Lichess API service layer
└── tailwind.config.js          # Tailwind configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production

## Features

### Responsive Design
- Mobile-first approach with breakpoints for all devices
- Touch-friendly interface
- Optimized layouts for all screen sizes

### Error Handling
- Comprehensive error handling throughout the application
- User-friendly error messages
- Graceful fallbacks for API failures
- Loading states and retry mechanisms

### Performance
- Next.js App Router for optimal performance
- Client-side rendering for interactive components
- Efficient API request handling


