"use client";

import { useState, useEffect } from "react";
import { getCurrentTournaments, formatTournament } from "@/services/lichessApi";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      setError(null);

      const result = await getCurrentTournaments();

      if (result.error) {
        setError(result.error);
      } else {
        try {
          // Format and filter tournaments with error handling
          const formattedTournaments =
            result.data.created
              ?.map((tournament) => {
                try {
                  return formatTournament(tournament);
                } catch (err) {
                  console.error(
                    "Error formatting tournament:",
                    err.message,
                    "Tournament ID:",
                    tournament?.id
                  );
                  return null;
                }
              })
              .filter(
                (tournament) => tournament && tournament.status !== "finished"
              ) || [];
          setTournaments(formattedTournaments);
        } catch (err) {
          console.error("Error processing tournaments:", err);
          setError("Failed to process tournament data");
        }
      }

      setLoading(false);
    };

    fetchTournaments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "created":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "started":
        return "bg-green-100 text-green-800 border-green-200";
      case "finished":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getVariantColor = (variant) => {
    switch (variant?.key) {
      case "standard":
        return "text-green-600";
      case "chess960":
        return "text-purple-600";
      case "kingOfTheHill":
        return "text-orange-600";
      case "threeCheck":
        return "text-red-600";
      case "antichess":
        return "text-pink-600";
      case "atomic":
        return "text-yellow-600";
      case "horde":
        return "text-indigo-600";
      case "racingKings":
        return "text-blue-600";
      case "crazyhouse":
        return "text-teal-600";
      default:
        return "text-gray-600";
    }
  };

  const formatTimeControl = (minutes) => {
    const mins = Number(minutes) || 0;
    if (mins < 3) return "Bullet";
    if (mins <= 8) return "Blitz";
    if (mins <= 25) return "Rapid";
    return "Classical";
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "TBD";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (minutes) => {
    const mins = Number(minutes) || 0;
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const getTimeUntilStart = (startsAt) => {
    if (!startsAt) return null;
    const now = new Date();
    const start = new Date(startsAt);
    const diff = start - now;

    if (diff <= 0) return "Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `Starts in ${days}d ${hours}h`;
    if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
    return `Starts in ${minutes}m`;
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    if (filter === "all") return true;
    if (filter === "starting-soon") {
      const timeUntil = getTimeUntilStart(tournament.startsAt);
      return timeUntil && timeUntil !== "Started" && timeUntil.includes("m");
    }
    if (filter === "live") return tournament.status === "started";
    if (filter === "upcoming") return tournament.status === "created";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tournaments...</p>
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
            Error Loading Tournaments
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Current Tournaments
          </h1>
          <p className="text-lg text-gray-600">
            Ongoing and upcoming tournaments on Lichess
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {[
              {
                key: "all",
                name: "All Tournaments",
                count: tournaments.length,
              },
              {
                key: "live",
                name: "Live Now",
                count: tournaments.filter((t) => t.status === "started").length,
              },
              {
                key: "upcoming",
                name: "Upcoming",
                count: tournaments.filter((t) => t.status === "created").length,
              },
              {
                key: "starting-soon",
                name: "Starting Soon",
                count: tournaments.filter((t) => {
                  const timeUntil = getTimeUntilStart(t.startsAt);
                  return (
                    timeUntil &&
                    timeUntil !== "Started" &&
                    timeUntil.includes("m")
                  );
                }).length,
              },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === filterOption.key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                {filterOption.name} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tournaments Grid */}
        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => {
              if (!tournament || typeof tournament !== "object") {
                return null;
              }

              const timeUntilStart = getTimeUntilStart(tournament?.startsAt);

              return (
                <div
                  key={tournament?.id || Math.random()}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(tournament?.status)}`}
                      >
                        {tournament?.status === "created"
                          ? "Upcoming"
                          : tournament?.status === "started"
                            ? "Live"
                            : tournament?.status || "Unknown"}
                      </span>
                      {tournament?.rated && (
                        <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                          Rated
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {String(tournament?.name || "Unnamed Tournament")}
                    </h3>

                    <div className="space-y-2 text-sm">
                      {/* Variant and Time Control */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-medium ${getVariantColor(tournament?.variant)}`}
                        >
                          {String(tournament?.variant?.name || "Standard")}
                        </span>
                        <span className="text-gray-600">
                          {formatTimeControl(Number(tournament?.minutes) || 0)}
                        </span>
                      </div>

                      {/* Players */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Players:</span>
                        <span className="font-medium text-blue-600">
                          {Number(tournament?.nbPlayers || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {formatDuration(Number(tournament?.minutes) || 0)}
                        </span>
                      </div>

                      {/* Rating Restrictions */}
                      {(tournament?.minRating || tournament?.maxRating) && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <span className="font-medium">
                            {Number(tournament?.minRating) || 0} -{" "}
                            {tournament?.maxRating
                              ? Number(tournament.maxRating)
                              : "∞"}
                          </span>
                        </div>
                      )}

                      {/* Start Time */}
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">
                          {tournament?.status === "started"
                            ? "Started"
                            : "Starts"}
                          :
                        </div>
                        <div className="font-medium">
                          {formatDateTime(tournament?.startsAt)}
                        </div>
                        {timeUntilStart && timeUntilStart !== "Started" && (
                          <div className="text-xs text-blue-600 font-medium mt-1">
                            {String(timeUntilStart)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                      <a
                        href={`https://lichess.org/tournament/${tournament?.id || ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                          tournament?.status === "started"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {tournament?.status === "started"
                          ? "Join Live"
                          : "View Details"}
                        <span className="ml-2">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Tournaments Found
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "No tournaments are currently available."
                : `No tournaments match the "${filter}" filter.`}
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Data provided by Lichess.org API • Click on tournaments to join on
            Lichess
          </p>
        </div>
      </div>
    </div>
  );
}
