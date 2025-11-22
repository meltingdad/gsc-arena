import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { LeaderboardTable } from '@/components/leaderboard-table'
import { Trophy, Github, Twitter } from 'lucide-react'

// Mock data for demonstration
// This will be replaced with real data from Supabase
const mockLeaderboardData = [
  {
    id: '1',
    rank: 1,
    domain: 'example.com',
    clicks: 125430,
    impressions: 3542100,
    ctr: 3.54,
    position: 12.3,
    lastUpdated: new Date('2025-11-22T10:00:00'),
  },
  {
    id: '2',
    rank: 2,
    domain: 'sample-site.io',
    clicks: 98250,
    impressions: 2876540,
    ctr: 3.42,
    position: 15.7,
    lastUpdated: new Date('2025-11-22T09:30:00'),
  },
  {
    id: '3',
    rank: 3,
    domain: 'demo-website.com',
    clicks: 87690,
    impressions: 2543200,
    ctr: 3.45,
    position: 14.2,
    lastUpdated: new Date('2025-11-22T08:45:00'),
  },
  {
    id: '4',
    rank: 4,
    domain: 'test-blog.net',
    clicks: 65420,
    impressions: 1987650,
    ctr: 3.29,
    position: 18.5,
    lastUpdated: new Date('2025-11-22T07:20:00'),
  },
  {
    id: '5',
    rank: 5,
    domain: 'myawesomesite.org',
    clicks: 54320,
    impressions: 1654320,
    ctr: 3.28,
    position: 19.1,
    lastUpdated: new Date('2025-11-22T06:15:00'),
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Add padding for fixed navbar */}
      <div className="pt-16">
        <Hero />
        <HowItWorks />

        {/* Leaderboard Section */}
        <section id="leaderboard" className="py-32 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Section Header */}
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Trophy className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">Live Rankings</span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-black text-white">
                CURRENT <span className="gradient-text">LEADERBOARD</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                Top performers ranked by clicks in the last 28 days
              </p>
            </div>

            {/* Leaderboard */}
            <div className="max-w-7xl mx-auto">
              <LeaderboardTable data={mockLeaderboardData} />
            </div>

            {/* Update Info */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-full backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="font-mono text-xs text-slate-400 uppercase">Auto-Refresh: 24h</span>
                </div>
                <div className="w-px h-4 bg-slate-600" />
                <span className="font-mono text-xs text-slate-500">
                  Last update: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50" />
                    <Trophy className="relative h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <span className="font-display text-lg font-black text-white">GSC</span>
                    <span className="font-display text-lg font-black text-cyan-400 ml-1">ARENA</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                  The competitive platform for website owners to compare Google Search Console metrics globally.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-display font-bold text-white mb-4 uppercase tracking-wider text-sm">
                  Navigate
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#how-it-works" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm font-mono">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="#leaderboard" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm font-mono">
                      Leaderboard
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm font-mono">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm font-mono">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h3 className="font-display font-bold text-white mb-4 uppercase tracking-wider text-sm">
                  Connect
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all hover:glow-cyan"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all hover:glow-cyan"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-500 font-mono">
                  © {new Date().getFullYear()} GSC Arena. All rights reserved.
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-500 font-mono">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
