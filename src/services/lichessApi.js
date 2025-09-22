const LICHESS_API_BASE = "https://lichess.org/api";

/**
 * Generic function to handle API requests with error handling
 */
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
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
    console.error("API request failed:", error);
    return { data: null, error: error.message };
  }
}

/**
 * Get user profile information
 * @param {string} username - Lichess username
 */
export async function getUserProfile(username) {
  if (!username || typeof username !== "string") {
    return { data: null, error: "Username is required and must be a string" };
  }

  const url = `${LICHESS_API_BASE}/user/${username.trim()}`;
  return await apiRequest(url);
}

/**
 * Get leaderboard data for different game types
 * @param {number} nb - Number of players to fetch (default: 20, max: 200)
 */
export async function getLeaderboards(nb = 20) {
  const gameTypes = ["bullet", "blitz", "rapid", "classical"];
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
  if (!username || typeof username !== "string") {
    return { data: null, error: "Username is required and must be a string" };
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
    error: null,
  };
}

/**
 * Format rating data for display
 * @param {Object} perfs - Performance ratings object from Lichess API
 */
export function formatRatings(perfs) {
  if (!perfs || typeof perfs !== "object") {
    return {};
  }

  const gameTypes = ["bullet", "blitz", "rapid", "classical", "correspondence"];
  const ratings = {};

  gameTypes.forEach((type) => {
    if (perfs[type] && typeof perfs[type] === "object") {
      ratings[type] = {
        rating: Number(perfs[type].rating) || 0,
        games: Number(perfs[type].games) || 0,
        rd: Number(perfs[type].rd) || 0, // Rating deviation
        prog: Number(perfs[type].prog) || 0, // Rating progression
        prov: Boolean(perfs[type].prov), // Provisional rating
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
  if (!tournament || typeof tournament !== "object") {
    return null;
  }

  return {
    id: String(tournament.id || ""),
    name: String(tournament.fullName || tournament.name || ""),
    status: String(tournament.status || ""),
    nbPlayers: Number(tournament.nbPlayers) || 0,
    startsAt: tournament.startsAt,
    finishesAt: tournament.finishesAt,
    perf: tournament.perf
      ? {
          key: String(tournament.perf.key || ""),
          name: String(tournament.perf.name || ""),
        }
      : null,
    rated: Boolean(tournament.rated),
    variant: tournament.variant
      ? {
          key: String(tournament.variant.key || ""),
          name: String(tournament.variant.name || ""),
          short: String(tournament.variant.short || ""),
        }
      : null,
    position: tournament.position,
    hasMaxRating: Boolean(tournament.hasMaxRating),
    maxRating: Number(tournament.maxRating) || null,
    minRating: Number(tournament.minRating) || null,
    minRatedGames: Number(tournament.minRatedGames) || null,
    minutes: Number(tournament.minutes) || 0,
  };
}
