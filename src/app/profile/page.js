'use client';

import { useState } from 'react';
import { getUserStats, formatRatings } from '@/services/lichessApi';

export default function ProfilePage() {
  const [username, setUsername] = useState('');
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError(null);
    setUserdata(null);

    const result = await getUserStats(username.trim());
    
    if (result.error) {
      setError(result.error);
    } else {
      setUserdata(result.data);
    }
    
    setLoading(false);
  };

  const formatGameCount = (count) => {
    if (!count) return '0';
    return count.toLocaleString();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString();
  };

  const getRatingColor = (rating) => {
    if (rating >= 2400) return 'text-purple-600 font-bold';
    if (rating >= 2200) return 'text-red-600 font-semibold';
    if (rating >= 2000) return 'text-orange-600 font-semibold';
    if (rating >= 1800) return 'text-yellow-600 font-medium';
    if (rating >= 1600) return 'text-green-600 font-medium';
    return 'text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Lichess Profile Lookup
          </h1>
          <p className="text-lg text-gray-600">
            Search for any Lichess player to view their profile information
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Lichess username..."
              className="flex-1 max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {userdata && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {userdata.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-3xl font-bold flex items-center gap-2">
                    {userdata.username}
                    {userdata.title && (
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
                        {userdata.title}
                      </span>
                    )}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2 text-blue-100">
                    <span className={`inline-flex items-center gap-1 ${userdata.online ? 'text-green-300' : 'text-gray-300'}`}>
                      <div className={`w-2 h-2 rounded-full ${userdata.online ? 'bg-green-300' : 'bg-gray-300'}`}></div>
                      {userdata.online ? 'Online' : 'Offline'}
                    </span>
                    {userdata.playing && (
                      <span className="text-yellow-300">Currently Playing</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Profile Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h3>
                  <div className="space-y-3">
                    {userdata.profile?.bio && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bio</p>
                        <p className="text-gray-900">{userdata.profile.bio}</p>
                      </div>
                    )}
                    {userdata.profile?.firstName && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-gray-900">
                          {userdata.profile.firstName} {userdata.profile.lastName || ''}
                        </p>
                      </div>
                    )}
                    {userdata.profile?.country && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Country</p>
                        <p className="text-gray-900">{userdata.profile.country}</p>
                      </div>
                    )}
                    {userdata.profile?.location && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-gray-900">{userdata.profile.location}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Stats</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Games</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatGameCount(userdata.count?.all)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Wins</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatGameCount(userdata.count?.win)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <p className="text-gray-900">{formatDate(userdata.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Seen</p>
                      <p className="text-gray-900">{formatDate(userdata.seenAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratings Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ratings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(formatRatings(userdata.perfs)).map(([gameType, rating]) => (
                    <div key={gameType} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-700 capitalize">
                          {gameType}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {rating.games} games
                        </span>
                      </div>
                      <div className={`text-2xl font-bold ${getRatingColor(rating.rating)}`}>
                        {rating.rating}
                        {rating.prov && (
                          <span className="text-sm text-gray-500 ml-1">?</span>
                        )}
                      </div>
                      {rating.prog !== undefined && rating.prog !== 0 && (
                        <div className={`text-sm ${rating.prog > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {rating.prog > 0 ? '+' : ''}{rating.prog}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}