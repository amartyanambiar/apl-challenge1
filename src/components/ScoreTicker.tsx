import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Match, IPL_TEAMS } from '../types';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export function ScoreTicker() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'matches'), where('status', '==', 'live'));
    const unsub = onSnapshot(q, (snap) => {
      const matches = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
      setLiveMatches(matches);
    });
    return unsub;
  }, []);

  if (liveMatches.length === 0) return null;

  return (
    <div className="w-full bg-bento-yellow overflow-hidden h-8 flex items-center sticky top-16 z-40 border-y border-black/10">
      <div className="bg-black text-[10px] font-black px-4 h-full flex items-center gap-2 shrink-0 z-10 border-r border-white/10 uppercase italic">
        <Zap className="w-3 h-3 text-bento-yellow animate-pulse" fill="currentColor" />
        Live Sync
      </div>
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap gap-12 pl-4"
      >
        {liveMatches.concat(liveMatches).map((match, i) => {
          const t1 = IPL_TEAMS.find(t => t.id === match.team1);
          const t2 = IPL_TEAMS.find(t => t.id === match.team2);
          return (
            <div key={`${match.id}-${i}`} className="flex items-center gap-4 text-xs font-bold text-bento-bg">
              <span className="opacity-60">{t1?.id}</span>
              <span className="font-mono text-sm">{match.score1 || '0/0'}</span>
              <span className="opacity-20 mx-1">v</span>
              <span className="opacity-60">{t2?.id}</span>
              <span className="font-mono text-sm">{match.score2 || '0/0'}</span>
              <span className="mx-2 text-black/20">•</span>
              <span className="text-[10px] text-black/60 uppercase">{match.venue}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
