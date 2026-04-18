import { useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Match } from '../types';

export function useScoreSimulator(active: boolean = true) {
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(async () => {
      const q = query(collection(db, 'matches'));
      const snap = await getDocs(q);
      
      snap.docs.forEach(async (d) => {
        const data = d.data() as Match;
        if (data.status === 'live') {
          // Randomly update score
          let score1 = data.score1 || '0/0';
          if (!score1.includes('/')) score1 = '0/0';
          
          let [runs1, wickets1] = score1.split('/').map(n => parseInt(n) || 0);
          
          const change = Math.floor(Math.random() * 7); // 0-6 runs
          const wicketChance = Math.random() < 0.05; // 5% chance of wicket
          
          let newRuns = runs1 + change;
          let newWickets = wickets1 + (wicketChance ? 1 : 0);
          
          if (newWickets > 10) newWickets = 10;
          
          await updateDoc(doc(db, 'matches', d.id), {
            score1: `${newRuns}/${newWickets}`,
            timestamp: new Date().toISOString()
          });
        }
      });
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [active]);
}
