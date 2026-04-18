import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Match, Comment, Reaction, IPL_TEAMS } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, Zap, Trophy, Shield, ChevronLeft, Info, MapPin, Activity } from 'lucide-react';
import { getMatchAnalysis, getFanSentiment } from '../services/gemini';
import { format } from 'date-fns';

export function MatchCenter() {
  const { id } = useParams();
  const { user, signIn } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [newComment, setNewComment] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    // Load Match
    getDoc(doc(db, 'matches', id)).then(docSnap => {
      if (docSnap.exists()) {
        setMatch({ id: docSnap.id, ...docSnap.data() } as Match);
      } else {
        // Fallback for demo
        setMatch({
          id: id,
          team1: 'CSK',
          team2: 'MI',
          venue: 'Wankhede Stadium',
          status: 'live',
          score1: '185/4 (18.2)',
          score2: '192/6 (20)',
          timestamp: new Date().toISOString()
        } as Match);
      }
      setLoading(false);
    });

    // Load Comments
    const qC = query(collection(db, 'matches', id, 'comments'), orderBy('timestamp', 'asc'));
    const unsubC = onSnapshot(qC, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)));
    });

    // Load Reactions
    const qR = query(collection(db, 'matches', id, 'reactions'), orderBy('timestamp', 'desc'));
    const unsubR = onSnapshot(qR, (snap) => {
      setReactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Reaction)));
    });

    return () => { unsubC(); unsubR(); };
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !id) return;

    await addDoc(collection(db, 'matches', id, 'comments'), {
      matchId: id,
      userId: user.uid,
      userName: user.displayName,
      userPhoto: user.photoURL,
      text: newComment,
      timestamp: serverTimestamp()
    });
    setNewComment('');
  };

  const handleReaction = async (type: Reaction['type']) => {
    if (!user || !id) return;
    await addDoc(collection(db, 'matches', id, 'reactions'), {
      matchId: id,
      userId: user.uid,
      type,
      timestamp: serverTimestamp()
    });
  };

  const getAnalysis = async () => {
    if (!match) return;
    const details = `${match.team1} vs ${match.team2}. Current status: ${match.status}. Scores: ${match.score1} & ${match.score2}`;
    const analysis = await getMatchAnalysis(details);
    setAiAnalysis(analysis);
  };

  if (loading) return <div>Loading...</div>;
  if (!match) return <div>Match not found</div>;

  const t1 = IPL_TEAMS.find(t => t.id === match.team1);
  const t2 = IPL_TEAMS.find(t => t.id === match.team2);

  return (
    <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
      {/* Scoreboard / Match Header */}
      <div className="col-span-12 lg:col-span-8 bento-card flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-bento-surface to-black/40">
        <Link to="/" className="absolute top-5 left-5 text-[10px] uppercase font-bold text-bento-text-dim hover:text-bento-yellow transition-colors flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
          <ChevronLeft className="w-3 h-3" /> Back
        </Link>
        <span className="bento-card-label absolute top-5 right-5">Live Match Center</span>

        <div className="flex justify-around items-center w-full max-w-2xl mt-4">
          <div className="flex flex-col items-center gap-2">
            <div className="text-6xl mb-2 logo-glow">{t1?.logo}</div>
            <p className="font-display font-black text-2xl tracking-tighter">{t1?.id}</p>
            <motion.div 
              key={match.score1}
              initial={{ scale: 1.5, color: '#FACC15' }}
              animate={{ scale: 1, color: '#FACC15' }}
              className="text-3xl font-mono font-black"
            >
              {match.score1}
            </motion.div>
          </div>

          <div className="text-center font-display font-black text-4xl italic opacity-10">VS</div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-6xl mb-2 logo-glow">{t2?.logo}</div>
            <p className="font-display font-black text-2xl tracking-tighter">{t2?.id}</p>
            <motion.div 
              key={match.score2}
              initial={{ scale: 1.5, color: '#FACC15' }}
              animate={{ scale: 1, color: '#FACC15' }}
              className="text-3xl font-mono font-black"
            >
              {match.score2}
            </motion.div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="text-sm font-bold bg-white/5 border border-bento-border px-4 py-1.5 rounded-full flex items-center gap-2">
            <MapPin className="w-4 h-4 text-bento-yellow" /> {match.venue}
          </div>
          {match.status === 'live' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-500 rounded text-[10px] font-black animate-pulse border border-red-500/30">
              MATCH LIVE • {match.team1} NEED 42 RUNS
            </div>
          )}
        </div>
      </div>

      {/* Fan Pulse / Live Reactions (Sidebar) */}
      <aside className="col-span-12 lg:col-span-4 bento-card space-y-6">
        <div>
          <span className="bento-card-label">Fan Pulse</span>
          <div className="grid grid-cols-3 gap-2">
            {(['SIX', 'FOUR', 'OUT', 'WICKET', 'CHEER', 'OOPS'] as const).map(type => (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                className="p-3 bg-bento-bg border border-bento-border rounded-xl flex flex-col items-center gap-1 hover:border-bento-yellow transition-all hover:bg-bento-yellow/5"
              >
                <div className="text-xl">
                  {type === 'SIX' ? '🚀' : type === 'FOUR' ? '🏏' : type === 'OUT' ? '☝️' : type === 'WICKET' ? '🎯' : type === 'CHEER' ? '🙌' : '🤦'}
                </div>
                <span className="text-[10px] font-extrabold opacity-60">{type}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-bento-border h-[200px] overflow-y-auto px-1">
          <AnimatePresence>
            {reactions.slice(0, 8).map(r => (
              <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center text-[10px] text-bento-text-dim border-b border-white/5 pb-1">
                <span>Fan reacted <span className="text-bento-yellow">{r.type}</span></span>
                <span>{r.timestamp ? format(r.timestamp.toDate(), 'mm:ss') : ''}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </aside>

      {/* AI Expert Analysis */}
      <section className="col-span-12 lg:col-span-5 bento-card border-l-4 border-bento-yellow min-h-[300px]">
        <div className="flex justify-between items-center mb-6">
          <span className="bento-card-label mb-0">Gemini Expert Sync</span>
          <button onClick={getAnalysis} className="p-1.5 bg-bento-yellow/10 rounded-lg hover:bg-bento-yellow/20 transition-all group">
            <Zap className="w-3 h-3 text-bento-yellow group-hover:scale-110 transition-transform" />
          </button>
        </div>
        
        <div className="relative p-6 bg-bento-bg/50 rounded-2xl border border-bento-border h-[200px] flex items-center justify-center">
          {aiAnalysis ? (
            <p className="text-sm font-medium italic text-bento-text-main leading-relaxed text-center">
              "{aiAnalysis}"
            </p>
          ) : (
            <div className="text-center space-y-2 opacity-30">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <p className="text-[10px] uppercase font-bold tracking-widest">Awaiting Analysis...</p>
            </div>
          )}
        </div>
        <p className="mt-4 text-[10px] text-bento-text-dim">Analysis generated based on real-time stadium data and community mood.</p>
      </section>

      {/* The Dugout Discussion (Chat) */}
      <section className="col-span-12 lg:col-span-7 bento-card flex flex-col grow min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
          <span className="bento-card-label mb-0">The Dugout Discussion</span>
          <span className="text-[10px] font-bold text-bento-blue">{comments.length} Fans in Chat</span>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto h-[300px] pr-2 scrollbar-bento">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img src={comment.userPhoto || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${comment.userId}`} className="w-8 h-8 rounded-lg border border-bento-border" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-bento-blue uppercase italic">{comment.userName}</span>
                  <span className="text-[8px] text-bento-text-dim">{comment.timestamp ? format(comment.timestamp.toDate(), 'HH:mm') : 'now'}</span>
                </div>
                <div className="bg-bento-bg/80 border border-bento-border p-3 rounded-lg text-xs leading-relaxed text-bento-text-main shadow-sm shadow-black/20">
                  {comment.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          {user ? (
            <form onSubmit={handleSendComment} className="flex gap-2 p-1 bg-bento-bg rounded-xl border border-bento-border">
              <input 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Drop a vibe..."
                className="flex-1 bg-transparent border-none text-xs px-3 focus:outline-none"
              />
              <button type="submit" className="p-2 bg-bento-yellow text-bento-bg rounded-lg hover:scale-105 transition-all">
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
             <button onClick={signIn} className="w-full py-2 text-[10px] font-bold text-bento-yellow border border-bento-yellow/20 rounded-lg hover:bg-bento-yellow/5">SIGN IN TO CHAT</button>
          )}
        </div>
      </section>
    </div>
  );
}
