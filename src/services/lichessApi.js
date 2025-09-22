const LICHESS_API_BASE = 'https://lichess.org/api';

/**
 * Generic function to handle API requests with error handling
 */
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API request failed:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Get user profile information
 * @param {string} username - Lichess username
 */
export async function getUserProfile(username) {
  if (!username || typeof username !== 'string') {
    return { data: null, error: 'Username is required and must be a string' };
  }

  const url = `${LICHESS_API_BASE}/user/${username.trim()}`;
  return await apiRequest(url);
}

/**
 * Get leaderboard data for different game types
 * @param {number} nb - Number of players to fetch (default: 20, max: 200)
 */
export async function getLeaderboards(nb = 20) {
  const gameTypes = ['bullet', 'blitz', 'rapid', 'classical'];
  const leaderboards = {};

  for (const gameType of gameTypes) {
    const url = `${LICHESS_API_BASE}/player/top/${nb}/${gameType}`;
    const result = await apiRequest(url);
    
    if (result.error) {
      leaderboards[gameType] = { users: [], error: result.error };
    } else {
      leaderboards[gameType] = result.data;
    }
  }

  return { data: leaderboards, error: null };
}

/**
 * Get current tournaments
 */
export async function getCurrentTournaments() {
  const url = `${LICHESS_API_BASE}/tournament`;
  return await apiRequest(url);
}

/**
 * Get user statistics
 * @param {string} username - Lichess username
 */
export async function getUserStats(username) {
  if (!username || typeof username !== 'string') {
    return { data: null, error: 'Username is required and must be a string' };
  }

  const url = `${LICHESS_API_BASE}/user/${username.trim()}`;
  const result = await apiRequest(url);
  
  if (result.error) {
    return result;
  }

  // Extract relevant statistics
  const user = result.data;
  return {
    data: {
      username: user.username,
      title: user.title,
      online: user.online,
      playing: user.playing,
      profile: user.profile || {},
      perfs: user.perfs || {},
      count: user.count || {},
      createdAt: user.createdAt,
      seenAt: user.seenAt,
    },
    error: null
  };
}

/**
 * Format rating data for display
 * @param {Object} perfs - Performance ratings object from Lichess API
 */
export function formatRatings(perfs) {
  const gameTypes = ['bullet', 'blitz', 'rapid', 'classical', 'correspondence'];
  const ratings = {};

  gameTypes.forEach(type => {
    if (perfs[type]) {
      ratings[type] = {
        rating: perfs[type].rating,
        games: perfs[type].games,
        rd: perfs[type].rd, // Rating deviation
        prog: perfs[type].prog, // Rating progression
        prov: perfs[type].prov, // Provisional rating
      };
    }
  });

  return ratings;
}

/**
 * Format tournament data for display
 * @param {Object} tournament - Tournament object from Lichess API
 */
export function formatTournament(tournament) {
  return {
    id: tournament.id,
    name: tournament.fullName || tournament.name,
    status: tournament.status,
    nbPlayers: tournament.nbPlayers,
    startsAt: tournament.startsAt,
    finishesAt: tournament.finishesAt,
    perf: tournament.perf,
    rated: tournament.rated,
    variant: tournament.variant,
    position: tournament.position,
    hasMaxRating: tournament.hasMaxRating,
    maxRating: tournament.maxRating,
    minRating: tournament.minRating,
    minRatedGames: tournament.minRatedGames,
    minutes: tournament.minutes,
  };
}