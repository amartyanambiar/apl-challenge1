/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { MatchList } from './components/MatchList';
import { MatchCenter } from './components/MatchCenter';
import { ScoreTicker } from './components/ScoreTicker';
import { useScoreSimulator } from './hooks/useScoreSimulator';
import { IPL_TEAMS } from './types';
import { motion } from 'motion/react';
import { Trophy, Users, Zap } from 'lucide-react';

export default function App() {
  useScoreSimulator(true);

  return (
    <Router>
      <div className="min-h-screen bg-bento-bg flex flex-col">
        <Header />
        <ScoreTicker />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/match/:id" element={<MatchCenter />} />
            <Route path="/dugouts" element={<Dugouts />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>

        <footer className="py-12 border-t border-white/5 bg-black/20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/20 text-xs uppercase tracking-[0.2em] font-bold mb-4">Powered by Gemini AI & Firebase</p>
            <p className="text-white/40 text-[10px]">© 2026 IPL FanConnect. A platform for the ultimate cricket enthusiasts.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Hero / Live Match Highlight */}
      <section className="col-span-12 lg:col-span-8 bento-card min-h-[400px] flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[url('https://picsum.photos/seed/ipl-stadium/1920/1080')] bg-cover bg-center opacity-10" />
        <span className="bento-card-label">Featured Spotlight</span>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none text-bento-yellow">
            FANSPHERE <br /> <span className="text-white">IPL LIVE</span>
          </h1>
          <p className="text-sm md:text-lg text-bento-text-dim max-w-xl mx-auto font-medium">
            Connect with 2.4M fans globally. Experience every wicket, six, and victory in a whole new dimension.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bento-button text-sm">Join the Pulse</button>
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase animate-pulse">
              <Zap className="w-4 h-4" /> Live: Match 34 - Wankhede
            </div>
          </div>
        </motion.div>
      </section>

      {/* Fan Pulse / Community Stats */}
      <section className="col-span-12 lg:col-span-4 bento-card flex flex-col justify-between">
        <span className="bento-card-label">Community Prediction</span>
        <div className="space-y-4">
          <p className="text-sm font-bold">Predicting today's winner:</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-white/5 border border-bento-border rounded-xl">
              <span className="text-sm">Chennai Super Kings</span>
              <span className="text-bento-blue font-bold">68%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 border border-bento-border rounded-xl">
              <span className="text-sm">Mumbai Indians</span>
              <span className="text-bento-blue font-bold">32%</span>
            </div>
          </div>
          <p className="text-[10px] text-bento-text-dim">14,204 fans voting live right now</p>
        </div>
      </section>

      {/* Loyalty Hub */}
      <section className="col-span-12 md:col-span-4 bento-card h-[250px]">
        <span className="bento-card-label">Loyalty Hub</span>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold italic tracking-tight">Level 14 Fan</h3>
          <span className="text-bento-yellow font-bold">2,450 XP</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['🏟️', '🔥', '💬'].map((icon, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 flex flex-col items-center gap-1 border border-transparent hover:border-bento-border transition-colors">
              <span className="text-xl">{icon}</span>
              <span className="text-[8px] uppercase tracking-tighter text-center line-clamp-1">{['Match Reg', '10 Streak', 'Debater'][i]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Insights */}
      <section className="col-span-12 md:col-span-4 bento-card h-[250px]">
        <span className="bento-card-label">Player Watch</span>
        <div className="space-y-3">
          <p className="font-bold text-sm">Ruturaj Gaikwad *</p>
          <div className="space-y-2">
            {[
              { l: 'Runs', v: '64 (42)' },
              { l: 'S/R', v: '152.3' },
              { l: '4s/6s', v: '6 / 2' }
            ].map((s, i) => (
              <div key={i} className="flex justify-between text-xs border-b border-bento-border pb-1">
                <span className="text-bento-text-dim">{s.l}</span>
                <span className="font-bold">{s.v}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-bento-blue pt-2 hover:underline cursor-pointer">View Wagon Wheel &rarr;</p>
        </div>
      </section>

      {/* Top Moment */}
      <section className="col-span-12 md:col-span-4 bento-card h-[250px] overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[url('https://picsum.photos/seed/moment/400/300')] bg-cover bg-center grayscale opacity-20 group-hover:grayscale-0 transition-all duration-500" />
        <span className="bento-card-label">Top Moment</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-bento-yellow rounded-full flex items-center justify-center shadow-lg shadow-bento-yellow/20">
            <Zap className="w-5 h-5 text-bento-bg" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-sm font-bold truncate">Wicket! Bumrah removes Dube</p>
          <p className="text-[10px] text-bento-text-dim">Happened in 13.4 Over</p>
        </div>
      </section>

      {/* Actual Match List */}
      <section className="col-span-12 mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-display font-black text-4xl uppercase tracking-tighter text-white">Match <span className="text-bento-yellow italic">Sync</span></h2>
            <p className="text-bento-text-dim text-sm">Real-time engagement feed</p>
          </div>
          <Link to="/" className="text-bento-yellow text-[10px] font-bold tracking-widest border border-bento-border px-3 py-1 rounded-full hover:bg-white/5 transition-colors">LIVE FEED</Link>
        </div>
        <MatchList />
      </section>
    </div>
  );
}

function Dugouts() {
  return (
    <div className="space-y-12">
       <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-display font-black mb-4 uppercase italic tracking-tighter">Enter Your <span className="text-ipl-gold">Dugout</span></h1>
        <p className="text-white/40 text-lg">Pick your team and join the loyalists. This is where the real strategies are discussed.</p>
      </header>
      
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {IPL_TEAMS.map((team) => (
          <motion.div
            key={team.id}
            whileHover={{ y: -5 }}
            className="ipl-card flex flex-col items-center justify-center p-8 gap-4 group cursor-pointer"
            style={{ borderBottom: `4px solid ${team.color}` }}
          >
            <div className="text-5xl group-hover:scale-125 transition-transform">{team.logo}</div>
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{team.id}</p>
              <h3 className="font-display font-bold text-sm tracking-tight">{team.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Leaderboard() {
  return (
    <div className="flex flex-col items-center justify-center h-[600px] text-center ipl-card">
      <Trophy className="w-16 h-16 text-ipl-gold mb-6 opacity-20" />
      <h2 className="text-3xl font-display font-bold mb-2">FAN LEADERBOARD</h2>
      <p className="text-white/40">Earn points by reacting and the quality of your insights. Coming soon!</p>
    </div>
  );
}

