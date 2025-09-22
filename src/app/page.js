import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      href: '/profile',
      title: 'Profile Lookup',
      description: 'Search for any Lichess player and view their detailed profile, ratings, and statistics.',
      icon: '👤',
      color: 'from-blue-500 to-blue-600',
    },
    {
      href: '/leaderboards',
      title: 'Leaderboards',
      description: 'View top players across different time controls including Bullet, Blitz, Rapid, and Classical.',
      icon: '🏆',
      color: 'from-green-500 to-green-600',
    },
    {
      href: '/tournaments',
      title: 'Tournaments',
      description: 'Discover ongoing and upcoming tournaments on Lichess with detailed information.',
      icon: '⚔️',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-6xl mb-6">♛</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Lichess Explorer
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore the world of online chess through Lichess. Discover player profiles, 
              check leaderboards, and find exciting tournaments to join.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/profile"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search Players
              </Link>
              <Link
                href="/tournaments"
                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                View Tournaments
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Lichess Data
          </h2>
          <p className="text-lg text-gray-600">
            Access comprehensive chess data and statistics from Lichess.org
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative p-8">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  Explore
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powered by Lichess API
            </h2>
            <p className="text-lg text-gray-600">
              Real-time data from the world&apos;s most popular online chess platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50M+</div>
              <div className="text-gray-600">Registered Players</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Live Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-gray-600">Games Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">Free</div>
              <div className="text-gray-600">Forever</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            Built with ❤️ using Next.js and Tailwind CSS
          </p>
          <p className="text-gray-400 mt-2">
            Data provided by{' '}
            <a
              href="https://lichess.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Lichess.org
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}