import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Trophy, Users, LogIn, LogOut, User } from 'lucide-react';
import { cn } from '../lib/utils';

export function Header() {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="h-16 px-8 border-bottom border-bento-border bg-bento-surface/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="font-black text-xl tracking-wider text-bento-yellow flex items-center gap-2">
        <Trophy className="w-6 h-6" />
        FANSPHERE IPL
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link to="/" className="text-bento-text-main hover:text-bento-yellow transition-colors">Discover</Link>
        <Link to="/dugouts" className="text-bento-text-main hover:text-bento-yellow transition-colors">Squads</Link>
        <Link to="/leaderboard" className="text-bento-yellow font-bold transition-colors">FanPulse</Link>
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-bold text-bento-text-main leading-none uppercase tracking-wide">{user.displayName}</p>
              <p className="text-[10px] text-bento-text-dim">Level 14 Fan</p>
            </div>
            <Link to="/profile">
              <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-lg border border-bento-border" referrerPolicy="no-referrer" />
            </Link>
            <button 
              onClick={() => signOut()}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-bento-text-dim hover:text-bento-text-main"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => signIn()}
            className="bento-button flex items-center gap-2 text-sm"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
