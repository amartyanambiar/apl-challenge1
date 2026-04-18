import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Match, IPL_TEAMS } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, ChevronRight, Activity } from 'lucide-react';
import { format } from 'date-fns';

// Mock matches if DB is empty
const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    team1: 'CSK',
    team2: 'MI',
    venue: 'Wankhede Stadium, Mumbai',
    status: 'live',
    score1: '185/4 (18.2)',
    score2: '192/6 (20)',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm2',
    team1: 'RCB',
    team2: 'KKR',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    status: 'upcoming',
    timestamp: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'm3',
    team1: 'GT',
    team2: 'RR',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    status: 'finished',
    score1: '168/7 (20)',
    score2: '172/3 (19.1)',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    aiSummary: "A masterclass chase by RR! Samson's clinical 50 set the tone, while GT's bowling struggled to defend a modest total. The power-hitting toward the finish was pure class."
  }
];

export function MatchList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'matches'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        return { ...data, id: doc.id } as Match;
      });
      if (docs.length === 0) {
        setMatches(MOCK_MATCHES);
      } else {
        setMatches(docs);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ipl-gold"></div>
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match, idx) => (
        <div key={match.id}>
          <MatchCard match={match} index={idx} />
        </div>
      ))}
    </div>
  );
}

function MatchCard({ match, index }: { match: Match, index: number }) {
  const t1 = IPL_TEAMS.find(t => t.id === match.team1);
  const t2 = IPL_TEAMS.find(t => t.id === match.team2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bento-card group hover:border-bento-yellow/50 transition-colors h-full"
    >
      <Link to={`/match/${match.id}`} className="block h-full">
        <span className="bento-card-label">Match Center</span>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border border-bento-border flex items-center justify-center text-2xl bg-bento-bg">
              {t1?.logo}
            </div>
            <span className="text-xs font-bold">{t1?.id}</span>
          </div>

          <div className="flex flex-col items-center">
            {match.status === 'live' ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-600 rounded text-[8px] font-extrabold animate-pulse mb-1">
                LIVE
              </div>
            ) : (
              <div className="text-[10px] text-bento-text-dim mb-1 font-bold">VS</div>
            )}
            <motion.div 
              key={match.score1}
              initial={{ scale: 1.2, color: '#FACC15' }}
              animate={{ scale: 1, color: '#F1F5F9' }}
              className="text-xl font-black font-mono tracking-tighter"
            >
              {match.score1 || '0/0'}
            </motion.div>
            <motion.div 
              key={match.score2}
              initial={{ scale: 1.2, color: '#FACC15' }}
              animate={{ scale: 1, color: '#94A3B8' }}
              className="text-xl font-black font-mono tracking-tighter text-bento-text-dim"
            >
              {match.score2 || '0/0'}
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border border-bento-border flex items-center justify-center text-2xl bg-bento-bg">
              {t2?.logo}
            </div>
            <span className="text-xs font-bold">{t2?.id}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] text-bento-yellow font-bold uppercase tracking-tight flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {match.venue}
          </div>
          <div className="text-[10px] text-bento-text-dim flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {format(new Date(match.timestamp), 'MMM dd, HH:mm')}
          </div>
        </div>

        {match.aiSummary && (
          <div className="mt-4 p-3 bg-bento-bg/50 rounded-xl border border-bento-border border-dashed">
            <p className="text-[11px] text-bento-text-dim italic line-clamp-2 leading-relaxed">
              "{match.aiSummary}"
            </p>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
