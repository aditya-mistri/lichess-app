"use client";

import { useState, useEffect } from "react";
import { getLeaderboards } from "@/services/lichessApi";

export default function LeaderboardsPage() {
  const [leaderboards, setLeaderboards] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGameType, setSelectedGameType] = useState("blitz");

  const gameTypes = [
    { key: "bullet", name: "Bullet", description: "< 3 minutes" },
    { key: "blitz", name: "Blitz", description: "3-8 minutes" },
    { key: "rapid", name: "Rapid", description: "8-25 minutes" },
    { key: "classical", name: "Classical", description: "> 25 minutes" },
  ];

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      setError(null);

      const result = await getLeaderboards(20);

      if (result.error) {
        setError(result.error);
      } else {
        setLeaderboards(result.data);
      }

      setLoading(false);
    };

    fetchLeaderboards();
  }, []);

  const getRatingColor = (rating) => {
    if (rating >= 2700) return "text-purple-600 font-bold";
    if (rating >= 2500) return "text-red-600 font-bold";
    if (rating >= 2400) return "text-orange-600 font-semibold";
    if (rating >= 2200) return "text-yellow-600 font-semibold";
    if (rating >= 2000) return "text-green-600 font-medium";
    return "text-blue-600";
  };

  const getTitleColor = (title) => {
    switch (title) {
      case "GM":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "IM":
        return "bg-red-100 text-red-800 border-red-200";
      case "FM":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "CM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "WGM":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "WIM":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "WFM":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "WCM":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Leaderboards
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const currentLeaderboard = leaderboards[selectedGameType];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Lichess Leaderboards
          </h1>
          <p className="text-lg text-gray-600">
            Top players across different time controls
          </p>
        </div>

        {/* Game Type Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {gameTypes.map((gameType) => (
              <button
                key={gameType.key}
                onClick={() => setSelectedGameType(gameType.key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedGameType === gameType.key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div className="font-bold">{gameType.name}</div>
                  <div className="text-xs opacity-75">
                    {gameType.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        {currentLeaderboard && currentLeaderboard.users ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">
                {gameTypes.find((gt) => gt.key === selectedGameType)?.name}{" "}
                Leaderboard
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {currentLeaderboard.users.map((player, index) => {
                const rank = index + 1;
                const rankIcon = getRankIcon(rank);

                return (
                  <div
                    key={player.id || player.username}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      rank <= 3
                        ? "bg-gradient-to-r from-yellow-50 to-yellow-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                          {rankIcon ? (
                            <span className="text-2xl">{rankIcon}</span>
                          ) : (
                            <span className="text-lg font-bold text-gray-600">
                              #{rank}
                            </span>
                          )}
                        </div>

                        {/* Player Info */}
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              {player.username}
                            </h3>
                            {player.title && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold border ${getTitleColor(player.title)}`}
                              >
                                {player.title}
                              </span>
                            )}
                            {player.patron && (
                              <span className="text-yellow-500 text-lg">
                                👑
                              </span>
                            )}
                            {player.online && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-600 font-medium">
                                  Online
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-1">
                            {player.profile?.country && (
                              <span className="text-sm text-gray-500">
                                🌍 {player.profile.country}
                              </span>
                            )}
                            {player.profile?.fideRating && (
                              <span className="text-sm text-gray-500">
                                FIDE: {player.profile.fideRating}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="text-right">
                        <div
                          className={`text-3xl font-bold ${getRatingColor(player.perfs?.[selectedGameType]?.rating || 0)}`}
                        >
                          {player.perfs?.[selectedGameType]?.rating || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {player.perfs?.[selectedGameType]?.games ||
                            player.count?.rated ||
                            0}{" "}
                          games
                        </div>
                        {((player.perfs?.[selectedGameType]?.prog !==
                          undefined &&
                          player.perfs[selectedGameType].prog !== 0) ||
                          (player.perfs?.[selectedGameType]?.progress !==
                            undefined &&
                            player.perfs[selectedGameType].progress !== 0)) && (
                          <div
                            className={`text-sm font-medium ${
                              (player.perfs[selectedGameType].prog ||
                                player.perfs[selectedGameType].progress ||
                                0) > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {(player.perfs[selectedGameType].prog ||
                              player.perfs[selectedGameType].progress ||
                              0) > 0
                              ? "+"
                              : ""}
                            {player.perfs[selectedGameType].prog ||
                              player.perfs[selectedGameType].progress ||
                              0}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600">
              Unable to load leaderboard data for {selectedGameType}.
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data provided by Lichess.org API • Updated in real-time</p>
        </div>
      </div>
    </div>
  );
}
