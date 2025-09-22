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
 * @param {boolean} includeGameCounts - Whether to fetch detailed user data for game counts (default: true)
 */
export async function getLeaderboards(nb = 20, includeGameCounts = true) {
  const gameTypes = ["bullet", "blitz", "rapid", "classical"];
  const leaderboards = {};

  for (const gameType of gameTypes) {
    const url = `${LICHESS_API_BASE}/player/top/${nb}/${gameType}`;
    const result = await apiRequest(url);

    if (result.error) {
      leaderboards[gameType] = { users: [], error: result.error };
      continue;
    }

    // If we want to include game counts, fetch detailed user data
    if (includeGameCounts && result.data.users) {
      const enhancedUsers = [];

      // Fetch detailed data for each user (limited to avoid too many requests)
      for (const user of result.data.users.slice(0, Math.min(nb, 50))) {
        try {
          const userResult = await getUserProfile(user.username);
          if (userResult.data) {
            // Merge the leaderboard data with the detailed user data
            enhancedUsers.push({
              ...user,
              ...userResult.data,
              // Keep the leaderboard-specific performance data (it might be more up-to-date)
              perfs: {
                ...userResult.data.perfs,
                [gameType]: {
                  ...userResult.data.perfs?.[gameType],
                  // Preserve leaderboard rating and progress if available
                  ...(user.perfs?.[gameType] || {}),
                },
              },
            });
          } else {
            // If user profile fetch fails, keep the original leaderboard data
            enhancedUsers.push(user);
          }
        } catch (error) {
          console.warn(`Failed to fetch profile for ${user.username}:`, error);
          // If user profile fetch fails, keep the original leaderboard data
          enhancedUsers.push(user);
        }
      }

      leaderboards[gameType] = {
        ...result.data,
        users: enhancedUsers,
      };
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

  // Map numeric status codes to string status
  const getStatusString = (statusCode) => {
    switch (statusCode) {
      case 10:
        return "created";
      case 20:
        return "started";
      case 30:
        return "finished";
      default:
        return "unknown";
    }
  };

  return {
    id: String(tournament.id || ""),
    name: String(tournament.fullName || tournament.name || ""),
    status: getStatusString(tournament.status),
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
    // Handle the nested rating object structure
    maxRating: tournament.maxRating?.rating
      ? Number(tournament.maxRating.rating)
      : null,
    minRating: tournament.minRating?.rating
      ? Number(tournament.minRating.rating)
      : null,
    // Handle the nested minRatedGames object structure
    minRatedGames: tournament.minRatedGames?.nb
      ? Number(tournament.minRatedGames.nb)
      : null,
    minutes: Number(tournament.minutes) || 0,
    // Add clock information for better time control calculation
    clock: tournament.clock
      ? {
          limit: Number(tournament.clock.limit) || 0,
          increment: Number(tournament.clock.increment) || 0,
        }
      : null,
  };
}
